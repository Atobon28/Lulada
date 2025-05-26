// REEMPLAZAR TODO EL CONTENIDO CON:
class CajaDeTexto extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    .input-container {
                        margin-bottom: 15px;
                        width: 100%;
                    }
                    
                    input {
                        width: 100%;
                        padding: 12px 15px; 
                        border: 1px solid #CCCCCC;
                        border-radius: 6px;
                        font-size: 16px; 
                        height: auto;
                        box-sizing: border-box;
                        background-color: #f9f9f9;
                        color: #333;
                    }
                    
                    input:focus {
                        outline: none;
                        border-color: #AAAB54;
                        background-color: white;
                    }

                    input::placeholder {
                        color: #999;
                        font-size: 14px;
                    }

                    @media (max-width: 768px) {
                        input {
                            padding: 14px 16px;
                            font-size: 16px;
                            border-radius: 8px;
                        }
                    }

                    @media (max-width: 480px) {
                        input {
                            padding: 12px 14px;
                            font-size: 15px;
                        }
                    }
                </style>
                
                <div class="input-container">
                    <input type="text" placeholder="Nombre de usuario o Correo electrónico">
                </div>
                
                <div class="input-container">
                    <input type="password" placeholder="Contraseña">
                </div>
            `;
        }
    }
}

export default CajaDeTexto;