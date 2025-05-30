// Importamos y creamos una clase para nuestro componente personalizado de tarjeta de texto
export class TextCard extends HTMLElement {
    
    // Esta función le dice al navegador qué atributos HTML debe "vigilar"
    // Si alguno de estos atributos cambia, el componente se actualizará automáticamente
    static get observedAttributes() {
        return ['text', 'position-col', 'position-row', 'span-cols', 'span-rows'];
    }

    // Constructor: se ejecuta cuando se crea una nueva tarjeta de texto
    constructor() {
        super(); // Llamamos al constructor de la clase padre (HTMLElement)
        // Creamos un "shadow DOM" - es como una cápsula que mantiene nuestro código separado del resto de la página
        this.attachShadow({ mode: 'open' });
    }

    // Esta función se ejecuta cuando el componente se añade a la página web
    connectedCallback() {
        this.render(); // Dibujamos el componente en la pantalla
    }

    // Esta función se ejecuta cada vez que cambia uno de los atributos que estamos "vigilando"
    attributeChangedCallback() {
        this.render(); // Volvemos a dibujar el componente con los nuevos valores
    }

    // Esta función es la que realmente "dibuja" el componente en la pantalla
    render() {
        // Si no tenemos shadow DOM, no podemos dibujar nada
        if (!this.shadowRoot) return;
        
        // Obtenemos los valores de los atributos HTML, y si no existen, usamos valores por defecto
        const text = this.getAttribute('text') || ''; // El texto que se mostrará
        const col = this.getAttribute('position-col') || '1'; // En qué columna del grid se coloca
        const row = this.getAttribute('position-row') || '1'; // En qué fila del grid se coloca
        const spanCols = this.getAttribute('span-cols') || '1'; // Cuántas columnas ocupa
        const spanRows = this.getAttribute('span-rows') || '1'; // Cuántas filas ocupa

        // Aquí creamos todo el HTML y CSS del componente
        this.shadowRoot.innerHTML = `
            <style>
                /* Estilos para el componente principal */
                :host {
                    /* Posicionamos la tarjeta en el grid usando las propiedades que recibimos */
                    grid-column: ${col} / span ${spanCols};
                    grid-row: ${row} / span ${spanRows};
                    display: block; /* Hace que se comporte como un bloque */
                }
                
                /* Estilos para la tarjeta de texto */
                .text-card {
                    padding: 20px; /* Espacio interno alrededor del texto */
                    font-size: 14px; /* Tamaño de la letra */
                    line-height: 1.5; /* Espacio entre líneas para mejor lectura */
                    background-color: #fff; /* Fondo blanco */
                    border-radius: 4px; /* Esquinas redondeadas */
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Sombra suave */
                    height: 100%; /* Ocupa toda la altura disponible */
                    display: flex; /* Usamos flexbox para centrar el contenido */
                    align-items: center; /* Centra verticalmente */
                    justify-content: center; /* Centra horizontalmente */
                    text-align: center; /* El texto se alinea al centro */
                    transition: all 0.3s ease; /* Animación suave para los cambios */
                    transform-origin: top left; /* El punto desde donde se originan las transformaciones */
                }
                
                /* Efectos cuando el usuario pasa el mouse por encima */
                .text-card:hover {
                    transform: scale(1.05) rotate(2deg); /* Se agranda un poquito y rota ligeramente */
                    box-shadow: 0 8px 16px rgba(0,0,0,0.2); /* Sombra más pronunciada */
                    background-color: #f8f8f8; /* Fondo ligeramente gris */
                }
                
                /* Estilos para pantallas pequeñas (móviles) */
                @media (max-width: 768px) {
                    :host {
                        /* En móvil, todas las tarjetas van en una sola columna */
                        grid-column: 1 !important;
                        grid-row: auto !important; /* Se acomodan automáticamente */
                    }
                }
            </style>
            
            <!-- El HTML real que se muestra en la pantalla -->
            <div class="text-card">
                ${text} <!-- Aquí se muestra el texto que pasamos como atributo -->
            </div>
        `;
    }
}

// Exportamos la clase para que pueda ser usada en otros archivos
export default TextCard;