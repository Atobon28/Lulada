// Este es un componente que crea una lista interactiva de configuraciones
// Permite cambiar configuraciones como correo, nombre de usuario, contraseña, etc.
class CajonListInteractive extends HTMLElement {
    // Variables para controlar qué opción está seleccionada y qué vista se muestra
    private selectedOption: string | null = null; // Guarda cuál opción está seleccionada
    private currentView: 'list' | 'form' = 'list'; // Controla si mostramos la lista o un formulario

    constructor() {
        super(); // Llama al constructor del elemento HTML base
        this.attachShadow({ mode: 'open' }); // Crea un "espacio privado" para este componente
        this.render(); // Dibuja el componente en la pantalla
    }

    // Se ejecuta cuando el componente se añade a la página
    connectedCallback() {
        this.setupEventListeners(); // Configura los eventos (clicks, etc.)
    }

    // Esta función dibuja todo el HTML y CSS del componente
    private render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    /* Estilos para que el componente ocupe todo el espacio disponible */
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
                    
                    /* Mensaje que aparece cuando no hay nada seleccionado */
                    .placeholder-message {
                        display: none;
                    }
                    
                    /* Contenedor que organiza todos los elementos de la lista */
                    .list-container {
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                        width: 100%;
                        padding: 20px;
                    }
                    
                    /* Estilos para cada opción de configuración (botones y textos) */
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
                    
                    /* Efectos visuales cuando pasas el mouse por encima de cualquier opción */
                    .settings-item:hover {
                        background-color: rgba(226, 245, 228, 0.54);
                        border-left: 4px solid #AAAB54;
                        color: #AAAB54;
                        font-weight: bold;
                        transform: translateX(5px);
                    }

                    /* Estilos para la opción que está seleccionada actualmente */
                    .settings-item.selected {
                        background-color: rgba(226, 245, 228, 0.54);
                        border-left: 4px solid #AAAB54;
                        color: #AAAB54;
                        font-weight: bold;
                    }

                    /* Flecha que aparece en las opciones que se pueden clickear */
                    .arrow {
                        color: #AAAB54;
                        font-size: 18px;
                        opacity: 0;
                        transition: opacity 0.2s ease;
                    }

                    /* Mostrar la flecha solo cuando pasas el mouse por opciones clickeables */
                    .settings-item.clickable:hover .arrow {
                        opacity: 1;
                    }

                    /* DISEÑO RESPONSIVO: Cómo se ve en móviles (pantallas pequeñas) */
                    @media (max-width: 900px) {
                        .container {
                            flex-direction: column; /* Organizar elementos uno debajo del otro */
                            gap: 0;
                            height: auto; /* Permitir que crezca automáticamente */
                            min-height: 100vh; /* Altura mínima de toda la pantalla */
                        }
                        
                        .list-view {
                            width: 100%; /* Ocupar todo el ancho en móvil */
                            height: auto;
                            overflow-y: visible; /* Mostrar todo el contenido */
                        }
                        
                        .form-view {
                            display: none !important; /* Ocultar el panel derecho en móvil */
                            width: 100%;
                            padding: 10px;
                        }
                        
                        .list-container {
                            padding: 10px 10px 100px 10px; /* Espacio extra abajo para la barra de navegación */
                            height: auto;
                            overflow-y: visible;
                        }
                        
                        .settings-item {
                            font-size: 16px; /* Texto más grande en móvil */
                            padding: 18px; /* Más espacio para tocar con el dedo */
                            margin-bottom: 12px;
                        }
                        
                        /* Asegurar que el componente permita scroll en móvil */
                        :host {
                            height: auto !important;
                            min-height: calc(100vh - 80px); /* Descontar altura de la barra inferior */
                            overflow-y: auto;
                        }
                    }
                </style>
                
                <div class="container">
                    <!-- Vista de lista: todas las opciones de configuración -->
                    <div class="list-view">
                        <div class="list-container">
                            <!-- Opciones que SÍ se pueden clickear (tienen la clase "clickable") -->
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
                            
