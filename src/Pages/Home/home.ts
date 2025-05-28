export class Home extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        console.log('🏠 Home: Constructor ejecutado');
        
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        font-family: Arial, sans-serif;
                        width: 100%;
                        overflow-x: hidden;
                        min-height: 100vh;
                        background-color: #f8f9fa;
                    }
                    
                    /* Header responsive - VISIBLE SOLO EN MOBILE */
                    .responsive-header {
                        display: none;
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
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }
                    
                    .main-layout {
                        display: flex;
                        width: 100%;
                        box-sizing: border-box;
                        margin: 0;
                        min-height: calc(100vh - 80px);
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
                        background-color: #f8f9fa;
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
                        /* MOSTRAR header responsive en móvil */
                        .responsive-header {
                            display: block !important;
                        }
                        
                        /* OCULTAR header normal en móvil */
                        .header-wrapper {
                            display: none !important;
                        }
                        
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

                    /* Fallback si los componentes no cargan */
                    .fallback-content {
                        padding: 40px;
                        text-align: center;
                        background-color: white;
                        border-radius: 10px;
                        margin: 20px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }

                    .fallback-content h1 {
                        color: #AAAB54;
                        margin-bottom: 20px;
                    }

                    .fallback-content p {
                        color: #666;
                        line-height: 1.6;
                    }
                </style>
                
                <!-- Header responsive (SOLO móvil) -->
                <div class="responsive-header">
                    <lulada-responsive-header></lulada-responsive-header>
                </div>
                
                <!-- Header desktop (SOLO desktop) -->
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
                            
                            <!-- Contenido de fallback si los componentes no cargan -->
                            <div class="fallback-content" id="fallback" style="display: none;">
                                <h1>🍽️ Bienvenido a Lulada</h1>
                                <p>Descubre los mejores sabores de Cali</p>
                                <p>Estamos cargando el contenido...</p>
                            </div>
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
            
            console.log('🏠 Home: HTML renderizado');
        } else {
            console.error('❌ Home: No se pudo crear shadowRoot');
        }
    }
    
    setupLocationFiltering() {
        console.log('🏠 Home: Configurando filtrado de ubicación...');
        
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
        console.log('🏠 Home: Componente conectado al DOM');
        
        // Verificar que los sub-componentes se carguen
        setTimeout(() => {
            this.checkSubComponents();
        }, 1000);
        
        // Configurar resize handler para debug
        this.setupResizeHandler();
    }

    disconnectedCallback() {
        console.log('🏠 Home: Componente desconectado');
    }

    // Verificar que los sub-componentes estén cargados
    private checkSubComponents() {
        if (!this.shadowRoot) return;

        const subComponents = [
            'lulada-header',
            'lulada-responsive-header',
            'lulada-sidebar', 
            'lulada-reviews-container',
            'lulada-suggestions',
            'lulada-responsive-bar'
        ];

        let loadedComponents = 0;
        const fallback = this.shadowRoot.querySelector('#fallback') as HTMLElement;

        subComponents.forEach(componentName => {
            const element = this.shadowRoot!.querySelector(componentName);
            if (element) {
                loadedComponents++;
                console.log(`✅ ${componentName}: Cargado correctamente`);
            } else {
                console.warn(`⚠️ ${componentName}: No encontrado`);
            }
        });

        console.log(`📊 Home: ${loadedComponents}/${subComponents.length} componentes cargados`);

        // Mostrar fallback si no se cargaron suficientes componentes
        if (loadedComponents < 2 && fallback) {
            fallback.style.display = 'block';
            console.log('📋 Mostrando contenido de fallback');
        }
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

    // Método público para debug
    public debugInfo() {
        console.log('🏠 Home Debug Info:');
        console.log('- Shadow Root:', !!this.shadowRoot);
        console.log('- Conectado:', this.isConnected);
        
        if (this.shadowRoot) {
            const elements = this.shadowRoot.querySelectorAll('*');
            console.log('- Elementos en shadow DOM:', elements.length);
            
            elements.forEach(el => {
                console.log(`  - ${el.tagName.toLowerCase()}`);
            });
        }
    }
}

// Exponer para debugging
if (typeof window !== 'undefined') {
    // Solo asignar si no existe ya
    if (!window.debugHome) {
        window.debugHome = () => {
            const homeEl = document.querySelector('lulada-home') as Home;
            if (homeEl && homeEl.debugInfo) {
                homeEl.debugInfo();
            } else {
                console.log('No se encontró el componente lulada-home');
            }
        };
    }
}

export default Home;