class Lulada extends HTMLElement {
    shadowRoot: ShadowRoot;

    constructor() {
        super();
        this.shadowRoot = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    background-color: white;
                    position: relative;
                    z-index: 10;
                }

                .header-wrapper {
                    width: 100%;
                    background-color: white;
                    padding: 20px 0 10px 20px;
                    border-bottom: 1px solid #eaeaea;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    position: relative;
                }

                .logo-container {
                    width: 300px;
                }

                .logo-container img {
                    max-width: 300px;
                    height: auto;
                }

                .error {
                    color: red;
                    background-color: #ffeeee;
                    padding: 10px;
                }
            </style>

            <div class="header-wrapper">
                <div class="logo-container">
                    <img 
                        src="https://i.postimg.cc/xdhdVv5d/Recurso-5-ASCAAS.jpg" 
                        alt="Lulada Logo"
                    >
                </div>
            </div>
        `;

        // Configurar el manejo de errores de imagen
        const img = this.shadowRoot.querySelector('img');
        if (img) {
            img.onerror = () => {
                img.onerror = null;
                img.classList.add('error');
                img.insertAdjacentHTML('afterend', '<div class="error">Image Load Failed: ' + img.src + '</div>');
            };
        }
    }
}

export default Lulada;