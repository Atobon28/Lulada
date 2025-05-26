// REEMPLAZAR TODO EL CONTENIDO CON:
class BotonLogin extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                .boton {
                    display: block;
                    width: 100%;
                    padding: 14px 12px;
                    background-color: #AAAB54;
                    border: none;
                    color: white;
                    border-radius: 10px;
                    font-size: 16px;
                    cursor: pointer;
                    text-align: center;
                    font-weight: bold;
                    box-sizing: border-box;
                    transition: background-color 0.3s ease;
                }
                
                .boton:hover {
                    background-color: rgb(132, 134, 58);
                }

                @media (max-width: 768px) {
                    .boton {
                        padding: 16px 12px;
                        font-size: 16px;
                        border-radius: 8px;
                    }
                }

                @media (max-width: 480px) {
                    .boton {
                        padding: 14px 10px;
                        font-size: 15px;
                    }
                }
                </style>
                <button class="boton">Iniciar sesión</button>
            `;
            
            const button = this.shadowRoot.querySelector(".boton");
            if (button) {
                button.addEventListener("click", () => {
                    window.location.href = "/home"; 
                });
            }
        }
    }
}

export default BotonLogin;