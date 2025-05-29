// src/Components/PUser/userProfile/EditProfileModal.ts - ALTERNATIVE APPROACH

import { userStore, UserState } from "../../../Services/flux/UserStore";
import { UserData } from "../../../Services/flux/UserActions";

class EditProfileModal extends HTMLElement {
    private currentUser: UserData | null = null;
    private storeListener = this.handleStoreChange.bind(this);
    private _isVisible = false;
    private keyDownHandler: ((e: KeyboardEvent) => void) | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        console.log('📝 EditProfileModal: Modal de edición creado');
    }

    connectedCallback() {
        console.log('📝 EditProfileModal: Conectado al DOM');
        
        // Suscribirse al UserStore
        userStore.subscribe(this.storeListener);
        
        // Obtener datos iniciales
        const currentUser = userStore.getCurrentUser();
        if (currentUser) {
            this.currentUser = currentUser;
        }
        
        this.render();
        this.setupEventListeners();
    }

    disconnectedCallback() {
        console.log('📝 EditProfileModal: Desconectado del DOM');
        userStore.unsubscribe(this.storeListener);
        
        // Limpiar event listener global
        if (this.keyDownHandler) {
            document.removeEventListener('keydown', this.keyDownHandler);
        }
    }

    private handleStoreChange(state: UserState): void {
        const newUser = state.currentUser;
        if (JSON.stringify(this.currentUser) !== JSON.stringify(newUser)) {
            console.log('📝 EditProfileModal: Datos de usuario actualizados');
            this.currentUser = newUser ? { ...newUser } : null;
            this.updateFormFields();
        }
    }

    private updateFormFields(): void {
        if (!this.shadowRoot || !this.currentUser) return;

        const nameInput = this.shadowRoot.querySelector('#name-input') as HTMLInputElement;
        const descriptionTextarea = this.shadowRoot.querySelector('#description-textarea') as HTMLTextAreaElement;
        const currentUsernameEl = this.shadowRoot.querySelector('#current-username');

        if (nameInput) {
            nameInput.value = this.currentUser.nombre || '';
        }

        if (descriptionTextarea) {
            descriptionTextarea.value = this.currentUser.descripcion || '';
            this.updateCharacterCount();
        }

        if (currentUsernameEl) {
            currentUsernameEl.textContent = this.currentUser.nombreDeUsuario || '@usuario';
        }
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: none;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    backdrop-filter: blur(5px);
                    font-family: 'Inter', sans-serif;
                }

                :host(.visible) {
                    display: flex;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .modal {
                    background: white;
                    border-radius: 20px;
                    padding: 30px;
                    max-width: 500px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                    position: relative;
                    font-family: 'Inter', sans-serif;
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .close-button {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                    font-family: 'Inter', sans-serif;
                }

                .close-button:hover {
                    background-color: #f0f0f0;
                    color: #333;
                }

                .modal-header {
                    text-align: center;
                    margin-bottom: 25px;
                }

                .modal-title {
                    margin: 0;
                    font-size: 24px;
                    color: #AAAB54;
                    font-weight: bold;
                    font-family: 'Inter', sans-serif;
                }

                .modal-subtitle {
                    margin: 5px 0 0 0;
                    color: #666;
                    font-size: 14px;
                    font-family: 'Inter', sans-serif;
                }

                .current-username {
                    text-align: center;
                    margin-bottom: 20px;
                    padding: 12px 16px;
                    background: linear-gradient(135deg, #AAAB54, #999A4A);
                    color: white;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 16px;
                    font-family: 'Inter', sans-serif;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #333;
                    font-size: 14px;
                    font-family: 'Inter', sans-serif;
                }

                .form-input {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #e0e0e0;
                    border-radius: 10px;
                    font-size: 16px;
                    transition: all 0.2s ease;
                    box-sizing: border-box;
                    font-family: 'Inter', sans-serif;
                    outline: none;
                }

                .form-input:focus {
                    border-color: #AAAB54;
                    box-shadow: 0 0 0 3px rgba(170, 171, 84, 0.1);
                }

                .form-textarea {
                    min-height: 80px;
                    resize: vertical;
                    font-family: 'Inter', sans-serif;
                }

                .character-count {
                    text-align: right;
                    font-size: 12px;
                    color: #666;
                    margin-top: 5px;
                    font-family: 'Inter', sans-serif;
                }

                .character-count.warning {
                    color: #ff6b6b;
                }

                .modal-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    margin-top: 30px;
                }

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

                .btn-cancel {
                    background: #f0f0f0;
                    color: #666;
                }

                .btn-cancel:hover {
                    background: #e0e0e0;
                    color: #333;
                }

                .btn-save {
                    background: #AAAB54;
                    color: white;
                }

                .btn-save:hover:not(:disabled) {
                    background: #999A4A;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(170, 171, 84, 0.3);
                }

                .btn-save:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                .validation-message {
                    font-size: 12px;
                    margin-top: 5px;
                    display: none;
                    font-family: 'Inter', sans-serif;
                }

                .validation-message.error {
                    color: #ff6b6b;
                    display: block;
                }

                /* Responsive */
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
                        flex-direction: column;
                    }

                    .btn {
                        width: 100%;
                    }
                }
            </style>

            <div class="modal" id="modal-content">
                <button class="close-button" id="close-btn" type="button">×</button>
                
                <div class="modal-header">
                    <h2 class="modal-title">Editar Perfil</h2>
                    <p class="modal-subtitle">Actualiza tu información personal</p>
                </div>

                <!-- Mostrar username actual (no editable) -->
                <div class="current-username" id="current-username">
                    ${this.currentUser ? this.currentUser.nombreDeUsuario : '@usuario'}
                </div>

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

        // Llenar formulario con datos actuales
        setTimeout(() => {
            this.updateFormFields();
        }, 0);
    }

    private setupEventListeners(): void {
        if (!this.shadowRoot) return;

        const closeBtn = this.shadowRoot.querySelector('#close-btn');
        const cancelBtn = this.shadowRoot.querySelector('#cancel-btn');
        const saveBtn = this.shadowRoot.querySelector('#save-btn');
        const nameInput = this.shadowRoot.querySelector('#name-input') as HTMLInputElement;
        const descriptionTextarea = this.shadowRoot.querySelector('#description-textarea') as HTMLTextAreaElement;

        // Botones de cerrar - SIMPLIFICADO
        const handleClose = () => {
            this.hide();
        };

        closeBtn?.addEventListener('click', handleClose);
        cancelBtn?.addEventListener('click', handleClose);

        // Click fuera del modal
        this.addEventListener('click', (e) => {
            const modalContent = this.shadowRoot?.querySelector('#modal-content');
            if (e.target === this && !modalContent?.contains(e.target as Node)) {
                this.hide();
            }
        });

        // Validación de nombre
        nameInput?.addEventListener('input', () => {
            this.validateName();
            this.updateSaveButton();
        });

        // Contador de caracteres para descripción
        descriptionTextarea?.addEventListener('input', () => {
            this.updateCharacterCount();
            this.updateSaveButton();
        });

        // Botón guardar
        saveBtn?.addEventListener('click', () => {
            this.handleSave();
        });
    }

    private validateName(): boolean {
        const input = this.shadowRoot?.querySelector('#name-input') as HTMLInputElement;
        const validation = this.shadowRoot?.querySelector('#name-validation');
        
        if (!input || !validation) return false;

        const value = input.value.trim();

        if (!value) {
            validation.textContent = 'El nombre es requerido';
            validation.className = 'validation-message error';
            return false;
        }

        if (value.length < 2) {
            validation.textContent = 'El nombre debe tener al menos 2 caracteres';
            validation.className = 'validation-message error';
            return false;
        }

        validation.className = 'validation-message';
        validation.textContent = '';
        return true;
    }

    private updateCharacterCount(): void {
        const textarea = this.shadowRoot?.querySelector('#description-textarea') as HTMLTextAreaElement;
        const counter = this.shadowRoot?.querySelector('#desc-count');
        
        if (!textarea || !counter) return;

        const count = textarea.value.length;
        const maxLength = 200;
        
        counter.textContent = `${count}/${maxLength}`;
        
        if (count > maxLength * 0.8) {
            counter.classList.add('warning');
        } else {
            counter.classList.remove('warning');
        }
    }

    private updateSaveButton(): void {
        const saveBtn = this.shadowRoot?.querySelector('#save-btn') as HTMLButtonElement;
        if (!saveBtn) return;

        const isNameValid = this.validateName();
        saveBtn.disabled = !isNameValid;
    }

    // Get UserActions safely with type checking
    private getUserActions(): { updateFullName: (name: string) => void; updateDescription: (description: string) => void } | null {
        const win = window as typeof window & {
            UserActions?: {
                updateFullName: (name: string) => void;
                updateDescription: (description: string) => void;
            };
        };
        return win.UserActions || null;
    }

    private handleSave(): void {
        console.log('💾 EditProfileModal: Guardando cambios...');

        if (!this.validateName()) {
            console.log('❌ Validación fallida');
            return;
        }

        const nameInput = this.shadowRoot?.querySelector('#name-input') as HTMLInputElement;
        const descriptionTextarea = this.shadowRoot?.querySelector('#description-textarea') as HTMLTextAreaElement;

        if (!nameInput || !descriptionTextarea) {
            console.error('❌ No se pudieron obtener los campos del formulario');
            return;
        }

        const newName = nameInput.value.trim();
        const newDescription = descriptionTextarea.value.trim();

        const userActions = this.getUserActions();
        if (!userActions) {
            console.error('❌ UserActions no está disponible');
            alert('Error: Sistema de usuario no disponible');
            return;
        }

        try {
            const saveBtn = this.shadowRoot?.querySelector('#save-btn') as HTMLButtonElement;
            if (saveBtn) {
                saveBtn.disabled = true;
                saveBtn.textContent = 'Guardando...';
            }

            console.log('📡 Enviando actualizaciones a Flux...');
            
            userActions.updateFullName(newName);
            userActions.updateDescription(newDescription);

            console.log('✅ Cambios enviados a Flux correctamente');

            this.showSuccessMessage();

            setTimeout(() => {
                this.hide();
            }, 1500);

        } catch (error) {
            console.error('❌ Error al guardar:', error);
            alert('Error al guardar los cambios. Por favor intenta de nuevo.');
            
            const saveBtn = this.shadowRoot?.querySelector('#save-btn') as HTMLButtonElement;
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Guardar Cambios';
            }
        }
    }

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
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3);
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;
        toast.textContent = '✅ Tu perfil se actualizó correctamente';
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 400);
        }, 3000);
    }

    // Métodos públicos
    public show(): void {
        console.log('📝 EditProfileModal: Mostrando modal');
        this._isVisible = true;
        this.classList.add('visible');
        
        document.body.style.overflow = 'hidden';
        
        // Configurar ESC key listener
        this.keyDownHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && this._isVisible) {
                this.hide();
            }
        };
        document.addEventListener('keydown', this.keyDownHandler);
        
        this.updateFormFields();
        
        setTimeout(() => {
            const firstInput = this.shadowRoot?.querySelector('#name-input') as HTMLInputElement;
            firstInput?.focus();
        }, 300);
    }

    public hide(): void {
        console.log('📝 EditProfileModal: Ocultando modal');
        this._isVisible = false;
        this.classList.remove('visible');
        
        document.body.style.overflow = 'auto';
        
        // Remover ESC key listener
        if (this.keyDownHandler) {
            document.removeEventListener('keydown', this.keyDownHandler);
            this.keyDownHandler = null;
        }
        
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

    public updateUserData(userData: UserData): void {
        this.currentUser = userData;
        this.updateFormFields();
    }
}

export default EditProfileModal;