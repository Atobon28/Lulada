
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
                        margin-top: 10px;
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
                    .no-content {
                        padding: 40px;
                        text-align: center;
                        color: #666;
                        font-style: italic;
                        background-color: #f9f9f9;
                        border-radius: 8px;
                        margin-top: 20px;
                    }
                    .nav-bar-abajo {
                        display: none;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background-color: white;
                        padding: 10px ;
                        box-shadow;0 -2px 9px rgba(0, 0, 0, 0.1);
                        
                    }
    
                    .nav-bar-abajo-ul {
                       display:flex;
                       jusfify-content:space-around;
                       list-style: none;
                       margin:0
                       padding:0;
                    
                    }   
                    .nav-bar-abajo li {
                    text-align:center;
                    }
                    .nav-bar-abajo button {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        background: none;
                        border: none;
                        cursor: pointer;
                        color:#555;
                        font-size: 12px;
                        padding: 5px;
                        } 
                      
                    
                    


                </style>
                
                <lulada-header-home></lulada-header-home>
                
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
            });

            this.shadowRoot.addEventListener('menuselect', (e: Event) => {
                const event = e as CustomEvent;
                console.log("Se seleccionó menú: " + event.detail.menuItem);
            });
        }
        

    }
}
export default Home;