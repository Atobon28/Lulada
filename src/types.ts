// types.ts - Actualizado con tipos globales y los existentes

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

// Interface para AntojarService - ACTUALIZADA
export interface AntojarServiceType {
    getInstance(): {
        initialize(): void;
        showPopup(): void;
        hidePopup(): void;
        togglePopup(): void;
    };
}

// Tipos de usuario
export type UserType = {
    id: string;
    username: string;
    email: string;
    createdAt: string;
};

export type PostType = {
    id: string;
    username: string;
    text: string;
    timestamp: number;
    stars: number;
    location?: string;
    hasImage?: boolean;
    imageUrl?: string;
};

// Datos del usuario para la app
export interface UserData {
    foto: string;
    nombreDeUsuario: string;
    nombre: string;
    descripcion: string;
    locationText?: string;
    menuLink?: string;
    rol: string;
}

// Interface para UserActions
export interface UserActionsType {
    loadUserData(userData: UserData): void;
    updateUserData(userData: UserData): void;
    updateUsername(newUsername: string): void;
    updateFullName(newName: string): void;
    updateDescription(newDescription: string): void;
    updatePhoto(newPhotoUrl: string): void;
    updateLocation(newLocation: string): void;
    updateRole(newRole: string): void;
    updatePassword(newPassword: string): void;
    resetProfile(): void;
}

// DECLARACIONES GLOBALES PARA WINDOW
declare global {
    interface Window {
        // Servicios de Usuario
        UserActions: UserActionsType;
        
        // Servicios de Antojar
        AntojarPopupService: AntojarServiceType;
        
        // Funciones de debug
        debugSuggestions(): void;
        debugUserInfo(): void;
        debugHome(): void;
        debugLoadPage(): void;
        debugRestaurantNav(): void;
        
        // Funciones de utilidad
        luladaStatus(): void;
        luladaLogout(): void;
        luladaEmergencyLogout(): void;
        
        // Función para guardar rol
        saveUserRole(role: 'persona' | 'restaurante'): void;
        
        // Store de usuario (opcional)
        userStore?: {
            getState(): UserState;
            getCurrentUser(): UserData | null;
            subscribe(callback: (state: UserState) => void): void;
            unsubscribe(callback: (state: UserState) => void): void;
        };
    }
}

// Estado del usuario
export interface UserState {
    currentUser: UserData | null;
    isLoading: boolean;
    error: string | null;
    isSyncing: boolean;
    lastSyncTime: string | null;
}

export {};