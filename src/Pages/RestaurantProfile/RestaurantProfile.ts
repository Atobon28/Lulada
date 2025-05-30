// Definimos la estructura de datos para la información básica de un restaurante
interface RestaurantInfo {
    id: string;        // Identificador único del restaurante
    name: string;      // Nombre del restaurante
    timestamp: number; // Momento en que se guardó la información
    source: string;    // De dónde viene la información (ej: "suggestions")
}

// Definimos la estructura completa de datos de un restaurante
interface RestaurantData {
    id: string;          // Identificador único
    name: string;        // Nombre del restaurante
    description: string; // Descripción detallada
    image: string;       // URL de la imagen del logo/foto
    location: string;    // Ubicación física
    rating: number;      // Calificación promedio (1-5)
    reviews: Array<{     // Lista de reseñas
        username: string;
        text: string;
        stars: number;
    }>;
}

// Clase principal que maneja la página de perfil de restaurante
class RestaurantProfile extends HTMLElement {
    // Variable que guarda la información del restaurante que se está mostrando
    private currentRestaurant: RestaurantData | null = null;
    
    // Base de datos local con información de restaurantes predefinidos
    private defaultRestaurants: { [key: string]: RestaurantData } = {};

    constructor() {
        super(); // Llamamos al constructor de HTMLElement
        
        // Creamos el Shadow DOM para aislar nuestros estilos
        this.attachShadow({ mode: 'open' });
        
        // Llenamos la base de datos con restaurantes por defecto
        this.initializeDefaultRestaurants();
    }

