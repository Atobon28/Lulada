// Importamos las herramientas que necesitamos para manejar eventos y acciones
import { AppDispatcher, Action } from "./Dispacher";

// Definimos cómo se ve una publicación guardada
export interface SavedPublication {
    id: string;           // Un código único para identificar la publicación
    username: string;     // El nombre del usuario que escribió la reseña
    text: string;         // El texto de la reseña
    stars: number;        // Cuántas estrellas le dio (1-5)
    hasImage?: boolean;   // Si la reseña tiene foto (opcional)
    restaurant?: string;  // El nombre del restaurante (opcional)
    location?: string;    // La zona de Cali donde está (opcional)
    timestamp: number;    // Cuándo se guardó la publicación
}

// Definimos cómo se ve el estado completo de las publicaciones guardadas
export interface SavedPublicationsState {
    savedPublications: SavedPublication[];  // Lista de todas las publicaciones guardadas
    isLoading: boolean;                     // Si estamos cargando algo
    error: string | null;                   // Si hay algún error
}

// Definimos qué información necesitamos para quitar una publicación de guardados
interface UnsavePublicationPayload {
    publicationId: string;  // Solo necesitamos el ID de la publicación a quitar
}

// Definimos qué tipo de función puede "escuchar" cambios en las publicaciones guardadas
type SavedPublicationsListener = (state: SavedPublicationsState) => void;

// Esta es la clase principal que maneja todas las publicaciones guardadas
export class SavedPublicationsStore {
    // El estado actual de nuestras publicaciones guardadas
    private _state: SavedPublicationsState = {
        savedPublications: [],  // Empezamos con una lista vacía
        isLoading: false,       // No estamos cargando nada al principio
        error: null            // No hay errores al principio
    };
    
    // Lista de funciones que quieren saber cuando algo cambia
    private _listeners: SavedPublicationsListener[] = [];
    
    // El nombre que usamos para guardar las publicaciones en el navegador
    private readonly STORAGE_KEY = 'lulada_saved_publications';

    // Constructor: se ejecuta cuando creamos una nueva instancia
    constructor() {
        // Nos registramos para escuchar todas las acciones que pasen
        AppDispatcher.register(this._handleActions.bind(this));
        // Cargamos las publicaciones que ya estaban guardadas
        this._loadFromStorage();
    }

    // Función para obtener una copia del estado actual
    getState(): SavedPublicationsState {
        return { ...this._state };  // Devolvemos una copia, no el original
    }

    // Función privada para cargar las publicaciones desde el navegador
    private _loadFromStorage(): void {
        console.log('SavedPublicationsStore: Cargando publicaciones guardadas...');
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                this._state.savedPublications = JSON.parse(saved) as SavedPublication[];
                console.log('Publicaciones guardadas cargadas:', this._state.savedPublications.length);
            }
        } catch (error) {
            console.error('Error al cargar publicaciones guardadas:', error);
            this._state.error = 'Error al cargar publicaciones guardadas';
        }
    }

    // Función privada para guardar las publicaciones en el navegador
    private _saveToStorage(): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._state.savedPublications));
            console.log('Publicaciones guardadas en localStorage');
        } catch (error) {
            console.error('Error guardando publicaciones:', error);
            this._state.error = 'Error guardando publicaciones';
        }
    }

    // Función que verifica si los datos para quitar una publicación están bien
    private isUnsavePayload(payload: unknown): payload is UnsavePublicationPayload {
        return (
            payload !== null &&
            typeof payload === 'object' &&
            'publicationId' in payload &&
            typeof (payload as UnsavePublicationPayload).publicationId === 'string'
        );
    }

    // Función que maneja todas las acciones que pueden pasar
    private _handleActions(action: Action): void {
        console.log('SavedPublicationsStore: Recibida acción:', action.type);

        switch (action.type) {
            case 'SAVE_PUBLICATION':  // Cuando alguien quiere guardar una publicación
                if (action.payload && typeof action.payload === 'object') {
                    const publication = action.payload as SavedPublication;
                    
                    // Verificamos si ya está guardada para no duplicarla
                    const exists = this._state.savedPublications.find(p => p.id === publication.id);
                    if (!exists) {
                        this._state.savedPublications.unshift(publication);
                        this._saveToStorage();
                        this._emitChange();
                        console.log('Publicación guardada:', publication.id);
                    }
                }
                break;

            case 'UNSAVE_PUBLICATION':  // Cuando alguien quiere quitar una publicación
                if (this.isUnsavePayload(action.payload)) {
                    const { publicationId } = action.payload;
                    this._state.savedPublications = this._state.savedPublications.filter(p => p.id !== publicationId);
                    this._saveToStorage();
                    this._emitChange();
                    console.log('Publicación removida de guardados:', publicationId);
                }
                break;

            case 'CLEAR_SAVED_PUBLICATIONS':  // Cuando alguien quiere borrar todo
                this._state.savedPublications = [];
                localStorage.removeItem(this.STORAGE_KEY);
                this._emitChange();
                console.log('Todas las publicaciones guardadas eliminadas');
                break;

            default:
                break;
        }
    }

    // Función que avisa a todos los interesados que algo cambió
    private _emitChange(): void {
        for (const listener of this._listeners) {
            try {
                listener(this._state);
            } catch (error) {
                console.error('Error en listener de SavedPublicationsStore:', error);
            }
        }
    }

    // Función para que otros se "suscriban" y sepan cuando algo cambia
    subscribe(listener: SavedPublicationsListener): () => void {
        this._listeners.push(listener);
        
        // Le enviamos el estado actual inmediatamente
        try {
            listener(this._state);
        } catch (error) {
            console.error('Error en listener inicial:', error);
        }
        
        // Devolvemos una función para "desuscribirse" si ya no quiere saber
        return () => {
            this._listeners = this._listeners.filter(l => l !== listener);
        };
    }

    // Obtener todas las publicaciones guardadas
    getSavedPublications(): SavedPublication[] {
        return [...this._state.savedPublications];  // Devolvemos una copia
    }

    // Verificar si una publicación específica está guardada
    isSaved(publicationId: string): boolean {
        return this._state.savedPublications.some(p => p.id === publicationId);
    }

    // Obtener cuántas publicaciones están guardadas
    getSavedCount(): number {
        return this._state.savedPublications.length;
    }
}

// Creamos una instancia global que todos pueden usar
export const savedPublicationsStore = new SavedPublicationsStore();