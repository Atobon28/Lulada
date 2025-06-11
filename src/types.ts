// Solo importar los tipos que realmente necesitamos para las interfaces
import type PublicationsService from './Services/PublicationsService';
import type AntojarPopupService from './Components/Home/Antojar/antojar-popup';

// Interface para LuladaServices
export interface LuladaServicesType {
    publicationsService: PublicationsService;
    antojarService: AntojarPopupService;
}

// Interface para LuladaDebug
export interface LuladaDebugType {
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
}

// Interface para AntojarService
export interface AntojarServiceType {
    getInstance(): {
        initialize(): void;
        showPopup(): void;
        hidePopup?: () => void;
    };
}

export {};
export type UserType ={
    id:string;
    username:string;
    email:string;
    createdAt:string;
};
export type PostType={
    
}