class RootComponent extends HTMLElement {
    seccionActual: string; 

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.seccionActual = 'main';
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML= `
<<<<<<< HEAD
                <register-new-account></register-new-account>              
=======
                 <lulada-notifications></lulada-notifications> 

>>>>>>> 7e689d8cd6bdc71482c0784ab0432cdc005f19f3
            `;
        }
    }
}

export default RootComponent;