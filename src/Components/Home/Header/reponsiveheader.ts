// src/Components/Home/Header/reponsiveheader.ts - CON ICONOS DE SETTINGS Y NOTIFICACIONES

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

                    <!-- ÍCONO CORREGIDO: Usando el mismo del navbar (sidebar) -->
                    <div class="nav-item ${this.currentActive === 'antojar' ? 'active' : ''}" data-nav="antojar" data-route="/antojar">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <g fill="none" fill-rule="evenodd">
                                <path fill="currentColor" d="M18.293 17.293a1 1 0 0 1 1.498 1.32l-.084.094l-1.5 1.5a3.12 3.12 0 0 1-4.414 0a1.12 1.12 0 0 0-1.488-.087l-.098.087l-.5.5a1 1 0 0 1-1.497-1.32l.083-.094l.5-.5a3.12 3.12 0 0 1 4.414 0a1.12 1.12 0 0 0 1.488.087l.098-.087zm-1.81-13.31a2.5 2.5 0 0 1 3.657 3.405l-.122.131L8.443 19.094a1.5 1.5 0 0 1-.506.333l-.145.05l-2.837.807a1 1 0 0 1-1.261-1.13l.024-.107l.807-2.838a1.5 1.5 0 0 1 .28-.537l.102-.113zm2.12 1.415a.5.5 0 0 0-.637-.058l-.07.058L6.414 16.88l-.28.988l.987-.28L18.604 6.104a.5.5 0 0 0 0-.707"/>
                            </g>
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
                        justify-content: space-between; /* Cambio: space-between para distribuir elementos */
                    }
                    
                    .logo-container {
                        display: flex;
                        justify-content: center;
                        flex: 1; /* El logo ocupa el espacio central */
                    }
                    
                    /* NUEVO: Contenedor para iconos de acciones */
                    .actions-container {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                    }
                    
                    /* NUEVO: Estilos para iconos de acción */
                    .action-icon {
                        width: 28px;
                        height: 28px;
                        color: #AAAB54;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        padding: 8px;
                        border-radius: 50%;
                        background: transparent;
                    }
                    
                    .action-icon:hover {
                        background-color: rgba(170, 171, 84, 0.1);
                        transform: scale(1.1);
                        color: #999A4A;
                    }
                    
                    .action-icon:active {
                        transform: scale(0.95);
                    }
                    
                    @media (max-width: 768px) {
                        .header-content {
                            padding: 10px 15px;
                        }
                        
                        .actions-container {
                            gap: 12px;
                        }
                        
                        .action-icon {
                            width: 26px;
                            height: 26px;
                            padding: 6px;
                        }
                    }
                    
                    @media (max-width: 480px) {
                        .header-content {
                            padding: 8px 12px;
                        }
                        
                        .actions-container {
                            gap: 10px;
                        }
                        
                        .action-icon {
                            width: 24px;
                            height: 24px;
                            padding: 5px;
                        }
                    }
                </style>
                
                <div class="header-content">
                    <!-- Espacio vacío para balance visual -->
                    <div style="width: 72px;"></div>
                    
                    <!-- Logo centrado -->
                    <div class="logo-container">
                        <lulada-logo></lulada-logo>
                    </div>
                    
                    <!-- ICONOS MOVIDOS AL LADO DERECHO -->
                    <div class="actions-container">
                        <!-- Icono de Configuraciones -->
                        <svg class="action-icon" id="settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.49.49 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1a.6.6 0 0 0-.18-.03c-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46a.5.5 0 0 0 .61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1q.09.03.18.03c.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64zm-1.98-1.71c.04.31.05.52.05.73s-.02.43-.05.73l-.14 1.13l.89.7l1.08.84l-.7 1.21l-1.27-.51l-1.04-.42l-.9.68c-.43.32-.84.56-1.25.73l-1.06.43l-.16 1.13l-.2 1.35h-1.4l-.19-1.35l-.16-1.13l-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7l-1.06.43l-1.27.51l-.7-1.21l1.08-.84l.89-.7l-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13l-.89-.7l-1.08-.84l.7-1.21l1.27.51l1.04.42l.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43l.16-1.13l.2-1.35h1.39l.19 1.35l.16 1.13l1.06.43c.43.18.83.41 1.23.71l.91.7l1.06-.43l1.27-.51l.7 1.21l-1.07.85l-.89.7zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4s-1.79-4-4-4m0 6c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2"/>
                        </svg>
                        
                        <!-- Icono de Notificaciones -->
                        <svg class="action-icon" id="notifications-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5 19q-.425 0-.712-.288T4 18t.288-.712T5 17h1v-7q0-2.075 1.25-3.687T10.5 4.2v-.7q0-.625.438-1.062T12 2t1.063.438T13.5 3.5v.7q2 .5 3.25 2.113T18 10v7h1q.425 0 .713.288T20 18t-.288.713T19 19zm7 3q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22zm-4-5h8v-7q0-1.65-1.175-2.825T12 6T9.175 7.175T8 10z"/>
                        </svg>
                    </div>
                </div>
            `;
        }
        
        this.setupEventListeners();
    }
    
    // NUEVO: Configurar event listeners para los iconos
    setupEventListeners() {
        if (!this.shadowRoot) return;
        
        const settingsIcon = this.shadowRoot.querySelector('#settings-icon');
        const notificationsIcon = this.shadowRoot.querySelector('#notifications-icon');
        
        if (settingsIcon) {
            settingsIcon.addEventListener('click', () => {
                console.log('🔧 ResponsiveHeader: Navegando a configuraciones');
                this.navigate('/configurations');
            });
        }
        
        if (notificationsIcon) {
            notificationsIcon.addEventListener('click', () => {
                console.log('🔔 ResponsiveHeader: Navegando a notificaciones');
                this.navigate('/notifications');
            });
        }
        
        console.log('✅ ResponsiveHeader: Event listeners configurados');
    }
    
    // NUEVO: Función para navegación
    private navigate(route: string): void {
        console.log('🚀 ResponsiveHeader: Navegando a:', route);
        
        const event = new CustomEvent("navigate", { 
            detail: route,
            bubbles: true,
            composed: true 
        });
        
        // Disparar evento global
        document.dispatchEvent(event);
        
        console.log(`✅ ResponsiveHeader: Navegado a: ${route}`);
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