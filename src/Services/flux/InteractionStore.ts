import { AppDispatcher, Action } from "./Dispacher";

// Define la estructura de datos para las interacciones (likes y bookmarks)
export interface InteractionState {
    likes: { [publicationId: string]: boolean };        // Guarda qué publicaciones tienen like (true/false)
    bookmarks: { [publicationId: string]: boolean };    // Guarda qué publicaciones están guardadas (true/false)
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
    // Estado interno del store - aquí se guardan todos los datos
    private _state: InteractionState = {
        likes: {},           // Empieza vacío - no hay likes
        bookmarks: {},       // Empieza vacío - no hay bookmarks
        isLoading: false,    // No está cargando al inicio
        error: null          // No hay errores al inicio
    };
    
    // Lista de funciones que escuchan cambios en el estado
    private _listeners: InteractionListener[] = [];
    
    // Nombres de las "llaves" donde se guardan los datos en localStorage
    private readonly STORAGE_KEY_LIKES = 'lulada_likes';           // Donde se guardan los likes
    private readonly STORAGE_KEY_BOOKMARKS = 'lulada_bookmarks';   // Donde se guardan los bookmarks

    constructor() {
        // Se registra para escuchar acciones del sistema Flux
        AppDispatcher.register(this._handleActions.bind(this));
        // Carga los datos guardados del navegador al iniciar
        this._loadFromStorage();
    }

    // Función pública para obtener una copia del estado actual
    getState(): InteractionState {
        return { ...this._state };  // Devuelve una copia para evitar modificaciones accidentales
    }

    // Función privada que carga los datos guardados del localStorage del navegador
    private _loadFromStorage(): void {
        console.log('InteractionStore: Cargando datos de interacciones desde localStorage...');
        try {
            // Intenta leer los likes guardados
            const likes = localStorage.getItem(this.STORAGE_KEY_LIKES);
            // Intenta leer los bookmarks guardados
            const bookmarks = localStorage.getItem(this.STORAGE_KEY_BOOKMARKS);
            
            // Si hay likes guardados, los carga al estado
            if (likes) {
                this._state.likes = JSON.parse(likes) as { [key: string]: boolean };
                console.log('likes cargados:', this._state.likes);
            }
            
            // Si hay bookmarks guardados, los carga al estado
            if (bookmarks) {
                this._state.bookmarks = JSON.parse(bookmarks) as { [key: string]: boolean };
                console.log('bookmarks cargados:', this._state.bookmarks);
            }
        } catch (error) {
            // Si algo sale mal al cargar, registra el error
            console.error('Error al cargar datos de interacciones:', error);
            this._state.error = 'Error al cargar datos de interacciones';
        }
    }

    // Función privada que guarda el estado actual en localStorage del navegador
    private _saveToStorage(): void {
        try {
            // Guarda los likes como texto en localStorage
            localStorage.setItem(this.STORAGE_KEY_LIKES, JSON.stringify(this._state.likes));
            // Guarda los bookmarks como texto en localStorage
            localStorage.setItem(this.STORAGE_KEY_BOOKMARKS, JSON.stringify(this._state.bookmarks));
            console.log('Interacciones guardadas en localStorage');
        } catch (error) {
            // Si algo sale mal al guardar, registra el error
            console.error('Error saving interactions to storage:', error);
            this._state.error = 'Error guardando interacciones';
        }
    }

