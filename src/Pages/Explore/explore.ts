export class Explore extends HTMLElement {
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
                        padding: 0 20px;
                    }
                    .explore-header {
                        margin-bottom: 20px;
                    }
                    @media (max-width: 768px) {
                        .main-layout {
                            flex-direction: column;
                        }
                        .sidebar, .content {
                            width: 100%;
                        }
                    }
                </style>
                
                <header-explorer class="explore-header"></header-explorer>
                
                <div class="main-layout">
                    <div class="sidebar">
                        <lulada-sidebar></lulada-sidebar>
                    </div>
                    
                    <div class="content">
                        <explore-container></explore-container>
                    </div>
                </div>
            `;

            this.addEventListeners();
        }
    }

    addEventListeners() {
        if (this.shadowRoot) {
            const headerExplorer = this.shadowRoot.querySelector('header-explorer');
            
            headerExplorer?.addEventListener('search-submit', (e: Event) => {
                const searchEvent = e as CustomEvent<string>;
                console.log("Search submitted:", searchEvent.detail);
                // TODO: Implement search functionality
            });
        }
    }
}

export default Explore;