// src/Components/Home/Header/reponsiveheader.ts - VERSIÓN CORREGIDA SIN ANY

// Interfaces para tipos seguros
interface ResponsiveBarElement extends HTMLElement {
    setActiveItem(nav: string): void;
    detectCurrentPage(): void;
    updateActiveFromRoute(route: string): void;
    debugInfo?(): void;
}

interface AntojarServiceInstance {
    initialize(): void;
    showPopup(): void;
    hidePopup?(): void;
}

interface AntojarService {
    getInstance(): AntojarServiceInstance;
}

// Extender Window para tipos seguros
declare global {
    interface Window {
        AntojarPopupService?: AntojarService;
    }
}

class LuladaResponsiveBar extends HTMLElement implements ResponsiveBarElement {
    private currentActive: string = 'home';

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    :host {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background-color: #fff;
                        border-top: 1px solid #e0e0e0;
                        padding: 12px 0;
                        width: 100%;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        z-index: 1000;
                        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
                    }
                    
                    .container-navbar {
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        width: 100%;
                        max-width: 500px;
                        padding: 0 40px;
                    }
                    
                    .nav-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        cursor: pointer;
                        padding: 8px;
                        transition: all 0.2s ease;
                        color: #AAAB54;
                        opacity: 0.6;
                        border-radius: 12px;
                    }

                    .nav-item.active {
                        opacity: 1;
                        transform: scale(1.05);
                        background-color: rgba(170, 171, 84, 0.1);
                    }

                    .nav-item:hover {
                        opacity: 0.8;
                        transform: translateY(-2px);
                        background-color: rgba(170, 171, 84, 0.05);
                    }

                    .nav-icon {
                        width: 28px;
                        height: 28px;
                        stroke-width: 1.5;
                        transition: all 0.2s ease;
                    }

                    .nav-item.active .nav-icon {
                        stroke-width: 2;
                    }

                    @media (max-width: 480px) {
                        .container-navbar {
                            padding: 0 20px;
                        }
                        
                        .nav-icon {
                            width: 26px;
                            height: 26px;
                        }
                    }

                    @media (max-width: 320px) {
                        .container-navbar {
                            padding: 0 15px;
                        }
                        
                        .nav-icon {
                            width: 24px;
                            height: 24px;
                        }
                    }
                </style>

                <div class="container-navbar">
                    <div class="nav-item ${this.currentActive === 'home' ? 'active' : ''}" data-nav="home" data-route="/home">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"/>
                            <polyline points="9,22 9,12 15,12 15,22"/>
                        </svg>
                    </div>

                    <div class="nav-item ${this.currentActive === 'explore' ? 'active' : ''}" data-nav="explore" data-route="/explore">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                    </div>

                    <div class="nav-item ${this.currentActive === 'antojar' ? 'active' : ''}" data-nav="antojar" data-route="/antojar">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h.01M15 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                    </div>

                    <div class="nav-item ${this.currentActive === 'save' ? 'active' : ''}" data-nav="save" data-route="/save">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"/>
                        </svg>
                    </div>

                    <div class="nav-item ${this.currentActive === 'profile' ? 'active' : ''}" data-nav="profile" data-route="/profile">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                    </div>
                </div>
            `;
        }
        
        this.setupEventListeners();
        this.detectCurrentPage();
    }

    setupEventListeners() {
        console.log('🔧 ResponsiveBar: Configurando event listeners...');
        
        if (!this.shadowRoot) return;
        
        const navItems = this.shadowRoot.querySelectorAll('.nav-item');
        
        navItems.forEach((item) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                const route = item.getAttribute('data-route');
                const nav = item.getAttribute('data-nav');
                
                if (route && nav) {
                    console.log(`🔧 ResponsiveBar: Navegando: ${nav} -> ${route}`);
                    
                    this.setActiveItem(nav);
                    
                    // Caso especial para antojar
                    if (route === "/antojar") {
                        console.log('🎯 ResponsiveBar: Abriendo popup de antojar...');
                        this.handleAntojarClick();
                    } else {
                        // Para otras rutas, navegar normalmente
                        this.navigate(route);
                    }
                }
            });
        });

        console.log('✅ ResponsiveBar: Event listeners configurados');
    }

    private handleAntojarClick(): void {
        try {
            const antojarService = window.AntojarPopupService;
            if (antojarService) {
                antojarService.getInstance().showPopup();
                console.log('✅ ResponsiveBar: Popup de antojar abierto');
            } else {
                console.error("❌ AntojarPopupService no disponible");
                alert("Esta función no está disponible");
            }
        } catch (error) {
            console.error("❌ Error con popup antojar:", error);
        }
    }

    public setActiveItem(activeNav: string): void {
        this.currentActive = activeNav;
        
        if (!this.shadowRoot) return;
        
        const navItems = this.shadowRoot.querySelectorAll('.nav-item');
        navItems.forEach((item) => {
            const nav = item.getAttribute('data-nav');
            if (nav === activeNav) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        console.log(`🎯 ResponsiveBar: Item activo: ${activeNav}`);
    }

    public detectCurrentPage(): void {
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('/home') || currentPath === '/') {
            this.setActiveItem('home');
        } else if (currentPath.includes('/explore')) {
            this.setActiveItem('explore');
        } else if (currentPath.includes('/save')) {
            this.setActiveItem('save');
        } else if (currentPath.includes('/profile')) {
            this.setActiveItem('profile');
        } else if (currentPath.includes('/antojar')) {
            this.setActiveItem('antojar');
        }
    }

    public updateActiveFromRoute(route: string): void {
        if (route.includes('/home')) {
            this.setActiveItem('home');
        } else if (route.includes('/explore')) {
            this.setActiveItem('explore');
        } else if (route.includes('/save')) {
            this.setActiveItem('save');
        } else if (route.includes('/profile')) {
            this.setActiveItem('profile');
        } else if (route.includes('/antojar')) {
            this.setActiveItem('antojar');
        }
    }

    navigate(route: string): void {
        console.log('🚀 ResponsiveBar: Navegando a:', route);
        
        const event = new CustomEvent("navigate", { 
            detail: route,
            bubbles: true,
            composed: true 
        });
        
        // Disparar evento global
        document.dispatchEvent(event);
        
        // También actualizar URL si es posible
        if (window.history && window.history.pushState) {
            window.history.pushState(null, '', route);
        }
        
        console.log(`✅ ResponsiveBar: Navegado a: ${route}`);
    }

    connectedCallback(): void {
        console.log('🔗 LuladaResponsiveBar conectado');
        setTimeout(() => this.detectCurrentPage(), 100);
    }

    disconnectedCallback(): void {
        console.log('🔌 LuladaResponsiveBar desconectado');
    }

    public debugInfo(): void {
        console.log('🔍 ResponsiveBar Debug:');
        console.log('- Current active:', this.currentActive);
        console.log('- URL actual:', window.location.pathname);
        console.log('- Shadow DOM:', !!this.shadowRoot);
        
        const navItems = this.shadowRoot?.querySelectorAll('.nav-item');
        console.log('- Items de navegación:');
        navItems?.forEach((item, index) => {
            const route = item.getAttribute('data-route');
            const nav = item.getAttribute('data-nav');
            const isActive = item.classList.contains('active');
            console.log(`  ${index}: ${nav} (${route}) - ${isActive ? 'Activo' : 'Inactivo'}`);
        });
    }
}

class LuladaResponsiveHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    :host {
                        display: block;
                        background-color: white;
                        border-bottom: 1px solid #eaeaea;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }
                    
                    .header-content {
                        padding: 15px 20px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                    
                    .logo {
                        font-size: 1.5rem;
                        font-weight: bold;
                        color: #AAAB54;
                    }
                    
                    @media (max-width: 768px) {
                        .header-content {
                            padding: 10px 15px;
                        }
                        
                        .logo {
                            font-size: 1.25rem;
                        }
                    }
                </style>
                
                <div class="header-content">
                    <div class="logo">Lulada</div>
                </div>
            `;
        }
    }

    connectedCallback() {
        console.log('🔗 LuladaResponsiveHeader conectado');
    }
}

// Registrar los componentes solo si no están ya registrados
if (!customElements.get('lulada-responsive-bar')) {
    customElements.define('lulada-responsive-bar', LuladaResponsiveBar);
    console.log('✅ lulada-responsive-bar registrado');
}

if (!customElements.get('lulada-responsive-header')) {
    customElements.define('lulada-responsive-header', LuladaResponsiveHeader);
    console.log('✅ lulada-responsive-header registrado');
}

export { LuladaResponsiveBar, LuladaResponsiveHeader };
export default LuladaResponsiveHeader;