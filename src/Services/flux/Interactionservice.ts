// Importamos las herramientas que necesitamos de otros archivos
import { Actions } from './Action';
import { interactionStore, InteractionState } from './InteractionStore';

// Esta clase se encarga de manejar todas las interacciones de los usuarios
// Como dar like o guardar publicaciones (bookmarks)
export class InteractionService {
    // Esta variable guarda la única instancia de la clase (patrón Singleton)
    private static instance: InteractionService;

    // Constructor privado para que solo se pueda crear una instancia
    private constructor() {}

    // Función para obtener la única instancia de la clase
    // Si no existe, la crea; si ya existe, devuelve la misma
    public static getInstance(): InteractionService {
        if (!InteractionService.instance) {
            InteractionService.instance = new InteractionService();
        }
        return InteractionService.instance;
    }

    // ============================================================================
    // MÉTODOS PARA MANEJAR LIKES (me gusta)
    // ============================================================================

    // Función para dar o quitar like a una publicación
    // Si ya tenía like, se lo quita; si no tenía, se lo pone
    public toggleLike(publicationId: string, username: string): void {
        Actions.toggleLike(publicationId, username);
    }

    // Función para saber si una publicación ya tiene like del usuario
    // Devuelve true si tiene like, false si no
    public isLiked(publicationId: string): boolean {
        return interactionStore.isLiked(publicationId);
    }

    // Función para obtener todas las publicaciones que el usuario ha marcado con like
    // Devuelve una lista con los IDs de las publicaciones
    public getLikedPublications(): string[] {
        return interactionStore.getLikePublications(); // Corregido: era getLikedPublications
    }

    // ============================================================================
    // MÉTODOS PARA MANEJAR BOOKMARKS (guardar publicaciones)
    // ============================================================================

    // Función para guardar o quitar de guardados una publicación
    // Si ya estaba guardada, la quita; si no estaba, la guarda
    public toggleBookmark(publicationId: string, username: string): void {
        Actions.toggleBookmark(publicationId, username);
    }

    // Función para saber si una publicación está guardada por el usuario
    // Devuelve true si está guardada, false si no
    public isBookmarked(publicationId: string): boolean {
        return interactionStore.isBookmarked(publicationId);
    }

    // Función para obtener todas las publicaciones que el usuario ha guardado
    // Devuelve una lista con los IDs de las publicaciones guardadas
    public getBookmarkedPublications(): string[] {
        return interactionStore.getBookmarkPublications(); // Corregido: era getBookmarkedPublications
    }

    // ============================================================================
    // MÉTODOS PARA ESCUCHAR CAMBIOS
    // ============================================================================

    // Función para suscribirse a cambios en las interacciones
    // Cuando algo cambie (like/bookmark), ejecutará la función que le pases
    // Devuelve una función para cancelar la suscripción
    public subscribe(callback: (state: InteractionState) => void): () => void {
        return interactionStore.subscribe(callback);
    }

    // ============================================================================
    // MÉTODOS DE UTILIDAD Y ESTADÍSTICAS
    // ============================================================================

    // Función para obtener estadísticas generales de las interacciones
    // Como cuántos likes hay en total, cuántos bookmarks, etc.
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

    // ============================================================================
    // MÉTODOS PARA CONTAR INTERACCIONES INDIVIDUALES
    // ============================================================================

    // Función para saber cuántos likes tiene una publicación específica
    // Por ahora es simple: devuelve 1 si tiene like, 0 si no
    // Más adelante se puede mejorar para contar likes de múltiples usuarios
    public getLikeCount(publicationId: string): number {
        // Por ahora simple: 1 si está liked, 0 si no
        // Más adelante puedes implementar contadores reales
        return this.isLiked(publicationId) ? 1 : 0;
    }

    // Función para saber cuántos bookmarks tiene una publicación específica
    // Similar al like count: 1 si está guardada, 0 si no
    public getBookmarkCount(publicationId: string): number {
        return this.isBookmarked(publicationId) ? 1 : 0;
    }
}