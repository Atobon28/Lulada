// services-global.ts - VERSIÓN CORREGIDA Y FUNCIONAL
import { UserActions } from './Services/flux/UserActions';
// import { userStore } from './Services/flux/UserStore'; // ✅ COMENTADO - NO EXISTE AÚN

// ✅ DEFINIR INTERFACES PRIMERO
interface UserStoreInstance {
  debug?: () => void;
  [key: string]: unknown;
}

interface AntojarServiceInstance {
  getInstance(): {
    showPopup(): void;
  };
}

// ✅ EXTENDER INTERFAZ WINDOW CORRECTAMENTE
declare global {
  interface Window {
    // Flux User Store y Actions
    UserActions?: typeof UserActions;
    userStore?: UserStoreInstance;
    
    // Funciones de debug simples
    debugUserInfo?: () => void;
    forceUpdateUserInfo?: () => void;
    debugUserStore?: () => void;
    debugHome?: () => void;
    debugLoadPage?: () => void;
    debugSuggestions?: () => void;
    debugRestaurantNav?: () => void;
    
    // Servicios de Antojar - ✅ TIPADO CORRECTO
    AntojarPopupService?: AntojarServiceInstance;
    
    // Funciones de utilidad
    luladaStatus?: () => void; // ✅ CAMBIAR A VOID PARA CONSISTENCIA
    luladaEmergencyLogout?: () => void;
    luladaLogout?: () => void;
  }
}

// Inicializar servicios globales
console.log('🚀 Inicializando servicios básicos...');

try {
  // Solo lo básico que sabemos que funciona
  window.UserActions = UserActions;
  // window.userStore = userStore as UserStoreInstance; // ✅ COMENTADO - NO EXISTE AÚN
  
  console.log('✅ Servicios básicos inicializados');
  
  // Funciones de debug y utilidad
  window.luladaStatus = (): void => {
    console.log('=== STATUS ===');
    console.log('UserActions:', !!window.UserActions);
    console.log('userStore:', !!window.userStore);
    console.log('Autenticado:', localStorage.getItem('isAuthenticated'));
    console.log('Usuario:', localStorage.getItem('currentUser'));
    console.log('LoadPages:', !!document.querySelector('load-pages'));
    console.log('==============');
    // ✅ NO RETORNA NADA, SOLO IMPRIME
  };

  window.luladaEmergencyLogout = (): void => {
    console.log('🚨 Logout de emergencia');
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  window.luladaLogout = (): void => {
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