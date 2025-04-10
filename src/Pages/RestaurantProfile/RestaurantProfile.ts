
class RestaurantProfile extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({ mode: 'open' });
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
                                username="CrisTiJauregui" 
                                text="El coctel de hierva buena en @BarBurguer esta super delicioso para los amantes como yo de los sabores frescos, costo 20.000 y lo recomiendo 100%" 
                                stars="5"
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

export default RestaurantProfile;