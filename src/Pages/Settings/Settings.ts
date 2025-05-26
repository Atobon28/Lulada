class LuladaSettings extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                        height: 100vh;
                        font-family: Arial, sans-serif;
                        background-color: white;
                    }
                    
                    .header-wrapper {
                        width: 100%;
                        background-color: white;
                        padding: 20px 0 10px 20px;
                        border-bottom: 1px solid #eaeaea;
                    }
                    
                    .logo-container {
                        width: 300px;
                    }
                    
                    .main-container {
                        display: flex;
                        width: 100%;
                        flex: 1;
                        background-color: white;
                        overflow: hidden;
                    }
                    
                    .sidebar-wrapper {
                        width: 250px;
                        height: 100%;
                        overflow-y: auto;
                    }
                    
                    .content-container {
                        flex-grow: 1;
                        padding-left: 20px;
                        padding-top: 20px;
                        height: 100%;
                        overflow-y: auto;
                    }
                    
                    .responsive-nav {
                        display: none;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background-color: white;
                        border-top: 1px solid #e0e0e0;
                        padding: 10px 0;
                        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
                        z-index: 1000;
                    }
                    
                    /* Responsive styles */
              @media (max-width: 900px) {
    .header-wrapper {
        display: none;
    }
    
    .sidebar-wrapper {
        display: none;
    }
    
    .content-container {
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 10px;
        padding-bottom: 100px; /* Espacio extra para la barra inferior */
        height: auto; /* Permitir que crezca automáticamente */
        max-height: none; /* Quitar limitaciones de altura */
        overflow-y: visible; /* Permitir scroll natural */
    }
    
    .responsive-nav {
        display: block;
    }
    
    /* Asegurar que el contenedor principal permita scroll */
    :host {
        height: auto !important;
        min-height: 100vh;
        overflow-y: auto;
    }
    
    .main-container {
        height: auto;
        overflow: visible;
    }
}
                </style>
                
                <!-- Header responsive (SOLO visible en mobile) -->
                <lulada-responsive-header style="display: none;"></lulada-responsive-header>
                
                <!-- Header normal (SOLO visible en desktop) -->
                <div class="header-wrapper">
                    <div class="logo-container">
                        <lulada-logo></lulada-logo>
                    </div>
                </div>
                
                <div class="main-container">
                    <div class="sidebar-wrapper">
                        <lulada-sidebar></lulada-sidebar>
                    </div>
                    
                    <div class="content-container">
                        <cajon-list-interactive id="settings-list"></cajon-list-interactive>
                    </div>
                </div>
                
                <!-- Barra de navegación responsive (SOLO visible en mobile) -->
                <div class="responsive-nav">
                    <lulada-responsive-bar></lulada-responsive-bar>
                </div>
            `;
        }
        
        this.resizeHandler = this.resizeHandler.bind(this);
        this.resizeHandler();
    }

    connectedCallback() {
        console.log('LuladaSettings añadido al DOM');
        window.addEventListener('resize', this.resizeHandler);
    }

    disconnectedCallback() {
        console.log('LuladaSettings eliminado del DOM');
        window.removeEventListener('resize', this.resizeHandler);
    }
    
    private resizeHandler() {
        const responsiveHeader = this.shadowRoot?.querySelector('lulada-responsive-header') as HTMLElement;
        const normalHeader = this.shadowRoot?.querySelector('.header-wrapper') as HTMLElement;
        const responsiveNav = this.shadowRoot?.querySelector('.responsive-nav') as HTMLElement;
        const sidebar = this.shadowRoot?.querySelector('.sidebar-wrapper') as HTMLElement;
        
        if (responsiveHeader && normalHeader && responsiveNav && sidebar) {
            if (window.innerWidth <= 900) {
                // Mobile: mostrar header responsive y barra inferior, ocultar sidebar
                responsiveHeader.style.display = 'block';
                normalHeader.style.display = 'none';
                responsiveNav.style.display = 'block';
                sidebar.style.display = 'none';
            } else {
                // Desktop: mantener todo como estaba originalmente
                responsiveHeader.style.display = 'none';
                normalHeader.style.display = 'block';
                responsiveNav.style.display = 'none';
                sidebar.style.display = 'block';
            }
        }
    }
}

export default LuladaSettings;