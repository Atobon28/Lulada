// Definimos una clase llamada HeaderCompleto que extiende HTMLElement
// Esto significa que estamos creando un componente web personalizado
class HeaderCompleto extends HTMLElement {
    constructor() {
        // Llamamos al constructor de la clase padre (HTMLElement)
        super();
        
        // Creamos un Shadow DOM en modo 'open' para aislar los estilos de este componente
        // El Shadow DOM evita que los estilos de fuera afecten a nuestro componente
        this.attachShadow({ mode: 'open' });

        // Verificamos que el shadowRoot se haya creado correctamente
        if (this.shadowRoot) {
            // Insertamos el HTML y CSS del componente dentro del shadowRoot
            this.shadowRoot.innerHTML = /*html*/ `
            <style>
                /* Estilos para el componente principal */
                :host {
                    display: block;
                    width: 100%;
                }
                
                /* Estilos para ambos tipos de header (normal y responsive) */
                .lulada-header,
                .lulada-responsive-header {
                    width: 100%;
                    transition: all 0.3s ease; /* Transición suave cuando cambian */
                }
                
                /* Por defecto, el header normal está visible */
                .lulada-header {
                    display: block;
                }
                
                /* Por defecto, el header responsive está oculto */
                .lulada-responsive-header {
                    display: none;
                }
                
                /* Cuando la pantalla es menor a 900px (móvil/tablet) */
                @media (max-width: 900px) {
                    /* Ocultamos el header normal */
                    .lulada-header {
                        display: none !important;
                    }
                    
                    /* Mostramos el header responsive */
                    .lulada-responsive-header {
                        display: block !important;
                    }
                }
                
                /* Cuando la pantalla es mayor a 900px (desktop) */
                @media (min-width: 901px) {
                    /* Mostramos el header normal */
                    .lulada-header {
                        display: block !important;
                    }
                    
                    /* Ocultamos el header responsive */
                    .lulada-responsive-header {
                        display: none !important;
                    }
                }
            </style>
            
            <!-- Contenedor para el header normal (desktop) -->
            <div class="lulada-header">
                <lulada-header></lulada-header>
            </div>
                    
            <!-- Contenedor para el header responsive (móvil) -->
            <div class="lulada-responsive-header">
                <lulada-responsive-header></lulada-responsive-header>
            </div>
            `;
        }
        
        // Vinculamos la función resizeHandler al contexto actual (this)
        // Esto asegura que 'this' se refiera al componente cuando se ejecute la función
        this.resizeHandler = this.resizeHandler.bind(this);
        
        // Ejecutamos la función una vez al crear el componente
        this.resizeHandler(); 
    }
    
    // Esta función se ejecuta cuando el componente se conecta al DOM
    connectedCallback() {
        // Agregamos un listener para detectar cuando cambie el tamaño de la ventana
        window.addEventListener('resize', this.resizeHandler);
    }
    
    // Esta función se ejecuta cuando el componente se desconecta del DOM
    disconnectedCallback(){
        // Removemos el listener para evitar problemas de memoria
        window.removeEventListener('resize', this.resizeHandler);
    }
    
    // Función que maneja los cambios de tamaño de la ventana
    resizeHandler() {
        // Obtenemos referencias a los dos contenedores de header
        const Header = this.shadowRoot?.querySelector('.lulada-header') as HTMLDivElement;
        const Headerresponsive = this.shadowRoot?.querySelector('.lulada-responsive-header') as HTMLDivElement;
        
        // Verificamos que ambos elementos existan
        if (Header && Headerresponsive) {
            // Si la ventana es menor a 900px de ancho
            if (window.innerWidth < 900) { 
                // Ocultamos el header normal
                Header.style.display = 'none'; 
                // Mostramos el header responsive
                Headerresponsive.style.display = 'block'; 
            } else {
                // Si la ventana es mayor a 900px
                // Mostramos el header normal
                Header.style.display = 'block'; 
                // Ocultamos el header responsive
                Headerresponsive.style.display = 'none'; 
            }
        }
    }
}

// Exportamos la clase para que pueda ser usada en otros archivos
export default HeaderCompleto;