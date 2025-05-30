// Importamos el despachador que envía las acciones a través de la aplicación
import { AppDispatcher } from './Dispacher';

// Definimos cómo debe verse la información de un usuario
// Es como un molde que dice qué datos debe tener cada usuario
export interface UserData {
    foto: string;                    // URL de la foto de perfil del usuario
    nombreDeUsuario: string;         // El @nombre que aparece en el perfil (ej: @CrisTiJauregui)
    nombre: string;                  // El nombre real de la persona (ej: Cristina Jauregui)
    descripcion: string;             // La biografía o descripción personal
    locationText?: string;           // Ubicación del usuario (opcional, por eso el ?)
    menuLink?: string;               // Link al menú (para restaurantes, opcional)
    rol: string;                     // Tipo de usuario: "persona" o "restaurante"
}

// Este objeto contiene todas las acciones que pueden hacer los usuarios
// Cada función aquí envía un "mensaje" al sistema para cambiar algo del perfil
export const UserActions = {
    
    // =======================================================================
    // CARGAR DATOS INICIALES
    // =======================================================================
    
    // Esta función carga todos los datos del usuario cuando inicia la app
    loadUserData: (userData: UserData) => {
        console.log('UserActions: Cargando datos de usuario:', userData);
        // Enviamos un mensaje al sistema diciendo "carga estos datos de usuario"
        AppDispatcher.dispatch({
            type: 'LOAD_USER_DATA',        // Tipo de acción: cargar datos
            payload: userData              // Los datos del usuario que queremos cargar
        });
    },

    // =======================================================================
    // CAMBIAR NOMBRE DE USUARIO (@username)
    // =======================================================================
    
    // FUNCIÓN PRINCIPAL para cambiar el @nombre de usuario
    updateUsername: (newUsername: string) => {
        console.log('UserActions: Actualizando username a:', newUsername);
        // Enviamos mensaje: "cambia el @nombre de usuario por este nuevo"
        AppDispatcher.dispatch({
            type: 'UPDATE_USERNAME',        // Tipo: actualizar nombre de usuario
            payload: newUsername            // El nuevo @nombre (ej: @NuevoNombre)
        });
    },

    // =======================================================================
    // CAMBIAR NOMBRE COMPLETO
    // =======================================================================
    
    // NUEVA función para cambiar el nombre real de la persona
    updateFullName: (newName: string) => {
        console.log('UserActions: Actualizando nombre completo a:', newName);
        // Enviamos mensaje: "cambia el nombre real por este nuevo"
        AppDispatcher.dispatch({
            type: 'UPDATE_FULL_NAME',       // Tipo: actualizar nombre completo
            payload: newName                // El nuevo nombre real (ej: "Juan Pérez")
        });
    },

    // =======================================================================
    // CAMBIAR CORREO ELECTRÓNICO
    // =======================================================================
    
    // Función para cambiar el email del usuario
    updateEmail: (newEmail: string) => {
        console.log('UserActions: Actualizando correo a:', newEmail);
        // Enviamos mensaje: "cambia el correo por este nuevo"
        AppDispatcher.dispatch({
            type: 'UPDATE_EMAIL',           // Tipo: actualizar correo
            payload: newEmail               // El nuevo email (ej: "nuevo@email.com")
        });
    },

    // =======================================================================
    // CAMBIAR CONTRASEÑA
    // =======================================================================
    
    // Función para cambiar la contraseña (necesita la actual y la nueva)
    updatePassword: (currentPassword: string, newPassword: string) => {
        console.log('UserActions: Actualizando contraseña');
        // Enviamos mensaje: "cambia la contraseña" (con ambas contraseñas)
        AppDispatcher.dispatch({
            type: 'UPDATE_PASSWORD',        // Tipo: actualizar contraseña
            payload: { 
                currentPassword,            // La contraseña actual (para verificar)
                newPassword                 // La nueva contraseña que quiere poner
            }
        });
    },

    // =======================================================================
    // CAMBIAR FOTO DE PERFIL
    // =======================================================================
    
    // Función para cambiar la imagen del perfil
    updateProfilePicture: (newPhotoUrl: string) => {
        console.log('UserActions: Actualizando foto de perfil');
        // Enviamos mensaje: "cambia la foto de perfil por esta nueva"
        AppDispatcher.dispatch({
            type: 'UPDATE_PROFILE_PICTURE', // Tipo: actualizar foto
            payload: newPhotoUrl            // URL de la nueva foto
        });
    },

    // =======================================================================
    // CAMBIAR DESCRIPCIÓN/BIOGRAFÍA
    // =======================================================================
    
    // FUNCIÓN PRINCIPAL para cambiar la biografía del usuario
    updateDescription: (newDescription: string) => {
        console.log('UserActions: Actualizando descripción a:', newDescription);
        // Enviamos mensaje: "cambia la descripción por esta nueva"
        AppDispatcher.dispatch({
            type: 'UPDATE_DESCRIPTION',     // Tipo: actualizar descripción
            payload: newDescription         // La nueva biografía/descripción
        });
    },

    // =======================================================================
    // FUNCIONES AVANZADAS - NUEVAS
    // =======================================================================
    
    // NUEVA función para cambiar varios datos del perfil a la vez
    // Es útil cuando queremos actualizar nombre, descripción y foto juntos
    updateProfile: (updates: Partial<UserData>) => {
        console.log('UserActions: Actualizando perfil con:', updates);
        // Enviamos mensaje: "actualiza estos campos del perfil"
        // Partial<UserData> significa "algunos campos de UserData, no todos"
        AppDispatcher.dispatch({
            type: 'UPDATE_PROFILE',         // Tipo: actualizar perfil completo
            payload: updates                // Los campos que queremos cambiar
        });
    },

    // NUEVA función para volver el perfil a como estaba originalmente
    // Es como un "botón de resetear" que borra todos los cambios
    resetProfile: () => {
        console.log('UserActions: Reseteando perfil a valores por defecto');
        // Enviamos mensaje: "vuelve todo a como estaba al principio"
        AppDispatcher.dispatch({
            type: 'RESET_PROFILE',          // Tipo: resetear perfil
            payload: undefined              // No necesitamos datos extra
        });
    }
};