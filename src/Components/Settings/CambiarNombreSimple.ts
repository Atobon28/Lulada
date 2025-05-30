import { userStore, UserState } from "../../Services/flux/UserStore";
import { UserData } from "../../Services/flux/UserActions";

class CambiarNombreSimple extends HTMLElement {
    
    private username: string = '';
    private currentUser: UserData | null = null;
    private storeListener = this.handleStoreChange.bind(this);
    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    static get observedAttributes() {
        return ['username'];
    }
    
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'username' && oldValue !== newValue) {
            this.username = newValue;
            this.render();
        }
    }
    
    connectedCallback() {
        userStore.subscribe(this.storeListener);
        
        const currentUser = userStore.getCurrentUser();
        if (currentUser) {
            this.username = currentUser.nombreDeUsuario;
            this.currentUser = currentUser;
        }
        
        this.render();
        this.setupEventListeners();
    }

    disconnectedCallback() {
        userStore.unsubscribe(this.storeListener);
    }

    private handleStoreChange(state: UserState): void {
        const newUser = state.currentUser;
        
        if (JSON.stringify(this.currentUser) !== JSON.stringify(newUser)) {
            this.currentUser = newUser ? { ...newUser } : null;
            
            if (newUser) {
                this.username = newUser.nombreDeUsuario;
                this.updateUsernameDisplay();
            }
        }
    }

    private updateUsernameDisplay(): void {
        if (!this.shadowRoot) return;
        
        const subtitle2El = this.shadowRoot.querySelector('.subtitle2');
        const currentUsernameEl = this.shadowRoot.querySelector('.current-username-display');
        
        if (subtitle2El) {
            subtitle2El.textContent = this.username;
        }
        
        if (currentUsernameEl) {
            currentUsernameEl.textContent = this.username;
        }
    }
    
    private render() {
        if (!this.shadowRoot) return;
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                    height: 100%;
                }
                
                .form-container {
                    background-color: white;
                    border-radius: 16px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    padding: 32px;
                    max-width: 600px;
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
                    margin: 0 0 8px 0;
                }
                
                .subtitle {
                    font-size: 16px;
                    color: #aaa;
                    margin: 0 0 4px 0;
                }
                
                .subtitle2 {
                    font-size: 16px;
                    margin: 0 0 4px 0;
                    font-weight: 500;
                    color: #333;
                }
                
                .current-username {
                    font-size: 16px;
                    color: #333;
                    margin-bottom: 24px;
                    padding: 12px;
                    background-color: #f5f5f5;
                    border-radius: 8px;
                    border-left: 4px solid #AAAB54;
                }
                
                .input-field {
                    width: 100%;
                    padding: 14px;
                    font-size: 16px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    margin-bottom: 24px;
                    box-sizing: border-box;
                    transition: border-color 0.2s ease;
                }
                
                .input-field:focus {
                    outline: none;
                    border-color:rgb(201, 202, 136);
                    box-shadow: 0 0 5px rgba(170, 171, 84, 0.3);
                }
                
                .input-field::placeholder {
                    color: #ccc;
                }
                
                .save-button {
                    background-color: #b4c13b;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 16px;
                    transition: all 0.2s ease;
                }
                
                .save-button:hover {
                    background-color: #9aa732;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }

                .save-button:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                .save-button.loading {
                    background-color: #999;
                    cursor: wait;
                }

                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            </style>
            
            <button id="back-btn" class="back-button">
                <span class="back-arrow">←</span> Volver
            </button>
            
            <div class="form-container">
                <h2 class="title">Cambiar nombre de usuario</h2>
                <p class="subtitle">Nombre de usuario actual</p>
                <div class="current-username">
                    <span class="current-username-display">${this.username || '@CrisTiJauregui'}</span>
                </div>
                
                <input type="text" id="username-input" class="input-field" placeholder="Nuevo nombre de usuario">
                
                <button id="save-btn" class="save-button">Guardar</button>
            </div>
        `;
    }
    
    private setupEventListeners() {
        if (!this.shadowRoot) return;
        
        const backButton = this.shadowRoot.querySelector('#back-btn');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('back', { 
                    bubbles: true,
                    composed: true
                }));
            });
        }
        
        const saveButton = this.shadowRoot.querySelector('#save-btn');
        if (saveButton) {
            saveButton.addEventListener('click', this.handleSaveClick.bind(this));
        }

        const usernameInput = this.shadowRoot.querySelector('#username-input') as HTMLInputElement;
        if (usernameInput) {
            usernameInput.addEventListener('input', this.validateInput.bind(this));
        }
    }

    private validateInput(): void {
        const usernameInput = this.shadowRoot?.querySelector('#username-input') as HTMLInputElement;
        const saveButton = this.shadowRoot?.querySelector('#save-btn') as HTMLButtonElement;
        
        if (usernameInput && saveButton) {
            const value = usernameInput.value.trim();
            const currentUsernameWithoutAt = this.username.replace('@', '');
            
            saveButton.disabled = value.length === 0 || value === currentUsernameWithoutAt;
        }
    }

private handleSaveClick(): void {
    const inputField = this.shadowRoot?.querySelector('#username-input') as HTMLInputElement;
    const saveButton = this.shadowRoot?.querySelector('#save-btn') as HTMLButtonElement;
    
    if (!inputField || !inputField.value.trim()) {
        return;
    }

    const newUsername = inputField.value.trim();
    
    if (!window.UserActions) {
        alert('Error: Sistema de usuario no disponible');
        return;
    }

    if (!window.userStore) {
        alert('Error: Almacén de usuario no disponible');
        return;
    }

    saveButton.disabled = true;
    saveButton.classList.add('loading');
    saveButton.textContent = 'Guardando...';

    try {
        window.UserActions.updateUsername(newUsername);
        
        inputField.value = '';
        this.showSuccessMessage();

        this.dispatchEvent(new CustomEvent('save', { 
            detail: { newUsername },
            bubbles: true,
            composed: true
        }));
    } catch (error) {
        console.error('Error al guardar el cambio:', error);
        alert('Error al guardar el cambio. Por favor intenta de nuevo.');
    } finally {
        setTimeout(() => {
            saveButton.disabled = false;
            saveButton.classList.remove('loading');
            saveButton.textContent = 'Guardar';
            this.validateInput();
        }, 1000);
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
            font-family: Arial, sans-serif;
            font-weight: 600;
            box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3);
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        toast.textContent = ' Tu nombre de usuario cambió con éxito';
        
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
}

export default CambiarNombreSimple;