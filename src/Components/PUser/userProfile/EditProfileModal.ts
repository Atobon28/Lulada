// Importamos las herramientas necesarias para manejar los datos del usuario
import { userStore, UserState } from "../../../Services/flux/UserStore";
import { UserData } from "../../../Services/flux/UserActions";

// Esta es la clase principal que crea un modal (ventana emergente) para editar el perfil
class EditProfileModal extends HTMLElement {
    // Variables para guardar información importante del modal
    private currentUser: UserData | null = null; // Los datos del usuario actual
    private storeListener = this.handleStoreChange.bind(this); // Función que escucha cambios en los datos
    private _isVisible = false; // Si el modal está visible o no
    private keyDownHandler: ((e: KeyboardEvent) => void) | null = null; // Para manejar teclas como ESC

    constructor() {
        super(); // Llamamos al constructor padre
        this.attachShadow({ mode: 'open' }); // Creamos el contenedor de estilos aislado
        console.log(' EditProfileModal: Modal de edición creado');
    }

    // Esta función se ejecuta cuando el modal se conecta a la página
    connectedCallback() {
        console.log(' EditProfileModal: Conectado al DOM');
        
        // Nos suscribimos para recibir notificaciones cuando cambien los datos del usuario
        userStore.subscribe(this.storeListener);
        
        // Obtenemos los datos actuales del usuario para mostrarlos en el formulario
        const currentUser = userStore.getCurrentUser();
        if (currentUser) {
            this.currentUser = currentUser;
        }
        
        // Dibujamos el modal y configuramos los eventos
        this.render();
        this.setupEventListeners();
    }

    // Esta función se ejecuta cuando el modal se desconecta de la página
    disconnectedCallback() {
        console.log(' EditProfileModal: Desconectado del DOM');
        // Nos desuscribimos para dejar de recibir notificaciones
        userStore.unsubscribe(this.storeListener);
        
        // Limpiamos el listener de teclas para evitar problemas de memoria
        if (this.keyDownHandler) {
            document.removeEventListener('keydown', this.keyDownHandler);
        }
    }

    // Esta función se ejecuta cuando los datos del usuario cambian
    private handleStoreChange(state: UserState): void {
        const newUser = state.currentUser;
        // Solo actualizamos si realmente hay cambios
        if (JSON.stringify(this.currentUser) !== JSON.stringify(newUser)) {
            console.log(' EditProfileModal: Datos de usuario actualizados');
            this.currentUser = newUser ? { ...newUser } : null;
            this.updateFormFields(); // Actualizamos los campos del formulario
        }
    }

    // Esta función actualiza los campos del formulario con los datos del usuario
    private updateFormFields(): void {
        if (!this.shadowRoot || !this.currentUser) return;

        // Buscamos los elementos del formulario
        const nameInput = this.shadowRoot.querySelector('#name-input') as HTMLInputElement;
        const descriptionTextarea = this.shadowRoot.querySelector('#description-textarea') as HTMLTextAreaElement;
        const currentUsernameEl = this.shadowRoot.querySelector('#current-username');

        // Llenamos los campos con los datos del usuario
        if (nameInput) {
            nameInput.value = this.currentUser.nombre || '';
        }

        if (descriptionTextarea) {
            descriptionTextarea.value = this.currentUser.descripcion || '';
            this.updateCharacterCount(); // Actualizamos el contador de caracteres
        }

        if (currentUsernameEl) {
            currentUsernameEl.textContent = this.currentUser.nombreDeUsuario || '@usuario';
        }
    }

    // Esta función crea todo el HTML y CSS del modal
    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                /* Estilos para el contenedor principal del modal */
                :host {
                    position: fixed; /* Se queda fijo en la pantalla */
                    top: 0;
                    left: 0;
                    width: 100vw; /* Ocupa toda la pantalla */
                    height: 100vh;
                    background-color: rgba(0, 0, 0, 0.5); /* Fondo semi-transparente */
                    display: none; /* Inicialmente oculto */
                    justify-content: center; /* Centrado horizontalmente */
                    align-items: center; /* Centrado verticalmente */
                    z-index: 10000; /* Aparece por encima de todo */
                    backdrop-filter: blur(5px); /* Efecto de desenfoque */
                    font-family: 'Inter', sans-serif;
                }

