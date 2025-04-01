//aca junto todos para crearlo
class LoginForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                .login-container {
                    width: 300px;
                    padding: 20px;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                .divider {
                    width: 100%;
                    border: 0.5px solid #D9D9D9;
                    margin: 10px 0;
                }
                .forgot-password {
                    font-size: 14px;
                    color: #555;
                    margin: 10px 0;
                }
                botonLogin {
                    margin-top: 10px;
                }
                .register-button {
                    display: block;
                    width: 100%;
                    padding: 10px;
                    background-color: #F4B400;
                    border: none;
                    color: white;
                    border-radius: 10px;
                    font-size: 16px;
                    cursor: pointer;
                    text-align: center;
                }
                .register-button:hover {
                    background-color: #E09E00;
                }
                </style>
                <div class="login-container">
                    <caja-de-texto></caja-de-texto>
                    <caja-de-texto></caja-de-texto>
                    <botonLogin></botonLogin>
                    <p class="forgot-password">¿Olvidaste tu contraseña?</p>
                    <div class="divider"></div>
                    <button class="register-button">Registrate</button>
                </div>
            `;
        } else {
            console.error('shadowRoot is null');
        }
    }
}

export default LoginForm;
