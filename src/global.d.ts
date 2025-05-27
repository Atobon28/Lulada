// src/global.d.ts - VERSIÓN SIN 'any'
import AntojarPopupService from './Components/Home/Antojar/antojar-popup';
import { UserStore } from './Services/flux/UserStore';
import { UserActions } from './Services/flux/UserActions';


declare global {
  interface Window {
    AntojarPopupService: typeof AntojarPopupService;
    userStore: UserStore;
    UserActions: typeof UserActions;
    debugUserStore: () => void;
    
    // Funciones de debug adicionales - SIN 'any'
    FluxDebug: FluxDebugUtilsType;
    debugFlux: () => void;
    testUsername: (username: string) => void;
    forceUpdateProfile: () => void;
    resetProfile: () => void;
    monitorFlux: () => void;
    debugUserInfo: () => void;
    forceUpdateUserInfo: () => void;
  }
}

export {};