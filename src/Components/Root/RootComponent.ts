class RootComponent extends HTMLElement {
    seccionActual: string; 

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.seccionActual = 'main';
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML= `
                <lulada-notifications></lulada-notifications>  
            `;
        }
    }
}

export default RootComponent;