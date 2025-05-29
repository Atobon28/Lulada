import {Actions} from './Action';
import {interactionStore} from './InteractionStore';

export class InteractionService {
    private static instance: InteractionService;

    private constructor(){}

    public static getInstance(): InteractionService{
        if (!InteractionService.instance){
            InteractionService.instance = new InteractionService();
        }
        return InteractionService.instance;
    }

    // Like methods - CORREGIDOS
    public toggleLike(publicationId: string, username: string): void {
        Actions.toggleLike(publicationId, username);
    }

    public isLiked(publicationId: string): boolean {
        return interactionStore.isLiked(publicationId);
    }

    public getLikedPublications(): string[] {
        return interactionStore.getLikePublications(); // Corregido: era getLikedPublications
    }

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

    // Store subscription
    public subscribe(callback: (state: any) => void): () => void {
        return interactionStore.subscribe(callback);
    }

    // Utility methods
    public getStats() {
        return interactionStore.getStats();
    }

    public clearAll(): void {
        Actions.clearAllInteractions();
    }

    public loadInteractions(): void {
        Actions.loadInteractions();
    }

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