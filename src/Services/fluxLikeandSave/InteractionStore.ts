import { interactionDispatcher, InteractionAction } from './InteractionDispatcher';

interface InteractionState {
    likes: { [publicationId: string]: boolean };
    bookmarks: { [publicationId: string]: boolean };
}

type InteractionListener = (state: InteractionState) => void;

class InteractionStore {
    private _state: InteractionState = {
        likes: {},
        bookmarks: {}
    };

    private _listeners: InteractionListener[] = [];
    private readonly STORAGE_KEY_LIKES = 'lulada_likes';
    private readonly STORAGE_KEY_BOOKMARKS = 'lulada_bookmarks';

    constructor() {
        interactionDispatcher.register(this._handleActions.bind(this));
        this._loadFromStorage();
    }

    getState(): InteractionState {
        return { ...this._state }; // Return copy to prevent mutations
    }

    private _loadFromStorage(): void {
        try {
            const likes = localStorage.getItem(this.STORAGE_KEY_LIKES);
            const bookmarks = localStorage.getItem(this.STORAGE_KEY_BOOKMARKS);
            
            if (likes) {
                this._state.likes = JSON.parse(likes);
            }
            if (bookmarks) {
                this._state.bookmarks = JSON.parse(bookmarks);
            }
        } catch (error) {
            console.error('Error loading interactions from storage:', error);
        }
    }

    private _saveToStorage(): void {
        try {
            localStorage.setItem(this.STORAGE_KEY_LIKES, JSON.stringify(this._state.likes));
            localStorage.setItem(this.STORAGE_KEY_BOOKMARKS, JSON.stringify(this._state.bookmarks));
        } catch (error) {
            console.error('Error saving interactions to storage:', error);
        }
    }

    private _handleActions(action: InteractionAction): void {
        switch (action.type) {
            case 'TOGGLE_LIKE':
                if (action.payload?.publicationId) {
                    const { publicationId } = action.payload;
                    this._state.likes[publicationId] = !this._state.likes[publicationId];
                    this._saveToStorage();
                    this._emitChange();
                }
                break;
                
            case 'TOGGLE_BOOKMARK':
                if (action.payload?.publicationId) {
                    const { publicationId } = action.payload;
                    this._state.bookmarks[publicationId] = !this._state.bookmarks[publicationId];
                    this._saveToStorage();
                    this._emitChange();
                }
                break;
                
            case 'LOAD_INTERACTIONS':
                this._loadFromStorage();
                this._emitChange();
                break;

            case 'CLEAR_INTERACTIONS':
                this._state = { likes: {}, bookmarks: {} };
                localStorage.removeItem(this.STORAGE_KEY_LIKES);
                localStorage.removeItem(this.STORAGE_KEY_BOOKMARKS);
                this._emitChange();
                break;
        }
    }

    private _emitChange(): void {
        for (const listener of this._listeners) {
            listener(this._state);
        }
    }

    subscribe(listener: InteractionListener): () => void {
        this._listeners.push(listener);
        
        // Return unsubscribe function
        return () => {
            this._listeners = this._listeners.filter(l => l !== listener);
        };
    }
}

export const interactionStore = new InteractionStore();