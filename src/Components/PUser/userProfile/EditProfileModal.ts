// Este archivo contiene el modal de edición de perfil con
// sincronización local (Flux) y remota (Firebase). Se han
// consolidado todas las secciones duplicadas y se han
// incorporado las funciones añadidas por el usuario.

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
   * Utilidades de formulario
   * ------------------------------------------------------------------ */
  private updateFormFields(): void {
    if (!this.shadowRoot || !this.currentUser) return;

    const nameInput = this.shadowRoot.querySelector(
      "#name-input"
    ) as HTMLInputElement | null;
    const descriptionTextarea = this.shadowRoot.querySelector(
      "#description-textarea"
    ) as HTMLTextAreaElement | null;
    const currentUsernameEl = this.shadowRoot.querySelector(
      "#current-username"
    );

    if (nameInput) {
      nameInput.value = this.currentUser.nombre || "";
    }

    if (descriptionTextarea) {
      descriptionTextarea.value = this.currentUser.descripcion || "";
      this.updateCharacterCount();
    }

    if (currentUsernameEl) {
      currentUsernameEl.textContent =
        this.currentUser.nombreDeUsuario || "@usuario";
    }
  }

  private validateName(): boolean {
    const nameInput = this.shadowRoot?.querySelector(
      "#name-input"
    ) as HTMLInputElement | null;
    const validation = this.shadowRoot?.querySelector(
      "#name-validation"
    );

    if (!nameInput || !validation) return false;

    const value = nameInput.value.trim();

    if (!value) {
      validation.textContent = "El nombre es requerido";
      validation.className = "validation-message error";
      return false;
    }

    if (value.length < 2) {
      validation.textContent = "El nombre debe tener al menos 2 caracteres";
      validation.className = "validation-message error";
      return false;
    }

    validation.className = "validation-message";
    validation.textContent = "";
    return true;
  }

  private updateCharacterCount(): void {
    const textarea = this.shadowRoot?.querySelector(
      "#description-textarea"
    ) as HTMLTextAreaElement | null;
    const counter = this.shadowRoot?.querySelector("#desc-count");

    if (!textarea || !counter) return;

    const count = textarea.value.length;
    const maxLength = 200;

    counter.textContent = `${count}/${maxLength}`;

    if (count > maxLength * 0.8) {
      counter.classList.add("warning");
    } else {
      counter.classList.remove("warning");
    }
  }

  private updateSaveButton(): void {
    const saveBtn = this.shadowRoot?.querySelector(
      "#save-btn"
    ) as HTMLButtonElement | null;
    if (!saveBtn) return;

    saveBtn.disabled = !this.validateName();
  }

  private getUserActions(): {
    updateFullName: (name: string) => void;
    updateDescription: (description: string) => void;
  } | null {
    const win = window as typeof window & {
      UserActions?: {
        updateFullName: (name: string) => void;
        updateDescription: (description: string) => void;
      };
    };
    return win.UserActions || null;
  }

  /* ------------------------------------------------------------------
   * Evento principal: Guardar cambios
   * ------------------------------------------------------------------ */
  private async handleSave(): Promise<void> {
    if (!this.validateName()) return;

    const nameInput = this.shadowRoot?.querySelector(
      "#name-input"
    ) as HTMLInputElement | null;
    const descriptionTextarea = this.shadowRoot?.querySelector(
      "#description-textarea"
    ) as HTMLTextAreaElement | null;
    const saveBtn = this.shadowRoot?.querySelector(
      "#save-btn"
    ) as HTMLButtonElement | null;

    if (!nameInput || !descriptionTextarea) return;

    const newName = nameInput.value.trim();
    const newDescription = descriptionTextarea.value.trim();

    const userActions = this.getUserActions();
    if (!userActions) {
      alert("Error: Sistema de usuario no disponible");
      return;
    }

    try {
      // Estado de carga
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = "Guardando...";
      }

      console.log("[EditProfileModal] Iniciando actualización de perfil...");

      // 1. Actualizar store (UI inmediata)
      userActions.updateFullName(newName);
      userActions.updateDescription(newDescription);

      // 2. Sincronizar con Firebase (si está disponible)
      try {
        const [{ firebaseUserSync }, { userStore }] = await Promise.all([
          import("../../../Services/firebase/FirebaseUserSync"),
          import("../../../Services/flux/UserStore"),
        ]);

        const updatedUser = userStore.getCurrentUser();
        if (updatedUser) {
          console.log("[EditProfileModal] Sincronizando con Firebase...");
          const firebaseResult = await firebaseUserSync.updateUserProfile(
            updatedUser
          );

          if (!firebaseResult.success) {
            console.warn(
              "[EditProfileModal] Firebase sync warning:",
              firebaseResult.error
            );
            this.showWarningMessage(
              "Cambios guardados localmente. Revisa tu conexión."
            );
          } else {
            console.log(
              "[EditProfileModal] ✅ Perfil sincronizado exitosamente con Firebase"
            );
            this.showSuccessMessage();
          }
        } else {
          throw new Error("No se pudo obtener el usuario actualizado");
        }
      } catch (firebaseError) {
        console.log(
          "[EditProfileModal] Firebase no disponible, solo guardado local:",
          firebaseError
        );
        this.showSuccessMessage();
      }

      setTimeout(() => this.hide(), 1500);
    } catch (err) {
      console.error("[EditProfileModal] Error al guardar los cambios:", err);
      this.showErrorMessage(
        "Error al guardar los cambios. Por favor intenta de nuevo."
      );

      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = "Guardar Cambios";
      }
    }
  }

  /* ------------------------------------------------------------------
   * Toasts de feedback
   * ------------------------------------------------------------------ */
  private showSuccessMessage(): void {
    const toast = this.createToast(
      "✅ Tu perfil se actualizó correctamente",
      "linear-gradient(135deg, #4CAF50, #45a049)"
    );
    this.animateToast(toast, 3000);
  }

  private showWarningMessage(message: string): void {
    const toast = this.createToast(
      `⚠️ ${message}`,
      "linear-gradient(135deg, #FF9800, #F57C00)"
    );
    this.animateToast(toast, 4000);
  }

  private showErrorMessage(message: string): void {
    const toast = this.createToast(
      `❌ ${message}`,
      "linear-gradient(135deg, #f44336, #d32f2f)"
    );
    this.animateToast(toast, 4000);
  }

  private createToast(text: string, background: string): HTMLDivElement {
    const toast = document.createElement("div");
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${background};
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      z-index: 10001;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      transform: translateX(100%);
      transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    toast.textContent = text;
    document.body.appendChild(toast);
    return toast;
  }

  private animateToast(toast: HTMLDivElement, duration: number): void {
    setTimeout(() => {
      toast.style.transform = "translateX(0)";
    }, 100);

    setTimeout(() => {
      toast.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 400);
    }, duration);
  }

  /* ------------------------------------------------------------------
   * Eventos y utilidades del modal
   * ------------------------------------------------------------------ */
  private setupEventListeners(): void {
    if (!this.shadowRoot) return;

    const closeBtn = this.shadowRoot.querySelector("#close-btn");
    closeBtn?.addEventListener("click", () => this.hide());

    const cancelBtn = this.shadowRoot.querySelector("#cancel-btn");
    cancelBtn?.addEventListener("click", () => this.hide());

    const modal = this.shadowRoot.querySelector(".modal");
    this.addEventListener("click", (e) => {
      if (e.target === this && modal) this.hide();
    });

    const saveBtn = this.shadowRoot.querySelector("#save-btn");
    saveBtn?.addEventListener("click", () => this.handleSave());

    const nameInput = this.shadowRoot.querySelector("#name-input");
    nameInput?.addEventListener("input", () => {
      this.validateName();
      this.updateSaveButton();
    });

    const descriptionTextarea = this.shadowRoot.querySelector(
      "#description-textarea"
    );
    descriptionTextarea?.addEventListener("input", () =>
      this.updateCharacterCount()
    );
  }

  public show(): void {
    this._isVisible = true;
    this.classList.add("visible");
    document.body.style.overflow = "hidden";

    this.keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && this._isVisible) this.hide();
    };
    document.addEventListener("keydown", this.keyDownHandler);

    setTimeout(() => {
      const firstInput = this.shadowRoot?.querySelector(
        "#name-input"
      ) as HTMLInputElement | null;
      firstInput?.focus();
    }, 300);
  }

  public hide(): void {
    this._isVisible = false;
    this.classList.remove("visible");
    document.body.style.overflow = "auto";

    if (this.keyDownHandler) {
      document.removeEventListener("keydown", this.keyDownHandler);
      this.keyDownHandler = null;
    }

    // Restaurar botón y mensajes después de animación
    setTimeout(() => {
      const saveBtn = this.shadowRoot?.querySelector(
        "#save-btn"
      ) as HTMLButtonElement | null;
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = "Guardar Cambios";
      }

      const validation = this.shadowRoot?.querySelector("#name-validation");
      if (validation) {
        validation.className = "validation-message";
        validation.textContent = "";
      }
    }, 300);
  }

  /* ------------------------------------------------------------------
   * API externa
   * ------------------------------------------------------------------ */
  public updateUserData(userData: UserData): void {
    this.currentUser = userData;
    this.updateFormFields();
  }

  /* ------------------------------------------------------------------
   * Render (HTML + CSS)
   * ------------------------------------------------------------------ */
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
          to   { opacity: 1; }
        }

        .modal {
          background: white;
          border-radius: 20px;
          padding: 30px;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { transform: translateY(-50px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e0e0e0;
        }

        .modal-title {
          font-size: 24px;
          font-weight: 700;
          color: #333;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 5px;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background-color: #f5f5f5;
          color: #333;
        }

        .form-group { margin-bottom: 20px; }

        .form-label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 16px;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #4CAF50;
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .character-count {
          font-size: 12px;
          color: #666;
          text-align: right;
          margin-top: 5px;
        }

        .character-count.warning { color: #ff9800; font-weight: 600; }

        .validation-message { font-size: 12px; min-height: 16px; margin-top: 5px; }
        .validation-message.error { color: #f44336; font-weight: 500; }

        .username-info {
          background: #f8f9fa;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid #4CAF50;
        }

        .username-info-text { font-size: 14px; color: #666; margin: 0 0 5px; }
        .current-username     { font-weight: 600; color: #4CAF50; font-size: 16px; }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }

        .btn-secondary { background: #f5f5f5; color: #666; }
        .btn-secondary:hover { background: #e0e0e0; }

        .btn-primary {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }
        .btn-primary:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        @media (max-width: 600px) {
          .modal {
            margin: 20px;
            padding: 20px;
            max-width: none;
            width: calc(100% - 40px);
          }
          .modal-title { font-size: 20px; }
          .modal-actions { flex-direction: column; }
          .btn { width: 100%; }
        }
      </style>

      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Editar Perfil</h2>
          <button class="close-btn" id="close-btn">&times;</button>
        </div>

        <div class="username-info">
          <p class="username-info-text">Tu nombre de usuario actual:</p>
          <p class="current-username" id="current-username">@usuario</p>
        </div>

        <div class="form-group">
          <label class="form-label" for="name-input">Nombre completo *</label>
          <input
            type="text"
            class="form-input"
            id="name-input"
            placeholder="Ingresa tu nombre completo"
            maxlength="50"
          />
          <div class="validation-message" id="name-validation"></div>
        </div>

        <div class="form-group">
          <label class="form-label" for="description-textarea">Descripción</label>
          <textarea
            class="form-textarea"
            id="description-textarea"
            placeholder="Cuéntanos un poco sobre ti..."
            maxlength="200"
          ></textarea>
          <div class="character-count" id="desc-count">0/200</div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" id="cancel-btn">Cancelar</button>
          <button class="btn btn-primary" id="save-btn" disabled>Guardar Cambios</button>
        </div>
      </div>
    `;
  }
}

customElements.define("edit-profile-modal", EditProfileModal);
export default EditProfileModal;
