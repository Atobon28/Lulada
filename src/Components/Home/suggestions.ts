// Creamos una clase que representa un componente web personalizado para mostrar sugerencias de restaurantes
class LuladaSuggestions extends HTMLElement {
    constructor() {
        super() // Llamamos al constructor de HTMLElement (la clase padre)
        this.attachShadow({ mode: 'open' }) // Creamos un Shadow DOM para aislar nuestros estilos

        // Si el Shadow DOM se creó correctamente, añadimos todo el HTML y CSS
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    /* Estilos para el componente principal */
                    :host {
                        width: 100%;
                        max-width: 300px;
                        background-color: white;
                        border-left: 1px solid #e0e0e0;
                        padding: 20px;
                        box-sizing: border-box;
                    }
                    
                    /* Estilos para el título "Sugerencias" */
                    .suggestions-title {
                        font-size: 20px;
                        font-weight: bold;
                        margin-bottom: 20px;
                        text-align: center;
                        color: #333;
                    }
                    
                    /* Contenedor de la lista de sugerencias */
                    .suggestions-list {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                    }
                    
                    /* Cada item individual de sugerencia (restaurante) */
                    .suggestion-item {
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        padding: 10px;
                        border-radius: 8px;
                        transition: background-color 0.2s ease;
                        position: relative;
                    }
                    
                    /* Efecto hover: cuando pasas el mouse por encima del item */
                    .suggestion-item:hover {
                        background-color: #f5f5f5;
                    }
                    
                    /* Imagen del logo del restaurante */
                    .suggestion-image {
                        width: 50px;
                        height: 50px;
                        border-radius: 8px;
                        margin-right: 15px;
                        object-fit: cover;
                        flex-shrink: 0;
                    }
                    
                    /* Contenedor de los detalles del restaurante (nombre, etc) */
                    .suggestion-details {
                        flex-grow: 1;
                        min-width: 0;
                    }
                    
                    /* Nombre del restaurante */
                    .suggestion-name {
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 4px;
                        word-wrap: break-word;
                    }
                    
                    /* Botón "Ver" para ir al perfil del restaurante */
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
                    
                    /* Efecto hover del botón "Ver" */
                    .suggestion-view:hover {
                        background-color: #AAAB54;
                        color: white;
                        transform: scale(1.05);
                    }

                    /* Efecto cuando se hace click en el botón */
                    .suggestion-view:active {
                        transform: scale(0.95);
                    }

                    /* Estilos para tablets */
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

                    /* Estilos para móviles */
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

                    /* Estilos para móviles pequeños */
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
                
                <!-- Título de la sección -->
                <div class="suggestions-title">Sugerencias</div>
                
                <!-- Lista de restaurantes sugeridos -->
                <div class="suggestions-list">
                    <!-- Primer restaurante: BarBurguer -->
                    <div class="suggestion-item" data-restaurant="barburguer">
                        <img src="https://marketplace.canva.com/EAFpeiTrl4c/2/0/1600w/canva-abstract-chef-cooking-restaurant-free-logo-a1RYzvS1EFo.jpg" class="suggestion-image" alt="BarBurguer">
                        <div class="suggestion-details">
                            <div class="suggestion-name">BarBurguer</div>
                        </div>
                        <div class="suggestion-view" data-restaurant="barburguer">Ver</div>
                    </div>
                    <!-- Segundo restaurante: Frenchrico -->
                    <div class="suggestion-item" data-restaurant="frenchrico">
                        <img src="https://img.pikbest.com/png-images/20241030/culinary-restaurant-logo-design_11027332.png!sw800" class="suggestion-image" alt="Frenchrico">
                        <div class="suggestion-details">
                            <div class="suggestion-name">Frenchrico</div>
                        </div>
                        <div class="suggestion-view" data-restaurant="frenchrico">Ver</div>
                    </div>
                    <!-- Tercer restaurante: NoMames! -->
                    <div class="suggestion-item" data-restaurant="nomames">
                        <img src="https://justcreative.com/wp-content/uploads/2023/02/Restaurant-Logo-Templates.png.webp" class="suggestion-image" alt="NoMames!">
                        <div class="suggestion-details">
                            <div class="suggestion-name">NoMames!</div>
                        </div>
                        <div class="suggestion-view" data-restaurant="nomames">Ver</div>
                    </div>
                    <!-- Cuarto restaurante: LaCocina -->
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

    // Este método se ejecuta automáticamente cuando el componente se añade a la página
    connectedCallback() {
        console.log(' LuladaSuggestions conectado al DOM');
        if (!this.shadowRoot) return // Si no hay Shadow DOM, salimos
        
        this.setupEventListeners(); // Configuramos los clicks en los botones
    }

    // Este método se ejecuta cuando el componente se quita de la página
    disconnectedCallback() {
        console.log(' LuladaSuggestions desconectado del DOM');
    }

    // Función privada que configura todos los eventos de click
    private setupEventListeners(): void {
        if (!this.shadowRoot) return; // Si no hay Shadow DOM, salimos
        
        // Buscamos todos los botones "Ver" en la página
        const viewButtons = this.shadowRoot.querySelectorAll('.suggestion-view');
        
        console.log(` LuladaSuggestions: Configurando ${viewButtons.length} botones "Ver"`);
        
        // Para cada botón "Ver", añadimos un evento de click
        viewButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitamos que el click se propague a otros elementos
                
                // Obtenemos la información del restaurante
                const restaurantId = button.getAttribute('data-restaurant'); // ID del restaurante (ej: "barburguer")
                const item = button.closest('.suggestion-item'); // El contenedor completo del restaurante
                const nameElement = item?.querySelector('.suggestion-name'); // El elemento que contiene el nombre
                const name = nameElement ? nameElement.textContent : ''; // El nombre del restaurante
                
                // Mostramos información en la consola para debugging
                console.log(` LuladaSuggestions: Click en botón Ver #${index}`);
                console.log(` Restaurante ID: ${restaurantId}`);
                console.log(` Nombre: ${name}`);
                
                // Si encontramos el ID del restaurante, navegamos a su perfil
                if (restaurantId) {
                    this.navigateToRestaurant(restaurantId, name || 'Restaurante');
                } else {
                    console.warn(' No se encontró ID de restaurante');
                    this.showErrorMessage('No se pudo encontrar la información del restaurante');
                }
            });
        });

        // También añadimos eventos a los contenedores completos de cada restaurante
        const suggestionItems = this.shadowRoot.querySelectorAll('.suggestion-item');
        
        suggestionItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                // Solo procesamos el click si NO se clickeó el botón "Ver"
                const target = e.target as HTMLElement;
                if (target.classList.contains('suggestion-view')) {
                    return; // El botón "Ver" ya maneja esto, así que salimos
                }
                
                // Obtenemos la información del restaurante
                const restaurantId = item.getAttribute('data-restaurant');
                const nameElement = item.querySelector('.suggestion-name');
                const name = nameElement ? nameElement.textContent : '';
                
                console.log(` LuladaSuggestions: Click en item completo #${index}`);
                
                // Navegamos al perfil del restaurante
                if (restaurantId) {
                    this.navigateToRestaurant(restaurantId, name || 'Restaurante');
                }
            });
        });
        
        console.log(' LuladaSuggestions: Event listeners configurados');
    }

    // Función privada que maneja la navegación al perfil de un restaurante
    private navigateToRestaurant(restaurantId: string, restaurantName: string): void {
        console.log(` LuladaSuggestions: Navegando al perfil de ${restaurantName} (${restaurantId})`);
        
        // Creamos la URL del perfil del restaurante
        // OPCIÓN 1: Ruta dinámica que incluye el ID del restaurante
        const restaurantRoute = `/restaurant-profile/${restaurantId}`;
        
        // OPCIÓN 2: Si prefieres una ruta más simple (comentada)
        // const restaurantRoute = '/restaurant-profile';
        
        // Creamos un evento personalizado para avisar que queremos navegar
        const navigationEvent = new CustomEvent('navigate', {
            detail: restaurantRoute, // La ruta a la que queremos ir
            bubbles: true, // El evento puede subir por el DOM
            composed: true // El evento puede salir del Shadow DOM
        });
        
        // Enviamos el evento a nivel global para que LoadPage lo capture
        document.dispatchEvent(navigationEvent);
        
        console.log(` LuladaSuggestions: Evento de navegación enviado: ${restaurantRoute}`);
        
        // Guardamos la información del restaurante para uso posterior
        this.storeRestaurantInfo(restaurantId, restaurantName);
        
        // Enviamos otro evento con información específica del restaurante
        const restaurantEvent = new CustomEvent('restaurant-selected', {
            detail: {
                id: restaurantId,
                name: restaurantName,
                source: 'suggestions' // Indicamos que vino de las sugerencias
            },
            bubbles: true,
            composed: true
        });
        
        document.dispatchEvent(restaurantEvent);
    }

    // Función privada que guarda la información del restaurante en el navegador
    private storeRestaurantInfo(restaurantId: string, restaurantName: string): void {
        try {
            // Creamos un objeto con la información del restaurante
            const restaurantInfo = {
                id: restaurantId,
                name: restaurantName,
                timestamp: Date.now(), // Momento actual en milisegundos
                source: 'suggestions' // De dónde vino la selección
            };
            
            // Guardamos la información en sessionStorage (se borra al cerrar la pestaña)
            sessionStorage.setItem('selectedRestaurant', JSON.stringify(restaurantInfo));
            console.log(' Información del restaurante almacenada:', restaurantInfo);
            
        } catch (error) {
            // Si hay algún error guardando, lo mostramos pero no rompemos la app
            console.warn(' No se pudo almacenar información del restaurante:', error);
        }
    }

    // Función privada para mostrar errores (solo en consola)
    private showErrorMessage(message: string): void {
        // Solo mostramos el error en la consola, sin alertas molestas al usuario
        console.error(` ${message}`);
    }

    // Método público para debugging (verificar que todo funcione)
    public debugInfo(): void {
        console.log(' LuladaSuggestions Debug:');
        console.log('- Shadow DOM:', !!this.shadowRoot);
        
        if (this.shadowRoot) {
            const viewButtons = this.shadowRoot.querySelectorAll('.suggestion-view');
            const suggestionItems = this.shadowRoot.querySelectorAll('.suggestion-item');
            
            console.log('- Botones "Ver":', viewButtons.length);
            console.log('- Items de sugerencias:', suggestionItems.length);
            
            // Mostramos información de cada restaurante
            suggestionItems.forEach((item, index) => {
                const restaurantId = item.getAttribute('data-restaurant');
                const nameElement = item.querySelector('.suggestion-name');
                const name = nameElement ? nameElement.textContent : '';
                console.log(`  ${index}: ${name} (${restaurantId})`);
            });
        }
    }

    // Método público para simular un click (útil para pruebas)
    public simulateRestaurantClick(restaurantId: string): void {
        if (!this.shadowRoot) return;
        
        // Buscamos el botón del restaurante específico
        const button = this.shadowRoot.querySelector(`[data-restaurant="${restaurantId}"]`);
        if (button) {
            // Simulamos un click en el botón
            const event = new MouseEvent('click', { bubbles: true });
            button.dispatchEvent(event);
        } else {
            console.warn(` No se encontró restaurante con ID: ${restaurantId}`);
        }
    }
}

// Código que se ejecuta solo en el navegador (no en servidor)
if (typeof window !== 'undefined') {
    // Creamos una función global para debugging si no existe ya
    if (!window.debugSuggestions) {
        window.debugSuggestions = () => {
            // Buscamos el componente en la página
            const suggestions = document.querySelector('lulada-suggestions') as LuladaSuggestions;
            if (suggestions && typeof suggestions.debugInfo === 'function') {
                suggestions.debugInfo(); // Ejecutamos el debug
            } else {
                console.log('Componente lulada-suggestions no encontrado');
            }
        };
    }
}

export default LuladaSuggestions;