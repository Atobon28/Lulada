// services-global.ts - VERSIÓN LIMPIA Y FUNCIONAL

import { UserActions } from './Services/flux/UserActions';
import { userStore } from './Services/flux/UserStore';

// Inicializar servicios globales
console.log('🚀 Inicializando servicios básicos...');

try {
    // Solo lo básico que sabemos que funciona
    window.UserActions = UserActions;
    window.userStore = userStore;
    
    console.log('✅ Servicios básicos inicializados');

    // Funciones de debug y utilidad
    window.luladaStatus = () => {
        console.log('=== STATUS ===');
        console.log('UserActions:', !!window.UserActions);
        console.log('userStore:', !!window.userStore);
        console.log('Autenticado:', localStorage.getItem('isAuthenticated'));
        console.log('Usuario:', localStorage.getItem('currentUser'));
        console.log('LoadPages:', !!document.querySelector('load-pages'));
        console.log('==============');
        return {
            userActions: !!window.UserActions,
            userStore: !!window.userStore,
            authenticated: localStorage.getItem('isAuthenticated'),
            loadPages: !!document.querySelector('load-pages')
        };
    };

    window.luladaEmergencyLogout = () => {
        console.log('🚨 Logout de emergencia');
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
    };

    window.luladaLogout = () => {
        console.log('🚪 Logout normal');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('currentUser');
        document.dispatchEvent(new CustomEvent('navigate', { detail: '/login' }));
    };
    
} catch (error) {
    console.error('❌ Error crítico:', error);
}

export {};