// Exportamos la clase para que pueda ser usada en otros archivos
export class ConfirmRole extends HTMLElement {
    constructor() {
        super(); // Llamamos al constructor de la clase padre HTMLElement
        
        // Creamos un shadow DOM para aislar los estilos de este componente
        this.attachShadow({ mode: 'open' });
        
        // Si el shadow DOM se creó correctamente
        if (this.shadowRoot) {
            // Definimos todo el HTML y CSS del componente
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    /* El componente ocupa toda la pantalla y centra su contenido */
                    :host {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        height: 100vh;
                        position: fixed;
                        top: 0;
                        left: 0;
                    }
                     
                    /* Contenedor principal que ocupa toda la pantalla */
                    .main {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                    
                    /* Caja blanca donde van todas las opciones */
                    .selection-container {
                        font-family: 'Poppins', sans-serif;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        background: white;
                        padding: 80px;
                        border-radius: 20px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                        width: 320px;
                    }
                    
                    /* Contenedor del logo */
                    .logo {
                        margin-bottom: 10px;
                        display: flex;
                        justify-content: center;
                    }
                    
                    /* Estilo del título principal */
                    .title {
                        font-size: 24px;
                        color: #AAAB54;
                        font-weight: bold;
                        margin: 10px 0;
                        text-align: center;
                    }
                    
                    /* Estilo de la pregunta */
                    .question {
                        margin-bottom: 25px;
                        font-size: 16px;
                        color: #333;
                        text-align: center;
                    }
                    
                    /* Contenedor de las opciones (Persona y Restaurante) */
                    .options-container {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                        width: 100%;
                        margin-bottom: 20px;
                    }
                    
                    /* Cada opción (Persona o Restaurante) */
                    .option-label {
                        display: flex;
                        align-items: center;
                        font-size: 16px;
                        color: #333;
                        cursor: pointer;
                    }
                    
                    /* La cajita que se marca (checkbox personalizado) */
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
                    
                    /* Cuando la cajita está marcada, se pone verde */
                    .checkbox-input:checked + .custom-checkbox {
                        background-color: #AAAB54;
                        border-color: #AAAB54;
                    }
                    
                    /* Ocultamos el checkbox original del navegador */
                    .checkbox-input {
                        display: none;
                    }
                    
                    /* Botón de "Registrarme" */
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
                    
                    /* Cuando pasas el mouse por el botón, cambia de color */
                    .register-button:hover {
                        background-color: #c99700;
                    }
                </style>
                
                <!-- Contenedor principal de la selección -->
                <div class="selection-container">
                    <!-- Logo de la aplicación -->
                    <div class="logo">
                        <lulada-logo></lulada-logo>
                    </div>
                    
                    <!-- Contenedor de las dos opciones -->
                    <div class="options-container">
                        <!-- Opción 1: Persona -->
                        <label class="option-label">
                            <input type="checkbox" class="checkbox-input" id="person-checkbox" name="userType" value="person">
                            <span class="custom-checkbox"></span>
                            Persona
                        </label>
                        
                        <!-- Opción 2: Restaurante -->
                        <label class="option-label">
                            <input type="checkbox" class="checkbox-input" id="restaurant-checkbox" name="userType" value="restaurant">
                            <span class="custom-checkbox"></span>
                            Restaurante
                        </label>
                    </div>
                    
                    <!-- Botón para confirmar la selección -->
                    <button class="register-button" id="register-button">Registrarme</button>
                </div>
            `;

            // LÓGICA DEL COMPONENTE

            // Obtenemos referencias a los dos checkboxes
            const personCheckbox = this.shadowRoot.getElementById('person-checkbox') as HTMLInputElement;
            const restaurantCheckbox = this.shadowRoot.getElementById('restaurant-checkbox') as HTMLInputElement;
            
            // Lógica para que solo se pueda seleccionar una opción a la vez
            
            // Si el usuario marca "Persona"
            personCheckbox?.addEventListener('change', () => {
                if (personCheckbox.checked) {
                    // Desmarcamos automáticamente "Restaurante"
                    restaurantCheckbox.checked = false;
                }
            });
            
            // Si el usuario marca "Restaurante"
            restaurantCheckbox?.addEventListener('change', () => {
                if (restaurantCheckbox.checked) {
                    // Desmarcamos automáticamente "Persona"
                    personCheckbox.checked = false;
                }
            });
        }
    }
}

// Exportamos por defecto para que sea fácil de importar
export default ConfirmRole;