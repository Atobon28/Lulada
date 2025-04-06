export class Home extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        font-family: Arial, sans-serif;
                    }
                    .main-layout {
                        display: flex;
                    }
                    .sidebar {
                        width: 250px;
                    }
                    .content {
                        flex-grow: 1;
                        display: flex; 
                    }
                    .reviews-section {
                        padding: 20px;
                        background-color: white;
                        flex-grow: 1; 
                    }
                    .suggestions-section {
                        width: 250px; 
                        padding: 20px 10px;
                    }
                </style>
                
                <lulada-header></lulada-header>
                
                <div class="main-layout">
                    <div class="sidebar">
                        <lulada-sidebar></lulada-sidebar>
                    </div>
                    
                    <div class="content">
                        <div class="reviews-section">
                            <lulada-reviews-container></lulada-reviews-container>
                        </div>
                        <div class="suggestions-section">
                            <lulada-suggestions></lulada-suggestions>
                        </div>
                    </div>
                </div>
            `;

            this.shadowRoot.addEventListener('location-select', (e: Event) => {
                const event = e as CustomEvent;
                console.log("Se seleccionó ubicación: " + event.detail);
                this.filterReviewsByLocation(event.detail);
            });

            this.shadowRoot.addEventListener('menuselect', (e: Event) => {
                const event = e as CustomEvent;
                console.log("Se seleccionó menú: " + event.detail.menuItem);
            });
        }
    }

    filterReviewsByLocation(location: string): void {
        if (!this.shadowRoot) return;
    
        const reviewsContainer = this.shadowRoot.querySelector('lulada-reviews-container');
        if (!reviewsContainer) return;
    
        reviewsContainer.innerHTML = '';
    
        if (location.toLowerCase() === 'cali') {
            const zonas = ['Norte', 'Sur', 'Este', 'Oeste', 'Centro'];
            const publicacionesPorZona: { [zona: string]: string[] } = {};
    
            zonas.forEach(zona => {
                const cantidad = Math.floor(Math.random() * 5); 
                publicacionesPorZona[zona] = cantidad > 0 
                    ? Array.from({ length: cantidad }, (_, i) => `Publicación ${i + 1} en ${zona}`)
                    : [];
            });
    
            reviewsContainer.innerHTML = zonas.map(zona => {
                const posts = publicacionesPorZona[zona];
                if (posts.length === 0) {
                    return `<div><h3>${zona}</h3><p>No hay publicaciones.</p></div>`;
                } else {
                    return `
                        <div>
                            <h3>${zona}</h3>
                            <ul>
                                ${posts.map(p => `<li>${p}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                }
            }).join('');
        } else {
            reviewsContainer.setAttribute('location-filter', location);
        }
    }
    
}

export default Home;