                /* Cuando el modal está visible */
                :host(.visible) {
                    display: flex;
                    animation: fadeIn 0.3s ease; /* Animación de aparición */
                }

                /* Animación para que aparezca suavemente */
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                /* Estilos para la ventana del modal */
                .modal {
                    background: white; /* Fondo blanco */
                    border-radius: 20px; /* Bordes redondeados */
                    padding: 30px; /* Espacio interno */
                    max-width: 500px; /* Ancho máximo */
                    width: 90%; /* Ancho responsive */
                    max-height: 80vh; /* Altura máxima */
                    overflow-y: auto; /* Scroll si es necesario */
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2); /* Sombra */
                    position: relative;
                    font-family: 'Inter', sans-serif;
                    animation: slideUp 0.3s ease; /* Animación de deslizamiento */
                }

                /* Animación para que la ventana suba suavemente */
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                /* Botón de cerrar (X) en la esquina superior derecha */
                .close-button {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer; /* Manita al pasar el mouse */
                    color: #666;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%; /* Forma circular */
                    transition: all 0.2s ease; /* Transición suave */
                    font-family: 'Inter', sans-serif;
                }

                /* Efecto hover para el botón de cerrar */
                .close-button:hover {
                    background-color: #f0f0f0;
                    color: #333;
                }

                /* Encabezado del modal */
                .modal-header {
                    text-align: center;
                    margin-bottom: 25px;
                }

                /* Título principal del modal */
                .modal-title {
                    margin: 0;
                    font-size: 24px;
                    color: #AAAB54; /* Color verde corporativo */
                    font-weight: bold;
                    font-family: 'Inter', sans-serif;
                }

                /* Subtítulo del modal */
                .modal-subtitle {
                    margin: 5px 0 0 0;
                    color: #666;
                    font-size: 14px;
                    font-family: 'Inter', sans-serif;
                }

                /* Caja que muestra el username actual (no editable) */
                .current-username {
                    text-align: center;
                    margin-bottom: 20px;
                    padding: 12px 16px;
                    background: linear-gradient(135deg, #AAAB54, #999A4A); /* Gradiente verde */
                    color: white;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 16px;
                    font-family: 'Inter', sans-serif;
                }

                /* Contenedor para cada grupo de formulario */
                .form-group {
                    margin-bottom: 20px;
                }

                /* Etiquetas de los campos del formulario */
                .form-label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #333;
                    font-size: 14px;
                    font-family: 'Inter', sans-serif;
                }

                /* Estilos para los campos de entrada */
                .form-input {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #e0e0e0; /* Borde gris claro */
                    border-radius: 10px;
                    font-size: 16px;
                    transition: all 0.2s ease; /* Transición suave */
                    box-sizing: border-box; /* Incluye padding en el ancho */
                    font-family: 'Inter', sans-serif;
                    outline: none; /* Sin borde azul del navegador */
                }

                /* Cuando el campo está enfocado */
                .form-input:focus {
                    border-color: #AAAB54; /* Borde verde */
                    box-shadow: 0 0 0 3px rgba(170, 171, 84, 0.1); /* Sombra verde suave */
                }

                /* Estilos específicos para el área de texto */
                .form-textarea {
                    min-height: 80px; /* Altura mínima */
                    resize: vertical; /* Solo se puede redimensionar verticalmente */
                    font-family: 'Inter', sans-serif;
                }

                /* Contador de caracteres */
                .character-count {
                    text-align: right;
                    font-size: 12px;
                    color: #666;
                    margin-top: 5px;
                    font-family: 'Inter', sans-serif;
                }

                /* Cuando se está cerca del límite de caracteres */
                .character-count.warning {
                    color: #ff6b6b; /* Color rojo de advertencia */
                }

                /* Contenedor de los botones de acción */
                .modal-actions {
                    display: flex;
                    gap: 12px; /* Espacio entre botones */
                    justify-content: flex-end; /* Alineados a la derecha */
                    margin-top: 30px;
                }

                /* Estilos base para todos los botones */
                .btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    min-width: 100px;
                    font-family: 'Inter', sans-serif;
                    outline: none;
                }

                /* Botón de cancelar */
                .btn-cancel {
                    background: #f0f0f0;
                    color: #666;
                }

                /* Efecto hover para el botón cancelar */
                .btn-cancel:hover {
                    background: #e0e0e0;
                    color: #333;
                }

                /* Botón de guardar */
                .btn-save {
                    background: #AAAB54; /* Verde corporativo */
                    color: white;
                }

                /* Efecto hover para el botón guardar (solo si no está deshabilitado) */
                .btn-save:hover:not(:disabled) {
                    background: #999A4A; /* Verde más oscuro */
                    transform: translateY(-1px); /* Se eleva ligeramente */
                    box-shadow: 0 4px 8px rgba(170, 171, 84, 0.3); /* Sombra */
                }

                /* Cuando el botón está deshabilitado */
                .btn-save:disabled {
                    background: #ccc; /* Gris */
                    cursor: not-allowed; /* Cursor de prohibido */
                    transform: none;
                    box-shadow: none;
                }

                /* Mensajes de validación */
                .validation-message {
                    font-size: 12px;
                    margin-top: 5px;
                    display: none; /* Oculto por defecto */
                    font-family: 'Inter', sans-serif;
                }

                /* Cuando hay un error de validación */
                .validation-message.error {
                    color: #ff6b6b; /* Color rojo */
                    display: block; /* Se muestra */
                }

                /* Estilos para dispositivos móviles */
                @media (max-width: 600px) {
                    .modal {
                        padding: 20px;
                        margin: 20px;
                        width: calc(100% - 40px);
                    }

                    .modal-title {
                        font-size: 20px;
                    }

                    .modal-actions {
                        flex-direction: column; /* Botones en columna */
                    }

                    .btn {
                        width: 100%; /* Botones de ancho completo */
                    }
                }
            </style>

            <div class="modal" id="modal-content">
                <!-- Botón X para cerrar -->
                <button class="close-button" id="close-btn" type="button">×</button>
                
                <!-- Encabezado del modal -->
                <div class="modal-header">
                    <h2 class="modal-title">Editar Perfil</h2>
                    <p class="modal-subtitle">Actualiza tu información personal</p>
                </div>

                <!-- Mostrar username actual (no se puede editar) -->
                <div class="current-username" id="current-username">
                    ${this.currentUser ? this.currentUser.nombreDeUsuario : '@usuario'}
                </div>

                <!-- Campo para el nombre completo -->
                <div class="form-group">
                    <label class="form-label" for="name-input">Nombre Completo</label>
                    <input 
                        type="text" 
                        id="name-input" 
                        class="form-input" 
                        placeholder="Tu nombre completo"
                        maxlength="50"
                        autocomplete="off"
                    >
                    <div class="validation-message" id="name-validation"></div>
                </div>

                <!-- Campo para la descripción -->
                <div class="form-group">
                    <label class="form-label" for="description-textarea">Descripción</label>
                    <textarea 
                        id="description-textarea" 
                        class="form-input form-textarea" 
                        placeholder="Cuéntanos sobre ti..."
                        maxlength="200"
                    ></textarea>
                    <div class="character-count" id="desc-count">0/200</div>
                </div>

                <!-- Botones de acción -->
                <div class="modal-actions">
                    <button type="button" class="btn btn-cancel" id="cancel-btn">
                        Cancelar
                    </button>
                    <button type="button" class="btn btn-save" id="save-btn">
                        Guardar Cambios
                    </button>
                </div>
            </div>
        `;

        // Llenar el formulario con los datos actuales después de crear el HTML
        setTimeout(() => {
            this.updateFormFields();
        }, 0);
    }

    // Esta función configura todos los eventos (clicks, teclas, etc.)
    private setupEventListeners(): void {
        if (!this.shadowRoot) return;

        // Obtenemos referencias a los elementos importantes
        const closeBtn = this.shadowRoot.querySelector('#close-btn');
        const cancelBtn = this.shadowRoot.querySelector('#cancel-btn');
        const saveBtn = this.shadowRoot.querySelector('#save-btn');
        const nameInput = this.shadowRoot.querySelector('#name-input') as HTMLInputElement;
        const descriptionTextarea = this.shadowRoot.querySelector('#description-textarea') as HTMLTextAreaElement;

        // Función que se ejecuta para cerrar el modal
        const handleClose = () => {
            this.hide();
        };

        // Configuramos los botones de cerrar
        closeBtn?.addEventListener('click', handleClose);
        cancelBtn?.addEventListener('click', handleClose);

        // Si hacen click fuera del modal, también se cierra
        this.addEventListener('click', (e) => {
            const modalContent = this.shadowRoot?.querySelector('#modal-content');
            if (e.target === this && !modalContent?.contains(e.target as Node)) {
                this.hide();
            }
        });

        // Cuando escriben en el campo nombre, validamos
        nameInput?.addEventListener('input', () => {
            this.validateName();
            this.updateSaveButton();
        });

        // Cuando escriben en la descripción, actualizamos el contador
        descriptionTextarea?.addEventListener('input', () => {
            this.updateCharacterCount();
            this.updateSaveButton();
        });

        // Cuando hacen click en guardar
        saveBtn?.addEventListener('click', () => {
            this.handleSave();
        });
    }

    // Esta función valida que el nombre sea correcto
    private validateName(): boolean {
        const input = this.shadowRoot?.querySelector('#name-input') as HTMLInputElement;
        const validation = this.shadowRoot?.querySelector('#name-validation');
        
        if (!input || !validation) return false;

        const value = input.value.trim(); // Quitamos espacios extra

        // Si está vacío
        if (!value) {
            validation.textContent = 'El nombre es requerido';
            validation.className = 'validation-message error';
            return false;
        }

        // Si es muy corto
        if (value.length < 2) {
            validation.textContent = 'El nombre debe tener al menos 2 caracteres';
            validation.className = 'validation-message error';
            return false;
        }

        // Si todo está bien, quitamos el mensaje de error
        validation.className = 'validation-message';
        validation.textContent = '';
        return true;
    }

    // Esta función actualiza el contador de caracteres de la descripción
    private updateCharacterCount(): void {
        const textarea = this.shadowRoot?.querySelector('#description-textarea') as HTMLTextAreaElement;
        const counter = this.shadowRoot?.querySelector('#desc-count');
        
        if (!textarea || !counter) return;

        const count = textarea.value.length;
        const maxLength = 200;
        
        // Actualizamos el texto del contador
        counter.textContent = `${count}/${maxLength}`;
        
        // Si está cerca del límite, lo marcamos en rojo
        if (count > maxLength * 0.8) {
            counter.classList.add('warning');
        } else {
            counter.classList.remove('warning');
        }
    }

    // Esta función habilita o deshabilita el botón de guardar
    private updateSaveButton(): void {
        const saveBtn = this.shadowRoot?.querySelector('#save-btn') as HTMLButtonElement;
        if (!saveBtn) return;

        // Solo habilitamos el botón si el nombre es válido
        const isNameValid = this.validateName();
        saveBtn.disabled = !isNameValid;
    }

    // Esta función obtiene las herramientas para actualizar el usuario de forma segura
    private getUserActions(): { updateFullName: (name: string) => void; updateDescription: (description: string) => void } | null {
        const win = window as typeof window & {
            UserActions?: {
                updateFullName: (name: string) => void;
                updateDescription: (description: string) => void;
            };
        };
        return win.UserActions || null;
    }

    // Esta función se ejecuta cuando el usuario hace click en "Guardar"
    private handleSave(): void {
        console.log(' EditProfileModal: Guardando cambios...');

        // Primero validamos que todo esté correcto
        if (!this.validateName()) {
            console.log('Validación fallida');
            return;
        }

        // Obtenemos los campos del formulario
        const nameInput = this.shadowRoot?.querySelector('#name-input') as HTMLInputElement;
        const descriptionTextarea = this.shadowRoot?.querySelector('#description-textarea') as HTMLTextAreaElement;

        if (!nameInput || !descriptionTextarea) {
            console.error(' No se pudieron obtener los campos del formulario');
            return;
        }

        // Obtenemos los valores y quitamos espacios extra
        const newName = nameInput.value.trim();
        const newDescription = descriptionTextarea.value.trim();

        // Verificamos que tengamos las herramientas para guardar
        const userActions = this.getUserActions();
        if (!userActions) {
            console.error(' UserActions no está disponible');
            alert('Error: Sistema de usuario no disponible');
            return;
        }

        try {
            // Cambiamos el botón a estado de "guardando"
            const saveBtn = this.shadowRoot?.querySelector('#save-btn') as HTMLButtonElement;
            if (saveBtn) {
                saveBtn.disabled = true;
                saveBtn.textContent = 'Guardando...';
            }

            console.log(' Enviando actualizaciones a Flux...');
            
            // Enviamos los cambios al sistema
            userActions.updateFullName(newName);
            userActions.updateDescription(newDescription);

            console.log(' Cambios enviados a Flux correctamente');

            // Mostramos mensaje de éxito
            this.showSuccessMessage();

            // Cerramos el modal después de un momento
            setTimeout(() => {
                this.hide();
            }, 1500);

        } catch (error) {
            // Si algo sale mal, mostramos error y restauramos el botón
            console.error(' Error al guardar:', error);
            alert('Error al guardar los cambios. Por favor intenta de nuevo.');
            
            const saveBtn = this.shadowRoot?.querySelector('#save-btn') as HTMLButtonElement;
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Guardar Cambios';
            }
        }
    }

    // Esta función muestra un mensaje de éxito cuando se guardan los cambios
    private showSuccessMessage(): void {
        // Creamos un elemento toast (notificación)
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
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3);
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;
        toast.textContent = ' Tu perfil se actualizó correctamente';
        
        // Lo añadimos a la página
        document.body.appendChild(toast);
        
        // Animación de entrada
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Animación de salida y eliminación después de 3 segundos
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 400);
        }, 3000);
    }

    // ===== MÉTODOS PÚBLICOS (que se pueden usar desde fuera) =====

    // Función para mostrar el modal
    public show(): void {
        console.log(' EditProfileModal: Mostrando modal');
        this._isVisible = true; // Marcamos como visible
        this.classList.add('visible'); // Añadimos la clase CSS
        
        // Bloqueamos el scroll de la página de fondo
        document.body.style.overflow = 'hidden';
        
        // Configuramos para que se cierre con la tecla ESC
        this.keyDownHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && this._isVisible) {
                this.hide();
            }
        };
        document.addEventListener('keydown', this.keyDownHandler);
        
        // Actualizamos los campos con los datos actuales
        this.updateFormFields();
        
        // Ponemos el cursor en el primer campo después de un momento
        setTimeout(() => {
            const firstInput = this.shadowRoot?.querySelector('#name-input') as HTMLInputElement;
            firstInput?.focus();
        }, 300);
    }

    // Función para ocultar el modal
    public hide(): void {
        console.log(' EditProfileModal: Ocultando modal');
        this._isVisible = false; // Marcamos como no visible
        this.classList.remove('visible'); // Quitamos la clase CSS
        
        // Restauramos el scroll de la página
        document.body.style.overflow = 'auto';
        
        // Quitamos el listener de la tecla ESC
        if (this.keyDownHandler) {
            document.removeEventListener('keydown', this.keyDownHandler);
            this.keyDownHandler = null;
        }
        
        // Después de que termine la animación, limpiamos el formulario
        setTimeout(() => {
            const saveBtn = this.shadowRoot?.querySelector('#save-btn') as HTMLButtonElement;
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Guardar Cambios';
            }
            
            const validation = this.shadowRoot?.querySelector('#name-validation');
            if (validation) {
                validation.className = 'validation-message';
                validation.textContent = '';
            }
        }, 300);
    }

    // Función para actualizar los datos del usuario desde fuera
    public updateUserData(userData: UserData): void {
        this.currentUser = userData;
        this.updateFormFields();
    }
}

export default EditProfileModal;