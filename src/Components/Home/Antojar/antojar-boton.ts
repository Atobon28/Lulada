// antojar-boton.ts

// Traemos el servicio que se encarga de mostrar y ocultar la ventana emergente
import AntojarPopupService from './antojar-popup';

// Creamos un componente personalizado que será un botón para "antojar" (crear reseñas)
export class LuladaAntojarBoton extends HTMLElement {
    // Esta propiedad guardará el "shadow DOM" que es como una caja privada para nuestro HTML y CSS
    shadowRoot: ShadowRoot | null;

    constructor() {
        super(); // Llamamos al constructor de la clase padre (HTMLElement)
        // Creamos el shadow DOM en modo 'open' para que podamos acceder a él desde fuera
        this.shadowRoot = this.attachShadow({ mode: 'open' });
    }

    // Este método se ejecuta automáticamente cuando el botón se agrega a la página web
    connectedCallback() {
        // Verificamos que el shadow DOM se haya creado correctamente
        if (this.shadowRoot) {
            // Leemos los atributos que el usuario puede personalizar en el HTML
            const texto = this.getAttribute('texto') || 'Antojar'; // El texto del botón (por defecto "Antojar")
            const color = this.getAttribute('color') || '#AAAB54'; // El color de fondo (por defecto verde)
            const colorHover = this.getAttribute('color-hover') || 'rgb(132, 134, 58)'; // Color cuando pasas el mouse

            // Creamos todo el HTML y CSS del botón dentro del shadow DOM
            this.shadowRoot.innerHTML = `
                <style>
                    /* Estilos para el componente completo */
                    :host {
                        display: inline-block; /* El botón se comporta como un elemento en línea */
                    }
                    
                    /* Estilos para el botón */
                    .antojar-button {
                        padding: 8px 24px; /* Espacio interno del botón */
                        background-color: ${color}; /* Color de fondo personalizable */
                        color: white; /* Texto en blanco */
                        border: none; /* Sin borde */
                        border-radius: 20px; /* Bordes redondeados */
                        font-size: 16px; /* Tamaño de la letra */
                        font-weight: bold; /* Letra en negrita */
                        cursor: pointer; /* Cursor de manita al pasar por encima */
                        transition: background-color 0.2s ease; /* Animación suave al cambiar color */
                        display: flex; /* Los elementos internos se alinean en fila */
                        align-items: center; /* Centrar verticalmente */
                        gap: 8px; /* Espacio entre el ícono y el texto */
                    }
                    
                    /* Estilos cuando pasas el mouse por encima del botón */
                    .antojar-button:hover {
                        background-color: ${colorHover}; /* Cambia al color más oscuro */
                    }
                    
                    /* Estilos para el ícono de estrella */
                    .icon {
                        width: 16px; /* Ancho del ícono */
                        height: 16px; /* Alto del ícono */
                        fill: white; /* Color del ícono (blanco) */
                    }
                </style>
                
                <!-- HTML del botón -->
                <button class="antojar-button">
                    <!-- Ícono de estrella en formato SVG -->
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M12 2l1.46 4.38h4.75l-3.83 2.84 
                            1.46 4.38-3.84-2.84-3.84 2.84 
                            1.46-4.38-3.83-2.84h4.75z">
                        </path>
                    </svg>
                    ${texto} <!-- Aquí se muestra el texto del botón -->
                </button>
            `;

            // Buscamos el botón que acabamos de crear dentro del shadow DOM
            const button = this.shadowRoot.querySelector('.antojar-button');
            
            // Si encontramos el botón, le agregamos funcionalidad
            if (button) {
                // Cuando alguien hace clic en el botón, ejecutamos esta función
                button.addEventListener('click', () => {
                    // Obtenemos el servicio que maneja la ventana emergente
                    const popupService = AntojarPopupService.getInstance(); 
                    // Le decimos al servicio que muestre la ventana emergente
                    popupService.showPopup(); 
                });
            }
        }
    }
}

// Exportamos la clase para que otros archivos puedan usarla
export default LuladaAntojarBoton;