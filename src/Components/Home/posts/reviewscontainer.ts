// src/Components/Home/posts/reviewscontainer.ts

import './publications';
import './reviews';
import PublicationsService, { Publication } from '../../../Services/PublicationsService';

export class ReviewsContainer extends HTMLElement {
    // Reviews estáticas
    staticReviews: Publication[] = [
        {
            username: "CrisTiJauregui",
            text: "El coctel de hierva buena en @BarBurguer esta super delicioso para los amantes como yo de los sabores frescos, costo 20.000 y lo recomiendo 100%",
            stars: 5,
            restaurant: "BarBurguer",
            location: "centro",
            timestamp: Date.now() - 86400000
        },
        {
            username: "DanaBanana",
            text: "Este @AsianRooftop es terrible! No le quito todas las estrellas porque la mesera era super atenta, el problema es que la cocina, terrible, pedi una margarita y era sin licor me dijeron que venia aparte, como es posible???? De nunca volver.",
            stars: 1,
            hasImage: true,
            restaurant: "AsianRooftop",
            location: "norte",
            timestamp: Date.now() - 172800000
        },
        {
            username: "FoodLover",
            text: "La pasta en @Frenchrico es increíble! Los mejores sabores italianos que he probado en mucho tiempo.",
            stars: 4,
            restaurant: "Frenchrico",
            location: "sur",
            timestamp: Date.now() - 259200000
        },
        {
            username: "GourmetCali",
            text: "El sushi en @SushiLab es exquisito, especialmente el rollo Dragon. Altamente recomendado para los amantes del sushi.",
            stars: 5,
            restaurant: "SushiLab",
            location: "oeste",
            timestamp: Date.now() - 345600000
        },
        {
            username: "CafeAddict",
            text: "El brunch en @MoraCafé me pareció muy completo. Café refill, huevos al gusto y pan artesanal por 35.000. Súper plan de domingo.",
            stars: 4,
            restaurant: "MoraCafé",
            location: "centro",
            timestamp: Date.now() - 432000000
        }
    ];

    locationFilter: string | null = null;
    publicationsService: PublicationsService;

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
        const allReviews = this.getAllReviews();
        
        // Si no hay filtro o es 'cali', mostrar todos
        if (!this.locationFilter || this.locationFilter === 'cali') {
            console.log('📊 Mostrando todas las reseñas:', allReviews.length);
            return allReviews;
        }
        
        // Filtrar por ubicación específica
        const filtered = allReviews.filter(review => review.location === this.locationFilter);
        console.log(`📊 Reseñas filtradas para ${this.locationFilter}:`, filtered.length);
        return filtered;
    }

    render() {
        if (!this.shadowRoot) return;

        const filteredReviews = this.getFilteredReviews();
        let reviewsHTML = '';
            
        filteredReviews.forEach(review => {
            const isNew = review.timestamp && (Date.now() - review.timestamp) < 10000; // Marcar como nuevo si es de los últimos 10 segundos
            
            reviewsHTML += `
                <lulada-publication 
                    username="${review.username}" 
                    text="${review.text}" 
                    stars="${review.stars}"
                    ${review.hasImage ? 'has-image="true"' : ''}
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
                    padding: 10px;
                    margin-bottom: 20px;
                    background-color: rgba(170, 171, 84, 0.1);
                    border-radius: 10px;
                    color: #666;
                    font-size: 14px;
                }

                .no-reviews {
                    text-align: center;
                    padding: 40px 24px;
                    color: #666;
                    font-style: italic;
                    background-color: white;
                    border-radius: 20px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    font-size: 16px;
                    line-height: 1.5;
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
                        padding: 8px;
                    }
                    
                    .no-reviews {
                        padding: 30px 20px;
                        font-size: 15px;
                    }
                }
            </style>
            
            ${this.locationFilter ? `
                <div class="filter-info">
                    Mostrando reseñas de: <strong>${this.locationFilter.charAt(0).toUpperCase() + this.locationFilter.slice(1)}</strong>
                </div>
            ` : ''}
            
            ${filteredReviews.length > 0 ? 
                reviewsHTML : 
                `<div class="no-reviews">
                    ${this.locationFilter ? 
                        `No hay reseñas para <strong>${this.locationFilter}</strong>.<br>¡Sé el primero en compartir tu experiencia en esta zona!` :
                        'No hay reseñas disponibles.<br>¡Sé el primero en compartir tu experiencia!'
                    }
                </div>`
            }
        `;

        console.log(`✅ Renderizadas ${filteredReviews.length} reseñas para ubicación: ${this.locationFilter || 'todas'}`);
    }

    // Método público para obtener estadísticas
    getLocationStats() {
        const allReviews = this.getAllReviews();
        const stats: { [key: string]: number } = {
            centro: 0,
            norte: 0,
            sur: 0,
            oeste: 0
        };

        allReviews.forEach(review => {
            if (Object.prototype.hasOwnProperty.call(stats, review.location)) {
                stats[review.location]++;
            }
        });

        return stats;
    }
}

export default ReviewsContainer;