                            <!-- Opciones que NO se pueden clickear (solo texto informativo) -->
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
                        <!-- Sin contenido inicial, se llena cuando seleccionas algo -->
                    </div>
                </div>
            `;
        }
    }

    // Configura los eventos (qué pasa cuando haces click en cada opción)
    private setupEventListeners() {
        // Busca todos los elementos que se pueden clickear
        const clickableItems = this.shadowRoot?.querySelectorAll('.settings-item.clickable');
        
        // Para cada elemento clickeable, añade un evento de click
        clickableItems?.forEach(item => {
            item.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const option = target.getAttribute('data-option'); // Obtiene qué opción fue clickeada
                
                if (option) {
                    this.handleOptionClick(option); // Maneja el click en esa opción
                }
            });
        });
    }
    
    // Decide qué hacer cuando se clickea una opción
    private handleOptionClick(option: string) {
        console.log('Opción clickeada:', option);
        
        // Verifica si estamos en móvil o escritorio
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
        let route = ''; // Variable para guardar la ruta a la que vamos
        
        // Decide a qué página ir según la opción seleccionada
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
                this.handleLogout(); // Caso especial: cerrar sesión
                return;
        }
        
        // Si hay una ruta válida, navegar a ella
        if (route) {
            const navigationEvent = new CustomEvent('navigate', {
                detail: route,
                bubbles: true,
                composed: true
            });
            
            document.dispatchEvent(navigationEvent); // Envía el evento de navegación
        }
    }
    
    // Muestra un formulario en el panel derecho (para escritorio)
    private showInlineForm(option: string) {
        const formView = this.shadowRoot?.querySelector('#form-view') as HTMLElement;
        
        if (!formView) return;
        
        // Limpiar el contenido anterior del panel derecho
        formView.innerHTML = '';
        
        // Decide qué componente mostrar según la opción
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
                this.handleLogout(); // Caso especial: cerrar sesión
                return;
        }
        
        // Si hay un componente válido, mostrarlo
        if (formComponent) {
            formView.innerHTML = formComponent;
            this.currentView = 'form'; // Cambia la vista actual a formulario
            
            // Marca la opción como seleccionada (resaltarla)
            this.markAsSelected(option);
            
            // Configura los eventos del formulario (botones guardar, cancelar, etc.)
            this.setupFormEventListeners(formView);
        }
    }
    
    // Configura los eventos de los formularios (cuando aparecen en el panel derecho)
    private setupFormEventListeners(formView: HTMLElement) {
        // Escucha cuando se presiona el botón "Volver"
        formView.addEventListener('back', () => {
            this.showPlaceholder(); // Vuelve a la vista vacía
        });
        
        // Escucha cuando se presiona el botón "Guardar"
        formView.addEventListener('save', (event: Event) => {
            const customEvent = event as CustomEvent;
            console.log('Datos guardados:', customEvent.detail);
            
            // Muestra un mensaje de éxito
            this.showSuccessMessage();
            
            // Después de un momento, vuelve a la vista vacía
            setTimeout(() => {
                this.showPlaceholder();
            }, 1500);
        });
    }
    
    // Vuelve al estado inicial (panel derecho vacío)
    private showPlaceholder() {
        const formView = this.shadowRoot?.querySelector('#form-view') as HTMLElement;
        
        if (!formView) return;
        
        formView.innerHTML = ''; // Limpia el contenido del panel derecho
        
        this.currentView = 'list'; // Cambia la vista actual a lista
        
        // Quita la selección de cualquier opción
        this.clearSelection();
    }
    
    // Marca una opción como seleccionada (la resalta visualmente)
    private markAsSelected(option: string) {
        // Primero quita la selección anterior
        this.clearSelection();
        
        // Busca la opción que fue clickeada y la marca como seleccionada
        const items = this.shadowRoot?.querySelectorAll('.settings-item.clickable');
        items?.forEach(item => {
            const itemOption = item.getAttribute('data-option');
            if (itemOption === option) {
                item.classList.add('selected'); // Añade la clase que la resalta
            }
        });
        
        this.selectedOption = option; // Guarda cuál opción está seleccionada
    }
    
    // Función que no se usa pero está aquí por compatibilidad
    private showListView() {
        // En el nuevo layout, no necesitamos ocultar/mostrar vistas
        // Solo resetear al placeholder
        this.showPlaceholder();
    }
    
    // Maneja el proceso de cerrar sesión
    private handleLogout() {
        // Pregunta al usuario si está seguro
        const confirmLogout = confirm('¿Estás seguro de que quieres cerrar sesión?');
        if (confirmLogout) {
            try {
                // Borra los datos guardados del usuario
                localStorage.removeItem('userToken');
                sessionStorage.clear();
            } catch (e) {
                console.log('Error limpiando datos:', e);
            }
            
            // Navega a la página de login
            const loginEvent = new CustomEvent('navigate', {
                detail: '/login',
                bubbles: true,
                composed: true
            });
            
            document.dispatchEvent(loginEvent);
        }
    }
    
    // Muestra un mensaje verde de éxito cuando se guardan cambios
    private showSuccessMessage() {
        const message = document.createElement('div'); // Crea un elemento para el mensaje
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
        
        // Añade el mensaje a la página
        document.body.appendChild(message);
        
        // Después de 3 segundos, quita el mensaje
        setTimeout(() => {
            if (document.body.contains(message)) {
                document.body.removeChild(message);
            }
        }, 3000);
    }
    
    // Método público para quitar la selección de cualquier opción
    public clearSelection() {
        const clickableItems = this.shadowRoot?.querySelectorAll('.settings-item.clickable');
        clickableItems?.forEach(item => item.classList.remove('selected')); // Quita la clase 'selected'
        this.selectedOption = null; // Resetea la opción seleccionada
    }
}

export default CajonListInteractive;