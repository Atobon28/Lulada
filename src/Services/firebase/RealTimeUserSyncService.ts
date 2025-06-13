import { onSnapshot, doc, Unsubscribe } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Auth, db } from './firebase';
import { firebaseUserSync } from './FirebaseUserSync';
import { userStore } from '../flux/UserStore';
import { UserData } from '../flux/UserActions';

interface FirebaseUserDocument {
    uid: string;
    email: string;
    nombre: string;
    nombreDeUsuario: string;
    descripcion: string;
    foto: string;
    rol: string;
    locationText?: string;
    menuLink?: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: string | undefined;
}

type SyncStateListener = (state: SyncState) => void;

interface SyncState {
    isConnected: boolean;
    isAuthenticated: boolean;
    isSyncing: boolean;
    lastSyncTime: string | null;
    error: string | null;
}

export class RealTimeUserSyncService {
    private static instance: RealTimeUserSyncService;
    private authUnsubscribe?: Unsubscribe;
    private firestoreUnsubscribe?: Unsubscribe;
    private currentUser: User | null = null;
    private lastSyncedUser: UserData | null = null; // NUEVO: Almacenar última versión sincronizada
    private syncState: SyncState = {
        isConnected: false,
        isAuthenticated: false,
        isSyncing: false,
        lastSyncTime: null,
        error: null
    };
    private listeners: SyncStateListener[] = [];
    private syncQueue: Array<() => Promise<void>> = [];
    private isSyncingQueue = false;
    private syncDebounceTimer: NodeJS.Timeout | null = null; // NUEVO: Timer para debounce

    private constructor() {
        this.initializeRealTimeSync();
    }

    public static getInstance(): RealTimeUserSyncService {
        if (!RealTimeUserSyncService.instance) {
            RealTimeUserSyncService.instance = new RealTimeUserSyncService();
        }
        return RealTimeUserSyncService.instance;
    }

    /**
     * Inicializa la sincronización en tiempo real
     */
    private initializeRealTimeSync(): void {
        console.log('[RealTimeSync] 🚀 Inicializando sincronización en tiempo real...');

        // Escuchar cambios de autenticación
        this.authUnsubscribe = onAuthStateChanged(Auth, (user: User | null) => {
            this.handleAuthStateChange(user);
        });

        // Escuchar cambios en el store local
        userStore.subscribe(this.handleLocalStoreChange.bind(this));

        console.log('[RealTimeSync] ✅ Listeners configurados');
    }

    /**
     * Maneja cambios en el estado de autenticación
     */
    private async handleAuthStateChange(user: User | null): Promise<void> {
        console.log('[RealTimeSync] 🔐 Estado de auth cambió:', user?.uid || 'No autenticado');

        // Limpiar listeners anteriores
        if (this.firestoreUnsubscribe) {
            this.firestoreUnsubscribe();
            this.firestoreUnsubscribe = undefined;
        }

        this.currentUser = user;
        this.syncState.isAuthenticated = !!user;

        if (user) {
            // Usuario autenticado: configurar listener de Firestore
            await this.setupFirestoreListener(user.uid);
            this.syncState.isConnected = true;
        } else {
            // Usuario no autenticado: limpiar estado
            this.syncState.isConnected = false;
            this.syncState.lastSyncTime = null;
        }

        this.syncState.error = null;
        this.notifyListeners();
    }

