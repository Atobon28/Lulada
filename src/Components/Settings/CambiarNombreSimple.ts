// Importamos las herramientas de Flux que necesitamos para manejar los datos del usuario
import { userStore, UserState } from "../../Services/flux/UserStore";
import { UserData } from "../../Services/flux/UserActions";

// Esta es la clase principal que crea nuestro componente web personalizado
class CambiarNombreSimple extends HTMLElement {
    
    // Variables que guarda información importante dentro del componente
    private username: string = '';                  // El nombre de usuario que vemos en pantalla
    private currentUser: UserData | null = null;    // Toda la información del usuario (nombre, foto, etc.)
    private storeListener = this.handleStoreChange.bind(this);  // Una función que escucha cuando cambian los datos
    
    // Esta función se ejecuta cuando se crea el componente por primera vez
    constructor() {
        super(); // Llamamos al constructor del elemento HTML básico
        // Creamos una "caja" especial donde pondremos nuestro HTML y CSS (shadow DOM)
        this.attachShadow({ mode: 'open' });
        console.log(' CambiarNombreSimple: Componente creado');
    }
    
    // Le decimos al navegador qué atributos HTML queremos vigilar
    // Si cambian, nos avisará automáticamente
    static get observedAttributes() {
        return ['username']; // Solo vigilamos el atributo "username"
    }
    
