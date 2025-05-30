// Este es un componente web personalizado que permite cambiar el correo electrónico del usuario
class CambiarCorreoSimple extends HTMLElement {
    // Variable privada que guarda el correo actual del usuario
    private email: string;
    
    // Constructor: se ejecuta cuando se crea una nueva instancia del componente
    constructor() {
        super(); // Llama al constructor de la clase padre (HTMLElement)
        
        // Obtiene el valor del atributo 'email' del HTML, si no existe usa un texto vacío
        this.email = this.getAttribute('email') || '';
        
        // Crea un Shadow DOM para aislar el CSS y HTML de este componente
        this.attachShadow({ mode: 'open' });
        
        // Dibuja el componente en la pantalla
        this.render();
    }
    
    // Lista de atributos HTML que este componente debe "observar" por cambios
    static get observedAttributes() {
        return ['email']; // Solo observamos el atributo 'email'
    }
    
    // Se ejecuta automáticamente cuando un atributo observado cambia
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        // Si el atributo 'email' cambió y es diferente al valor anterior
        if (name === 'email' && oldValue !== newValue) {
            this.email = newValue; // Actualiza la variable interna
            this.render(); // Vuelve a dibujar el componente con el nuevo valor
        }
    }
    
    // Se ejecuta cuando el componente se añade al DOM de la página
    connectedCallback() {
        this.setupEventListeners(); // Configura los eventos (clicks, etc.)
    }
    
    // Función privada que dibuja todo el HTML y CSS del componente
    private render() {
        // Si no existe el Shadow DOM, no puede dibujar nada
        if (!this.shadowRoot) return;
        
        // Aquí se define todo el HTML y CSS que verá el usuario
        this.shadowRoot.innerHTML = `
            <style>
                /* ===== ESTILOS CSS ===== */
                
                /* El componente ocupa todo el espacio disponible */
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                    height: 100%;
                }
                
                /* Contenedor principal del formulario con fondo blanco y sombra */
                .form-container {
                    background-color: white;
                    border-radius: 16px; /* Bordes redondeados */
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Sombra suave */
                    padding: 32px; /* Espacio interno */
                    max-width: 600px; /* Ancho máximo */
                }
                
                /* Botón "Volver" - sin fondo, solo texto y flecha */
                .back-button {
                    background: none;
                    border: none;
                    cursor: pointer; /* Cursor de mano al pasar por encima */
                    display: flex;
                    align-items: center;
                    padding: 8px 0;
                    color: #666; /* Color gris */
                    font-size: 16px;
                    margin-bottom: 16px;
                }
                
                /* Flecha del botón "Volver" */
                .back-arrow {
                    margin-right: 8px;
                }
                
                /* Título principal del formulario */
                .title {
                    font-size: 22px;
                    font-weight: bold;
                    color: #000;
                    margin: 0 0 8px 0;
                }
                
                /* Texto descriptivo gris claro */
                .subtitle {
                    font-size: 16px;
                    color: #aaa;
                    margin: 0 0 4px 0;
                }
                
                /* Texto descriptivo normal */
                .subtitle2 {
                    font-size: 16px;
                    margin: 0 0 4px 0;
                }
                
                /* Texto que muestra el correo actual */
                .current-email {
                    font-size: 16px;
                    color: #333;
                    margin-bottom: 24px;
                }
                
                /* Campo de texto donde el usuario escribe el nuevo correo */
                .input-field {
                    width: 100%; /* Ocupa todo el ancho */
                    padding: 14px; /* Espacio interno */
                    font-size: 16px;
                    border: 1px solid #ddd; /* Borde gris claro */
                    border-radius: 8px; /* Bordes redondeados */
                    margin-bottom: 24px;
                    box-sizing: border-box; /* Incluye padding en el ancho total */
                }
                
                /* Texto de ejemplo dentro del campo de entrada */
                .input-field::placeholder {
                    color: #ccc; /* Color gris claro */
                }
                
                /* Botón "Guardar" con color verde */
                .save-button {
                    background-color: #b4c13b; /* Verde */
                    color: white; /* Texto blanco */
                    border: none; /* Sin borde */
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600; /* Texto en negrita */
                    cursor: pointer; /* Cursor de mano */
                    font-size: 16px;
                }
                
                /* Efecto cuando pasas el mouse sobre el botón "Guardar" */
                .save-button:hover {
                    background-color: #9aa732; /* Verde más oscuro */
                }
            </style>
            
            <!-- ===== HTML DEL COMPONENTE ===== -->
            
            <!-- Botón "Volver" con flecha -->
            <button id="back-btn" class="back-button">
                <span class="back-arrow">←</span> Volver
            </button>
            
            <!-- Contenedor principal del formulario -->
            <div class="form-container">
                <!-- Título del formulario -->
                <h2 class="title">Cambiar correo</h2>
                <!-- Texto que dice "Correo actual" -->
                <p class="subtitle">Correo actual</p>
                <!-- Muestra el correo actual (fijo en este caso) -->
                <p class="subtitle2">cristijau@gmail.com</p>
                
                <!-- Campo donde el usuario escribe el nuevo correo -->
                <input type="email" id="email-input" class="input-field" placeholder="Correo nuevo">
                
                <!-- Botón para guardar los cambios -->
                <button id="save-btn" class="save-button">Guardar</button>
            </div>
        `;
    }
    
    // Función privada que configura todos los eventos (clicks, cambios de texto, etc.)
    private setupEventListeners() {
        // Si no existe el Shadow DOM, no puede configurar eventos
        if (!this.shadowRoot) return;
        
        // Busca el botón "Volver" en el HTML
        const backButton = this.shadowRoot.querySelector('#back-btn');
        if (backButton) {
            // Cuando se hace click en "Volver"
            backButton.addEventListener('click', () => {
                // Envía un evento personalizado llamado 'back' hacia afuera del componente
                this.dispatchEvent(new CustomEvent('back', { 
                    bubbles: true,    // El evento puede subir por el DOM
                    composed: true    // El evento puede salir del Shadow DOM
                }));
            });
        }
        
        // Busca el botón "Guardar" en el HTML
        const saveButton = this.shadowRoot.querySelector('#save-btn');
        if (saveButton) {
            // Cuando se hace click en "Guardar"
            saveButton.addEventListener('click', () => {
                // Busca el campo de texto del correo
                const inputField = this.shadowRoot?.querySelector('#email-input') as HTMLInputElement;
                
                // Si el campo existe y tiene texto escrito
                if (inputField && inputField.value) {
                    const newEmail = inputField.value; // Obtiene el nuevo correo
                    
                    // Envía un evento personalizado llamado 'save' con el nuevo correo
                    this.dispatchEvent(new CustomEvent('save', { 
                        detail: { newEmail }, // Incluye el nuevo correo en los datos del evento
                        bubbles: true,
                        composed: true
                    }));
                }
            });
        }
    }
}

// Exporta el componente para que pueda ser usado en otros archivos
export default CambiarCorreoSimple;