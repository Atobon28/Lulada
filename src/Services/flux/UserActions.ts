// Importamos el despachador que envía las acciones a través de la aplicación
import { AppDispatcher } from './Dispacher';

// Definimos cómo debe verse la información de un usuario
export interface UserData {
    foto: string;                    // URL de la foto de perfil del usuario
    nombreDeUsuario: string;         // El @nombre que aparece en el perfil (ej: @CrisTiJauregui)
    nombre: string;                  // El nombre real de la persona (ej: Cristina Jauregui)
    descripcion: string;             // La biografía o descripción personal
    locationText?: string;           // Ubicación del usuario (opcional)
    menuLink?: string;               // Link al menú (para restaurantes, opcional)
    rol: string;                     // Tipo de usuario: "persona" o "restaurante"
}

// Este objeto contiene todas las acciones que pueden hacer los usuarios
export const UserActions = {
    
    // Esta función carga todos los datos del usuario cuando inicia la app
    loadUserData: (userData: UserData) => {
        console.log('UserActions: Cargando datos de usuario:', userData);
        AppDispatcher.dispatch({
            type: 'LOAD_USER_DATA',
            payload: userData
        });
    },

    // FUNCIÓN PRINCIPAL para cambiar el @nombre de usuario
    updateUsername: (newUsername: string) => {
        console.log('UserActions: Actualizando username a:', newUsername);
        AppDispatcher.dispatch({
            type: 'UPDATE_USERNAME',
            payload: newUsername
        });
    },

    // Función para cambiar el nombre real de la persona
    updateFullName: (newName: string) => {
        console.log('UserActions: Actualizando nombre completo a:', newName);
        AppDispatcher.dispatch({
            type: 'UPDATE_FULL_NAME',
            payload: newName
        });
    },

    // Función para cambiar el email del usuario
    updateEmail: (newEmail: string) => {
        console.log('UserActions: Actualizando correo a:', newEmail);
        AppDispatcher.dispatch({
            type: 'UPDATE_EMAIL',
            payload: newEmail
        });
    },

    // Función para cambiar la contraseña (necesita la actual y la nueva)
    updatePassword: (currentPassword: string, newPassword: string) => {
        console.log('UserActions: Actualizando contraseña');
        AppDispatcher.dispatch({
            type: 'UPDATE_PASSWORD',
            payload: { 
                currentPassword,
                newPassword
            }
        });
    },

    // Función para cambiar la imagen del perfil
    updateProfilePicture: (newPhotoUrl: string) => {
        console.log('UserActions: Actualizando foto de perfil');
        AppDispatcher.dispatch({
            type: 'UPDATE_PROFILE_PICTURE',
            payload: newPhotoUrl
        });
    },

    // FUNCIÓN PRINCIPAL para cambiar la biografía del usuario
    updateDescription: (newDescription: string) => {
        console.log('UserActions: Actualizando descripción a:', newDescription);
        AppDispatcher.dispatch({
            type: 'UPDATE_DESCRIPTION',
            payload: newDescription
        });
    },

    // Función para cambiar varios datos del perfil a la vez
    updateProfile: (updates: Partial<UserData>) => {
        console.log('UserActions: Actualizando perfil con:', updates);
        AppDispatcher.dispatch({
            type: 'UPDATE_PROFILE',
            payload: updates
        });
    },

    // Función para volver el perfil a como estaba originalmente
    resetProfile: () => {
        console.log('UserActions: Reseteando perfil a valores por defecto');
        AppDispatcher.dispatch({
            type: 'RESET_PROFILE',
            payload: undefined
        });
    }
};