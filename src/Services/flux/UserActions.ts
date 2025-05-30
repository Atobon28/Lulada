// src/Services/flux/UserActions.ts - ACTUALIZADO

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

    // NUEVA: Cambiar nombre completo
    updateFullName: (newName: string) => {
        console.log('UserActions: Actualizando nombre completo a:', newName);
        AppDispatcher.dispatch({
            type: 'UPDATE_FULL_NAME',
            payload: newName
        });
    },

    // Cambiar correo
    updateEmail: (newEmail: string) => {
        console.log('UserActions: Actualizando correo a:', newEmail);
        AppDispatcher.dispatch({
            type: 'UPDATE_EMAIL',
            payload: newEmail
        });
    },

    // Cambiar contraseña
    updatePassword: (currentPassword: string, newPassword: string) => {
        console.log('UserActions: Actualizando contraseña');
        AppDispatcher.dispatch({
            type: 'UPDATE_PASSWORD',
            payload: { currentPassword, newPassword }
        });
    },

    // Cambiar foto de perfil
    updateProfilePicture: (newPhotoUrl: string) => {
        console.log('UserActions: Actualizando foto de perfil');
        AppDispatcher.dispatch({
            type: 'UPDATE_PROFILE_PICTURE',
            payload: newPhotoUrl
        });
    },

    // Cambiar descripción/biografía - FUNCIÓN PRINCIPAL
    updateDescription: (newDescription: string) => {
        console.log('UserActions: Actualizando descripción a:', newDescription);
        AppDispatcher.dispatch({
            type: 'UPDATE_DESCRIPTION',
            payload: newDescription
        });
    },

    // NUEVA: Actualizar múltiples campos a la vez
    updateProfile: (updates: Partial<UserData>) => {
        console.log('UserActions: Actualizando perfil con:', updates);
        AppDispatcher.dispatch({
            type: 'UPDATE_PROFILE',
            payload: updates
        });
    },

    // NUEVA: Resetear perfil a valores por defecto
    resetProfile: () => {
        console.log('UserActions: Reseteando perfil a valores por defecto');
        AppDispatcher.dispatch({
            type: 'RESET_PROFILE',
            payload: undefined
        });
    }
};