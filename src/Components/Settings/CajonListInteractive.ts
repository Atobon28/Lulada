// Components/Settings/CajonListInteractive.ts - COMPLETO CORREGIDO

// Componente que crea una lista interactiva de configuraciones
class CajonListInteractive extends HTMLElement {
    // Variables para controlar qué opción está seleccionada y qué vista se muestra
    private selectedOption: string | null = null;
    private currentView: 'list' | 'form' = 'list';

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
        this.setupEventListeners();
    }

    // Dibuja todo el HTML y CSS del componente
    private render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                    
                    /* Contenedor principal que organiza la lista y el formulario lado a lado */
                    .container {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        gap: 20px;
                        position: relative;
                    }
                    
                    /* Vista de la lista de opciones (lado izquierdo en escritorio) */
                    .list-view {
                        display: block;
                        width: 50%;
                        min-width: 300px;
                    }
                    
                    /* Vista del formulario (lado derecho en escritorio) */
                    .form-view {
                        display: flex;
                        flex: 1;
                        width: 50%;
                        height: 100%;
                        background-color: white;
                        padding: 20px;
                        align-items: flex-start;
                        justify-content: flex-start;
                    }
                    
                    .placeholder-message {
                        display: none;
                    }
                    
                    .list-container {
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                        width: 100%;
                        padding: 20px;
                        box-sizing: border-box;
                        height: 100%;
                        overflow-y: auto;
                    }
                    
                    /* Estilos para cada opción de configuración */
                    .settings-item {
                        width: 100%;
                        padding: 16px;
                        border-radius: 12px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        background-color: white;
                        font-family: sans-serif;
                        font-weight: 600;
                        font-size: 14px;
                        color: #000;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        margin-bottom: 16px;
                        box-sizing: border-box;
                        border: none;
                    }
                    
                    /* Efectos visuales cuando pasas el mouse por encima */
                    .settings-item:hover {
                        background-color: rgba(226, 245, 228, 0.54);
                        border-left: 4px solid #AAAB54;
                        color: #AAAB54;
                        font-weight: bold;
                        transform: translateX(5px);
                    }

                    /* Estilos para la opción seleccionada */
                    .settings-item.selected {
                        background-color: rgba(226, 245, 228, 0.54);
                        border-left: 4px solid #AAAB54;
                        color: #AAAB54;
                        font-weight: bold;
                    }

                    /* Flecha que aparece en las opciones clickeables */
                    .arrow {
                        color: #AAAB54;
                        font-size: 18px;
                        opacity: 0;
                        transition: opacity 0.2s ease;
                    }

                    .settings-item.clickable:hover .arrow {
                        opacity: 1;
                    }

                    /* DISEÑO RESPONSIVO: móviles (pantallas pequeñas) */
                    @media (max-width: 900px) {
                        .container {
                            flex-direction: column;
                            gap: 0;
                            height: auto;
                            min-height: 100vh;
                        }
                        
                        .list-view {
                            width: 100%;
                            height: auto;
                            overflow-y: visible;
                        }
                        
                        .form-view {
                            display: none !important;
                            width: 100%;
                            padding: 10px;
                        }
                        
                        .list-container {
                            padding: 10px 10px 100px 10px;
                            height: auto;
                            overflow-y: visible;
                        }
                        
                        .settings-item {
                            font-size: 16px;
                            padding: 18px;
                            margin-bottom: 12px;
                        }
                        
                        :host {
                            height: auto !important;
                            min-height: calc(100vh - 80px);
                            overflow-y: auto;
                        }
                    }
                </style>
                
                <div class="container">
                    <!-- Vista de lista: todas las opciones de configuración -->
                    <div class="list-view">
                        <div class="list-container">
                            <!-- Opciones que SÍ se pueden clickear -->
                            <button class="settings-item clickable" data-option="cambiar-correo">
                                <span>Cambiar correo</span>
                                <span class="arrow">→</span>
                            </button>
                            
                            <button class="settings-item clickable" data-option="cambiar-nombre">
                                <span>Cambiar nombre de usuario</span>
                                <span class="arrow">→</span>
                            </button>
                            
                            <button class="settings-item clickable" data-option="cambiar-contraseña">
                                <span>Cambiar contraseña</span>
                                <span class="arrow">→</span>
                            </button>
                            
                            <!-- Opciones que NO se pueden clickear -->
                            <div class="settings-item">
                                <span>Cambiar foto de perfil</span>
                            </div>
                            
                            <div class="settings-item">
                                <span>Editar biografía o descripción personal</span>
                            </div>
                            
                            <div class="settings-item">
                                <span>Seleccionar idioma de la app</span>
                            </div>
                            
                            <div class="settings-item">
                                <span>Configurar quién puede ver mi perfil (público/privado)</span>
                            </div>
                            
                            <div class="settings-item">
                                <span>Borrar historial de búsqueda</span>
                            </div>
                            
                            <div class="settings-item">
                                <span>Elegir color principal de la interfaz</span>
                            </div>
                            
                            <div class="settings-item">
                                <span>Cambiar tema (claro/oscuro/sistema)</span>
                            </div>
                            
                            <div class="settings-item">
                                <span>Tamaño del texto</span>
                            </div>

                            <!-- Opción especial para cerrar sesión -->
                            <button class="settings-item clickable" data-option="cerrar-sesion">
                                <span>Cerrar sesión</span>
                                <span class="arrow">→</span>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Vista de formulario: aquí aparecen los formularios cuando seleccionas una opción -->
                    <div class="form-view" id="form-view">
                    </div>
                </div>
            `;
        }
    }

    // Configura los eventos (qué pasa cuando haces click en cada opción)
    private setupEventListeners() {
        const clickableItems = this.shadowRoot?.querySelectorAll('.settings-item.clickable');
        
        clickableItems?.forEach(item => {
            item.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const option = target.getAttribute('data-option');
                
                if (option) {
                    this.handleOptionClick(option);
                }
            });
        });
    }
    
    // Decide qué hacer cuando se clickea una opción
    private handleOptionClick(option: string) {
        const isMobile = window.innerWidth <= 900;
        
        if (isMobile) {
            // En móvil: navegar a una página completa
            this.navigateToFullPage(option);
        } else {
            // En escritorio: mostrar formulario al lado derecho
            this.showInlineForm(option);
        }
    }
    
    // Navega a una página completa (para móvil)
    private navigateToFullPage(option: string) {
        let route = '';
        
        switch (option) {
            case 'cambiar-correo':
                route = '/cambiar-correo';
                break;
            case 'cambiar-nombre':
                route = '/cambiar-nombre';
                break;
            case 'cambiar-contraseña':
                route = '/cambiar-contraseña';
                break;
            case 'cerrar-sesion':
                this.handleLogout();
                return;
        }
        
        if (route) {
            const navigationEvent = new CustomEvent('navigate', {
                detail: route,
                bubbles: true,
                composed: true
            });
            
            document.dispatchEvent(navigationEvent);
        }
    }
    
    // Muestra un formulario en el panel derecho (para escritorio)
    private showInlineForm(option: string) {
        const formView = this.shadowRoot?.querySelector('#form-view') as HTMLElement;
        
        if (!formView) return;
        
        formView.innerHTML = '';
        
        let formComponent = '';
        
        switch (option) {
            case 'cambiar-correo':
                formComponent = '<cambiar-correo-simple></cambiar-correo-simple>';
                break;
            case 'cambiar-nombre':
                formComponent = '<cambiar-nombre-simple username="usuario_ejemplo"></cambiar-nombre-simple>';
                break;
            case 'cambiar-contraseña':
                formComponent = '<cambiar-contrasena-simple></cambiar-contrasena-simple>';
                break;
            case 'cerrar-sesion':
                this.handleLogout();
                return;
        }
        
        if (formComponent) {
            formView.innerHTML = formComponent;
            this.currentView = 'form';
            
            // Marca la opción como seleccionada
            this.markAsSelected(option);
            
            this.setupFormEventListeners(formView);
        }
    }
    
    // Configura los eventos de los formularios
    private setupFormEventListeners(formView: HTMLElement) {
        formView.addEventListener('back', () => {
            this.showPlaceholder();
        });
        
        formView.addEventListener('save', () => {
            this.showSuccessMessage();

            setTimeout(() => {
                this.showPlaceholder();
            }, 1500);
        });
    }
    
    // Vuelve al estado inicial (panel derecho vacío)
    private showPlaceholder() {
        const formView = this.shadowRoot?.querySelector('#form-view') as HTMLElement;
        
        if (!formView) return;
        
        formView.innerHTML = '';
        
        this.currentView = 'list';
        
        this.clearSelection();
    }
    
    // Marca una opción como seleccionada
    private markAsSelected(option: string) {
        this.clearSelection();
        
        const items = this.shadowRoot?.querySelectorAll('.settings-item.clickable');
        items?.forEach(item => {
            const itemOption = item.getAttribute('data-option');
            if (itemOption === option) {
                item.classList.add('selected');
            }
        });
        
        this.selectedOption = option;
    }
    
    private showListView() {
        this.showPlaceholder();
    }
    
    // Maneja el proceso de cerrar sesión
    private handleLogout() {
        const confirmLogout = confirm('¿Estás seguro de que quieres cerrar sesión?');
        if (confirmLogout) {
            try {
                localStorage.removeItem('userToken');
                sessionStorage.clear();
            } catch (e: unknown) {
                console.log('Error limpiando datos:', e);
            }
            
            const loginEvent = new CustomEvent('navigate', {
                detail: '/login',
                bubbles: true,
                composed: true
            });
            
            document.dispatchEvent(loginEvent);
        }
    }
    
    // Muestra un mensaje verde de éxito
    private showSuccessMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-weight: bold;
        `;
        message.textContent = '¡Cambios guardados exitosamente!';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (document.body.contains(message)) {
                document.body.removeChild(message);
            }
        }, 3000);
    }
    
    // Quita la selección de cualquier opción
    public clearSelection() {
        const clickableItems = this.shadowRoot?.querySelectorAll('.settings-item.clickable');
        clickableItems?.forEach(item => item.classList.remove('selected'));
        this.selectedOption = null;
    }
}

export default CajonListInteractive;