class HeaderCompleto extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        

        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
             <div class="lulada-header">
                        <lulada-header></lulada-header>
                    </div>
                    
                <div class="lulada-responsive-header">
                        <lulada-responsive-header></lulada-responsive-header>
                    </div>
                    
           
            `;
            

        }
        
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
        const Header = this.shadowRoot?.querySelector('.lulada-header') as HTMLDivElement;
        const Headerresponsive = this.shadowRoot?.querySelector ('.lulada-responsive-header') as HTMLDivElement;
        
        if (Header && Headerresponsive ) {
            if (window.innerWidth < 900){ // Cuando la pantalla es pequeña
                Header.style.display = 'none'; // Oculta el header normal
                Headerresponsive.style.display = 'block'; // Muestra el header responsive
            }else{
                Header.style.display = 'block'; // Muestra el header normal
                Headerresponsive.style.display = 'none'; // Oculta el header responsive
            }
        }
    }

   

}

export default HeaderCompleto;