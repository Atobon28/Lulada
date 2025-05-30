// Exportamos la clase Navigation como un Web Component personalizado
export class Navigation extends HTMLElement {
    constructor() {
        super(); // Llamamos al constructor de HTMLElement
        // Creamos un Shadow DOM para encapsular los estilos y HTML de este componente
        this.attachShadow({ mode: 'open' });
        
        // Si el Shadow DOM se creó correctamente
        if (this.shadowRoot) {
            // Definimos todo el HTML y CSS del componente de navegación
            this.shadowRoot.innerHTML = `
                <style>
                    /* Estilos para el componente host (el elemento principal) */
                    :host {
                        display: block; /* El componente se muestra como un bloque */
                    }
                    
                    /* Estilos para el contenedor principal de navegación */
                    .navigation {
                        display: flex; /* Los elementos se alinean en fila */
                        justify-content: center; /* Centra horizontalmente */
                        align-items: center; /* Centra verticalmente */
                        background-color: #f0f0f0; /* Fondo gris claro */
                        padding: 10px; /* Espacio interno */
                        text-align: center; /* Texto centrado */
                    }
                    
                    /* Contenedor que agrupa los enlaces de navegación */
                    .navigation-container {
                        display: flex; /* Enlaces en fila */
                        gap: 20px; /* Espacio de 20px entre cada enlace */
                    }
                    
                    /* Estilos para los enlaces de navegación */
                    .navigation a {
                        text-decoration: none; /* Quita el subrayado de los enlaces */
                        color: #333; /* Color de texto gris oscuro */
                        font-weight: bold; /* Texto en negrita */
                        padding: 5px 10px; /* Espacio interno del enlace */
                    }
                    
                    /* Estilos cuando el usuario pasa el mouse sobre un enlace */
                    .navigation a:hover {
                        color: #666; /* Color más claro al hacer hover */
                        background-color: #e0e0e0; /* Fondo gris al hacer hover */
                        border-radius: 5px; /* Bordes redondeados */
                    }
                </style>
                
                <!-- HTML del componente de navegación -->
                <div class="navigation">
                    <div class="navigation-container">
                        <!-- Enlaces para cada zona de la ciudad -->
                        <!-- Cada enlace tiene un atributo data-section que identifica la zona -->
                        <a href="#" data-section="cali">Cali</a>
                        <a href="#" data-section="norte">Norte</a>
                        <a href="#" data-section="sur">Sur</a>
                        <a href="#" data-section="oeste">Oeste</a>
                        <a href="#" data-section="centro">Centro</a>
                    </div>
                </div>
            `;
            
            // Agregamos event listeners a todos los enlaces de navegación
            this.shadowRoot.querySelectorAll('a').forEach((link: Element) => {
                // Cada enlace escucha el evento 'click'
                link.addEventListener('click', (e: Event) => {
                    // Prevenir el comportamiento por defecto del enlace (no navegar)
                    e.preventDefault();
                    
                    // Obtener el elemento que fue clickeado
                    const target = e.target as HTMLElement;
                    
                    // Extraer el valor del atributo data-section (la zona seleccionada)
                    const section = target.getAttribute('data-section');
                    
                    // Crear y disparar un evento personalizado llamado 'navigate'
                    // Este evento se puede escuchar desde fuera del componente
                    this.dispatchEvent(new CustomEvent('navigate', { 
                        detail: section, // La zona seleccionada se envía en el detail
                        bubbles: true, // El evento puede subir por el DOM
                        composed: true // El evento puede salir del Shadow DOM
                    }));
                });
            });
        }
    }
 }
 
 // Exportamos la clase como default para que se pueda importar fácilmente
 export default Navigation;