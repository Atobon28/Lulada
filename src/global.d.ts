// global.d.ts - Declaraciones de tipos globales

import { UserActions } from '../src/Services/flux/UserActions';
import { UserStore } from '../src/Services/flux/UserStore';
import PublicationsService from '../src/Services/PublicationsService';
import AntojarPopupService from '../src/Components/Home/Antojar/antojar-popup';

declare global {
    interface Window {
        // Flux User Store y Actions
        UserActions: typeof UserActions;
        userStore: UserStore;

        // Servicios de Antojar
        AntojarPopupService?: {
            getInstance(): {
                initialize(): void;
                showPopup(): void;
                hidePopup?: () => void;
            };
        };

        // Servicios Lulada - EXACTAMENTE como se asigna en index.ts
        LuladaServices?: {
            publicationsService: PublicationsService;
            antojarService: AntojarPopupService;
        };

        // Debug utilities - EXACTAMENTE como se asigna en index.ts
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

        // Debug functions - AGREGADAS las funciones de debug
        debugUserInfo?: () => void;
        forceUpdateUserInfo?: () => void;
        debugUserStore?: () => void;
        debugHome?: () => void;
        debugLoadPage?: () => void;

        // Google Maps API
        google?: unknown;
    }
}

export {};