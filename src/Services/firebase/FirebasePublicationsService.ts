import { 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    orderBy, 
    limit, 
    where, 
    onSnapshot, 
    doc, 
    updateDoc, 
    increment,
    serverTimestamp,
    Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface RealPublication {
    id: string;
    userId: string;
    username: string;
    userDisplayName: string;
    userPhoto: string;
    text: string;
    stars: number;
    restaurant: string;
    location: 'centro' | 'norte' | 'sur' | 'oeste';
    hasImage: boolean;
    imageUrl?: string;
    timestamp: number;
    likes: number;
    bookmarks: number;
    verified: boolean;
    createdAt: Timestamp;
}

export interface CreatePublicationData {
    text: string;
    stars: number;
    restaurant: string;
    location: 'centro' | 'norte' | 'sur' | 'oeste';
    imageUrl?: string;
}

type PublicationListener = (publications: RealPublication[]) => void;

export class FirebasePublicationsService {
    private static instance: FirebasePublicationsService;
    private listeners: PublicationListener[] = [];
    private unsubscribe?: () => void;
    private publicationsCache: RealPublication[] = [];

    private constructor() {
        this.setupRealtimeListener();
    }

    public static getInstance(): FirebasePublicationsService {
        if (!FirebasePublicationsService.instance) {
            FirebasePublicationsService.instance = new FirebasePublicationsService();
        }
        return FirebasePublicationsService.instance;
    }

    // Configurar listener en tiempo real
    private setupRealtimeListener(): void {
        try {
            const publicationsRef = collection(db, 'publications');
            const q = query(
                publicationsRef, 
                orderBy('createdAt', 'desc'), 
                limit(50)
            );

            this.unsubscribe = onSnapshot(q, (snapshot) => {
                const publications: RealPublication[] = [];
                
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    publications.push({
                        id: doc.id,
                        userId: data.userId || '',
                        username: data.username || 'Usuario',
                        userDisplayName: data.userDisplayName || 'Usuario Anónimo',
                        userPhoto: data.userPhoto || 'https://randomuser.me/api/portraits/women/44.jpg',
                        text: data.text || '',
                        stars: data.stars || 5,
                        restaurant: data.restaurant || '',
                        location: data.location || 'centro',
                        hasImage: data.hasImage || false,
                        imageUrl: data.imageUrl,
                        timestamp: data.createdAt?.toMillis() || Date.now(),
                        likes: data.likes || 0,
                        bookmarks: data.bookmarks || 0,
                        verified: data.verified || false,
                        createdAt: data.createdAt
                    });
                });

                this.publicationsCache = publications;
                this.notifyListeners(publications);
                
                console.log(`📱 ${publications.length} publicaciones cargadas desde Firebase`);
            }, (error) => {
                console.error('Error en listener de publicaciones:', error);
                this.notifyListeners([]);
            });

        } catch (error) {
            console.error('Error configurando listener:', error);
        }
    }

    // Crear nueva publicación
    public async createPublication(
        publicationData: CreatePublicationData,
        currentUser: { uid: string; displayName?: string | null; email?: string | null; photoURL?: string | null }
    ): Promise<string | null> {
        try {
            const publicationsRef = collection(db, 'publications');
            
            const newPublication = {
                userId: currentUser.uid,
                username: this.generateUsername(currentUser.displayName, currentUser.email),
                userDisplayName: currentUser.displayName || 'Usuario Anónimo',
                userPhoto: currentUser.photoURL || 'https://randomuser.me/api/portraits/women/44.jpg',
                text: publicationData.text,
                stars: publicationData.stars,
                restaurant: publicationData.restaurant,
                location: publicationData.location,
                hasImage: !!publicationData.imageUrl,
                imageUrl: publicationData.imageUrl || null,
                likes: 0,
                bookmarks: 0,
                verified: false, // Se puede cambiar por lógica de verificación
                createdAt: serverTimestamp()
            };

            const docRef = await addDoc(publicationsRef, newPublication);
            console.log('✅ Publicación creada con ID:', docRef.id);
            
            return docRef.id;
        } catch (error) {
            console.error('Error creando publicación:', error);
            return null;
        }
    }

    // Obtener publicaciones por ubicación
    public async getPublicationsByLocation(location: string): Promise<RealPublication[]> {
        if (location === 'cali') {
            return this.publicationsCache;
        }

        return this.publicationsCache.filter(pub => pub.location === location);
    }

    // Buscar publicaciones por restaurante
    public async searchPublicationsByRestaurant(restaurantName: string): Promise<RealPublication[]> {
        return this.publicationsCache.filter(pub => 
            pub.restaurant.toLowerCase().includes(restaurantName.toLowerCase()) ||
            pub.text.toLowerCase().includes(restaurantName.toLowerCase())
        );
    }

    // Dar like a una publicación
    public async toggleLike(publicationId: string): Promise<boolean> {
        try {
            const publicationRef = doc(db, 'publications', publicationId);
            await updateDoc(publicationRef, {
                likes: increment(1)
            });
            return true;
        } catch (error) {
            console.error('Error dando like:', error);
            return false;
        }
    }

    // Guardar publicación
    public async toggleBookmark(publicationId: string): Promise<boolean> {
        try {
            const publicationRef = doc(db, 'publications', publicationId);
            await updateDoc(publicationRef, {
                bookmarks: increment(1)
            });
            return true;
        } catch (error) {
            console.error('Error guardando publicación:', error);
            return false;
        }
    }

    // Obtener publicaciones de un usuario específico
    public async getUserPublications(userId: string): Promise<RealPublication[]> {
        try {
            const publicationsRef = collection(db, 'publications');
            const q = query(
                publicationsRef,
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );

            const snapshot = await getDocs(q);
            const publications: RealPublication[] = [];

            snapshot.forEach((doc) => {
                const data = doc.data();
                publications.push({
                    id: doc.id,
                    userId: data.userId,
                    username: data.username,
                    userDisplayName: data.userDisplayName,
                    userPhoto: data.userPhoto,
                    text: data.text,
                    stars: data.stars,
                    restaurant: data.restaurant,
                    location: data.location,
                    hasImage: data.hasImage,
                    imageUrl: data.imageUrl,
                    timestamp: data.createdAt?.toMillis() || Date.now(),
                    likes: data.likes || 0,
                    bookmarks: data.bookmarks || 0,
                    verified: data.verified || false,
                    createdAt: data.createdAt
                });
            });

            return publications;
        } catch (error) {
            console.error('Error obteniendo publicaciones del usuario:', error);
            return [];
        }
    }

    // Obtener estadísticas
    public getStats(): {
        total: number;
        byLocation: { [key: string]: number };
        topRestaurants: Array<{ name: string; count: number; averageRating: number }>;
    } {
        const stats = {
            total: this.publicationsCache.length,
            byLocation: {
                centro: 0,
                norte: 0,
                sur: 0,
                oeste: 0
            },
            topRestaurants: [] as Array<{ name: string; count: number; averageRating: number }>
        };

        // Contar por ubicación
        this.publicationsCache.forEach(pub => {
            if (stats.byLocation[pub.location] !== undefined) {
                stats.byLocation[pub.location]++;
            }
        });

        // Top restaurantes
        const restaurantMap: { [key: string]: { count: number; totalStars: number } } = {};
        
        this.publicationsCache.forEach(pub => {
            if (!restaurantMap[pub.restaurant]) {
                restaurantMap[pub.restaurant] = { count: 0, totalStars: 0 };
            }
            restaurantMap[pub.restaurant].count++;
            restaurantMap[pub.restaurant].totalStars += pub.stars;
        });

        stats.topRestaurants = Object.entries(restaurantMap)
            .map(([name, data]) => ({
                name,
                count: data.count,
                averageRating: data.totalStars / data.count
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        return stats;
    }

    // Suscribirse a cambios
    public subscribe(listener: PublicationListener): () => void {
        this.listeners.push(listener);
        
        // Enviar datos actuales inmediatamente
        if (this.publicationsCache.length > 0) {
            listener(this.publicationsCache);
        }

        // Retornar función para desuscribirse
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Notificar a todos los listeners
    private notifyListeners(publications: RealPublication[]): void {
        this.listeners.forEach(listener => {
            try {
                listener(publications);
            } catch (error) {
                console.error('Error en listener de publicaciones:', error);
            }
        });
    }

    // Utilities
    private generateUsername(displayName: string | null | undefined, email: string | null | undefined): string {
        if (displayName) {
            return `@${displayName.replace(/\s+/g, '').toLowerCase()}`;
        }
        if (email) {
            const name = email.split('@')[0];
            return `@${name}`;
        }
        return `@usuario${Math.floor(Math.random() * 1000)}`;
    }

    // Limpiar listeners
    public cleanup(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        this.listeners = [];
    }

    // Método para poblar datos iniciales (solo para desarrollo)
    public async seedInitialData(): Promise<void> {
        try {
            const existingDocs = await getDocs(query(collection(db, 'publications'), limit(1)));
            
            if (existingDocs.empty) {
                console.log('🌱 Poblando datos iniciales...');
                
                // Datos de ejemplo realistas
                const samplePublications = [
                    {
                        userId: 'seed_user_1',
                        username: '@cristinacali',
                        userDisplayName: 'Cristina Jáuregui',
                        userPhoto: 'https://randomuser.me/api/portraits/women/44.jpg',
                        text: 'El coctel de hierba buena en @AndresCarne está delicioso para los amantes como yo de los sabores frescos, costo 25.000 y lo recomiendo 100%',
                        stars: 5,
                        restaurant: 'Andrés Carne de Res',
                        location: 'norte' as const,
                        hasImage: false,
                        likes: 12,
                        bookmarks: 3,
                        verified: true,
                        createdAt: serverTimestamp()
                    },
                    {
                        userId: 'seed_user_2',
                        username: '@foodiecaleño',
                        userDisplayName: 'Carlos Mesa',
                        userPhoto: 'https://randomuser.me/api/portraits/men/32.jpg',
                        text: 'La pizza en @Presto estuvo espectacular! Masa crujiente y ingredientes frescos. El lugar está muy bien ubicado en el sur',
                        stars: 4,
                        restaurant: 'Presto',
                        location: 'sur' as const,
                        hasImage: true,
                        likes: 8,
                        bookmarks: 5,
                        verified: false,
                        createdAt: serverTimestamp()
                    }
                ];

                for (const publication of samplePublications) {
                    await addDoc(collection(db, 'publications'), publication);
                }
                
                console.log('✅ Datos iniciales poblados');
            }
        } catch (error) {
            console.error('Error poblando datos iniciales:', error);
        }
    }
}

// Export singleton instance
export const firebasePublications = FirebasePublicationsService.getInstance();