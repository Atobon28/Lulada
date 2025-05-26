// REEMPLAZAR TODO EL CONTENIDO CON:
class LoginPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    :host {
                        font-family: Arial, sans-serif;
                    }
                    
                    .login-page-container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        background-color: white;
                        padding: 20px;
                        box-sizing: border-box;
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

                    .form-section {
                        flex: 1;
                        min-width: 300px;
                    }
                                
                    @media (max-width: 768px) {
                        .login-page-container {
                            padding: 10px;
                            background-color: #f5f5f5;
                        }
                        
                        .content-wrapper {
                            flex-direction: column;
                            gap: 30px;
                            max-width: 500px;
                        }
                        
                        .logo-section {
                            padding-right: 0;
                            margin-bottom: 20px;
                        }
                        
                        .logo-section img {
                            width: 200px; 
                        }

                        .form-section {
                            width: 100%;
                            max-width: 400px;
                        }
                    }

                    @media (max-width: 480px) {
                        .login-page-container {
                            padding: 5px;
                        }
                        
                        .content-wrapper {
                            max-width: 350px;
                        }
                        
                        .logo-section img {
                            width: 150px;
                        }

                        .form-section {
                            max-width: 350px;
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