export interface Publication {
    username: string;
    text: string;
    stars: number;
    location: string;
    hasImage?: boolean;
    timestamp?: number;
    restaurant?: string;
    imageUrl?: string | undefined; // NUEVO: URL de la imagen (base64 o blob URL)
}

export class PublicationsService {
    private static instance: PublicationsService;
    private storageKey = 'publicaciones';
    private photoStorageKey = 'publicaciones_photos'; // NUEVO: Storage separado para fotos

    private constructor() {}

    public static getInstance(): PublicationsService {
        if (!PublicationsService.instance) {
            PublicationsService.instance = new PublicationsService();
        }
        return PublicationsService.instance;
    }

    // Agregar nueva publicación (ACTUALIZADO PARA FOTOS)
    public addPublication(publication: Publication): void {
        const publications = this.getPublications();
        const newPublication = {
            ...publication,
            timestamp: Date.now()
        };

        // Si hay foto, manejarla por separado para evitar problemas de tamaño
        if (newPublication.imageUrl) {
            this.storePhotoSeparately(newPublication.timestamp!, newPublication.imageUrl);
            // Quitar imageUrl del objeto principal para ahorrar espacio
            delete newPublication.imageUrl;
            newPublication.hasImage = true;
        }

        publications.unshift(newPublication); // Agregar al inicio
        this.savePublications(publications);

        // Disparar evento personalizado
        document.dispatchEvent(new CustomEvent('nueva-publicacion', {
            detail: newPublication
        }));

        console.log('📝 Nueva publicación agregada:', newPublication);
    }

    // NUEVO: Almacenar foto por separado
    private storePhotoSeparately(timestamp: number, imageUrl: string): void {
        try {
            const photos = this.getStoredPhotos();
            photos[timestamp.toString()] = imageUrl;
            localStorage.setItem(this.photoStorageKey, JSON.stringify(photos));
            console.log('📸 Foto almacenada para timestamp:', timestamp);
        } catch (error) {
            console.error('❌ Error almacenando foto:', error);
            // Si no se puede almacenar en localStorage (muy grande), usar blob URL temporal
            this.createBlobUrl(imageUrl, timestamp);
        }
    }

