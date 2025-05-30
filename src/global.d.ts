import { UserActions } from '../src/Services/flux/UserActions';
import { UserStore } from '../src/Services/flux/UserStore';
import PublicationsService from '../src/Services/PublicationsService';
import AntojarPopupService from '../src/Components/Home/Antojar/antojar-popup';

declare global {
    interface Window {
        // Flux User Store y Actions - ESENCIALES PARA EL CAMBIO DE USERNAME
        UserActions: typeof UserActions;
        userStore: UserStore;

        // Servicios de Antojar - ESENCIALES PARA EL POPUP DE RESEÑAS
        AntojarPopupService?: {
            getInstance(): {
                initialize(): void;
                showPopup(): void;
                hidePopup?: () => void;
            };
        };

        // Servicios Lulada - ESENCIALES
        LuladaServices?: {
            publicationsService: PublicationsService;
            antojarService: AntojarPopupService;
        };

        // Debug utilities básicos - ÚTILES PERO NO PROBLEMÁTICOS
        LuladaDebug?: {
            services: {
                publications: PublicationsService;
                antojar: AntojarPopupService;
            };
            components: {
                registered: Array<{
                    name: string;
                    registered: boolean;
                }>;
            };
        };

        // Funciones de debug simples - ÚTILES PARA EL USUARIO
        debugUserInfo?: () => void;
        forceUpdateUserInfo?: () => void;
        debugUserStore?: () => void;
        debugHome?: () => void;
        debugLoadPage?: () => void;
        debugSuggestions?: () => void;
        debugRestaurantNav?: () => void;

        // Google Maps API
        google?: unknown;
    }
}

export {};