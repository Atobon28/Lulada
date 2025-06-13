import { Auth, db, doc, setDoc, getDoc } from './firebase';
import { updateDoc } from 'firebase/firestore';
import { UserData } from '../flux/UserActions';
import { User } from 'firebase/auth';

// Interfaz para datos específicos de Firebase
interface FirebaseUserData {
    uid: string;
    email: string;
    nombre: string;
    nombreDeUsuario: string;
    descripcion: string;
    foto: string;
    rol: string;
    locationText?: string;
    menuLink?: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: string | undefined;
}

// Clase principal para sincronización con Firebase
export class FirebaseUserSync {
    private static instance: FirebaseUserSync;
    
    private constructor() {}
    
    public static getInstance(): FirebaseUserSync {
        if (!FirebaseUserSync.instance) {
            FirebaseUserSync.instance = new FirebaseUserSync();
        }
        return FirebaseUserSync.instance;
    }

    /**
     * Guarda/actualiza el perfil del usuario en Firestore
     */
    public async updateUserProfile(userData: UserData): Promise<{ success: boolean; error?: string }> {
        try {
            const currentUser = Auth.currentUser;
            if (!currentUser) {
                return { success: false, error: 'Usuario no autenticado' };
            }

            console.log('[FirebaseSync] Actualizando perfil en Firestore para:', currentUser.uid);

            // Preparar datos para Firestore - SOLO campos definidos
            const firebaseData: Partial<FirebaseUserData> = {
                uid: currentUser.uid,
                email: currentUser.email || '',
                nombre: userData.nombre,
                nombreDeUsuario: userData.nombreDeUsuario,
                descripcion: userData.descripcion,
                foto: userData.foto,
                rol: userData.rol,
                updatedAt: new Date().toISOString()
            };

            // Solo agregar campos opcionales si están definidos
            if (userData.locationText) {
                firebaseData.locationText = userData.locationText;
            }
            
            if (userData.menuLink) {
                firebaseData.menuLink = userData.menuLink;
            }

            // Actualizar documento en Firestore
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, firebaseData);

            console.log('[FirebaseSync] ✅ Perfil actualizado exitosamente en Firestore');
            return { success: true };

        } catch (error) {
            console.error('[FirebaseSync] ❌ Error actualizando perfil:', error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            };
        }
    }

    /**
     * Crea el perfil inicial del usuario en Firestore
     */
    public async createUserProfile(user: User, userData: UserData): Promise<{ success: boolean; error?: string }> {
        try {
            console.log('[FirebaseSync] Creando perfil inicial en Firestore para:', user.uid);

            const firebaseData: FirebaseUserData = {
                uid: user.uid,
                email: user.email || '',
                nombre: userData.nombre,
                nombreDeUsuario: userData.nombreDeUsuario,
                descripcion: userData.descripcion,
                foto: userData.foto,
                rol: userData.rol,
                locationText: userData.locationText || '',
                menuLink: userData.menuLink || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Crear documento en Firestore
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, firebaseData);

            console.log('[FirebaseSync] ✅ Perfil inicial creado exitosamente en Firestore');
            return { success: true };

        } catch (error) {
            console.error('[FirebaseSync] ❌ Error creando perfil inicial:', error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            };
        }
    }

    /**
     * Obtiene el perfil del usuario desde Firestore
     */
    public async getUserProfile(uid: string): Promise<{ success: boolean; userData?: UserData; error?: string }> {
        try {
            console.log('[FirebaseSync] Obteniendo perfil desde Firestore para:', uid);

            const userDocRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                return { success: false, error: 'Perfil no encontrado en Firestore' };
            }

            const firebaseData = userDoc.data() as FirebaseUserData;
            
            // Convertir datos de Firebase a formato Flux
            const userData: UserData = {
                foto: firebaseData.foto,
                nombreDeUsuario: firebaseData.nombreDeUsuario,
                nombre: firebaseData.nombre,
                descripcion: firebaseData.descripcion,
                rol: firebaseData.rol,
                locationText: firebaseData.locationText || undefined,
                menuLink: firebaseData.menuLink || undefined
            };

            console.log('[FirebaseSync] ✅ Perfil obtenido exitosamente desde Firestore');
            return { success: true, userData };

        } catch (error) {
            console.error('[FirebaseSync] ❌ Error obteniendo perfil:', error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            };
        }
    }

    /**
     * Verifica si el usuario tiene un perfil en Firestore
     */
    public async hasUserProfile(uid: string): Promise<boolean> {
        try {
            const userDocRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userDocRef);
            return userDoc.exists();
        } catch (error) {
            console.error('[FirebaseSync] Error verificando perfil:', error);
            return false;
        }
    }
}

// Exportar instancia única
export const firebaseUserSync = FirebaseUserSync.getInstance();