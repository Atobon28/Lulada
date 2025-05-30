// Creamos una clase que extiende HTMLElement para crear un componente personalizado
export class ExploreContainer extends HTMLElement {
    constructor() {
        // Llamamos al constructor de la clase padre (HTMLElement)
        super();
        
        // Creamos un shadow DOM para aislar los estilos de este componente
        // Esto significa que los estilos aquí no afectarán el resto de la página
        this.attachShadow({ mode: 'open' });
        
        // Llamamos al método render para dibujar el contenido del componente
        this.render();
    }

    // Método que se encarga de crear y mostrar el contenido HTML del componente
    render() {
        // Si no existe el shadowRoot, no podemos dibujar nada, así que salimos
        if (!this.shadowRoot) return;

        // Insertamos el HTML y CSS del componente
        this.shadowRoot.innerHTML = `
            <style>
                /* Estilos para el componente host (el contenedor principal) */
                :host {
                    display: block;           /* Se muestra como un bloque */
                    width: 100%;             /* Ocupa todo el ancho disponible */
                    max-width: 1200px;       /* Pero no más de 1200px */
                    margin: 0 auto;          /* Se centra horizontalmente */
                    padding: 20px;           /* Espacio interno de 20px */
                    font-family: Arial, sans-serif;  /* Fuente de texto */
                    box-sizing: border-box;  /* Incluye padding en el ancho total */
                }
                
                /* Estilos para el componente images-explore dentro de este contenedor */
                images-explore {
                    width: 100%;             /* Ocupa todo el ancho del contenedor */
                }
            </style>
            
            <!-- Aquí colocamos el componente images-explore que mostrará las imágenes -->
            <images-explore></images-explore>
        `;
    }
}

// Exportamos la clase como la exportación por defecto del archivo
// Esto permite que otros archivos puedan importar este componente
export default ExploreContainer;