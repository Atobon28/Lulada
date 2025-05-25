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
                transition: background-color 0.3s ease;
            }

            .userEditar button:hover {
                background-color: #999A4A;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .userEditar {
                    text-align: center;
                    padding: 0.5rem;
                }
                
                .userEditar button {
                    width: auto;
                    min-width: 4rem;
                    font-size: 0.9rem; 
                    padding: 0.4rem 0.8rem;
                }
            }

            @media (max-width: 480px) {
                .userEditar button {
                    font-size: 0.8rem;
                    padding: 0.3rem 0.6rem;
                    height: 2rem;
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