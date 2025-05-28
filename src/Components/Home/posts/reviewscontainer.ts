import './publications';
import './reviews';
import PublicationsService, { Publication } from '../../../Services/PublicationsService';

export class ReviewsContainer extends HTMLElement {
    // Reviews estáticas con algunas que incluyen ubicación específica
    staticReviews: Publication[] = [
        {
            username: "CrisTiJauregui",
            text: "El coctel de hierva buena en @BarBurguer esta super delicioso para los amantes como yo de los sabores frescos, costo 20.000 y lo recomiendo 100%",
            stars: 5,
            restaurant: "BarBurguer",
            location: "centro",
            timestamp: Date.now() - 86400000,
            specificLocation: {
                latitude: 3.4516,
                longitude: -76.5320,
                address: "Calle 5 #38-25, Centro, Cali",
                restaurantName: "BarBurguer"
            }
        },
        {
            username: "DanaBanana",
            text: "Este @AsianRooftop es terrible! No le quito todas las estrellas porque la mesera era super atenta, el problema es que la cocina, terrible, pedi una margarita y era sin licor me dijeron que venia aparte, como es posible???? De nunca volver.",
            stars: 1,
            hasImage: true,
            restaurant: "AsianRooftop",
            location: "norte",
            timestamp: Date.now() - 172800000,
            specificLocation: {
                latitude: 3.4780,
                longitude: -76.5225,
                address: "Av. 6N #15N-25, Granada, Cali",
                restaurantName: "Asian Rooftop"
            }
        },
        {
            username: "FoodLover",
            text: "La pasta en @Frenchrico es increíble! Los mejores sabores italianos que he probado en mucho tiempo.",
            stars: 4,
            restaurant: "Frenchrico",
            location: "sur",
            timestamp: Date.now() - 259200000,
            specificLocation: {
                latitude: 3.4200,
                longitude: -76.5180,
                address: "Calle 8 Sur #50-15, El Ingenio, Cali",
                restaurantName: "Frenchrico"
            }
        },
        {
            username: "GourmetCali",
            text: "El sushi en @SushiLab es exquisito, especialmente el rollo Dragon. Altamente recomendado para los amantes del sushi.",
            stars: 5,
            restaurant: "SushiLab",
            location: "oeste",
            timestamp: Date.now() - 345600000
            // Esta no tiene ubicación específica para mostrar variedad
        },
        {
            username: "CafeAddict",
            text: "El brunch en @MoraCafé me pareció muy completo. Café refill, huevos al gusto y pan artesanal por 35.000. Súper plan de domingo.",
            stars: 4,
            restaurant: "MoraCafé",
            location: "centro",
            timestamp: Date.now() - 432000000,
            specificLocation: {
                latitude: 3.4530,
                longitude: -76.5350,
                address: "Carrera 9 #12-45, Centro Histórico, Cali",
                restaurantName: "Mora Café"
            }
        }
    ];

    locationFilter: string | null = null;
    publicationsService: PublicationsService;
    showOnlyWithLocation: boolean = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.publicationsService = PublicationsService.getInstance();
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Escuchar cambios de filtro de ubicación
        document.addEventListener('location-filter-changed', (e: Event) => {
            const event = e as CustomEvent;
            this.updateLocationFilter(event.detail);
        });

        // También desde el document para compatibilidad
        document.addEventListener('location-changed', (e: Event) => {
            const event = e as CustomEvent;
            this.updateLocationFilter(event.detail);
        });

        // Escuchar nuevas publicaciones
        document.addEventListener('nueva-publicacion', () => {
            console.log('📝 Nueva publicación detectada, actualizando reviews...');
            this.render();
        });

        // Escuchar eventos de publicaciones actualizadas o eliminadas
        document.addEventListener('publicacion-actualizada', () => {
            this.render();
        });

        document.addEventListener('publicacion-eliminada', () => {
            this.render();
        });

