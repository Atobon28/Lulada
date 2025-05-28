import { interactionStore } from './InteractionStore';
import { InteractionActions } from './InteractionAction';

export class InteractionService {
    private static instance: InteractionService;
    private unsubscribeFunctions: (() => void)[] = [];

    private constructor() {}

    public static getInstance(): InteractionService {
        if (!InteractionService.instance) {
            InteractionService.instance = new InteractionService();
        }
        return InteractionService.instance;
    }

    // Like methods
    public toggleLike(publicationId: string, username: string): void {
        InteractionActions.toggleLike(publicationId, username);
    }

    public isLiked(publicationId: string): boolean {
        const state = interactionStore.getState();
        return !!state.likes[publicationId];
    }

    public getLikedPublications(): string[] {
        const state = interactionStore.getState();
        return Object.keys(state.likes).filter(id => state.likes[id]);
    }

    // Bookmark methods
    public toggleBookmark(publicationId: string, username: string): void {
        InteractionActions.toggleBookmark(publicationId, username);
    }

    public isBookmarked(publicationId: string): boolean {
        const state = interactionStore.getState();
        return !!state.bookmarks[publicationId];
    }

    public getBookmarkedPublications(): string[] {
        const state = interactionStore.getState();
        return Object.keys(state.bookmarks).filter(id => state.bookmarks[id]);
    }

    // Store subscription
    public subscribe(callback: (state: any) => void): () => void {
        const unsubscribe = interactionStore.subscribe(callback);
        this.unsubscribeFunctions.push(unsubscribe);
        return unsubscribe;
    }

    // Utility methods
    public getStats() {
        const state = interactionStore.getState();
        return {
            totalLikes: Object.values(state.likes).filter(Boolean).length,
            totalBookmarks: Object.values(state.bookmarks).filter(Boolean).length,
            likedIds: this.getLikedPublications(),
            bookmarkedIds: this.getBookmarkedPublications()
        };
    }

    public clearAll(): void {
        InteractionActions.clearAllInteractions();
    }

    public destroy(): void {
        // Cleanup all subscriptions
        this.unsubscribeFunctions.forEach(unsub => unsub());
        this.unsubscribeFunctions = [];
    }
}
