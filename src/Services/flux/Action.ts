// src/Services/flux/Action.ts - ACTUALIZADO CON NAVEGACIÓN

import { AppDispatcher } from './Dispacher';

// Definir interfaces para los payloads específicos
interface ReviewData {
    username?: string;
    text?: string;
    stars?: number;
    location?: string;
    hasImage?: boolean;
    timestamp?: number;
}

interface NavigationPayload {
    route: string;
    timestamp: number;
}

interface ActiveNavigationPayload {
    navItem: string;
    timestamp: number;
}

export const Actions = {
    // Acción existente
    do: () => {
        AppDispatcher.dispatch({ type: 'ACTION_TYPE', payload: undefined });
    },
    
    // ============================================================================
    // ACCIONES DE NAVEGACIÓN - NUEVAS
    // ============================================================================
    
    // Navegar a una nueva ruta
    navigate: (route: string) => {
        console.log('Actions: Navegando a:', route);
        AppDispatcher.dispatch({ 
            type: 'NAVIGATE_TO_ROUTE', 
            payload: {
                route,
                timestamp: Date.now()
            } as NavigationPayload
        });
    },
    
    // Establecer ruta activa (para sincronización)
    setActiveRoute: (route: string) => {
        console.log('Actions: Estableciendo ruta activa:', route);
        AppDispatcher.dispatch({ 
            type: 'SET_ACTIVE_ROUTE', 
            payload: {
                route,
                timestamp: Date.now()
            } as NavigationPayload
        });
    },
    
    // Establecer navegación activa en sidebar/navbar
    setActiveNavigation: (navItem: string) => {
        console.log('Actions: Estableciendo navegación activa:', navItem);
        AppDispatcher.dispatch({ 
            type: 'SET_ACTIVE_NAVIGATION', 
            payload: {
                navItem,
                timestamp: Date.now()
            } as ActiveNavigationPayload
        });
    },
    
    // Volver a la ruta anterior
    goBack: () => {
        console.log('Actions: Navegando hacia atrás');
        AppDispatcher.dispatch({ 
            type: 'NAVIGATE_BACK', 
            payload: {
                timestamp: Date.now()
            }
        });
    },
    
    // ============================================================================
    // ACCIONES DE ANTOJAR - NUEVAS
    // ============================================================================
    
    // Mostrar popup de antojar
    showAntojar: () => {
        console.log('Actions: Mostrando popup de antojar');
        AppDispatcher.dispatch({ 
            type: 'SHOW_ANTOJAR_POPUP', 
            payload: {
                timestamp: Date.now()
            }
        });
    },
    
    // Ocultar popup de antojar
    hideAntojar: () => {
        console.log('Actions: Ocultando popup de antojar');
        AppDispatcher.dispatch({ 
            type: 'HIDE_ANTOJAR_POPUP', 
            payload: {
                timestamp: Date.now()
            }
        });
    },
    
    // ============================================================================
    // ACCIONES DE PUBLICACIONES - ACTUALIZADAS
    // ============================================================================
    
    // Publicar nueva reseña
    publishReview: (reviewData: ReviewData) => {
        console.log('Actions: Publicando reseña:', reviewData);
        AppDispatcher.dispatch({ 
            type: 'PUBLISH_REVIEW', 
            payload: reviewData 
        });
    },
    
    // Nueva publicación creada (para notificar a otros componentes)
    newPublicationCreated: (reviewData: ReviewData) => {
        console.log('Actions: Nueva publicación creada:', reviewData);
        AppDispatcher.dispatch({
            type: 'NEW_PUBLICATION_CREATED',
            payload: reviewData
        });
    }
};