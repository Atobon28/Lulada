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

    // Obtener publicaciones filtradas por ubicación
    public getPublicationsByLocation(location: string): Publication[] {
        const publications = this.getPublications();
        return publications.filter(pub => pub.location === location);
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
        const locationStats = {
            centro: 0,
            norte: 0,
            sur: 0,
            oeste: 0
        };

        publications.forEach(pub => {
            if (locationStats.hasOwnProperty(pub.location)) {
                locationStats[pub.location as keyof typeof locationStats]++;
            }
        });

        return {
            total: publications.length,
            byLocation: locationStats,
            averageRating: publications.length > 0 
                ? publications.reduce((sum, pub) => sum + pub.stars, 0) / publications.length 
                : 0
        };
    }
}

export default PublicationsService;