import { AppDispatcher, Action } from './Dispacher';
import { UserData } from './UserActions';

export interface UserState {
    currentUser: UserData | null;
    isLoading: boolean;
    error: string | null;
}

type UserListener = (state: UserState) => void;

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
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                console.log(' Datos encontrados en localStorage:', userData);
                this._state.currentUser = userData;
                this._emitChange();
                return;
            } catch (error) {
                console.error('Error loading saved user data:', error);
                localStorage.removeItem('currentUser'); // Limpiar datos corruptos
            }
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

    // Manejar acciones
    private _handleActions(action: Action): void {
        console.log('UserStore: Recibida acción:', action.type, action.payload);
        
        switch (action.type) {
            case 'LOAD_USER_DATA':
                this._state.currentUser = action.payload as UserData;
                this._state.error = null;
                console.log(' Datos de usuario cargados:', this._state.currentUser);
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

            case 'UPDATE_EMAIL':
                if (this._state.currentUser) {
                    // Nota: El email no está en el modelo actual, pero podríamos agregarlo
                    this._state.error = null;
                    this._saveUserData();
                    this._emitChange();
                }
                break;

            case 'UPDATE_PASSWORD':
                if (this._state.currentUser) {
                    // Aquí iría la lógica de validación de contraseña
                    this._state.error = null;
                    this._saveUserData();
                    this._emitChange();
                }
                break;

            case 'UPDATE_PROFILE_PICTURE':
                if (this._state.currentUser) {
                    this._state.currentUser = {
                        ...this._state.currentUser,
                        foto: action.payload as string
                    };
                    this._state.error = null;
                    this._saveUserData();
                    this._emitChange();
                }
                break;

            case 'UPDATE_DESCRIPTION':
                if (this._state.currentUser) {
                    this._state.currentUser = {
                        ...this._state.currentUser,
                        descripcion: action.payload as string
                    };
                    this._state.error = null;
                    this._saveUserData();
                    this._emitChange();
                }
                break;

            default:
                break;
        }
    }

    // Guardar datos del usuario en localStorage
    private _saveUserData(): void {
        if (this._state.currentUser) {
            try {
                const dataToSave = JSON.stringify(this._state.currentUser);
                localStorage.setItem('currentUser', dataToSave);
                console.log('Datos guardados en localStorage:', this._state.currentUser);
            } catch (error) {
                console.error('Error saving user data:', error);
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
                console.error(' Error en listener:', error);
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
        console.log(' UserStore: Nuevo listener suscrito. Total:', this._listeners.length + 1);
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

    // Método para debugging
    debug(): void {
        console.log(' UserStore Debug:');
        console.log('- Estado:', this._state);
        console.log('- Listeners:', this._listeners.length);
        console.log('- LocalStorage:', localStorage.getItem('currentUser'));
    }
}

export const userStore = new UserStore();

// Exponer para debugging - SIN DECLARAR GLOBAL AQUÍ
if (typeof window !== 'undefined') {
    // Solo asignar si no existe ya
    if (!window.debugUserStore) {
        window.debugUserStore = () => userStore.debug();
    }
}