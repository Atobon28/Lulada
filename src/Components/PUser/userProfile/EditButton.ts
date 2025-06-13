// Definición de tipo para el modal de edición
interface EditProfileModal extends HTMLElement {
    show(): void;
    hide(): void;
}

// Componente que crea el botón de "Editar" perfil
class UserEditButton extends HTMLElement {
    private modal: EditProfileModal | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
            <style>
            .userEditar {
                max-width: 100%;
                text-align: right;
                padding: 1rem;
            }

            .userEditar button {
                padding: 0.5rem 1rem;
                background-color: #AAAB54;
                border: none;
                color: white;
                border-radius: 0.5rem;
                cursor: pointer;
                font-size: 1rem;
                width: 5rem;
                height: 2.5rem;
                font-family: 'Inter', sans-serif;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                font-weight: 600;
            }

            .userEditar button:hover {
                background-color: #999A4A;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(170, 171, 84, 0.3);
            }

            .userEditar button:active {
                transform: translateY(0);
            }

            .edit-icon {
                width: 16px;
                height: 16px;
                fill: currentColor;
            }

            .userEditar button:disabled {
                background-color: #ccc;
                cursor: not-allowed;
                transform: none;
            }

            .userEditar button.loading {
                opacity: 0.7;
            }

            .loading-spinner {
                width: 16px;
                height: 16px;
                border: 2px solid #ffffff40;
                border-top: 2px solid #ffffff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .userEditar button.loading .edit-icon {
                display: none;
            }

            .userEditar button:not(.loading) .loading-spinner {
                display: none;
            }
            </style>
            
            <div class="userEditar">
                <button type="button" id="edit-btn">
                    <div class="loading-spinner"></div>
                    <svg class="edit-icon" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                    Editar
                </button>
            </div>
            `;
        }
    }

    connectedCallback(): void {
        this.setupEventListeners();
    }

    disconnectedCallback(): void {
        // Limpiar modal si existe
        if (this.modal && document.body.contains(this.modal)) {
            document.body.removeChild(this.modal);
        }
    }

    // Crear el modal de edición
    private createModal(): void {
        if (this.modal && document.body.contains(this.modal)) {
            document.body.removeChild(this.modal);
        }

        this.modal = document.createElement('lulada-edit-profile-modal') as EditProfileModal;
        
        if (this.modal) {
            document.body.appendChild(this.modal);
        }
    }

    // Configurar event listeners
    private setupEventListeners(): void {
        const editBtn = this.shadowRoot?.querySelector('#edit-btn');
        
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                this.handleEditClick();
            });
        }
    }

    // Se ejecuta cuando el usuario hace clic en "Editar"
    private handleEditClick(): void {
        const button = this.shadowRoot?.querySelector('#edit-btn') as HTMLButtonElement;
        
        if (!button) return;

        button.disabled = true;
        button.classList.add('loading');

        try {
            if (!this.modal) {
                this.createModal();
            }

            setTimeout(() => {
                if (this.modal && this.hasShowMethod(this.modal)) {
                    this.modal.show();
                } else {
                    alert('Error: No se pudo abrir el editor de perfil');
                }

                button.disabled = false;
                button.classList.remove('loading');
            }, 300);

        } catch (error) {
            console.error('Error al abrir el editor de perfil:', error);
            alert('Error al abrir el editor de perfil');

            button.disabled = false;
            button.classList.remove('loading');
        }
    }

    // Verifica si un elemento tiene el método 'show'
    private hasShowMethod(element: HTMLElement): element is EditProfileModal {
        return typeof (element as EditProfileModal).show === 'function';
    }

    // Método público que permite abrir el modal desde fuera
    public openEditModal(): void {
        this.handleEditClick();
    }

    // Verifica si el modal está disponible
    public isModalAvailable(): boolean {
        return !!this.modal && this.hasShowMethod(this.modal);
    }

    // Método para depuración
    public debugInfo(): void {
        console.log('🔍 UserEditButton Debug:');
        console.log('- Modal exists:', !!this.modal);
        console.log('- Modal in DOM:', this.modal ? document.body.contains(this.modal) : false);
        console.log('- Modal has show method:', this.modal ? this.hasShowMethod(this.modal) : false);
        console.log('- Button element:', !!this.shadowRoot?.querySelector('#edit-btn'));
    }
}

// ✅ SIN REGISTRO AUTOMÁTICO - se registra desde index.ts
export default UserEditButton;
export { UserEditButton };