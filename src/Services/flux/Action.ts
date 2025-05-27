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

export const Actions = {
    // Acción existente
    do: () => {
        AppDispatcher.dispatch({ type: 'ACTION_TYPE', payload: undefined });
    },
    
    // Nuevas acciones para navegación
    navigate: (route: string) => {
        AppDispatcher.dispatch({ 
            type: 'NAVIGATE', 
            payload: route 
        });
    },
    
    setActiveNav: (navItem: string) => {
        AppDispatcher.dispatch({ 
            type: 'SET_ACTIVE_NAV', 
            payload: navItem 
        });
    },
    
    // Nuevas acciones para antojar
    showAntojar: () => {
        AppDispatcher.dispatch({ 
            type: 'SHOW_ANTOJAR', 
            payload: undefined 
        });
    },
    
    hideAntojar: () => {
        AppDispatcher.dispatch({ 
            type: 'HIDE_ANTOJAR', 
            payload: undefined 
        });
    },
    
    publishReview: (reviewData: ReviewData) => {
        AppDispatcher.dispatch({ 
            type: 'PUBLISH_REVIEW', 
            payload: reviewData 
        });
    }
};