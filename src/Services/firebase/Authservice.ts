import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User, signOut, onAuthStateChanged } from "firebase/auth";
import { Auth, db } from "./firebase";
import { doc, setDoc, getDoc, DocumentData } from "firebase/firestore";

// Tipos específicos para Firebase Auth errors
interface FirebaseError extends Error {
  code: string;
  message: string;
}

// Tipos para las respuestas
interface AuthResponse {
  success: boolean;
  user?: User;
  userData?: UserData;
  error?: string;
}

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  userType: 'person' | 'restaurant';
  createdAt: Date;
}

interface GetUserDataResponse {
  success: boolean;
  data?: DocumentData;
  error?: string | FirebaseError;
}

interface LogoutResponse {
  success: boolean;
  error?: FirebaseError;
}

// Type guard para verificar si es un error de Firebase
function isFirebaseError(error: unknown): error is FirebaseError {
  return typeof error === 'object' && error !== null && 'code' in error && 'message' in error;
}

// Type guard para verificar si los datos del usuario son válidos
function isValidUserData(data: DocumentData | undefined): data is UserData {
  if (!data) return false;
  
  return (
    typeof data.email === 'string' &&
    typeof data.firstName === 'string' &&
    typeof data.lastName === 'string' &&
    (data.userType === 'person' || data.userType === 'restaurant') &&
    data.createdAt instanceof Date
  );
}

// Función para obtener mensaje de error específico de Firebase Auth
function getFirebaseErrorMessage(error: FirebaseError): string {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "Este correo ya está registrado";
    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres";
    case "auth/invalid-email":
      return "El correo electrónico no es válido";
    case "auth/user-not-found":
      return "Usuario no encontrado";
    case "auth/wrong-password":
      return "Contraseña incorrecta";
    case "auth/too-many-requests":
      return "Demasiados intentos fallidos. Intenta más tarde";
    case "auth/invalid-credential":
      return "Credenciales inválidas. Verifica tu correo y contraseña";
    case "auth/network-request-failed":
      return "Error de conexión. Verifica tu internet";
    case "auth/operation-not-allowed":
      return "Operación no permitida";
    case "auth/user-disabled":
      return "Esta cuenta ha sido deshabilitada";
    default:
      return error.message || "Error desconocido";
  }
}

// Función para registrar usuario en Lulada
export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  userType: 'person' | 'restaurant'
): Promise<AuthResponse> => {
  try {
    console.log("Registrando usuario:", email);
    
    // Validaciones básicas
    if (!email || !password || !firstName || !lastName) {
      return { success: false, error: "Todos los campos son requeridos" };
    }

    if (password.length < 6) {
      return { success: false, error: "La contraseña debe tener al menos 6 caracteres" };
    }
    
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      Auth,
      email,
      password
    );
    const user = userCredential.user;

    // Guardar información adicional en Firestore
    const userData: UserData = {
      email,
      firstName,
      lastName,
      userType,
      createdAt: new Date(),
    };

    await setDoc(doc(db, "users", user.uid), userData);

    console.log("Usuario registrado exitosamente:", user.uid);

    return { success: true, user, userData };
  } catch (error: unknown) {
    console.error("Error al registrar usuario:", error);
    
    if (isFirebaseError(error)) {
      const errorMessage = getFirebaseErrorMessage(error);
      return { success: false, error: errorMessage };
    }
    
    return { success: false, error: "Error al registrar usuario" };
  }
};

// Función para iniciar sesión
export const loginUser = async (
  email: string, 
  password: string
): Promise<AuthResponse> => {
  try {
    console.log("Iniciando sesión:", email);
    
    // Validaciones básicas
    if (!email || !password) {
      return { success: false, error: "Email y contraseña son requeridos" };
    }
    
    const userCredential = await signInWithEmailAndPassword(
      Auth,
      email,
      password
    );
    const user = userCredential.user;

    // Obtener información adicional del usuario desde Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();

    console.log("Usuario autenticado exitosamente:", user.uid);

    // Validar que los datos del usuario sean correctos
    if (userData && isValidUserData(userData)) {
      return { success: true, user, userData };
    } else {
      // Usuario existe en Auth pero no en Firestore o datos incompletos
      console.warn("Usuario sin datos completos en Firestore");
      return { success: true, user, userData: undefined };
    }
  } catch (error: unknown) {
    console.error("Error al iniciar sesión:", error);
    
    if (isFirebaseError(error)) {
      const errorMessage = getFirebaseErrorMessage(error);
      return { success: false, error: errorMessage };
    }
    
    return { success: false, error: "Error al iniciar sesión" };
  }
};

// Función para cerrar sesión
export const logoutUser = async (): Promise<LogoutResponse> => {
  try {
    await signOut(Auth);
    console.log("Sesión cerrada exitosamente");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error al cerrar sesión:", error);
    
    if (isFirebaseError(error)) {
      return { success: false, error };
    }
    
    const genericError: FirebaseError = {
      name: 'AuthError',
      code: 'auth/unknown-error',
      message: 'Error desconocido al cerrar sesión'
    };
    
    return { success: false, error: genericError };
  }
};

// Función para verificar el estado de autenticación
export const checkAuthState = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(Auth, (user: User | null) => {
    if (user) {
      console.log("Usuario autenticado detectado:", user.uid);
    } else {
      console.log("No hay usuario autenticado");
    }
    callback(user);
  });
};

// Función para obtener el usuario actual
export const getCurrentUser = (): User | null => {
  return Auth.currentUser;
};

// Función para obtener datos del usuario desde Firestore
export const getUserData = async (userId: string): Promise<GetUserDataResponse> => {
  try {
    if (!userId) {
      return { success: false, error: "ID de usuario requerido" };
    }

    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return { success: true, data };
    } else {
      return { success: false, error: "Usuario no encontrado" };
    }
  } catch (error: unknown) {
    console.error("Error al obtener datos del usuario:", error);
    
    if (isFirebaseError(error)) {
      return { success: false, error };
    }
    
    return { success: false, error: "Error desconocido al obtener datos del usuario" };
  }
};

// Función para validar email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Función para validar password
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Función para validar que el usuario esté autenticado
export const requireAuth = (): User | null => {
  const user = getCurrentUser();
  if (!user) {
    console.warn("Operación requiere autenticación");
    return null;
  }
  return user;
};

// Función para obtener información básica del usuario actual
export const getCurrentUserInfo = async (): Promise<{
  user: User | null;
  userData: UserData | null;
  isAuthenticated: boolean;
}> => {
  const user = getCurrentUser();
  
  if (!user) {
    return {
      user: null,
      userData: null,
      isAuthenticated: false
    };
  }

  try {
    const userDataResponse = await getUserData(user.uid);
    
    if (userDataResponse.success && userDataResponse.data && isValidUserData(userDataResponse.data)) {
      return {
        user,
        userData: userDataResponse.data,
        isAuthenticated: true
      };
    }
  } catch (error) {
    console.error("Error obteniendo datos del usuario actual:", error);
  }

  return {
    user,
    userData: null,
    isAuthenticated: true
  };
};