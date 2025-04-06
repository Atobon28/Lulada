class RootComponent extends HTMLElement {
    seccionActual: string; 

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
<<<<<<< HEAD
        this.seccionActual = 'main';
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML= `
                <lulada-notifications></lulada-notifications>  
            `;
        }
    }
=======
        this.seccionActual = 'profile';
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML= `
                <lulada-home></lulada-home>
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
>>>>>>> bdd2d3ba70c63466b609def64a669f1223bb39d9
}

export default RootComponent;