export class Home extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    :host {
                        display: block;
                        font-family: 'Inter', sans-serif;
                    }
                    
                    .main-layout {
                        display: flex;
                        margin-top: 10px;
                        min-height: calc(100vh - 100px);
                    }
                    
                    .sidebar {
                        width: 250px;
                        flex-shrink: 0;
                    }
                    
                    .content {
                        flex-grow: 1;
                        display: flex;
                        gap: 20px;
                        padding: 20px;
                        min-width: 0;
                    }
                    
                    .reviews-section {
                        background-color: white;
                        flex-grow: 1;
                        min-width: 0;
                    }
                    
                    .suggestions-section {
                        width: 250px;
                        flex-shrink: 0;
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

                    .lulada-responsive-bar {
                        display: none;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        width: 100%;
                        height: 70px;
                        z-index: 1000;
                        background-color: white;
                        border-top: 1px solid #eaeaea;
                        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
                    }

                    @media (max-width: 1024px) {
                        .content {
                            padding: 15px;
                            gap: 15px;
                        }
                        
                        .suggestions-section {
                            width: 200px;
                        }
                    }

                    @media (max-width: 900px) {
                        .main-layout {
                            flex-direction: column;
                            margin-top: 5px;
                            margin-bottom: 80px; 
                        }
                        
                        .sidebar {
                            display: none !important; 
                        }
                        
                        .content {
                            flex-direction: column;
                            padding: 10px;
                            gap: 10px;
                        }
                        
                        .suggestions-section {
                            display: none !important; 
                        }
                        
                        .lulada-responsive-bar {
                            display: block !important;                         }
                    }

                    @media (max-width: 480px) {
                        .content {
                            padding: 8px;
                        }
                        
                        .main-layout {
                            margin-bottom: 70px;
                        }
                        
                        .lulada-responsive-bar {
                            height: 60px;
                        }
                    }

                    @media (max-width: 900px) and (orientation: landscape) {
                        .main-layout {
                            margin-bottom: 60px;
                        }
                        
                        .lulada-responsive-bar {
                            height: 50px;
                        }
                    }

                </style>
                
                <lulada-header-complete></lulada-header-complete>
                
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
                
                <div class="lulada-responsive-bar">
                    <lulada-responsive-bar></lulada-responsive-bar>
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
        
        this.resizeHandler = this.resizeHandler.bind(this);
        this.resizeHandler(); 
    }
    
    connectedCallback() {
        window.addEventListener('resize', this.resizeHandler);
    }
    
    disconnectedCallback(){
        window.removeEventListener('resize', this.resizeHandler);
    }
    
    resizeHandler() {
        const suggestions = this.shadowRoot?.querySelector('.suggestions-section') as HTMLDivElement;
        const mainLayout = this.shadowRoot?.querySelector('.main-layout') as HTMLDivElement;
        const navBar = this.shadowRoot?.querySelector('.lulada-responsive-bar') as HTMLDivElement;
        const sidebar = this.shadowRoot?.querySelector('.sidebar') as HTMLDivElement;
        
        if (suggestions && mainLayout && navBar && sidebar) {
            if (window.innerWidth < 900) { 
                sidebar.style.display = 'none'; 
                suggestions.style.display = 'none'; 
                navBar.style.display = 'block'; 
            } else {
                suggestions.style.display = 'block';
                navBar.style.display = 'none';
                sidebar.style.display = 'block';
            }
        }
    }
}

export default Home;