import { UserData } from '../../../Services/flux/UserActions';

const FIXED_PROFILE_PHOTO = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

class EditProfileModal extends HTMLElement {
  private currentUser: UserData | null = null;
  private _isVisible = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback(): void {
    this.setupEventListeners();
  }

  disconnectedCallback(): void {
    this.removeEventListeners();
  }

  private render(): void {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = /*html*/ `
      <style>
        :host {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: none;
          align-items: center;
          justify-content: center;
          padding: 20px;
          box-sizing: border-box;
        }

        :host(.visible) {
          display: flex;
        }

        .modal {
          background: white;
          border-radius: 20px;
          padding: 32px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f0f0f0;
        }

        .modal-title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin: 0;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 8px;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .close-button:hover {
          background: #f5f5f5;
          color: #333;
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
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          font-size: 16px;
          font-family: inherit;
          transition: all 0.2s ease;
          box-sizing: border-box;
          background: #fafbfc;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #AAAB54;
          background: white;
          box-shadow: 0 0 0 3px rgba(170, 171, 84, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
          font-family: inherit;
        }

        .char-counter {
          text-align: right;
          font-size: 12px;
          margin-top: 4px;
          color: #666;
        }

        .form-buttons {
          display: flex;
          gap: 12px;
          margin-top: 32px;
        }

        .btn {
          flex: 1;
          padding: 14px 24px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #AAAB54;
          color: white;
        }

        .btn-primary:hover {
          background: #999A4A;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(170, 171, 84, 0.3);
        }

        .btn-secondary {
          background: #f8f9fa;
          color: #666;
          border: 2px solid #e1e5e9;
        }

        .btn-secondary:hover {
          background: #e9ecef;
          color: #333;
        }

        .message {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-weight: 500;
          text-align: center;
          display: none;
        }

        .message.error {
          background: #fee;
          color: #c33;
          border: 1px solid #fcc;
        }

        .message.success {
          background: #efe;
          color: #393;
          border: 1px solid #cfc;
        }

        @media (max-width: 600px) {
          .modal {
            padding: 24px;
            margin: 10px;
            max-height: 95vh;
          }

          .modal-title {
            font-size: 20px;
          }

          .form-buttons {
            flex-direction: column;
          }
        }
      </style>

      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Editar Perfil</h2>
          <button class="close-button" id="close-btn">&times;</button>
        </div>

        <div id="error-message" class="message error"></div>
        <div id="success-message" class="message success"></div>

        <form id="edit-profile-form" novalidate>
          <div class="form-group">
            <label for="nombre" class="form-label">Nombre completo</label>
            <input type="text" id="nombre" name="nombre" class="form-input" required>
          </div>

          <div class="form-group">
            <label for="nombreDeUsuario" class="form-label">Nombre de usuario</label>
            <input type="text" id="nombreDeUsuario" name="nombreDeUsuario" class="form-input" required>
          </div>

          <div class="form-group">
            <label for="descripcion" class="form-label">Descripción</label>
            <textarea id="descripcion" name="descripcion" class="form-textarea" maxlength="200" placeholder="Cuéntanos un poco sobre ti..."></textarea>
            <div class="char-counter" id="char-counter">0/200</div>
          </div>

          <div class="form-buttons">
            <button type="button" class="btn btn-secondary" id="cancel-btn">Cancelar</button>
            <button type="submit" class="btn btn-primary" id="save-btn">Guardar Cambios</button>
          </div>
        </form>
      </div>
    `;
  }

