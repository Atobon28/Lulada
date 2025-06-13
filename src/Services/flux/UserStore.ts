import { EventEmitter } from 'events';
import { AppDispatcher } from './Dispatcher';
import { UserData } from './UserActions';

// Definimos cómo debe verse el estado completo del usuario en nuestra aplicación
export interface UserState {
    currentUser: UserData | null;  // Los datos del usuario actual (null si no hay usuario)
    isLoading: boolean;           // Si estamos cargando datos
    error: string | null;         // Si hay algún error
    isSyncing: boolean;          // Si estamos sincronizando con Firebase
    lastSyncTime: string | null; // Última vez que se sincronizó
}

// Definimos el tipo de acciones que puede recibir el store
export interface FluxAction {
    type: string;                 // Tipo de acción (ej: 'LOAD_USER_DATA')
    payload?: unknown;            // Datos que acompañan la acción
}

// Listener type for subscriptions
type UserStoreListener = (state: UserState) => void;

// Esta clase maneja todos los datos del usuario en la aplicación
class UserStore extends EventEmitter {
    private _state: UserState;
    private _isHydrated: boolean = false;
    private _syncService: unknown = null;
    private _syncUnsubscribe?: () => void;
    private _listeners: Set<UserStoreListener> = new Set();

    constructor() {
        super();
        
        // Estado inicial: no hay usuario, no estamos cargando, no hay errores
        this._state = {
            currentUser: null,
            isLoading: false,
            error: null,
            isSyncing: false,
            lastSyncTime: null
        };

        // Nos registramos para escuchar todas las acciones
        AppDispatcher.register(this._handleActions.bind(this));
        
        // Intentamos cargar datos guardados del usuario
        this._loadUserData();
        
        // Inicializar sincronización en tiempo real
        this._initializeRealTimeSync();
    }

    // Función para obtener el estado actual completo
    public getState(): UserState {
        return { ...this._state }; // Devolvemos una copia para evitar modificaciones
    }

    // Función para obtener solo los datos del usuario actual
    public getCurrentUser(): UserData | null {
        return this._state.currentUser ? { ...this._state.currentUser } : null;
    }

    // Función para suscribirse a cambios en el estado
    public subscribe(listener: UserStoreListener): void {
        this._listeners.add(listener);
    }

    // Función para cancelar suscripción a cambios
    public unsubscribe(listener: UserStoreListener): void {
        this._listeners.delete(listener);
    }

    // Función para sincronizar desde Firebase
    public syncFromFirebase(firebaseData: UserData): void {
        this._updateState({
            currentUser: firebaseData,
            lastSyncTime: new Date().toISOString(),
            isSyncing: false
        });
        this._saveUserData();
    }

    // Función para verificar si el usuario está autenticado
    public isAuthenticated(): boolean {
        return this._state.currentUser !== null;
    }

    // Función para verificar si el store está cargando
    public isLoading(): boolean {
        return this._state.isLoading;
    }

    // Función para obtener cualquier error actual
    public getError(): string | null {
        return this._state.error;
    }

    // Función para verificar si se está sincronizando
    public isSyncing(): boolean {
        return this._state.isSyncing;
    }

    // Función para obtener la última vez que se sincronizó
    public getLastSyncTime(): string | null {
        return this._state.lastSyncTime;
    }

    // Función para limpiar el estado del usuario (logout)
    public clearUser(): void {
        this._updateState({
            currentUser: null,
            error: null,
            isSyncing: false,
            lastSyncTime: null
        });
        this._clearUserData();
    }

    // Función privada para actualizar el estado y notificar a los listeners
    private _updateState(updates: Partial<UserState>): void {
        this._state = {
            ...this._state,
            ...updates
        };
        
        // Notificar a todos los listeners
        this._listeners.forEach(listener => {
            try {
                listener(this.getState());
            } catch (error) {
                console.error('Error en listener del UserStore:', error);
            }
        });
        
        // Emitir evento de cambio para compatibilidad
        this.emit('change');
    }

    // Función privada para manejar las acciones del dispatcher
    private _handleActions(action: FluxAction): void {
        switch (action.type) {
            case 'LOAD_USER_DATA':
                this._handleLoadUserData();
                break;
            
            case 'UPDATE_USER_DATA':
                this._handleUpdateUserData(action.payload as UserData);
                break;
            
            case 'SET_USER_LOADING':
                this._updateState({ 
                    isLoading: action.payload as boolean 
                });
                break;
            
            case 'SET_USER_ERROR':
                this._updateState({ 
                    error: action.payload as string,
                    isLoading: false 
                });
                break;
            
            case 'CLEAR_USER_DATA':
                this.clearUser();
                break;
            
            case 'SYNC_FROM_FIREBASE':
                this._handleSyncFromFirebase(action.payload as UserData);
                break;
            
            case 'SET_SYNC_STATUS':
                this._updateState({ 
                    isSyncing: action.payload as boolean 
                });
                break;
            
            default:
                // Acción no reconocida, no hacer nada
                break;
        }
    }

