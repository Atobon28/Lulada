class Save extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.innerHTML = /*html */ `
            <style>
            :host {
                display: block;
                font-family: 'inter', sans-serif;
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
                    padding: 15px 0 8px 15px;
                }
                
                .logo-container {
                    width: 250px;
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
                    padding: 10px 0 5px 10px;
                }
                
                .logo-container {
                    width: 200px;
                }
                
                .content {
                    padding: 8px;
                }
                
                .reviews-section {
                    margin-left: 0.5rem;
                    margin-right: 0.5rem;
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
                    <div class="content">
                    <div class="reviews-section">
                        <lulada-publication 
                        bookmarked
                        username="DanaBanana"
                        text="Este @AsianRooftop es terrible! No le quito todas las estrellas porque la mesera era super atenta, el problema es que la cocina, terrible, pedi una margarita y era sin licor me dijeron que venia aparte, como es posible???? De nunca volver."
                        stars="1"
                        hasImage="true"
                        restaurant="AsianRooftop"
                        location="norte"
                        ></lulada-publication>
                        <lulada-publication
                        bookmarked
                        username="FoodLover"
                        text="La pasta en @Frenchrico es increíble! Los mejores sabores italianos que he probado en mucho tiempo."
                        stars="4"
                        restaurant="Frenchrico"
                        location="sur"
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
                suggestions.style.display = 'block';
                navBar.style.display = 'none';
                sidebar.style.display = 'block';
            }
        }
    }
}

export default Save;