// src/Components/PUser/userProfile/EditProfileModal.ts - CORREGIDO
import { userStore, UserState } from "../../../Services/flux/UserStore";
import { UserData } from "../../../Services/flux/UserActions";

// Modal para editar el perfil del usuario
class EditProfileModal extends HTMLElement {
  private currentUser: UserData | null = null;
  private storeListener = this.handleStoreChange.bind(this);
  private _isVisible = false;
  private keyDownHandler: ((e: KeyboardEvent) => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  /* ------------------------------------------------------------------
   * Ciclo de vida del componente
   * ------------------------------------------------------------------ */
  connectedCallback() {
    userStore.subscribe(this.storeListener);

    const currentUser = userStore.getCurrentUser();
    if (currentUser) {
      this.currentUser = { ...currentUser };
    }

    this.render();
    this.setupEventListeners();
    this.updateFormFields();
  }

  disconnectedCallback() {
    userStore.unsubscribe(this.storeListener);

    if (this.keyDownHandler) {
      document.removeEventListener("keydown", this.keyDownHandler);
    }
  }

  /* ------------------------------------------------------------------
   * Manejo del estado del store
   * ------------------------------------------------------------------ */
  private handleStoreChange(state: UserState): void {
    const newUser = state.currentUser;
    if (JSON.stringify(this.currentUser) !== JSON.stringify(newUser)) {
      this.currentUser = newUser ? { ...newUser } : null;
      this.updateFormFields();
    }
  }

  /* ------------------------------------------------------------------
   * Control de visibilidad
   * ------------------------------------------------------------------ */
  public show(): void {
    if (this._isVisible) return;

    this._isVisible = true;
    const modal = this.shadowRoot?.querySelector(
      ".modal-container"
    ) as HTMLElement;
    if (modal) {
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";

      // Focus en el primer input
      setTimeout(() => {
        const firstInput = this.shadowRoot?.querySelector(
          "input"
        ) as HTMLInputElement;
        firstInput?.focus();
      }, 100);
    }
  }

  public hide(): void {
    if (!this._isVisible) return;

    this._isVisible = false;
    const modal = this.shadowRoot?.querySelector(
      ".modal-container"
    ) as HTMLElement;
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }
  }

  public toggle(): void {
    this._isVisible ? this.hide() : this.show();
  }

  public get isVisible(): boolean {
    return this._isVisible;
  }

  /* ------------------------------------------------------------------
   * Renderizado
   * ------------------------------------------------------------------ */
  private render(): void {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        .modal-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: none;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          padding: 20px;
          box-sizing: border-box;
        }

        .modal-content {
          background: white;
          border-radius: 15px;
          padding: 30px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #f0f0f0;
          color: #333;
        }

