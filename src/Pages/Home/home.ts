
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
                        padding: 10px 0;
                        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
                    }

                    .lulada-responsive-bar {
                        display: none;
                        position: fixed;
                        bottom: 0;
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
        //estamos vinculando el bind al resizeHandler este asegura que el componente se mantenga en su forma original  
        this.resizeHandler = this.resizeHandler.bind(this);
        this.resizeHandler(); //llamamos al metodo resizeHandler para que se ejecute una vez al cargar el componente

    }//metodo de ciclo de vida que se ejecuta cuando se conecta el dom
    connectedCallback() {
        //llamamos un evento rize que llama el metodo rizehandler que cada vez que se cambie el tamaño de la pantalla
        window.addEventListener('resize', this.resizeHandler);
    }//es lo contratri que se desconecta de dom de componente
    disconnectedCallback(){
        //estoy eliminando el evento para que no hayan fugas
        window.removeEventListener('resize', this.resizeHandler);
    }//es un metodo que se relizara cada vez que que se redimensione la ventana
    resizeHandler() {
        const suggestions = this.shadowRoot?.querySelector('.suggestions-section') as HTMLDivElement;
        const mainLayout = this.shadowRoot?.querySelector ('.main-layout') as HTMLDivElement;
        const navBar = this.shadowRoot?.querySelector('.lulada-responsive-bar') as HTMLDivElement;
        const sidebar = this.shadowRoot?.querySelector('.sidebar') as HTMLDivElement;
        if (suggestions && mainLayout && navBar && sidebar) {
            if (window.innerWidth < 900){ // Cuando la pantalla es pequeña
                sidebar.style.display = 'none'; // Ocultamos la barra lateral
                suggestions.style.display = 'none'; // Ocultamos las sugerencias
                navBar.style.display = 'block'; // Mostramos la barra de navegación

            }else{
                suggestions.style.display = 'block';
                navBar.style.display = 'none';
                sidebar.style.display = 'block';
            }
        }

    }
}
export default Home;