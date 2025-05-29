import { AppDispatcher,Action } from "./Dispacher";

export interface InteractionState {
    likes:{[publicationId:string]: boolean};
    bookmarks:{[publicationId:string]: boolean};
    isLoading: boolean;
    error: string | null;
}
type InteractionListener = (state:InteractionState) => void;

export class InteractionStore {
    private _state:InteractionState={
        likes: {},
        bookmarks: {},
        isLoading: false,
        error: null
    };
    private _listeners: InteractionListener[]=[];
    private readonly STORAGE_KEY_LIKES ='lulada_likes';
    private readonly STORAGE_KEY_BOOKMARKS ='lulada_bookmarks';

    constructor(){
        AppDispatcher.register(this._handleActions.bind(this));
        this._loadFromStorage();
    }
    getState(): InteractionState {
        return {...this._state};
    }
    private _loadFromStorage(): void {
        console.log('InteractionStore: Cargando datos de interacciones desde localStorage...');
        try {
            const likes = localStorage.getItem(this.STORAGE_KEY_LIKES);
            const bookmarks = localStorage.getItem(this.STORAGE_KEY_BOOKMARKS);
            if(likes){
                this._state.likes =JSON.parse(likes);
                console.log('likes cargados:', this._state.likes);
            }
            if(bookmarks){
                this._state.bookmarks =JSON.parse(bookmarks);
                console.log('bookmarks cargados:', this._state.bookmarks);
            }
        }catch (error){
            console.error('Error al cargar datos de interacciones:', error);
            this._state.error = 'Error al cargar datos de interacciones';
        }
    }
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
    private _handleActions(action: Action): void {
        console.log('InteractionStore: Recibida accion:', action.type, action.payload);

        switch(action.type) {
            case 'TOGGLE_LIKE':
            if(action.payload && typeof action.payload === 'object' && 'publicationId'in action.payload){
                const {publicationId} = action.payload as any;
                const wasLiked = this._state.likes[publicationId];
                    this._state.likes[publicationId] = !wasLiked;

               console.log(`Like ${wasLiked ? 'removido' : 'agregado'} en publicación:`, publicationId);
                    this._state.error = null;
                    this._saveToStorage();
                    this._emitChange();
            }
            break;
            case 'TOGGLE_BOOKMARK':
                if (action.payload && typeof action.payload === 'object' && 'publicationId' in action.payload) {
                    const { publicationId } = action.payload as any;
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
                // No hacer nada para otras acciones
                break;
        }
    }
    private _emitChange():void{
        console.log('InteractionStore:Emitiendo cambios a',this._listeners.length,'listeners');
        console.log('Estado actual:', this._state);

        for(const listener of this._listeners){
            try{
                listener(this._state);
            }catch(error){
                console.error('Error en listener de InteractionStore:',error);

            }
        }
    }
    isLiked(publicationId: string): boolean {
        return !!this._state.likes[publicationId];
    }
    isBookmarked(publicationId: string): boolean {
        return !!this._state.bookmarks[publicationId];
    }
    getLikePublications(): string[] {
        return Object.keys(this._state.likes).filter(id=>this._state.likes[id]);
    }
    getBookmarkPublications(): string[] {
        return Object.keys(this._state.bookmarks).filter(id=>this._state.bookmarks[id]);
    }
    getStats(){
        return{
            totalLikes: Object.values(this._state.likes).filter(Boolean).length,
            totalBookmarks: Object.values(this._state.bookmarks).filter(Boolean).length,
            likedIds: this.getLikePublications(),
            bookmarkedIds: this.getBookmarkPublications()
        };
    }
     subscribe(listener: InteractionListener): () => void {
        console.log('InteractionStore: Nuevo listener suscrito. Total:', this._listeners.length + 1);
        this._listeners.push(listener);
        
        // Emitir estado inicial inmediatamente
        try {
            listener(this._state);
        } catch (error) {
            console.error('Error en listener inicial de InteractionStore:', error);
        }
        
        // Return unsubscribe function
        return () => {
            this._listeners = this._listeners.filter(l => l !== listener);
            console.log('InteractionStore: Listener desuscrito. Total:', this._listeners.length);
        };
    }
    // Método para debugging
    debug(): void {
        console.log('InteractionStore Debug:');
        console.log('- Estado:', this._state);
        console.log('- Listeners:', this._listeners.length);
        console.log('- LocalStorage Likes:', localStorage.getItem(this.STORAGE_KEY_LIKES));
        console.log('- LocalStorage Bookmarks:', localStorage.getItem(this.STORAGE_KEY_BOOKMARKS));
    }
}

export const interactionStore = new InteractionStore();

// Extiende la interfaz Window para incluir debugInteractionStore
declare global {
    interface Window {
        debugInteractionStore?: () => void;
    }
}

// Exponer para debugging en desarrollo
if (typeof window !== 'undefined' && !window.debugInteractionStore) {
    window.debugInteractionStore = () => interactionStore.debug();
}

