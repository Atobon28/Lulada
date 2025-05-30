export class ButtonNewAccount extends HTMLElement {
    constructor() {
        super(); // Llama al constructor de la clase padre HTMLElement
        
        // Crea un Shadow DOM para aislar los estilos y el HTML de este componente
        this.attachShadow({ mode: 'open' });
        
        // Verifica que el Shadow DOM se haya creado correctamente
        if(this,this.shadowRoot){
            // Define todo el HTML y CSS del botón dentro del Shadow DOM
            this.shadowRoot.innerHTML = /*html*/ `
            <style>
                /* Estilos para el botón */
                .button{
                    display:block;           /* El botón ocupa toda una línea */
                    width:100%;              /* Ancho completo del contenedor */
                    padding:10px;            /* Espacio interno del botón */
                    background-color:#AAAB54; /* Color de fondo verde */
                    border: none;            /* Sin borde */
                    color:white;             /* Texto en color blanco */
                    border-radius:10px;      /* Bordes redondeados */
                    font-size:16px;          /* Tamaño de la fuente */
                    cursor:pointer;          /* Cursor de mano al pasar por encima */
                    text-align:center;       /* Texto centrado */
                }
                /* Estilo cuando el usuario pasa el mouse por encima del botón */
                button:hover{
                    background-color:#999A45; /* Cambia a un color más oscuro */
                }
 
 
 
 
            </style>
            <!-- El botón HTML que se muestra en la página -->
            <button class="button">iniciar sesion</button>
            `;
 
            // Busca el elemento botón dentro del Shadow DOM
            const button = this.shadowRoot.querySelector(".button");
            
            // Si encontró el botón, le agrega un evento de click
            if (button) {
                button.addEventListener("click", () => {
                    // Cuando se hace click, redirige a otra página
                    window.location.href = "chhhcat.html";
 
            });}
        }else {
            // Si no se pudo crear el Shadow DOM, muestra un error en la consola
            console.error(`shadowRoot is null`);
        }
 
        
 
 
    }
 }
 
 // Exporta la clase para que pueda ser usada en otros archivos
 export default ButtonNewAccount;