    // Función privada que maneja todas las acciones que llegan del sistema Flux
    private _handleActions(action: Action): void {
        console.log('InteractionStore: Recibida accion:', action.type, action.payload);

        // Decide qué hacer según el tipo de acción
        switch (action.type) {
            case 'TOGGLE_LIKE':
                // Verifica que los datos de la acción sean válidos
                if (this.isToggleInteractionPayload(action.payload)) {
                    const { publicationId } = action.payload;
                    // Obtiene el estado actual del like (true o false)
                    const wasLiked = this._state.likes[publicationId];
                    // Cambia el estado al opuesto (si era true, ahora false y viceversa)
                    this._state.likes[publicationId] = !wasLiked;

                    console.log(`Like ${wasLiked ? 'removido' : 'agregado'} en publicación:`, publicationId);
                    this._state.error = null;    // Limpia cualquier error anterior
                    this._saveToStorage();       // Guarda en localStorage
                    this._emitChange();         // Notifica a todos los componentes que escuchan
                }
                break;

            case 'TOGGLE_BOOKMARK':
                // Verifica que los datos de la acción sean válidos
                if (this.isToggleInteractionPayload(action.payload)) {
                    const { publicationId } = action.payload;
                    // Obtiene el estado actual del bookmark (true o false)
                    const wasBookmarked = this._state.bookmarks[publicationId];
                    // Cambia el estado al opuesto (si era true, ahora false y viceversa)
                    this._state.bookmarks[publicationId] = !wasBookmarked;

                    console.log(`Bookmark ${wasBookmarked ? 'removido' : 'agregado'} en publicación:`, publicationId);
                    this._state.error = null;    // Limpia cualquier error anterior
                    this._saveToStorage();       // Guarda en localStorage
                    this._emitChange();         // Notifica a todos los componentes que escuchan
                }
                break;

            case 'LOAD_INTERACTIONS':
                // Recarga todos los datos desde localStorage
                this._loadFromStorage();
                this._emitChange();  // Notifica que los datos cambiaron
                break;

            case 'CLEAR_INTERACTIONS':
                console.log('Limpiando todas las interacciones...');
                // Resetea todo el estado a valores iniciales (vacío)
                this._state = {
                    likes: {},
                    bookmarks: {},
                    isLoading: false,
                    error: null
                };
                // Borra los datos del localStorage del navegador
                localStorage.removeItem(this.STORAGE_KEY_LIKES);
                localStorage.removeItem(this.STORAGE_KEY_BOOKMARKS);
                this._emitChange();  // Notifica que todo se limpió
                break;

            default:
                // Si la acción no es reconocida, no hace nada
                break;
        }
    }

    // Función que verifica si los datos de la acción tienen el formato correcto
    private isToggleInteractionPayload(payload: unknown): payload is ToggleInteractionPayload {
        return (
            payload !== null &&                    // No es null
            typeof payload === 'object' &&         // Es un objeto
            'publicationId' in payload &&          // Tiene la propiedad 'publicationId'
            typeof (payload as ToggleInteractionPayload).publicationId === 'string'  // Y es un string
        );
    }

    // Función privada que notifica a todos los componentes que escuchan cambios
    private _emitChange(): void {
        console.log('InteractionStore: Emitiendo cambios a', this._listeners.length, 'listeners');
        console.log('Estado actual:', this._state);

        // Recorre todos los componentes que están escuchando
        for (const listener of this._listeners) {
            try {
                // Le dice a cada componente que el estado cambió
                listener(this._state);
            } catch (error) {
                // Si un componente falla, registra el error pero continúa con los demás
                console.error('Error en listener de InteractionStore:', error);
            }
        }
    }

    // Función pública: verifica si una publicación tiene like
    isLiked(publicationId: string): boolean {
        return !!this._state.likes[publicationId];  // !! convierte a true/false
    }

    // Función pública: verifica si una publicación está guardada (bookmark)
    isBookmarked(publicationId: string): boolean {
        return !!this._state.bookmarks[publicationId];  // !! convierte a true/false
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
            // Cuenta cuántos likes hay en total
            totalLikes: Object.values(this._state.likes).filter(Boolean).length,
            // Cuenta cuántos bookmarks hay en total
            totalBookmarks: Object.values(this._state.bookmarks).filter(Boolean).length,
            // Lista de IDs con like
            likedIds: this.getLikePublications(),
            // Lista de IDs con bookmark
            bookmarkedIds: this.getBookmarkPublications()
        };
    }

    // Función pública: permite que un componente escuche cambios en las interacciones
    subscribe(listener: InteractionListener): () => void {
        console.log('InteractionStore: Nuevo listener suscrito. Total:', this._listeners.length + 1);
        // Añade el componente a la lista de "escuchadores"
        this._listeners.push(listener);

        // Inmediatamente le envía el estado actual al nuevo componente
        try {
            listener(this._state);
        } catch (error) {
            console.error('Error en listener inicial de InteractionStore:', error);
        }

        // Devuelve una función para "desuscribirse" (dejar de escuchar)
        return () => {
            this._listeners = this._listeners.filter(l => l !== listener);
            console.log('InteractionStore: Listener desuscrito. Total:', this._listeners.length);
        };
    }

    // Función pública para hacer debugging (ver qué está pasando internamente)
    debug(): void {
        console.log('InteractionStore Debug:');
        console.log('- Estado:', this._state);                                                    // Muestra el estado actual
        console.log('- Listeners:', this._listeners.length);                                     // Cuántos componentes están escuchando
        console.log('- LocalStorage Likes:', localStorage.getItem(this.STORAGE_KEY_LIKES));      // Qué hay guardado en el navegador
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
// Se puede usar escribiendo "debugInteractionStore()" en la consola del navegador
if (typeof window !== 'undefined' && !window.debugInteractionStore) {
    window.debugInteractionStore = (): void => interactionStore.debug();
}