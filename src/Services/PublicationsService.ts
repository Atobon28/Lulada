// Definimos la estructura de una publicación - como una plantilla que dice qué información debe tener
export interface Publication {
    username: string;        // Nombre del usuario que hizo la reseña
    text: string;           // El texto de la reseña
    stars: number;          // Calificación de 1 a 5 estrellas
    location: string;       // Zona de Cali (centro, norte, sur, oeste)
    hasImage?: boolean;     // Si tiene foto o no (opcional)
    timestamp?: number;     // Momento en que se creó (opcional)
    restaurant?: string;    // Nombre del restaurante (opcional)
    imageUrl?: string | undefined; // Dirección donde está guardada la foto (opcional)
}

// Esta es la clase principal que maneja todas las publicaciones de la app
export class PublicationsService {
    // Variable para asegurar que solo haya una instancia de este servicio (patrón Singleton)
    private static instance: PublicationsService;
    
    // Nombres de las "cajas" donde guardamos información en el navegador
    private storageKey = 'publicaciones';           // Caja para las publicaciones
    private photoStorageKey = 'publicaciones_photos'; // Caja separada para las fotos

    // Constructor privado - nadie puede crear este servicio directamente
    private constructor() {}

    // Método para obtener la única instancia del servicio (como un singleton)
    public static getInstance(): PublicationsService {
        if (!PublicationsService.instance) {
            PublicationsService.instance = new PublicationsService();
        }
        return PublicationsService.instance;
    }

    // Función para agregar una nueva publicación (cuando alguien escribe una reseña)
    public addPublication(publication: Publication): void {
        const publications = this.getPublications();
        
        // Creamos la nueva publicación con la hora actual
        const newPublication = {
            ...publication,                    // Copiamos toda la información
            timestamp: Date.now()             // Agregamos el momento actual
        };

        // Si la publicación tiene una foto, la guardamos por separado
        if (newPublication.imageUrl) {
            this.storePhotoSeparately(newPublication.timestamp!, newPublication.imageUrl);
            delete newPublication.imageUrl;
            newPublication.hasImage = true;
        }

        // Agregamos la nueva publicación al inicio de la lista (las más nuevas primero)
        publications.unshift(newPublication);
        this.savePublications(publications);

        // Avisamos a toda la app que hay una nueva publicación
        document.dispatchEvent(new CustomEvent('nueva-publicacion', {
            detail: newPublication
        }));
    }

    // Función privada para guardar las fotos por separado (para no llenar la memoria)
   private storePhotoSeparately(timestamp: number, imageUrl: string): void {
    try {
        const photos = this.getStoredPhotos();
        photos[timestamp.toString()] = imageUrl;
        localStorage.setItem(this.photoStorageKey, JSON.stringify(photos));
    } catch (error) {
        console.error('Error almacenando foto:', error);
        this.createBlobUrl(imageUrl, timestamp);
    }
}


