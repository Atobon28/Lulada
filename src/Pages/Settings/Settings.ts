// Creamos una clase que representa la página de configuraciones de la app
class LuladaSettings extends HTMLElement {
    constructor() {
        super(); // Llamamos al constructor de HTMLElement
        // Creamos un shadow DOM para aislar los estilos de este componente
        this.attachShadow({ mode: 'open' });

        // Si el shadow DOM se creó correctamente, añadimos el HTML y CSS
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    /* Estilos para el componente principal */
                    :host {
                        display: flex; /* Los elementos se organizan en columna */
                        flex-direction: column; /* Uno debajo del otro */
                        width: 100%; /* Ocupa todo el ancho */
                        height: 100vh; /* Ocupa toda la altura de la pantalla */
                        font-family: Arial, sans-serif; /* Fuente de texto */
                        background-color: white; /* Fondo blanco */
                    }
                    
                    /* Contenedor del header (parte superior) */
                    .header-wrapper {
                        width: 100%; /* Ocupa todo el ancho */
                        background-color: white; /* Fondo blanco */
                        padding: 20px 0 10px 20px; /* Espacios internos */
                        border-bottom: 1px solid #eaeaea; /* Línea gris en la parte inferior */
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Sombra suave */
                    }
                    
                    /* Contenedor del logo */
                    .logo-container {
                        width: 300px; /* Ancho fijo para el logo */
                    }
                    
                    /* Contenedor principal que tiene el sidebar y el contenido */
                    .main-container {
                        display: flex; /* Los elementos se organizan en fila */
                        width: 100%; /* Ocupa todo el ancho */
                        flex: 1; /* Ocupa todo el espacio restante */
                        background-color: white; /* Fondo blanco */
                        overflow: hidden; /* Oculta contenido que se desborde */
                    }
                    
                    /* Barra lateral izquierda */
                    .sidebar-wrapper {
                        width: 250px; /* Ancho fijo */
                        height: 100%; /* Altura completa */
                        overflow-y: auto; /* Permite scroll vertical si es necesario */
                    }
                    
                    /* Área donde se muestra el contenido principal */
                    .content-container {
                        flex-grow: 1; /* Ocupa todo el espacio restante */
                        padding-left: 20px; /* Espacio interno izquierdo */
                        padding-top: 20px; /* Espacio interno superior */
                        height: 100%; /* Altura completa */
                        overflow-y: auto; /* Permite scroll vertical si es necesario */
                    }
                    
                    /* Barra de navegación para móviles (inicialmente oculta) */
                    .responsive-nav {
                        display: none; /* Oculta por defecto */
                        position: fixed; /* Se queda fija en la pantalla */
                        bottom: 0; /* Se posiciona en la parte inferior */
                        left: 0; /* Empieza desde la izquierda */
                        right: 0; /* Se extiende hasta la derecha */
                        background-color: white; /* Fondo blanco */
                        border-top: 1px solid #e0e0e0; /* Línea gris en la parte superior */
                        padding: 10px 0; /* Espacios internos arriba y abajo */
                        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1); /* Sombra hacia arriba */
                        z-index: 1000; /* Se muestra por encima de otros elementos */
                    }
                    
                    /* Estilos responsivos para pantallas pequeñas (móviles) */
                    @media (max-width: 900px) {
                        /* Ocultar el header normal en móviles */
                        .header-wrapper {
                            display: none;
                        }
                        
                        /* Ocultar la barra lateral en móviles */
                        .sidebar-wrapper {
                            display: none;
                        }
                        
                        /* Ajustar el contenido para móviles */
                        .content-container {
                            padding-left: 10px; /* Menos espacio interno */
                            padding-right: 10px; /* Espacio interno derecho */
                            padding-top: 10px; /* Menos espacio superior */
                            padding-bottom: 100px; /* Espacio extra para la barra inferior */
                            height: auto; /* La altura se ajusta automáticamente */
                            max-height: none; /* Sin limitación de altura máxima */
                            overflow-y: visible; /* Permite scroll natural */
                        }
                        
                        /* Mostrar la barra de navegación inferior en móviles */
                        .responsive-nav {
                            display: block;
                        }
                        
                        /* Ajustar el componente principal para móviles */
                        :host {
                            height: auto !important; /* Altura automática (forzado) */
                            min-height: 100vh; /* Altura mínima de toda la pantalla */
                            overflow-y: auto; /* Permite scroll vertical */
                        }
                        
                        /* Ajustar el contenedor principal para móviles */
                        .main-container {
                            height: auto; /* Altura automática */
                            overflow: visible; /* Contenido visible (sin cortar) */
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
        
        // Configuramos la función que maneja los cambios de tamaño de pantalla
        this.resizeHandler = this.resizeHandler.bind(this);
        this.resizeHandler(); // La ejecutamos una vez al crear el componente
    }

    // Función que se ejecuta cuando el componente se añade a la página
    connectedCallback() {
        console.log('LuladaSettings añadido al DOM');
        // Escuchamos cuando cambia el tamaño de la ventana
        window.addEventListener('resize', this.resizeHandler);
    }

    // Función que se ejecuta cuando el componente se quita de la página
    disconnectedCallback() {
        console.log('LuladaSettings eliminado del DOM');
        // Dejamos de escuchar los cambios de tamaño para limpiar memoria
        window.removeEventListener('resize', this.resizeHandler);
    }
    
    // Función privada que maneja los cambios de tamaño de pantalla
    private resizeHandler() {
        // Obtenemos referencias a los elementos que necesitamos mostrar/ocultar
        const responsiveHeader = this.shadowRoot?.querySelector('lulada-responsive-header') as HTMLElement;
        const normalHeader = this.shadowRoot?.querySelector('.header-wrapper') as HTMLElement;
        const responsiveNav = this.shadowRoot?.querySelector('.responsive-nav') as HTMLElement;
        const sidebar = this.shadowRoot?.querySelector('.sidebar-wrapper') as HTMLElement;
        
        // Si encontramos todos los elementos
        if (responsiveHeader && normalHeader && responsiveNav && sidebar) {
            // Si la pantalla es de 900px o menos (móvil/tablet)
            if (window.innerWidth <= 900) {
                // Mostrar elementos para móviles
                responsiveHeader.style.display = 'block'; // Mostrar header de móvil
                normalHeader.style.display = 'none'; // Ocultar header normal
                responsiveNav.style.display = 'block'; // Mostrar barra de navegación inferior
                sidebar.style.display = 'none'; // Ocultar barra lateral
            } else {
                // Si la pantalla es más grande (computadora)
                // Mostrar elementos para computadora
                responsiveHeader.style.display = 'none'; // Ocultar header de móvil
                normalHeader.style.display = 'block'; // Mostrar header normal
                responsiveNav.style.display = 'none'; // Ocultar barra de navegación inferior
                sidebar.style.display = 'block'; // Mostrar barra lateral
            }
        }
    }
}

// Exportamos la clase para que pueda ser usada en otros archivos
export default LuladaSettings;