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
                </style>
<<<<<<<< HEAD:src/Pages/Notifications/Notifications.ts

                <div>
                    <img>
                </div>
========
                
                <home-header></home-header>
>>>>>>>> bdd2d3ba70c63466b609def64a669f1223bb39d9:src/Pages/Home/home.ts
                
                <div class="main-layout">
                    <div class="sidebar">
                        <lulada-sidebar></lulada-sidebar>
                    </div>
                    
                    <div class="content">
<<<<<<<< HEAD:src/Pages/Notifications/Notifications.ts
                        <div class="content-area">
                            <div class="reviews-section">
                                <div class="reviews-content">
                                    <h2>Notificaciones</h2>
                                    <card-notifications></card-notifications>
                                </div>
                            </div>
========
                        <div class="reviews-section">
                            <lulada-reviews-container></lulada-reviews-container>
                        </div>
                        <div class="suggestions-section">
                            <lulada-suggestions></lulada-suggestions>
>>>>>>>> bdd2d3ba70c63466b609def64a669f1223bb39d9:src/Pages/Home/home.ts
                        </div>
                    </div>
                </div>
            `;

<<<<<<<< HEAD:src/Pages/Notifications/Notifications.ts
========
            this.shadowRoot.addEventListener('location-select', (e: Event) => {
                const event = e as CustomEvent;
                console.log("Se seleccionó ubicación: " + event.detail);
            });

>>>>>>>> bdd2d3ba70c63466b609def64a669f1223bb39d9:src/Pages/Home/home.ts
            this.shadowRoot.addEventListener('menuselect', (e: Event) => {
                const event = e as CustomEvent;
                console.log("Se seleccionó menú: " + event.detail.menuItem);
            });
        }
    }
}

<<<<<<<< HEAD:src/Pages/Notifications/Notifications.ts
export default LuladaNotifications;
========
export default Home;
>>>>>>>> bdd2d3ba70c63466b609def64a669f1223bb39d9:src/Pages/Home/home.ts
