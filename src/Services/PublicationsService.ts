export interface Publication {
    username: string;
    text: string;
    stars: number;
    location: string;
    hasImage?: boolean;
    timestamp?: number;
    restaurant?: string;
}

export class PublicationsService {
    private static instance: PublicationsService;
    private storageKey = 'publicaciones';

    private constructor() {}

    public static getInstance(): PublicationsService {
        if (!PublicationsService.instance) {
            PublicationsService.instance = new PublicationsService();
        }
        return PublicationsService.instance;
    }

    // Agregar nueva publicación
    public addPublication(publication: Publication): void {
        const publications = this.getPublications();
        const newPublication = {
            ...publication,
            timestamp: Date.now()
        };

        publications.unshift(newPublication); // Agregar al inicio
        this.savePublications(publications);

        // Disparar evento personalizado
        document.dispatchEvent(new CustomEvent('nueva-publicacion', {
            detail: newPublication
        }));

        console.log('📝 Nueva publicación agregada:', newPublication);
    }

    // Obtener todas las publicaciones
    public getPublications(): Publication[] {
        try {
            const stored = sessionStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error al obtener publicaciones:', error);
            return [];
        }
    }

    // Obtener publicaciones filtradas por ubicación (zona general)
    public getPublicationsByLocation(location: string): Publication[] {
        const publications = this.getPublications();
        return publications.filter(pub => pub.location === location);
    }

    // Buscar publicaciones por nombre de restaurante
    public searchByRestaurant(query: string): Publication[] {
        const publications = this.getPublications();
        const searchTerm = query.toLowerCase();
        
        return publications.filter(pub => {
            // Buscar en el texto de la publicación
            if (pub.text.toLowerCase().includes(searchTerm)) return true;
            
            // Buscar en el nombre del restaurante
            if (pub.restaurant?.toLowerCase().includes(searchTerm)) return true;
            
            return false;
        });
    }

    // Obtener publicaciones de un restaurante específico
    public getPublicationsByRestaurant(restaurantName: string): Publication[] {
        const publications = this.getPublications();
        const searchTerm = restaurantName.toLowerCase();
        
        return publications.filter(pub => {
            if (pub.restaurant?.toLowerCase() === searchTerm) return true;
            return false;
        });
    }

    // Actualizar una publicación existente
    public updatePublication(updatedPublication: Publication): boolean {
        try {
            const publications = this.getPublications();
            const index = publications.findIndex(pub => 
                pub.username === updatedPublication.username && 
                pub.timestamp === updatedPublication.timestamp
            );
            
            if (index !== -1) {
                publications[index] = updatedPublication;
                this.savePublications(publications);
                
                document.dispatchEvent(new CustomEvent('publicacion-actualizada', {
                    detail: updatedPublication
                }));
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error al actualizar publicación:', error);
            return false;
        }
    }

    // Eliminar una publicación
    public deletePublication(username: string, timestamp: number): boolean {
        try {
            const publications = this.getPublications();
            const filteredPublications = publications.filter(pub => 
                !(pub.username === username && pub.timestamp === timestamp)
            );
            
            if (filteredPublications.length !== publications.length) {
                this.savePublications(filteredPublications);
                
                document.dispatchEvent(new CustomEvent('publicacion-eliminada', {
                    detail: { username, timestamp }
                }));
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error al eliminar publicación:', error);
            return false;
        }
    }

    // Guardar publicaciones
    private savePublications(publications: Publication[]): void {
        try {
            sessionStorage.setItem(this.storageKey, JSON.stringify(publications));
        } catch (error) {
            console.error('Error al guardar publicaciones:', error);
        }
    }

    // Limpiar todas las publicaciones
    public clearPublications(): void {
        sessionStorage.removeItem(this.storageKey);
        document.dispatchEvent(new CustomEvent('publicaciones-limpiadas'));
    }

    // Obtener estadísticas
    public getStats() {
        const publications = this.getPublications();
        const locationStats: { [key: string]: number } = {
            centro: 0,
            norte: 0,
            sur: 0,
            oeste: 0
        };

        publications.forEach(pub => {
            if (Object.prototype.hasOwnProperty.call(locationStats, pub.location)) {
                locationStats[pub.location]++;
            }
        });

        const topRestaurants = this.getTopRestaurants(5);

        return {
            total: publications.length,
            byLocation: locationStats,
            averageRating: publications.length > 0
                ? publications.reduce((sum, pub) => sum + pub.stars, 0) / publications.length
                : 0,
            topRestaurants: topRestaurants
        };
    }

    // Obtener restaurantes más reseñados
    public getTopRestaurants(limit: number = 5): Array<{name: string, count: number, averageRating: number}> {
        const publications = this.getPublications();
        const restaurantStats: { [key: string]: { count: number, totalStars: number, publications: Publication[] } } = {};

        publications.forEach(pub => {
            let restaurantName = '';
            
            // Obtener nombre del restaurante de diferentes fuentes
            if (pub.restaurant) {
                restaurantName = pub.restaurant;
            } else {
                // Intentar extraer @NombreRestaurante del texto
                const match = pub.text.match(/@(\w+)/);
                if (match) {
                    restaurantName = match[1];
                }
            }

            if (restaurantName) {
                if (!restaurantStats[restaurantName]) {
                    restaurantStats[restaurantName] = { count: 0, totalStars: 0, publications: [] };
                }
                restaurantStats[restaurantName].count++;
                restaurantStats[restaurantName].totalStars += pub.stars;
                restaurantStats[restaurantName].publications.push(pub);
            }
        });

        return Object.entries(restaurantStats)
            .map(([name, stats]) => ({
                name,
                count: stats.count,
                averageRating: stats.totalStars / stats.count
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }

    // Exportar publicaciones como JSON
    public exportPublications(): string {
        return JSON.stringify(this.getPublications(), null, 2);
    }

    // Importar publicaciones desde JSON
    public importPublications(jsonData: string): boolean {
        try {
            const publications = JSON.parse(jsonData);
            if (Array.isArray(publications)) {
                this.savePublications(publications);
                document.dispatchEvent(new CustomEvent('publicaciones-importadas', {
                    detail: { count: publications.length }
                }));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error al importar publicaciones:', error);
            return false;
        }
    }
}

export default PublicationsService;