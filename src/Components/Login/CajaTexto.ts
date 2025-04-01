class CajaDeTexto extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                .input-container {
                    position: relative;
                    display: inline-block;
                }
                
                input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    color: #aaa;
                    font-size: 16px;
                }
                
                </style>
                <div class="input-container">
                    <input type="text" value="Nombre de usuario o Correo electrónico">
                </div>
            `;

            const input = this.shadowRoot.querySelector("input");
            if (input) {
                input.addEventListener("focus", () => {
                    if (input.value === "Nombre de usuario o Correo electrónico") {
                        input.value = "";
                        input.style.color = "#000";
                    }
                });
                
                input.addEventListener("blur", () => {
                    if (input.value === "") {
                        input.value = "Nombre de usuario o Correo electrónico";
                        input.style.color = "#aaa";
                    }
                });
            }
        } else {
            console.error('shadowRoot is null');
        }
    }
}


export default CajaDeTexto;
