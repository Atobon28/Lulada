class UserEditButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
            <style>
            .userEditar {
                max-width: 100%;
                text-align: right;
                padding: 1rem;
            }

            .userEditar button {
                padding: 0.5rem 1rem;
                background-color: #AAAB54;
                border: none;
                color: white;
                border-radius: 0.5rem;
                cursor: pointer;
                font-size: 1rem;
                width: 5rem;
                height: 2.5rem;
                font-family: 'Inter', sans-serif;
            }

            .userEditar button:hover {
                background-color: #999A4A;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .userEditar button {
                    width: auto;
                    min-width: 4rem;
                    ont-size: 1rem;
                }
            }

            </style>
            <div class="userEditar">
                <button>Editar</button>
            </div>
            `;
        }
    }
}

export default UserEditButton;
