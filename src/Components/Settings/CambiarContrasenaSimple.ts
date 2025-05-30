// Este es un componente web personalizado para cambiar contraseñas
class CambiarContrasenaSimple extends HTMLElement {
    constructor() {
        super(); // Llamamos al constructor de la clase padre HTMLElement
        // Creamos un shadow DOM para aislar los estilos de este componente
        this.attachShadow({ mode: 'open' });
        // Dibujamos todo el contenido del componente en pantalla
        this.render();
    }
    
    // Este método se ejecuta automáticamente cuando el componente se agrega al DOM
    connectedCallback() {
        // Configuramos todos los eventos (clicks, cambios, etc.)
        this.setupEventListeners();
    }
    
    // Esta función dibuja todo el HTML y CSS del formulario
    private render() {
        // Si no hay shadow DOM, salimos de la función
        if (!this.shadowRoot) return;
        
        // Definimos todo el HTML y CSS del componente
        this.shadowRoot.innerHTML = `
            <style>
                /* Estilos para el componente principal */
                :host {
                    display: block; /* El componente se muestra como un bloque */
                    font-family: Arial, sans-serif; /* Fuente de texto */
                    height: 100%; /* Ocupa toda la altura disponible */
                }
                
                /* Estilos para el contenedor del formulario */
                .form-container {
                    background-color: white; /* Fondo blanco */
                    border-radius: 16px; /* Bordes redondeados */
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Sombra suave */
                    padding: 32px; /* Espacio interno */
                    max-width: 600px; /* Ancho máximo */
                }
                
                /* Estilos para el botón de "Volver" */
                .back-button {
                    background: none; /* Sin fondo */
                    border: none; /* Sin borde */
                    cursor: pointer; /* Cursor de mano al pasar por encima */
                    display: flex; /* Los elementos se alinean en fila */
                    align-items: center; /* Centrados verticalmente */
                    padding: 8px 0; /* Espacio interno arriba y abajo */
                    color: #666; /* Color gris */
                    font-size: 16px; /* Tamaño de texto */
                    margin-bottom: 16px; /* Espacio hacia abajo */
                }
                
                /* Estilos para la flecha del botón volver */
                .back-arrow {
                    margin-right: 8px; /* Espacio a la derecha de la flecha */
                }
                
                /* Estilos para el título principal */
                .title {
                    font-size: 22px; /* Tamaño de texto grande */
                    font-weight: bold; /* Texto en negrita */
                    color: #000; /* Color negro */
                    margin: 0 0 24px 0; /* Solo margen hacia abajo */
                }
                
                /* Estilos para los campos de entrada de texto */
                .input-field {
                    width: 100%; /* Ocupa todo el ancho */
                    padding: 14px; /* Espacio interno */
                    font-size: 16px; /* Tamaño de texto */
                    border: 1px solid #ddd; /* Borde gris claro */
                    border-radius: 8px; /* Bordes redondeados */
                    margin-bottom: 16px; /* Espacio hacia abajo */
                    box-sizing: border-box; /* Incluye padding y border en el ancho */
                }
                
                /* Estilos para el texto de ejemplo en los campos */
                .input-field::placeholder {
                    color: #aaa; /* Color gris claro para el placeholder */
                }
                
                /* Estilos para el botón de "Guardar" */
                .save-button {
                    background-color: #b4c13b; /* Color verde */
                    color: white; /* Texto blanco */
                    border: none; /* Sin borde */
                    padding: 12px 24px; /* Espacio interno */
                    border-radius: 8px; /* Bordes redondeados */
                    font-weight: 600; /* Texto semi-negrita */
                    cursor: pointer; /* Cursor de mano */
                    font-size: 16px; /* Tamaño de texto */
                    margin-top: 8px; /* Espacio hacia arriba */
                }
                
                /* Efecto cuando pasas el mouse sobre el botón guardar */
                .save-button:hover {
                    background-color: #9aa732; /* Color verde más oscuro */
                }
            </style>
            
            <!-- Botón para volver atrás -->
            <button id="back-btn" class="back-button">
                <span class="back-arrow">←</span> Volver
            </button>
            
            <!-- Contenedor principal del formulario -->
            <div class="form-container">
                <!-- Título del formulario -->
                <h2 class="title">Cambiar contraseña</h2>
                
                <!-- Campo para escribir la contraseña actual -->
                <input type="password" id="current-password" class="input-field" placeholder="Contraseña actual">
                <!-- Campo para escribir la nueva contraseña -->
                <input type="password" id="new-password" class="input-field" placeholder="Nueva Contraseña">
                
                <!-- Botón para guardar los cambios -->
                <button id="save-btn" class="save-button">Guardar</button>
            </div>
        `;
    }
    
    // Esta función configura todos los eventos del formulario (clicks, etc.)
    private setupEventListeners() {
        // Si no hay shadow DOM, salimos de la función
        if (!this.shadowRoot) return;
        
        // Buscamos el botón de "Volver" en el formulario
        const backButton = this.shadowRoot.querySelector('#back-btn');
        if (backButton) {
            // Cuando alguien hace click en "Volver"
            backButton.addEventListener('click', () => {
                // Enviamos un mensaje (evento) diciendo que se quiere volver
                this.dispatchEvent(new CustomEvent('back', { 
                    bubbles: true,    // El evento puede subir por el DOM
                    composed: true    // El evento puede salir del shadow DOM
                }));
            });
        }
        
        // Buscamos el botón de "Guardar" en el formulario
        const saveButton = this.shadowRoot.querySelector('#save-btn');
        if (saveButton) {
            // Cuando alguien hace click en "Guardar"
            saveButton.addEventListener('click', () => {
                // Obtenemos los campos de contraseña
                const currentPasswordField = this.shadowRoot?.querySelector('#current-password') as HTMLInputElement;
                const newPasswordField = this.shadowRoot?.querySelector('#new-password') as HTMLInputElement;
                
                // Si ambos campos existen
                if (currentPasswordField && newPasswordField) {
                    // Obtenemos lo que escribió el usuario en cada campo
                    const currentPassword = currentPasswordField.value;
                    const newPassword = newPasswordField.value;
                    
                    // Si el usuario escribió algo en ambos campos
                    if (currentPassword && newPassword) {
                        // Enviamos un mensaje (evento) con las contraseñas para guardar
                        this.dispatchEvent(new CustomEvent('save', { 
                            detail: { currentPassword, newPassword }, // Datos a enviar
                            bubbles: true,    // El evento puede subir por el DOM
                            composed: true    // El evento puede salir del shadow DOM
                        }));
                    }
                }
            });
        }
    }
}

// Exportamos la clase para que pueda ser usada en otros archivos
export default CambiarContrasenaSimple;