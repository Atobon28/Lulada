export class LuladaNotifications extends HTMLElement {
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
            .content {
                flex-grow: 1;
                display: flex; 
            }
            .content-area {
                display: flex;
                flex-grow: 1;
            }
            .reviews-section {
                padding: 0px;
                background-color: white;
                flex-grow: 1; 
                min-width: 0
            }
            .reviews-content h2 {
                margin-top: 0;
            }
            .suggestions-section {
                width: 180px; 
                padding: 0px 0px;
            }
            .no-content {
                padding: 20px;
                text-align: center;
                color: #666;
                font-style: italic;
                background-color: #f9f9f9;
                border-radius: 8px;
                margin-top: 10px;
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
                    
                    <div class="content">

                        <div class="content-area">
                            <div class="reviews-section">
                                <div class="reviews-content">
                                    <h2>Notificaciones</h2>
                                    <lulada-card-notifications></lulada-card-notifications>
                                </div>
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


export default LuladaNotifications;