    // Función que llena la base de datos con restaurantes de ejemplo
    private initializeDefaultRestaurants(): void {
        // Datos por defecto de los restaurantes
        this.defaultRestaurants = {
            // Restaurante BarBurguer
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
            // Restaurante Frenchrico
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
            // Restaurante NoMames!
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
            // Restaurante LaCocina
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

    // Se ejecuta cuando el componente se añade a la página
    connectedCallback() {
        console.log(' RestaurantProfile: Conectado al DOM');
        
        // Cargar la información del restaurante que se va a mostrar
        this.loadRestaurantInfo();
        
        // Dibujar la página en pantalla
        this.render();
        
        // Configurar los eventos (clicks, etc.)
        this.setupEventListeners();
        
        // Configurar el responsive design (adaptación a móvil/desktop)
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize();
    }

    // Se ejecuta cuando el componente se quita de la página
    disconnectedCallback() {
        console.log(' RestaurantProfile: Desconectado del DOM');
        
        // Limpiar el event listener del resize para evitar problemas de memoria
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    // Función que carga la información del restaurante que se va a mostrar
    private loadRestaurantInfo(): void {
        console.log(' RestaurantProfile: Cargando información del restaurante...');
        
        try {
            // Intentar obtener información del restaurante desde sessionStorage
            // (sessionStorage es como una memoria temporal del navegador)
            const storedInfo = sessionStorage.getItem('selectedRestaurant');
            
            if (storedInfo) {
                // Si encontramos información guardada, la convertimos de texto a objeto
                const restaurantInfo: RestaurantInfo = JSON.parse(storedInfo);
                console.log(' Información encontrada en sessionStorage:', restaurantInfo);
                
                // Verificar que la información no sea muy antigua (5 minutos)
                const age = Date.now() - restaurantInfo.timestamp;
                if (age < 5 * 60 * 1000) {
                    // Cargar datos del restaurante desde nuestra base de datos local
                    this.currentRestaurant = this.defaultRestaurants[restaurantInfo.id] || null;
                    
                    if (this.currentRestaurant) {
                        console.log(' Restaurante cargado:', this.currentRestaurant.name);
                    } else {
                        console.warn(' No se encontraron datos para el restaurante:', restaurantInfo.id);
                        // Si no tenemos datos, crear información básica
                        this.currentRestaurant = this.createFallbackRestaurant(restaurantInfo);
                    }
                } else {
                    console.warn(' Información del restaurante muy antigua, usando datos por defecto');
                    // Si la información es muy vieja, usar restaurante por defecto
                    this.currentRestaurant = this.getDefaultRestaurant();
                }
            } else {
                console.log(' No hay información específica, usando restaurante por defecto');
                // Si no hay información guardada, mostrar restaurante por defecto
                this.currentRestaurant = this.getDefaultRestaurant();
            }
        } catch (error) {
            console.error(' Error cargando información del restaurante:', error);
            // Si hay algún error, usar restaurante por defecto
            this.currentRestaurant = this.getDefaultRestaurant();
        }
    }

    // Crear información básica para un restaurante cuando no tenemos datos completos
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

    // Obtener el restaurante que se muestra por defecto (BarBurguer)
    private getDefaultRestaurant(): RestaurantData {
        // Retornar BarBurguer como restaurante por defecto
        return this.defaultRestaurants['barburguer'];
    }

    // Función principal que dibuja toda la página en pantalla
    render() {
        // Verificar que tenemos shadowRoot y información del restaurante
        if (!this.shadowRoot || !this.currentRestaurant) {
            console.error(' RestaurantProfile: No se puede renderizar sin shadowRoot o restaurante');
            return;
        }

        console.log(' RestaurantProfile: Renderizando perfil de:', this.currentRestaurant.name);

        // Insertar todo el HTML y CSS de la página
        this.shadowRoot.innerHTML = /*html */ `
            <style>
                /* === ESTILOS CSS PARA LA PÁGINA === */
                
                :host {
                    display: block;
                    font-family: 'inter', sans-serif;
                    background-color: #f8f9fa;
                    min-height: 100vh;
                }
                
                /* Header superior con logo */
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
                
                /* Layout principal: sidebar + contenido + sugerencias */
                .main-layout {
                    display: flex;
                    margin-top: 10px;
                    min-height: calc(100vh - 100px);
                }
                
                /* Barra lateral izquierda */
                .sidebar {
                    width: 250px;
                    background-color: white;
                    border-right: 1px solid #e0e0e0;
                }

                /* Contenido principal */
                .content {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    padding: 20px;
                    background-color: #f8f9fa;
                }
                
                /* Sección con información del restaurante */
                .restaurant-info-section {
                    background-color: white;
                    border-radius: 15px;
                    padding: 30px;
                    margin-bottom: 20px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                /* Header del restaurante (imagen + detalles) */
                .restaurant-header {
                    display: flex;
                    gap: 30px;
                    align-items: flex-start;
                    margin-bottom: 25px;
                }

                /* Imagen del restaurante */
                .restaurant-image {
                    width: 200px;
                    height: 200px;
                    border-radius: 15px;
                    object-fit: cover;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }

                /* Contenedor de los detalles del restaurante */
                .restaurant-details {
                    flex: 1;
                }

                /* Nombre del restaurante */
                .restaurant-name {
                    font-size: 2.5rem;
                    font-weight: bold;
                    color: #AAAB54;
                    margin-bottom: 10px;
                }

                /* Ubicación del restaurante */
                .restaurant-location {
                    font-size: 1.2rem;
                    color: #666;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                /* Calificación con estrellas */
                .restaurant-rating {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 20px;
                }

                /* Estrellas de calificación */
                .stars {
                    color: #FFD700;
                    font-size: 1.5rem;
                }

                /* Texto de la calificación numérica */
                .rating-text {
                    font-size: 1.1rem;
                    color: #333;
                    font-weight: 600;
                }

                /* Descripción del restaurante */
                .restaurant-description {
                    font-size: 1.1rem;
                    line-height: 1.6;
                    color: #444;
                }

                /* Sección de reseñas */
                .reviews-section {
                    background-color: white;
                    border-radius: 15px;
                    padding: 30px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                /* Título de la sección de reseñas */
                .reviews-title {
                    font-size: 1.8rem;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 20px;
                }

                /* Cada reseña individual */
                .review-item {
                    border-bottom: 1px solid #eee;
                    padding: 20px 0;
                }

                .review-item:last-child {
                    border-bottom: none;
                }

                /* Header de cada reseña (usuario + estrellas) */
                .review-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }

                /* Nombre de usuario en la reseña */
                .review-username {
                    font-weight: bold;
                    color: #AAAB54;
                    font-size: 1.1rem;
                }

                /* Estrellas de la reseña */
                .review-stars {
                    color: #FFD700;
                    font-size: 1.2rem;
                }

                /* Texto de la reseña */
                .review-text {
                    font-size: 1rem;
                    line-height: 1.5;
                    color: #555;
                }

                /* Barra lateral derecha con sugerencias */
                .suggestions-section {
                    width: 250px;
                    padding: 20px 10px;
                    background-color: white;
                    border-left: 1px solid #e0e0e0;
                }
                
                /* Barra de navegación inferior (solo móvil) */
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

                /* Botón para volver atrás */
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

                /* === RESPONSIVE DESIGN PARA MÓVILES === */
                @media (max-width: 900px) {
                    /* En móviles: ocultar header desktop */
                    .header-wrapper {
                        display: none;
                    }
                    
                    /* En móviles: ocultar sidebar */
                    .sidebar {
                        display: none;
                    }
                    
                    /* En móviles: ocultar sugerencias */
                    .suggestions-section {
                        display: none;
                    }
                    
                    /* En móviles: mostrar barra de navegación inferior */
                    .responsive-bar {
                        display: block;
                    }
                    
                    /* Ajustar contenido para móviles */
                    .content {
                        padding: 15px;
                        padding-bottom: 80px;
                    }

                    /* En móviles: cambiar layout del header del restaurante */
                    .restaurant-header {
                        flex-direction: column;
                        text-align: center;
                        gap: 20px;
                    }

                    /* En móviles: imagen más pequeña */
                    .restaurant-image {
                        width: 150px;
                        height: 150px;
                        align-self: center;
                    }

                    /* En móviles: nombre más pequeño */
                    .restaurant-name {
                        font-size: 2rem;
                    }

                    /* En móviles: menos padding */
                    .restaurant-info-section,
                    .reviews-section {
                        padding: 20px;
                        margin-bottom: 15px;
                    }
                }

                /* Para pantallas aún más pequeñas */
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
                <!-- Barra lateral izquierda -->
                <div class="sidebar">
                    <lulada-sidebar></lulada-sidebar>
                </div>
                
                <!-- Contenido principal -->
                <div class="content">
                    <!-- Botón para volver atrás -->
                    <button class="back-button" id="back-btn">
                        ← Volver
                    </button>

                    <!-- Sección con información del restaurante -->
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

                    <!-- Sección de reseñas -->
                    <div class="reviews-section">
                        <h2 class="reviews-title">Reseñas (${this.currentRestaurant.reviews.length})</h2>
                        ${this.generateReviewsHTML()}
                    </div>
                </div>
                
                <!-- Barra lateral derecha con sugerencias -->
                <div class="suggestions-section">
                    <lulada-suggestions></lulada-suggestions>
                </div>
            </div>
            
            <!-- Barra responsive para móviles -->
            <div class="responsive-bar">
                <lulada-responsive-bar></lulada-responsive-bar>
            </div>
        `;

        console.log(' RestaurantProfile: Renderizado completado');
    }

    // Función que convierte una calificación numérica en estrellas visuales
    private generateStars(rating: number): string {
        const fullStars = Math.floor(rating);           // Estrellas completas
        const hasHalfStar = rating % 1 >= 0.5;          // ¿Hay media estrella?
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Estrellas vacías
        
        // Combinar estrellas llenas + media estrella + estrellas vacías
        return '★'.repeat(fullStars) + 
               (hasHalfStar ? '☆' : '') + 
               '☆'.repeat(emptyStars);
    }

    // Función que genera el HTML de todas las reseñas
    private generateReviewsHTML(): string {
        // Si no hay restaurante o no tiene reseñas, mostrar mensaje
        if (!this.currentRestaurant || !this.currentRestaurant.reviews.length) {
            return '<p style="color: #666; font-style: italic;">No hay reseñas disponibles aún.</p>';
        }

        // Generar HTML para cada reseña y unirlas
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

    // Función que configura todos los eventos (clicks, etc.)
    setupEventListeners() {
        if (!this.shadowRoot) return;

        // Configurar botón de volver
        const backButton = this.shadowRoot.querySelector('#back-btn');
        if (backButton) {
            backButton.addEventListener('click', () => {
                console.log(' RestaurantProfile: Navegando de vuelta');
                
                // Limpiar información del restaurante guardada
                try {
                    sessionStorage.removeItem('selectedRestaurant');
                } catch (error) {
                    console.warn(' Error limpiando sessionStorage:', error);
                }
                
                // Navegar de vuelta al home
                const navigationEvent = new CustomEvent('navigate', {
                    detail: '/home',
                    bubbles: true,
                    composed: true
                });
                
                // Enviar evento de navegación al sistema principal
                document.dispatchEvent(navigationEvent);
            });
        }

        // Escuchar eventos de navegación desde otros componentes
        this.shadowRoot.addEventListener('navigate', (event: Event) => {
            const customEvent = event as CustomEvent;
            // Reenviar el evento al sistema principal de navegación
            document.dispatchEvent(new CustomEvent('navigate', {
                detail: customEvent.detail
            }));
        });

        console.log('RestaurantProfile: Event listeners configurados');
    }

    // Función que maneja el responsive design (adaptación móvil/desktop)
    handleResize() {
        // Obtener referencias a los elementos que cambian según el tamaño de pantalla
        const sidebar = this.shadowRoot?.querySelector('.sidebar') as HTMLElement;
        const suggestions = this.shadowRoot?.querySelector('.suggestions-section') as HTMLElement;
        const responsiveBar = this.shadowRoot?.querySelector('.responsive-bar') as HTMLElement;
        const headerWrapper = this.shadowRoot?.querySelector('.header-wrapper') as HTMLElement;
        const responsiveHeader = this.shadowRoot?.querySelector('lulada-responsive-header') as HTMLElement;

        if (sidebar && suggestions && responsiveBar && headerWrapper && responsiveHeader) {
            // Si la pantalla es pequeña (móvil)
            if (window.innerWidth < 900) {
                sidebar.style.display = 'none';              // Ocultar sidebar
                suggestions.style.display = 'none';          // Ocultar sugerencias
                responsiveBar.style.display = 'block';       // Mostrar barra inferior
                headerWrapper.style.display = 'none';        // Ocultar header desktop
                responsiveHeader.style.display = 'block';    // Mostrar header móvil
            } else {
                // Si la pantalla es grande (desktop)
                sidebar.style.display = 'block';             // Mostrar sidebar
                suggestions.style.display = 'block';         // Mostrar sugerencias
                responsiveBar.style.display = 'none';        // Ocultar barra inferior
                headerWrapper.style.display = 'block';       // Mostrar header desktop
                responsiveHeader.style.display = 'none';     // Ocultar header móvil
            }
        }
    }

    // === MÉTODOS PÚBLICOS (pueden ser llamados desde fuera) ===

    // Método público para actualizar restaurante (útil para testing)
    public updateRestaurant(restaurantId: string): void {
        // Buscar el restaurante en nuestra base de datos
        const restaurantData = this.defaultRestaurants[restaurantId];
        if (restaurantData) {
            // Si lo encontramos, actualizamos y volvemos a dibujar
            this.currentRestaurant = restaurantData;
            this.render();
            console.log(` RestaurantProfile: Actualizado a ${restaurantData.name}`);
        } else {
            console.warn(`RestaurantProfile: No se encontró restaurante con ID: ${restaurantId}`);
        }
    }

    // Método público para debugging (mostrar información de diagnóstico)
    public debugInfo(): void {
        console.log(' RestaurantProfile Debug:');
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