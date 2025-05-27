class CajonListInteractive extends HTMLElement {
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

    private render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                    
                    .container {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        gap: 20px;
                        position: relative;
                    }
                    
                    .list-view {
                        display: block;
                        width: 50%;
                        min-width: 300px;
                    }
                    
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
                    }
                    
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

                    /* HOVER UNIFORME para TODOS los elementos */
                    .settings-item:hover {
                        background-color: rgba(226, 245, 228, 0.54);
                        border-left: 4px solid #AAAB54;
                        color: #AAAB54;
                        font-weight: bold;
                        transform: translateX(5px);
                    }

                    .settings-item.selected {
                        background-color: rgba(226, 245, 228, 0.54);
                        border-left: 4px solid #AAAB54;
                        color: #AAAB54;
                        font-weight: bold;
                    }

                    .arrow {
                        color: #AAAB54;
                        font-size: 18px;
                        opacity: 0;
                        transition: opacity 0.2s ease;
                    }

                    /* Mostrar flecha al hacer hover SOLO en elementos clickeables */
                    .settings-item.clickable:hover .arrow {
                        opacity: 1;
                    }


/* Responsive */
@media (max-width: 900px) {
    .container {
        flex-direction: column;
        gap: 0;
        height: auto; /* Permitir que crezca automáticamente */
        min-height: 100vh; /* Altura mínima */
    }
    
    .list-view {
        width: 100%;
        height: auto; /* Permitir que crezca */
        overflow-y: visible; /* Mostrar todo el contenido */
    }
    
    .form-view {
        display: none !important; /* En mobile se oculta el panel derecho */
        width: 100%;
        padding: 10px;
    }
    
    .list-container {
        padding: 10px 10px 100px 10px; /* Padding extra abajo para la barra de navegación */
        height: auto; /* Permitir que crezca */
        overflow-y: visible; /* Mostrar todo */
    }
    
    .settings-item {
        font-size: 16px;
        padding: 18px;
        margin-bottom: 12px; /* Reducir margen entre elementos */
    }
    
    /* Asegurar que el contenedor padre permita scroll */
    :host {
        height: auto !important;
        min-height: calc(100vh - 80px); /* Descontar altura de la barra inferior */
        overflow-y: auto;
    }
}
                </style>
                
                <div class="container">
                    <!-- Vista de lista -->
                    <div class="list-view">
                        <div class="list-container">
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

                            <button class="settings-item clickable" data-option="cerrar-sesion">
                                <span>Cerrar sesión</span>
                                <span class="arrow">→</span>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Vista de formulario -->
                    <div class="form-view" id="form-view">
                        <!-- Sin contenido inicial -->
                    </div>
                </div>
            `;
        }
    }

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
    
    private handleOptionClick(option: string) {
        console.log('Opción clickeada:', option);
        
        // Verificar si estamos en mobile o desktop
        const isMobile = window.innerWidth <= 900;
        
        if (isMobile) {
            // En mobile: navegar a página completa
            this.navigateToFullPage(option);
        } else {
            // En desktop: mostrar formulario inline
            this.showInlineForm(option);
        }
    }
    
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
    
    private showInlineForm(option: string) {
        const formView = this.shadowRoot?.querySelector('#form-view') as HTMLElement;
        
        if (!formView) return;
        
        // Limpiar contenido anterior
        formView.innerHTML = '';
        
        // Crear el componente apropiado
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
            
            // Marcar la opción como seleccionada
            this.markAsSelected(option);
            
            // Configurar eventos del formulario
            this.setupFormEventListeners(formView);
        }
    }
    
    private setupFormEventListeners(formView: HTMLElement) {
        // Escuchar evento 'back'
        formView.addEventListener('back', () => {
            this.showPlaceholder();
        });
        
        // Escuchar evento 'save'
        formView.addEventListener('save', (event: Event) => {
            const customEvent = event as CustomEvent;
            console.log('Datos guardados:', customEvent.detail);
            
            // Mostrar mensaje de éxito
            this.showSuccessMessage();
            
            // Volver al placeholder después de un momento
            setTimeout(() => {
                this.showPlaceholder();
            }, 1500);
        });
    }
    
    private showPlaceholder() {
        const formView = this.shadowRoot?.querySelector('#form-view') as HTMLElement;
        
        if (!formView) return;
        
        formView.innerHTML = '';
        
        this.currentView = 'list';
        
        // Limpiar selección
        this.clearSelection();
    }
    
    private markAsSelected(option: string) {
        // Limpiar selección anterior
        this.clearSelection();
        
        // Marcar como seleccionado
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
        // En el nuevo layout, no necesitamos ocultar/mostrar vistas
        // Solo resetear al placeholder
        this.showPlaceholder();
    }
    
    private handleLogout() {
        const confirmLogout = confirm('¿Estás seguro de que quieres cerrar sesión?');
        if (confirmLogout) {
            try {
                localStorage.removeItem('userToken');
                sessionStorage.clear();
            } catch (e) {
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
    
    // Método público para limpiar la selección
    public clearSelection() {
        const clickableItems = this.shadowRoot?.querySelectorAll('.settings-item.clickable');
        clickableItems?.forEach(item => item.classList.remove('selected'));
        this.selectedOption = null;
    }
}

export default CajonListInteractive;