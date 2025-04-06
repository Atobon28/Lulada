class CajaDeTexto extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                .input-container {
                    width: 100%;
                    margin-bottom: 10px;
                }
                
                input {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 16px;
                    color: #333;
                    outline: none;
                }
                

    
                </style>
                <div class="input-container">
                    <input type="text" placeholder="Nombre de usuario o Correo electrónico">
                    <div class="input-container">
                    <input type="password" placeholder="Contraseña">
                </div>
                </div>
            `;
        } else {
            console.error('shadowRoot is null');
        }
    }
}

customElements.define('caja-de-texto', CajaDeTexto);
export default CajaDeTexto;
