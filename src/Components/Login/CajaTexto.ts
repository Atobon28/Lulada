// Esta línea define una nueva clase llamada CajaDeTexto que extiende HTMLElement
// Esto significa que estamos creando un componente web personalizado
class CajaDeTexto extends HTMLElement {
    
    // El constructor es lo que se ejecuta cuando se crea una nueva instancia del componente
    constructor() {
        // Llamamos al constructor de la clase padre (HTMLElement)
        super();
        
        // Creamos un Shadow DOM en modo 'open' para encapsular nuestro HTML y CSS
        // El Shadow DOM permite que nuestros estilos no interfieran con el resto de la página
        this.attachShadow({ mode: 'open' });
        
        // Verificamos que el shadowRoot se haya creado correctamente
        if (this.shadowRoot) {
            // Aquí definimos todo el HTML y CSS de nuestro componente
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    /* Estilos para el contenedor de cada campo de entrada */
                    .input-container {
                        margin-bottom: 15px; /* Espacio entre los campos */
                    }
                    
                    /* Estilos para los campos de entrada (input) */
                    input {
                        width: 100%; /* El campo ocupa todo el ancho disponible */
                        padding: 8px 10px; /* Espacio interno para que el texto no toque los bordes */
                        border: 1px solid #CCCCCC; /* Borde gris claro */
                        border-radius: 6px; /* Bordes redondeados */
                        font-size: 14px; /* Tamaño del texto */
                        height: 36px; /* Altura fija del campo */
                        box-sizing: border-box; /* Incluye padding y border en el ancho total */
                    }
                    
                    /* Estilos cuando el usuario hace click en el campo (está enfocado) */
                    input:focus {
                        outline: none; /* Quita el borde azul por defecto del navegador */
                        border-color: #AAAB54; /* Cambia el borde a verde cuando está activo */
                    }
                </style>
                
                <!-- Primer campo de entrada: usuario o correo -->
                <div class="input-container">
                    <input type="text" placeholder="Nombre de usuario o Correo electrónico">
                </div>
                
                <!-- Segundo campo de entrada: contraseña -->
                <div class="input-container">
                    <input type="password" placeholder="Contraseña">
                </div>
            `;
        } else {
            // Si por alguna razón no se pudo crear el shadowRoot, mostramos un error en la consola
            console.error('shadowRoot is null');
        }
    }
}

// Exportamos la clase para que pueda ser usada en otros archivos
export default CajaDeTexto;