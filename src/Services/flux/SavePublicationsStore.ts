import { AppDispatcher, Action } from "./Dispacher";

export interface SavedPublication {
    id: string;
    username: string;
    text: string;
    stars: number;
    hasImage?: boolean;
    restaurant?: string;
    location?: string;
    timestamp: number;
}

export interface SavedPublicationsState {
    savedPublications: SavedPublication[];
    isLoading: boolean;
    error: string | null;
}

// Define interface for unsave action payload
interface UnsavePublicationPayload {
    publicationId: string;
}

type SavedPublicationsListener = (state: SavedPublicationsState) => void;

export class SavedPublicationsStore {
    private _state: SavedPublicationsState = {
        savedPublications: [],
        isLoading: false,
        error: null
    };
    private _listeners: SavedPublicationsListener[] = [];
    private readonly STORAGE_KEY = 'lulada_saved_publications';

    constructor() {
        AppDispatcher.register(this._handleActions.bind(this));
        this._loadFromStorage();
    }

    getState(): SavedPublicationsState {
        return { ...this._state };
    }

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

    private _saveToStorage(): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._state.savedPublications));
            console.log('Publicaciones guardadas en localStorage');
        } catch (error) {
            console.error('Error guardando publicaciones:', error);
            this._state.error = 'Error guardando publicaciones';
        }
    }

    // Type guard for unsave payload
    private isUnsavePayload(payload: unknown): payload is UnsavePublicationPayload {
        return (
            payload !== null &&
            typeof payload === 'object' &&
            'publicationId' in payload &&
            typeof (payload as UnsavePublicationPayload).publicationId === 'string'
        );
    }

    private _handleActions(action: Action): void {
        console.log('SavedPublicationsStore: Recibida acción:', action.type);

        switch (action.type) {
            case 'SAVE_PUBLICATION':
                if (action.payload && typeof action.payload === 'object') {
                    const publication = action.payload as SavedPublication;
                    
                    // Verificar si ya está guardada
                    const exists = this._state.savedPublications.find(p => p.id === publication.id);
                    if (!exists) {
                        this._state.savedPublications.unshift(publication);
                        this._saveToStorage();
                        this._emitChange();
                        console.log('Publicación guardada:', publication.id);
                    }
                }
                break;

            case 'UNSAVE_PUBLICATION':
                if (this.isUnsavePayload(action.payload)) {
                    const { publicationId } = action.payload;
                    this._state.savedPublications = this._state.savedPublications.filter(p => p.id !== publicationId);
                    this._saveToStorage();
                    this._emitChange();
                    console.log('Publicación removida de guardados:', publicationId);
                }
                break;

            case 'CLEAR_SAVED_PUBLICATIONS':
                this._state.savedPublications = [];
                localStorage.removeItem(this.STORAGE_KEY);
                this._emitChange();
                console.log('Todas las publicaciones guardadas eliminadas');
                break;

            default:
                break;
        }
    }

    private _emitChange(): void {
        for (const listener of this._listeners) {
            try {
                listener(this._state);
            } catch (error) {
                console.error('Error en listener de SavedPublicationsStore:', error);
            }
        }
    }

    subscribe(listener: SavedPublicationsListener): () => void {
        this._listeners.push(listener);
        
        // Emitir estado inicial
        try {
            listener(this._state);
        } catch (error) {
            console.error('Error en listener inicial:', error);
        }
        
        return () => {
            this._listeners = this._listeners.filter(l => l !== listener);
        };
    }

    // Métodos públicos
    getSavedPublications(): SavedPublication[] {
        return [...this._state.savedPublications];
    }

    isSaved(publicationId: string): boolean {
        return this._state.savedPublications.some(p => p.id === publicationId);
    }

    getSavedCount(): number {
        return this._state.savedPublications.length;
    }
}

export const savedPublicationsStore = new SavedPublicationsStore();