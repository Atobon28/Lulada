// src/Services/flux/UserStore.ts - FIXED TYPESCRIPT ERRORS

import { AppDispatcher, Action } from './Dispacher';
import { UserData } from './UserActions';

export interface UserState {
    currentUser: UserData | null;
    isLoading: boolean;
    error: string | null;
}

type UserListener = (state: UserState) => void;

// Extend Window interface for debugging functions
declare global {
    interface Window {
        debugUserStore?: () => void;
        getUserStats?: () => {
            hasUsername: boolean;
            hasName: boolean;
            hasDescription: boolean;
            hasPhoto: boolean;
            completionPercentage: number;
        };
        restoreUserBackup?: () => boolean;
    }
}

export class UserStore {
    private _state: UserState = {
        currentUser: null,
        isLoading: false,
        error: null
    };

    private _listeners: UserListener[] = [];

    constructor() {
        AppDispatcher.register(this._handleActions.bind(this));
        this._loadInitialData();
    }

    // Cargar datos iniciales del usuario
    private _loadInitialData(): void {
        console.log('UserStore: Cargando datos iniciales...');
        
        // Intentar cargar desde localStorage primero
        try {
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                const userData = JSON.parse(savedUser) as UserData;
                console.log('Datos encontrados en localStorage:', userData);
                this._state.currentUser = userData;
                this._emitChange();
                return;
            }
        } catch (error) {
            console.error('Error loading saved user data:', error);
            localStorage.removeItem('currentUser'); // Limpiar datos corruptos
        }

