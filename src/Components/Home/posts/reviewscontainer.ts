import './publications';
import './reviews';

export class ReviewsContainer extends HTMLElement {
    reviews: {
        username: string;
        text: string;
        stars: number;
        restaurant: string;
        location: string;
        hasImage?: boolean;
    }[] = [
        {
            username: "CrisTiJauregui",
            text: "El coctel de hierva buena en @BarBurguer esta super delicioso para los amantes como yo de los sabores frescos, costo 20.000 y lo recomiendo 100%",
            stars: 5,
            restaurant: "BarBurguer",
            location: "centro"
        },
        {
            username: "DanaBanana",
            text: "Este @AsianRooftop es terrible! No le quito todas las estrellas porque la mesera era super atenta, el problema es que una margarita y el licor me dijeron que venia aparte, como es posible???? De nunca volver.",
            stars: 1,
            hasImage: true,
            restaurant: "AsianRooftop",
            location: "norte"
        },
        {
            username: "FoodLover",
            text: "La pasta en @Frenchrico es increíble! Los mejores sabores italianos que he probado en mucho tiempo.",
            stars: 4,
            restaurant: "Frenchrico",
            location: "sur"
        }
    ];

    locationFilter: string | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    static get observedAttributes() {
        return ['location-filter'];
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (name === 'location-filter' && oldValue !== newValue) {
            this.locationFilter = newValue;
            this.render();
        }
    }

    render() {
        if (!this.shadowRoot) return;

        let reviewsHTML = '';
        
        const filteredReviews = this.locationFilter 
            ? this.reviews.filter(review => review.location === this.locationFilter)
            : this.reviews;
            
        filteredReviews.forEach(review => {
            reviewsHTML += `
                <lulada-publication 
                    username="${review.username}" 
                    text="${review.text}" 
                    stars="${review.stars}"
                    ${review.hasImage ? 'has-image="true"' : ''}
                ></lulada-publication>
            `;
        });

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 600px;
                }
                .no-reviews {
                    text-align: center;
                    padding: 20px;
                    color: #666;
                    font-style: italic;
                }
            </style>
            
            ${filteredReviews.length > 0 ? reviewsHTML : '<div class="no-reviews">No hay reseñas para mostrar</div>'}
        `;
    }
}

customElements.define('lulada-reviews-container', ReviewsContainer);