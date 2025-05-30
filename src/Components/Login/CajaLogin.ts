// Formulario de inicio de sesión personalizado
class LoginForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                .login-container {
                    width: 350px;
                    padding: 25px;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }

                .linea {
                    width: 100%;
                    border: 0.5px solid #D9D9D9;
                    margin: 15px 0;
                }

                .forgot-password {
                    font-size: 14px;
                    color: #555;
                    margin: 15px 0;
                    cursor: pointer;
                }

                .register-button {
                    display: block;
                    width: 100%;
                    padding: 12px;
                    background-color: #F4B400;
                    border: none;
                    color: white;
                    border-radius: 10px;
                    font-size: 16px;
                    cursor: pointer;
                    text-align: center;
                    font-weight: bold;
                    margin-top: 5px;
                }

                .register-button:hover {
                    background-color: #E09E00;
                }
                
                caja-de-texto {
                    display: block;
                    margin-bottom: 15px;
                }
                </style>
                
                <div class="login-container">
                    <!-- Campos de texto para usuario y contraseña -->
                    <caja-de-texto></caja-de-texto>
                    
                    <!-- Botón de iniciar sesión -->
                    <boton-login></boton-login>
                    
                    <p class="forgot-password">¿Olvidaste tu contraseña?</p>
                    
                    <div class="linea"></div>
                    
                    <button class="register-button">Registrate</button>
                </div>
            `;
        } else {
            console.error('shadowRoot is null');
        }
    }
}

export default LoginForm;