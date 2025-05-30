// Este es un componente web personalizado que muestra reseñas de usuarios
export class Review extends HTMLElement {
    constructor() {
        super(); // Llama al constructor de la clase padre HTMLElement
        // Crea un Shadow DOM en modo 'open' para aislar los estilos de este componente
        this.attachShadow({ mode: 'open' });
    }
 
    // Este método se ejecuta automáticamente cuando el componente se añade al DOM de la página
    connectedCallback() {
        // Obtiene los atributos del elemento HTML y les asigna valores por defecto si no existen
        const username = this.getAttribute('username') || ''; // Nombre del usuario que escribió la reseña
        const text = this.getAttribute('text') || ''; // Texto de la reseña
        const stars = parseInt(this.getAttribute('stars') || '0'); // Número de estrellas (calificación)
 
        // Si el Shadow DOM se creó correctamente, procede a construir el HTML
        if (this.shadowRoot) {
            // Define todo el HTML y CSS del componente como una cadena de texto
            this.shadowRoot.innerHTML = `
                <style>
                    /* Estilos para el componente host (el elemento principal) */
                    :host {
                        display: block; /* Se comporta como un elemento de bloque */
                        margin-bottom: 20px; /* Espacio debajo de cada reseña */
                    }
                    
                    /* Estilos para el contenedor principal de la reseña */
                    .review {
                        background-color: white; /* Fondo blanco */
                        border-radius: 20px; /* Bordes redondeados */
                        padding: 20px; /* Espacio interno */
                        box-shadow: 0 10px 20px rgba(0,0,0,0.1); /* Sombra suave */
                    }
                    
                    /* Estilos para la parte superior de la reseña (nombre de usuario y estrellas) */
                    .review-header {
                        display: flex; /* Elementos en fila */
                        justify-content: space-between; /* Separa elementos a los extremos */
                        align-items: center; /* Centra verticalmente */
                        margin-bottom: 12px; /* Espacio debajo del header */
                    }
                    
                    /* Estilos para las estrellas de calificación */
                    .stars {
                        color: #FFD700; /* Color dorado */
                        font-size: 24px; /* Tamaño grande */
                        letter-spacing: 2px; /* Espaciado entre caracteres */
                    }
                    
                    /* Estilos para el nombre de usuario */
                    .username {
                        font-weight: bold; /* Texto en negrita */
                        font-size: 16px; /* Tamaño de fuente */
                        color: #333; /* Color gris oscuro */
                    }
                    
                    /* Estilos para el texto de la reseña */
                    .review-text {
                        font-size: 16px; /* Tamaño de fuente */
                        line-height: 1.5; /* Altura de línea para mejor lectura */
                        color: #333; /* Color gris oscuro */
                    }
                </style>
                
                <!-- HTML de la estructura de la reseña -->
                <div class="review">
                    <!-- Encabezado con nombre de usuario y estrellas -->
                    <div class="review-header">
                        <!-- Muestra el nombre de usuario con @ al principio -->
                        <div class="username">@${username}</div>
                        <!-- Muestra las estrellas: ★ para estrellas llenas, ☆ para estrellas vacías -->
                        <div class="stars">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</div>
                    </div>
                    <!-- Texto principal de la reseña -->
                    <p class="review-text">${text}</p>
                </div>
            `;
        }
    }
 }
 
 // Exporta la clase para que pueda ser usada en otros archivos
 export default Review;