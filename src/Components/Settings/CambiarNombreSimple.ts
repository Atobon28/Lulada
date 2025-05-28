// src/Components/Settings/CambiarNombreSimple.ts - CORREGIDO PARA QUE FUNCIONE EL BOTÓN GUARDAR

// Importamos las herramientas de Flux que necesitamos para manejar los datos del usuario
import { userStore, UserState } from "../../Services/flux/UserStore";
import { UserData } from "../../Services/flux/UserActions";

class CambiarNombreSimple extends HTMLElement {
    
    // Estas variables almacenan el estado interno del componente
    private username: string = '';                  // El nombre de usuario actual que se muestra en la interfaz
    private currentUser: UserData | null = null;    // Todos los datos del usuario (foto, nombre, descripción, etc.)
    private storeListener = this.handleStoreChange.bind(this);  // Función que se ejecuta cuando cambian los datos en Flux
    
    constructor() {
        super(); // Llamamos al constructor de HTMLElement
        // Creamos el shadow DOM en modo 'open' para aislar los estilos de este componente
        this.attachShadow({ mode: 'open' });
        console.log('🔧 CambiarNombreSimple: Componente creado');
    }
    
    // Define qué atributos HTML del componente deben ser "observados"
    // Cuando estos atributos cambien, se ejecutará automáticamente attributeChangedCallback
    static get observedAttributes() {
        return ['username']; // Solo observamos cambios en el atributo "username"
    }
    
