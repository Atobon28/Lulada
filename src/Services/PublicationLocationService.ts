// src/Services/PublicationLocationService.ts

export interface LocationData {
    lat: number;
    lng: number;
    address: string;
    zone?: 'centro' | 'norte' | 'sur' | 'oeste';
}

export interface PublicationWithLocation {
    id: string;
    username: string;
    text: string;
    stars: number;
    location: LocationData;
    timestamp: number;
    hasImage?: boolean;
}

// Interfaz para Google Maps Geocoder
interface GoogleMapsGeocoder {
    geocode: (
        request: { location: { lat: number; lng: number } },
        callback: (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => void
    ) => void;
}

export class PublicationLocationService {
    private static instance: PublicationLocationService;
    private storageKey = 'publications_with_location';
    private geocoder: GoogleMapsGeocoder | null = null;

    private constructor() {
        this.initializeGeocoder();
    }

    public static getInstance(): PublicationLocationService {
        if (!PublicationLocationService.instance) {
            PublicationLocationService.instance = new PublicationLocationService();
        }
        return PublicationLocationService.instance;
    }

    private initializeGeocoder() {
        // Verificar si Google Maps está disponible
        if (typeof google !== 'undefined' && google.maps && google.maps.Geocoder) {
            this.geocoder = new google.maps.Geocoder();
        }
    }

    // Determinar zona de Cali basada en coordenadas
    private determineZone(lat: number, lng: number): 'centro' | 'norte' | 'sur' | 'oeste' {
        // Coordenadas aproximadas para las zonas de Cali
        // Estos son valores aproximados - se pueden ajustar según necesidades
        
        if (lat > 3.45 && lng > -76.52) {
            return 'norte';
        } else if (lat < 3.42 && lng > -76.54) {
            return 'sur';
        } else if (lng < -76.55) {
            return 'oeste';
        } else {
            return 'centro';
        }
    }

    // Obtener dirección usando geocoding
    public async getAddressFromCoordinates(lat: number, lng: number): Promise<string> {
        return new Promise((resolve) => {
            if (!this.geocoder) {
                resolve('Ubicación en Cali, Colombia');
                return;
            }

            this.geocoder.geocode(
                { location: { lat, lng } },
                (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
                    if (status === 'OK' && results && results[0]) {
                        resolve(results[0].formatted_address);
                    } else {
                        resolve('Ubicación en Cali, Colombia');
                    }
                }
            );
        });
    }

    // Crear publicación con ubicación
    public async createPublicationWithLocation(
        publicationData: Omit<PublicationWithLocation, 'id' | 'timestamp' | 'location'>,
        coordinates: { lat: number; lng: number }
    ): Promise<PublicationWithLocation> {
        const address = await this.getAddressFromCoordinates(coordinates.lat, coordinates.lng);
        const zone = this.determineZone(coordinates.lat, coordinates.lng);

        const publication: PublicationWithLocation = {
            ...publicationData,
            id: Date.now().toString(),
            timestamp: Date.now(),
            location: {
                lat: coordinates.lat,
                lng: coordinates.lng,
                address,
                zone
            }
        };

        // Guardar en localStorage
        this.savePublication(publication);

        return publication;
    }

    // Guardar publicación
    private savePublication(publication: PublicationWithLocation) {
        try {
            const publications = this.getPublications();
            publications.unshift(publication);
            localStorage.setItem(this.storageKey, JSON.stringify(publications));
        } catch (error) {
            console.error('Error al guardar publicación:', error);
        }
    }

    // Obtener todas las publicaciones con ubicación
    public getPublications(): PublicationWithLocation[] {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error al obtener publicaciones:', error);
            return [];
        }
    }

    // Obtener publicaciones por zona
    public getPublicationsByZone(zone: 'centro' | 'norte' | 'sur' | 'oeste'): PublicationWithLocation[] {
        return this.getPublications().filter(pub => pub.location.zone === zone);
    }

    // Obtener publicaciones cercanas a una ubicación
    public getNearbyPublications(lat: number, lng: number, radiusKm: number = 2): PublicationWithLocation[] {
        const publications = this.getPublications();
        
        return publications.filter(pub => {
            const distance = this.calculateDistance(
                lat, lng,
                pub.location.lat, pub.location.lng
            );
            return distance <= radiusKm;
        });
    }

    // Calcular distancia entre dos puntos (fórmula de Haversine)
    private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
        const R = 6371; // Radio de la Tierra en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // Limpiar todas las publicaciones
    public clearPublications(): void {
        localStorage.removeItem(this.storageKey);
    }

    // Obtener estadísticas de ubicación
    public getLocationStats() {
        const publications = this.getPublications();
        const zoneStats = {
            centro: 0,
            norte: 0,
            sur: 0,
            oeste: 0
        };

        publications.forEach(pub => {
            if (pub.location.zone) {
                zoneStats[pub.location.zone]++;
            }
        });

        return {
            total: publications.length,
            byZone: zoneStats,
            averageRating: publications.length > 0
                ? publications.reduce((sum, pub) => sum + pub.stars, 0) / publications.length
                : 0
        };
    }
}

export default PublicationLocationService;