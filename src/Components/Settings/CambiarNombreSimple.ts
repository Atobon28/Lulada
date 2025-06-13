import { userStore, UserState } from "../../Services/flux/UserStore";
import { UserData, UserActions } from "../../Services/flux/UserActions";

class CambiarNombreSimple extends HTMLElement {
    private currentUser: UserData | null = null;
    private storeListener = this.handleStoreChange.bind(this);
    private _isVisible = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        userStore.subscribe(this.storeListener);

        const currentUser = userStore.getCurrentUser();
        if (currentUser) {
            this.currentUser = { ...currentUser };
        }

        this.render();
        this.setupEventListeners();
    }

    disconnectedCallback(): void {
        userStore.unsubscribe(this.storeListener);
    }

    private handleStoreChange(state: UserState): void {
        const newUser = state.currentUser;
        if (JSON.stringify(this.currentUser) !== JSON.stringify(newUser)) {
            this.currentUser = newUser ? { ...newUser } : null;
            this.updateDisplay();
        }
    }

    private updateDisplay(): void {
        if (!this.shadowRoot || !this.currentUser) return;

        const nameDisplay = this.shadowRoot.querySelector('.current-name');
        if (nameDisplay) {
            nameDisplay.textContent = this.currentUser.nombre || 'Sin nombre';
        }

        const nameInput = this.shadowRoot.querySelector('#new-name') as HTMLInputElement;
        if (nameInput) {
            nameInput.value = this.currentUser.nombre || '';
        }
    }

    private setupEventListeners(): void {
        if (!this.shadowRoot) return;

        const form = this.shadowRoot.querySelector('#change-name-form') as HTMLFormElement;
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }

        const toggleBtn = this.shadowRoot.querySelector('#toggle-edit-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleEditMode();
            });
        }

        const cancelBtn = this.shadowRoot.querySelector('#cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.cancelEdit();
            });
        }

        const backBtn = this.shadowRoot.querySelector('#back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.handleBackClick();
            });
        }
    }

    private handleSubmit(): void {
        if (!this.shadowRoot || !this.currentUser) return;

        const nameInput = this.shadowRoot.querySelector('#new-name') as HTMLInputElement;
        const newName = nameInput.value.trim();

        if (!newName) {
            this.showMessage('El nombre no puede estar vacío', 'error');
            return;
        }

        if (newName === this.currentUser.nombre) {
            this.showMessage('El nombre no ha cambiado', 'info');
            this.toggleEditMode();
            return;
        }

        const updatedUser: UserData = {
            ...this.currentUser,
            nombre: newName
        };

        UserActions.updateUserData(updatedUser);
        this.showMessage('Nombre actualizado correctamente', 'success');
        this.toggleEditMode();
    }

    private toggleEditMode(): void {
        this._isVisible = !this._isVisible;
        
        if (!this.shadowRoot) return;

        const editForm = this.shadowRoot.querySelector('.edit-form') as HTMLElement;
        const displaySection = this.shadowRoot.querySelector('.display-section') as HTMLElement;
        
        if (editForm && displaySection) {
            if (this._isVisible) {
                editForm.style.display = 'block';
                displaySection.style.display = 'none';
                
                const nameInput = this.shadowRoot.querySelector('#new-name') as HTMLInputElement;
                if (nameInput) {
                    nameInput.focus();
                    nameInput.select();
                }
            } else {
                editForm.style.display = 'none';
                displaySection.style.display = 'block';
            }
        }
    }

    private cancelEdit(): void {
        this.updateDisplay(); // Restaurar valor original
        this.toggleEditMode();
    }

    private handleBackClick(): void {
        // Disparar evento para que el contenedor sepa que debe volver
        this.dispatchEvent(new CustomEvent('back', {
            bubbles: true,
            composed: true
        }));
    }

    private showMessage(message: string, type: 'success' | 'error' | 'info'): void {
        if (!this.shadowRoot) return;

        // Remover mensaje anterior
        const existingMessage = this.shadowRoot.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;

        const container = this.shadowRoot.querySelector('.form-container');
        if (container) {
            container.insertBefore(messageEl, container.firstChild);
        }

        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: 100%;
                    font-family: Arial, sans-serif;
                }

                .form-container {
                    background-color: white;
                    border-radius: 16px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    padding: 32px;
                    max-width: 600px;
                    height: fit-content;
                }

                .back-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    padding: 8px 0;
                    color: #666;
                    font-size: 16px;
                    margin-bottom: 16px;
                    transition: color 0.2s ease;
                }

                .back-button:hover {
                    color: #333;
                }

                .back-arrow {
                    margin-right: 8px;
                }

                .title {
                    font-size: 22px;
                    font-weight: bold;
                    color: #000;
                    margin: 0 0 16px 0;
                }

                .display-section {
                    display: block;
                }

                .current-name {
                    font-size: 16px;
                    padding: 12px;
                    background-color: #f5f5f5;
                    border-radius: 8px;
                    border-left: 4px solid #AAAB54;
                    margin-bottom: 12px;
                    min-height: 44px;
                    display: flex;
                    align-items: center;
                    color: #333;
                }

                .edit-form {
                    display: none;
                }

                .form-group {
                    margin-bottom: 16px;
                }

                .form-label {
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 500;
                    color: #333;
                }

                .form-input {
                    width: 100%;
                    padding: 14px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 16px;
                    box-sizing: border-box;
                    transition: border-color 0.2s ease;
                }

                .form-input:focus {
                    outline: none;
                    border-color: rgb(201, 202, 136);
                    box-shadow: 0 0 5px rgba(170, 171, 84, 0.3);
                }

                .form-input::placeholder {
                    color: #ccc;
                }

                .btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    margin-right: 8px;
                }

                .btn-primary {
                    background: #b4c13b;
                    color: white;
                }

                .btn-primary:hover {
                    background: #9aa732;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }

                .btn-secondary {
                    background: #6c757d;
                    color: white;
                }

                .btn-secondary:hover {
                    background: #545b62;
                }

                .btn-success {
                    background: #b4c13b;
                    color: white;
                }

                .btn-success:hover {
                    background: #9aa732;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }

                .btn:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                .form-actions {
                    display: flex;
                    gap: 8px;
                    margin-top: 16px;
                }

                .message {
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 16px;
                    font-size: 14px;
                    font-weight: 500;
                }

                .message-success {
                    background: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }

                .message-error {
                    background: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }

                .message-info {
                    background: #cce5ff;
                    color: #004085;
                    border: 1px solid #99d1ff;
                }

                @media (max-width: 480px) {
                    .form-container {
                        margin: 10px;
                        padding: 20px;
                    }
                    
                    .title {
                        font-size: 20px;
                    }
                    
                    .form-actions {
                        flex-direction: column;
                    }
                    
                    .btn {
                        width: 100%;
                        margin-right: 0;
                        margin-bottom: 8px;
                    }
                }
            </style>

            <button id="back-btn" class="back-button">
                <span class="back-arrow">←</span> Volver
            </button>

            <div class="form-container">
                <h3 class="title">Cambiar Nombre</h3>
                
                <div class="display-section">
                    <div class="current-name">Sin nombre</div>
                    <button id="toggle-edit-btn" class="btn btn-primary">Editar Nombre</button>
                </div>

                <div class="edit-form">
                    <form id="change-name-form">
                        <div class="form-group">
                            <label class="form-label" for="new-name">Nuevo nombre:</label>
                            <input 
                                type="text" 
                                id="new-name" 
                                class="form-input" 
                                placeholder="Ingresa tu nuevo nombre"
                                required
                                maxlength="50"
                            >
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-success">Guardar</button>
                            <button type="button" id="cancel-btn" class="btn btn-secondary">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.updateDisplay();
    }
}

// Registrar automáticamente el componente
customElements.define('cambiar-nombre-simple', CambiarNombreSimple);

// Export default para uso en index.ts
export default CambiarNombreSimple;

// También export nombrado para flexibilidad
export { CambiarNombreSimple };