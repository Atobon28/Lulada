// types/global.d.ts

import { UserActions } from '../src/Services/flux/UserActions';
import { UserStore } from '../src/Services/flux/UserStore';

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
            };
        };

        // Servicios Lulada
        LuladaServices?: {
            locationService: unknown;
            publicationsService: unknown;
            antojarService: unknown;
        };

        // Debug utilities
        LuladaDebug?: {
            services: {
                location: unknown;
                publications: unknown;
                antojar: unknown;
            };
            components: {
                registered: Array<{
                    name: string;
                    registered: boolean;
                }>;
            };
            googleMaps: {
                available: boolean;
                components: string[];
            };
        };

        // Debug functions
        debugUserInfo?: () => void;
        forceUpdateUserInfo?: () => void;
        debugUserStore?: () => void;

        // Google Maps API
        google?: unknown;
    }
}

export {};