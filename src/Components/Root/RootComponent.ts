class RootComponent extends HTMLElement {
    seccionActual: string; 

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.seccionActual = 'main';
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML= `
  <lulada-cambiar-nombre></lulada-cambiar-nombre>
            `;
        }
    }
       
    // Cuando se presione una de las opciones dentro de sideBar, se cambia la sección actual
    changePage(section: string) { // perfil, confguracion, antojar, ...
        this.seccionActual = section;
        const mainContainer = this.shadowRoot?.querySelector('.main-container');
        if (!mainContainer) return;


        if (section === 'profile') {
            mainContainer.innerHTML = `<h1>Mi perfil</h1>`;
        } else if (section === 'settings') {
            mainContainer.innerHTML = `<h1>Configuración</h1>`;
        } else {
            mainContainer.innerHTML = `<h1>Error</h1>`;
        }
    }
}

export default RootComponent;

//<lulada-home></lulada-home>