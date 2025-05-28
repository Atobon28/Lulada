// src/types.ts - Tipos centralizados para toda la aplicación

// Solo importar los tipos que realmente necesitamos para las interfaces
import type PublicationsService from './Services/PublicationsService';
import type AntojarPopupService from './Components/Home/Antojar/antojar-popup';

// ============================================================================
// INTERFACES PRINCIPALES
// ============================================================================

// Interface para LuladaServices - DEBE coincidir con lo asignado en index.ts
export interface LuladaServicesType {
    publicationsService: PublicationsService;
    antojarService: AntojarPopupService;
}

// Interface para LuladaDebug - DEBE coincidir con lo asignado en index.ts
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

// ============================================================================
// EXTENSIÓN DE WINDOW - SIN REDECLARAR
// ============================================================================

// Los tipos para Window ya están declarados en global.d.ts
// NO redeclarar aquí para evitar conflictos

export {};