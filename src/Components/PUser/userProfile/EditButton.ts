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

            /* RESPONSIVE: Tablets */
            @media (max-width: 768px) {
                .userEditar {
                    text-align: center;
                    padding: 0.5rem;
                }
                
                .userEditar button {
                    width: auto;
                    min-width: 5rem;
                    font-size: 0.9rem;
                    padding: 0.5rem 1rem;
                    height: 2.5rem;
                }
            }

            /* RESPONSIVE: Móviles */
            @media (max-width: 480px) {
                .userEditar button {
                    font-size: 0.8rem;
                    padding: 0.4rem 0.8rem;
                    height: 2.2rem;
                    width: 100%;
                    max-width: 120px;
                }
            }

            .userEditar button:disabled {
                background-color: #ccc;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }

            /* Estado de carga */
            .userEditar button.loading {
                position: relative;
                color: transparent;
            }

            .userEditar button.loading::after {
                content: '';
                position: absolute;
                width: 16px;
                height: 16px;
                top: 50%;
                left: 50%;
                margin-left: -8px;
                margin-top: -8px;
                border: 2px solid #ffffff;
                border-radius: 50%;
                border-top-color: transparent;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }
            </style>
            
            <div class="userEditar">
                <button id="edit-btn">
                    <svg class="edit-icon" viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Editar
                </button>
            </div>
            `;
        }
    }

    connectedCallback(): void {
        this.setupEventListeners();
        this.createModal();
    }

    disconnectedCallback(): void {
        this.removeModal();
    }

    // Crea el modal de edición de perfil
    private createModal(): void {
        const existingModal = document.querySelector('edit-profile-modal') as EditProfileModal | null;
        
        if (existingModal) {
            this.modal = existingModal;
            return;
        }

        const newModal = document.createElement('edit-profile-modal') as EditProfileModal;
        document.body.appendChild(newModal);
        this.modal = newModal;
    }

    // Elimina el modal del DOM
    private removeModal(): void {
        if (this.modal && document.body.contains(this.modal)) {
            document.body.removeChild(this.modal);
            this.modal = null;
        }
    }

    // Configura los eventos del botón
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
        console.log(' UserEditButton Debug:');
        console.log('- Modal exists:', !!this.modal);
        console.log('- Modal in DOM:', this.modal ? document.body.contains(this.modal) : false);
        console.log('- Modal has show method:', this.modal ? this.hasShowMethod(this.modal) : false);
        console.log('- Button element:', !!this.shadowRoot?.querySelector('#edit-btn'));
    }
}

// CORREGIDO: Registrar automáticamente y exportar como default
customElements.define('user-edit', UserEditButton);

// CORREGIDO: Export default
export default UserEditButton;

// AGREGADO: También export nombrado para flexibilidad
export { UserEditButton };