// Estructura de datos del restaurante
interface RestaurantData {
    id: string;
    name: string;
    description: string;
    image: string;
    location: string;
    rating: number;
    reviews: Array<{
        username: string;
        text: string;
        stars: number;
    }>;
}

// Clase principal del perfil de restaurante
class RestaurantProfile extends HTMLElement {
    private currentRestaurant: RestaurantData | null = null;
    private defaultRestaurants: { [key: string]: RestaurantData } = {};

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.initializeDefaultRestaurants();
    }

    // Inicializa los restaurantes por defecto
    private initializeDefaultRestaurants(): void {
        this.defaultRestaurants = {
            'barburguer': {
                id: 'barburguer',
                name: 'BarBurguer',
                description: 'El mejor lugar para disfrutar hamburguesas artesanales y cocteles únicos.',
                image: 'https://marketplace.canva.com/EAFpeiTrl4c/2/0/1600w/canva-abstract-chef-cooking-restaurant-free-logo-a1RYzvS1EFo.jpg',
                location: 'Centro de Cali',
                rating: 4.5,
                reviews: [
                    {
                        username: 'CrisTiJauregui',
                        text: 'El coctel de hierva buena está super delicioso, costo 20.000 y lo recomiendo 100%',
                        stars: 5
                    }
                ]
            },
            'frenchrico': {
                id: 'frenchrico',
                name: 'Frenchrico',
                description: 'Auténtica cocina italiana con ingredientes importados directamente de Italia.',
                image: 'https://img.pikbest.com/png-images/20241030/culinary-restaurant-logo-design_11027332.png!sw800',
                location: 'Norte de Cali',
                rating: 4.8,
                reviews: [
                    {
                        username: 'FoodLover',
                        text: 'La pasta está increíble! Los mejores sabores italianos.',
                        stars: 4
                    }
                ]
            }
        };
    }

    connectedCallback() {
        this.loadRestaurantInfo();
        this.render();
        this.setupEventListeners();
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize();
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    // Carga la información del restaurante desde sessionStorage o usa default
    private loadRestaurantInfo(): void {
        try {
            const storedInfo = sessionStorage.getItem('selectedRestaurant');
            if (storedInfo) {
                const restaurantInfo = JSON.parse(storedInfo);
                this.currentRestaurant = this.defaultRestaurants[restaurantInfo.id] || this.getDefaultRestaurant();
            } else {
                this.currentRestaurant = this.getDefaultRestaurant();
            }
        } catch (error) {
    console.warn('Error al cargar información del restaurante desde sessionStorage:', error);
    this.currentRestaurant = this.getDefaultRestaurant();
}

    }

    // Retorna el restaurante por defecto
    private getDefaultRestaurant(): RestaurantData {
        return this.defaultRestaurants['barburguer'];
    }

    // Renderiza la página completa
    render() {
        if (!this.shadowRoot || !this.currentRestaurant) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: 'inter', sans-serif;
                    background-color: #f8f9fa;
                    min-height: 100vh;
                }
                
                .header-wrapper {
                    width: 100%;
                    background-color: white;
                    padding: 20px 0 10px 20px;
                    border-bottom: 1px solid #eaeaea;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                
                .main-layout {
                    display: flex;
                    margin-top: 10px;
                    min-height: calc(100vh - 100px);
                }
                
                .sidebar {
                    width: 250px;
                    background-color: white;
                    border-right: 1px solid #e0e0e0;
                }

                .content {
                    flex-grow: 1;
                    padding: 20px;
                }
                
                .restaurant-info-section {
                    background-color: white;
                    border-radius: 15px;
                    padding: 30px;
                    margin-bottom: 20px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .restaurant-header {
                    display: flex;
                    gap: 30px;
                    align-items: flex-start;
                    margin-bottom: 25px;
                }

                .restaurant-image {
                    width: 200px;
                    height: 200px;
                    border-radius: 15px;
                    object-fit: cover;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }

                .restaurant-name {
                    font-size: 2.5rem;
                    font-weight: bold;
                    color: #AAAB54;
                    margin-bottom: 10px;
                }

                .restaurant-location {
                    font-size: 1.2rem;
                    color: #666;
                    margin-bottom: 15px;
                }

                .restaurant-rating {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 20px;
                }

                .stars {
                    color: #FFD700;
                    font-size: 1.5rem;
                }

                .rating-text {
                    font-size: 1.1rem;
                    color: #333;
                    font-weight: 600;
                }

                .restaurant-description {
                    font-size: 1.1rem;
                    line-height: 1.6;
                    color: #444;
                }

                .reviews-section {
                    background-color: white;
                    border-radius: 15px;
                    padding: 30px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .reviews-title {
                    font-size: 1.8rem;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 20px;
                }

                .review-item {
                    border-bottom: 1px solid #eee;
                    padding: 20px 0;
                }

                .review-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }

                .review-username {
                    font-weight: bold;
                    color: #AAAB54;
                    font-size: 1.1rem;
                }

                .review-stars {
                    color: #FFD700;
                    font-size: 1.2rem;
                }

                .review-text {
                    font-size: 1rem;
                    line-height: 1.5;
                    color: #555;
                }

                .suggestions-section {
                    width: 250px;
                    padding: 20px 10px;
                    background-color: white;
                    border-left: 1px solid #e0e0e0;
                }
                
                .responsive-bar {
                    display: none;
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background-color: white;
                    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                }

                .back-button {
                    background: #AAAB54;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    margin-bottom: 20px;
                }

                /* Responsive para móviles */
                @media (max-width: 900px) {
                    .header-wrapper { display: none; }
                    .sidebar { display: none; }
                    .suggestions-section { display: none; }
                    .responsive-bar { display: block; }
                    .content { padding: 15px; padding-bottom: 80px; }
                    .restaurant-header { flex-direction: column; text-align: center; }
                    .restaurant-image { width: 150px; height: 150px; }
                    .restaurant-name { font-size: 2rem; }
                }
            </style>
            
            <lulada-responsive-header style="display: none;"></lulada-responsive-header>
            
            <div class="header-wrapper">
                <lulada-logo></lulada-logo>
            </div>

            <div class="main-layout">
                <div class="sidebar">
                    <lulada-sidebar></lulada-sidebar>
                </div>
                
                <div class="content">
                    <button class="back-button" id="back-btn">← Volver</button>

                    <div class="restaurant-info-section">
                        <div class="restaurant-header">
                            <img src="${this.currentRestaurant.image}" alt="${this.currentRestaurant.name}" class="restaurant-image">
                            <div>
                                <h1 class="restaurant-name">${this.currentRestaurant.name}</h1>
                                <div class="restaurant-location">${this.currentRestaurant.location}</div>
                                <div class="restaurant-rating">
                                    <div class="stars">${this.generateStars(this.currentRestaurant.rating)}</div>
                                    <span class="rating-text">${this.currentRestaurant.rating}/5</span>
                                </div>
                                <p class="restaurant-description">${this.currentRestaurant.description}</p>
                            </div>
                        </div>
                    </div>

                    <div class="reviews-section">
                        <h2 class="reviews-title">Reseñas (${this.currentRestaurant.reviews.length})</h2>
                        ${this.generateReviewsHTML()}
                    </div>
                </div>
                
                <div class="suggestions-section">
                    <lulada-suggestions></lulada-suggestions>
                </div>
            </div>
            
            <div class="responsive-bar">
                <lulada-responsive-bar></lulada-responsive-bar>
            </div>
        `;
    }

    // Convierte calificación numérica a estrellas
    private generateStars(rating: number): string {
        const fullStars = Math.floor(rating);
        const emptyStars = 5 - fullStars;
        return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
    }

    // Genera HTML de las reseñas
    private generateReviewsHTML(): string {
        if (!this.currentRestaurant || !this.currentRestaurant.reviews.length) {
            return '<p style="color: #666;">No hay reseñas disponibles.</p>';
        }

        return this.currentRestaurant.reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-username">@${review.username}</span>
                    <span class="review-stars">${'★'.repeat(review.stars)}${'☆'.repeat(5 - review.stars)}</span>
                </div>
                <p class="review-text">${review.text}</p>
            </div>
        `).join('');
    }

    // Configura eventos de navegación
    setupEventListeners() {
        if (!this.shadowRoot) return;

        const backButton = this.shadowRoot.querySelector('#back-btn');
        if (backButton) {
            backButton.addEventListener('click', () => {
                sessionStorage.removeItem('selectedRestaurant');
                document.dispatchEvent(new CustomEvent('navigate', {
                    detail: '/home',
                    bubbles: true,
                    composed: true
                }));
            });
        }
    }

    // Maneja el diseño responsive
    handleResize() {
        const sidebar = this.shadowRoot?.querySelector('.sidebar') as HTMLElement;
        const suggestions = this.shadowRoot?.querySelector('.suggestions-section') as HTMLElement;
        const responsiveBar = this.shadowRoot?.querySelector('.responsive-bar') as HTMLElement;
        const headerWrapper = this.shadowRoot?.querySelector('.header-wrapper') as HTMLElement;
        const responsiveHeader = this.shadowRoot?.querySelector('lulada-responsive-header') as HTMLElement;

        if (sidebar && suggestions && responsiveBar && headerWrapper && responsiveHeader) {
            if (window.innerWidth < 900) {
                // Modo móvil
                sidebar.style.display = 'none';
                suggestions.style.display = 'none';
                responsiveBar.style.display = 'block';
                headerWrapper.style.display = 'none';
                responsiveHeader.style.display = 'block';
            } else {
                // Modo desktop
                sidebar.style.display = 'block';
                suggestions.style.display = 'block';
                responsiveBar.style.display = 'none';
                headerWrapper.style.display = 'block';
                responsiveHeader.style.display = 'none';
            }
        }
    }
}

export default RestaurantProfile;