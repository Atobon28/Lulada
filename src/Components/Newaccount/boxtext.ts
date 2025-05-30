// Definimos y exportamos una clase llamada BoxText que extiende HTMLElement
// Esto significa que estamos creando un componente web personalizado
export class BoxText extends HTMLElement {
    constructor() {
        // Llamamos al constructor de la clase padre (HTMLElement)
        super();
        
        // Creamos un Shadow DOM para encapsular nuestro HTML y CSS
        // Esto evita que los estilos se mezclen con el resto de la página
        this.attachShadow({ mode: 'open' });
        
        // Obtenemos el valor del atributo "placeholder" del elemento HTML
        // Este será el texto que aparece cuando el input está vacío
        const placeholder = this.getAttribute("placeholder");
        
        // Verificamos que el shadowRoot se haya creado correctamente
        if (this.shadowRoot){
            // Inyectamos el HTML y CSS dentro del Shadow DOM
            this.shadowRoot.innerHTML = /*html*/ `
            <style>
             /* Estilos para el contenedor del input */
             .input-container 
             {
                display:inline-block;  /* Se comporta como un elemento en línea pero puede tener dimensiones */
                width:100%;            /* Ocupa todo el ancho disponible */
             }
             
             /* Estilos para el campo de texto */
             input{
                width:100%;            /* El input ocupa todo el ancho del contenedor */
                padding:10px;          /* Espacio interno del input */
                border: 1px solid #ccc; /* Borde gris claro */
                border-radius: 5px;    /* Bordes redondeados */
                color:#000;            /* Texto en color negro */
                font-size:16px;        /* Tamaño de la fuente */
             }
               </style>
                
                <!-- HTML del componente -->
                <div class="input-container">
                    <!-- Campo de texto con placeholder dinámico y ID único -->
                    <input type="text" value="" placeholder="${placeholder}" id="input-correo">
                </div>
            `;

            // Buscamos el elemento input dentro de nuestro Shadow DOM
            const input = this.shadowRoot.querySelector("input");
            
            // Si encontramos el input, le agregamos funcionalidad
            if (input){
                // Agregamos un evento que se ejecuta cuando el usuario hace clic en el input
                input.addEventListener("focus",()=>{
                    // Si el valor actual es "correo electonico", lo limpiamos
                    // (Esto parece ser para limpiar un placeholder manual)
                    if(input.value === "correo electonico"){
                        input.value ="";           // Vaciamos el campo
                        input.style.color = "#000"; // Aseguramos que el texto sea negro
                    }
                    
                    // Si el placeholder dice "Contraseña", cambiamos el tipo de input
                    // Esto hace que el texto se muestre con asteriscos (*****)
                    if (input.placeholder === "Contraseña") {
                        input.type = "password";
                    }
                });
            }
        }else {
            // Si no se pudo crear el shadowRoot, mostramos un error en la consola
            console.log(`shadowRoot is null`);
        }
    }
}

// Exportamos la clase como default para que pueda ser importada fácilmente
export default BoxText;