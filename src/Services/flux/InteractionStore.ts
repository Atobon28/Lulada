import { AppDispatcher, Action } from "./Dispacher";

// Define la estructura de datos para las interacciones (likes y bookmarks)
export interface InteractionState {
    likes: { [publicationId: string]: boolean };        // Guarda qué publicaciones tienen like
    bookmarks: { [publicationId: string]: boolean };    // Guarda qué publicaciones están guardadas
    isLoading: boolean;                                  // Indica si se están cargando datos
    error: string | null;                                // Guarda mensajes de error si algo sale mal
}

// Define el tipo de función que escucha cambios en las interacciones
type InteractionListener = (state: InteractionState) => void;

// Define la estructura de datos que se envía cuando se hace toggle de like/bookmark
interface ToggleInteractionPayload {
    publicationId: string;  // El ID de la publicación que se está cambiando
}

// Clase principal que maneja todas las interacciones (likes y bookmarks)
export class InteractionStore {
    // Estado interno del store
    private _state: InteractionState = {
        likes: {},
        bookmarks: {},
        isLoading: false,
        error: null
    };
    
    // Lista de funciones que escuchan cambios en el estado
    private _listeners: InteractionListener[] = [];
    
    // Nombres de las llaves donde se guardan los datos en localStorage
    private readonly STORAGE_KEY_LIKES = 'lulada_likes';
    private readonly STORAGE_KEY_BOOKMARKS = 'lulada_bookmarks';

    constructor() {
        AppDispatcher.register(this._handleActions.bind(this));
        this._loadFromStorage();
    }

    // Función pública para obtener una copia del estado actual
    getState(): InteractionState {
        return { ...this._state };
    }

    // Función privada que carga los datos guardados del localStorage
    private _loadFromStorage(): void {
        console.log('InteractionStore: Cargando datos de interacciones desde localStorage...');
        try {
            const likes = localStorage.getItem(this.STORAGE_KEY_LIKES);
            const bookmarks = localStorage.getItem(this.STORAGE_KEY_BOOKMARKS);
            
            if (likes) {
                this._state.likes = JSON.parse(likes) as { [key: string]: boolean };
                console.log('likes cargados:', this._state.likes);
            }
            
            if (bookmarks) {
                this._state.bookmarks = JSON.parse(bookmarks) as { [key: string]: boolean };
                console.log('bookmarks cargados:', this._state.bookmarks);
            }
        } catch (error) {
            console.error('Error al cargar datos de interacciones:', error);
            this._state.error = 'Error al cargar datos de interacciones';
        }
    }

    // Función privada que guarda el estado actual en localStorage
    private _saveToStorage(): void {
        try {
            localStorage.setItem(this.STORAGE_KEY_LIKES, JSON.stringify(this._state.likes));
            localStorage.setItem(this.STORAGE_KEY_BOOKMARKS, JSON.stringify(this._state.bookmarks));
            console.log('Interacciones guardadas en localStorage');
        } catch (error) {
            console.error('Error saving interactions to storage:', error);
            this._state.error = 'Error guardando interacciones';
        }
    }

    // Función privada que maneja todas las acciones que llegan del sistema Flux
    private _handleActions(action: Action): void {
        console.log('InteractionStore: Recibida accion:', action.type, action.payload);

        switch (action.type) {
            case 'TOGGLE_LIKE':
                if (this.isToggleInteractionPayload(action.payload)) {
                    const { publicationId } = action.payload;
                    const wasLiked = this._state.likes[publicationId];
                    this._state.likes[publicationId] = !wasLiked;

                    console.log(`Like ${wasLiked ? 'removido' : 'agregado'} en publicación:`, publicationId);
                    this._state.error = null;
                    this._saveToStorage();
                    this._emitChange();
                }
                break;

            case 'TOGGLE_BOOKMARK':
                if (this.isToggleInteractionPayload(action.payload)) {
                    const { publicationId } = action.payload;
                    const wasBookmarked = this._state.bookmarks[publicationId];
                    this._state.bookmarks[publicationId] = !wasBookmarked;

                    console.log(`Bookmark ${wasBookmarked ? 'removido' : 'agregado'} en publicación:`, publicationId);
                    this._state.error = null;
                    this._saveToStorage();
                    this._emitChange();
                }
                break;

            case 'LOAD_INTERACTIONS':
                this._loadFromStorage();
                this._emitChange();
                break;

            case 'CLEAR_INTERACTIONS':
                console.log('Limpiando todas las interacciones...');
                this._state = {
                    likes: {},
                    bookmarks: {},
                    isLoading: false,
                    error: null
                };
                localStorage.removeItem(this.STORAGE_KEY_LIKES);
                localStorage.removeItem(this.STORAGE_KEY_BOOKMARKS);
                this._emitChange();
                break;

            default:
                break;
        }
    }

