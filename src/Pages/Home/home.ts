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

                </style>
                
                <home-header></home-header>
                
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
                    <div class="nav-bar-abajo">
                        <ul>
                            <li><button class="location-button">Ubicación</button></li>
                            <li><button class="menu-button">Menú</button></li>
                            <li><button class="reviews-button">Reseñas</button></li>
                        </ul>
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
        const divAbajo = this.shadowRoot?.querySelector('.nav-bar-abajo') as HTMLDivElement;
        const sidebar = this.shadowRoot?.querySelector('.sidebar') as HTMLDivElement;
        console.log(mainLayout);
        if (suggestions && mainLayout && divAbajo){
            if (window.innerWidth < 900){
                console.log('oculto')
                suggestions.style.display = 'none';
                divAbajo.style.display = 'block';
                sidebar.style.display = 'none';
            }else{
                console.log('visible')
                suggestions.style.display = 'block';
                divAbajo.style.display = 'none';
            }
        }

    }
}

export default Home;