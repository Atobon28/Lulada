// Creamos una clase que representa la página de configuraciones de la app
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
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
                    
                    /* Estilos responsivos para pantallas pequeñas (móviles) */
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
                            padding-bottom: 100px;
                            height: auto;
                            max-height: none;
                            overflow-y: visible;
                        }
                        
                        .responsive-nav {
                            display: block;
                        }
                        
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
                
                <!-- Header responsive que solo se ve en móviles -->
                <lulada-responsive-header style="display: none;"></lulada-responsive-header>
                
                <!-- Header normal que solo se ve en computadoras -->
                <div class="header-wrapper">
                    <div class="logo-container">
                        <lulada-logo></lulada-logo>
                    </div>
                </div>
                
                <!-- Contenedor principal con sidebar y contenido -->
                <div class="main-container">
                    <!-- Barra lateral izquierda -->
                    <div class="sidebar-wrapper">
                        <lulada-sidebar></lulada-sidebar>
                    </div>
                    
                    <!-- Área de contenido donde se muestran las opciones de configuración -->
                    <div class="content-container">
                        <cajon-list-interactive id="settings-list"></cajon-list-interactive>
                    </div>
                </div>
                
                <!-- Barra de navegación que solo se ve en móviles -->
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
                responsiveHeader.style.display = 'block';
                normalHeader.style.display = 'none';
                responsiveNav.style.display = 'block';
                sidebar.style.display = 'none';
            } else {
                responsiveHeader.style.display = 'none';
                normalHeader.style.display = 'block';
                responsiveNav.style.display = 'none';
                sidebar.style.display = 'block';
            }
        }
    }
}

export default LuladaSettings;