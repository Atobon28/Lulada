// Página principal de inicio de la aplicación
class Home extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        console.log('🏠 Home component conectado');
        this.render();
        this.setupEventListeners();
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize();
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    // Dibuja el HTML y CSS del componente
    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                    min-height: 100vh;
                    background-color: #f8f9fa;
                }
                
                .responsive-header {
                    display: none;
                }
                
                .desktop-logo {
                    display: block;
                }
                
                .header-section {
                    background: white;
                    width: 100%;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .main-layout {
                    display: flex;
                    max-width: 1200px;
                    margin: 0 auto;
                    min-height: calc(100vh - 120px);
                }
                
                .sidebar {
                    width: 250px;
                    background: white;
                    border-right: 1px solid #e0e0e0;
                    position: sticky;
                    top: 120px;
                    height: fit-content;
                }

                .medium-content {
                    flex-grow: 1;
                    display: flex; 
                    flex-direction: column;
                    max-width: calc(100% - 500px);
                }

                .content {
                    flex-grow: 1;
                    display: flex; 
                    padding: 20px;
                    gap: 20px;
                }
                
                .reviews-section {
                    background-color: white;
                    flex-grow: 1;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    padding: 20px;
                }

                .suggestions-section {
                    width: 250px;
                    background: white;
                    border-left: 1px solid #e0e0e0;
                    position: sticky;
                    top: 120px;
                    height: fit-content;
                    padding: 20px;
                }

                .welcome-message {
                    background: linear-gradient(135deg, #AAAB54, #999A4A);
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    text-align: center;
                }

                .welcome-message h2 {
                    margin: 0 0 10px 0;
                    font-size: 24px;
                }

                .welcome-message p {
                    margin: 0;
                    opacity: 0.9;
                }

                .quick-actions {
                    margin-bottom: 20px;
                }

                .action-button {
                    width: 100%;
                    padding: 12px;
                    margin-bottom: 10px;
                    background: #AAAB54;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: background-color 0.2s;
                }

                .action-button:hover {
                    background: #999A4A;
                }

                .action-button.secondary {
                    background: #f8f9fa;
                    color: #666;
                    border: 1px solid #dee2e6;
                }

                .action-button.secondary:hover {
                    background: #e9ecef;
                }

                /* Estilos responsivos */
                @media (max-width: 1024px) {
                    .suggestions-section {
                        display: none;
                    }
                    
                    .medium-content {
                        max-width: 100%;
                    }
                }

                @media (max-width: 768px) {
                    .responsive-header {
                        display: block;
                    }
                    
                    .desktop-logo {
                        display: none;
                    }
                    
                    .header-section {
                        display: none;
                    }
                    
                    .main-layout {
                        flex-direction: column;
                        margin: 0;
                        max-width: 100%;
                    }
                    
                    .sidebar {
                        width: 100%;
                        order: 3;
                        position: static;
                        border-right: none;
                        border-top: 1px solid #e0e0e0;
                    }
                    
                    .content {
                        order: 2;
                        padding: 10px;
                    }
                    
                    .reviews-section {
                        margin: 0;
                    }
                }

                @media (max-width: 480px) {
                    .content {
                        padding: 5px;
                    }
                    
                    .welcome-message h2 {
                        font-size: 20px;
                    }
                }
            </style>

            <!-- Header para dispositivos móviles -->
            <div class="responsive-header">
                <lulada-responsive-header></lulada-responsive-header>
            </div>

            <!-- Header principal con logo y navegación -->
            <div class="header-section">
                <div class="desktop-logo">
                    <lulada-header-home></lulada-header-home>
                </div>
            </div>

            <!-- Layout principal con sidebar, contenido y sugerencias -->
            <div class="main-layout">
                <!-- Sidebar izquierdo -->
                <div class="sidebar">
                    <lulada-sidebar></lulada-sidebar>
                </div>

                <!-- Contenido principal -->
                <div class="medium-content">
                    <div class="content">
                        <div class="reviews-section">
                            <!-- Mensaje de bienvenida -->
                            <div class="welcome-message">
                                <h2>¡Bienvenido a Lulada! 🍽️</h2>
                                <p>Descubre los mejores restaurantes de Cali y comparte tus experiencias</p>
                            </div>

                            <!-- Acciones rápidas -->
                            <div class="quick-actions">
                                <button class="action-button" id="antojar-btn">
                                    📝 Escribir una reseña
                                </button>
                                <button class="action-button secondary" id="explore-btn">
                                    🔍 Explorar restaurantes
                                </button>
                            </div>

                            <!-- Contenedor de reseñas -->
                            <lulada-reviews-container></lulada-reviews-container>
                        </div>
                    </div>
                </div>

                <!-- Panel de sugerencias derecho -->
                <div class="suggestions-section">
                    <lulada-suggestions></lulada-suggestions>
                </div>
            </div>

            <!-- Barra de navegación inferior para móviles -->
            <div class="responsive-header">
                <lulada-responsive-bar></lulada-responsive-bar>
            </div>
            `;
        }
    }

    // Configurar event listeners
    private setupEventListeners() {
        if (!this.shadowRoot) return;

        // Botón para abrir el popup de Antojar
        const antojarBtn = this.shadowRoot.querySelector('#antojar-btn');
        antojarBtn?.addEventListener('click', () => {
            this.handleAntojarClick();
        });

        // Botón para navegar a Explore
        const exploreBtn = this.shadowRoot.querySelector('#explore-btn');
        exploreBtn?.addEventListener('click', () => {
            this.handleExploreClick();
        });

        // Escuchar eventos de usuario actualizado
        document.addEventListener('userDataUpdated', (event: any) => {
            console.log('🔄 Datos de usuario actualizados en Home:', event.detail);
        });
    }

    // Manejar clic en botón Antojar
    private handleAntojarClick() {
        console.log('📝 Abriendo popup de Antojar...');
        
        if (window.AntojarPopupService) {
            window.AntojarPopupService.getInstance().showPopup();
        } else {
            console.warn('⚠️ AntojarPopupService no está disponible');
            
            // Fallback: mostrar mensaje temporal
            const tempMessage = document.createElement('div');
            tempMessage.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #AAAB54;
                color: white;
                padding: 16px;
                border-radius: 8px;
                z-index: 10000;
            `;
            tempMessage.textContent = '📝 Función de escribir reseña próximamente...';
            document.body.appendChild(tempMessage);
            
            setTimeout(() => {
                if (document.body.contains(tempMessage)) {
                    document.body.removeChild(tempMessage);
                }
            }, 3000);
        }
    }

    // Manejar clic en botón Explore
    private handleExploreClick() {
        console.log('🔍 Navegando a Explore...');
        
        const navEvent = new CustomEvent('navigate', {
            detail: '/explore',
            bubbles: true,
            composed: true
        });
        document.dispatchEvent(navEvent);
    }

    // Manejar cambios de tamaño de ventana
    private handleResize() {
        const isMobile = window.innerWidth <= 768;
        console.log(`📱 Modo ${isMobile ? 'móvil' : 'escritorio'} activado`);
        
        // Aquí puedes agregar lógica específica para responsive si es necesario
    }

    // Método público para refrescar el contenido
    public refresh() {
        console.log('🔄 Refrescando contenido de Home...');
        
        // Recargar componentes si es necesario
        const reviewsContainer = this.shadowRoot?.querySelector('lulada-reviews-container') as any;
        if (reviewsContainer && typeof reviewsContainer.refresh === 'function') {
            reviewsContainer.refresh();
        }
        
        const suggestions = this.shadowRoot?.querySelector('lulada-suggestions') as any;
        if (suggestions && typeof suggestions.refresh === 'function') {
            suggestions.refresh();
        }
    }

    // Método para debugging
    public debug() {
        console.log('🔍 Home Debug Info:');
        console.log('- Componente conectado:', this.isConnected);
        console.log('- ShadowRoot existe:', !!this.shadowRoot);
        console.log('- Usuario autenticado:', localStorage.getItem('isAuthenticated'));
        console.log('- Datos de usuario:', localStorage.getItem('currentUser'));
        
        const components = [
            'lulada-header-home',
            'lulada-sidebar', 
            'lulada-reviews-container',
            'lulada-suggestions',
            'lulada-responsive-header',
            'lulada-responsive-bar'
        ];
        
        console.log('- Componentes presentes:');
        components.forEach(comp => {
            const element = this.shadowRoot?.querySelector(comp);
            console.log(`  ${comp}: ${element ? '✅' : '❌'}`);
        });
    }
}

// Hacer métodos disponibles globalmente para debugging
if (typeof window !== 'undefined') {
    (window as any).debugHome = () => {
        const homeComponent = document.querySelector('lulada-home') as Home;
        if (homeComponent) {
            homeComponent.debug();
        }
    };
    
    (window as any).refreshHome = () => {
        const homeComponent = document.querySelector('lulada-home') as Home;
        if (homeComponent) {
            homeComponent.refresh();
        }
    };
}

export default Home;