// Creamos una clase que representa un botón de login personalizado
// Esta clase extiende HTMLElement, lo que significa que será un elemento HTML reutilizable
class BotonLogin extends HTMLElement {
    constructor() {
        // Llamamos al constructor de la clase padre (HTMLElement)
        super();
        
        // Creamos un Shadow DOM en modo 'open'
        // El Shadow DOM nos permite encapsular el HTML y CSS de este componente
        // para que no interfiera con otros estilos de la página
        this.attachShadow({ mode: 'open' });
        
        // Verificamos que el Shadow DOM se haya creado correctamente
        if (this.shadowRoot) {
            // Definimos todo el HTML y CSS del botón dentro del Shadow DOM
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                /* Estilos CSS para el botón */
                .boton {
                    display: block;           /* El botón se comporta como un bloque */
                    width: 100%;             /* Ocupa todo el ancho disponible */
                    padding: 12px;           /* Espacio interno del botón */
                    background-color: #AAAB54; /* Color de fondo verde oliva */
                    border: none;            /* Sin borde */
                    color: white;            /* Texto en color blanco */
                    border-radius: 10px;     /* Bordes redondeados */
                    font-size: 16px;         /* Tamaño de la fuente */
                    cursor: pointer;         /* Cursor de mano al pasar por encima */
                    text-align: center;      /* Texto centrado */
                    font-weight: bold;       /* Texto en negrita */
                }
                
                /* Estilo cuando el usuario pasa el mouse por encima del botón */
                .boton:hover {
                    background-color:rgb(132, 134, 58); /* Color más oscuro al hacer hover */
                }
                </style>
                <!-- HTML del botón con el texto "Iniciar sesión" -->
                <button class="boton">Iniciar sesión</button>
            `;
            
            // Buscamos el elemento botón dentro del Shadow DOM
            const button = this.shadowRoot.querySelector(".boton");
            
            // Si encontramos el botón, le agregamos funcionalidad
            if (button) {
                // Agregamos un evento 'click' al botón
                button.addEventListener("click", () => {
                    // Cuando se hace click, redirigimos al usuario a la página "/home"
                    window.location.href = "/home"; 
                });
            }
        } else {
            // Si no se pudo crear el Shadow DOM, mostramos un error en la consola
            console.error('shadowRoot is null');
        }
    }
}

// Exportamos la clase para que pueda ser importada y usada en otros archivos
export default BotonLogin;