    // Función que verifica si los datos de la acción tienen el formato correcto
    private isToggleInteractionPayload(payload: unknown): payload is ToggleInteractionPayload {
        return (
            payload !== null &&
            typeof payload === 'object' &&
            'publicationId' in payload &&
            typeof (payload as ToggleInteractionPayload).publicationId === 'string'
        );
    }

    // Función privada que notifica a todos los componentes que escuchan cambios
    private _emitChange(): void {
        console.log('InteractionStore: Emitiendo cambios a', this._listeners.length, 'listeners');
        console.log('Estado actual:', this._state);

        for (const listener of this._listeners) {
            try {
                listener(this._state);
            } catch (error) {
                console.error('Error en listener de InteractionStore:', error);
            }
        }
    }

    // Función pública: verifica si una publicación tiene like
    isLiked(publicationId: string): boolean {
        return !!this._state.likes[publicationId];
    }

    // Función pública: verifica si una publicación está guardada (bookmark)
    isBookmarked(publicationId: string): boolean {
        return !!this._state.bookmarks[publicationId];
    }

    // Función pública: obtiene lista de IDs de publicaciones con like
    getLikePublications(): string[] {
        return Object.keys(this._state.likes).filter(id => this._state.likes[id]);
    }

    // Función pública: obtiene lista de IDs de publicaciones guardadas
    getBookmarkPublications(): string[] {
        return Object.keys(this._state.bookmarks).filter(id => this._state.bookmarks[id]);
    }

    // Función pública: obtiene estadísticas generales de las interacciones
    getStats() {
        return {
            totalLikes: Object.values(this._state.likes).filter(Boolean).length,
            totalBookmarks: Object.values(this._state.bookmarks).filter(Boolean).length,
            likedIds: this.getLikePublications(),
            bookmarkedIds: this.getBookmarkPublications()
        };
    }

    // Función pública: permite que un componente escuche cambios en las interacciones
    subscribe(listener: InteractionListener): () => void {
        console.log('InteractionStore: Nuevo listener suscrito. Total:', this._listeners.length + 1);
        this._listeners.push(listener);

        // Inmediatamente le envía el estado actual al nuevo componente
        try {
            listener(this._state);
        } catch (error) {
            console.error('Error en listener inicial de InteractionStore:', error);
        }

        // Devuelve una función para "desuscribirse"
        return () => {
            this._listeners = this._listeners.filter(l => l !== listener);
            console.log('InteractionStore: Listener desuscrito. Total:', this._listeners.length);
        };
    }

    // Función pública para hacer debugging
    debug(): void {
        console.log('InteractionStore Debug:');
        console.log('- Estado:', this._state);
        console.log('- Listeners:', this._listeners.length);
        console.log('- LocalStorage Likes:', localStorage.getItem(this.STORAGE_KEY_LIKES));
        console.log('- LocalStorage Bookmarks:', localStorage.getItem(this.STORAGE_KEY_BOOKMARKS));
    }
}

// Crea una instancia única del store que se usará en toda la aplicación
export const interactionStore = new InteractionStore();

// Extiende la interfaz Window para incluir funciones de debugging
declare global {
    interface Window {
        debugInteractionStore?: () => void;
    }
}

// Hace que la función de debug esté disponible globalmente en el navegador
if (typeof window !== 'undefined' && !window.debugInteractionStore) {
    window.debugInteractionStore = (): void => interactionStore.debug();
}