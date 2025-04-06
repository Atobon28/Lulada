import "../../Components/Nofications/Header/Headernotification";
import "../../Components/Nofications/Navbar/sidebarnotification";
import "../../Components/Nofications/posts/CardNotifications";

class LuladaNotifications extends HTMLElement {
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
                    }
                    .sidebar {
                        width: 250px;
                    }
                    .content {
                        flex-grow: 1;
                        display: flex;
                        flex-direction: column;
                    }
                    .content-area {
                        display: flex;
                    }
                    .reviews-section {
                        flex-grow: 1;
                        padding: 20px;
                        background-color: #f4f4f4;
                        display: flex;
                        justify-content: center;
                    }
                    .reviews-content {
                        width: 100%;
                        max-width: 600px;
                    }
                </style>

                <div>
                    <img>
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
                                    <card-notifications></card-notifications>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            this.shadowRoot.addEventListener('menuselect', (e: Event) => {
                const event = e as CustomEvent;
                console.log(`Selected menu: ${event.detail.menuItem}`);
            });
        }
    }
}

export default LuladaNotifications;