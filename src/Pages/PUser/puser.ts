// Definimos una nueva clase que representa la página de perfil de usuario
// Esta clase extiende HTMLElement para crear un componente web personalizado
class PUser extends HTMLElement {

    constructor() {
        // Llamamos al constructor de la clase padre (HTMLElement)
        super();
        // Creamos un shadow DOM para aislar los estilos de este componente
        // Esto evita que los estilos de otros componentes interfieran con este
        this.attachShadow({ mode: 'open' });
    }

    // Esta función se ejecuta automáticamente cuando el componente se añade al DOM
    connectedCallback() {
        // Dibujamos todo el contenido HTML del componente
        this.render();
        
        // Configuramos los eventos (clicks, cambios, etc.)
        this.setupEventListeners();
        
        // Agregamos un detector para cuando cambie el tamaño de la pantalla
        // Esto nos permite adaptar el diseño a móvil o desktop
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Ejecutamos la función de resize una vez al cargar para configurar el diseño inicial
        this.handleResize();
    }

    // Esta función se ejecuta cuando el componente se elimina del DOM
    disconnectedCallback() {
        // Removemos el detector de cambio de tamaño para evitar problemas de memoria
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    // Esta función se encarga de dibujar todo el HTML y CSS del componente
    render() {
        // Verificamos que el shadowRoot existe antes de continuar
        if (this.shadowRoot) {
            // Aquí definimos todo el HTML y CSS que se mostrará en pantalla
            this.shadowRoot.innerHTML = /*html*/ `
            <style>
                /* Estilos para el componente principal */
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                }
                
                /* Header responsive - Solo se muestra en móviles */
                .responsive-header {
                    display: none; /* Inicialmente oculto */
                }
                
                /* Logo de escritorio - Solo se muestra en computadoras */
                .desktop-logo {
                    display: block; /* Inicialmente visible */
                }
                
                /* Contenedor principal que organiza todo en filas */
                .main-layout {
                    display: flex; /* Los elementos se ponen uno al lado del otro */
                    margin-top: 10px;
                }
                
                /* Barra lateral izquierda con menú de navegación */
                .sidebar {
                    width: 250px; /* Ancho fijo de 250 píxeles */
                }

                /* Contenedor del contenido principal */
                .medium-content {
                    flex-grow: 1; /* Ocupa todo el espacio restante */
                    display: flex; 
                    flex-direction: column; /* Los elementos se apilan verticalmente */
                }

                /* Área donde va el contenido principal */
                .content {
                    flex-grow: 1;
                    display: flex; 
                    padding: 20px; /* Espacio interno de 20px */
                }
                
                /* Sección donde aparecen las publicaciones/reseñas */
                .reviews-section {
                    margin-left: 5.9rem;  /* Margen izquierdo */
                    margin-right: 5.9rem; /* Margen derecho */
                    background-color: white; /* Fondo blanco */
                    flex-grow: 1; /* Ocupa el espacio disponible */
                }

                /* Sección de sugerencias en el lado derecho */
                .suggestions-section {
                    width: 250px; /* Ancho fijo */
                    padding: 20px 10px; /* Espacio interno */
                }
                
                /* Mensaje que se muestra cuando no hay contenido */
                .no-content {
                    padding: 40px;
                    text-align: center;
                    color: #666; /* Color gris */
                    font-style: italic; /* Texto en cursiva */
                    background-color: #f9f9f9; /* Fondo gris claro */
                    border-radius: 8px; /* Bordes redondeados */
                    margin-top: 20px;
                }

                /* Barra de navegación inferior para móviles */
                .responsive-bar {
                    display: none; /* Inicialmente oculta */
                    position: fixed; /* Se queda fija en la pantalla */
                    bottom: 0; /* Se pega al fondo */
                    left: 0;
                    right: 0;
                    background-color: white;
                    padding: 10px 0;
                    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1); /* Sombra hacia arriba */
                }

                /* Reglas que se aplican solo en pantallas pequeñas (móviles) */
                @media (max-width: 900px) {
                    /* En móvil: MOSTRAR el header responsive */
                    .responsive-header {
                        display: block !important;
                    }
                    
                    /* En móvil: OCULTAR el logo de escritorio */
                    .desktop-logo {
                        display: none !important;
                    }
                    
                    /* En móvil: Ocultar la barra lateral */
                    .sidebar {
                        display: none;
                    }
                    
                    /* En móvil: Ocultar las sugerencias */
                    .suggestions-section {
                        display: none;
                    }
                    
                    /* En móvil: Mostrar la barra de navegación inferior */
                    .responsive-bar {
                        display: block;
                    }
                    
                    /* En móvil: Reducir los márgenes de las reseñas */
                    .reviews-section {
                        margin-left: 1rem;
                        margin-right: 1rem;
                    }
                }
            </style>
            
            <!-- Header que solo aparece en móviles -->
            <div class="responsive-header">
                <lulada-responsive-header></lulada-responsive-header>
            </div>
            
            <!-- Logo que solo aparece en escritorio -->
            <div class="desktop-logo">
                <lulada-logo></lulada-logo>
            </div>
                
            <!-- Contenedor principal de la página -->
            <div class="main-layout">
                <!-- Barra lateral con menú de navegación -->
                <div class="sidebar">
                    <lulada-sidebar></lulada-sidebar>
                </div>
                
                <!-- Contenido principal -->
                <div class="medium-content">
                    <!-- Sección del perfil de usuario -->
                    <div class="user-profile">
                        <user-profile></user-profile>
                    </div>
                    
                    <!-- Contenido de las publicaciones -->
                    <div class="content">
                        <div class="reviews-section">
                            <!-- Una publicación de ejemplo -->
                            <lulada-publication 
                                username="CrisTiJauregui" 
                                text="El coctel de hierva buena en @BarBurguer esta super delicioso para los amantes como yo de los sabores frescos, costo 20.000 y lo recomiendo 100%" 
                                stars="5"
                            ></lulada-publication>
                        </div>
                    </div>
                </div>
                
                <!-- Sección de sugerencias -->
                <div class="suggestions-section">
                    <lulada-suggestions></lulada-suggestions>
                </div>
            </div>
            
            <!-- Barra de navegación que solo aparece en móviles -->
            <div class="responsive-bar">
                <lulada-responsive-bar></lulada-responsive-bar>
            </div>
            `;
        }
    }

    // Función para configurar todos los eventos del componente
    setupEventListeners() {
        // Escuchamos eventos de navegación que pueden venir de otros componentes
        if (this.shadowRoot) {
            this.shadowRoot.addEventListener('navigate', (event: Event) => {
                const customEvent = event as CustomEvent;
                // Cuando recibimos un evento de navegación, lo reenviamos hacia arriba
                // para que el componente LoadPage lo maneje y cambie de página
                document.dispatchEvent(new CustomEvent('navigate', {
                    detail: customEvent.detail
                }));
            });
        }
    }

    // Función que se ejecuta cada vez que cambia el tamaño de la pantalla
    // Esto nos permite adaptar el diseño entre móvil y escritorio
    handleResize() {
        // Obtenemos referencias a los elementos que necesitamos mostrar/ocultar
        const sidebar = this.shadowRoot?.querySelector('.sidebar') as HTMLDivElement;
        const suggestions = this.shadowRoot?.querySelector('.suggestions-section') as HTMLDivElement;
        const responsiveBar = this.shadowRoot?.querySelector('.responsive-bar') as HTMLDivElement;

        // Verificamos que todos los elementos existan
        if (sidebar && suggestions && responsiveBar) {
            // Si la pantalla es menor a 900px (móvil)
            if (window.innerWidth < 900) {
                // Ocultamos la barra lateral y las sugerencias
                sidebar.style.display = 'none';
                suggestions.style.display = 'none';
                // Mostramos la barra de navegación inferior
                responsiveBar.style.display = 'block';
            } else {
                // Si la pantalla es mayor a 900px (escritorio)
                // Mostramos la barra lateral y las sugerencias
                sidebar.style.display = 'block';
                suggestions.style.display = 'block';
                // Ocultamos la barra de navegación inferior
                responsiveBar.style.display = 'none';
            }
        }
    }
}

// Exportamos la clase para que pueda ser usada en otros archivos
export default PUser;