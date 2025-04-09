import './publications';
import './reviews';
import getUsers from "../../../Services/UserServices";

type User = {
    foto: string;
    nombreDeUsuario: string;
    nombre: string;
    descripcion: string;
    locationText: string;
    MenuLink: string;
    rol: string;
    location: string;
    text: string;
    stars: number;
    hasImage: boolean;
    restaurant: string;
}


export class ReviewsContainer extends HTMLElement {
    protected users: User[] = [];
    locationFilter: string | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    static get observedAttributes() {
        return ['location-filter'];
    }

    async connectedCallback() {
        this.users = await getUsers();
        this.render();
    }

    protected FiltroUser() {
        return this.users.filter(user => user.location === "sur" || user.location === "norte" || user.location === "centro");
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
            ? this.users.filter(User => User.location === this.locationFilter)
            : this.users;
        const filteredUsers = this.FiltroUser();
            
        filteredUsers.forEach(User => {
            reviewsHTML += `
                <lulada-publication 
                    username="${User.nombreDeUsuario}" 
                    text="${User.text}" 
                    stars="${User.stars}"
                    ${User.hasImage ? 'has-image="true"' : ''}
                ></lulada-publication>
            `;
        });

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 650px;
                    margin: 0 auto;
                    padding: 16px;
                    background-color:rgb(255, 255, 255);
                }

                lulada-publication {
                    display: block;
                    width: 100%;
                    margin-bottom: 20px;
                }

                .no-reviews {
                    text-align: center;
                    padding: 24px;
                    color: black;
                    font-style: italic;
                    background-color: white;
                    border-radius: 20px;
                    box-shadow: 0 30px 30px rgba(0, 0, 0, 0.1);
                    font-size: 16px;
                }
            </style>
            
            ${filteredReviews.length > 0 ? reviewsHTML : '<div class="no-reviews">No hay reseñas para mostrar</div>'}
        `;
    }
}

export default ReviewsContainer;
