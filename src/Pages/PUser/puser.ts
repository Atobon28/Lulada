class PUser extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });


        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
            <style>
            :host {
                display: block;
                font-family: Arial, sans-serif;
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
            .no-content {
                padding: 40px;
                text-align: center;
                color: #666;
                font-style: italic;
                background-color: #f9f9f9;
                border-radius: 8px;
                margin-top: 20px;
            }
            </style>
               <home-header></home-header>
                
               <div class="main-layout">
                   <div class="sidebar">
                       <lulada-sidebar></lulada-sidebar>
                   </div>
                    <div class="medium-content">
                        <div class ="user-profile">
                            <user-profile></user-profile>
                        </div>
                        <div class="content">
                            <div class="reviews-section">
                                <lulada-reviews-container></lulada-reviews-container>
                            </div>
                        </div>
                    </div>
                       <div class="suggestions-section">
                           <lulada-suggestions></lulada-suggestions>
                       </div>
                   </div>
               </div>
            `
        }
    }
}

export default PUser;