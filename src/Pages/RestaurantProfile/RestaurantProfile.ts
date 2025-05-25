class RestaurantProfile extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.innerHTML = /*html */ `
            <style>
            :host {
                display: block;
                font-family: 'Inter', sans-serif;
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

            .main-layout {
                display: flex;
                margin-top: 10px;
                min-height: calc(100vh - 100px);
            }
            
            .sidebar {
                width: 250px;
                flex-shrink: 0;
            }

            .medium-content {
                flex-grow: 1;
                display: flex; 
                flex-direction: column;
                min-width: 0;
            }

            .user-profile {
                width: 100%;
            }

            .content {
                flex-grow: 1;
                display: flex; 
                padding: 20px;
                gap: 20px;
            }
            
            .reviews-section {
                margin-left: 5.9rem;
                margin-right: 5.9rem;
                background-color: white;
                flex-grow: 1;
                min-width: 0;
            }
            
            .suggestions-section {
                width: 250px; 
                padding: 20px 10px;
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
                .header-wrapper {
                    padding: 15px 0 8px 15px;
                }
                
                .logo-container {
                    width: 250px;
                }
                
                .reviews-section {
                    margin-left: 2rem;
                    margin-right: 2rem;
                }
                
                .content {
                    padding: 15px;
                    gap: 15px;
                }
                
                .suggestions-section {
                    width: 200px;
                    padding: 15px 8px;
                }
            }

            @media (max-width: 768px) {
                .header-wrapper {
                    padding: 10px 0 5px 10px;
                }
                
                .logo-container {
                    width: 200px;
                }
                
                .main-layout {
                    flex-direction: column;
                    margin-top: 5px;
                    margin-bottom: 80px;
                }
                
                .sidebar {
                    display: none;
                }
                
                .medium-content {
                    order: 1;
                    width: 100%;
                }
                
                .content {
                    flex-direction: column;
                    padding: 10px;
                    gap: 10px;
                }
                
                .reviews-section {
                    margin-left: 1rem;
                    margin-right: 1rem;
                }
                
                .suggestions-section {
                    display: none;
                }

                .lulada-responsive-bar {
                    display: block;
                }
            }

            @media (max-width: 480px) {
                .header-wrapper {
                    padding: 8px 0 5px 8px;
                }
                
                .logo-container {
                    width: 180px;
                }
                
                .content {
                    padding: 8px;
                }
                
                .reviews-section {
                    margin-left: 0.5rem;
                    margin-right: 0.5rem;
                }
                
                .suggestions-section {
                    padding: 10px;
                }
                
                .no-content {
                    padding: 20px;
                    margin-top: 10px;
                }
                
                .main-layout {
                    margin-bottom: 70px;
                }
                
                .lulada-responsive-bar {
                    height: 60px;
                }
            }

            @media (max-width: 768px) and (orientation: landscape) {
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
                <div class="medium-content">
                    <div class="user-profile">
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

               <div class="lulada-responsive-bar">
                   <lulada-responsive-bar></lulada-responsive-bar>
               </div>
        `;
        
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
        const navBar = this.shadowRoot?.querySelector('.lulada-responsive-bar') as HTMLDivElement;
        const sidebar = this.shadowRoot?.querySelector('.sidebar') as HTMLDivElement;
        
        if (suggestions && navBar && sidebar) {
            if (window.innerWidth < 768) {
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

export default RestaurantProfile;