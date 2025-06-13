// src/Components/Modals/EditProfileModal.ts
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
   * Configuración de eventos
   * ------------------------------------------------------------------ */
  private setupEventListeners(): void {
    if (!this.shadowRoot) return;

    // Botón cerrar
    this.shadowRoot
      .querySelector(".close-btn")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        this.hide();
      });

    // Cerrar al hacer clic fuera del contenido
    const modalContainer = this.shadowRoot.querySelector(".modal-container");
    modalContainer?.addEventListener("click", (e) => {
      if (e.target === modalContainer) this.hide();
    });

    // Formulario
    const form = this.shadowRoot.querySelector(
      "#edit-profile-form"
    ) as HTMLFormElement;
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmit(e);
    });

    // Botón cancelar
    this.shadowRoot
      .querySelector(".cancel-btn")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        this.hide();
      });

    // Tecla ESC
    this.keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && this._isVisible) this.hide();
    };
    document.addEventListener("keydown", this.keyDownHandler);

    // Input foto
    const photoInput = this.shadowRoot.querySelector(
      "#photo-input"
    ) as HTMLInputElement;
    photoInput?.addEventListener("change", (e) => this.handlePhotoChange(e));

    // Botón cambiar foto
    this.shadowRoot
      .querySelector(".change-photo-btn")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        photoInput?.click();
      });
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
      nombre:
        (formData.get("nombre") as string)?.trim() || this.currentUser.nombre,
      nombreDeUsuario:
        (formData.get("nombreDeUsuario") as string)?.trim() ||
        this.currentUser.nombreDeUsuario,
      descripcion:
        (formData.get("descripcion") as string)?.trim() ||
        this.currentUser.descripcion ||
        "",
    };

    // Validaciones
    if (!newUserData.nombre) return this.showError("El nombre es requerido");
    if (!newUserData.nombreDeUsuario)
      return this.showError("El nombre de usuario es requerido");
    if (newUserData.nombreDeUsuario.length < 3)
      return this.showError("El nombre de usuario debe tener al menos 3 caracteres");
    if (!/^[a-zA-Z0-9_.-]+$/.test(newUserData.nombreDeUsuario))
      return this.showError(
        "El nombre de usuario solo puede contener letras, números, guiones y puntos"
      );

    this.updateUser(newUserData);
  }

  private updateUser(userData: UserData): void {
    import("../../../Services/flux/UserActions")
      .then(({ UserActions }) => {
        UserActions.updateUserData(userData);
        this.showSuccess("Perfil actualizado correctamente");

        setTimeout(() => this.hide(), 1500);
      })
      .catch((err) => {
        console.error(err);
        this.showError("Error actualizando el perfil");
      });

    // Sincronizar con Firebase (si existe)
    this.syncWithFirebase(userData);
  }

  private async syncWithFirebase(userData: UserData): Promise<void> {
    try {
      const { FirebaseUserService } = await import(
        "../../../Services/firebase/FirebaseUserService"
      );
      const firebaseService = FirebaseUserService.getInstance();

      if (typeof (firebaseService as any).updateProfile === "function") {
        await (firebaseService as any).updateProfile(userData);
        console.log("✅ Perfil sincronizado con Firebase");
      }
    } catch (error) {
      console.warn("⚠️ No se pudo sincronizar con Firebase:", error);
    }
  }

  /* ------------------------------------------------------------------
   * Manejo de foto de perfil
   * ------------------------------------------------------------------ */
  private handlePhotoChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/"))
      return this.showError("Solo se permiten archivos de imagen");
    if (file.size > 5 * 1024 * 1024)
      return this.showError("La imagen no puede ser mayor a 5 MB");

    const reader = new FileReader();
    reader.onload = (ev) => {
      const imageUrl = ev.target?.result as string;
      const profileImg = this.shadowRoot?.querySelector(
        ".profile-image"
      ) as HTMLImageElement;
      if (profileImg) profileImg.src = imageUrl;
      if (this.currentUser) this.currentUser.foto = imageUrl;
    };
    reader.readAsDataURL(file);
  }

  /* ------------------------------------------------------------------
   * Actualización de campos del formulario
   * ------------------------------------------------------------------ */
  private updateFormFields(): void {
    if (!this.shadowRoot || !this.currentUser) return;

    (this.shadowRoot.querySelector(".profile-image") as HTMLImageElement).src =
      this.currentUser.foto || "/assets/default-avatar.png";

    (this.shadowRoot.querySelector("#nombre") as HTMLInputElement).value =
      this.currentUser.nombre || "";

    (this.shadowRoot.querySelector(
      "#nombreDeUsuario"
    ) as HTMLInputElement).value = this.currentUser.nombreDeUsuario || "";

    (this.shadowRoot.querySelector(
      "#descripcion"
    ) as HTMLTextAreaElement).value = this.currentUser.descripcion || "";
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

    this.shadowRoot.querySelector(".message")?.remove(); // quitar mensaje anterior

    const messageEl = document.createElement("div");
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;

    this.shadowRoot
      .querySelector(".modal-content")
      ?.insertAdjacentElement("afterbegin", messageEl);

    setTimeout(() => messageEl.remove(), 3000);
  }

  /* ------------------------------------------------------------------
   * Renderizado
   * ------------------------------------------------------------------ */
  private render(): void {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <!-- styles y HTML idénticos a los que ya disponías -->
      <!-- (para ahorrar espacio visual, los estilos se mantienen iguales) -->
      /* … pega aquí exactamente el bloque <style> y el HTML que ya tenías … */
    `;

    // Contador descripción
    const descriptionInput = this.shadowRoot.querySelector(
      "#descripcion"
    ) as HTMLTextAreaElement;
    const charCount = this.shadowRoot.querySelector(
      "#char-count"
    ) as HTMLElement;

    const updateCharCount = () => {
      const count = descriptionInput.value.length;
      charCount.textContent = count.toString();
      charCount.style.color =
        count > 180 ? "#dc3545" : count > 150 ? "#ffc107" : "#666";
    };

    descriptionInput.addEventListener("input", updateCharCount);
    updateCharCount();
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
    const form = this.shadowRoot?.querySelector(
      "#edit-profile-form"
    ) as HTMLFormElement;
    form?.reset();
    this.updateFormFields();
  }

  public validateForm(): boolean {
    if (!this.shadowRoot) return false;

    const nameInput = this.shadowRoot.querySelector("#nombre") as HTMLInputElement;
    const usernameInput = this.shadowRoot.querySelector(
      "#nombreDeUsuario"
    ) as HTMLInputElement;

    if (!nameInput.value.trim())
      return this.showError("El nombre es requerido"), false;
    if (!usernameInput.value.trim())
      return this.showError("El nombre de usuario es requerido"), false;
    if (usernameInput.value.length < 3)
      return this.showError("El nombre de usuario debe tener al menos 3 caracteres"), false;
    if (!/^[a-zA-Z0-9_.-]+$/.test(usernameInput.value))
      return this.showError("El nombre de usuario solo puede contener letras, números, guiones y puntos"), false;

    return true;
  }

  /* ------------------------------------------------------------------
   * Debug
   * ------------------------------------------------------------------ */
  public debug(): void {
    console.group("🔍 EditProfileModal Debug");
    console.log("Usuario actual:", this.currentUser);
    console.log("Modal visible:", this._isVisible);
    console.log("Elemento conectado:", this.isConnected);
    console.groupEnd();
  }

  public getFormData(): Record<string, string> {
    if (!this.shadowRoot) return {};
    const formData = new FormData(
      this.shadowRoot.querySelector("#edit-profile-form") as HTMLFormElement
    );
    return Object.fromEntries(formData.entries()) as Record<string, string>;
  }
}

// Registrar el componente
customElements.define("edit-profile-modal", EditProfileModal);
export { EditProfileModal };
