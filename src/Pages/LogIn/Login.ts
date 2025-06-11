import { loginUser } from "../../Services/firebase/Authservice";
// Página de inicio de sesión
class LoginPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }
      connectedCallback() {
        this.setupListeners();
    }

    setupListeners() {
        const form = this.shadowRoot?.querySelector("form");
        form?.addEventListener("submit", async (e) => {
            e.preventDefault();

            const emailInput = this.shadowRoot?.querySelector("#email") as HTMLInputElement;
            const passwordInput = this.shadowRoot?.querySelector("#password") as HTMLInputElement;
            const errorMsg = this.shadowRoot?.querySelector(".error-message");

            if (emailInput && passwordInput && errorMsg) {
                const email = emailInput.value.trim();
                const password = passwordInput.value.trim();

                if (!email || !password) {
                    errorMsg.textContent = "Por favor, completa todos los campos";
                    return;
                }

                // Mostrar estado de carga
                const submitBtn = this.shadowRoot?.querySelector("button[type='submit']") as HTMLButtonElement;
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = "Iniciando sesión...";
                }

                // Intentar iniciar sesión
                const result = await loginUser(email, password);

                if (result.success) {
                    // Redirigir a la página de inicio
                    window.history.pushState({}, "", "/home");
                    const event = new CustomEvent("route-change", {
                        bubbles: true,
                        composed: true,
                        detail: { path: "/home" },
                    });
                    this.dispatchEvent(event);
                } else {
                    // Mostrar error con sugerencia de registro
                    errorMsg.innerHTML = `
                        Error al iniciar sesión. Verifica tus credenciales.<br>
                        <span style="font-size: 12px; margin-top: 8px; display: block;">
                            ¿No tienes una cuenta? <a class="register-error-link" style="color: var(--primary-color); cursor: pointer; text-decoration: underline;">Regístrate aquí</a>
                        </span>
                    `;

                    // Agregar listener al enlace de registro en el error
                    const registerErrorLink = this.shadowRoot?.querySelector(".register-error-link");
                    registerErrorLink?.addEventListener("click", (e) => {
                        e.preventDefault();
                        window.history.pushState({}, "", "/register");
                        const event = new CustomEvent("route-change", {
                            bubbles: true,
                            composed: true,
                            detail: { path: "/register" },
                        });
                        this.dispatchEvent(event);
                    });

                    // Restaurar botón
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = "Iniciar sesión";
                    }
                }
            }
        });

        // Enlace para ir a registro
        const registerLink = this.shadowRoot?.querySelector(".register-link");
        registerLink?.addEventListener("click", (e) => {
            e.preventDefault();
            window.history.pushState({}, "", "/register");
            const event = new CustomEvent("route-change", {
                bubbles: true,
                composed: true,
                detail: { path: "/register" },
            });
            this.dispatchEvent(event);
        });
    }
        render() {
        
        
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        font-family: Arial, sans-serif;
                    }
                    
                    .login-page-container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background-color: white;
                        padding: 20px;
                    }
                    
                    .content-wrapper {
                        display: flex;
                        align-items: center;
                        max-width: 900px;
                        width: 100%;
                    }
                    
                    .logo-section {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        flex: 1;
                        padding-right: 40px;
                    }
                    
                    .logo-section img {
                        width: 400px;
                        height: auto;
                    }
                    
                    /* Responsive para móviles */
                    @media (max-width: 768px) {
                        .content-wrapper {
                            flex-direction: column;
                            gap: 30px;
                        }
                        
                        .logo-section {
                            padding-right: 0;
                        }
                        
                        .logo-section img {
                            width: 150px;
                        }
                    }
                </style>
                
               <div class="login-page-container">
                    <div class="content-wrapper">
                        <div class="logo-section">
                            <img 
                                src="https://i.postimg.cc/t44LmL1m/Capa-1.png" 
                                alt="Lulada Logo"
                            >
                        </div>
                        
                        <div class="form-section">
                            <login-form></login-form>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}

export default LoginPage;