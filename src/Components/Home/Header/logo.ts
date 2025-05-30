// Componente del logo de Lulada
class Lulada extends HTMLElement {
    shadowRoot: ShadowRoot;

    constructor() {
        super();
        this.shadowRoot = this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    text-align: left;
                    margin: 0;
                    padding: 0;
                }
                
                .logo-wrapper {
                    margin: 0;
                    padding: 0;
                    text-align: left;
                }
                
                img {
                    max-width: 300px;
                    height: auto;
                    margin: 0;
                    padding: 0;
                    display: block;
                }
                
                .error {
                    color: red;
                    background-color: #ffeeee;
                    padding: 10px;
                    margin: 0;
                }

                @media (max-width: 900px) {
                    :host {
                        text-align: center;
                    }
                    
                    .logo-wrapper {
                        text-align: center;
                    }
                    
                    img {
                        max-width: 200px;
                        margin: 0 auto;
                    }
                }
            </style>
            
            <div class="logo-wrapper">
                <img 
                    src="https://i.postimg.cc/xdhdVv5d/Recurso-5-ASCAAS.jpg" 
                    alt="Lulada Logo"
                >
            </div>
        `;

        // Manejo de errores para la imagen
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