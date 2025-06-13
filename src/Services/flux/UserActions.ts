// Importamos el despachador que envía las acciones a través de la aplicación
import { AppDispatcher } from './Dispatcher'; // ✅ CORREGIDO: era './Dispacher'

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
    loadUserData: (userData: UserData): void => {
        console.log('UserActions: Cargando datos de usuario:', userData);
        AppDispatcher.dispatch({
            type: 'LOAD_USER_DATA',
            payload: userData
        });
    },

    // FUNCIÓN PRINCIPAL para actualizar datos completos del usuario
    updateUserData: (userData: UserData): void => {
        console.log('UserActions: Actualizando datos completos del usuario:', userData);
        AppDispatcher.dispatch({
            type: 'UPDATE_USER_DATA',
            payload: userData
        });
    },

    // FUNCIÓN PRINCIPAL para cambiar el @nombre de usuario
    updateUsername: (newUsername: string): void => {
        console.log('UserActions: Actualizando username a:', newUsername);
        AppDispatcher.dispatch({
            type: 'UPDATE_USERNAME',
            payload: newUsername
        });
    },

    // Función para cambiar el nombre real de la persona
    updateFullName: (newName: string): void => {
        console.log('UserActions: Actualizando nombre completo a:', newName);
        AppDispatcher.dispatch({
            type: 'UPDATE_FULL_NAME',
            payload: newName
        });
    },

    // Función para cambiar el email del usuario
    updateEmail: (newEmail: string): void => {
        console.log('UserActions: Actualizando correo a:', newEmail);
        AppDispatcher.dispatch({
            type: 'UPDATE_EMAIL',
            payload: newEmail
        });
    },

    // Función para cambiar la contraseña (necesita la actual y la nueva)
    updatePassword: (currentPassword: string, newPassword: string): void => {
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
    updateProfilePicture: (newPhotoUrl: string): void => {
        console.log('UserActions: Actualizando foto de perfil');
        AppDispatcher.dispatch({
            type: 'UPDATE_PROFILE_PICTURE',
            payload: newPhotoUrl
        });
    },

    // Función para cambiar la descripción/biografía
    updateDescription: (newDescription: string): void => {
        console.log('UserActions: Actualizando descripción del perfil');
        AppDispatcher.dispatch({
            type: 'UPDATE_DESCRIPTION',
            payload: newDescription
        });
    },

    // Función especial para restaurantes: actualizar ubicación
    updateLocation: (locationText: string): void => {
        console.log('UserActions: Actualizando ubicación del restaurante');
        AppDispatcher.dispatch({
            type: 'UPDATE_LOCATION',
            payload: locationText
        });
    },

    // Función especial para restaurantes: actualizar link del menú
    updateMenuLink: (menuLink: string): void => {
        console.log('UserActions: Actualizando link del menú');
        AppDispatcher.dispatch({
            type: 'UPDATE_MENU_LINK',
            payload: menuLink
        });
    },

    // Función para cambiar el rol del usuario (persona/restaurante)
    updateRole: (newRole: string): void => {
        console.log('UserActions: Actualizando rol del usuario a:', newRole);
        AppDispatcher.dispatch({
            type: 'UPDATE_ROLE',
            payload: newRole
        });
    },

    // Función para limpiar/reiniciar el perfil
    resetProfile: (): void => {
        console.log('UserActions: Reiniciando perfil del usuario');
        AppDispatcher.dispatch({
            type: 'RESET_PROFILE',
            payload: undefined
        });
    }
};