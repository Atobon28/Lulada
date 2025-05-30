// Componente personalizado que crea una lista de configuraciones
class CajonList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    .list-container {
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                        width: 100%;
                        max-width: 500px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                </style>
                
                <!-- Contenedor principal que agrupa todos los elementos de la lista -->
                <div class="list-container">
                    <!-- Elementos con navegación -->
                    <cajon-texto label="Cambiar correo" data-route="/cambiar-correo"></cajon-texto>
                    <cajon-texto label="Cambiar nombre de usuario" data-route="/cambiar-nombre"></cajon-texto>
                    <cajon-texto label="Cambiar contraseña" data-route="/cambiar-contraseña"></cajon-texto>
                    
                    <!-- Elementos sin navegación -->
                    <cajon-texto label="Cambiar foto de perfil"></cajon-texto>
                    <cajon-texto label="Editar biografía o descripción personal"></cajon-texto>
                    <cajon-texto label="Seleccionar idioma de la app"></cajon-texto>
                    <cajon-texto label="Configurar quién puede ver mi perfil (público/privado)"></cajon-texto>
                    <cajon-texto label="Borrar historial de búsqueda"></cajon-texto>
                    <cajon-texto label="Elegir color principal de la interfaz"></cajon-texto>
                    <cajon-texto label="Cambiar tema (claro/oscuro/sistema)"></cajon-texto>
                    <cajon-texto label="Tamaño del texto"></cajon-texto>
                    <cajon-texto label="Cerrar sesión"></cajon-texto>
                </div>
            `;
        }
    }

    connectedCallback() {
        this.setupEventListeners();
    }

    // Configura los eventos de navegación
    private setupEventListeners() {
        if (!this.shadowRoot) return;

        this.shadowRoot.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const cajonTexto = target.closest('cajon-texto');
            
            if (cajonTexto) {
                const route = cajonTexto.getAttribute('data-route');
                
                if (route) {
                    // Envía evento de navegación
                    const navigationEvent = new CustomEvent('navigate', { 
                        detail: route,
                        bubbles: true,
                        composed: true
                    });
                    
                    document.dispatchEvent(navigationEvent);
                }
            }
        });
    }
}

export default CajonList;