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
                    padding: 10px;
                    background-color: #AAAB54;
                    border: none;
                    color: white;
                    border-radius: 10px;
                    font-size: 16px;
                    cursor: pointer;
                    text-align: center;
                }
                
                .boton:hover {
                    background-color: #999A45;
                }
                </style>
                <button class="boton">Iniciar sesión</button>
            `;
            
            const button = this.shadowRoot.querySelector(".boton");
            if (button) {
                button.addEventListener("click", () => {
                    window.location.href = "home.html";
                });
            }
        } else {
            console.error('shadowRoot is null');
        }
    }
}

export default BotonLogin;

