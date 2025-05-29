// src/Pages/RestaurantProfile/RestaurantProfile.ts - VERSIÓN CORREGIDA SIN ERRORES

interface RestaurantInfo {
    id: string;
    name: string;
    timestamp: number;
    source: string;
}

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

class RestaurantProfile extends HTMLElement {
    private currentRestaurant: RestaurantData | null = null;
    private defaultRestaurants: { [key: string]: RestaurantData } = {};

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.initializeDefaultRestaurants();
    }

    private initializeDefaultRestaurants(): void {
        // Datos por defecto de los restaurantes
        this.defaultRestaurants = {
            'barburguer': {
                id: 'barburguer',
                name: 'BarBurguer',
                description: 'El mejor lugar para disfrutar hamburguesas artesanales y cocteles únicos. Ambiente relajado con música en vivo los fines de semana.',
                image: 'https://marketplace.canva.com/EAFpeiTrl4c/2/0/1600w/canva-abstract-chef-cooking-restaurant-free-logo-a1RYzvS1EFo.jpg',
                location: 'Centro de Cali',
                rating: 4.5,
                reviews: [
                    {
                        username: 'CrisTiJauregui',
                        text: 'El coctel de hierva buena está super delicioso para los amantes como yo de los sabores frescos, costo 20.000 y lo recomiendo 100%',
                        stars: 5
                    },
                    {
                        username: 'FoodLover',
                        text: 'Las hamburguesas son increíbles, la carne está en su punto perfecto y las papas crujientes.',
                        stars: 4
                    }
                ]
            },
            'frenchrico': {
                id: 'frenchrico',
                name: 'Frenchrico',
                description: 'Auténtica cocina italiana con ingredientes importados directamente de Italia. Pasta fresca hecha a mano todos los días.',
                image: 'https://img.pikbest.com/png-images/20241030/culinary-restaurant-logo-design_11027332.png!sw800',
                location: 'Norte de Cali',
                rating: 4.8,
                reviews: [
                    {
                        username: 'FoodLover',
                        text: 'La pasta en @Frenchrico es increíble! Los mejores sabores italianos que he probado en mucho tiempo.',
                        stars: 4
                    },
                    {
                        username: 'ItalianFan',
                        text: 'Se nota que los ingredientes son auténticos, la salsa boloñesa está espectacular.',
                        stars: 5
                    }
                ]
            },
            'nomames': {
                id: 'nomames',
                name: 'NoMames!',
                description: 'Cocina mexicana auténtica con un toque moderno. Los mejores tacos, burritos y margaritas de la ciudad.',
                image: 'https://justcreative.com/wp-content/uploads/2023/02/Restaurant-Logo-Templates.png.webp',
                location: 'Sur de Cali',
                rating: 4.3,
                reviews: [
                    {
                        username: 'TacoLover',
                        text: 'Los tacos al pastor están buenísimos, la salsa picante tiene el nivel perfecto de picor.',
                        stars: 4
                    },
                    {
                        username: 'MexicanFood',
                        text: 'Las margaritas están deliciosas, el ambiente es muy divertido para ir con amigos.',
                        stars: 5
                    }
                ]
            },
            'lacocina': {
                id: 'lacocina',
                name: 'LaCocina',
                description: 'Restaurante familiar con comida casera tradicional colombiana. Especialistas en sancocho, bandeja paisa y postres típicos.',
                image: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/chef-logo%2Ccooking-logo%2Crestaurant-logo-design-template-8048c6b88c3702da6e0804bc38ce7f33_screen.jpg?ts=1672750337',
                location: 'Oeste de Cali',
                rating: 4.6,
                reviews: [
                    {
                        username: 'ColombianTaste',
                        text: 'La bandeja paisa está espectacular, se nota el sazón casero en cada bocado.',
                        stars: 5
                    },
                    {
                        username: 'FamilyFood',
                        text: 'Perfecto para ir en familia, las porciones son generosas y los precios justos.',
                        stars: 4
                    }
                ]
            }
        };
    }

    connectedCallback() {
        console.log('🏪 RestaurantProfile: Conectado al DOM');
        this.loadRestaurantInfo();
        this.render();
        this.setupEventListeners();
        
        // Configurar el resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize();
    }

    disconnectedCallback() {
        console.log('🏪 RestaurantProfile: Desconectado del DOM');
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    private loadRestaurantInfo(): void {
        console.log('📄 RestaurantProfile: Cargando información del restaurante...');
        
        try {
            // Intentar obtener información del restaurante desde sessionStorage
            const storedInfo = sessionStorage.getItem('selectedRestaurant');
            
            if (storedInfo) {
                const restaurantInfo: RestaurantInfo = JSON.parse(storedInfo);
                console.log('✅ Información encontrada en sessionStorage:', restaurantInfo);
                
                // Verificar que la información no sea muy antigua (5 minutos)
                const age = Date.now() - restaurantInfo.timestamp;
                if (age < 5 * 60 * 1000) {
                    // Cargar datos del restaurante
                    this.currentRestaurant = this.defaultRestaurants[restaurantInfo.id] || null;
                    
                    if (this.currentRestaurant) {
                        console.log('🏪 Restaurante cargado:', this.currentRestaurant.name);
                    } else {
                        console.warn('⚠️ No se encontraron datos para el restaurante:', restaurantInfo.id);
                        this.currentRestaurant = this.createFallbackRestaurant(restaurantInfo);
                    }
                } else {
                    console.warn('⚠️ Información del restaurante muy antigua, usando datos por defecto');
                    this.currentRestaurant = this.getDefaultRestaurant();
                }
            } else {
                console.log('📋 No hay información específica, usando restaurante por defecto');
                this.currentRestaurant = this.getDefaultRestaurant();
            }
        } catch (error) {
            console.error('❌ Error cargando información del restaurante:', error);
            this.currentRestaurant = this.getDefaultRestaurant();
        }
    }

    private createFallbackRestaurant(info: RestaurantInfo): RestaurantData {
        return {
            id: info.id,
            name: info.name,
            description: 'Restaurante seleccionado desde sugerencias. ¡Próximamente más información!',
            image: 'https://via.placeholder.com/400x300/AAAB54/FFFFFF?text=' + encodeURIComponent(info.name),
            location: 'Cali, Colombia',
            rating: 4.0,
            reviews: [
                {
                    username: 'Usuario',
                    text: 'Restaurante recomendado. ¡Próximamente más reseñas!',
                    stars: 4
                }
            ]
        };
    }

    private getDefaultRestaurant(): RestaurantData {
        // Retornar BarBurguer como restaurante por defecto
        return this.defaultRestaurants['barburguer'];
    }

    render() {
        if (!this.shadowRoot || !this.currentRestaurant) {
            console.error('❌ RestaurantProfile: No se puede renderizar sin shadowRoot o restaurante');
            return;
        }

        console.log('🎨 RestaurantProfile: Renderizando perfil de:', this.currentRestaurant.name);

        this.shadowRoot.innerHTML = /*html */ `
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
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }
                
                .logo-container {
                    width: 300px;
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
                    display: flex;
                    flex-direction: column;
                    padding: 20px;
                    background-color: #f8f9fa;
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

                .restaurant-details {
                    flex: 1;
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
                    display: flex;
                    align-items: center;
                    gap: 8px;
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

                .review-item:last-child {
                    border-bottom: none;
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
                    padding: 10px 0;
                    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                }

                .back-button {
                    background: #AAAB54;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-size: 1rem;
                    cursor: pointer;
                    margin-bottom: 20px;
                    transition: background-color 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .back-button:hover {
                    background: #999A4A;
                }

                /* Responsive styles */
                @media (max-width: 900px) {
                    .header-wrapper {
                        display: none;
                    }
                    
                    .sidebar {
                        display: none;
                    }
                    
                    .suggestions-section {
                        display: none;
                    }
                    
                    .responsive-bar {
                        display: block;
                    }
                    
                    .content {
                        padding: 15px;
                        padding-bottom: 80px;
                    }

                    .restaurant-header {
                        flex-direction: column;
                        text-align: center;
                        gap: 20px;
                    }

                    .restaurant-image {
                        width: 150px;
                        height: 150px;
                        align-self: center;
                    }

                    .restaurant-name {
                        font-size: 2rem;
                    }

                    .restaurant-info-section,
                    .reviews-section {
                        padding: 20px;
                        margin-bottom: 15px;
                    }
                }

                @media (max-width: 600px) {
                    .content {
                        padding: 10px;
                    }

                    .restaurant-name {
                        font-size: 1.8rem;
                    }

                    .restaurant-info-section,
                    .reviews-section {
                        padding: 15px;
                    }
                }
            </style>
            
            <!-- Header responsive (visible en mobile) -->
            <lulada-responsive-header style="display: none;"></lulada-responsive-header>
            
            <!-- Header normal (visible en desktop) -->
            <div class="header-wrapper">
                <div class="logo-container">
                    <lulada-logo></lulada-logo>
                </div>
            </div>

            <div class="main-layout">
                <div class="sidebar">
                    <lulada-sidebar></lulada-sidebar>
                </div>
                
                <div class="content">
                    <button class="back-button" id="back-btn">
                        ← Volver
                    </button>

                    <div class="restaurant-info-section">
                        <div class="restaurant-header">
                            <img src="${this.currentRestaurant.image}" alt="${this.currentRestaurant.name}" class="restaurant-image">
                            <div class="restaurant-details">
                                <h1 class="restaurant-name">${this.currentRestaurant.name}</h1>
                                <div class="restaurant-location">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    ${this.currentRestaurant.location}
                                </div>
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
            
            <!-- Barra responsive para móviles -->
            <div class="responsive-bar">
                <lulada-responsive-bar></lulada-responsive-bar>
            </div>
        `;

        console.log('✅ RestaurantProfile: Renderizado completado');
    }

    private generateStars(rating: number): string {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + 
               (hasHalfStar ? '☆' : '') + 
               '☆'.repeat(emptyStars);
    }

    private generateReviewsHTML(): string {
        if (!this.currentRestaurant || !this.currentRestaurant.reviews.length) {
            return '<p style="color: #666; font-style: italic;">No hay reseñas disponibles aún.</p>';
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

    setupEventListeners() {
        if (!this.shadowRoot) return;

        // Configurar botón de volver
        const backButton = this.shadowRoot.querySelector('#back-btn');
        if (backButton) {
            backButton.addEventListener('click', () => {
                console.log('🔙 RestaurantProfile: Navegando de vuelta');
                
                // Limpiar información del restaurante
                try {
                    sessionStorage.removeItem('selectedRestaurant');
                } catch (error) {
                    console.warn('⚠️ Error limpiando sessionStorage:', error);
                }
                
                // Navegar de vuelta al home
                const navigationEvent = new CustomEvent('navigate', {
                    detail: '/home',
                    bubbles: true,
                    composed: true
                });
                
                document.dispatchEvent(navigationEvent);
            });
        }

        // Escuchar eventos de navegación
        this.shadowRoot.addEventListener('navigate', (event: Event) => {
            const customEvent = event as CustomEvent;
            document.dispatchEvent(new CustomEvent('navigate', {
                detail: customEvent.detail
            }));
        });

        console.log('✅ RestaurantProfile: Event listeners configurados');
    }

    handleResize() {
        const sidebar = this.shadowRoot?.querySelector('.sidebar') as HTMLElement;
        const suggestions = this.shadowRoot?.querySelector('.suggestions-section') as HTMLElement;
        const responsiveBar = this.shadowRoot?.querySelector('.responsive-bar') as HTMLElement;
        const headerWrapper = this.shadowRoot?.querySelector('.header-wrapper') as HTMLElement;
        const responsiveHeader = this.shadowRoot?.querySelector('lulada-responsive-header') as HTMLElement;

        if (sidebar && suggestions && responsiveBar && headerWrapper && responsiveHeader) {
            if (window.innerWidth < 900) {
                sidebar.style.display = 'none';
                suggestions.style.display = 'none';
                responsiveBar.style.display = 'block';
                headerWrapper.style.display = 'none';
                responsiveHeader.style.display = 'block';
            } else {
                sidebar.style.display = 'block';
                suggestions.style.display = 'block';
                responsiveBar.style.display = 'none';
                headerWrapper.style.display = 'block';
                responsiveHeader.style.display = 'none';
            }
        }
    }

    // Método público para actualizar restaurante (útil para testing)
    public updateRestaurant(restaurantId: string): void {
        const restaurantData = this.defaultRestaurants[restaurantId];
        if (restaurantData) {
            this.currentRestaurant = restaurantData;
            this.render();
            console.log(`✅ RestaurantProfile: Actualizado a ${restaurantData.name}`);
        } else {
            console.warn(`⚠️ RestaurantProfile: No se encontró restaurante con ID: ${restaurantId}`);
        }
    }

    // Método público para debugging
    public debugInfo(): void {
        console.log('🔍 RestaurantProfile Debug:');
        console.log('- Restaurante actual:', this.currentRestaurant?.name || 'ninguno');
        console.log('- ID del restaurante:', this.currentRestaurant?.id || 'ninguno');
        console.log('- Shadow DOM:', !!this.shadowRoot);
        console.log('- Restaurantes disponibles:', Object.keys(this.defaultRestaurants));
        
        // Verificar sessionStorage
        try {
            const storedInfo = sessionStorage.getItem('selectedRestaurant');
            if (storedInfo) {
                const parsed = JSON.parse(storedInfo);
                console.log('- Info en sessionStorage:', parsed);
                console.log('- Edad de la info:', Date.now() - parsed.timestamp, 'ms');
            } else {
                console.log('- No hay info en sessionStorage');
            }
        } catch (error) {
            console.log('- Error leyendo sessionStorage:', error);
        }
    }

    // Método público para obtener lista de restaurantes disponibles
    public getAvailableRestaurants(): string[] {
        return Object.keys(this.defaultRestaurants);
    }

    // Método público para obtener información del restaurante actual
    public getCurrentRestaurant(): RestaurantData | null {
        return this.currentRestaurant;
    }
}

export default RestaurantProfile;