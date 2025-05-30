// Importamos las herramientas que necesitamos para manejar eventos y datos de usuario
import { AppDispatcher, Action } from './Dispacher';
import { UserData } from './UserActions';

// Esta interfaz define cómo se ve el estado del usuario en la aplicación
export interface UserState {
    currentUser: UserData | null; // Los datos del usuario actual (puede ser null si no hay usuario)
    isLoading: boolean;           // Si estamos cargando datos (true/false)
    error: string | null;         // Si hay algún error (texto del error o null si no hay error)
}

// Tipo de función que puede escuchar cambios en el estado del usuario
type UserListener = (state: UserState) => void;

// Extendemos la interfaz de Window para agregar funciones de debugging
// Esto nos permite usar funciones como window.debugUserStore() en la consola del navegador
declare global {
    interface Window {
        debugUserStore?: () => void;                    // Función para ver información de debug
        getUserStats?: () => {                          // Función para ver estadísticas del perfil
            hasUsername: boolean;                       // ¿Tiene nombre de usuario?
            hasName: boolean;                          // ¿Tiene nombre completo?
            hasDescription: boolean;                   // ¿Tiene descripción?
            hasPhoto: boolean;                         // ¿Tiene foto?
            completionPercentage: number;              // Porcentaje de completitud del perfil
        };
        restoreUserBackup?: () => boolean;            // Función para restaurar backup de datos
    }
}

// Clase principal que maneja todos los datos del usuario
export class UserStore {
    // Estado inicial del usuario (privado, solo esta clase puede modificarlo)
    private _state: UserState = {
        currentUser: null,      // Al principio no hay usuario
        isLoading: false,       // No estamos cargando nada
        error: null            // No hay errores
    };

    // Lista de funciones que escuchan cuando cambian los datos del usuario
    private _listeners: UserListener[] = [];

    // Constructor: se ejecuta cuando se crea una nueva instancia de UserStore
    constructor() {
        // Registramos esta clase para que escuche todos los eventos/acciones que ocurren en la app
        AppDispatcher.register(this._handleActions.bind(this));
        // Cargamos los datos iniciales del usuario
        this._loadInitialData();
    }

    // Función privada que carga los datos del usuario cuando inicia la aplicación
    private _loadInitialData(): void {
        console.log('UserStore: Cargando datos iniciales...');
        
        // Primero intentamos cargar datos guardados en el navegador (localStorage)
        try {
            const savedUser = localStorage.getItem('currentUser'); // Buscamos datos guardados
            if (savedUser) {
                // Si encontramos datos, los convertimos de texto a objeto JavaScript
                const userData = JSON.parse(savedUser) as UserData;
                console.log('Datos encontrados en localStorage:', userData);
                // Establecemos estos datos como el usuario actual
                this._state.currentUser = userData;
                // Notificamos a todos los componentes que escuchan cambios
                this._emitChange();
                return; // Salimos de la función porque ya tenemos datos
            }
        } catch (error) {
            // Si hay error al cargar datos guardados, los borramos para evitar problemas
            console.error('Error loading saved user data:', error);
            localStorage.removeItem('currentUser');
        }

        // Si no hay datos guardados, creamos un usuario por defecto
        console.log('Cargando datos por defecto...');
        this._state.currentUser = {
            foto: "https://randomuser.me/api/portraits/women/44.jpg",  // Foto de ejemplo
            nombreDeUsuario: "@CrisTiJauregui",                        // Username de ejemplo
            nombre: "Cristina Jauregui",                               // Nombre de ejemplo
            descripcion: "Me encanta el alcohol, los cocteles me vuelven loca", // Descripción de ejemplo
            rol: "persona"                                             // Tipo de usuario
        };
        // Guardamos estos datos por defecto
        this._saveUserData();
        // Notificamos el cambio
        this._emitChange();
    }

