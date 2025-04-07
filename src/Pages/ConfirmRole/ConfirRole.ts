export class ConfirmRole extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    :host {
                        display: flex;
                        justify-content: center;
                        height: 100%;
                        width: 100%;
                        
                    }
                    
                    .main {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                    
                    .selection-container {
                        font-family: 'Poppins', sans-serif;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        background: white;
                        padding: 30px;
                        border-radius: 20px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                        width: 320px;
                    }
                    
                    .logo {
                        margin-bottom: 10px;
                        display: flex;
                        justify-content: center;
                    }
                    
                    .title {
                        font-size: 24px;
                        color: #AAAB54;
                        font-weight: bold;
                        margin: 10px 0;
                        text-align: center;
                    }
                    
                    .question {
                        margin-bottom: 25px;
                        font-size: 16px;
                        color: #333;
                        text-align: center;
                    }
                    
                    .options-container {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                        width: 100%;
                        margin-bottom: 20px;
                    }
                    
                    .option-label {
                        display: flex;
                        align-items: center;
                        font-size: 16px;
                        color: #333;
                        cursor: pointer;
                    }
                    
                    .custom-checkbox {
                        width: 20px;
                        height: 20px;
                        border: 2px solid #ccc;
                        border-radius: 4px;
                        margin-right: 10px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    
                    .checkbox-input:checked + .custom-checkbox {
                        background-color: #AAAB54;
                        border-color: #AAAB54;
                    }
                    
                    .checkbox-input {
                        display: none;
                    }
                    
                    .register-button {
                        width: 100%;
                        padding: 12px;
                        border: none;
                        border-radius: 8px;
                        background-color: #E0A800;
                        color: white;
                        font-size: 16px;
                        cursor: pointer;
                        transition: background-color 0.3s;
                        font-weight: 500;
                    }
                    
                    .register-button:hover {
                        background-color: #c99700;
                    }
                </style>
                <div class="selection-container">
                    <div class="logo">
                        <lulada-logo></lulada-logo>
                    </div>
                    
                    
                    <div class="options-container">
                        <label class="option-label">
                            <input type="checkbox" class="checkbox-input" id="person-checkbox" name="userType" value="person">
                            <span class="custom-checkbox"></span>
                            Persona
                        </label>
                        
                        <label class="option-label">
                            <input type="checkbox" class="checkbox-input" id="restaurant-checkbox" name="userType" value="restaurant">
                            <span class="custom-checkbox"></span>
                            Restaurante
                        </label>
                    </div>
                    
                    <button class="register-button" id="register-button">Registrarme</button>
                </div>
            `;

            // Lógica para manejar los checkboxes
            const personCheckbox = this.shadowRoot.getElementById('person-checkbox') as HTMLInputElement;
            const restaurantCheckbox = this.shadowRoot.getElementById('restaurant-checkbox') as HTMLInputElement;
            const registerButton = this.shadowRoot.getElementById('register-button');
            
            // Asegúrate de que solo se pueda seleccionar un checkbox a la vez
            personCheckbox?.addEventListener('change', () => {
                if (personCheckbox.checked) {
                    restaurantCheckbox.checked = false;
                }
            });

            restaurantCheckbox?.addEventListener('change', () => {
                if (restaurantCheckbox.checked) {
                    personCheckbox.checked = false;
                }
            });

            // Lógica del botón de registro
            registerButton?.addEventListener('click', () => {
                let selectedType = '';
                
                if (personCheckbox?.checked) {
                    selectedType = 'person';
                } else if (restaurantCheckbox?.checked) {
                    selectedType = 'restaurant';
                }

                if (!selectedType) {
                    alert('Por favor selecciona un tipo de registro');
                    return;
                }
                
                
            });

           
            
        }
    }
}




export default ConfirmRole;