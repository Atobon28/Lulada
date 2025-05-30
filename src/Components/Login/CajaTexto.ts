// Componente web personalizado para campos de texto de login
class CajaDeTexto extends HTMLElement {
    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    .input-container {
                        margin-bottom: 15px;
                    }
                    
                    input {
                        width: 100%;
                        padding: 8px 10px;
                        border: 1px solid #CCCCCC;
                        border-radius: 6px;
                        font-size: 14px;
                        height: 36px;
                        box-sizing: border-box;
                    }
                    
                    input:focus {
                        outline: none;
                        border-color: #AAAB54;
                    }
                </style>
                
                <div class="input-container">
                    <input type="text" placeholder="Nombre de usuario o Correo electrónico">
                </div>
                
                <div class="input-container">
                    <input type="password" placeholder="Contraseña">
                </div>
            `;
        } else {
            console.error('shadowRoot is null');
        }
    }
}

export default CajaDeTexto;