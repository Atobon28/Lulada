
import { EventEmitter } from 'events';
import { AppDispatcher } from './Dispacher';
import { UserData } from './UserActions';
import { firebaseUserSync } from '../firebase/FirebaseUserSync';

// Definimos cómo debe verse el estado completo del usuario en nuestra aplicación
export interface UserState {
    currentUser: UserData | null;  // Los datos del usuario actual (null si no hay usuario)
    isLoading: boolean;           // Si estamos cargando datos
    error: string | null;         // Si hay algún error
}

// Definimos el tipo de acciones que puede recibir el store
export interface FluxAction {
    type: string;                 // Tipo de acción (ej: 'LOAD_USER_DATA')
    payload?: unknown;            // Datos que acompañan la acción
}

// Esta clase maneja todos los datos del usuario en la aplicación
class UserStore extends EventEmitter {
    private _state: UserState;
    private _isHydrated: boolean = false;

    constructor() {
        super();
        
        // Estado inicial: no hay usuario, no estamos cargando, no hay errores
        this._state = {
            currentUser: null,
            isLoading: false,
            error: null
        };

        // Nos registramos para escuchar todas las acciones
        AppDispatcher.register(this._handleActions.bind(this));
        
        // Intentamos cargar datos guardados del usuario
        this._loadUserData();
    }

    // Función para obtener el estado actual completo
    public getState(): UserState {
        return { ...this._state }; // Devolvemos una copia para evitar modificaciones
    }

    // Función para obtener solo los datos del usuario actual
    public getCurrentUser(): UserData | null {
        return this._state.currentUser ? { ...this._state.currentUser } : null;
    }

    // Función para suscribirse a cambios en el store
    public subscribe(callback: (state: UserState) => void): () => void {
        const listener = () => callback(this.getState());
        this.on('change', listener);
        
        // Devolver función para desuscribirse
        return () => this.off('change', listener);
    }

    // Función para desuscribirse de cambios
    public unsubscribe(callback: (state: UserState) => void): void {
        this.off('change', callback);
    }

    // Función privada para notificar cambios a todos los suscriptores
    private _emitChange(): void {
        this.emit('change');
    }

