// Componente personalizado que actúa como contenedor principal
export class ExploreContainer extends HTMLElement {
    constructor() {
        super();
        // Crea Shadow DOM para aislar estilos del resto de la página
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    // Renderiza el contenido HTML y CSS del componente
    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                /* Estilos del contenedor principal */
                :host {
                    display: block;
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                    box-sizing: border-box;
                }
                
                /* Estilos para el componente de imágenes */
                images-explore {
                    width: 100%;
                }
            </style>
            
            <!-- Componente que renderiza la galería de imágenes -->
            <images-explore></images-explore>
        `;
    }
}

// Exportación por defecto del componente
export default ExploreContainer;