    // Función privada para manejar la carga de datos del usuario
    private _handleLoadUserData(): void {
        this._updateState({ isLoading: true, error: null });
        
        try {
            const savedData = localStorage.getItem('lulada_user_data');
            if (savedData) {
                const userData = JSON.parse(savedData) as UserData;
                this._updateState({
                    currentUser: userData,
                    isLoading: false,
                    error: null
                });
            } else {
                this._updateState({ 
                    isLoading: false,
                    currentUser: null 
                });
            }
        } catch (error) {
            console.error('Error cargando datos del usuario:', error);
            this._updateState({
                isLoading: false,
                error: 'Error cargando datos del usuario'
            });
        }
    }

    // Función privada para manejar la actualización de datos del usuario
    private _handleUpdateUserData(userData: UserData): void {
        this._updateState({
            currentUser: userData,
            error: null,
            lastSyncTime: new Date().toISOString()
        });
        this._saveUserData();
    }

    // Función privada para manejar sincronización desde Firebase
    private _handleSyncFromFirebase(firebaseData: UserData): void {
        this._updateState({
            isSyncing: true
        });
        
        // Simular un pequeño delay para mostrar el estado de sincronización
        setTimeout(() => {
            this.syncFromFirebase(firebaseData);
        }, 500);
    }

    // Función privada para cargar datos del usuario desde localStorage
    private _loadUserData(): void {
        if (this._isHydrated) return;
        
        try {
            const savedData = localStorage.getItem('lulada_user_data');
            if (savedData) {
                const userData = JSON.parse(savedData) as UserData;
                this._state.currentUser = userData;
                this._state.lastSyncTime = localStorage.getItem('lulada_last_sync') || null;
            }
        } catch (error) {
            console.error('Error cargando datos del usuario desde localStorage:', error);
            this._state.error = 'Error cargando datos guardados';
        } finally {
            this._isHydrated = true;
            this._state.isLoading = false;
        }
    }

    // Función privada para guardar datos del usuario en localStorage
    private _saveUserData(): void {
        try {
            if (this._state.currentUser) {
                localStorage.setItem('lulada_user_data', JSON.stringify(this._state.currentUser));
                if (this._state.lastSyncTime) {
                    localStorage.setItem('lulada_last_sync', this._state.lastSyncTime);
                }
            }
        } catch (error) {
            console.error('Error guardando datos del usuario:', error);
            this._updateState({ 
                error: 'Error guardando datos del usuario' 
            });
        }
    }

    // Función privada para limpiar datos del usuario de localStorage
    private _clearUserData(): void {
        try {
            localStorage.removeItem('lulada_user_data');
            localStorage.removeItem('lulada_last_sync');
        } catch (error) {
            console.error('Error limpiando datos del usuario:', error);
        }
    }

    // Función privada para inicializar sincronización en tiempo real
    private _initializeRealTimeSync(): void {
        // Solo inicializar si no está ya inicializado
        if (this._syncUnsubscribe) return;
        
        try {
            // Importar dinámicamente el servicio de sincronización
            import('../firebase/RealTimeUserSyncService')
                .then(({ RealTimeUserSyncService }) => {
                    this._syncService = RealTimeUserSyncService.getInstance();
                    console.log('✅ Servicio de sincronización en tiempo real inicializado');
                })
                .catch((error) => {
                    console.warn('⚠️ No se pudo inicializar la sincronización en tiempo real:', error);
                });
        } catch (error) {
            console.warn('⚠️ Sincronización en tiempo real no disponible:', error);
        }
    }

    // Función para debug - información del estado actual
    public debug(): void {
        console.group('🔍 UserStore Debug Info');
        console.log('Estado actual:', this._state);
        console.log('Está hidratado:', this._isHydrated);
        console.log('Número de listeners:', this._listeners.size);
        console.log('Tiene servicio de sync:', !!this._syncService);
        console.groupEnd();
    }

    // Función para forzar una re-hidratación desde localStorage
    public forceRehydrate(): void {
        this._isHydrated = false;
        this._loadUserData();
        this._listeners.forEach(listener => {
            try {
                listener(this.getState());
            } catch (error) {
                console.error('Error en listener durante re-hidratación:', error);
            }
        });
    }
}

// Exportamos una instancia única del store (Singleton)
export const userStore = new UserStore();