        // Escuchar filtros específicos de ubicación
        document.addEventListener('filter-by-location', (e: Event) => {
            const event = e as CustomEvent;
            this.showOnlyWithLocation = event.detail.onlyWithLocation || false;
            this.render();
        });
    }

    updateLocationFilter(location: string) {
        console.log('📍 ReviewsContainer: Actualizando filtro de ubicación a:', location);
        
        // Si es 'cali', mostrar todos
        this.locationFilter = location === 'cali' ? null : location;
        this.render();
        
        console.log('📊 Filtro aplicado:', this.locationFilter || 'todos');
    }

    getAllReviews(): Publication[] {
        // Obtener publicaciones dinámicas del servicio
        const dynamicPublications = this.publicationsService.getPublications();
        
        // Combinar publicaciones dinámicas con las estáticas
        const allReviews = [
            ...dynamicPublications,
            ...this.staticReviews
        ];

        // Ordenar por timestamp (más recientes primero)
        return allReviews.sort((a, b) => {
            const timestampA = a.timestamp || 0;
            const timestampB = b.timestamp || 0;
            return timestampB - timestampA;
        });
    }

    getFilteredReviews(): Publication[] {
        let allReviews = this.getAllReviews();
        
        // Filtrar solo publicaciones con ubicación específica si está activado
        if (this.showOnlyWithLocation) {
            allReviews = allReviews.filter(review => review.specificLocation);
        }
        
        // Si no hay filtro de zona o es 'cali', mostrar todos
        if (!this.locationFilter || this.locationFilter === 'cali') {
            console.log('📊 Mostrando todas las reseñas:', allReviews.length);
            return allReviews;
        }
        
        // Filtrar por ubicación específica (zona)
        const filtered = allReviews.filter(review => review.location === this.locationFilter);
        console.log(`📊 Reseñas filtradas para ${this.locationFilter}:`, filtered.length);
        return filtered;
    }

    // Obtener reseñas en un radio específico de una ubicación
    getReviewsInRadius(centerLat: number, centerLng: number, radiusKm: number = 2): Publication[] {
        return this.publicationsService.getPublicationsInRadius(centerLat, centerLng, radiusKm);
    }

    // Buscar reseñas por restaurante
    searchReviews(query: string): Publication[] {
        return this.publicationsService.searchByRestaurant(query);
    }

    // Obtener estadísticas de ubicaciones
    getLocationStats() {
        const allReviews = this.getAllReviews();
        const stats: { [key: string]: number } = {
            centro: 0,
            norte: 0,
            sur: 0,
            oeste: 0
        };

        const withSpecificLocation = allReviews.filter(review => review.specificLocation).length;

        allReviews.forEach(review => {
            if (Object.prototype.hasOwnProperty.call(stats, review.location)) {
                stats[review.location]++;
            }
        });

        return {
            byZone: stats,
            total: allReviews.length,
            withSpecificLocation: withSpecificLocation,
            percentage: allReviews.length > 0 ? (withSpecificLocation / allReviews.length) * 100 : 0
        };
    }

    render() {
        if (!this.shadowRoot) return;

        const filteredReviews = this.getFilteredReviews();
        const stats = this.getLocationStats();
        let reviewsHTML = '';
            
        filteredReviews.forEach(review => {
            const isNew = review.timestamp && (Date.now() - review.timestamp) < 10000; // Marcar como nuevo si es de los últimos 10 segundos
            const hasSpecificLocation = !!review.specificLocation;
            
            reviewsHTML += `
                <lulada-publication 
                    username="${review.username}" 
                    text="${review.text}" 
                    stars="${review.stars}"
                    ${review.hasImage ? 'has-image="true"' : ''}
                    ${hasSpecificLocation ? `location-data='${JSON.stringify(review.specificLocation)}'` : ''}
                    ${isNew ? 'style="border: 2px solid #4CAF50; animation: fadeIn 0.5s ease-in;"' : ''}
                ></lulada-publication>
            `;
        });

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 650px;
                    margin: 0 auto;
                    padding: 16px;
                    background-color: rgb(255, 255, 255);
                }

                lulada-publication {
                    display: block;
                    width: 100%;
                    margin-bottom: 20px;
                }

                .filter-info {
                    text-align: center;
                    padding: 12px;
                    margin-bottom: 20px;
                    background: linear-gradient(135deg, rgba(170, 171, 84, 0.1), rgba(170, 171, 84, 0.05));
                    border: 1px solid rgba(170, 171, 84, 0.2);
                    border-radius: 10px;
                    color: #666;
                    font-size: 14px;
                    position: relative;
                }

                .filter-info::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background: #AAAB54;
                    border-radius: 10px 0 0 10px;
                }

                .filter-title {
                    font-weight: bold;
                    color: #AAAB54;
                    margin-bottom: 4px;
                }

                .filter-stats {
                    font-size: 12px;
                    color: #888;
                    margin-top: 6px;
                }

                .location-controls {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }

                .filter-button {
                    padding: 6px 12px;
                    border: 1px solid #ddd;
                    background: white;
                    border-radius: 20px;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: #666;
                }

                .filter-button:hover {
                    background: #f8f9fa;
                    border-color: #AAAB54;
                    color: #AAAB54;
                }

                .filter-button.active {
                    background: #AAAB54;
                    border-color: #AAAB54;
                    color: white;
                }

                .no-reviews {
                    text-align: center;
                    padding: 40px 24px;
                    color: #666;
                    font-style: italic;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    font-size: 16px;
                    line-height: 1.5;
                    border: 2px dashed #ddd;
                }

                .no-reviews-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                    opacity: 0.5;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .new-publication {
                    border: 2px solid #4CAF50 !important;
                    animation: fadeIn 0.5s ease-in;
                }

                @media (max-width: 768px) {
                    :host {
                        padding: 12px;
                    }
                    
                    .filter-info {
                        font-size: 13px;
                        padding: 10px;
                    }
                    
                    .no-reviews {
                        padding: 30px 20px;
                        font-size: 15px;
                    }

                    .no-reviews-icon {
                        font-size: 36px;
                        margin-bottom: 12px;
                    }

                    .location-controls {
                        gap: 8px;
                    }

                    .filter-button {
                        padding: 5px 10px;
                        font-size: 12px;
                    }
                }
            </style>
            
            ${this.locationFilter ? `
                <div class="filter-info">
                    <div class="filter-title">📍 Filtro activo</div>
                    <div>Mostrando reseñas de: <strong>${this.locationFilter.charAt(0).toUpperCase() + this.locationFilter.slice(1)}</strong></div>
                    <div class="filter-stats">
                        ${filteredReviews.length} de ${stats.total} reseñas • 
                        ${stats.withSpecificLocation} con ubicación específica (${stats.percentage.toFixed(1)}%)
                    </div>
                </div>
            ` : ''}

            <div class="location-controls">
                <button class="filter-button ${!this.showOnlyWithLocation ? 'active' : ''}" 
                        data-action="show-all">
                    📱 Todas las reseñas
                </button>
                <button class="filter-button ${this.showOnlyWithLocation ? 'active' : ''}" 
                        data-action="show-with-location">
                    📍 Solo con ubicación (${stats.withSpecificLocation})
                </button>
            </div>
            
            ${filteredReviews.length > 0 ? 
                reviewsHTML : 
                `<div class="no-reviews">
                    <div class="no-reviews-icon">🍽️</div>
                    ${this.locationFilter ? 
                        `No hay reseñas para <strong>${this.locationFilter}</strong>.<br>¡Sé el primero en compartir tu experiencia en esta zona!` :
                        this.showOnlyWithLocation ?
                        'No hay reseñas con ubicación específica aún.<br>¡Agrega la ubicación de tus restaurantes favoritos cuando hagas "antojar"!' :
                        'No hay reseñas disponibles.<br>¡Sé el primero en compartir tu experiencia!'
                    }
                </div>`
            }
        `;

        // Agregar event listeners para los botones de filtro
        this.setupFilterButtons();

        console.log(`✅ Renderizadas ${filteredReviews.length} reseñas para ubicación: ${this.locationFilter || 'todas'} | Con ubicación específica: ${this.showOnlyWithLocation}`);
    }

    private setupFilterButtons() {
        const filterButtons = this.shadowRoot?.querySelectorAll('.filter-button');
        filterButtons?.forEach(button => {
            button.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const action = target.getAttribute('data-action');
                
                if (action === 'show-all') {
                    this.showOnlyWithLocation = false;
                } else if (action === 'show-with-location') {
                    this.showOnlyWithLocation = true;
                }
                
                this.render();
            });
        });
    }

    // Métodos públicos para uso externo
    public filterByLocation(location: string) {
        this.updateLocationFilter(location);
    }

    public toggleLocationFilter() {
        this.showOnlyWithLocation = !this.showOnlyWithLocation;
        this.render();
    }

    public getStats() {
        return this.getLocationStats();
    }

    public exportReviews(): string {
        return this.publicationsService.exportPublications();
    }

    public clearAllReviews() {
        this.publicationsService.clearPublications();
        this.render();
    }

    // Método para obtener todas las ubicaciones únicas
    public getUniqueLocations(): Array<{name: string, count: number, hasSpecific: boolean}> {
        const allReviews = this.getAllReviews();
        const locationMap = new Map<string, {count: number, hasSpecific: boolean}>();

        allReviews.forEach(review => {
            const current = locationMap.get(review.location) || {count: 0, hasSpecific: false};
            current.count++;
            if (review.specificLocation) {
                current.hasSpecific = true;
            }
            locationMap.set(review.location, current);
        });

        return Array.from(locationMap.entries()).map(([name, data]) => ({
            name,
            count: data.count,
            hasSpecific: data.hasSpecific
        }));
    }
}

export default ReviewsContainer;