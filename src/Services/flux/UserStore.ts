
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

// Esta clase maneja todos los datos del usuario en la aplicación
class UserStore extends EventEmitter {
    private _state: UserState;
    private _isHydrated: boolean = false;
    private _syncService: unknown = null;
    private _syncUnsubscribe?: () => void;

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
                
                // También guardar timestamp de última actualización
                localStorage.setItem('userLastUpdate', new Date().toISOString());
                
                console.log('UserStore: Datos guardados en localStorage');
            }
        } catch (error) {
            console.error('UserStore: Error guardando datos:', error);
        }
    }

    // Función privada para inicializar sincronización en tiempo real
    private async _initializeRealTimeSync(): Promise<void> {
        try {
            const syncModule = await import('../firebase/RealTimeUserSyncService');
            this._syncService = syncModule.realTimeUserSync;
            
            // Suscribirse a cambios en el estado de sincronización
            const service = this._syncService as {
                subscribe: (callback: (state: { isSyncing: boolean; lastSyncTime: string | null; error: string | null }) => void) => () => void;
            };
            
            this._syncUnsubscribe = service.subscribe((syncState) => {
                this._state.isSyncing = syncState.isSyncing;
                this._state.lastSyncTime = syncState.lastSyncTime;
                
                // Solo actualizar error si no hay uno más reciente
                if (syncState.error && !this._state.error) {
                    this._state.error = syncState.error;
                }
                
                this._emitChange();
            });
            
            console.log('UserStore: ✅ Sincronización en tiempo real inicializada');
        } catch (error) {
            console.log('UserStore: Sincronización en tiempo real no disponible');
        }
    }

    // Función privada para sincronizar con Firebase - MEJORADA
    private async _syncWithFirebase(): Promise<void> {
        if (!this._state.currentUser) {
            return;
        }

        // No hacer nada si ya hay un servicio de sincronización en tiempo real
        if (this._syncService) {
            return; // El servicio de tiempo real se encarga de la sincronización
        }

        try {
            // Fallback para sincronización manual si no hay tiempo real
            const firebaseModule = await import('../firebase/FirebaseUserSync');
            const firebaseUserSync = firebaseModule.firebaseUserSync;
            
            console.log('[UserStore] Sincronizando cambios con Firebase...');
            const result = await firebaseUserSync.updateUserProfile(this._state.currentUser);
            
            if (result.success) {
                this._state.lastSyncTime = new Date().toISOString();
                console.log('[UserStore] ✅ Sincronización exitosa con Firebase');
            } else {
                console.warn('[UserStore] ⚠️ Error sincronizando con Firebase:', result.error);
            }
        } catch (error) {
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
                    this._syncWithFirebase();
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
                    this._syncWithFirebase();
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
                    this._syncWithFirebase();
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
                    this._syncWithFirebase();
                    this._emitChange();
                } else {
                    console.error('No hay usuario actual para actualizar o no hay datos de actualización');
                }
                break;

            case 'UPDATE_EMAIL':
                if (this._state.currentUser) {
                    this._state.error = null;
                    this._saveUserData();
                    this._syncWithFirebase();
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
                    this._syncWithFirebase();
                    this._emitChange();
                } else {
                    console.error('No hay usuario actual para actualizar');
                }
                break;

            case 'RESET_PROFILE':
                this._state.currentUser = null;
                this._state.error = null;
                this._state.lastSyncTime = null;
                localStorage.removeItem('currentUser');
                localStorage.removeItem('userLastUpdate');
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

            case 'SYNC_FROM_FIREBASE':
                // Acción especial para sincronización desde Firebase sin trigger de vuelta
                this._state.currentUser = action.payload as UserData;
                this._state.error = null;
                this._saveUserData();
                this._emitChange();
                break;

            default:
                console.log('UserStore: Acción no reconocida:', action.type);
        }
    }

    // NUEVA: Función para sincronizar datos desde Firebase (tiempo real)
    public async syncFromFirebase(userData: UserData): Promise<void> {
        console.log('[UserStore] Sincronizando datos desde Firebase (tiempo real)');
        
        // Usar acción especial que no dispara sync de vuelta a Firebase
        AppDispatcher.dispatch({
            type: 'SYNC_FROM_FIREBASE',
            payload: userData
        });
    }

    // NUEVA: Función para verificar si hay conexión con Firebase
    public async hasFirebaseSync(): Promise<boolean> {
        try {
            await import('../firebase/FirebaseUserSync');
            return true;
        } catch {
            return false;
        }
    }

    // NUEVA: Función para obtener información de sincronización
    public getSyncInfo(): { 
        hasRealTimeSync: boolean; 
        lastSyncTime: string | null; 
        isSyncing: boolean;
        lastLocalUpdate: string | null;
    } {
        const lastLocalUpdate = localStorage.getItem('userLastUpdate');
        
        return {
            hasRealTimeSync: !!this._syncService,
            lastSyncTime: this._state.lastSyncTime,
            isSyncing: this._state.isSyncing,
            lastLocalUpdate
        };
    }

    // NUEVA: Función para forzar sincronización manual
    public async forceSync(): Promise<{ success: boolean; error?: string }> {
        if (!this._state.currentUser) {
            return { success: false, error: 'No hay usuario para sincronizar' };
        }

        try {
            if (this._syncService) {
                // Usar servicio de tiempo real
                const service = this._syncService as {
                    forcSync: () => Promise<{ success: boolean; error?: string }>;
                };
                return await service.forcSync();
            } else {
                // Fallback a sincronización manual
                await this._syncWithFirebase();
                return { success: true };
            }
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            };
        }
    }

    // Función para obtener información de debug
    public getDebugInfo(): Record<string, unknown> {
        return {
            currentUser: this._state.currentUser,
            isLoading: this._state.isLoading,
            error: this._state.error,
            isSyncing: this._state.isSyncing,
            lastSyncTime: this._state.lastSyncTime,
            isHydrated: this._isHydrated,
            hasRealTimeSync: !!this._syncService,
            listenerCount: this.listenerCount('change'),
            syncInfo: this.getSyncInfo()
        };
    }

    // Función para limpiar recursos
    public cleanup(): void {
        if (this._syncUnsubscribe) {
            this._syncUnsubscribe();
        }
        this.removeAllListeners();
    }
}

// Crear y exportar una única instancia del store
export const userStore = new UserStore();

// Hacer el store accesible globalmente para debugging
if (typeof window !== 'undefined') {
    (window as typeof window & { userStore: UserStore }).userStore = userStore;
}