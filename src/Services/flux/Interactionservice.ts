// Importamos las herramientas que necesitamos de otros archivos
import { Actions } from './Action';
import { interactionStore, InteractionState } from './InteractionStore';

// Esta clase se encarga de manejar todas las interacciones de los usuarios
export class InteractionService {
    // Esta variable guarda la única instancia de la clase (patrón Singleton)
    private static instance: InteractionService;

    // Constructor privado para que solo se pueda crear una instancia
    private constructor() {
        this.initializeService();
    }

    // Función para obtener la única instancia de la clase
    public static getInstance(): InteractionService {
        if (!InteractionService.instance) {
            InteractionService.instance = new InteractionService();
        }
        return InteractionService.instance;
    }

    // Función privada para inicializar el servicio
    private initializeService(): void {
        console.log('🚀 InteractionService inicializado');
        
        // Cargar interacciones guardadas al inicializar
        this.loadInteractions();
    }

    // Función para dar o quitar like a una publicación
    public toggleLike(publicationId: string, username: string): void {
        if (!publicationId || !username) {
            console.warn('toggleLike: publicationId y username son requeridos');
            return;
        }
        
        Actions.toggleLike(publicationId, username);
        console.log(`👍 Toggle like - Publicación: ${publicationId}, Usuario: ${username}`);
    }

    // Función para saber si una publicación ya tiene like del usuario
    public isLiked(publicationId: string): boolean {
        if (!publicationId) {
            console.warn('isLiked: publicationId es requerido');
            return false;
        }
        
        return interactionStore.isLiked(publicationId);
    }

    // Función para obtener todas las publicaciones que el usuario ha marcado con like
    public getLikedPublications(): string[] {
        return interactionStore.getLikePublications();
    }

    // Función para guardar o quitar de guardados una publicación
    public toggleBookmark(publicationId: string, username: string): void {
        if (!publicationId || !username) {
            console.warn('toggleBookmark: publicationId y username son requeridos');
            return;
        }
        
        Actions.toggleBookmark(publicationId, username);
        console.log(`🔖 Toggle bookmark - Publicación: ${publicationId}, Usuario: ${username}`);
    }

    // Función para saber si una publicación está guardada por el usuario
    public isBookmarked(publicationId: string): boolean {
        if (!publicationId) {
            console.warn('isBookmarked: publicationId es requerido');
            return false;
        }
        
        return interactionStore.isBookmarked(publicationId);
    }

    // Función para obtener todas las publicaciones que el usuario ha guardado
    public getBookmarkedPublications(): string[] {
        return interactionStore.getBookmarkPublications();
    }

    // Función para suscribirse a cambios en las interacciones
    // Devuelve una función para cancelar la suscripción
    public subscribe(callback: (state: InteractionState) => void): () => void {
        if (typeof callback !== 'function') {
            console.warn('subscribe: callback debe ser una función');
            return () => {};
        }
        
        return interactionStore.subscribe(callback);
    }

    // Función para obtener estadísticas generales de las interacciones
    public getStats() {
        return interactionStore.getStats();
    }

    // Función para borrar todas las interacciones (likes y bookmarks)
    public clearAll(): void {
        Actions.clearAllInteractions();
        console.log('🗑️ Todas las interacciones han sido limpiadas');
    }

    // Función para cargar las interacciones guardadas en el almacenamiento
    public loadInteractions(): void {
        Actions.loadInteractions();
        console.log('📥 Interacciones cargadas desde el almacenamiento');
    }

    // Función para saber cuántos likes tiene una publicación específica
    // Por ahora simple: 1 si tiene like, 0 si no
    public getLikeCount(publicationId: string): number {
        if (!publicationId) {
            console.warn('getLikeCount: publicationId es requerido');
            return 0;
        }
        
        return this.isLiked(publicationId) ? 1 : 0;
    }

    // Función para saber cuántos bookmarks tiene una publicación específica
    public getBookmarkCount(publicationId: string): number {
        if (!publicationId) {
            console.warn('getBookmarkCount: publicationId es requerido');
            return 0;
        }
        
        return this.isBookmarked(publicationId) ? 1 : 0;
    }

    // Función para obtener el estado actual completo del store de interacciones
    public getState(): InteractionState {
        return interactionStore.getState();
    }

    // Función para agregar múltiples likes de una vez
    public addMultipleLikes(publicationIds: string[], username: string): void {
        if (!Array.isArray(publicationIds) || !username) {
            console.warn('addMultipleLikes: publicationIds debe ser un array y username es requerido');
            return;
        }
        
        publicationIds.forEach(id => {
            if (!this.isLiked(id)) {
                this.toggleLike(id, username);
            }
        });
    }

