// Página de explorar con diseño responsive
class LuladaExplore extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        console.log('[LuladaExplore] 🔍 Componente conectado al DOM');
        this.render();
        this.setupEventListeners();
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize();
    }

    disconnectedCallback() {
        console.log('[LuladaExplore] ❌ Componente desconectado del DOM');
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    render() {
        console.log('[LuladaExplore] 🎨 Renderizando componente');
        this.shadowRoot!.innerHTML = /*html */ `
            <style>
                :host {
                    display: block;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    width: 100%;
                    min-height: 100vh;
                    background-color: #f8f9fa;
                }
                
                .main-layout {
                    display: flex;
                    margin-top: 10px;
                    min-height: calc(100vh - 10px);
                }
                
                .sidebar {
                    width: 250px;
                    flex-shrink: 0;
                }

                .medium-content {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    min-width: 0; /* Permite que el flex item se reduzca */
                }

                .content {
                    flex-grow: 1;
                    display: flex;
                    padding: 20px;
                }
                
                .explore-section {
                    margin-left: 1rem;
                    margin-right: 1rem;
                    background-color: white;
                    flex-grow: 1;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    min-height: 500px;
                    overflow: hidden;
                }
                
                .suggestions-section {
                    width: 250px;
                    padding: 20px 10px;
                    flex-shrink: 0;
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

                /* Fallback content styles */
                .fallback-content {
                    padding: 40px;
                    text-align: center;
                    color: #666;
                }

                .component-placeholder {
                    background: #f8f9fa;
                    border: 2px dashed #dee2e6;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 10px 0;
                    text-align: center;
                    color: #6c757d;
                    font-style: italic;
                }

                @media (max-width: 900px) {
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
                        padding: 10px;
                    }
                    
                    .explore-section {
                        margin-left: 0.5rem;
                        margin-right: 0.5rem;
                    }
                }

                @media (max-width: 480px) {
                    .content {
                        padding: 5px;
                    }
                    
                    .explore-section {
                        margin-left: 0.25rem;
                        margin-right: 0.25rem;
                    }
                }
            </style>
            
            <header-explorer></header-explorer>

            <div class="main-layout">
                <div class="sidebar">
                    <lulada-sidebar></lulada-sidebar>
                </div>
                
                <div class="medium-content">
                    <div class="content">
                        <div class="explore-section">
                            <explore-container></explore-container>
                        </div>
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

        // Verificar que los componentes hijos se cargan correctamente
        this.verifyChildComponents();
    }

    private verifyChildComponents() {
        setTimeout(() => {
            const requiredComponents = [
                'header-explorer',
                'lulada-sidebar', 
                'explore-container',
                'lulada-suggestions',
                'lulada-responsive-bar'
            ];

            requiredComponents.forEach(componentName => {
                const element = this.shadowRoot?.querySelector(componentName);
                if (!element) {
                    console.warn(`[LuladaExplore] ⚠️ Componente ${componentName} no encontrado`);
                    this.showComponentPlaceholder(componentName);
                }
            });
        }, 100);
    }

    private showComponentPlaceholder(componentName: string) {
        const element = this.shadowRoot?.querySelector(componentName);
        if (element) {
            element.outerHTML = `
                <div class="component-placeholder">
                    <p>⚠️ Componente "${componentName}" no disponible</p>
                    <small>Verifica que el componente esté registrado correctamente</small>
                </div>
            `;
        }
    }

    setupEventListeners() {
        console.log('[LuladaExplore] 🎧 Configurando event listeners');
        
        if (this.shadowRoot) {
            // Escuchar eventos de navegación desde componentes hijos
            this.shadowRoot.addEventListener('navigate', (event: Event) => {
                const customEvent = event as CustomEvent;
                console.log('[LuladaExplore] 🧭 Evento de navegación recibido:', customEvent.detail);
                
                // Propagar el evento al documento principal
                document.dispatchEvent(new CustomEvent('navigate', {
                    detail: customEvent.detail
                }));
            });

            // Escuchar eventos específicos de explorar
            this.shadowRoot.addEventListener('restaurant-selected', (event: Event) => {
                const customEvent = event as CustomEvent;
                console.log('[LuladaExplore] 🍽️ Restaurante seleccionado:', customEvent.detail);
                
                // Propagar el evento
                document.dispatchEvent(new CustomEvent('restaurant-selected', {
                    detail: customEvent.detail
                }));
            });
        }
    }

    handleResize() {
        const sidebar = this.shadowRoot?.querySelector('.sidebar') as HTMLDivElement;
        const suggestions = this.shadowRoot?.querySelector('.suggestions-section') as HTMLDivElement;
        const responsiveBar = this.shadowRoot?.querySelector('.responsive-bar') as HTMLDivElement;

        if (sidebar && suggestions && responsiveBar) {
            const isMobile = window.innerWidth < 900;
            
            if (isMobile) {
                sidebar.style.display = 'none';
                suggestions.style.display = 'none';
                responsiveBar.style.display = 'block';
            } else {
                sidebar.style.display = 'block';
                suggestions.style.display = 'block';
                responsiveBar.style.display = 'none';
            }

            console.log(`[LuladaExplore] 📱 Modo responsive: ${isMobile ? 'Mobile' : 'Desktop'}`);
        }
    }

    // Método público para debug
    public debugInfo() {
        console.log('=== LULADA EXPLORE DEBUG INFO ===');
        console.log('- Shadow root existe:', !!this.shadowRoot);
        console.log('- Ancho de ventana:', window.innerWidth);
        console.log('- Modo móvil:', window.innerWidth < 900);
        
        const components = [
            'header-explorer',
            'lulada-sidebar',
            'explore-container', 
            'lulada-suggestions',
            'lulada-responsive-bar'
        ];
        
        console.log('- Componentes hijos:');
        components.forEach(name => {
            const element = this.shadowRoot?.querySelector(name);
            console.log(`  ${element ? '✅' : '❌'} ${name}`);
        });
        
        console.log('===============================');
    }
}

// Registrar el componente
customElements.define('lulada-explore', LuladaExplore);

// Función global para debug si es necesaria
if (typeof window !== 'undefined') {
    (window as any).debugLuladaExplore = () => {
        const exploreComponent = document.querySelector('lulada-explore') as any;
        if (exploreComponent && typeof exploreComponent.debugInfo === 'function') {
            exploreComponent.debugInfo();
        } else {
            console.log('❌ No se encontró el componente lulada-explore');
        }
    };
}

export default LuladaExplore;