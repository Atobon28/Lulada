class Save extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot!.innerHTML = /*html */ `
            <style>
            :host {
                display: block;
                font-family: 'inter', sans-serif;
            }
            .main-layout {
                display: flex;
                margin-top: 10px;
            }
            .sidebar {
                width: 250px;
            }

            .medium-content {
                flex-grow: 1;
                display: flex; 
                flex-direction: column;
            }

            .content {
                flex-grow: 1;
                display: flex; 
                padding: 20px;
            }
             .reviews-section {
                margin-left: 5.9rem;
                margin-right: 5.9rem;
                background-color: white;
                flex-grow: 1; 
            }
            .suggestions-section {
                width: 250px; 
                padding: 20px 10px;
            }
            .no-content {
                padding: 40px;
                text-align: center;
                color: #666;
                font-style: italic;
                background-color: #f9f9f9;
                border-radius: 8px;
                margin-top: 20px;
            }

            .header-wrapper {
                width: 100%;
                background-color: white;
                padding: 20px 0 10px 20px;
                border-bottom: 1px solid #eaeaea;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                position: relative;
            }
                    
            .logo-container {
                width: 300px;
            }
            </style>
               <div class="header-wrapper">
                    <div class="logo-container">
                        <lulada-logo></lulada-logo>
                    </div>
                </div>

               <div class="main-layout">
                    <div class="sidebar">
                       <lulada-sidebar></lulada-sidebar>
                   </div>
                    <div class="medium-content">
                        <div class ="user-profile">
                            <restaurant-info></restaurant-info>
                        </div>
                        <div class="content">
                        <div class="reviews-section">
                            <lulada-publication 
                            bookmarked
                            username="DanaBanana",
                            text="Este @AsianRooftop es terrible! No le quito todas las estrellas porque la mesera era super atenta, el problema es que la cocina, terrible, pedi una margarita y era sin licor me dijeron que venia aparte, como es posible???? De nunca volver.",
                            stars=1,
                            hasImage=true,
                            restaurant="AsianRooftop",
                            location="norte"
                            ></lulada-publication>
                            <lulada-publication
                            bookmarked
                            username="FoodLover",
                            text="La pasta en @Frenchrico es increíble! Los mejores sabores italianos que he probado en mucho tiempo.",
                            stars=4,
                            restaurant="Frenchrico",
                            location="sur"
                            ></lulada-publication>
                        </div>
                        </div>
                    </div>
                       <div class="suggestions-section">
                        <lulada-suggestions></lulada-suggestions>
                       </div>
                   </div>
               </div>
        `;
    }
}

export default Save;
        