    /**
     * Configura el listener de Firestore para el usuario actual
     */
    private async setupFirestoreListener(uid: string): Promise<void> {
        try {
            console.log('[RealTimeSync] 📡 Configurando listener de Firestore para:', uid);

            const userDocRef = doc(db, 'users', uid);
            
            this.firestoreUnsubscribe = onSnapshot(
                userDocRef,
                (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        console.log('[RealTimeSync] 📥 Datos actualizados desde Firebase');
                        this.handleFirestoreUpdate(docSnapshot.data() as FirebaseUserDocument);
                    } else {
                        console.log('[RealTimeSync] ⚠️ Documento de usuario no existe en Firestore');
                    }
                },
                (error) => {
                    console.error('[RealTimeSync] ❌ Error en listener de Firestore:', error);
                    this.syncState.error = error.message;
                    this.syncState.isConnected = false;
                    this.notifyListeners();
                }
            );

            console.log('[RealTimeSync] ✅ Listener de Firestore configurado');
        } catch (error) {
            console.error('[RealTimeSync] ❌ Error configurando listener:', error);
            this.syncState.error = error instanceof Error ? error.message : 'Error desconocido';
            this.notifyListeners();
        }
    }

    /**
     * Maneja actualizaciones desde Firestore
     */
    private async handleFirestoreUpdate(firestoreData: FirebaseUserDocument): Promise<void> {
        try {
            // Evitar bucles de sincronización
            if (this.syncState.isSyncing) {
                console.log('[RealTimeSync] 🔄 Evitando bucle de sincronización');
                return;
            }

            // Convertir datos de Firestore a formato UserData
            const userData: UserData = {
                foto: firestoreData.foto,
                nombreDeUsuario: firestoreData.nombreDeUsuario,
                nombre: firestoreData.nombre,
                descripcion: firestoreData.descripcion,
                rol: firestoreData.rol,
                locationText: firestoreData.locationText,
                menuLink: firestoreData.menuLink
            };

            // Verificar si hay cambios reales comparando con el store local
            const currentUser = userStore.getCurrentUser();
            if (this.areUsersEqual(currentUser, userData)) {
                console.log('[RealTimeSync] 📊 No hay cambios desde Firestore, omitiendo actualización');
                return;
            }

            console.log('[RealTimeSync] 🔄 Sincronizando datos desde Firestore al store local');
            
            // Actualizar lastSyncedUser antes de actualizar el store
            this.lastSyncedUser = { ...userData };
            
            // Actualizar store local sin disparar sync a Firebase
            await userStore.syncFromFirebase(userData);
            
            this.syncState.lastSyncTime = new Date().toISOString();
            this.syncState.error = null;
            this.notifyListeners();

            console.log('[RealTimeSync] ✅ Sincronización desde Firestore completada');
        } catch (error) {
            console.error('[RealTimeSync] ❌ Error procesando actualización de Firestore:', error);
            this.syncState.error = error instanceof Error ? error.message : 'Error de sincronización';
            this.notifyListeners();
        }
    }

    /**
     * Maneja cambios en el store local con debounce
     */
    private handleLocalStoreChange(): void {
        const currentUser = userStore.getCurrentUser();
        
        if (!currentUser || !this.currentUser || this.syncState.isSyncing) {
            return;
        }

        // Verificar si realmente hay cambios comparando con la última versión sincronizada
        if (this.areUsersEqual(this.lastSyncedUser, currentUser)) {
            console.log('[RealTimeSync] 📊 No hay cambios reales, omitiendo sincronización');
            return;
        }

        console.log('[RealTimeSync] 🔄 Detectados cambios locales, programando sincronización');
        
        // Limpiar timer anterior si existe
        if (this.syncDebounceTimer) {
            clearTimeout(this.syncDebounceTimer);
        }
        
        // Programar sincronización con debounce de 500ms
        this.syncDebounceTimer = setTimeout(() => {
            console.log('[RealTimeSync] ⏰ Ejecutando sincronización programada');
            this.queueSync(() => this.syncLocalChangesToFirebase(currentUser));
        }, 500);
    }

    /**
     * Sincroniza cambios locales a Firebase
     */
    private async syncLocalChangesToFirebase(userData: UserData): Promise<void> {
        if (!this.currentUser || this.syncState.isSyncing) {
            return;
        }

        try {
            this.syncState.isSyncing = true;
            this.notifyListeners();

            console.log('[RealTimeSync] 📤 Sincronizando cambios locales a Firebase');

            const result = await firebaseUserSync.updateUserProfile(userData);
            
            if (result.success) {
                // Actualizar la última versión sincronizada
                this.lastSyncedUser = { ...userData };
                
                this.syncState.lastSyncTime = new Date().toISOString();
                this.syncState.error = null;
                console.log('[RealTimeSync] ✅ Cambios locales sincronizados a Firebase');
            } else {
                throw new Error(result.error || 'Error desconocido en Firebase');
            }
        } catch (error) {
            console.error('[RealTimeSync] ❌ Error sincronizando a Firebase:', error);
            this.syncState.error = error instanceof Error ? error.message : 'Error de sincronización';
        } finally {
            this.syncState.isSyncing = false;
            this.notifyListeners();
        }
    }

    /**
     * Agrega operación de sincronización a la cola
     */
    private queueSync(syncOperation: () => Promise<void>): void {
        this.syncQueue.push(syncOperation);
        this.processSyncQueue();
    }

    /**
     * Procesa la cola de sincronización
     */
    private async processSyncQueue(): Promise<void> {
        if (this.isSyncingQueue || this.syncQueue.length === 0) {
            return;
        }

        this.isSyncingQueue = true;

        while (this.syncQueue.length > 0) {
            const syncOperation = this.syncQueue.shift();
            if (syncOperation) {
                try {
                    await syncOperation();
                    // Pequeña pausa entre operaciones para evitar race conditions
                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                    console.error('[RealTimeSync] ❌ Error en operación de cola:', error);
                }
            }
        }

        this.isSyncingQueue = false;
    }

    /**
     * Compara dos objetos UserData para detectar cambios
     */
    private areUsersEqual(user1: UserData | null, user2: UserData | null): boolean {
        if (!user1 || !user2) return user1 === user2;
        
        return (
            user1.nombre === user2.nombre &&
            user1.nombreDeUsuario === user2.nombreDeUsuario &&
            user1.descripcion === user2.descripcion &&
            user1.foto === user2.foto &&
            user1.rol === user2.rol &&
            user1.locationText === user2.locationText &&
            user1.menuLink === user2.menuLink
        );
    }

    /**
     * Fuerza una sincronización manual
     */
    public async forcSync(): Promise<{ success: boolean; error?: string }> {
        if (!this.currentUser) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        const currentUser = userStore.getCurrentUser();
        if (!currentUser) {
            return { success: false, error: 'No hay datos de usuario para sincronizar' };
        }

        try {
            await this.syncLocalChangesToFirebase(currentUser);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            };
        }
    }

    /**
     * Obtiene el estado actual de sincronización
     */
    public getSyncState(): SyncState {
        return { ...this.syncState };
    }

    /**
     * Suscribirse a cambios en el estado de sincronización
     */
    public subscribe(listener: SyncStateListener): () => void {
        this.listeners.push(listener);
        
        // Enviar estado actual inmediatamente
        listener(this.syncState);
        
        // Retornar función para desuscribirse
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    /**
     * Notifica a todos los listeners sobre cambios de estado
     */
    private notifyListeners(): void {
        this.listeners.forEach(listener => {
            try {
                listener(this.syncState);
            } catch (error) {
                console.error('[RealTimeSync] Error en listener:', error);
            }
        });
    }

    /**
     * Limpia todos los listeners y recursos
     */
    public cleanup(): void {
        if (this.authUnsubscribe) {
            this.authUnsubscribe();
        }
        if (this.firestoreUnsubscribe) {
            this.firestoreUnsubscribe();
        }
        if (this.syncDebounceTimer) {
            clearTimeout(this.syncDebounceTimer);
        }
        this.listeners = [];
        this.syncQueue = [];
        this.lastSyncedUser = null;
    }

    /**
     * Información de debug
     */
    public getDebugInfo(): Record<string, unknown> {
        return {
            syncState: this.syncState,
            hasAuthListener: !!this.authUnsubscribe,
            hasFirestoreListener: !!this.firestoreUnsubscribe,
            currentUser: this.currentUser?.uid || null,
            lastSyncedUser: this.lastSyncedUser,
            listenersCount: this.listeners.length,
            queueSize: this.syncQueue.length,
            isProcessingQueue: this.isSyncingQueue,
            hasDebounceTimer: !!this.syncDebounceTimer
        };
    }
}

// Exportar instancia única
export const realTimeUserSync = RealTimeUserSyncService.getInstance();

// Función de conveniencia para inicializar
export const initializeRealTimeSync = (): RealTimeUserSyncService => {
    return RealTimeUserSyncService.getInstance();
};