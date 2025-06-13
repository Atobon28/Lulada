// src/Services/firebase/Authservice.ts - ACTUALIZADO CON CREACIÓN DE PERFIL
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User,
  AuthError
} from 'firebase/auth';

import { Auth, db, doc, setDoc, getDoc, updateDoc } from './firebase';
import { UserData } from '../flux/UserActions';
import { firebaseUserSync } from './FirebaseUserSync';

// Interfaces
export interface RegisterUserData {
  email: string;
  firstName: string;
  lastName: string;
  userType: 'person' | 'restaurant';
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  userData?: UserData;
  error?: string;
}

export interface LogoutResponse {
  success: boolean;
  error?: string;
}

// Interfaz para datos de Firestore
interface FirestoreUserData {
  email: string;
  firstName: string;
  lastName: string;
  userType: 'person' | 'restaurant';
  createdAt: Date;
  displayName?: string;
  name?: string;
  [key: string]: unknown;
}

// Interfaz para window con propiedades de debug
interface WindowWithDebug extends Window {
  debugFirebaseAuth?: () => void;
}

// Type guards
function isFirebaseError(error: unknown): error is AuthError {
  return error !== null && 
         typeof error === 'object' && 
         'code' in error && 
         typeof (error as AuthError).code === 'string' && 
         (error as AuthError).code.startsWith('auth/');
}

function isValidUserData(data: unknown): data is UserData {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  const obj = data as Record<string, unknown>;
  
  return typeof obj.email === 'string' && 
         typeof obj.firstName === 'string' && 
         typeof obj.lastName === 'string' && 
         (obj.userType === 'person' || obj.userType === 'restaurant');
}

// Mapeo de errores Firebase a mensajes amigables
function getFirebaseErrorMessage(error: AuthError): string {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "Este correo ya está registrado. Intenta iniciar sesión";
    case "auth/invalid-email":
      return "Formato de correo inválido";
    case "auth/operation-not-allowed":
      return "Operación no permitida";
    case "auth/weak-password":
      return "La contraseña es muy débil. Usa al menos 6 caracteres";
    case "auth/user-disabled":
      return "Esta cuenta ha sido deshabilitada";
    case "auth/user-not-found":
      return "No existe una cuenta con este correo";
    case "auth/wrong-password":
      return "Contraseña incorrecta";
    case "auth/invalid-credential":
      return "Credenciales inválidas. Verifica tu correo y contraseña";
    case "auth/too-many-requests":
      return "Demasiados intentos fallidos. Intenta más tarde";
    case "auth/network-request-failed":
      return "Error de conexión. Verifica tu internet";
    default:
      return error.message || "Error desconocido";
  }
}

