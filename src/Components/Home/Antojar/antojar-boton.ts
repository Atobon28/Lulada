// antojar-boton.ts

// Importamos el servicio que controla la aparición del popup
import AntojarPopupService from './antojar-popup';

// Definimos un nuevo componente personalizado llamado <lulada-antojar-boton>
export class LuladaAntojarBoton extends HTMLElement {
    // Creamos una propiedad para almacenar el shadow DOM
    shadowRoot: ShadowRoot | null;

    constructor() {
        super(); // Llamamos al constructor de HTMLElement
        // Creamos el shadow DOM en modo 'open' para poder acceder a él desde fuera si es necesario
        this.shadowRoot = this.attachShadow({ mode: 'open' });
    }

    // Este método se ejecuta cuando el elemento se añade al DOM
    connectedCallback() {
        if (this.shadowRoot) {
            // Obtenemos los atributos personalizados del botón desde el HTML
            const texto = this.getAttribute('texto') || 'Antojar'; // Texto que se mostrará en el botón
            const color = this.getAttribute('color') || '#AAAB54'; // Color de fondo por defecto
            const colorHover = this.getAttribute('color-hover') || 'rgb(132, 134, 58)'; // Color al pasar el mouse

            // Definimos el HTML y CSS del botón dentro del shadow DOM
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: inline-block; /* Hace que el componente se comporte como un elemento en línea */
                    }
                    .antojar-button {
                        padding: 8px 24px;
                        background-color: ${color};
                        color: white;
                        border: none;
                        border-radius: 20px;
                        font-size: 16px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: background-color 0.2s ease;
                        display: flex;
                        align-items: center;
                        gap: 8px; /* Espacio entre el ícono y el texto */
                    }
                    .antojar-button:hover {
                        background-color: ${colorHover}; /* Cambia el color al pasar el mouse */
                    }
                    .icon {
                        width: 16px;
                        height: 16px;
                        fill: white; /* Color del ícono */
                    }
                </style>
                
                <button class="antojar-button">
                    <!-- Ícono en formato SVG (una estrella) -->
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M12 2l1.46 4.38h4.75l-3.83 2.84 
                            1.46 4.38-3.84-2.84-3.84 2.84 
                            1.46-4.38-3.83-2.84h4.75z">
                        </path>
                    </svg>
                    ${texto} <!-- Texto del botón -->
                </button>
            `;

            // Seleccionamos el botón dentro del shadow DOM
            const button = this.shadowRoot.querySelector('.antojar-button');
            if (button) {
                // Añadimos un evento al botón: cuando se hace click, se muestra el popup
                button.addEventListener('click', () => {
                    const popupService = AntojarPopupService.getInstance(); // Obtenemos una instancia del servicio
                    popupService.showPopup(); // Mostramos la ventana emergente
                });
            }
        }
    }
}

// Exportamos el componente para poder usarlo en otros archivos
export default LuladaAntojarBoton;