    // Función que maneja todas las acciones/eventos que pueden cambiar los datos del usuario
    private _handleActions(action: Action): void {
        console.log('UserStore: Recibida acción:', action.type, action.payload);
        
        // Usamos switch para manejar diferentes tipos de acciones
        switch (action.type) {
            case 'LOAD_USER_DATA':
                // Acción: cargar datos completos del usuario
                this._state.currentUser = action.payload as UserData;
                this._state.error = null; // Limpiamos cualquier error previo
                console.log('Datos de usuario cargados:', this._state.currentUser);
                this._saveUserData(); // Guardamos en el navegador
                this._emitChange();   // Notificamos el cambio
                break;

            case 'UPDATE_USERNAME':
                // Acción: cambiar el nombre de usuario
                if (this._state.currentUser) { // Solo si hay un usuario actual
                    const newUsername = action.payload as string;
                    console.log('Actualizando username de:', this._state.currentUser.nombreDeUsuario, 'a:', newUsername);
                    
                    // Nos aseguramos de que el username empiece con @
                    const formattedUsername = newUsername.startsWith('@') ? newUsername : `@${newUsername}`;
                    
                    // Creamos un nuevo objeto con los datos actualizados (inmutabilidad)
                    this._state.currentUser = {
                        ...this._state.currentUser,           // Copiamos todos los datos existentes
                        nombreDeUsuario: formattedUsername    // Actualizamos solo el username
                    };
                    this._state.error = null;
                    
                    console.log('Username actualizado a:', this._state.currentUser.nombreDeUsuario);
                    this._saveUserData(); // Guardamos
                    this._emitChange();   // Notificamos
                } else {
                    console.error('No hay usuario actual para actualizar');
                }
                break;

            case 'UPDATE_FULL_NAME':
                // Acción: cambiar el nombre completo del usuario
                if (this._state.currentUser) {
                    const newName = action.payload as string;
                    console.log('Actualizando nombre completo de:', this._state.currentUser.nombre, 'a:', newName);
                    
                    // Creamos nuevo objeto con el nombre actualizado
                    this._state.currentUser = {
                        ...this._state.currentUser,
                        nombre: newName
                    };
                    this._state.error = null;
                    
                    console.log('Nombre completo actualizado a:', this._state.currentUser.nombre);
                    this._saveUserData();
                    this._emitChange();
                } else {
                    console.error('No hay usuario actual para actualizar');
                }
                break;

            case 'UPDATE_DESCRIPTION':
                // Acción: cambiar la descripción/biografía del usuario
                if (this._state.currentUser) {
                    const newDescription = action.payload as string;
                    console.log('Actualizando descripción de:', this._state.currentUser.descripcion, 'a:', newDescription);
                    
                    // Actualizamos solo la descripción
                    this._state.currentUser = {
                        ...this._state.currentUser,
                        descripcion: newDescription
                    };
                    this._state.error = null;
                    
                    console.log('Descripción actualizada a:', this._state.currentUser.descripcion);
                    this._saveUserData();
                    this._emitChange();
                } else {
                    console.error('No hay usuario actual para actualizar');
                }
                break;

            case 'UPDATE_PROFILE':
                // Acción: actualizar múltiples campos del perfil a la vez
                if (this._state.currentUser && action.payload) {
                    const updates = action.payload as Partial<UserData>; // Cambios parciales
                    console.log('Actualizando perfil con múltiples campos:', updates);
                    
                    // Si se está actualizando el username, le agregamos @ si no lo tiene
                    if (updates.nombreDeUsuario) {
                        updates.nombreDeUsuario = updates.nombreDeUsuario.startsWith('@') 
                            ? updates.nombreDeUsuario 
                            : `@${updates.nombreDeUsuario}`;
                    }
                    
                    // Combinamos los datos existentes con las actualizaciones
                    this._state.currentUser = {
                        ...this._state.currentUser,    // Datos existentes
                        ...updates                      // Nuevos datos (sobrescriben los existentes)
                    };
                    this._state.error = null;
                    
                    console.log('Perfil actualizado:', this._state.currentUser);
                    this._saveUserData();
                    this._emitChange();
                } else {
                    console.error('No hay usuario actual para actualizar o no hay datos de actualización');
                }
                break;

            case 'UPDATE_EMAIL':
                // Acción: cambiar email (funcionalidad básica, se puede expandir)
                if (this._state.currentUser) {
                    console.log('Actualización de email solicitada (funcionalidad pendiente)');
                    this._state.error = null;
                    this._saveUserData();
                    this._emitChange();
                }
                break;

            case 'UPDATE_PASSWORD':
                // Acción: cambiar contraseña (funcionalidad básica, se puede expandir)
                if (this._state.currentUser) {
                    console.log('Actualización de contraseña solicitada');
                    this._state.error = null;
                    this._saveUserData();
                    this._emitChange();
                }
                break;

            case 'UPDATE_PROFILE_PICTURE':
                // Acción: cambiar la foto de perfil
                if (this._state.currentUser) {
                    const newPhotoUrl = action.payload as string;
                    console.log('Actualizando foto de perfil a:', newPhotoUrl);
                    
                    // Actualizamos solo la foto
                    this._state.currentUser = {
                        ...this._state.currentUser,
                        foto: newPhotoUrl
                    };
                    this._state.error = null;
                    
                    console.log('Foto de perfil actualizada');
                    this._saveUserData();
                    this._emitChange();
                }
                break;

            case 'RESET_PROFILE':
                // Acción: resetear el perfil a los valores por defecto
                console.log('Reseteando perfil a valores por defecto');
                this._state.currentUser = {
                    foto: "https://randomuser.me/api/portraits/women/44.jpg",
                    nombreDeUsuario: "@CrisTiJauregui",
                    nombre: "Cristina Jauregui",
                    descripcion: "Me encanta el alcohol, los cocteles me vuelven loca",
                    rol: "persona"
                };
                this._state.error = null;
                this._saveUserData();
                this._emitChange();
                break;

            default:
                // Si llega una acción que no conocemos, no hacemos nada
                break;
        }
    }

