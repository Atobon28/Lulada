export class ImagesExplore extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                
                .grid-container {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-auto-rows: minmax(200px, auto);
                    gap: 15px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .card {
                    border-radius: 4px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    overflow: hidden;
                    height: 100%;
                    transition: all 0.3s ease;
                    transform-origin: top left;
                }
                
                .card:hover {
                    transform: scale(1.05) rotate(2deg);
                    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
                    z-index: 10;
                }
                
                .image-card img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    transition: all 0.3s ease;
                }
                
                .image-card:hover img {
                    transform: scale(1.1);
                }
                
                .text-card {
                    background-color: #fff;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    font-size: 14px;
                    line-height: 1.5;
                }
                
                .pos-1 {
                    grid-column: 1;
                    grid-row: 1;
                    height: 250px;
                }
                
                .pos-2 {
                    grid-column: 2;
                    grid-row: 1;
                    height: 250px;
                }
                
                .pos-3 {
                    grid-column: 3;
                    grid-row: 1;
                }
                
                .pos-4 {
                    grid-column: 1;
                    grid-row: 2;
                }
                
                .pos-5 {
                    grid-column: 2;
                    grid-row: 2;
                    height: 250px;
                }
                
                .pos-6 {
                    grid-column: 3;
                    grid-row: 2;
                    height: 250px;
                }
                
                .pos-7 {
                    grid-column: 1;
                    grid-row: 3;
                    height: 250px;
                }
                
                .pos-8 {
                    grid-column: 2;
                    grid-row: 3;
                }
                
                .pos-9 {
                    grid-column: 3;
                    grid-row: 3;
                    height: 250px;
                }
                
                @media (max-width: 768px) {
                    .grid-container {
                        grid-template-columns: 1fr;
                    }
                    
                    .card {
                        grid-column: 1 !important;
                        grid-row: auto !important;
                    }
                    
                    .image-card {
                        height: 200px !important;
                    }
                }
            </style>
            
            <div class="grid-container">
                <div class="card image-card pos-1">
                    <img src="https://picsum.photos/600/400?random=1" alt="La Terraza restaurant">
                </div>
                
                <div class="card image-card pos-2">
                    <img src="https://picsum.photos/600/400?random=2" alt="Café y pan">
                </div>
                
                <div class="card text-card pos-3">
                    El coctel de hierva buena en @BarBurguer está super delicioso para los amantes como yo de los sabores frescos, costo 20.000 y lo recomiendo 100%.
                </div>
                
                <div class="card text-card pos-4">
                    El rollo "Fuego Dragon" de @SushiLab tiene un picante sabroso, no invasivo. 42.000, pero vale cada peso. Top recomendado
                </div>
                
                <div class="card image-card pos-5">
                    <img src="https://picsum.photos/600/400?random=3" alt="Colorful cocktail">
                </div>
                
                <div class="card image-card pos-6">
                    <img src="https://picsum.photos/600/400?random=4" alt="Classic cocktail">
                </div>
                
                <div class="card image-card pos-7">
                    <img src="https://picsum.photos/600/400?random=5" alt="Seafood dish">
                </div>
                
                <div class="card text-card pos-8">
                    El brunch en @MoraCafé me pareció muy completo. Café refill, huevos al gusto y pan artesanal por 35.000. Súper plan de domingo.
                </div>
                
                <div class="card image-card pos-9">
                    <img src="https://picsum.photos/600/400?random=6" alt="Bookstore">
                </div>
            </div>
        `;
        
        this.updateActualImages();
    }
    
    updateActualImages() {
    }
}

export default ImagesExplore;