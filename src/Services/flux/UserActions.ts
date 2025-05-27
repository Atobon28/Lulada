import { AppDispatcher } from './Dispacher';

export interface UserData {
    foto: string;
    nombreDeUsuario: string;
    nombre: string;
    descripcion: string;
    locationText?: string;
    menuLink?: string;
    rol: string;
}

export const UserActions = {
    // Cargar datos iniciales del usuario
    loadUserData: (userData: UserData) => {
        console.log('UserActions: Cargando datos de usuario:', userData);
        AppDispatcher.dispatch({
            type: 'LOAD_USER_DATA',
            payload: userData
        });
    },

    // Cambiar nombre de usuario - FUNCIÓN PRINCIPAL
    updateUsername: (newUsername: string) => {
        console.log('UserActions: Actualizando username a:', newUsername);
        AppDispatcher.dispatch({
            type: 'UPDATE_USERNAME',
            payload: newUsername
        });
    },

    // Cambiar correo
    updateEmail: (newEmail: string) => {
        AppDispatcher.dispatch({
            type: 'UPDATE_EMAIL',
            payload: newEmail
        });
    },

    // Cambiar contraseña
    updatePassword: (currentPassword: string, newPassword: string) => {
        AppDispatcher.dispatch({
            type: 'UPDATE_PASSWORD',
            payload: { currentPassword, newPassword }
        });
    },

    // Cambiar foto de perfil
    updateProfilePicture: (newPhotoUrl: string) => {
        AppDispatcher.dispatch({
            type: 'UPDATE_PROFILE_PICTURE',
            payload: newPhotoUrl
        });
    },

    // Cambiar descripción/biografía
    updateDescription: (newDescription: string) => {
        AppDispatcher.dispatch({
            type: 'UPDATE_DESCRIPTION',
            payload: newDescription
        });
    }
};
