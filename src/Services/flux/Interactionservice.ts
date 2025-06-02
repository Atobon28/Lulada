import { Actions } from './Action';
//importan las acciones que disparan eventos al store
import { interactionStore, InteractionState } from './InteractionStore';
//importa el store que maneja el estado y el tipo de intraciones

export class InteractionService {
    private static instance: InteractionService;
//guarda la unica intancia que guarda la intancia del service
//private  static = solo es accesible desde la clase,compartida entre todas la intancias
    private constructor() {}
    //contructor privado crea intancias con el new interaction service
    //solo se crea dentro de la clase

    public static getInstance(): InteractionService {
        if (!InteractionService.instance) {
            InteractionService.instance = new InteractionService();
        }
        return InteractionService.instance;
    }//si no exite intancia,crea una nueva

    // Like methods - CORREGIDOS
    public toggleLike(publicationId: string, username: string): void {
        Actions.toggleLike(publicationId, username);
    }
    //delega la accion al action dispacher
    //no tiene logica solo facilita el acceso

    public isLiked(publicationId: string): boolean {
        return interactionStore.isLiked(publicationId);
    }
    //consulta al store si esta el like

    public getLikedPublications(): string[] {
        return interactionStore.getLikePublications(); // Corregido: era getLikedPublications
    }//obtine el array de id de publicaciones con like

    // Bookmark methods - CORREGIDOS
    public toggleBookmark(publicationId: string, username: string): void {
        Actions.toggleBookmark(publicationId, username);
    }

    public isBookmarked(publicationId: string): boolean {
        return interactionStore.isBookmarked(publicationId);
    }

    public getBookmarkedPublications(): string[] {
        return interactionStore.getBookmarkPublications(); // Corregido: era getBookmarkedPublications
    }

    // Store subscription - FIXED: Replace 'any' with proper type
    public subscribe(callback: (state: InteractionState) => void): () => void {
        return interactionStore.subscribe(callback);
    }//subcribe cambios

    // Utility methods
    public getStats() {
        return interactionStore.getStats();
    }//total de likes y book marks

    public clearAll(): void {
        Actions.clearAllInteractions();
    }//borra todas las interaciones

    public loadInteractions(): void {
        Actions.loadInteractions();
    }//carga interaciones

    // NUEVO: Método para obtener contadores
    public getLikeCount(publicationId: string): number {
        // Por ahora simple: 1 si está liked, 0 si no
        // Más adelante puedes implementar contadores reales
        return this.isLiked(publicationId) ? 1 : 0;
    }

    public getBookmarkCount(publicationId: string): number {
        return this.isBookmarked(publicationId) ? 1 : 0;
    }
}