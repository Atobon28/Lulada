import AntojarPopupService from './antojar-popup';

// Botón personalizado para abrir el popup de reseñas
export class LuladaAntojarBoton extends HTMLElement {
    shadowRoot: ShadowRoot | null;

    constructor() {
        super();
        this.shadowRoot = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        if (this.shadowRoot) {
            const texto = this.getAttribute('texto') || 'Antojar';
            const color = this.getAttribute('color') || '#AAAB54';
            const colorHover = this.getAttribute('color-hover') || 'rgb(132, 134, 58)';

            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: inline-block;
                    }
                    
                    .antojar-button {
                        padding: 8px 24px;
                        background-color: ${color};
                        color: white;
                        border: none;
                        border-radius: 20px;
                        font-size: 16px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: background-color 0.2s ease;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    
                    .antojar-button:hover {
                        background-color: ${colorHover};
                    }
                    
                    .icon {
                        width: 16px;
                        height: 16px;
                        fill: white;
                    }
                </style>
                
                <button class="antojar-button">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M12 2l1.46 4.38h4.75l-3.83 2.84 
                            1.46 4.38-3.84-2.84-3.84 2.84 
                            1.46-4.38-3.83-2.84h4.75z">
                        </path>
                    </svg>
                    ${texto}
                </button>
            `;

            const button = this.shadowRoot.querySelector('.antojar-button');
            
            if (button) {
                button.addEventListener('click', () => {
                    const popupService = AntojarPopupService.getInstance(); 
                    popupService.showPopup(); 
                });
            }
        }
    }
}

// ✅ VERIFICACIÓN PARA EVITAR DUPLICADOS
if (!customElements.get('lulada-antojar-boton')) {
    customElements.define('lulada-antojar-boton', LuladaAntojarBoton);
}

export default LuladaAntojarBoton;