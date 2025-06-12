// src/Pages/LogIn/Login.ts - Página de Login actualizada
class LoginPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.render();
        this.setupEventListeners();
    }

    disconnectedCallback(): void {
        this.removeEventListeners();
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                }

                .login-page {
                    display: flex;
                    width: 100%;
                    min-height: 100vh;
                }

                .left-panel {
                    flex: 1;
                    background: linear-gradient(135deg, #AAAB54, #999A4A);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 40px;
                    color: white;
                    position: relative;
                    overflow: hidden;
                }

                .left-panel::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.05"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.08"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                    animation: float 20s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(-20px, -20px) rotate(1deg); }
                    66% { transform: translate(20px, -10px) rotate(-1deg); }
                }

                .brand-content {
                    text-align: center;
                    z-index: 2;
                    position: relative;
                }

                .brand-logo {
                    font-size: 64px;
                    font-weight: 900;
                    margin-bottom: 24px;
                    letter-spacing: -2px;
                    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                .brand-tagline {
                    font-size: 24px;
                    font-weight: 300;
                    margin-bottom: 16px;
                    opacity: 0.9;
                }

                .brand-description {
                    font-size: 16px;
                    opacity: 0.8;
                    max-width: 400px;
                    line-height: 1.6;
                }

                .right-panel {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 40px;
                    background: white;
                    position: relative;
                }

                .back-to-home {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    background: none;
                    border: none;
                    color: #666;
                    font-size: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    font-family: inherit;
                }

                .back-to-home:hover {
                    background: #f0f0f0;
                    color: #333;
                    transform: translateX(-2px);
                }

                .firebase-status {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, rgba(66, 133, 244, 0.1), rgba(52, 168, 83, 0.1));
                    border: 1px solid rgba(66, 133, 244, 0.2);
                    border-radius: 20px;
                    padding: 6px 12px;
                    font-size: 11px;
                    color: #4285f4;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: linear-gradient(135deg, #4285f4, #34a853);
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.1); }
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .login-page {
                        flex-direction: column;
                    }

                    .left-panel {
                        min-height: 40vh;
                        padding: 20px;
                    }

                    .brand-logo {
                        font-size: 48px;
                        margin-bottom: 16px;
                    }

                    .brand-tagline {
                        font-size: 20px;
                        margin-bottom: 12px;
                    }

                    .brand-description {
                        font-size: 14px;
                    }

                    .right-panel {
                        padding: 20px;
                        min-height: 60vh;
                    }

                    .back-to-home {
                        position: static;
                        margin-bottom: 20px;
                        align-self: flex-start;
                    }

                    .firebase-status {
                        position: static;
                        margin-bottom: 20px;
                        align-self: flex-end;
                    }
                }
            </style>

            <div class="login-page">
                <div class="left-panel">
                    <div class="brand-content">
                        <div class="brand-logo">Lulada</div>
                        <div class="brand-tagline">Tu guía gastronómica</div>
                        <div class="brand-description">
                            Descubre los mejores sabores de Cali a través de reseñas auténticas 
                            de nuestra comunidad. Comparte tus experiencias y encuentra tu próximo 
                            restaurante favorito.
                        </div>
                    </div>
                </div>

                <div class="right-panel">
                    <button class="back-to-home" id="back-home">
                        ← Volver al inicio
                    </button>

                    <div class="firebase-status">
                        <div class="status-dot"></div>
                        <span>Firebase Auth Activo</span>
                    </div>

                    <login-form></login-form>
                </div>
            </div>
        `;
    }

    private setupEventListeners(): void {
        const backButton = this.shadowRoot?.getElementById('back-home') as HTMLButtonElement;
        
        backButton?.addEventListener('click', () => {
            const navEvent = new CustomEvent('navigate', {
                detail: '/home',
                bubbles: true,
                composed: true
            });
            document.dispatchEvent(navEvent);
        });

        // Escuchar eventos de navegación del formulario
        this.shadowRoot?.addEventListener('navigate', (event: Event) => {
            const customEvent = event as CustomEvent;
            document.dispatchEvent(new CustomEvent('navigate', {
                detail: customEvent.detail,
                bubbles: true,
                composed: true
            }));
        });
    }

    private removeEventListeners(): void {
        // Los event listeners se limpian automáticamente con el shadow DOM
    }
}

// src/Pages/NewAccount/containernewaccount.ts - Página de Registro actualizada
class NewAccount extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.render();
        this.setupEventListeners();
    }

    disconnectedCallback(): void {
        this.removeEventListeners();
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                }

                .register-page {
                    display: flex;
                    width: 100%;
                    min-height: 100vh;
                }

                .left-panel {
                    flex: 1;
                    background: linear-gradient(135deg, #AAAB54, #999A4A);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 40px;
                    color: white;
                    position: relative;
                    overflow: hidden;
                }

                .left-panel::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.05"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.08"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                    animation: float 25s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(-15px, -25px) rotate(0.5deg); }
                    50% { transform: translate(15px, -15px) rotate(-0.5deg); }
                    75% { transform: translate(-10px, 10px) rotate(0.3deg); }
                }

                .brand-content {
                    text-align: center;
                    z-index: 2;
                    position: relative;
                }

                .brand-logo {
                    font-size: 64px;
                    font-weight: 900;
                    margin-bottom: 24px;
                    letter-spacing: -2px;
                    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                .brand-tagline {
                    font-size: 24px;
                    font-weight: 300;
                    margin-bottom: 16px;
                    opacity: 0.9;
                }

                .brand-description {
                    font-size: 16px;
                    opacity: 0.8;
                    max-width: 400px;
                    line-height: 1.6;
                    margin-bottom: 32px;
                }

                .features-list {
                    text-align: left;
                    max-width: 350px;
                }

                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                    font-size: 14px;
                    opacity: 0.9;
                }

                .feature-icon {
                    width: 24px;
                    height: 24px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    flex-shrink: 0;
                }

                .right-panel {
                    flex: 1.2;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 40px;
                    background: white;
                    position: relative;
                    overflow-y: auto;
                }

                .back-to-home {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    background: none;
                    border: none;
                    color: #666;
                    font-size: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    font-family: inherit;
                }

                .back-to-home:hover {
                    background: #f0f0f0;
                    color: #333;
                    transform: translateX(-2px);
                }

                .firebase-status {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, rgba(66, 133, 244, 0.1), rgba(52, 168, 83, 0.1));
                    border: 1px solid rgba(66, 133, 244, 0.2);
                    border-radius: 20px;
                    padding: 6px 12px;
                    font-size: 11px;
                    color: #4285f4;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: linear-gradient(135deg, #4285f4, #34a853);
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.1); }
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .register-page {
                        flex-direction: column;
                    }

                    .left-panel {
                        min-height: 35vh;
                        padding: 20px;
                    }

                    .brand-logo {
                        font-size: 48px;
                        margin-bottom: 16px;
                    }

                    .brand-tagline {
                        font-size: 20px;
                        margin-bottom: 12px;
                    }

                    .brand-description {
                        font-size: 14px;
                        margin-bottom: 20px;
                    }

                    .features-list {
                        display: none;
                    }

                    .right-panel {
                        padding: 20px;
                        min-height: 65vh;
                    }

                    .back-to-home, .firebase-status {
                        position: static;
                        margin-bottom: 20px;
                    }

                    .back-to-home {
                        align-self: flex-start;
                    }

                    .firebase-status {
                        align-self: flex-end;
                    }
                }
            </style>

            <div class="register-page">
                <div class="left-panel">
                    <div class="brand-content">
                        <div class="brand-logo">Lulada</div>
                        <div class="brand-tagline">Únete a nuestra comunidad</div>
                        <div class="brand-description">
                            Sé parte de la comunidad gastronómica más grande de Cali. 
                            Comparte tus experiencias culinarias y descubre nuevos sabores.
                        </div>
                        
                        <div class="features-list">
                            <div class="feature-item">
                                <div class="feature-icon">🍽️</div>
                                <span>Reseña restaurantes auténticos</span>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">⭐</div>
                                <span>Califica tus experiencias</span>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">📍</div>
                                <span>Explora por zonas de Cali</span>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">🔥</div>
                                <span>Datos sincronizados en tiempo real</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="right-panel">
                    <button class="back-to-home" id="back-home">
                        ← Volver al inicio
                    </button>

                    <div class="firebase-status">
                        <div class="status-dot"></div>
                        <span>Registro Seguro</span>
                    </div>

                    <button-new-account></button-new-account>
                </div>
            </div>
        `;
    }

    private setupEventListeners(): void {
        const backButton = this.shadowRoot?.getElementById('back-home') as HTMLButtonElement;
        
        backButton?.addEventListener('click', () => {
            const navEvent = new CustomEvent('navigate', {
                detail: '/home',
                bubbles: true,
                composed: true
            });
            document.dispatchEvent(navEvent);
        });

        // Escuchar eventos de navegación del formulario
        this.shadowRoot?.addEventListener('navigate', (event: Event) => {
            const customEvent = event as CustomEvent;
            document.dispatchEvent(new CustomEvent('navigate', {
                detail: customEvent.detail,
                bubbles: true,
                composed: true
            }));
        });
    }

    private removeEventListeners(): void {
        // Los event listeners se limpian automáticamente con el shadow DOM
    }
}

export { LoginPage, NewAccount };
export default LoginPage;