    // Este método se ejecuta automáticamente cuando cambia un atributo observado
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'username' && oldValue !== newValue) {
            console.log(`El atributo username cambió de "${oldValue}" a "${newValue}"`);
            this.username = newValue; // Actualizamos la propiedad interna
            this.render(); // Volvemos a dibujar el componente con el nuevo valor
        }
    }
    
    // Este método se ejecuta cuando el componente se añade al DOM de la página
    // Aquí es donde conectamos el componente con el sistema Flux
    connectedCallback() {
        console.log('🔧 CambiarNombreSimple: El componente se conectó al DOM');
        
        // PASO 1: Nos "suscribimos" al UserStore para recibir notificaciones
        // Esto significa que cada vez que cambien los datos del usuario en Flux,
        // nuestro componente se enterará automáticamente
        userStore.subscribe(this.storeListener);
        console.log('📡 Nos suscribimos al UserStore para recibir actualizaciones');
        
        // PASO 2: Obtenemos los datos actuales del usuario desde Flux
        // Al conectarse, el componente necesita saber cuál es el username actual
        const currentUser = userStore.getCurrentUser();
        if (currentUser) {
            console.log('👤 Datos del usuario encontrados:', currentUser.nombreDeUsuario);
            this.username = currentUser.nombreDeUsuario; // Guardamos el username actual
            this.currentUser = currentUser; // Guardamos todos los datos del usuario
        }
        
        // PASO 3: Dibujamos el componente en la pantalla
        this.render();
        
        // PASO 4: Configuramos los eventos (clicks, cambios de texto, etc.)
        this.setupEventListeners();
    }

    // Este método se ejecuta cuando el componente se quita del DOM
    // Es importante hacer "limpieza" para evitar problemas de memoria
    disconnectedCallback() {
        console.log('🔌 CambiarNombreSimple: El componente se desconectó del DOM');
        
        // Nos "desuscribimos" del UserStore para dejar de recibir notificaciones
        // Si no hacemos esto, el componente seguiría recibiendo notificaciones aunque ya no exista
        userStore.unsubscribe(this.storeListener);
        console.log('🔌 Nos desuscribimos del UserStore');
    }

    // Esta función se ejecuta cada vez que cambian los datos del usuario en Flux
    // Es como un "detector de cambios" que actualiza automáticamente la interfaz
    private handleStoreChange(state: UserState): void {
        const newUser = state.currentUser; // Obtenemos los nuevos datos del usuario
        
        // Comparamos si realmente hubo cambios (para evitar actualizaciones innecesarias)
        if (JSON.stringify(this.currentUser) !== JSON.stringify(newUser)) {
            console.log('🔄 Los datos del usuario cambiaron en Flux:', newUser?.nombreDeUsuario);
            
            // Actualizamos nuestros datos locales con los nuevos datos
            this.currentUser = newUser ? { ...newUser } : null; // Hacemos una copia de los datos
            
            if (newUser) {
                this.username = newUser.nombreDeUsuario; // Actualizamos el username mostrado
                this.updateUsernameDisplay(); // Actualizamos solo los elementos que muestran el username
            }
        }
    }

    // Esta función actualiza solo los elementos del DOM que muestran el username
    // Es más eficiente que volver a dibujar todo el componente
    private updateUsernameDisplay(): void {
        if (!this.shadowRoot) return; // Si no hay shadow DOM, no podemos actualizar nada
        
        // Buscamos los elementos que muestran el username actual
        const subtitle2El = this.shadowRoot.querySelector('.subtitle2'); // El texto "Nombre de usuario actual"
        const currentUsernameEl = this.shadowRoot.querySelector('.current-username-display'); // La caja gris con el username
        
        // Actualizamos el texto de estos elementos con el nuevo username
        if (subtitle2El) {
            subtitle2El.textContent = this.username;
        }
        
        if (currentUsernameEl) {
            currentUsernameEl.textContent = this.username;
        }
        
        console.log('✅ Username actualizado en la interfaz:', this.username);
    }
    
    // Esta función dibuja todo el HTML y CSS del componente
    // Es como el "pincel" que pinta la interfaz en la pantalla
    private render() {
        if (!this.shadowRoot) return; // Si no hay shadow DOM, no podemos dibujar nada
        
        console.log('🎨 Dibujando el componente con username:', this.username);
        
        // Definimos todo el HTML y CSS del formulario dentro del shadow DOM
        this.shadowRoot.innerHTML = `
            <style>
               
                :host {
                    display: block; /* El componente ocupa todo el ancho disponible */
                    font-family: Arial, sans-serif; /* Fuente de texto */
                    height: 100%; /* Altura completa */
                }
                
                .form-container {
                    background-color: white; /* Fondo blanco */
                    border-radius: 16px; /* Bordes redondeados */
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Sombra suave */
                    padding: 32px; /* Espacio interno */
                    max-width: 600px; /* Ancho máximo */
                }
                
                .back-button {
                    background: none; /* Sin fondo */
                    border: none; /* Sin borde */
                    cursor: pointer; /* Cursor de mano al pasar por encima */
                    display: flex; /* Elementos en fila */
                    align-items: center; /* Centrados verticalmente */
                    padding: 8px 0;
                    color: #666; /* Color gris */
                    font-size: 16px;
                    margin-bottom: 16px;
                    transition: color 0.2s ease; /* Animación suave al cambiar color */
                }
                
                .back-button:hover {
                    color: #333; /* Color más oscuro al pasar el mouse */
                }
                
                .back-arrow {
                    margin-right: 8px; /* Espacio entre la flecha y el texto */
                }
                
                .title {
                    font-size: 22px;
                    font-weight: bold; /* Texto en negrita */
                    color: #000;
                    margin: 0 0 8px 0;
                }
                
                .subtitle {
                    font-size: 16px;
                    color: #aaa; /* Color gris claro */
                    margin: 0 0 4px 0;
                }
                
                .subtitle2 {
                    font-size: 16px;
                    margin: 0 0 4px 0;
                    font-weight: 500; /* Ligeramente en negrita */
                    color: #333;
                }
                
                .current-username {
                    font-size: 16px;
                    color: #333;
                    margin-bottom: 24px;
                    padding: 12px; /* Espacio interno */
                    background-color: #f5f5f5; /* Fondo gris claro */
                    border-radius: 8px; /* Bordes redondeados */
                    border-left: 4px solid #AAAB54; /* Borde izquierdo verde */
                }
                
                .input-field {
                    width: 100%; /* Ocupa todo el ancho */
                    padding: 14px;
                    font-size: 16px;
                    border: 1px solid #ddd; /* Borde gris claro */
                    border-radius: 8px;
                    margin-bottom: 24px;
                    box-sizing: border-box; /* Incluye padding y border en el ancho total */
                    transition: border-color 0.2s ease; /* Animación suave al cambiar el borde */
                }
                
                .input-field:focus {
                    outline: none; /* Quita el borde azul por defecto del navegador */
                    border-color:rgb(201, 202, 136); /* Borde verde al enfocar */
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
                    font-weight: 600; /* Texto en negrita */
                    cursor: pointer; /* Cursor de mano */
                    font-size: 16px;
                    transition: all 0.2s ease; /* Animación suave para todos los cambios */
                }
                
                .save-button:hover {
                    background-color: #9aa732; /* Color más oscuro al pasar el mouse */
                    transform: translateY(-2px); /* Se eleva ligeramente */
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2); /* Sombra más pronunciada */
                }

                .save-button:disabled {
                    background-color: #ccc; /* Color gris cuando está deshabilitado */
                    cursor: not-allowed; /* Cursor de prohibido */
                    transform: none; /* Sin elevación */
                    box-shadow: none; /* Sin sombra */
                }

                .save-button.loading {
                    background-color: #999;
                    cursor: wait;
                }

                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-10px); } /* Empieza invisible y arriba */
                    to { opacity: 1; transform: translateY(0); } /* Termina visible y en posición */
                }
            </style>
            
            <!-- Botón para volver atrás -->
            <button id="back-btn" class="back-button">
                <span class="back-arrow">←</span> Volver
            </button>
            
            <!-- Formulario principal -->
            <div class="form-container">
                <h2 class="title">Cambiar nombre de usuario</h2>
                <p class="subtitle">Nombre de usuario actual</p>
                <div class="current-username">
                    <span class="current-username-display">${this.username || '@CrisTiJauregui'}</span>
                </div>
                
                <!-- Campo de texto donde el usuario escribe el nuevo username -->
                <input type="text" id="username-input" class="input-field" placeholder="Nuevo nombre de usuario">
                
                <!-- Botón para guardar los cambios -->
                <button id="save-btn" class="save-button">Guardar</button>
            </div>
        `;
    }
    
    // Esta función configura todos los eventos del componente (clicks, cambios de texto, etc.)
    // Es como conectar los "cables" entre los botones y las funciones
    private setupEventListeners() {
        if (!this.shadowRoot) return; // Si no hay shadow DOM, no podemos configurar eventos
        
        // Configuramos el botón "Volver"
        const backButton = this.shadowRoot.querySelector('#back-btn');
        if (backButton) {
            // Cuando se hace click en "Volver", emitimos un evento personalizado
            backButton.addEventListener('click', () => {
                // Creamos un evento que otros componentes pueden escuchar
                this.dispatchEvent(new CustomEvent('back', { 
                    bubbles: true,    // El evento puede subir por el DOM
                    composed: true    // El evento puede salir del shadow DOM
                }));
            });
        }
        
        // Configuramos el botón "Guardar"
        const saveButton = this.shadowRoot.querySelector('#save-btn');
        if (saveButton) {
            // Cuando se hace click en "Guardar", ejecutamos nuestra función de guardar
            saveButton.addEventListener('click', this.handleSaveClick.bind(this));
        }

        // Configuramos validación en tiempo real del campo de texto
        const usernameInput = this.shadowRoot.querySelector('#username-input') as HTMLInputElement;
        if (usernameInput) {
            // Cada vez que el usuario escribe algo, validamos si puede guardar
            usernameInput.addEventListener('input', this.validateInput.bind(this));
        }
    }

    // Esta función valida si el botón "Guardar" debe estar habilitado o deshabilitado
    // Se ejecuta cada vez que el usuario escribe en el campo de texto
    private validateInput(): void {
        const usernameInput = this.shadowRoot?.querySelector('#username-input') as HTMLInputElement;
        const saveButton = this.shadowRoot?.querySelector('#save-btn') as HTMLButtonElement;
        
        if (usernameInput && saveButton) {
            const value = usernameInput.value.trim(); // Obtenemos el texto sin espacios extra
            const currentUsernameWithoutAt = this.username.replace('@', ''); // Quitamos el @ del username actual
            
            // Deshabilitamos el botón si:
            // 1. El campo está vacío, O
            // 2. El nuevo username es igual al actual
            saveButton.disabled = value.length === 0 || value === currentUsernameWithoutAt;
        }
    }

    // Esta función se ejecuta cuando el usuario hace click en el botón "Guardar"
    // Aquí es donde se conecta con Flux para actualizar los datos
    private handleSaveClick(): void {
        console.log('💾 El usuario hizo click en el botón Guardar');
        
        // Obtenemos referencias a todos los elementos que necesitamos
        const inputField = this.shadowRoot?.querySelector('#username-input') as HTMLInputElement;
        const saveButton = this.shadowRoot?.querySelector('#save-btn') as HTMLButtonElement;
        
        // Validamos que el campo no esté vacío
        if (!inputField || !inputField.value.trim()) {
            console.log('⚠️ El campo de texto está vacío');
            return; // Salimos de la función sin guardar
        }

        const newUsername = inputField.value.trim(); // Obtenemos el nuevo username
        console.log('🔄 Intentando cambiar el username a:', newUsername);
        
        // Verificamos que el sistema Flux esté disponible
        if (!window.UserActions) {
            console.error('❌ UserActions no está disponible en window');
            alert('Error: Sistema de usuario no disponible');
            return;
        }

        if (!window.userStore) {
            console.error('❌ userStore no está disponible en window');
            alert('Error: Almacén de usuario no disponible');
            return;
        }
        
        // Estado de carga
        saveButton.disabled = true;
        saveButton.classList.add('loading');
        saveButton.textContent = 'Guardando...'; // Cambiamos el texto del botón
        
        try {
            console.log('📡 Enviando el cambio de username al sistema Flux...');
            
            // AQUÍ ES DONDE SE CONECTA CON FLUX
            // Llamamos a UserActions para actualizar el username
            window.UserActions.updateUsername(newUsername);
            
            console.log('✅ Comando enviado a Flux correctamente');
            
            // Limpiamos el campo de texto
            inputField.value = '';
            
            // Mostrar mensaje de éxito
            this.showSuccessMessage();
            
            console.log('🎉 Proceso de guardado completado!');
            
            // También emitimos un evento personalizado para mantener compatibilidad
            // con otros sistemas que puedan estar escuchando
            this.dispatchEvent(new CustomEvent('save', { 
                detail: { newUsername }, // Enviamos el nuevo username en los detalles del evento
                bubbles: true,
                composed: true
            }));
            
        } catch (error) {
            // Si algo sale mal, mostramos el error
            console.error('❌ Error al actualizar el username:', error);
            alert('Error al guardar el cambio. Por favor intenta de nuevo.');
        } finally {
            // Restauramos el botón a su estado normal (habilitado o deshabilitado según corresponda)
            setTimeout(() => {
                saveButton.disabled = false;
                saveButton.classList.remove('loading');
                saveButton.textContent = 'Guardar';
                this.validateInput(); // Revalidamos si el botón debe estar habilitado
            }, 1000); // Pequeño delay para mejor UX
        }
    }

    // Función para mostrar mensaje de éxito - ESTILO IGUAL AL DE PUBLICACIONES
    private showSuccessMessage(): void {
        const toast = document.createElement('div');
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
        toast.textContent = '🎉 Tu nombre de usuario cambió con éxito';
        
        document.body.appendChild(toast);
        
        // Animación de entrada
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Animación de salida y eliminación
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 400);
        }, 3000);
    }
}

export default CambiarNombreSimple;