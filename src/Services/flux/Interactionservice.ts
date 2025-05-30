// Importamos las herramientas que necesitamos de otros archivos
import { Actions } from './Action';
import { interactionStore, InteractionState } from './InteractionStore';

// Esta clase se encarga de manejar todas las interacciones de los usuarios
export class InteractionService {
    // Esta variable guarda la única instancia de la clase (patrón Singleton)
    private static instance: InteractionService;

    // Constructor privado para que solo se pueda crear una instancia
    private constructor() {}

    // Función para obtener la única instancia de la clase
    public static getInstance(): InteractionService {
        if (!InteractionService.instance) {
            InteractionService.instance = new InteractionService();
        }
        return InteractionService.instance;
    }

    // Función para dar o quitar like a una publicación
    public toggleLike(publicationId: string, username: string): void {
        Actions.toggleLike(publicationId, username);
    }

    // Función para saber si una publicación ya tiene like del usuario
    public isLiked(publicationId: string): boolean {
        return interactionStore.isLiked(publicationId);
    }

    // Función para obtener todas las publicaciones que el usuario ha marcado con like
    public getLikedPublications(): string[] {
        return interactionStore.getLikePublications();
    }

    // Función para guardar o quitar de guardados una publicación
    public toggleBookmark(publicationId: string, username: string): void {
        Actions.toggleBookmark(publicationId, username);
    }

    // Función para saber si una publicación está guardada por el usuario
    public isBookmarked(publicationId: string): boolean {
        return interactionStore.isBookmarked(publicationId);
    }

    // Función para obtener todas las publicaciones que el usuario ha guardado
    public getBookmarkedPublications(): string[] {
        return interactionStore.getBookmarkPublications();
    }

    // Función para suscribirse a cambios en las interacciones
    // Devuelve una función para cancelar la suscripción
    public subscribe(callback: (state: InteractionState) => void): () => void {
        return interactionStore.subscribe(callback);
    }

    // Función para obtener estadísticas generales de las interacciones
    public getStats() {
        return interactionStore.getStats();
    }

    // Función para borrar todas las interacciones (likes y bookmarks)
    public clearAll(): void {
        Actions.clearAllInteractions();
    }

    // Función para cargar las interacciones guardadas en el almacenamiento
    public loadInteractions(): void {
        Actions.loadInteractions();
    }

    // Función para saber cuántos likes tiene una publicación específica
    // Por ahora simple: 1 si tiene like, 0 si no
    public getLikeCount(publicationId: string): number {
        return this.isLiked(publicationId) ? 1 : 0;
    }

    // Función para saber cuántos bookmarks tiene una publicación específica
    public getBookmarkCount(publicationId: string): number {
        return this.isBookmarked(publicationId) ? 1 : 0;
    }
}