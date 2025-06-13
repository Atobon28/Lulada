// services/firebase/Authservice.ts - CORREGIDO
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User 
} from 'firebase/auth';
import { Auth } from './firebase';
import { firebaseUserSync } from './FirebaseUserSync';
import { UserData } from '../flux/UserActions';

// Interfaces para respuestas de autenticación
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

// Función auxiliar para identificar errores de Firebase
function isFirebaseError(error: unknown): error is { code: string; message: string } {
  return typeof error === 'object' && error !== null && 'code' in error && 'message' in error;
}

// Función para obtener mensajes de error amigables
function getFirebaseErrorMessage(error: { code: string; message: string }): string {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Este correo electrónico ya está registrado. Intenta iniciar sesión.';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.';
    case 'auth/invalid-email':
      return 'El formato del correo electrónico no es válido.';
    case 'auth/user-not-found':
      return 'No se encontró una cuenta con este correo electrónico.';
    case 'auth/wrong-password':
      return 'La contraseña es incorrecta.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos fallidos. Intenta de nuevo más tarde.';
    case 'auth/network-request-failed':
      return 'Error de conexión. Verifica tu conexión a internet.';
    default:
      return error.message || 'Error inesperado. Intenta de nuevo.';
  }
}

// Función para registrar un nuevo usuario - ACTUALIZADA
export const registerUser = async (
  email: string, 
  password: string, 
  userData: UserData
): Promise<AuthResponse> => {
  try {
    console.log("[FirebaseAuth] Registrando usuario:", email);
    
    // Validaciones básicas
    if (!email || !password || !userData) {
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

    console.log("[FirebaseAuth] Usuario creado en Firebase Auth:", user.uid);

    // Crear el UserData para Flux con todos los campos necesarios
    const fluxUserData: UserData = {
      foto: userData.foto || "https://randomuser.me/api/portraits/women/44.jpg",
      nombreDeUsuario: userData.nombreDeUsuario || `@${email.split('@')[0]}`,
      nombre: userData.nombre || user.displayName || email.split('@')[0] || 'Usuario',
      descripcion: userData.descripcion || "Usuario de Lulada",
      locationText: userData.locationText || "",
      menuLink: userData.menuLink || "",
      rol: userData.rol || 'persona'
    };

    // Crear perfil en Firestore usando el servicio de sincronización
    console.log("[FirebaseAuth] Creando perfil en Firestore...");
    const syncResult = await firebaseUserSync.createUserProfile(user, fluxUserData);
    
    if (!syncResult.success) {
      console.warn("[FirebaseAuth] Error creando perfil en Firestore:", syncResult.error);
      // No retornamos error aquí porque el usuario ya fue creado en Auth
      return { 
        success: true, 
        user, 
        userData: fluxUserData,
        error: "Usuario creado pero hubo un problema guardando el perfil. Intenta de nuevo." 
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
export const debugFirebaseAuth = (): void => {
  console.log("🔥 === FIREBASE AUTH DEBUG ===");
  console.log("- Usuario actual:", Auth.currentUser?.email || "No autenticado");
  console.log("- UID:", Auth.currentUser?.uid || "N/A");
  console.log("- Email verificado:", Auth.currentUser?.emailVerified || false);
  console.log("- Proveedor:", Auth.currentUser?.providerId || "N/A");
  console.log("- Último login:", Auth.currentUser?.metadata.lastSignInTime || "N/A");
  console.log("- Cuenta creada:", Auth.currentUser?.metadata.creationTime || "N/A");
  console.log("=== FIN FIREBASE AUTH DEBUG ===");
};

// Interfaz para propiedades de debug en window
interface WindowWithDebug extends Window {
  debugFirebaseAuth?: () => void;
}

// Agregar funciones de debug al objeto global
if (typeof window !== 'undefined') {
  (window as WindowWithDebug).debugFirebaseAuth = debugFirebaseAuth;
}