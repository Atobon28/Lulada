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
        // Si no existe una instancia, la creamos
        if (!PublicationsService.instance) {
            PublicationsService.instance = new PublicationsService();
        }
        // Devolvemos la instancia única
        return PublicationsService.instance;
    }

    // Función para agregar una nueva publicación (cuando alguien escribe una reseña)
    public addPublication(publication: Publication): void {
        // Obtenemos todas las publicaciones que ya existen
        const publications = this.getPublications();
        
        // Creamos la nueva publicación con la hora actual
        const newPublication = {
            ...publication,                    // Copiamos toda la información
            timestamp: Date.now()             // Agregamos el momento actual
        };

        // Si la publicación tiene una foto, la guardamos por separado
        if (newPublication.imageUrl) {
            // Guardamos la foto en una caja diferente para no ocupar mucho espacio
            this.storePhotoSeparately(newPublication.timestamp!, newPublication.imageUrl);
            // Quitamos la foto del objeto principal para ahorrar espacio
            delete newPublication.imageUrl;
            // Marcamos que sí tiene imagen
            newPublication.hasImage = true;
        }

        // Agregamos la nueva publicación al inicio de la lista (las más nuevas primero)
        publications.unshift(newPublication);
        // Guardamos toda la lista actualizada
        this.savePublications(publications);

        // Avisamos a toda la app que hay una nueva publicación
        document.dispatchEvent(new CustomEvent('nueva-publicacion', {
            detail: newPublication
        }));

        console.log(' Nueva publicación agregada:', newPublication);
    }

    // Función privada para guardar las fotos por separado (para no llenar la memoria)
    private storePhotoSeparately(timestamp: number, imageUrl: string): void {
        try {
            // Obtenemos las fotos que ya están guardadas
            const photos = this.getStoredPhotos();
            // Guardamos la nueva foto usando el timestamp como identificador
            photos[timestamp.toString()] = imageUrl;
            // Intentamos guardar en la memoria permanente del navegador
            localStorage.setItem(this.photoStorageKey, JSON.stringify(photos));
            console.log('Foto almacenada para timestamp:', timestamp);
        } catch (error) {
            console.error('Error almacenando foto:', error);
            // Si no se puede guardar (muy grande), usamos memoria temporal
            this.createBlobUrl(imageUrl, timestamp);
        }
    }

    // Función para crear una dirección temporal si la foto es muy grande
    private createBlobUrl(base64: string, timestamp: number): void {
        try {
            // Convertimos la imagen de texto a formato binario
            const byteCharacters = atob(base64.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            // Creamos un "objeto" de imagen en memoria
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            // Creamos una dirección temporal para acceder a la imagen
            const blobUrl = URL.createObjectURL(blob);
            
            // Guardamos esta dirección temporal
            const photos = this.getStoredPhotos();
            photos[timestamp.toString()] = blobUrl;
            sessionStorage.setItem(this.photoStorageKey + '_temp', JSON.stringify(photos));
            
            console.log(' Blob URL creado para timestamp:', timestamp);
        } catch (error) {
            console.error(' Error creando blob URL:', error);
        }
    }

    // Función para obtener todas las fotos guardadas
    private getStoredPhotos(): { [key: string]: string } {
        try {
            // Primero intentamos buscar en la memoria permanente
            const stored = localStorage.getItem(this.photoStorageKey);
            if (stored) {
                return JSON.parse(stored);
            }
            
            // Si no encontramos ahí, buscamos en la memoria temporal
            const tempStored = sessionStorage.getItem(this.photoStorageKey + '_temp');
            if (tempStored) {
                return JSON.parse(tempStored);
            }
            
            // Si no hay nada, devolvemos un objeto vacío
            return {};
        } catch (error) {
            console.error('Error obteniendo fotos:', error);
            return {};
        }
    }

    // Función para obtener la dirección de una foto específica
    public getPhotoUrl(timestamp: number): string | undefined {
        const photos = this.getStoredPhotos();
        // Buscamos la foto por su timestamp y la devolvemos
        return photos[timestamp.toString()] || undefined;
    }

    // Función principal para obtener todas las publicaciones
    public getPublications(): Publication[] {
        try {
            // Buscamos las publicaciones en la memoria temporal del navegador
            const stored = sessionStorage.getItem(this.storageKey);
            const publications = stored ? JSON.parse(stored) : [];
            
            // Para cada publicación, si tiene imagen, buscamos su foto
            return publications.map((pub: Publication) => {
                if (pub.hasImage && pub.timestamp) {
                    // Buscamos la dirección de la foto
                    const photoUrl = this.getPhotoUrl(pub.timestamp);
                    if (photoUrl) {
                        // Si encontramos la foto, la agregamos a la publicación
                        return { ...pub, imageUrl: photoUrl };
                    }
                }
                // Si no tiene foto, devolvemos la publicación tal como está
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
        // Filtramos solo las publicaciones de la zona solicitada
        return publications.filter(pub => pub.location === location);
    }

    // Función para buscar publicaciones por nombre de restaurante
    public searchByRestaurant(query: string): Publication[] {
        const publications = this.getPublications();
        const searchTerm = query.toLowerCase(); // Convertimos a minúsculas para buscar mejor
        
        return publications.filter(pub => {
            // Buscamos en el texto de la reseña
            if (pub.text.toLowerCase().includes(searchTerm)) return true;
            
            // Buscamos en el nombre del restaurante
            if (pub.restaurant?.toLowerCase().includes(searchTerm)) return true;
            
            return false;
        });
    }

    // Función para obtener todas las reseñas de un restaurante específico
    public getPublicationsByRestaurant(restaurantName: string): Publication[] {
        const publications = this.getPublications();
        const searchTerm = restaurantName.toLowerCase();
        
        return publications.filter(pub => {
            // Comparamos el nombre exacto del restaurante
            if (pub.restaurant?.toLowerCase() === searchTerm) return true;
            return false;
        });
    }

    // Función para actualizar una publicación que ya existe
    public updatePublication(updatedPublication: Publication): boolean {
        try {
            const publications = this.getPublications();
            // Buscamos la publicación por usuario y timestamp
            const index = publications.findIndex(pub => 
                pub.username === updatedPublication.username && 
                pub.timestamp === updatedPublication.timestamp
            );
            
            if (index !== -1) {
                // Si encontramos la publicación y tiene nueva foto
                if (updatedPublication.imageUrl && updatedPublication.timestamp) {
                    // Guardamos la nueva foto por separado
                    this.storePhotoSeparately(updatedPublication.timestamp, updatedPublication.imageUrl);
                    delete updatedPublication.imageUrl;
                    updatedPublication.hasImage = true;
                }
                
                // Reemplazamos la publicación antigua con la nueva
                publications[index] = updatedPublication;
                this.savePublications(publications);
                
                // Avisamos que se actualizó una publicación
                document.dispatchEvent(new CustomEvent('publicacion-actualizada', {
                    detail: updatedPublication
                }));
                
                return true; // Éxito
            }
            return false; // No se encontró la publicación
        } catch (error) {
            console.error('Error al actualizar publicación:', error);
            return false;
        }
    }

    // Función para eliminar una publicación específica
    public deletePublication(username: string, timestamp: number): boolean {
        try {
            const publications = this.getPublications();
            // Filtramos todas las publicaciones excepto la que queremos eliminar
            const filteredPublications = publications.filter(pub => 
                !(pub.username === username && pub.timestamp === timestamp)
            );
            
            // Si el tamaño cambió, significa que sí eliminamos algo
            if (filteredPublications.length !== publications.length) {
                // Eliminamos también la foto asociada si existe
                this.deletePhoto(timestamp);
                
                // Guardamos la lista sin la publicación eliminada
                this.savePublications(filteredPublications);
                
                // Avisamos que se eliminó una publicación
                document.dispatchEvent(new CustomEvent('publicacion-eliminada', {
                    detail: { username, timestamp }
                }));
                
                return true; // Éxito
            }
            return false; // No se encontró nada para eliminar
        } catch (error) {
            console.error('Error al eliminar publicación:', error);
            return false;
        }
    }

    // Función privada para eliminar una foto específica
    private deletePhoto(timestamp: number): void {
        try {
            // Obtenemos todas las fotos guardadas
            const photos = this.getStoredPhotos();
            const photoUrl = photos[timestamp.toString()];
            
            // Si la foto es una dirección temporal, la liberamos de la memoria
            if (photoUrl && photoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(photoUrl);
            }
            
            // Eliminamos la foto de la lista
            delete photos[timestamp.toString()];
            localStorage.setItem(this.photoStorageKey, JSON.stringify(photos));
            
            // También limpiamos la memoria temporal si existe
            try {
                const tempPhotos = JSON.parse(sessionStorage.getItem(this.photoStorageKey + '_temp') || '{}');
                delete tempPhotos[timestamp.toString()];
                sessionStorage.setItem(this.photoStorageKey + '_temp', JSON.stringify(tempPhotos));
            } catch {
                // Si hay error, lo ignoramos
                console.log('Limpieza de sessionStorage temporal completada');
            }
            
            console.log(' Foto eliminada para timestamp:', timestamp);
        } catch (error) {
            console.error('Error eliminando foto:', error);
        }
    }

    // Función privada para guardar la lista de publicaciones
    private savePublications(publications: Publication[]): void {
        try {
            // Creamos una copia sin las fotos para ahorrar espacio
            const publicationsToSave = publications.map(pub => {
                // Quitamos imageUrl y guardamos el resto
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { imageUrl, ...pubWithoutImage } = pub;
                return pubWithoutImage;
            });
            
            // Guardamos en la memoria temporal del navegador
            sessionStorage.setItem(this.storageKey, JSON.stringify(publicationsToSave));
        } catch (error) {
            console.error('Error al guardar publicaciones:', error);
        }
    }

    // Función para eliminar TODAS las publicaciones y fotos
    public clearPublications(): void {
        // Eliminamos las publicaciones
        sessionStorage.removeItem(this.storageKey);
        
        // Liberamos todas las direcciones temporales de fotos
        const photos = this.getStoredPhotos();
        Object.values(photos).forEach(photoUrl => {
            if (photoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(photoUrl);
            }
        });
        
        // Eliminamos todas las fotos guardadas
        localStorage.removeItem(this.photoStorageKey);
        sessionStorage.removeItem(this.photoStorageKey + '_temp');
        
        // Avisamos que se limpiaron todas las publicaciones
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

        let photosCount = 0; // Contador de fotos
        
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
        // Objeto para contar reseñas por restaurante
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
                // Si es la primera vez que vemos este restaurante, lo inicializamos
                if (!restaurantStats[restaurantName]) {
                    restaurantStats[restaurantName] = { count: 0, totalStars: 0 };
                }
                // Sumamos una reseña más y las estrellas
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
        // Creamos una copia sin fotos para que el archivo no sea muy pesado
        const publications = this.getPublications().map(pub => {
            const { imageUrl, ...pubWithoutImage } = pub;
            return { ...pubWithoutImage, hasImage: !!imageUrl }; // Solo marcamos si tenía imagen
        });
        // Convertimos a texto JSON bonito
        return JSON.stringify(publications, null, 2);
    }

    // Función para importar publicaciones desde un archivo JSON
    public importPublications(jsonData: string): boolean {
        try {
            // Intentamos convertir el texto a objeto JavaScript
            const publications = JSON.parse(jsonData);
            if (Array.isArray(publications)) {
                // Limpiamos las fotos al importar para evitar problemas
                const cleanPublications = publications.map(pub => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { imageUrl, ...cleanPub } = pub;
                    return cleanPub;
                });
                
                // Guardamos las publicaciones importadas
                this.savePublications(cleanPublications);
                
                // Avisamos que se importaron publicaciones
                document.dispatchEvent(new CustomEvent('publicaciones-importadas', {
                    detail: { count: cleanPublications.length }
                }));
                return true; // Éxito
            }
            return false; // El archivo no tenía el formato correcto
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
            // Obtenemos el tamaño de cada tipo de datos
            const publications = sessionStorage.getItem(this.storageKey) || '';
            const photos = localStorage.getItem(this.photoStorageKey) || '';
            const tempPhotos = sessionStorage.getItem(this.photoStorageKey + '_temp') || '';
            
            // Combinamos todas las fotos para contarlas
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
            // Si hay error, devolvemos valores por defecto
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
        // Obtenemos todas las fotos
        const photos = this.getStoredPhotos();
        
        // Liberamos las direcciones temporales de memoria
        Object.values(photos).forEach(photoUrl => {
            if (photoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(photoUrl);
            }
        });
        
        // Eliminamos todas las fotos guardadas
        localStorage.removeItem(this.photoStorageKey);
        sessionStorage.removeItem(this.photoStorageKey + '_temp');
        
        // Actualizamos las publicaciones para marcar que ya no tienen fotos
        const publications = this.getPublications().map(pub => ({
            ...pub,
            hasImage: false,        // Ya no tiene imagen
            imageUrl: undefined     // Sin dirección de imagen
        }));
        
        // Guardamos las publicaciones actualizadas
        this.savePublications(publications);
        
        console.log(' Todas las fotos han sido eliminadas');
    }
}

// Exportamos la clase para que se pueda usar en otros archivos
export default PublicationsService;