    // Función para crear una dirección temporal si la foto es muy grande
    private createBlobUrl(base64: string, timestamp: number): void {
        try {
            const byteCharacters = atob(base64.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            const blobUrl = URL.createObjectURL(blob);
            
            const photos = this.getStoredPhotos();
            photos[timestamp.toString()] = blobUrl;
            sessionStorage.setItem(this.photoStorageKey + '_temp', JSON.stringify(photos));
        } catch (error) {
            console.error('Error creando blob URL:', error);
        }
    }

    // Función para obtener todas las fotos guardadas
    private getStoredPhotos(): { [key: string]: string } {
        try {
            const stored = localStorage.getItem(this.photoStorageKey);
            if (stored) {
                return JSON.parse(stored);
            }
            
            const tempStored = sessionStorage.getItem(this.photoStorageKey + '_temp');
            if (tempStored) {
                return JSON.parse(tempStored);
            }
            
            return {};
        } catch (error) {
            console.error('Error obteniendo fotos:', error);
            return {};
        }
    }

    // Función para obtener la dirección de una foto específica
    public getPhotoUrl(timestamp: number): string | undefined {
        const photos = this.getStoredPhotos();
        return photos[timestamp.toString()] || undefined;
    }

    // Función principal para obtener todas las publicaciones
    public getPublications(): Publication[] {
        try {
            const stored = sessionStorage.getItem(this.storageKey);
            const publications = stored ? JSON.parse(stored) : [];
            
            // Para cada publicación, si tiene imagen, buscamos su foto
            return publications.map((pub: Publication) => {
                if (pub.hasImage && pub.timestamp) {
                    const photoUrl = this.getPhotoUrl(pub.timestamp);
                    if (photoUrl) {
                        return { ...pub, imageUrl: photoUrl };
                    }
                }
                return pub;
            });
        } catch (error) {
            console.error('Error al obtener publicaciones:', error);
            return [];
        }
    }

    // Función para obtener publicaciones de una zona específica (centro, norte, sur, oeste)
    public getPublicationsByLocation(location: string): Publication[] {
        const publications = this.getPublications();
        return publications.filter(pub => pub.location === location);
    }

    // Función para buscar publicaciones por nombre de restaurante
    public searchByRestaurant(query: string): Publication[] {
        const publications = this.getPublications();
        const searchTerm = query.toLowerCase();
        
        return publications.filter(pub => {
            if (pub.text.toLowerCase().includes(searchTerm)) return true;
            if (pub.restaurant?.toLowerCase().includes(searchTerm)) return true;
            return false;
        });
    }

    // Función para obtener todas las reseñas de un restaurante específico
    public getPublicationsByRestaurant(restaurantName: string): Publication[] {
        const publications = this.getPublications();
        const searchTerm = restaurantName.toLowerCase();
        
        return publications.filter(pub => {
            if (pub.restaurant?.toLowerCase() === searchTerm) return true;
            return false;
        });
    }

    // Función para actualizar una publicación que ya existe
    public updatePublication(updatedPublication: Publication): boolean {
        try {
            const publications = this.getPublications();
            const index = publications.findIndex(pub => 
                pub.username === updatedPublication.username && 
                pub.timestamp === updatedPublication.timestamp
            );
            
            if (index !== -1) {
                if (updatedPublication.imageUrl && updatedPublication.timestamp) {
                    this.storePhotoSeparately(updatedPublication.timestamp, updatedPublication.imageUrl);
                    delete updatedPublication.imageUrl;
                    updatedPublication.hasImage = true;
                }
                
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

    // Función para eliminar una publicación específica
    public deletePublication(username: string, timestamp: number): boolean {
        try {
            const publications = this.getPublications();
            const filteredPublications = publications.filter(pub => 
                !(pub.username === username && pub.timestamp === timestamp)
            );
            
            if (filteredPublications.length !== publications.length) {
                this.deletePhoto(timestamp);
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

    // Función privada para eliminar una foto específica
    private deletePhoto(timestamp: number): void {
        try {
            const photos = this.getStoredPhotos();
            const photoUrl = photos[timestamp.toString()];
            
            if (photoUrl && photoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(photoUrl);
            }
            
            delete photos[timestamp.toString()];
            localStorage.setItem(this.photoStorageKey, JSON.stringify(photos));
            
            try {
                const tempPhotos = JSON.parse(sessionStorage.getItem(this.photoStorageKey + '_temp') || '{}');
                delete tempPhotos[timestamp.toString()];
                sessionStorage.setItem(this.photoStorageKey + '_temp', JSON.stringify(tempPhotos));
            } catch {
                // Si hay error, lo ignoramos
            }
        } catch (error) {
            console.error('Error eliminando foto:', error);
        }
    }

    // Función privada para guardar la lista de publicaciones
    private savePublications(publications: Publication[]): void {
        try {
            // Creamos una copia sin las fotos para ahorrar espacio
            // CORRECCIÓN APLICADA AQUÍ - Línea 376
            const publicationsToSave = publications.map(pub => {
                const pubWithoutImage = pub;
                return pubWithoutImage;
            });
            
            sessionStorage.setItem(this.storageKey, JSON.stringify(publicationsToSave));
        } catch (error) {
            console.error('Error al guardar publicaciones:', error);
        }
    }

    // Función para eliminar TODAS las publicaciones y fotos
    public clearPublications(): void {
        sessionStorage.removeItem(this.storageKey);
        
        const photos = this.getStoredPhotos();
        Object.values(photos).forEach(photoUrl => {
            if (photoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(photoUrl);
            }
        });
        
        localStorage.removeItem(this.photoStorageKey);
        sessionStorage.removeItem(this.photoStorageKey + '_temp');
        
        document.dispatchEvent(new CustomEvent('publicaciones-limpiadas'));
    }

    // Función para obtener estadísticas generales de las publicaciones
    public getStats() {
        const publications = this.getPublications();
        // Contador por zonas
        const locationStats: { [key: string]: number } = {
            centro: 0,
            norte: 0,
            sur: 0,
            oeste: 0
        };

        let photosCount = 0;
        
        // Contamos publicaciones por zona y fotos
        publications.forEach(pub => {
            if (Object.prototype.hasOwnProperty.call(locationStats, pub.location)) {
                locationStats[pub.location]++;
            }
            if (pub.hasImage) {
                photosCount++;
            }
        });

        // Obtenemos los restaurantes más populares
        const topRestaurants = this.getTopRestaurants(5);

        return {
            total: publications.length,                    // Total de publicaciones
            withPhotos: photosCount,                      // Cuántas tienen fotos
            byLocation: locationStats,                    // Por zona
            averageRating: publications.length > 0       // Promedio de calificaciones
                ? publications.reduce((sum, pub) => sum + pub.stars, 0) / publications.length
                : 0,
            topRestaurants: topRestaurants               // Restaurantes más reseñados
        };
    }

    // Función para obtener los restaurantes más reseñados
    public getTopRestaurants(limit: number = 5): Array<{name: string, count: number, averageRating: number}> {
        const publications = this.getPublications();
        const restaurantStats: { [key: string]: { count: number, totalStars: number } } = {};

        publications.forEach(pub => {
            let restaurantName = '';
            
            // Obtenemos el nombre del restaurante de diferentes lugares
            if (pub.restaurant) {
                restaurantName = pub.restaurant;
            } else {
                // Intentamos encontrar @NombreRestaurante en el texto
                const match = pub.text.match(/@(\w+)/);
                if (match) {
                    restaurantName = match[1];
                }
            }

            // Si encontramos un nombre de restaurante
            if (restaurantName) {
                if (!restaurantStats[restaurantName]) {
                    restaurantStats[restaurantName] = { count: 0, totalStars: 0 };
                }
                restaurantStats[restaurantName].count++;
                restaurantStats[restaurantName].totalStars += pub.stars;
            }
        });

        // Convertimos el objeto a una lista ordenada
        return Object.entries(restaurantStats)
            .map(([name, stats]) => ({
                name,                                        // Nombre del restaurante
                count: stats.count,                         // Cantidad de reseñas
                averageRating: stats.totalStars / stats.count // Promedio de estrellas
            }))
            .sort((a, b) => b.count - a.count)             // Ordenamos por cantidad de reseñas
            .slice(0, limit);                              // Tomamos solo los primeros 'limit'
    }

    // Función para exportar todas las publicaciones como texto (sin fotos)
    public exportPublications(): string {
        // CORRECCIÓN APLICADA AQUÍ - Línea 257
        const publications = this.getPublications().map(pub => {
            const hasImage = !!pub.imageUrl;
            const pubWithoutImage = pub;
            return { ...pubWithoutImage, hasImage };
        });
        return JSON.stringify(publications, null, 2);
    }

    // Función para importar publicaciones desde un archivo JSON
    public importPublications(jsonData: string): boolean {
        try {
            const publications = JSON.parse(jsonData);
            if (Array.isArray(publications)) {
                const cleanPublications = publications.map(pub => {
                    const cleanPub = pub;
                    return cleanPub;
                });
                
                this.savePublications(cleanPublications);
                
                document.dispatchEvent(new CustomEvent('publicaciones-importadas', {
                    detail: { count: cleanPublications.length }
                }));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error al importar publicaciones:', error);
            return false;
        }
    }

    // Función para obtener información sobre cuánto espacio estamos usando
    public getStorageInfo(): { 
        publicationsSize: number,    // Tamaño de las publicaciones
        photosSize: number,         // Tamaño de las fotos
        totalPhotos: number,        // Cantidad total de fotos
        storageType: 'localStorage' | 'sessionStorage' | 'mixed' // Dónde están guardadas
    } {
        try {
            const publications = sessionStorage.getItem(this.storageKey) || '';
            const photos = localStorage.getItem(this.photoStorageKey) || '';
            const tempPhotos = sessionStorage.getItem(this.photoStorageKey + '_temp') || '';
            
            const allPhotos = { ...JSON.parse(photos || '{}'), ...JSON.parse(tempPhotos || '{}') };
            
            return {
                publicationsSize: publications.length,           // Tamaño de publicaciones en caracteres
                photosSize: photos.length + tempPhotos.length,  // Tamaño total de fotos
                totalPhotos: Object.keys(allPhotos).length,     // Cantidad de fotos
                storageType: photos ? 'localStorage' :          // Dónde están guardadas principalmente
                            tempPhotos ? 'sessionStorage' : 'mixed'
            };
        } catch (error) {
            console.error('Error obteniendo info de almacenamiento:', error);
            return {
                publicationsSize: 0,
                photosSize: 0,
                totalPhotos: 0,
                storageType: 'mixed'
            };
        }
    }

    // Función para eliminar solo las fotos (para liberar espacio) pero mantener las publicaciones
    public clearPhotosOnly(): void {
        const photos = this.getStoredPhotos();
        
        Object.values(photos).forEach(photoUrl => {
            if (photoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(photoUrl);
            }
        });
        
        localStorage.removeItem(this.photoStorageKey);
        sessionStorage.removeItem(this.photoStorageKey + '_temp');
        
        // Actualizamos las publicaciones para marcar que ya no tienen fotos
        const publications = this.getPublications().map(pub => ({
            ...pub,
            hasImage: false,        // Ya no tiene imagen
            imageUrl: undefined     // Sin dirección de imagen
        }));
        
        this.savePublications(publications);
    }
}

export default PublicationsService;