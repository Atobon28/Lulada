// Página principal de inicio de la aplicación
class Home extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        // PREVENIR DUPLICACIÓN - Verificar si ya está conectado
        if (this.hasAttribute('data-connected')) {
            console.log('⚠️ Home ya conectado, evitando duplicación');
            return;
        }
        
        // Marcar como conectado
        this.setAttribute('data-connected', 'true');
        console.log('🏠 Home component conectado por primera vez');
        
        this.render();
        this.setupEventListeners();
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize();
    }

    disconnectedCallback() {
        // Limpiar el atributo al desconectar
        this.removeAttribute('data-connected');
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    // Dibuja el HTML y CSS del componente
    render() {
        // PREVENIR RENDERIZADO MÚLTIPLE
        if (this.shadowRoot && this.shadowRoot.innerHTML.trim() !== '') {
            console.log('⚠️ Home ya renderizado, evitando duplicación');
            return;
        }

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
                
                .content {
                    flex: 1;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                
                .reviews-section {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }
                
                .suggestions-section {
                    width: 300px;
                    padding: 20px;
                }
                
                .responsive-bar {
                    display: none;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .responsive-header {
                        display: block;
                    }
                    
                    .desktop-logo {
                        display: none;
                    }
                    
                    .main-layout {
                        flex-direction: column;
                        padding: 10px;
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
                    }
                    
                    .content {
                        padding-bottom: 80px;
                    }
                }
                
                @media (max-width: 900px) {
                    .suggestions-section {
                        display: none;
                    }
                    
                    .content {
                        padding-right: 10px;
                    }
                }
            </style>
            
            <!-- Header responsivo para móvil -->
            <div class="responsive-header">
                <lulada-responsive-header></lulada-responsive-header>
            </div>
            
            <!-- Header principal para escritorio -->
            <div class="header-section desktop-logo">
                <lulada-header-home></lulada-header-home>
            </div>
            
            <!-- Layout principal -->
            <div class="main-layout">
                <!-- Sidebar izquierdo -->
                <div class="sidebar">
                    <lulada-sidebar></lulada-sidebar>
                </div>
                
                <!-- Contenido principal -->
                <div class="content">
                    <div class="reviews-section">
                        <lulada-reviews-container></lulada-reviews-container>
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
            `;
        }
    }

    // Configurar event listeners
    private setupEventListeners() {
        // Escuchar eventos de navegación
        this.addEventListener('navigate', this.handleNavigation.bind(this));
        
        // Escuchar eventos del botón "antojar"
        document.addEventListener('antojar-clicked', this.handleAntojarClick.bind(this));
        
        // Escuchar eventos del botón "explore"
        document.addEventListener('explore-clicked', this.handleExploreClick.bind(this));
        
        console.log('👂 Event listeners configurados en Home');
    }

    // Manejar navegación interna
    private handleNavigation(event: Event) {
        const customEvent = event as CustomEvent;
        console.log('🧭 Home recibió evento de navegación:', customEvent.detail);
    }

    // Manejar clic en botón Antojar
    private handleAntojarClick() {
        console.log('📝 Botón Antojar clickeado desde Home');
        
        // Verificar si AntojarPopupService está disponible
        if (window.AntojarPopupService) {
            try {
                const service = window.AntojarPopupService.getInstance();
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
            // Mostrar mensaje temporal
            this.showTemporaryMessage('📝 Función de escribir reseña próximamente...');
        }
    }

    // Mostrar mensaje temporal
    private showTemporaryMessage(message: string) {
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
        
        // Agregar animación CSS
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
        
        // Actualizar clases CSS si es necesario
        if (isMobile) {
            this.classList.add('mobile-mode');
            this.classList.remove('desktop-mode');
        } else {
            this.classList.add('desktop-mode');
            this.classList.remove('mobile-mode');
        }
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

        console.log('✅ Refresh de Home completado');
    }

    // Método para debugging
    public debug() {
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

        // Verificar duplicados en el DOM global
        const globalHomeElements = document.querySelectorAll('lulada-home');
        console.log(`- Elementos Home en DOM global: ${globalHomeElements.length}`);
        
        if (globalHomeElements.length > 1) {
            console.warn('⚠️ DUPLICADOS DETECTADOS - Hay múltiples elementos Home');
        }
    }
}

// Hacer métodos disponibles globalmente para debugging
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
    
    // Función para limpiar duplicados manualmente
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