        // Si no hay datos guardados, cargar datos por defecto
        console.log('Cargando datos por defecto...');
        this._state.currentUser = {
            foto: "https://randomuser.me/api/portraits/women/44.jpg",
            nombreDeUsuario: "@CrisTiJauregui",
            nombre: "Cristina Jauregui",
            descripcion: "Me encanta el alcohol, los cocteles me vuelven loca",
            rol: "persona"
        };
        this._saveUserData();
        this._emitChange();
    }

    // Manejar acciones - UPDATED WITH PROPER TYPES
    private _handleActions(action: Action): void {
        console.log('UserStore: Recibida acción:', action.type, action.payload);
        
        switch (action.type) {
            case 'LOAD_USER_DATA':
                this._state.currentUser = action.payload as UserData;
                this._state.error = null;
                console.log('Datos de usuario cargados:', this._state.currentUser);
                this._saveUserData();
                this._emitChange();
                break;

            case 'UPDATE_USERNAME':
                if (this._state.currentUser) {
                    const newUsername = action.payload as string;
                    console.log('Actualizando username de:', this._state.currentUser.nombreDeUsuario, 'a:', newUsername);
                    
                    // Asegurar que tenga el formato @username
                    const formattedUsername = newUsername.startsWith('@') ? newUsername : `@${newUsername}`;
                    
                    // Crear nuevo objeto para mantener inmutabilidad
                    this._state.currentUser = {
                        ...this._state.currentUser,
                        nombreDeUsuario: formattedUsername
                    };
                    this._state.error = null;
                    
                    console.log('Username actualizado a:', this._state.currentUser.nombreDeUsuario);
                    this._saveUserData();
                    this._emitChange();
                } else {
                    console.error('No hay usuario actual para actualizar');
                }
                break;

            case 'UPDATE_FULL_NAME':
                if (this._state.currentUser) {
                    const newName = action.payload as string;
                    console.log('Actualizando nombre completo de:', this._state.currentUser.nombre, 'a:', newName);
                    
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
                if (this._state.currentUser) {
                    const newDescription = action.payload as string;
                    console.log('Actualizando descripción de:', this._state.currentUser.descripcion, 'a:', newDescription);
                    
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
                if (this._state.currentUser && action.payload) {
                    const updates = action.payload as Partial<UserData>;
                    console.log('Actualizando perfil con múltiples campos:', updates);
                    
                    // Formatear username si está incluido
                    if (updates.nombreDeUsuario) {
                        updates.nombreDeUsuario = updates.nombreDeUsuario.startsWith('@') 
                            ? updates.nombreDeUsuario 
                            : `@${updates.nombreDeUsuario}`;
                    }
                    
                    this._state.currentUser = {
                        ...this._state.currentUser,
                        ...updates
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
                if (this._state.currentUser) {
                    // Nota: El email no está en el modelo actual, pero se puede extender
                    console.log('Actualización de email solicitada (funcionalidad pendiente)');
                    this._state.error = null;
                    this._saveUserData();
                    this._emitChange();
                }
                break;

            case 'UPDATE_PASSWORD':
                if (this._state.currentUser) {
                    // Aquí iría la lógica de validación de contraseña
                    console.log('Actualización de contraseña solicitada');
                    this._state.error = null;
                    this._saveUserData();
                    this._emitChange();
                }
                break;

            case 'UPDATE_PROFILE_PICTURE':
                if (this._state.currentUser) {
                    const newPhotoUrl = action.payload as string;
                    console.log('Actualizando foto de perfil a:', newPhotoUrl);
                    
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
                break;
        }
    }

    // Guardar datos del usuario en localStorage - IMPROVED
    private _saveUserData(): void {
        if (this._state.currentUser) {
            try {
                const dataToSave = JSON.stringify(this._state.currentUser);
                localStorage.setItem('currentUser', dataToSave);
                console.log('📦 Datos guardados en localStorage:', this._state.currentUser);
                
                // También guardar en sessionStorage como backup
                sessionStorage.setItem('currentUser_backup', dataToSave);
            } catch (error) {
                console.error('Error saving user data:', error);
                this._state.error = 'Error al guardar datos del usuario';
            }
        }
    }

    // Emitir cambios a los listeners
    private _emitChange(): void {
        console.log('UserStore: Emitiendo cambios a', this._listeners.length, 'listeners');
        console.log('Estado actual:', this._state);
        
        for (const listener of this._listeners) {
            try {
                listener(this._state);
            } catch (error) {
                console.error('Error en listener:', error);
            }
        }
    }

    // Obtener el estado actual
    getState(): UserState {
        return { ...this._state };
    }

    // Obtener solo los datos del usuario actual
    getCurrentUser(): UserData | null {
        return this._state.currentUser ? { ...this._state.currentUser } : null;
    }

    // Suscribirse a cambios
    subscribe(listener: UserListener): void {
        console.log('UserStore: Nuevo listener suscrito. Total:', this._listeners.length + 1);
        this._listeners.push(listener);
        // Emitir estado inicial inmediatamente
        try {
            listener(this._state);
        } catch (error) {
            console.error('Error en listener inicial:', error);
        }
    }

    // Desuscribirse de cambios
    unsubscribe(listener: UserListener): void {
        const initialLength = this._listeners.length;
        this._listeners = this._listeners.filter(l => l !== listener);
        console.log('UserStore: Listener desuscrito. Total:', initialLength, '->', this._listeners.length);
    }

    // NUEVOS MÉTODOS PÚBLICOS

    // Verificar si hay cambios sin guardar
    hasUnsavedChanges(): boolean {
        try {
            const saved = localStorage.getItem('currentUser');
            if (!saved || !this._state.currentUser) return false;
            
            const savedData = JSON.parse(saved) as UserData;
            return JSON.stringify(savedData) !== JSON.stringify(this._state.currentUser);
        } catch {
            return false;
        }
    }

    // Obtener estadísticas del perfil
    getProfileStats(): {
        hasUsername: boolean;
        hasName: boolean;
        hasDescription: boolean;
        hasPhoto: boolean;
        completionPercentage: number;
    } {
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
        const hasUsername = !!user.nombreDeUsuario && user.nombreDeUsuario !== '';
        const hasName = !!user.nombre && user.nombre !== '';
        const hasDescription = !!user.descripcion && user.descripcion !== '';
        const hasPhoto = !!user.foto && user.foto !== '';

        const fields = [hasUsername, hasName, hasDescription, hasPhoto];
        const completedFields = fields.filter(Boolean).length;
        const completionPercentage = Math.round((completedFields / fields.length) * 100);

        return {
            hasUsername,
            hasName,
            hasDescription,
            hasPhoto,
            completionPercentage
        };
    }

    // Método para debugging - IMPROVED
    debug(): void {
        console.log('UserStore Debug:');
        console.log('- Estado:', this._state);
        console.log('- Listeners:', this._listeners.length);
        console.log('- LocalStorage:', localStorage.getItem('currentUser'));
        console.log('- SessionStorage backup:', sessionStorage.getItem('currentUser_backup'));
        console.log('- Estadísticas del perfil:', this.getProfileStats());
        console.log('- Cambios sin guardar:', this.hasUnsavedChanges());
    }

    // Restaurar desde backup si es necesario
    restoreFromBackup(): boolean {
        try {
            const backup = sessionStorage.getItem('currentUser_backup');
            if (backup) {
                const userData = JSON.parse(backup) as UserData;
                this._state.currentUser = userData;
                this._saveUserData();
                this._emitChange();
                console.log('✅ Datos restaurados desde backup');
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Error restaurando backup:', error);
            return false;
        }
    }
}

export const userStore = new UserStore();

// Exponer para debugging en desarrollo - IMPROVED WITH PROPER TYPES
if (typeof window !== 'undefined' && !window.debugUserStore) {
    window.debugUserStore = (): void => userStore.debug();
    
    // Función adicional para estadísticas
    window.getUserStats = () => userStore.getProfileStats();
    
    // Función para restaurar backup
    window.restoreUserBackup = (): boolean => userStore.restoreFromBackup();
}