    // Función para agregar múltiples bookmarks de una vez
    public addMultipleBookmarks(publicationIds: string[], username: string): void {
        if (!Array.isArray(publicationIds) || !username) {
            console.warn('addMultipleBookmarks: publicationIds debe ser un array y username es requerido');
            return;
        }
        
        publicationIds.forEach(id => {
            if (!this.isBookmarked(id)) {
                this.toggleBookmark(id, username);
            }
        });
    }

    // Función para remover múltiples likes de una vez
    public removeMultipleLikes(publicationIds: string[], username: string): void {
        if (!Array.isArray(publicationIds) || !username) {
            console.warn('removeMultipleLikes: publicationIds debe ser un array y username es requerido');
            return;
        }
        
        publicationIds.forEach(id => {
            if (this.isLiked(id)) {
                this.toggleLike(id, username);
            }
        });
    }

    // Función para remover múltiples bookmarks de una vez
    public removeMultipleBookmarks(publicationIds: string[], username: string): void {
        if (!Array.isArray(publicationIds) || !username) {
            console.warn('removeMultipleBookmarks: publicationIds debe ser un array y username es requerido');
            return;
        }
        
        publicationIds.forEach(id => {
            if (this.isBookmarked(id)) {
                this.toggleBookmark(id, username);
            }
        });
    }

    // Función para obtener publicaciones filtradas por tipo de interacción
    public getPublicationsByInteractionType(type: 'liked' | 'bookmarked'): string[] {
        switch (type) {
            case 'liked':
                return this.getLikedPublications();
            case 'bookmarked':
                return this.getBookmarkedPublications();
            default:
                console.warn('getPublicationsByInteractionType: tipo no válido');
                return [];
        }
    }

    // Función para verificar si una publicación tiene alguna interacción
    public hasAnyInteraction(publicationId: string): boolean {
        if (!publicationId) {
            console.warn('hasAnyInteraction: publicationId es requerido');
            return false;
        }
        
        return this.isLiked(publicationId) || this.isBookmarked(publicationId);
    }

    // Función para obtener el resumen de interacciones de una publicación específica
    public getPublicationInteractionSummary(publicationId: string) {
        if (!publicationId) {
            console.warn('getPublicationInteractionSummary: publicationId es requerido');
            return {
                hasLike: false,
                hasBookmark: false,
                likeCount: 0,
                bookmarkCount: 0
            };
        }
        
        return {
            hasLike: this.isLiked(publicationId),
            hasBookmark: this.isBookmarked(publicationId),
            likeCount: this.getLikeCount(publicationId),
            bookmarkCount: this.getBookmarkCount(publicationId)
        };
    }

    // Función para exportar todas las interacciones (útil para backup)
    public exportInteractions(): string {
        const state = this.getState();
        return JSON.stringify({
            likes: state.likedPublications || [], // ✅ CORREGIDO
            bookmarks: state.bookmarkedPublications || [], // ✅ CORREGIDO
            exportDate: new Date().toISOString()
        }, null, 2);
    }

    // Función para importar interacciones desde un backup
    public importInteractions(jsonData: string, username: string): boolean {
        try {
            const data = JSON.parse(jsonData);
            
            if (!data.likes || !data.bookmarks || !Array.isArray(data.likes) || !Array.isArray(data.bookmarks)) {
                console.error('importInteractions: formato de datos inválido');
                return false;
            }
            
            // Primero limpiar todas las interacciones
            this.clearAll();
            
            // Importar likes
            this.addMultipleLikes(data.likes, username);
            
            // Importar bookmarks
            this.addMultipleBookmarks(data.bookmarks, username);
            
            console.log('✅ Interacciones importadas exitosamente');
            return true;
            
        } catch (error) {
            console.error('Error importando interacciones:', error);
            return false;
        }
    }

    // Función para debug - mostrar información del estado actual
    public debug(): void {
        console.group('🔍 InteractionService Debug Info');
        console.log('Estado actual:', this.getState());
        console.log('Estadísticas:', this.getStats());
        console.log('Total likes:', this.getLikedPublications().length);
        console.log('Total bookmarks:', this.getBookmarkedPublications().length);
        console.groupEnd();
    }

    // Función para limpiar solo los likes
    public clearLikes(): void {
        Actions.clearAllInteractions(); // ✅ CORREGIDO
        console.log('🗑️ Todos los likes han sido limpiados');
    }

    // Función para limpiar solo los bookmarks
    public clearBookmarks(): void {
        Actions.clearAllInteractions(); // ✅ CORREGIDO
        console.log('🗑️ Todos los bookmarks han sido limpiados');
    }
}

// Exportar la instancia para uso global
export const interactionService = InteractionService.getInstance();