    // Función privada que guarda los datos del usuario en el navegador
    private _saveUserData(): void {
        if (this._state.currentUser) { // Solo si hay un usuario actual
            try {
                // Convertimos el objeto a texto para guardarlo
                const dataToSave = JSON.stringify(this._state.currentUser);
                // Guardamos en localStorage (permanente hasta que el usuario borre datos del navegador)
                localStorage.setItem('currentUser', dataToSave);
                console.log(' Datos guardados en localStorage:', this._state.currentUser);
                
                // También guardamos en sessionStorage como respaldo (se borra al cerrar la pestaña)
                sessionStorage.setItem('currentUser_backup', dataToSave);
            } catch (error) {
                console.error('Error saving user data:', error);
                this._state.error = 'Error al guardar datos del usuario';
            }
        }
    }

    // Función privada que notifica a todos los componentes que escuchan cambios
    private _emitChange(): void {
        console.log('UserStore: Emitiendo cambios a', this._listeners.length, 'listeners');
        console.log('Estado actual:', this._state);
        
        // Llamamos a cada función que está escuchando cambios
        for (const listener of this._listeners) {
            try {
                listener(this._state); // Le pasamos el estado actual
            } catch (error) {
                console.error('Error en listener:', error);
            }
        }
    }

    // Función pública: obtener una copia del estado actual
    getState(): UserState {
        return { ...this._state }; // Devolvemos una copia para evitar modificaciones externas
    }

    // Función pública: obtener solo los datos del usuario actual
    getCurrentUser(): UserData | null {
        // Devolvemos una copia de los datos del usuario o null si no hay usuario
        return this._state.currentUser ? { ...this._state.currentUser } : null;
    }

    // Función pública: suscribirse para escuchar cambios en el usuario
    subscribe(listener: UserListener): void {
        console.log('UserStore: Nuevo listener suscrito. Total:', this._listeners.length + 1);
        // Agregamos la función a nuestra lista de oyentes
        this._listeners.push(listener);
        // Inmediatamente le enviamos el estado actual
        try {
            listener(this._state);
        } catch (error) {
            console.error('Error en listener inicial:', error);
        }
    }