    // Esta función se ejecuta cuando cambia un atributo que estamos vigilando
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        // Si cambió el username y es diferente al anterior
        if (name === 'username' && oldValue !== newValue) {
            console.log(`El atributo username cambió de "${oldValue}" a "${newValue}"`);
            this.username = newValue; // Guardamos el nuevo valor
            this.render(); // Volvemos a dibujar el componente
        }
    }
    
    // Esta función se ejecuta cuando el componente se pone en la página web
    connectedCallback() {
        console.log(' CambiarNombreSimple: El componente se conectó al DOM');
        
        // PASO 1: Nos apuntamos para recibir avisos cuando cambien los datos del usuario
        userStore.subscribe(this.storeListener);
        console.log(' Nos suscribimos al UserStore para recibir actualizaciones');
        
        // PASO 2: Preguntamos cuál es la información actual del usuario
        const currentUser = userStore.getCurrentUser();
        if (currentUser) {
            console.log(' Datos del usuario encontrados:', currentUser.nombreDeUsuario);
            this.username = currentUser.nombreDeUsuario; // Guardamos su nombre de usuario
            this.currentUser = currentUser; // Guardamos toda su información
        }
        
        // PASO 3: Dibujamos el formulario en la pantalla
        this.render();
        
        // PASO 4: Configuramos los botones para que funcionen cuando los presionen
        this.setupEventListeners();
    }

    // Esta función se ejecuta cuando el componente se quita de la página
    disconnectedCallback() {
        console.log(' CambiarNombreSimple: El componente se desconectó del DOM');
        
        // Dejamos de recibir avisos para no gastar memoria innecesariamente
        userStore.unsubscribe(this.storeListener);
        console.log(' Nos desuscribimos del UserStore');
    }

    // Esta función se ejecuta cada vez que los datos del usuario cambian
    // Es como un "detector" que nos avisa automáticamente
    private handleStoreChange(state: UserState): void {
        const newUser = state.currentUser; // Obtenemos los datos nuevos del usuario
        
        // Verificamos si realmente cambió algo importante
        if (JSON.stringify(this.currentUser) !== JSON.stringify(newUser)) {
            console.log(' Los datos del usuario cambiaron en Flux:', newUser?.nombreDeUsuario);
            
            // Actualizamos nuestra información local con los datos nuevos
            this.currentUser = newUser ? { ...newUser } : null;
            
            if (newUser) {
                this.username = newUser.nombreDeUsuario; // Actualizamos el nombre que mostramos
                this.updateUsernameDisplay(); // Actualizamos solo los textos que cambiaron
            }
        }
    }

    // Esta función actualiza solo los textos que muestran el nombre de usuario
    // Es más rápido que volver a dibujar todo el formulario
    private updateUsernameDisplay(): void {
        if (!this.shadowRoot) return; // Si no tenemos nuestra "caja" especial, no podemos hacer nada
        
        // Buscamos los lugares donde mostramos el nombre de usuario
        const subtitle2El = this.shadowRoot.querySelector('.subtitle2');
        const currentUsernameEl = this.shadowRoot.querySelector('.current-username-display');
        
        // Cambiamos el texto de esos lugares con el nombre nuevo
        if (subtitle2El) {
            subtitle2El.textContent = this.username;
        }
        
        if (currentUsernameEl) {
            currentUsernameEl.textContent = this.username;
        }
        
        console.log('Username actualizado en la interfaz:', this.username);
    }
    
    // Esta función dibuja todo el formulario (HTML y estilos CSS)
    private render() {
        if (!this.shadowRoot) return; // Si no tenemos nuestra "caja" especial, no podemos dibujar
        
        console.log(' Dibujando el componente con username:', this.username);
        
        // Aquí creamos todo el HTML del formulario con sus estilos
        this.shadowRoot.innerHTML = `
            <style>
               /* Estilos CSS - hacen que el formulario se vea bonito */
                :host {
                    display: block; /* El componente ocupa todo el ancho */
                    font-family: Arial, sans-serif; /* Tipo de letra */
                    height: 100%; /* Altura completa */
                }
                
                .form-container {
                    background-color: white; /* Fondo blanco */
                    border-radius: 16px; /* Esquinas redondeadas */
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Sombra suave */
                    padding: 32px; /* Espacio interno */
                    max-width: 600px; /* Ancho máximo */
                }
                
                .back-button {
                    background: none; /* Sin color de fondo */
                    border: none; /* Sin borde */
                    cursor: pointer; /* Manita cuando pasas el mouse */
                    display: flex; /* Elementos en fila */
                    align-items: center; /* Centrados verticalmente */
                    padding: 8px 0;
                    color: #666; /* Color gris */
                    font-size: 16px;
                    margin-bottom: 16px;
                    transition: color 0.2s ease; /* Animación suave al cambiar color */
                }
                
                .back-button:hover {
                    color: #333; /* Color más oscuro cuando pasas el mouse */
                }
                
                .back-arrow {
                    margin-right: 8px; /* Espacio entre la flecha y el texto */
                }
                
                .title {
                    font-size: 22px;
                    font-weight: bold; /* Texto en negritas */
                    color: #000;
                    margin: 0 0 8px 0;
                }
                
                .subtitle {
                    font-size: 16px;
                    color: #aaa; /* Color gris clarito */
                    margin: 0 0 4px 0;
                }
                
                .subtitle2 {
                    font-size: 16px;
                    margin: 0 0 4px 0;
                    font-weight: 500; /* Un poco en negritas */
                    color: #333;
                }
                
                .current-username {
                    font-size: 16px;
                    color: #333;
                    margin-bottom: 24px;
                    padding: 12px; /* Espacio interno */
                    background-color: #f5f5f5; /* Fondo gris clarito */
                    border-radius: 8px; /* Esquinas redondeadas */
                    border-left: 4px solid #AAAB54; /* Borde verde del lado izquierdo */
                }
                
                .input-field {
                    width: 100%; /* Ocupa todo el ancho disponible */
                    padding: 14px;
                    font-size: 16px;
                    border: 1px solid #ddd; /* Borde gris clarito */
                    border-radius: 8px;
                    margin-bottom: 24px;
                    box-sizing: border-box; /* Incluye el padding en el ancho total */
                    transition: border-color 0.2s ease; /* Animación suave del borde */
                }
                
                .input-field:focus {
                    outline: none; /* Quita el borde azul del navegador */
                    border-color:rgb(201, 202, 136); /* Borde verde cuando haces click */
                    box-shadow: 0 0 5px rgba(170, 171, 84, 0.3); /* Sombra verde suave */
                }
                
                .input-field::placeholder {
                    color: #ccc; /* Color del texto de ejemplo */
                }
                
                .save-button {
                    background-color: #b4c13b; /* Color verde del botón */
                    color: white; /* Texto blanco */
                    border: none; /* Sin borde */
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600; /* Texto en negritas */
                    cursor: pointer; /* Manita cuando pasas el mouse */
                    font-size: 16px;
                    transition: all 0.2s ease; /* Animaciones suaves */
                }
                
                .save-button:hover {
                    background-color: #9aa732; /* Color más oscuro cuando pasas el mouse */
                    transform: translateY(-2px); /* Se levanta un poquito */
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2); /* Sombra más fuerte */
                }

                .save-button:disabled {
                    background-color: #ccc; /* Color gris cuando no se puede usar */
                    cursor: not-allowed; /* Símbolo de prohibido */
                    transform: none; /* No se levanta */
                    box-shadow: none; /* Sin sombra */
                }

                .save-button.loading {
                    background-color: #999; /* Color gris cuando está guardando */
                    cursor: wait; /* Símbolo de espera */
                }

                /* Animación de entrada suave */
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-10px); } /* Empieza invisible y arriba */
                    to { opacity: 1; transform: translateY(0); } /* Termina visible en su lugar */
                }
            </style>
            
            <!-- Botón para regresar -->
            <button id="back-btn" class="back-button">
                <span class="back-arrow">←</span> Volver
            </button>
            
            <!-- Caja principal del formulario -->
            <div class="form-container">
                <h2 class="title">Cambiar nombre de usuario</h2>
                <p class="subtitle">Nombre de usuario actual</p>
                <div class="current-username">
                    <span class="current-username-display">${this.username || '@CrisTiJauregui'}</span>
                </div>
                
                <!-- Cajita donde el usuario escribe el nuevo nombre -->
                <input type="text" id="username-input" class="input-field" placeholder="Nuevo nombre de usuario">
                
                <!-- Botón para guardar los cambios -->
                <button id="save-btn" class="save-button">Guardar</button>
            </div>
        `;
    }
    
    // Esta función hace que los botones funcionen cuando los presionas
    private setupEventListeners() {
        if (!this.shadowRoot) return; // Si no tenemos nuestra "caja" especial, no podemos hacer nada
        
        // Configuramos el botón "Volver"
        const backButton = this.shadowRoot.querySelector('#back-btn');
        if (backButton) {
            // Cuando presionas "Volver", enviamos un mensaje a otros componentes
            backButton.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('back', { 
                    bubbles: true,    // El mensaje puede viajar hacia arriba
                    composed: true    // El mensaje puede salir de nuestra "caja" especial
                }));
            });
        }
        
        // Configuramos el botón "Guardar"
        const saveButton = this.shadowRoot.querySelector('#save-btn');
        if (saveButton) {
            // Cuando presionas "Guardar", ejecutamos la función para guardar
            saveButton.addEventListener('click', this.handleSaveClick.bind(this));
        }

        // Configuramos la cajita donde escribes
        const usernameInput = this.shadowRoot.querySelector('#username-input') as HTMLInputElement;
        if (usernameInput) {
            // Cada vez que escribes algo, verificamos si puedes guardar
            usernameInput.addEventListener('input', this.validateInput.bind(this));
        }
    }

    // Esta función verifica si el botón "Guardar" debe estar disponible o no
    private validateInput(): void {
        const usernameInput = this.shadowRoot?.querySelector('#username-input') as HTMLInputElement;
        const saveButton = this.shadowRoot?.querySelector('#save-btn') as HTMLButtonElement;
        
        if (usernameInput && saveButton) {
            const value = usernameInput.value.trim(); // Lo que escribiste, sin espacios extra
            const currentUsernameWithoutAt = this.username.replace('@', ''); // El nombre actual sin el @
            
            // Deshabilitamos el botón si:
            // 1. No escribiste nada, O
            // 2. El nombre nuevo es igual al que ya tienes
            saveButton.disabled = value.length === 0 || value === currentUsernameWithoutAt;
        }
    }

    // Esta función se ejecuta cuando presionas el botón "Guardar"
    private handleSaveClick(): void {
        console.log(' El usuario hizo click en el botón Guardar');
        
        // Obtenemos las partes del formulario que necesitamos
        const inputField = this.shadowRoot?.querySelector('#username-input') as HTMLInputElement;
        const saveButton = this.shadowRoot?.querySelector('#save-btn') as HTMLButtonElement;
        
        // Verificamos que hayas escrito algo
        if (!inputField || !inputField.value.trim()) {
            console.log(' El campo de texto está vacío');
            return; // Salimos sin hacer nada
        }

        const newUsername = inputField.value.trim(); // El nuevo nombre que escribiste
        console.log('Intentando cambiar el username a:', newUsername);
        
        // Verificamos que el sistema de datos esté disponible
        if (!window.UserActions) {
            console.error(' UserActions no está disponible en window');
            alert('Error: Sistema de usuario no disponible');
            return;
        }

        if (!window.userStore) {
            console.error(' userStore no está disponible en window');
            alert('Error: Almacén de usuario no disponible');
            return;
        }
        
        // Cambiamos el botón para mostrar que está trabajando
        saveButton.disabled = true;
        saveButton.classList.add('loading');
        saveButton.textContent = 'Guardando...';
        
        try {
            console.log(' Enviando el cambio de username al sistema Flux...');
            
            // AQUÍ ES DONDE SE GUARDA EL CAMBIO
            // Le decimos al sistema que actualice el nombre de usuario
            window.UserActions.updateUsername(newUsername);
            
            console.log('Comando enviado a Flux correctamente');
            
            // Borramos lo que escribiste en la cajita
            inputField.value = '';
            
            // Mostramos un mensaje de que todo salió bien
            this.showSuccessMessage();
            
            console.log(' Proceso de guardado completado!');
            
            // También enviamos un mensaje por si otros componentes lo necesitan
            this.dispatchEvent(new CustomEvent('save', { 
                detail: { newUsername }, // Incluimos el nuevo nombre en el mensaje
                bubbles: true,
                composed: true
            }));
            
        } catch (error) {
            // Si algo salió mal, le avisamos al usuario
            console.error(' Error al actualizar el username:', error);
            alert('Error al guardar el cambio. Por favor intenta de nuevo.');
        } finally {
            // Regresamos el botón a como estaba antes
            setTimeout(() => {
                saveButton.disabled = false;
                saveButton.classList.remove('loading');
                saveButton.textContent = 'Guardar';
                this.validateInput(); // Verificamos otra vez si debe estar habilitado
            }, 1000); // Esperamos un segundo para que se vea el cambio
        }
    }

    // Esta función muestra un mensaje verde de que todo salió bien
    private showSuccessMessage(): void {
        const toast = document.createElement('div'); // Creamos una cajita para el mensaje
        // Le damos estilos bonitos al mensaje
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            z-index: 10001;
            font-family: Arial, sans-serif;
            font-weight: 600;
            box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3);
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        toast.textContent = ' Tu nombre de usuario cambió con éxito'; // El texto del mensaje
        
        document.body.appendChild(toast); // Ponemos el mensaje en la página
        
        // Animación de entrada (aparece deslizándose)
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Animación de salida y eliminamos el mensaje
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 400);
        }, 3000); // Después de 3 segundos se va
    }
}

export default CambiarNombreSimple;