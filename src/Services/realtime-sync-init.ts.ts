// Inicialización de sincronización en tiempo real sin modificar services-global.ts

let realTimeSyncService: ReturnType<typeof import('./firebase/RealTimeUserSyncService').initializeRealTimeSync> | null = null;

// Función para inicializar la sincronización en tiempo real
export const initRealTimeSync = async (): Promise<void> => {
    try {
        console.log('🚀 Inicializando sincronización en tiempo real...');
        
        const { initializeRealTimeSync } = await import('./firebase/RealTimeUserSyncService');
        realTimeSyncService = initializeRealTimeSync();
        
        console.log('✅ Sincronización en tiempo real inicializada');
        
        // Agregar funciones de debug al objeto global de forma segura
        addDebugFunctions();
        
    } catch (error) {
        console.log('ℹ️ Sincronización en tiempo real no disponible:', error);
    }
};

// Función para agregar funciones de debug al window de forma segura
const addDebugFunctions = (): void => {
    try {
        // Función para debug de sincronización
        Object.defineProperty(window, 'luladaSyncDebug', {
            value: () => {
                console.log('=== SYNC DEBUG ===');
                
                // Debug de userStore
                const userStore = (window as { userStore?: { getDebugInfo?: () => Record<string, unknown> } }).userStore;
                if (userStore && userStore.getDebugInfo) {
                    console.log('UserStore Debug:', userStore.getDebugInfo());
                }
                
                // Debug de realTimeSync
                if (realTimeSyncService && 'getDebugInfo' in realTimeSyncService) {
                    const debugInfo = (realTimeSyncService as { getDebugInfo: () => Record<string, unknown> }).getDebugInfo();
                    console.log('RealTimeSync Debug:', debugInfo);
                }
                
                console.log('==================');
            },
            writable: true,
            configurable: true
        });

        // Función para forzar sincronización
        Object.defineProperty(window, 'luladaForceSync', {
            value: async (): Promise<{ success: boolean; error?: string }> => {
                console.log('🔄 Forzando sincronización...');
                
                const userStore = (window as { userStore?: { forceSync?: () => Promise<{ success: boolean; error?: string }> } }).userStore;
                
                if (userStore && userStore.forceSync) {
                    try {
                        const result = await userStore.forceSync();
                        console.log('Resultado:', result);
                        return result;
                    } catch (error) {
                        console.error('Error:', error);
                        return { success: false, error: 'Error desconocido' };
                    }
                } else {
                    console.log('UserStore no disponible');
                    return { success: false, error: 'UserStore no disponible' };
                }
            },
            writable: true,
            configurable: true
        });

        // Función para obtener estado de sincronización
        Object.defineProperty(window, 'luladaGetSyncStatus', {
            value: (): { status: string; message: string; lastSync?: string } => {
                const userStore = (window as { userStore?: { getSyncInfo?: () => { 
                    hasRealTimeSync: boolean; 
                    lastSyncTime: string | null; 
                    isSyncing: boolean; 
                    lastLocalUpdate: string | null; 
                } } }).userStore;
                
                if (!(userStore && userStore.getSyncInfo)) {
                    return { status: 'unavailable', message: 'UserStore no disponible' };
                }

                const syncInfo = userStore.getSyncInfo();
                
                if (syncInfo.isSyncing) {
                    return { status: 'syncing', message: 'Sincronizando cambios...' };
                } else if (syncInfo.hasRealTimeSync && syncInfo.lastSyncTime) {
                    return { status: 'synced', message: 'Datos sincronizados', lastSync: syncInfo.lastSyncTime };
                } else if (!syncInfo.hasRealTimeSync) {
                    return { status: 'offline', message: 'Trabajando sin conexión' };
                } else {
                    return { status: 'idle', message: 'Listo para sincronizar' };
                }
            },
            writable: true,
            configurable: true
        });

        // Función para reinicializar servicios
        Object.defineProperty(window, 'luladaReinitializeSync', {
            value: async (): Promise<{ success: boolean; error?: string }> => {
                console.log('🔄 Reinicializando sincronización...');
                
                try {
                    // Limpiar servicio existente
                    if (realTimeSyncService && 'cleanup' in realTimeSyncService) {
                        (realTimeSyncService as { cleanup: () => void }).cleanup();
                    }
                    
                    // Reinicializar
                    await initRealTimeSync();
                    
                    console.log('✅ Sincronización reinicializada');
                    return { success: true };
                } catch (error) {
                    console.error('❌ Error reinicializando sincronización:', error);
                    return { success: false, error: String(error) };
                }
            },
            writable: true,
            configurable: true
        });

        console.log('✅ Funciones de debug agregadas al window');
        
    } catch (error) {
        console.warn('⚠️ Error agregando funciones de debug:', error);
    }
};

// Función para obtener el servicio de sincronización (para uso interno)
export const getRealTimeSyncService = (): typeof realTimeSyncService => {
    return realTimeSyncService;
};

// Función para verificar si la sincronización está activa
export const isRealTimeSyncActive = (): boolean => {
    return realTimeSyncService !== null;
};

// Función para escuchar eventos de autenticación
const setupAuthListener = (): void => {
    document.addEventListener('auth-state-changed', (event: Event) => {
        const customEvent = event as CustomEvent<{ isAuthenticated: boolean }>;
        const authState = customEvent.detail;
        
        console.log('🔐 Estado de autenticación cambió:', authState.isAuthenticated);
        
        if (authState.isAuthenticated) {
            console.log('✅ Usuario autenticado, sincronización activa');
        } else {
            console.log('🚪 Usuario desconectado, sincronización pausada');
        }
    });
};

// Auto-inicialización cuando se carga el módulo
(async () => {
    // Esperar un poco para que otros servicios se inicialicen
    setTimeout(async () => {
        await initRealTimeSync();
        setupAuthListener();
    }, 1000);
})();

// Declaraciones para TypeScript (opcional, sin conflictos)
declare global {
    interface Window {
        luladaSyncDebug?: () => void;
        luladaForceSync?: () => Promise<{ success: boolean; error?: string }>;
        luladaGetSyncStatus?: () => { status: string; message: string; lastSync?: string };
        luladaReinitializeSync?: () => Promise<{ success: boolean; error?: string }>;
    }
}