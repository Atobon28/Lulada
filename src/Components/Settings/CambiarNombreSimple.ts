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

        const container = this.shadowRoot.querySelector('.container');
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
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                .container {
                    background: white;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    max-width: 400px;
                    margin: 0 auto;
                }

                .title {
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin-bottom: 16px;
                    color: #333;
                }

                .display-section {
                    display: block;
                }

                .current-name {
                    font-size: 1.1rem;
                    padding: 12px;
                    background: #f8f9fa;
                    border-radius: 6px;
                    margin-bottom: 12px;
                    min-height: 44px;
                    display: flex;
                    align-items: center;
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
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 1rem;
                }

                .form-input:focus {
                    outline: none;
                    border-color: #007bff;
                    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
                }

                .btn {
                    padding: 10px 16px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    margin-right: 8px;
                }

                .btn-primary {
                    background: #007bff;
                    color: white;
                }

                .btn-primary:hover {
                    background: #0056b3;
                }

                .btn-secondary {
                    background: #6c757d;
                    color: white;
                }

                .btn-secondary:hover {
                    background: #545b62;
                }

                .btn-success {
                    background: #28a745;
                    color: white;
                }

                .btn-success:hover {
                    background: #1e7e34;
                }

                .form-actions {
                    display: flex;
                    gap: 8px;
                    margin-top: 16px;
                }

                .message {
                    padding: 12px;
                    border-radius: 6px;
                    margin-bottom: 16px;
                    font-size: 0.9rem;
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
                    .container {
                        margin: 10px;
                        padding: 16px;
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

            <div class="container">
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

// CORREGIDO: Registrar automáticamente y exportar como default
customElements.define('cambiar-nombre-simple', CambiarNombreSimple);

// CORREGIDO: Export default para uso en index.ts
export default CambiarNombreSimple;

// AGREGADO: También export nombrado para flexibilidad
export { CambiarNombreSimple };