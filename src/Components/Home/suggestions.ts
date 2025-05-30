// Componente web personalizado para mostrar sugerencias de restaurantes
class LuladaSuggestions extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    :host {
                        width: 100%;
                        max-width: 300px;
                        background-color: white;
                        border-left: 1px solid #e0e0e0;
                        padding: 20px;
                        box-sizing: border-box;
                    }

                    .suggestions-title {
                        font-size: 20px;
                        font-weight: bold;
                        margin-bottom: 20px;
                        text-align: center;
                        color: #333;
                    }

                    .suggestions-list {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                    }

                    .suggestion-item {
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        padding: 10px;
                        border-radius: 8px;
                        transition: background-color 0.2s ease;
                        position: relative;
                    }

                    .suggestion-item:hover {
                        background-color: #f5f5f5;
                    }

                    .suggestion-image {
                        width: 50px;
                        height: 50px;
                        border-radius: 8px;
                        margin-right: 15px;
                        object-fit: cover;
                        flex-shrink: 0;
                    }

                    .suggestion-details {
                        flex-grow: 1;
                        min-width: 0;
                    }

                    .suggestion-name {
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 4px;
                        word-wrap: break-word;
                    }

                    .suggestion-view {
                        color: #AAAB54;
                        font-weight: bold;
                        font-size: 14px;
                        flex-shrink: 0;
                        padding: 6px 12px;
                        border-radius: 15px;
                        border: 1px solid #AAAB54;
                        transition: all 0.2s ease;
                        text-decoration: none;
                        cursor: pointer;
                        background-color: transparent;
                    }

                    .suggestion-view:hover {
                        background-color: #AAAB54;
                        color: white;
                        transform: scale(1.05);
                    }

                    .suggestion-view:active {
                        transform: scale(0.95);
                    }

                    /* Responsive: Tablets */
                    @media (max-width: 1024px) {
                        :host {
                            max-width: 250px;
                            padding: 15px;
                        }

                        .suggestions-title {
                            font-size: 18px;
                            margin-bottom: 15px;
                        }

                        .suggestion-image {
                            width: 45px;
                            height: 45px;
                            margin-right: 12px;
                        }

                        .suggestion-name {
                            font-size: 14px;
                        }

                        .suggestion-view {
                            font-size: 13px;
                            padding: 5px 10px;
                        }
                    }

                    /* Responsive: Móviles */
                    @media (max-width: 768px) {
                        :host {
                            width: 100%;
                            max-width: 100%;
                            border-left: none;
                            border-top: 1px solid #e0e0e0;
                            padding: 15px;
                        }

                        .suggestions-list {
                            display: grid;
                            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                            gap: 12px;
                        }

                        .suggestion-item {
                            padding: 8px;
                        }
                    }

                    /* Responsive: Móviles pequeños */
                    @media (max-width: 480px) {
                        :host {
                            padding: 12px;
                        }

                        .suggestions-title {
                            font-size: 16px;
                            margin-bottom: 12px;
                        }

                        .suggestions-list {
                            grid-template-columns: 1fr;
                            gap: 10px;
                        }

                        .suggestion-image {
                            width: 40px;
                            height: 40px;
                            margin-right: 10px;
                        }

                        .suggestion-name {
                            font-size: 13px;
                        }

                        .suggestion-view {
                            font-size: 12px;
                            padding: 4px 8px;
                        }
                    }
                </style>

                <div class="suggestions-title">Sugerencias</div>

                <div class="suggestions-list">
                    <div class="suggestion-item" data-restaurant="barburguer">
                        <img src="https://marketplace.canva.com/EAFpeiTrl4c/2/0/1600w/canva-abstract-chef-cooking-restaurant-free-logo-a1RYzvS1EFo.jpg" class="suggestion-image" alt="BarBurguer">
                        <div class="suggestion-details">
                            <div class="suggestion-name">BarBurguer</div>
                        </div>
                        <div class="suggestion-view" data-restaurant="barburguer">Ver</div>
                    </div>

                    <div class="suggestion-item" data-restaurant="frenchrico">
                        <img src="https://img.pikbest.com/png-images/20241030/culinary-restaurant-logo-design_11027332.png!sw800" class="suggestion-image" alt="Frenchrico">
                        <div class="suggestion-details">
                            <div class="suggestion-name">Frenchrico</div>
                        </div>
                        <div class="suggestion-view" data-restaurant="frenchrico">Ver</div>
                    </div>

                    <div class="suggestion-item" data-restaurant="nomames">
                        <img src="https://justcreative.com/wp-content/uploads/2023/02/Restaurant-Logo-Templates.png.webp" class="suggestion-image" alt="NoMames!">
                        <div class="suggestion-details">
                            <div class="suggestion-name">NoMames!</div>
                        </div>
                        <div class="suggestion-view" data-restaurant="nomames">Ver</div>
                    </div>

                    <div class="suggestion-item" data-restaurant="lacocina">
                        <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/chef-logo%2Ccooking-logo%2Crestaurant-logo-design-template-8048c6b88c3702da6e0804bc38ce7f33_screen.jpg?ts=1672750337" class="suggestion-image" alt="LaCocina">
                        <div class="suggestion-details">
                            <div class="suggestion-name">LaCocina</div>
                        </div>
                        <div class="suggestion-view" data-restaurant="lacocina">Ver</div>
                    </div>
                </div>
            `;
        }
    }

    connectedCallback() {
        if (!this.shadowRoot) return;
        this.setupEventListeners();
    }

    disconnectedCallback() {
        // Cleanup si es necesario
    }

    // Configura todos los eventos de click
    private setupEventListeners(): void {
        if (!this.shadowRoot) return;

        const viewButtons = this.shadowRoot.querySelectorAll('.suggestion-view');

        viewButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();

                const restaurantId = button.getAttribute('data-restaurant');
                const item = button.closest('.suggestion-item');
                const nameElement = item?.querySelector('.suggestion-name');
                const name = nameElement ? nameElement.textContent : '';

                if (restaurantId) {
                    this.navigateToRestaurant(restaurantId, name || 'Restaurante');
                } else {
                    this.showErrorMessage('No se pudo encontrar la información del restaurante');
                }
            });
        });

        const suggestionItems = this.shadowRoot.querySelectorAll('.suggestion-item');

        suggestionItems.forEach((item) => {
            item.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                if (target.classList.contains('suggestion-view')) return;

                const restaurantId = item.getAttribute('data-restaurant');
                const nameElement = item.querySelector('.suggestion-name');
                const name = nameElement ? nameElement.textContent : '';

                if (restaurantId) {
                    this.navigateToRestaurant(restaurantId, name || 'Restaurante');
                }
            });
        });
    }

    private navigateToRestaurant(restaurantId: string, restaurantName: string): void {
        const restaurantRoute = `/restaurant-profile/${restaurantId}`;

        const navigationEvent = new CustomEvent('navigate', {
            detail: restaurantRoute,
            bubbles: true,
            composed: true
        });

        document.dispatchEvent(navigationEvent);

        this.storeRestaurantInfo(restaurantId, restaurantName);

        const restaurantEvent = new CustomEvent('restaurant-selected', {
            detail: {
                id: restaurantId,
                name: restaurantName,
                source: 'suggestions'
            },
            bubbles: true,
            composed: true
        });

        document.dispatchEvent(restaurantEvent);
    }

    private storeRestaurantInfo(restaurantId: string, restaurantName: string): void {
        try {
            const restaurantInfo = {
                id: restaurantId,
                name: restaurantName,
                timestamp: Date.now(),
                source: 'suggestions'
            };

            sessionStorage.setItem('selectedRestaurant', JSON.stringify(restaurantInfo));
        } catch (error) {
            console.warn(' No se pudo almacenar información del restaurante:', error);
        }
    }

    private showErrorMessage(message: string): void {
        console.error(` ${message}`);
    }

    public debugInfo(): void {
        console.log(' LuladaSuggestions Debug:');
        console.log('- Shadow DOM:', !!this.shadowRoot);

        if (this.shadowRoot) {
            const viewButtons = this.shadowRoot.querySelectorAll('.suggestion-view');
            const suggestionItems = this.shadowRoot.querySelectorAll('.suggestion-item');

            console.log('- Botones "Ver":', viewButtons.length);
            console.log('- Items de sugerencias:', suggestionItems.length);

            suggestionItems.forEach((item, index) => {
                const restaurantId = item.getAttribute('data-restaurant');
                const nameElement = item.querySelector('.suggestion-name');
                const name = nameElement ? nameElement.textContent : '';
                console.log(`  ${index}: ${name} (${restaurantId})`);
            });
        }
    }

    public simulateRestaurantClick(restaurantId: string): void {
        if (!this.shadowRoot) return;

        const button = this.shadowRoot.querySelector(`[data-restaurant="${restaurantId}"]`);
        if (button) {
            const event = new MouseEvent('click', { bubbles: true });
            button.dispatchEvent(event);
        } else {
            console.warn(` No se encontró restaurante con ID: ${restaurantId}`);
        }
    }
}

if (typeof window !== 'undefined') {
    if (!window.debugSuggestions) {
        window.debugSuggestions = () => {
            const suggestions = document.querySelector('lulada-suggestions') as LuladaSuggestions;
            if (suggestions && typeof suggestions.debugInfo === 'function') {
                suggestions.debugInfo();
            } else {
                console.log('Componente lulada-suggestions no encontrado');
            }
        };
    }
}

export default LuladaSuggestions;
