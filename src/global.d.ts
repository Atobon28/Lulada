import { UserActions } from '../src/Services/flux/UserActions';
import { UserStore } from '../src/Services/flux/UserStore';
import PublicationsService from '../src/Services/PublicationsService';
import AntojarPopupService from '../src/Components/Home/Antojar/antojar-popup';

declare global {
    interface Window {
        // Flux User Store y Actions
        UserActions?: typeof UserActions;
        userStore?: UserStore;

        // Servicios de Antojar - CONSISTENTE Y OPCIONAL
        AntojarPopupService?: typeof AntojarPopupService;

        // Servicios Lulada
        LuladaServices?: {
            publicationsService: PublicationsService;
            antojarService: AntojarPopupService;
        };

        // Debug utilities
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

        // Funciones de debug simples
        debugUserInfo?: () => void;
        forceUpdateUserInfo?: () => void;
        debugUserStore?: () => void;
        debugHome?: () => void;
        debugLoadPage?: () => void;
        debugSuggestions?: () => void;
        debugRestaurantNav?: () => void;
    }
}

export {};
