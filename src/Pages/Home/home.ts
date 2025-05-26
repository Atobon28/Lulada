export class Home extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        font-family: Arial, sans-serif;
                        width: 100%;
                        overflow-x: hidden;
                    }
                    
                    /* Header sticky sin márgenes extra */
                    .header-wrapper {
                        width: 100%;
                        background-color: white;
                        position: sticky;
                        top: 0;
                        z-index: 100;
                        margin: 0;
                        padding: 0;
                    }
                    
                    .main-layout {
                        display: flex;
                        width: 100%;
                        box-sizing: border-box;
                        margin: 0;
                    }
                    
                    /* DESKTOP: Sidebar visible */
                    .sidebar {
                        width: 250px;
                        flex-shrink: 0;
                        background-color: white;
                        border-right: 1px solid #e0e0e0;
                    }
                    
                    .content {
                        flex-grow: 1;
                        display: flex;
                        min-width: 0;
                    }
                    
                    .reviews-section {
                        padding: 20px;
                        background-color: white;
                        flex-grow: 1;
                        min-width: 0;
                        box-sizing: border-box;
                    }
                    
                    /* DESKTOP: Suggestions visible */
                    .suggestions-section {
                        width: 250px;
                        padding: 20px 10px;
                        flex-shrink: 0;
                        box-sizing: border-box;
                        background-color: white;
                        border-left: 1px solid #e0e0e0;
                    }
                    
                    /* Barra de navegación responsiva - oculta en desktop */
                    .responsive-nav-bar {
                        display: none;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background-color: white;
                        z-index: 1000;
                        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
                    }

                    /* RESPONSIVE: Móvil */
                    @media (max-width: 900px) {
                        /* Ocultar sidebar y suggestions en móvil */
                        .sidebar {
                            display: none !important;
                        }
                        .suggestions-section {
                            display: none !important;
                        }
                        
                        /* Mostrar barra de navegación inferior */
                        .responsive-nav-bar {
                            display: block !important;
                        }
                        
                        /* Ajustar contenido para la barra inferior */
                        .content {
                            padding-bottom: 80px;
                            width: 100%;
                        }
                        
                        .reviews-section {
                            padding: 15px;
                        }
                    }

                    @media (max-width: 600px) {
                        .reviews-section {
                            padding: 10px;
                        }
                        
                        .content {
                            padding-bottom: 85px;
                        }
                    }
                </style>
                
                <!-- Header con layout responsive -->
                <div class="header-wrapper">
                    <lulada-header></lulada-header>
                </div>
                
                <div class="main-layout">
                    <!-- Sidebar (solo desktop) -->
                    <div class="sidebar">
                        <lulada-sidebar></lulada-sidebar>
                    </div>
                    
                    <!-- Contenido principal -->
                    <div class="content">
                        <div class="reviews-section">
                            <lulada-reviews-container></lulada-reviews-container>
                        </div>
                        
                        <!-- Suggestions (solo desktop) -->
                        <div class="suggestions-section">
                            <lulada-suggestions></lulada-suggestions>
                        </div>
                    </div>
                </div>
                
                <!-- Barra de navegación responsiva (solo móvil) -->
                <div class="responsive-nav-bar">
                    <lulada-responsive-bar></lulada-responsive-bar>
                </div>
            `;

            // Configurar eventos de filtrado
            this.setupLocationFiltering();
        }
    }
    
    setupLocationFiltering() {
        // Escuchar eventos de cambio de ubicación
        document.addEventListener('location-filter-changed', (e: Event) => {
            const event = e as CustomEvent;
            console.log('🏠 Home: Filtro de ubicación recibido:', event.detail);
        });

        // También escuchar desde el shadow root
        this.shadowRoot?.addEventListener('location-filter-changed', (e: Event) => {
            const event = e as CustomEvent;
            console.log('🏠 Home (Shadow): Filtro de ubicación recibido:', event.detail);
        });
    }

    connectedCallback() {
        console.log('🏠 Componente Home conectado');
        
        // Configurar resize handler para debug
        this.setupResizeHandler();
    }

    disconnectedCallback() {
        console.log('🏠 Componente Home desconectado');
    }

    // Debug helper para verificar responsive
    setupResizeHandler() {
        const checkLayout = () => {
            const isMobile = window.innerWidth <= 900;
            console.log(`📱 Layout actual: ${isMobile ? 'Móvil' : 'Desktop'} (${window.innerWidth}px)`);
        };

        window.addEventListener('resize', checkLayout);
        checkLayout(); // Verificar inmediatamente
    }
}

export default Home;