    // NUEVO: Crear blob URL temporal si localStorage falla
    private createBlobUrl(base64: string, timestamp: number): void {
        try {
            // Convertir base64 a blob
            const byteCharacters = atob(base64.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            const blobUrl = URL.createObjectURL(blob);
            
            // Almacenar blob URL temporalmente
            const photos = this.getStoredPhotos();
            photos[timestamp.toString()] = blobUrl;
            sessionStorage.setItem(this.photoStorageKey + '_temp', JSON.stringify(photos));
            
            console.log('📸 Blob URL creado para timestamp:', timestamp);
        } catch (error) {
            console.error('❌ Error creando blob URL:', error);
        }
    }

    // NUEVO: Obtener fotos almacenadas
    private getStoredPhotos(): { [key: string]: string } {
        try {
            // Intentar localStorage primero
            const stored = localStorage.getItem(this.photoStorageKey);
            if (stored) {
                return JSON.parse(stored);
            }
            
            // Luego sessionStorage temporal
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

    // NUEVO: Obtener URL de foto por timestamp
    public getPhotoUrl(timestamp: number): string | undefined {
        const photos = this.getStoredPhotos();
        return photos[timestamp.toString()] || undefined;
    }

    // Obtener todas las publicaciones (ACTUALIZADO PARA FOTOS)
    public getPublications(): Publication[] {
        try {
            const stored = sessionStorage.getItem(this.storageKey);
            const publications = stored ? JSON.parse(stored) : [];
            
            // Restaurar URLs de fotos
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
                // Manejar foto si existe
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

    // Eliminar una publicación (ACTUALIZADO PARA FOTOS)
    public deletePublication(username: string, timestamp: number): boolean {
        try {
            const publications = this.getPublications();
            const filteredPublications = publications.filter(pub => 
                !(pub.username === username && pub.timestamp === timestamp)
            );
            
            if (filteredPublications.length !== publications.length) {
                // Eliminar foto asociada si existe
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

    // NUEVO: Eliminar foto específica
    private deletePhoto(timestamp: number): void {
        try {
            // Eliminar de localStorage
            const photos = this.getStoredPhotos();
            const photoUrl = photos[timestamp.toString()];
            
            // Si es blob URL, revocar para liberar memoria
            if (photoUrl && photoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(photoUrl);
            }
            
            delete photos[timestamp.toString()];
            localStorage.setItem(this.photoStorageKey, JSON.stringify(photos));
            
            // También eliminar de sessionStorage temporal si existe
            try {
                const tempPhotos = JSON.parse(sessionStorage.getItem(this.photoStorageKey + '_temp') || '{}');
                delete tempPhotos[timestamp.toString()];
                sessionStorage.setItem(this.photoStorageKey + '_temp', JSON.stringify(tempPhotos));
            } catch {
                // Ignorar errores de sessionStorage
                console.log('Limpieza de sessionStorage temporal completada');
            }
            
            console.log('🗑️ Foto eliminada para timestamp:', timestamp);
        } catch (error) {
            console.error('Error eliminando foto:', error);
        }
    }

    // Guardar publicaciones
    private savePublications(publications: Publication[]): void {
        try {
            // Crear copia sin imageUrl para ahorrar espacio
            const publicationsToSave = publications.map(pub => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { imageUrl, ...pubWithoutImage } = pub;
                return pubWithoutImage;
            });
            
            sessionStorage.setItem(this.storageKey, JSON.stringify(publicationsToSave));
        } catch (error) {
            console.error('Error al guardar publicaciones:', error);
        }
    }

    // Limpiar todas las publicaciones (ACTUALIZADO PARA FOTOS)
    public clearPublications(): void {
        // Limpiar publicaciones
        sessionStorage.removeItem(this.storageKey);
        
        // Limpiar fotos y revocar blob URLs
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

    // Obtener estadísticas
    public getStats() {
        const publications = this.getPublications();
        const locationStats: { [key: string]: number } = {
            centro: 0,
            norte: 0,
            sur: 0,
            oeste: 0
        };

        let photosCount = 0;
        publications.forEach(pub => {
            if (Object.prototype.hasOwnProperty.call(locationStats, pub.location)) {
                locationStats[pub.location]++;
            }
            if (pub.hasImage) {
                photosCount++;
            }
        });

        const topRestaurants = this.getTopRestaurants(5);

        return {
            total: publications.length,
            withPhotos: photosCount, // NUEVO: Estadística de fotos
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
        const restaurantStats: { [key: string]: { count: number, totalStars: number } } = {};

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
                    restaurantStats[restaurantName] = { count: 0, totalStars: 0 };
                }
                restaurantStats[restaurantName].count++;
                restaurantStats[restaurantName].totalStars += pub.stars;
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

    // Exportar publicaciones como JSON (SIN FOTOS para evitar problemas de tamaño)
    public exportPublications(): string {
        const publications = this.getPublications().map(pub => {
            const { imageUrl, ...pubWithoutImage } = pub;
            return { ...pubWithoutImage, hasImage: !!imageUrl };
        });
        return JSON.stringify(publications, null, 2);
    }

    // Importar publicaciones desde JSON
    public importPublications(jsonData: string): boolean {
        try {
            const publications = JSON.parse(jsonData);
            if (Array.isArray(publications)) {
                // Filtrar fotos al importar para evitar problemas
                const cleanPublications = publications.map(pub => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { imageUrl, ...cleanPub } = pub;
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

    // NUEVO: Obtener estadísticas de almacenamiento
    public getStorageInfo(): { 
        publicationsSize: number, 
        photosSize: number, 
        totalPhotos: number,
        storageType: 'localStorage' | 'sessionStorage' | 'mixed'
    } {
        try {
            const publications = sessionStorage.getItem(this.storageKey) || '';
            const photos = localStorage.getItem(this.photoStorageKey) || '';
            const tempPhotos = sessionStorage.getItem(this.photoStorageKey + '_temp') || '';
            
            const allPhotos = { ...JSON.parse(photos || '{}'), ...JSON.parse(tempPhotos || '{}') };
            
            return {
                publicationsSize: publications.length,
                photosSize: photos.length + tempPhotos.length,
                totalPhotos: Object.keys(allPhotos).length,
                storageType: photos ? 'localStorage' : tempPhotos ? 'sessionStorage' : 'mixed'
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

    // NUEVO: Limpiar solo fotos (para liberar espacio)
    public clearPhotosOnly(): void {
        const photos = this.getStoredPhotos();
        Object.values(photos).forEach(photoUrl => {
            if (photoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(photoUrl);
            }
        });
        
        localStorage.removeItem(this.photoStorageKey);
        sessionStorage.removeItem(this.photoStorageKey + '_temp');
        
        // Actualizar publicaciones para marcar hasImage como false
        const publications = this.getPublications().map(pub => ({
            ...pub,
            hasImage: false,
            imageUrl: undefined
        }));
        
        this.savePublications(publications);
        
        console.log('🗑️ Todas las fotos han sido eliminadas');
    }
}

export default PublicationsService;