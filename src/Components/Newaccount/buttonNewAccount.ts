export class ButtonNewAccount extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
            <style>
                .button {
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
                
                .button:hover {
                    background-color: #999A45;
                }
            </style>
            
            <button class="button">iniciar sesion</button>
            `;
 
            const button = this.shadowRoot.querySelector(".button");
            
            if (button) {
                button.addEventListener("click", () => {
                    window.location.href = "chhhcat.html";
                });
            }
        } else {
            console.error(`shadowRoot is null`);
        }
    }
}
 
export default ButtonNewAccount;