// src/Pages/LogIn/Login.ts - DISEÑO ORIGINAL RESTAURADO
class LoginPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.render();
        this.setupEventListeners();
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: 100vh;
                    font-family: 'Poppins', sans-serif;
                }

                .login-page-container {
                    width: 100%;
                    height: 100vh;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    box-sizing: border-box;
                }

                .content-wrapper {
                    display: flex;
                    max-width: 1200px;
                    width: 100%;
                    height: auto;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    min-height: 600px;
                }

                .logo-section {
                    flex: 1;
                    background: linear-gradient(135deg, #AAAB54, #999A4A);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 40px;
                    position: relative;
                    overflow: hidden;
                }

                .logo-section::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
                    background-size: 30px 30px;
                    animation: float 20s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(-20px, -20px) rotate(1deg); }
                    66% { transform: translate(20px, -10px) rotate(-1deg); }
                }

                .logo-section img {
                    width: 400px;
                    height: auto;
                    z-index: 2;
                    position: relative;
                    filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
                    transition: transform 0.3s ease;
                }

                .logo-section img:hover {
                    transform: scale(1.05);
                }

                .form-section {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 40px;
                    background: white;
                    position: relative;
                }

                .form-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, rgba(170, 171, 84, 0.1), transparent);
                    border-radius: 0 0 0 100px;
                }

                /* Estilos para el componente login-form */
                login-form {
                    width: 100%;
                    max-width: 350px;
                }

                /* Responsive para tablets */
                @media (max-width: 1024px) {
                    .content-wrapper {
                        max-width: 900px;
                    }
                    
                    .logo-section img {
                        width: 300px;
                    }
                    
                    .logo-section, .form-section {
                        padding: 40px 30px;
                    }
                }

                /* Responsive para móviles */
                @media (max-width: 768px) {
                    .login-page-container {
                        padding: 10px;
                    }

                    .content-wrapper {
                        flex-direction: column;
                        max-width: 500px;
                        min-height: auto;
                    }
                    
                    .logo-section {
                        padding: 40px 20px;
                        min-height: 200px;
                    }
                    
                    .logo-section img {
                        width: 200px;
                    }

                    .form-section {
                        padding: 40px 30px;
                    }
                }

                /* Responsive para móviles pequeños */
                @media (max-width: 480px) {
                    .login-page-container {
                        padding: 5px;
                    }

                    .content-wrapper {
                        border-radius: 15px;
                        max-width: 100%;
                    }
                    
                    .logo-section {
                        padding: 30px 20px;
                        min-height: 180px;
                    }
                    
                    .logo-section img {
                        width: 150px;
                    }

                    .form-section {
                        padding: 30px 20px;
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

    private setupEventListeners(): void {
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
}

export default LoginPage;