  private setupEventListeners(): void {
    if (!this.shadowRoot) return;

    const form = this.shadowRoot.querySelector('#edit-profile-form') as HTMLFormElement;
    const closeBtn = this.shadowRoot.querySelector('#close-btn');
    const cancelBtn = this.shadowRoot.querySelector('#cancel-btn');

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit(e);
    });

    closeBtn?.addEventListener('click', () => this.hide());
    cancelBtn?.addEventListener('click', () => this.hide());

    document.addEventListener('keydown', this.handleKeydown);
    this.addEventListener('click', (e) => {
      if (e.target === this) this.hide();
    });

    this.setupCharacterCounter();
  }

  private removeEventListeners(): void {
    document.removeEventListener('keydown', this.handleKeydown);
  }

  private handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this._isVisible) {
      this.hide();
    }
  };

  private setupCharacterCounter(): void {
    const descriptionInput = this.shadowRoot?.querySelector('#descripcion') as HTMLTextAreaElement;
    const charCounter = this.shadowRoot?.querySelector('#char-counter') as HTMLElement;

    if (!descriptionInput || !charCounter) return;

    const updateCharCount = () => {
      const count = descriptionInput.value.length;
      charCounter.textContent = `${count}/200`;
      charCounter.style.color = count > 180 ? "#dc3545" : count > 150 ? "#ffc107" : "#666";
    };

    descriptionInput.addEventListener("input", updateCharCount);
    updateCharCount();
  }

  private handleFormSubmit(e: Event): void {
    if (!this.shadowRoot || !this.currentUser) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const newUserData: UserData = {
      ...this.currentUser,
      nombre: (formData.get("nombre") as string)?.trim() || this.currentUser.nombre,
      nombreDeUsuario: (formData.get("nombreDeUsuario") as string)?.trim() || this.currentUser.nombreDeUsuario,
      descripcion: (formData.get("descripcion") as string)?.trim() || this.currentUser.descripcion || "",
    };

    if (!newUserData.nombre) return this.showError("El nombre es requerido");
    if (!newUserData.nombreDeUsuario) return this.showError("El nombre de usuario es requerido");
    if (newUserData.nombreDeUsuario.length < 3) return this.showError("El nombre de usuario debe tener al menos 3 caracteres");
    if (!/^[a-zA-Z0-9_.-]+$/.test(newUserData.nombreDeUsuario)) return this.showError("El nombre de usuario solo puede contener letras, números, guiones y puntos");

    this.showSuccess("Perfil actualizado correctamente");

    if (typeof window !== 'undefined' && window.UserActions) {
      window.UserActions.updateUserData(newUserData);
    }

    setTimeout(() => {
      this.hide();
    }, 1500);
  }

  private updateFormFields(): void {
    if (!this.shadowRoot || !this.currentUser) return;

    const nombreInput = this.shadowRoot.querySelector("#nombre") as HTMLInputElement;
    const usernameInput = this.shadowRoot.querySelector("#nombreDeUsuario") as HTMLInputElement;
    const descripcionInput = this.shadowRoot.querySelector("#descripcion") as HTMLTextAreaElement;

    if (nombreInput) nombreInput.value = this.currentUser.nombre || "";
    if (usernameInput) usernameInput.value = this.currentUser.nombreDeUsuario || "";
    if (descripcionInput) descripcionInput.value = this.currentUser.descripcion || "";
  }

  private showError(message: string): void {
    this.showMessage(message, "error");
  }

  private showSuccess(message: string): void {
    this.showMessage(message, "success");
  }

  private showMessage(message: string, type: "error" | "success"): void {
    if (!this.shadowRoot) return;

    const messageEl = this.shadowRoot.querySelector(`#${type}-message`) as HTMLElement;
    if (messageEl) {
      messageEl.textContent = message;
      messageEl.style.display = "block";

      setTimeout(() => {
        messageEl.style.display = "none";
      }, 3000);
    }
  }

  public show(): void {
    this._isVisible = true;
    this.classList.add('visible');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      const firstInput = this.shadowRoot?.querySelector('#nombre') as HTMLInputElement;
      firstInput?.focus();
    }, 100);
  }

  public hide(): void {
    this._isVisible = false;
    this.classList.remove('visible');
    document.body.style.overflow = '';
  }

  public getCurrentUser(): UserData | null {
    return this.currentUser;
  }

  public setUser(userData: UserData): void {
    this.currentUser = { ...userData };
    this.updateFormFields();
  }

  public resetForm(): void {
    const form = this.shadowRoot?.querySelector("#edit-profile-form") as HTMLFormElement;
    form?.reset();
    this.updateFormFields();
  }

  public debug(): void {
    console.group("🔍 EditProfileModal Debug");
    console.log("Usuario actual:", this.currentUser);
    console.log("Modal visible:", this._isVisible);
    console.log("Elemento conectado:", this.isConnected);
    console.groupEnd();
  }
}

// ✅ SIN REGISTRO AUTOMÁTICO - se registra desde index.ts
export { EditProfileModal };
export default EditProfileModal;