        .modal-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 25px;
          color: #333;
          text-align: center;
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

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #AAAB54;
          box-shadow: 0 0 0 3px rgba(170, 171, 84, 0.1);
        }

        textarea.form-input {
          resize: vertical;
          min-height: 80px;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          margin-top: 30px;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #AAAB54, #999A4A);
          color: white;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #999A4A, #8a8b3a);
          transform: translateY(-2px);
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

        .error-message {
          color: #dc3545;
          font-size: 14px;
          margin-top: 10px;
          padding: 10px;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
          display: none;
        }

        .success-message {
          color: #155724;
          font-size: 14px;
          margin-top: 10px;
          padding: 10px;
          background: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 4px;
          display: none;
        }

        .char-count {
          font-size: 12px;
          color: #666;
          text-align: right;
          margin-top: 5px;
        }

        @media (max-width: 768px) {
          .modal-content {
            margin: 10px;
            padding: 20px;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      </style>

      <div class="modal-container">
        <div class="modal-content">
          <button class="close-btn" id="close-modal">&times;</button>
          
          <h2 class="modal-title">Editar Perfil</h2>
          
          <form id="edit-profile-form">
            <div class="form-group">
              <label class="form-label" for="nombre">Nombre completo</label>
              <input 
                type="text" 
                id="nombre" 
                name="nombre" 
                class="form-input" 
                placeholder="Tu nombre completo"
                required
              >
            </div>

            <div class="form-group">
              <label class="form-label" for="nombreDeUsuario">Nombre de usuario</label>
              <input 
                type="text" 
                id="nombreDeUsuario" 
                name="nombreDeUsuario" 
                class="form-input" 
                placeholder="@usuario"
                required
              >
            </div>

            <div class="form-group">
              <label class="form-label" for="descripcion">Descripción</label>
              <textarea 
                id="descripcion" 
                name="descripcion" 
                class="form-input" 
                placeholder="Cuéntanos algo sobre ti..."
                maxlength="200"
              ></textarea>
              <div class="char-count">
                <span id="char-count">0</span>/200
              </div>
            </div>

            <div class="error-message" id="error-message"></div>
            <div class="success-message" id="success-message"></div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary cancel-btn">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary">
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  /* ------------------------------------------------------------------
   * Configuración de eventos - CORREGIDA
   * ------------------------------------------------------------------ */
  private setupEventListeners(): void {
    if (!this.shadowRoot) return;

    // CORREGIDO: Verificar que los elementos existen antes de agregar listeners
    const closeBtn = this.shadowRoot.querySelector("#close-modal");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.hide();
      });
    }

    // Cerrar al hacer clic fuera del contenido
    const modalContainer = this.shadowRoot.querySelector(".modal-container");
    if (modalContainer) {
      modalContainer.addEventListener("click", (e) => {
        if (e.target === modalContainer) this.hide();
      });
    }

    // Formulario
    const form = this.shadowRoot.querySelector("#edit-profile-form") as HTMLFormElement;
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleFormSubmit(e);
      });
    }

    // Botón cancelar
    const cancelBtn = this.shadowRoot.querySelector(".cancel-btn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.hide();
      });
    }

    // Tecla ESC
    this.keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && this._isVisible) this.hide();
    };
    document.addEventListener("keydown", this.keyDownHandler);

    // Contador de caracteres para descripción
    this.setupCharacterCounter();
  }

  /* ------------------------------------------------------------------
   * Contador de caracteres
   * ------------------------------------------------------------------ */
  private setupCharacterCounter(): void {
    const descriptionInput = this.shadowRoot?.querySelector("#descripcion") as HTMLTextAreaElement;
    const charCount = this.shadowRoot?.querySelector("#char-count") as HTMLElement;

    if (!descriptionInput || !charCount) return;

    const updateCharCount = () => {
      const count = descriptionInput.value.length;
      charCount.textContent = count.toString();
      charCount.style.color = count > 180 ? "#dc3545" : count > 150 ? "#ffc107" : "#666";
    };

    descriptionInput.addEventListener("input", updateCharCount);
    updateCharCount();
  }

  /* ------------------------------------------------------------------
   * Manejo del formulario
   * ------------------------------------------------------------------ */
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

    // Validaciones
    if (!newUserData.nombre) return this.showError("El nombre es requerido");
    if (!newUserData.nombreDeUsuario) return this.showError("El nombre de usuario es requerido");
    if (newUserData.nombreDeUsuario.length < 3) return this.showError("El nombre de usuario debe tener al menos 3 caracteres");
    if (!/^[a-zA-Z0-9_.-]+$/.test(newUserData.nombreDeUsuario)) return this.showError("El nombre de usuario solo puede contener letras, números, guiones y puntos");

    // Simular guardado
    this.showSuccess("Perfil actualizado correctamente");

    // Actualizar store
    // Define an interface for UserActions
    interface UserActions {
      updateUserData: (userData: UserData) => void;
    }
    
    if (typeof window !== 'undefined' && (window as unknown as { UserActions?: UserActions }).UserActions) {
      (window as unknown as { UserActions: UserActions }).UserActions.updateUserData(newUserData);
    }

    setTimeout(() => {
      this.hide();
    }, 1500);
  }

  /* ------------------------------------------------------------------
   * Actualizar campos del formulario
   * ------------------------------------------------------------------ */
  private updateFormFields(): void {
    if (!this.shadowRoot || !this.currentUser) return;

    const nombreInput = this.shadowRoot.querySelector("#nombre") as HTMLInputElement;
    const usernameInput = this.shadowRoot.querySelector("#nombreDeUsuario") as HTMLInputElement;
    const descripcionInput = this.shadowRoot.querySelector("#descripcion") as HTMLTextAreaElement;

    if (nombreInput) nombreInput.value = this.currentUser.nombre || "";
    if (usernameInput) usernameInput.value = this.currentUser.nombreDeUsuario || "";
    if (descripcionInput) descripcionInput.value = this.currentUser.descripcion || "";
  }

  /* ------------------------------------------------------------------
   * Mostrar mensajes
   * ------------------------------------------------------------------ */
  private showError(message: string): void {
    this.showMessage(message, "error");
  }

  private showSuccess(message: string): void {
    this.showMessage(message, "success");
  }

  private showMessage(message: string, type: "error" | "success"): void {
    if (!this.shadowRoot) return;

    this.shadowRoot.querySelector(".error-message")?.remove();
    this.shadowRoot.querySelector(".success-message")?.remove();

    const messageEl = this.shadowRoot.querySelector(`#${type}-message`) as HTMLElement;
    if (messageEl) {
      messageEl.textContent = message;
      messageEl.style.display = "block";

      setTimeout(() => {
        messageEl.style.display = "none";
      }, 3000);
    }
  }

  /* ------------------------------------------------------------------
   * Métodos públicos
   * ------------------------------------------------------------------ */
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

// Registrar el componente
customElements.define("edit-profile-modal", EditProfileModal);
export { EditProfileModal };
export default EditProfileModal;