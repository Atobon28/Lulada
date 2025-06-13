// services-global.ts - VERSIÓN CORREGIDA Y FUNCIONAL
import { UserActions } from './Services/flux/UserActions';
import { userStore } from './Services/flux/UserStore';

// Extender la interfaz Window para agregar nuestras propiedades
declare global {
    interface Window {
        // Flux User Store y Actions
        UserActions?: typeof UserActions;
        userStore?: typeof userStore;
        
        // Funciones de debug simples
        debugUserInfo?: () => void;
        forceUpdateUserInfo?: () => void;
        debugUserStore?: () => void;
        debugHome?: () => void;
        debugLoadPage?: () => void;
        debugSuggestions?: () => void;
        debugRestaurantNav?: () => void;
        
        // Servicios de Antojar
        AntojarPopupService?: unknown;
        
        // Funciones de utilidad
        luladaStatus?: () => {
            userActions: boolean;
            userStore: boolean;
            authenticated: string | null;
            loadPages: boolean;
        };
        luladaEmergencyLogout?: () => void;
        luladaLogout?: () => void;
    }
}

// Inicializar servicios globales
console.log('🚀 Inicializando servicios básicos...');

try {
    // Solo lo básico que sabemos que funciona
    (window as any).UserActions = UserActions;
    (window as any).userStore = userStore;
    
    console.log('✅ Servicios básicos inicializados');
    
    // Funciones de debug y utilidad
    (window as any).luladaStatus = (): {
        userActions: boolean;
        userStore: boolean;
        authenticated: string | null;
        loadPages: boolean;
    } => {
        console.log('=== STATUS ===');
        console.log('UserActions:', !!(window as any).UserActions);
        console.log('userStore:', !!(window as any).userStore);
        console.log('Autenticado:', localStorage.getItem('isAuthenticated'));
        console.log('Usuario:', localStorage.getItem('currentUser'));
        console.log('LoadPages:', !!document.querySelector('load-pages'));
        console.log('==============');
        return {
            userActions: !!(window as any).UserActions,
            userStore: !!(window as any).userStore,
            authenticated: localStorage.getItem('isAuthenticated'),
            loadPages: !!document.querySelector('load-pages')
        };
    };

    (window as any).luladaEmergencyLogout = (): void => {
        console.log('🚨 Logout de emergencia');
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
    };

    (window as any).luladaLogout = (): void => {
        console.log('🚪 Logout normal');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('currentUser');
        document.dispatchEvent(new CustomEvent('navigate', { detail: '/login' }));
    };
    
} catch (error) {
    console.error('❌ Error crítico:', error);
}

// Exportar un objeto vacío para que TypeScript reconozca esto como un módulo
export {};