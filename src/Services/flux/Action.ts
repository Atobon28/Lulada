// Este archivo maneja todas las acciones que puede hacer el usuario en la aplicación
// Es como un "centro de comandos" que envía órdenes a diferentes partes de la app

import { AppDispatcher } from './Dispacher';

// Aquí definimos qué información necesita cada tipo de acción

// Para cuando alguien escribe una reseña de comida
interface ReviewData {
    username?: string;    // Nombre del usuario
    text?: string;        // Lo que escribió en la reseña
    stars?: number;       // Cuántas estrellas le dio (1-5)
    location?: string;    // En qué zona de Cali está el restaurante
    hasImage?: boolean;   // Si subió una foto o no
    timestamp?: number;   // Cuándo se creó la reseña
}

// Para cuando alguien navega a otra página
interface NavigationPayload {
    route: string;        // A qué página quiere ir (ej: "/home", "/profile")
    timestamp: number;    // Cuándo hizo el click
}

// Para cuando alguien da like o guarda una publicación
interface InteractionPayload {
    publicationId: string;  // ID único de la publicación
    username: string;       // Quién hizo la acción
    timestamp: number;      // Cuándo la hizo
}

// Para cuando cambia qué botón está activo en el menú
interface ActiveNavigationPayload {
    navItem: string;      // Qué botón del menú está seleccionado
    timestamp: number;    // Cuándo se seleccionó
}

// Este es el objeto principal que contiene todas las acciones posibles
export const Actions = {
    // Acción básica de ejemplo (no se usa mucho)
    do: () => {
        AppDispatcher.dispatch({ type: 'ACTION_TYPE', payload: undefined });
    },
    
    // ============================================================================
    // ACCIONES PARA NAVEGAR POR LA APP
    // ============================================================================
    
    // Cuando el usuario quiere ir a otra página
    navigate: (route: string) => {
        console.log('Actions: Navegando a:', route);
        AppDispatcher.dispatch({ 
            type: 'NAVIGATE_TO_ROUTE', 
            payload: {
                route,
                timestamp: Date.now()  // Date.now() da la fecha/hora actual
            } as NavigationPayload
        });
    },
    
    // Para marcar en qué página está el usuario actualmente
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
    
    // Para resaltar qué botón del menú está seleccionado
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
    
    // Para volver a la página anterior (como el botón "atrás" del navegador)
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
    // ACCIONES PARA EL POPUP DE "ANTOJAR" (crear reseñas)
    // ============================================================================
    
    // Para mostrar la ventana donde escribes una reseña
    showAntojar: () => {
        console.log('Actions: Mostrando popup de antojar');
        AppDispatcher.dispatch({ 
            type: 'SHOW_ANTOJAR_POPUP', 
            payload: {
                timestamp: Date.now()
            }
        });
    },
    
    // Para cerrar esa ventana
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
    // ACCIONES PARA LAS PUBLICACIONES (reseñas de restaurantes)
    // ============================================================================
    
    // Cuando alguien publica una nueva reseña
    publishReview: (reviewData: ReviewData) => {
        console.log('Actions: Publicando reseña:', reviewData);
        AppDispatcher.dispatch({ 
            type: 'PUBLISH_REVIEW', 
            payload: reviewData 
        });
    },
    
    // Para avisar a toda la app que se creó una nueva publicación
    newPublicationCreated: (reviewData: ReviewData) => {
        console.log('Actions: Nueva publicación creada:', reviewData);
        AppDispatcher.dispatch({
            type: 'NEW_PUBLICATION_CREATED',
            payload: reviewData
        });
    },

    // Para dar o quitar "like" a una publicación (como Instagram)
    toggleLike:(publicationId: string, username: string)=> {
        console.log('Actions: toggle like en publicación:', publicationId, 'por usuario:', username);
        AppDispatcher.dispatch({
            type: 'TOGGLE_LIKE',
            payload: {
                publicationId,
                username,
                timestamp: Date.now()
            } as InteractionPayload
        });
    },
    
    // Para guardar o quitar de guardados una publicación (como el bookmark)
    toggleBookmark: (publicationId: string, username: string) => {
        console.log('Actions: toggle bookmark en publicación:', publicationId, 'por usuario:', username);
        AppDispatcher.dispatch({
            type: 'TOGGLE_BOOKMARK',
            payload: {
                publicationId,
                username,
                timestamp: Date.now()
            } as InteractionPayload
        });
    },
    
    // Para cargar todos los likes y bookmarks guardados
    loadInteractions: () => {
        console.log('Actions:Cargando interacciones de publicaciones');
        AppDispatcher.dispatch({
            type:'LOAD_INTERACTIONS',
            payload:{
                timestamp:Date.now()
            }
        });
    },
    
    // Para borrar todos los likes y bookmarks (limpiar todo)
    clearAllInteractions: ()=>{
        console.log('Actions:Limpiando todas las intaracciones');
        AppDispatcher.dispatch({
            type: 'CLEAR_INTERACTIONS',
            payload:{
                timestamp: Date.now()
            }
        });
    }
};