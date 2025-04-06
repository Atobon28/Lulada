export class Suggestions extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
  
        if (shadowRoot) {
            shadowRoot.innerHTML = `
                <style>
                    :host {
                        width: 300px;
                        background-color: white;
                        border-left: 1px solid #e0e0e0;
                        padding: 20px;
                    }
                    .suggestions-title {
                        font-size: 18px;
                        font-weight: bold;
                        margin-bottom: 20px;
                    }
                    .suggestion-item {
                        display: flex;
                        align-items: center;
                        margin-bottom: 15px;
                        cursor: pointer;
                    }
                    .suggestion-image {
                        width: 50px;
                        height: 50px;
                        border-radius: 8px;
                        margin-right: 15px;
                        object-fit: cover;
                    }
                    .suggestion-details {
                        flex-grow: 1;
                    }
                    .suggestion-name {
                        font-weight: bold;
                    }
                    .suggestion-view {
                        color: #007bff;
                        font-weight: bold;
                    }
                </style>
                
                <div class="suggestions-title">Sugerencias</div>
                
                <div class="suggestions-list">
                    <div class="suggestion-item">
                        <img src="https://via.placeholder.com/50" class="suggestion-image" alt="BarBurguer">
                        <div class="suggestion-details">
                            <div class="suggestion-name">BarBurguer</div>
                        </div>
                        <div class="suggestion-view">Ver</div>
                    </div>
                    
                    <div class="suggestion-item">
                        <img src="https://via.placeholder.com/50" class="suggestion-image" alt="Frenchrico">
                        <div class="suggestion-details">
                            <div class="suggestion-name">Frenchrico</div>
                        </div>
                        <div class="suggestion-view">Ver</div>
                    </div>
                    
                    <div class="suggestion-item">
                        <img src="https://via.placeholder.com/50" class="suggestion-image" alt="NoMames!">
                        <div class="suggestion-details">
                            <div class="suggestion-name">NoMames!</div>
                        </div>
                        <div class="suggestion-view">Ver</div>
                    </div>
                    
                    <div class="suggestion-item">
                        <img src="https://via.placeholder.com/50" class="suggestion-image" alt="LaCocina">
                        <div class="suggestion-details">
                            <div class="suggestion-name">LaCocina</div>
                        </div>
                        <div class="suggestion-view">Ver</div>
                    </div>
                </div>
            `;

            this.addEventListeners(shadowRoot);
        }
    }

    addEventListeners(shadowRoot: ShadowRoot): void {
        const items = shadowRoot.querySelectorAll('.suggestion-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const nameElement = item.querySelector('.suggestion-name');
                const restaurantName = nameElement ? nameElement.textContent || '' : '';
                
                this.dispatchEvent(new CustomEvent('suggestion-select', {
                    detail: restaurantName,
                    bubbles: true,
                    composed: true
                }));
            });
        });
    }
}
  
customElements.define('lulada-suggestions', Suggestions);