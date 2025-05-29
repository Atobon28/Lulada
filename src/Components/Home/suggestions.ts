// src/Components/Home/suggestions.ts - VERSIÓN MEJORADA CON NAVEGACIÓN (SIN ALERT)

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
            `
        }
    }

    connectedCallback() {
        console.log('🔗 LuladaSuggestions conectado al DOM');
        if (!this.shadowRoot) return
        
        this.setupEventListeners();
    }

    disconnectedCallback() {
        console.log('🔌 LuladaSuggestions desconectado del DOM');
    }

    private setupEventListeners(): void {
        if (!this.shadowRoot) return;
        
        // Obtener todos los botones "Ver"
        const viewButtons = this.shadowRoot.querySelectorAll('.suggestion-view');
        
        console.log(`🔧 LuladaSuggestions: Configurando ${viewButtons.length} botones "Ver"`);
        
        viewButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que se propague al contenedor padre
                
                const restaurantId = button.getAttribute('data-restaurant');
                const item = button.closest('.suggestion-item');
                const nameElement = item?.querySelector('.suggestion-name');
                const name = nameElement ? nameElement.textContent : '';
                
                console.log(`🎯 LuladaSuggestions: Click en botón Ver #${index}`);
                console.log(`📍 Restaurante ID: ${restaurantId}`);
                console.log(`🏪 Nombre: ${name}`);
                
                if (restaurantId) {
                    this.navigateToRestaurant(restaurantId, name || 'Restaurante');
                } else {
                    console.warn('⚠️ No se encontró ID de restaurante');
                    this.showErrorMessage('No se pudo encontrar la información del restaurante');
                }
            });
        });

        // También agregar event listener al item completo (opcional)
        const suggestionItems = this.shadowRoot.querySelectorAll('.suggestion-item');
        
        suggestionItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                // Solo procesar si no se clickeó el botón "Ver"
                const target = e.target as HTMLElement;
                if (target.classList.contains('suggestion-view')) {
                    return; // El botón "Ver" ya maneja esto
                }
                
                const restaurantId = item.getAttribute('data-restaurant');
                const nameElement = item.querySelector('.suggestion-name');
                const name = nameElement ? nameElement.textContent : '';
                
                console.log(`🎯 LuladaSuggestions: Click en item completo #${index}`);
                
                if (restaurantId) {
                    this.navigateToRestaurant(restaurantId, name || 'Restaurante');
                }
            });
        });
        
        console.log('✅ LuladaSuggestions: Event listeners configurados');
    }

    private navigateToRestaurant(restaurantId: string, restaurantName: string): void {
        console.log(`🚀 LuladaSuggestions: Navegando al perfil de ${restaurantName} (${restaurantId})`);
        
        // Crear la ruta del perfil de restaurante
        // Puedes usar diferentes estrategias aquí:
        
        // OPCIÓN 1: Ruta directa al perfil de restaurante
        const restaurantRoute = `/restaurant-profile/${restaurantId}`;
        
        // OPCIÓN 2: Si prefieres una ruta más simple
        // const restaurantRoute = '/restaurant-profile';
        
        // Crear evento de navegación
        const navigationEvent = new CustomEvent('navigate', {
            detail: restaurantRoute,
            bubbles: true,
            composed: true
        });
        
        // Disparar evento global para que LoadPage lo capture
        document.dispatchEvent(navigationEvent);
        
        console.log(`✅ LuladaSuggestions: Evento de navegación enviado: ${restaurantRoute}`);
        
        // También almacenar información del restaurante para que el perfil la pueda usar
        this.storeRestaurantInfo(restaurantId, restaurantName);
        
        // Disparar evento personalizado con información del restaurante
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
            // Almacenar información temporalmente para que el perfil de restaurante la use
            const restaurantInfo = {
                id: restaurantId,
                name: restaurantName,
                timestamp: Date.now(),
                source: 'suggestions'
            };
            
            sessionStorage.setItem('selectedRestaurant', JSON.stringify(restaurantInfo));
            console.log('💾 Información del restaurante almacenada:', restaurantInfo);
            
        } catch (error) {
            console.warn('⚠️ No se pudo almacenar información del restaurante:', error);
        }
    }



    private showErrorMessage(message: string): void {
        // Solo console.log para errores, sin toast molesto
        console.error(`❌ ${message}`);
    }

    // Método público para debugging
    public debugInfo(): void {
        console.log('🔍 LuladaSuggestions Debug:');
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

    // Método público para simular click (útil para testing)
    public simulateRestaurantClick(restaurantId: string): void {
        if (!this.shadowRoot) return;
        
        const button = this.shadowRoot.querySelector(`[data-restaurant="${restaurantId}"]`);
        if (button) {
            const event = new MouseEvent('click', { bubbles: true });
            button.dispatchEvent(event);
        } else {
            console.warn(`⚠️ No se encontró restaurante con ID: ${restaurantId}`);
        }
    }
}

// Exponer para debugging
if (typeof window !== 'undefined') {
    if (!window.debugSuggestions) {
        window.debugSuggestions = () => {
            const suggestions = document.querySelector('lulada-suggestions') as LuladaSuggestions;
            if (suggestions && typeof suggestions.debugInfo === 'function') {
                suggestions.debugInfo();
            } else {
                console.log('❌ Componente lulada-suggestions no encontrado');
            }
        };
    }
}

export default LuladaSuggestions;