    // Función privada para cargar datos del usuario desde el navegador
    private _loadUserData(): void {
        try {
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                const userData = JSON.parse(savedUser) as UserData;
                this._state.currentUser = userData;
                this._isHydrated = true;
                console.log('UserStore: Datos de usuario cargados desde localStorage');
            } else {
                console.log('UserStore: No hay datos guardados, usando valores por defecto');
                this._setDefaultUserData();
            }
        } catch (error) {
            console.error('UserStore: Error cargando datos:', error);
            this._setDefaultUserData();
        }
    }

    // Función privada para guardar datos del usuario en el navegador
    private _saveUserData(): void {
        try {
            if (this._state.currentUser) {
                localStorage.setItem('currentUser', JSON.stringify(this._state.currentUser));
                console.log('UserStore: Datos guardados en localStorage');
            }
        } catch (error) {
            console.error('UserStore: Error guardando datos:', error);
        }
    }

    // Función privada para sincronizar con Firebase - CORREGIDA
    private async _syncWithFirebase(): Promise<void> {
        if (!this._state.currentUser) {
            return;
        }

        try {
            // Importación dinámica SOLO cuando se necesita
            const firebaseModule = await import('../firebase/FirebaseUserSync');
            const firebaseUserSync = firebaseModule.firebaseUserSync;
            
            console.log('[UserStore] Sincronizando cambios con Firebase...');
            const result = await firebaseUserSync.updateUserProfile(this._state.currentUser);
            
            if (result.success) {
                console.log('[UserStore] ✅ Sincronización exitosa con Firebase');
            } else {
                console.warn('[UserStore] ⚠️ Error sincronizando con Firebase:', result.error);
            }
        } catch (error) {
            // No loggeamos error si Firebase no está disponible
            console.log('[UserStore] Firebase no disponible, funcionando solo con localStorage');
        }
    }

    // Función privada para establecer datos por defecto
    private _setDefaultUserData(): void {
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

    // Función que maneja todas las acciones/eventos que pueden cambiar los datos del usuario
    private _handleActions(action: FluxAction): void {
        switch (action.type) {
            case 'LOAD_USER_DATA':
                this._state.currentUser = action.payload as UserData;
                this._state.error = null;
                this._saveUserData();
                this._emitChange();
                break;

            case 'UPDATE_USERNAME':
                if (this._state.currentUser) {
                    const newUsername = action.payload as string;
                    const formattedUsername = newUsername.startsWith('@') ? 
                        newUsername : `@${newUsername}`;
                    
                    this._state.currentUser = {
                        ...this._state.currentUser,
                        nombreDeUsuario: formattedUsername
                    };
                    this._state.error = null;
                    
                    this._saveUserData();
                    this._syncWithFirebase(); // Intentar sincronizar
                    this._emitChange();
                } else {
                    console.error('No hay usuario actual para actualizar');
                }
                break;

            case 'UPDATE_FULL_NAME':
                if (this._state.currentUser) {
                    const newName = action.payload as string;
                    
                    this._state.currentUser = {
                        ...this._state.currentUser,
                        nombre: newName
                    };
                    this._state.error = null;
                    
                    this._saveUserData();
                    this._syncWithFirebase(); // Intentar sincronizar
                    this._emitChange();
                } else {
                    console.error('No hay usuario actual para actualizar');
                }
                break;

            case 'UPDATE_DESCRIPTION':
                if (this._state.currentUser) {
                    const newDescription = action.payload as string;
                    
                    this._state.currentUser = {
                        ...this._state.currentUser,
                        descripcion: newDescription
                    };
                    this._state.error = null;
                    
                    this._saveUserData();
                    this._syncWithFirebase(); // Intentar sincronizar
                    this._emitChange();
                } else {
                    console.error('No hay usuario actual para actualizar');
                }
                break;

            case 'UPDATE_PROFILE':
                if (this._state.currentUser && action.payload) {
                    const updates = action.payload as Partial<UserData>;
                    
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
                    
                    this._saveUserData();
                    this._syncWithFirebase(); // Intentar sincronizar
                    this._emitChange();
                } else {
                    console.error('No hay usuario actual para actualizar o no hay datos de actualización');
                }
                break;

            case 'UPDATE_EMAIL':
                if (this._state.currentUser) {
                    this._state.error = null;
                    this._saveUserData();
                    this._syncWithFirebase(); // Intentar sincronizar
                    this._emitChange();
                }
                break;

            case 'UPDATE_PASSWORD':
                if (this._state.currentUser) {
                    this._state.error = null;
                    this._saveUserData();
                    this._emitChange();
                }
                break;

            case 'UPDATE_PROFILE_PICTURE':
                if (this._state.currentUser) {
                    const newPhotoUrl = action.payload as string;
                    
                    this._state.currentUser = {
                        ...this._state.currentUser,
                        foto: newPhotoUrl
                    };
                    this._state.error = null;
                    
                    this._saveUserData();
                    this._syncWithFirebase(); // Intentar sincronizar
                    this._emitChange();
                } else {
                    console.error('No hay usuario actual para actualizar');
                }
                break;

            case 'RESET_PROFILE':
                this._state.currentUser = null;
                this._state.error = null;
                localStorage.removeItem('currentUser');
                this._emitChange();
                break;

            case 'SET_LOADING':
                this._state.isLoading = action.payload as boolean;
                this._emitChange();
                break;

            case 'SET_ERROR':
                this._state.error = action.payload as string;
                this._state.isLoading = false;
                this._emitChange();
                break;

            default:
                console.log('UserStore: Acción no reconocida:', action.type);
        }
    }

    // NUEVA: Función para sincronizar datos desde Firebase
    public async syncFromFirebase(userData: UserData): Promise<void> {
        console.log('[UserStore] Sincronizando datos desde Firebase');
        
        this._state.currentUser = userData;
        this._state.error = null;
        this._saveUserData();
        this._emitChange();
    }

    // NUEVA: Función para verificar si hay conexión con Firebase
    public async hasFirebaseSync(): Promise<boolean> {
        try {
            await import(firebaseUserSync);
            return true;
        } catch {
            return false;
        }
    }

    // Función para obtener información de debug
    public getDebugInfo(): Record<string, unknown> {
        return {
            currentUser: this._state.currentUser,
            isLoading: this._state.isLoading,
            error: this._state.error,
            isHydrated: this._isHydrated,
            listenerCount: this.listenerCount('change')
        };
    }
}

// Crear y exportar una única instancia del store
export const userStore = new UserStore();

// Hacer el store accesible globalmente para debugging
if (typeof window !== 'undefined') {
    (window as typeof window & { userStore: UserStore }).userStore = userStore;
}