// Función para registrar usuario - ACTUALIZADA
export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  userType: 'person' | 'restaurant'
): Promise<AuthResponse> => {
  try {
    console.log("[FirebaseAuth] Iniciando registro para:", email);
    
    // Validaciones básicas
    if (!email || !password || !firstName || !lastName) {
      return { success: false, error: "Todos los campos son requeridos" };
    }

    if (password.length < 6) {
      return { success: false, error: "La contraseña debe tener al menos 6 caracteres" };
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Formato de correo inválido" };
    }
    
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      Auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("[FirebaseAuth] Usuario creado en Auth:", user.uid);

    // Crear datos compatibles con el sistema Flux
    const fluxUserData: UserData = {
      foto: "https://randomuser.me/api/portraits/women/44.jpg", // Foto por defecto
      nombreDeUsuario: `@${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      nombre: `${firstName} ${lastName}`,
      descripcion: userType === 'person' ? 
        "Nuevo usuario de Lulada" : 
        "Nuevo restaurante en Lulada",
      rol: userType === 'person' ? 'persona' : 'restaurante'
    };

    // Crear perfil en Firestore usando el servicio de sincronización
    console.log("[FirebaseAuth] Creando perfil en Firestore...");
    const createProfileResult = await firebaseUserSync.createUserProfile(user, fluxUserData);
    
    if (!createProfileResult.success) {
      console.error("[FirebaseAuth] Error creando perfil:", createProfileResult.error);
      // Intentar eliminar el usuario de Auth si falló la creación del perfil
      try {
        await user.delete();
      } catch (deleteError) {
        console.error("[FirebaseAuth] Error eliminando usuario tras fallo:", deleteError);
      }
      return { 
        success: false, 
        error: "Error creando el perfil. Intenta de nuevo." 
      };
    }

    console.log("[FirebaseAuth] ✅ Usuario registrado exitosamente con perfil completo");

    return { 
      success: true, 
      user, 
      userData: fluxUserData 
    };

  } catch (error: unknown) {
    console.error("[FirebaseAuth] ❌ Error al registrar usuario:", error);
    
    if (isFirebaseError(error)) {
      const errorMessage = getFirebaseErrorMessage(error);
      return { success: false, error: errorMessage };
    }
    
    return { 
      success: false, 
      error: "Error inesperado al registrar usuario. Intenta de nuevo." 
    };
  }
};

// Función para iniciar sesión - ACTUALIZADA
export const loginUser = async (
  email: string, 
  password: string
): Promise<AuthResponse> => {
  try {
    console.log("[FirebaseAuth] Iniciando sesión para:", email);
    
    // Validaciones básicas
    if (!email || !password) {
      return { success: false, error: "Email y contraseña son requeridos" };
    }
    
    // Autenticar con Firebase
    const userCredential = await signInWithEmailAndPassword(
      Auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("[FirebaseAuth] Usuario autenticado:", user.uid);

    // Obtener perfil desde Firestore usando el servicio de sincronización
    console.log("[FirebaseAuth] Obteniendo perfil desde Firestore...");
    const profileResult = await firebaseUserSync.getUserProfile(user.uid);
    
    if (profileResult.success && profileResult.userData) {
      console.log("[FirebaseAuth] ✅ Perfil obtenido exitosamente");
      return { 
        success: true, 
        user, 
        userData: profileResult.userData 
      };
    } else {
      console.warn("[FirebaseAuth] No se pudo obtener el perfil:", profileResult.error);
      
      // Crear perfil por defecto si no existe
      const defaultUserData: UserData = {
        foto: "https://randomuser.me/api/portraits/women/44.jpg",
        nombreDeUsuario: `@${user.email?.split('@')[0] || 'usuario'}`,
        nombre: user.displayName || user.email?.split('@')[0] || 'Usuario',
        descripcion: "Usuario de Lulada",
        rol: 'persona'
      };

      const createResult = await firebaseUserSync.createUserProfile(user, defaultUserData);
      
      if (createResult.success) {
        console.log("[FirebaseAuth] ✅ Perfil por defecto creado");
        return { 
          success: true, 
          user, 
          userData: defaultUserData 
        };
      } else {
        console.error("[FirebaseAuth] Error creando perfil por defecto:", createResult.error);
        // Aún así retornamos éxito con datos básicos
        return { 
          success: true, 
          user, 
          userData: defaultUserData 
        };
      }
    }

  } catch (error: unknown) {
    console.error("[FirebaseAuth] ❌ Error al iniciar sesión:", error);
    
    if (isFirebaseError(error)) {
      const errorMessage = getFirebaseErrorMessage(error);
      return { success: false, error: errorMessage };
    }
    
    return { 
      success: false, 
      error: "Error inesperado al iniciar sesión. Intenta de nuevo." 
    };
  }
};

// Función para cerrar sesión
export const logoutUser = async (): Promise<LogoutResponse> => {
  try {
    await signOut(Auth);
    console.log("[FirebaseAuth] ✅ Sesión cerrada exitosamente");
    
    // Limpiar localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    
    return { success: true };
    
  } catch (error: unknown) {
    console.error("[FirebaseAuth] ❌ Error al cerrar sesión:", error);
    
    if (isFirebaseError(error)) {
      const errorMessage = getFirebaseErrorMessage(error);
      return { success: false, error: errorMessage };
    }
    
    return { 
      success: false, 
      error: "Error inesperado al cerrar sesión" 
    };
  }
};

// Función para obtener datos del usuario desde Firestore
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const result = await firebaseUserSync.getUserProfile(uid);
    return result.success ? result.userData || null : null;
  } catch (error: unknown) {
    console.error("[FirebaseAuth] Error obteniendo datos del usuario:", error);
    return null;
  }
};

// Función para obtener el usuario actual
export const getCurrentUser = (): User | null => {
  return Auth.currentUser;
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
  return !!Auth.currentUser;
};

// Función para escuchar cambios en el estado de autenticación
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return Auth.onAuthStateChanged(callback);
};

// Funciones de utilidad para desarrollo/testing
export const debugFirebaseAuth = () => {
  console.log("🔥 === FIREBASE AUTH DEBUG ===");
  console.log("- Usuario actual:", Auth.currentUser?.email || "No autenticado");
  console.log("- UID:", Auth.currentUser?.uid || "N/A");
  console.log("- Email verificado:", Auth.currentUser?.emailVerified || false);
  console.log("- Proveedor:", Auth.currentUser?.providerId || "N/A");
  console.log("- Último login:", Auth.currentUser?.metadata.lastSignInTime || "N/A");
  console.log("- Cuenta creada:", Auth.currentUser?.metadata.creationTime || "N/A");
  console.log("=== FIN FIREBASE AUTH DEBUG ===");
};

// Agregar funciones de debug al objeto global
if (typeof window !== 'undefined') {
  (window as WindowWithDebug).debugFirebaseAuth = debugFirebaseAuth;
}