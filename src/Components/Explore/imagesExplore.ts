// Exportamos la clase para que pueda ser usada en otros archivos
export class ImagesExplore extends HTMLElement {
    constructor() {
        // Llamamos al constructor de la clase padre (HTMLElement)
        super();
        // Creamos un shadow DOM para aislar los estilos de este componente
        this.attachShadow({ mode: 'open' });
        // Llamamos a la función que dibuja el componente
        this.render();
    }

    // Esta función se ejecuta cuando el componente se añade al DOM de la página
    connectedCallback() {
        // Volvemos a dibujar el componente para asegurar que esté actualizado
        this.render();
    }

    // Esta función se encarga de crear todo el HTML y CSS del componente
    render() {
        // Si no hay shadowRoot disponible, salimos de la función
        if (!this.shadowRoot) return;

        // Creamos todo el HTML del componente con sus estilos CSS incluidos
        this.shadowRoot.innerHTML = `
            <style>
                /* Estilos para el componente principal */
                :host {
                    display: block;
                    width: 100%;
                }
                
                /* Contenedor principal que usa CSS Grid para organizar las tarjetas */
                .grid-container {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr); /* 3 columnas de igual tamaño */
                    grid-auto-rows: minmax(200px, auto); /* Filas con altura mínima de 200px */
                    gap: 15px; /* Espacio entre las tarjetas */
                    max-width: 1200px; /* Ancho máximo del contenedor */
                    margin: 0 auto; /* Centrar el contenedor */
                }
                
                /* Estilos base para todas las tarjetas */
                .card {
                    border-radius: 4px; /* Bordes redondeados */
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Sombra suave */
                    overflow: hidden; /* Ocultar contenido que se salga */
                    height: 100%; /* Ocupar toda la altura disponible */
                    transition: all 0.3s ease; /* Animación suave para cambios */
                    transform-origin: top left; /* Punto de origen para transformaciones */
                }
                
                /* Efecto cuando pasas el mouse sobre una tarjeta */
                .card:hover {
                    transform: scale(1.05) rotate(2deg); /* Agranda y rota ligeramente */
                    box-shadow: 0 8px 16px rgba(0,0,0,0.2); /* Sombra más pronunciada */
                    z-index: 10; /* Pone la tarjeta por encima de las demás */
                }
                
                /* Estilos para las imágenes dentro de las tarjetas */
                .image-card img {
                    width: 100%; /* Ocupa todo el ancho */
                    height: 100%; /* Ocupa toda la altura */
                    object-fit: cover; /* Ajusta la imagen sin deformarla */
                    display: block; /* Elimina espacios debajo de la imagen */
                    transition: all 0.3s ease; /* Animación suave */
                }
                
                /* Efecto hover para las imágenes */
                .image-card:hover img {
                    transform: scale(1.1); /* Agranda la imagen al pasar el mouse */
                }
                
                /* Estilos para las tarjetas de texto */
                .text-card {
                    background-color: #fff; /* Fondo blanco */
                    padding: 20px; /* Espacio interno */
                    display: flex; /* Usar flexbox */
                    align-items: center; /* Centrar verticalmente */
                    justify-content: center; /* Centrar horizontalmente */
                    text-align: center; /* Texto centrado */
                    font-size: 14px; /* Tamaño de fuente */
                    line-height: 1.5; /* Altura de línea para mejor lectura */
                }
                
                /* Posiciones específicas para cada tarjeta en el grid */
                .pos-1 {
                    grid-column: 1; /* Columna 1 */
                    grid-row: 1; /* Fila 1 */
                    height: 250px; /* Altura específica */
                }
                
                .pos-2 {
                    grid-column: 2; /* Columna 2 */
                    grid-row: 1; /* Fila 1 */
                    height: 250px;
                }
                
                .pos-3 {
                    grid-column: 3; /* Columna 3 */
                    grid-row: 1; /* Fila 1 */
                }
                
                .pos-4 {
                    grid-column: 1; /* Columna 1 */
                    grid-row: 2; /* Fila 2 */
                }
                
                .pos-5 {
                    grid-column: 2; /* Columna 2 */
                    grid-row: 2; /* Fila 2 */
                    height: 250px;
                }
                
                .pos-6 {
                    grid-column: 3; /* Columna 3 */
                    grid-row: 2; /* Fila 2 */
                    height: 250px;
                }
                
                .pos-7 {
                    grid-column: 1; /* Columna 1 */
                    grid-row: 3; /* Fila 3 */
                    height: 250px;
                }
                
                .pos-8 {
                    grid-column: 2; /* Columna 2 */
                    grid-row: 3; /* Fila 3 */
                }
                
                .pos-9 {
                    grid-column: 3; /* Columna 3 */
                    grid-row: 3; /* Fila 3 */
                    height: 250px;
                }
                
                /* Estilos para pantallas móviles (menores a 768px) */
                @media (max-width: 768px) {
                    .grid-container {
                        grid-template-columns: 1fr; /* Solo 1 columna en móvil */
                    }
                    
                    .card {
                        grid-column: 1 !important; /* Todas las tarjetas en columna 1 */
                        grid-row: auto !important; /* Filas automáticas */
                    }
                    
                    .image-card {
                        height: 200px !important; /* Altura fija para imágenes en móvil */
                    }
                }
            </style>
            
            <!-- Contenedor principal del grid -->
            <div class="grid-container">
                <!-- Tarjeta 1: Imagen en posición 1 -->
                <div class="card image-card pos-1">
                    <img src="https://picsum.photos/600/400?random=1" alt="La Terraza restaurant">
                </div>
                
                <!-- Tarjeta 2: Imagen en posición 2 -->
                <div class="card image-card pos-2">
                    <img src="https://picsum.photos/600/400?random=2" alt="Café y pan">
                </div>
                
                <!-- Tarjeta 3: Texto en posición 3 -->
                <div class="card text-card pos-3">
                    El coctel de hierva buena en @BarBurguer está super delicioso para los amantes como yo de los sabores frescos, costo 20.000 y lo recomiendo 100%.
                </div>
                
                <!-- Tarjeta 4: Texto en posición 4 -->
                <div class="card text-card pos-4">
                    El rollo "Fuego Dragon" de @SushiLab tiene un picante sabroso, no invasivo. 42.000, pero vale cada peso. Top recomendado
                </div>
                
                <!-- Tarjeta 5: Imagen en posición 5 -->
                <div class="card image-card pos-5">
                    <img src="https://picsum.photos/600/400?random=3" alt="Colorful cocktail">
                </div>
                
                <!-- Tarjeta 6: Imagen en posición 6 -->
                <div class="card image-card pos-6">
                    <img src="https://picsum.photos/600/400?random=4" alt="Classic cocktail">
                </div>
                
                <!-- Tarjeta 7: Imagen en posición 7 -->
                <div class="card image-card pos-7">
                    <img src="https://picsum.photos/600/400?random=5" alt="Seafood dish">
                </div>
                
                <!-- Tarjeta 8: Texto en posición 8 -->
                <div class="card text-card pos-8">
                    El brunch en @MoraCafé me pareció muy completo. Café refill, huevos al gusto y pan artesanal por 35.000. Súper plan de domingo.
                </div>
                
                <!-- Tarjeta 9: Imagen en posición 9 -->
                <div class="card image-card pos-9">
                    <img src="https://picsum.photos/600/400?random=6" alt="Bookstore">
                </div>
            </div>
        `;
        
        // Llamamos a una función para actualizar las imágenes (actualmente vacía)
        this.updateActualImages();
    }
    
    // Función para actualizar las imágenes (está vacía pero puede ser usada en el futuro)
    updateActualImages() {
        // Esta función está preparada para futuras actualizaciones de imágenes
    }
}

// Exportamos la clase como default para que pueda ser importada fácilmente
export default ImagesExplore;