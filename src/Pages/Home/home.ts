// Home.ts - VERSIÓN PANTALLA COMPLETA COMO EN LA SEGUNDA IMAGEN

class Home extends HTMLElement {
    private resizeHandler: () => void;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // Bind del resize handler
        this.resizeHandler = this.handleResize.bind(this);
    }

    connectedCallback() {
        // PREVENIR DUPLICACIÓN
        if (this.hasAttribute('data-connected')) {
            console.log('⚠️ Home ya conectado, evitando duplicación');
            return;
        }
        
        this.setAttribute('data-connected', 'true');
        console.log('🏠 Home component conectado por primera vez');
        
        this.render();
        this.setupEventListeners();
        window.addEventListener('resize', this.resizeHandler);
        this.handleResize();
    }

    disconnectedCallback() {
        this.removeAttribute('data-connected');
        window.removeEventListener('resize', this.resizeHandler);
    }

    private render(): void {
        // PREVENIR RENDERIZADO MÚLTIPLE
        if (this.shadowRoot && this.shadowRoot.innerHTML.trim() !== '') {
            console.log('⚠️ Home ya renderizado, evitando duplicación');
            return;
        }

        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                    width: 100%;
                    height: 100vh;
                    background-color: #f8f9fa;
                    overflow: hidden;
                }
                
                .home-container {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100vh;
                    position: relative;
                }
                
                .header-section {
                    flex-shrink: 0;
                    background: white;
                    width: 100%;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    z-index: 100;
                }
                
                .main-layout {
                    display: flex;
                    flex: 1;
                    width: 100%;
                    height: calc(100vh - 80px);
                    overflow: hidden;
                }
                
                .sidebar {
                    flex-shrink: 0;
                    width: 250px;
                    background: white;
                    border-right: 1px solid #e0e0e0;
                    overflow-y: auto;
                    height: 100%;
                }
                
                .content-area {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    overflow: hidden;
                }
                
                .content {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    background-color: #f8f9fa;
                }
                
                .reviews-section {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    min-height: calc(100vh - 200px);
                }
                
                .suggestions-section {
                    flex-shrink: 0;
                    width: 300px;
                    padding: 20px;
                    background-color: #f8f9fa;
                    border-left: 1px solid #e0e0e0;
                    overflow-y: auto;
                    height: 100%;
                }
                
                .responsive-header {
                    display: none;
                }
                
                .responsive-bar {
                    display: none;
                }
                
                /* Responsive para móviles */
                @media (max-width: 768px) {
                    .responsive-header {
                        display: block;
                    }
                    
                    .header-section {
                        display: none;
                    }
                    
                    .main-layout {
                        flex-direction: column;
                        height: calc(100vh - 60px);
                    }
                    
                    .sidebar {
                        display: none;
                    }
                    
                    .suggestions-section {
                        display: none;
                    }
                    
                    .responsive-bar {
                        display: block;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background: white;
                        border-top: 1px solid #e0e0e0;
                        z-index: 100;
                        height: 60px;
                    }
                    
                    .content {
                        padding: 10px;
                        padding-bottom: 70px;
                    }
                    
                    .reviews-section {
                        min-height: calc(100vh - 140px);
                    }
                }
                
                /* Tablet responsivo */
                @media (max-width: 900px) and (min-width: 769px) {
                    .suggestions-section {
                        display: none;
                    }
                    
                    .content {
                        padding-right: 20px;
                    }
                }
                
                /* Loading state */
                .loading-content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 200px;
                    color: #666;
                    font-size: 16px;
                }
                
                /* Error state */
                .error-content {
                    text-align: center;
                    padding: 40px;
                    color: #dc3545;
                }
                
                .error-retry {
                    background: #AAAB54;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    margin-top: 16px;
                }
            </style>
            
            <div class="home-container">
                <!-- Header responsivo para móvil -->
                <div class="responsive-header">
                    <lulada-responsive-header></lulada-responsive-header>
                </div>
                
                <!-- Header principal para escritorio -->
                <div class="header-section">
                    <lulada-header-home></lulada-header-home>
                </div>
                
                <!-- Layout principal -->
                <div class="main-layout">
                    <!-- Sidebar izquierdo -->
                    <div class="sidebar">
                        <lulada-sidebar></lulada-sidebar>
                    </div>
                    
                    <!-- Área de contenido principal -->
                    <div class="content-area">
                        <div class="content">
                            <div class="reviews-section" id="reviews-container">
                                <div class="loading-content">
                                    Cargando publicaciones...
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Sugerencias -->
                    <div class="suggestions-section">
                        <lulada-suggestions></lulada-suggestions>
                    </div>
                </div>
                
                <!-- Barra responsiva inferior -->
                <div class="responsive-bar">
                    <lulada-responsive-bar></lulada-responsive-bar>
                </div>
            </div>
        `;
        
        // Cargar el contenido después de renderizar
        setTimeout(() => {
            this.loadReviewsContent();
        }, 100);
    }

    private loadReviewsContent(): void {
        const reviewsContainer = this.shadowRoot?.querySelector('#reviews-container');
        if (!reviewsContainer) return;

        console.log('[Home] Cargando contenido de reviews...');

        // Verificar si lulada-reviews-container está registrado
        const isRegistered = !!customElements.get('lulada-reviews-container');
        
        if (isRegistered) {
            // Cargar el componente lulada-reviews-container
            reviewsContainer.innerHTML = '<lulada-reviews-container></lulada-reviews-container>';
            
            // Verificar que se cargó correctamente
            setTimeout(() => {
                const container = reviewsContainer.querySelector('lulada-reviews-container');
                if (container) {
                    console.log('[Home] ✅ Reviews container cargado');
                } else {
                    console.warn('[Home] ⚠️ Reviews container no se cargó');
                    this.showReviewsError();
                }
            }, 500);
        } else {
            console.warn('[Home] lulada-reviews-container no está registrado');
            this.showReviewsError();
        }
    }

    private showReviewsError(): void {
        const reviewsContainer = this.shadowRoot?.querySelector('#reviews-container');
        if (!reviewsContainer) return;

        reviewsContainer.innerHTML = `
            <div class="error-content">
                <h3>⚠️ Error cargando contenido</h3>
                <p>No se pudo cargar el contenido de las publicaciones.</p>
                <button class="error-retry" onclick="this.closest('lulada-home').refreshContent()">
                    Reintentar
                </button>
            </div>
        `;
    }

    private setupEventListeners(): void {
        // Escuchar eventos de navegación
        this.addEventListener('navigate', this.handleNavigation.bind(this));
        
        // Escuchar eventos del botón "antojar"
        document.addEventListener('antojar-clicked', this.handleAntojarClick.bind(this));
        
        // Escuchar eventos del botón "explore"
        document.addEventListener('explore-clicked', this.handleExploreClick.bind(this));
        
        console.log('👂 Event listeners configurados en Home');
    }

    private handleNavigation(event: Event): void {
        const customEvent = event as CustomEvent;
        console.log('🧭 Home recibió evento de navegación:', customEvent.detail);
    }

    private handleAntojarClick(): void {
        console.log('📝 Botón Antojar clickeado desde Home');
        
        // Verificar si AntojarPopupService está disponible
        if ((window as any).AntojarPopupService) {
            try {
                const service = (window as any).AntojarPopupService.getInstance();
                if (service && typeof service.showPopup === 'function') {
                    service.showPopup();
                } else {
                    this.showTemporaryMessage('📝 Función de escribir reseña próximamente...');
                }
            } catch (error) {
                console.error('Error abriendo popup Antojar:', error);
                this.showTemporaryMessage('📝 Función de escribir reseña próximamente...');
            }
        } else {
            this.showTemporaryMessage('📝 Función de escribir reseña próximamente...');
        }
    }

    private showTemporaryMessage(message: string): void {
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
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
        `;
        tempMessage.textContent = message;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(tempMessage);
        
        setTimeout(() => {
            if (document.body.contains(tempMessage)) {
                tempMessage.style.transform = 'translateX(100%)';
                tempMessage.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(tempMessage)) {
                        document.body.removeChild(tempMessage);
                    }
                }, 300);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        }, 3000);
    }

    private handleExploreClick(): void {
        console.log('🔍 Navegando a Explore...');
        
        const navEvent = new CustomEvent('navigate', {
            detail: '/explore',
            bubbles: true,
            composed: true
        });
        document.dispatchEvent(navEvent);
    }

    private handleResize(): void {
        const isMobile = window.innerWidth <= 768;
        console.log(`📱 Modo ${isMobile ? 'móvil' : 'escritorio'} activado`);
        
        if (isMobile) {
            this.classList.add('mobile-mode');
            this.classList.remove('desktop-mode');
        } else {
            this.classList.add('desktop-mode');
            this.classList.remove('mobile-mode');
        }
    }

    // Método público para refrescar el contenido
    public refresh(): void {
        console.log('🔄 Refrescando contenido de Home...');
        this.loadReviewsContent();
        
        const suggestions = this.shadowRoot?.querySelector('lulada-suggestions') as any;
        if (suggestions && typeof suggestions.refresh === 'function') {
            suggestions.refresh();
        }

        console.log('✅ Refresh de Home completado');
    }

    // Método público para refrescar contenido (alias)
    public refreshContent(): void {
        this.refresh();
    }

    // Método para debugging
    public debug(): void {
        console.log('🔍 Home Debug Info:');
        console.log('- Componente conectado:', this.isConnected);
        console.log('- ShadowRoot existe:', !!this.shadowRoot);
        console.log('- Atributo data-connected:', this.hasAttribute('data-connected'));
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

        const globalHomeElements = document.querySelectorAll('lulada-home');
        console.log(`- Elementos Home en DOM global: ${globalHomeElements.length}`);
        
        if (globalHomeElements.length > 1) {
            console.warn('⚠️ DUPLICADOS DETECTADOS - Hay múltiples elementos Home');
        }
    }
}

// Funciones globales para debugging
if (typeof window !== 'undefined') {
    (window as any).debugHome = () => {
        const homeComponent = document.querySelector('lulada-home') as Home;
        if (homeComponent) {
            homeComponent.debug();
        } else {
            console.log('❌ No se encontró componente Home');
        }
    };
    
    (window as any).refreshHome = () => {
        const homeComponent = document.querySelector('lulada-home') as Home;
        if (homeComponent) {
            homeComponent.refresh();
        } else {
            console.log('❌ No se encontró componente Home');
        }
    };
    
    (window as any).cleanHomeComponents = () => {
        const homeElements = document.querySelectorAll('lulada-home');
        console.log(`🔍 Encontrados ${homeElements.length} elementos Home`);
        
        if (homeElements.length > 1) {
            console.log('🧹 Limpiando duplicados...');
            for (let i = 1; i < homeElements.length; i++) {
                homeElements[i].remove();
                console.log(`🗑️ Eliminado duplicado ${i}`);
            }
            console.log('✅ Duplicados eliminados');
        } else {
            console.log('✅ No hay duplicados');
        }
    };
}

export default Home;