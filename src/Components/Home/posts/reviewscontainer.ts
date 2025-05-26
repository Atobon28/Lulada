import './publications';
import './reviews';
import PublicationsService, { Publication } from '../../../Services/PublicationsService';

export class ReviewsContainer extends HTMLElement {
    // Reviews estáticas (las originales)
    staticReviews: Publication[] = [
        {
            username: "CrisTiJauregui",
            text: "El coctel de hierva buena en @BarBurguer esta super delicioso para los amantes como yo de los sabores frescos, costo 20.000 y lo recomiendo 100%",
            stars: 5,
            restaurant: "BarBurguer",
            location: "centro",
            timestamp: Date.now() - 86400000 // 1 día atrás
        },
        {
            username: "DanaBanana",
            text: "Este @AsianRooftop es terrible! No le quito todas las estrellas porque la mesera era super atenta, el problema es que la cocina, terrible, pedi una margarita y era sin licor me dijeron que venia aparte, como es posible???? De nunca volver.",
            stars: 1,
            hasImage: true,
            restaurant: "AsianRooftop",
            location: "norte",
            timestamp: Date.now() - 172800000 // 2 días atrás
        },
        {
            username: "FoodLover",
            text: "La pasta en @Frenchrico es increíble! Los mejores sabores italianos que he probado en mucho tiempo.",
            stars: 4,
            restaurant: "Frenchrico",
            location: "sur",
            timestamp: Date.now() - 259200000 // 3 días atrás
        },
        {
            username: "GourmetCali",
            text: "El sushi en @SushiLab es exquisito, especialmente el rollo Dragon. Altamente recomendado para los amantes del sushi.",
            stars: 5,
            restaurant: "SushiLab",
            location: "oeste",
            timestamp: Date.now() - 345600000 // 4 días atrás
        }
    ];

    locationFilter: string | null = null;
    publicationsService: PublicationsService;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.publicationsService = PublicationsService.getInstance();
        this.render();
        this.setupEventListeners();
    }

    static get observedAttributes() {
        return ['location-filter'];
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (name === 'location-filter' && oldValue !== newValue) {
            this.locationFilter = newValue;
            this.render();
        }
    }

    setupEventListeners() {
        // Escuchar eventos de cambio de ubicación del header
        document.addEventListener('location-filter-changed', (e: Event) => {
            const event = e as CustomEvent;
            this.updateLocationFilter(event.detail);
        });

        // Escuchar eventos de cambio de ubicación (compatibilidad)
        document.addEventListener('location-changed', (e: Event) => {
            const event = e as CustomEvent;
            this.updateLocationFilter(event.detail);
        });

        // Escuchar nuevas publicaciones
        document.addEventListener('nueva-publicacion', () => {
            console.log('Nueva publicación detectada, actualizando reviews...');
            this.render();
        });

        // También escuchar el evento del header
        this.addEventListener('location-select', (e: Event) => {
            const event = e as CustomEvent;
            this.updateLocationFilter(event.detail);
        });
    }

    updateLocationFilter(location: string) {
        console.log('📍 Actualizando filtro de ubicación a:', location);
        
        // Si es 'cali', mostrar todos
        this.locationFilter = location === 'cali' ? null : location;
        this.render();
        
        console.log('📊 Filtro aplicado:', this.locationFilter || 'todos');
    }

    getAllReviews(): Publication[] {
        // Obtener publicaciones del servicio
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
            return allReviews;
        }
        
        // Filtrar por ubicación específica
        return allReviews.filter(review => review.location === this.locationFilter);
    }

    render() {
        if (!this.shadowRoot) return;

        const filteredReviews = this.getFilteredReviews();
        let reviewsHTML = '';
            
        filteredReviews.forEach(review => {
            const isNew = review.timestamp && (Date.now() - review.timestamp) < 5000; // Marcar como nuevo si es de los últimos 5 segundos
            
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

                .no-reviews {
                    text-align: center;
                    padding: 24px;
                    color: black;
                    font-style: italic;
                    background-color: white;
                    border-radius: 20px;
                    box-shadow: 0 30px 30px rgba(0, 0, 0, 0.1);
                    font-size: 16px;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .new-publication {
                    border: 2px solid #4CAF50 !important;
                    animation: fadeIn 0.5s ease-in;
                }
            </style>
            

            
            ${filteredReviews.length > 0 ? 
                reviewsHTML : 
                '<div class="no-reviews">No hay reseñas para esta ubicación. ¡Sé el primero en compartir tu experiencia!</div>'
            }
        `;

        console.log(`Renderizadas ${filteredReviews.length} reseñas para ubicación: ${this.locationFilter || 'todas'}`);
    }
}

export default ReviewsContainer;