    // Función pública: desuscribirse (dejar de escuchar cambios)
    unsubscribe(listener: UserListener): void {
        const initialLength = this._listeners.length;
        // Removemos la función de nuestra lista de oyentes
        this._listeners = this._listeners.filter(l => l !== listener);
        console.log('UserStore: Listener desuscrito. Total:', initialLength, '->', this._listeners.length);
    }

    // NUEVOS MÉTODOS PÚBLICOS

    // Función pública: verificar si hay cambios que no se han guardado
    hasUnsavedChanges(): boolean {
        try {
            // Comparamos los datos guardados con los datos actuales
            const saved = localStorage.getItem('currentUser');
            if (!saved || !this._state.currentUser) return false;
            
            const savedData = JSON.parse(saved) as UserData;
            // Si son diferentes, hay cambios sin guardar
            return JSON.stringify(savedData) !== JSON.stringify(this._state.currentUser);
        } catch {
            return false;
        }
    }

    // Función pública: obtener estadísticas sobre qué tan completo está el perfil
    getProfileStats(): {
        hasUsername: boolean;      // ¿Tiene username?
        hasName: boolean;         // ¿Tiene nombre?
        hasDescription: boolean;  // ¿Tiene descripción?
        hasPhoto: boolean;        // ¿Tiene foto?
        completionPercentage: number; // Porcentaje de completitud
    } {
        // Si no hay usuario, todo está vacío
        if (!this._state.currentUser) {
            return {
                hasUsername: false,
                hasName: false,
                hasDescription: false,
                hasPhoto: false,
                completionPercentage: 0
            };
        }

        const user = this._state.currentUser;
        // Verificamos si cada campo tiene contenido
        const hasUsername = !!user.nombreDeUsuario && user.nombreDeUsuario !== '';
        const hasName = !!user.nombre && user.nombre !== '';
        const hasDescription = !!user.descripcion && user.descripcion !== '';
        const hasPhoto = !!user.foto && user.foto !== '';

        // Calculamos el porcentaje de completitud
        const fields = [hasUsername, hasName, hasDescription, hasPhoto];
        const completedFields = fields.filter(Boolean).length; // Contamos los que son true
        const completionPercentage = Math.round((completedFields / fields.length) * 100);

        return {
            hasUsername,
            hasName,
            hasDescription,
            hasPhoto,
            completionPercentage
        };
    }

    // Función pública para debugging: muestra información detallada en la consola
    debug(): void {
        console.log('UserStore Debug:');
        console.log('- Estado:', this._state);
        console.log('- Listeners:', this._listeners.length);
        console.log('- LocalStorage:', localStorage.getItem('currentUser'));
        console.log('- SessionStorage backup:', sessionStorage.getItem('currentUser_backup'));
        console.log('- Estadísticas del perfil:', this.getProfileStats());
        console.log('- Cambios sin guardar:', this.hasUnsavedChanges());
    }

    // Función pública: restaurar datos desde el backup si es necesario
    restoreFromBackup(): boolean {
        try {
            // Intentamos obtener el backup de sessionStorage
            const backup = sessionStorage.getItem('currentUser_backup');
            if (backup) {
                // Si hay backup, lo restauramos
                const userData = JSON.parse(backup) as UserData;
                this._state.currentUser = userData;
                this._saveUserData(); // Lo guardamos como datos principales
                this._emitChange();   // Notificamos el cambio
                console.log(' Datos restaurados desde backup');
                return true; // Éxito
            }
            return false; // No había backup
        } catch (error) {
            console.error(' Error restaurando backup:', error);
            return false; // Error al restaurar
        }
    }
}

// Creamos una instancia única de UserStore que será usada en toda la aplicación
export const userStore = new UserStore();

// Exponemos funciones de debugging en el navegador (solo en desarrollo)
if (typeof window !== 'undefined' && !window.debugUserStore) {
    // Función para hacer debug del UserStore
    window.debugUserStore = (): void => userStore.debug();
    
    // Función para obtener estadísticas del perfil
    window.getUserStats = () => userStore.getProfileStats();
    
    // Función para restaurar backup de datos
    window.restoreUserBackup = (): boolean => userStore.restoreFromBackup();
}