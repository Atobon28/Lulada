// Definimos una nueva clase que extiende HTMLElement para crear un componente personalizado
class CajonList extends HTMLElement {
    constructor() {
        // Llamamos al constructor de la clase padre (HTMLElement)
        super();
        
        // Creamos un shadow DOM para aislar los estilos de este componente
        this.attachShadow({ mode: 'open' });

        // Si el shadow DOM se creó correctamente
        if (this.shadowRoot) {
            // Definimos todo el HTML y CSS del componente
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    /* Estilos para el contenedor principal */
                    .list-container {
                        display: flex;              /* Los elementos se alinean en columna */
                        flex-direction: column;     /* Dirección vertical */
                        gap: 16px;                  /* Espacio de 16px entre cada elemento */
                        width: 100%;                /* Ocupa todo el ancho disponible */
                        max-width: 500px;           /* Ancho máximo de 500px */
                        margin: 0 auto;             /* Centra el contenedor horizontalmente */
                        padding: 20px;              /* Espacio interno de 20px */
                    }
                </style>
                
                <!-- Contenedor principal que agrupa todos los elementos de la lista -->
                <div class="list-container">
                    <!-- Cada cajon-texto es un elemento de la lista de configuraciones -->
                    <!-- El atributo "label" define el texto que se muestra -->
                    <!-- El atributo "data-route" define a qué página navegar cuando se hace clic -->
                    
                    <cajon-texto label="Cambiar correo" data-route="/cambiar-correo"></cajon-texto>
                    <cajon-texto label="Cambiar nombre de usuario" data-route="/cambiar-nombre"></cajon-texto>
                    <cajon-texto label="Cambiar contraseña" data-route="/cambiar-contraseña"></cajon-texto>
                    
                    <!-- Estos elementos no tienen data-route, por lo que no navegan a ningún lado por ahora -->
                    <cajon-texto label="Cambiar foto de perfil"></cajon-texto>
                    <cajon-texto label="Editar biografía o descripción personal"></cajon-texto>
                    <cajon-texto label="Seleccionar idioma de la app"></cajon-texto>
                    <cajon-texto label="Configurar quién puede ver mi perfil (público/privado)"></cajon-texto>
                    <cajon-texto label="Borrar historial de búsqueda"></cajon-texto>
                    <cajon-texto label="Elegir color principal de la interfaz"></cajon-texto>
                    <cajon-texto label="Cambiar tema (claro/oscuro/sistema)"></cajon-texto>
                    <cajon-texto label="Tamaño del texto"></cajon-texto>
                    <cajon-texto label="Cerrar sesión"></cajon-texto>
                </div>
            `;
        }
    }

    // Este método se ejecuta automáticamente cuando el componente se añade al DOM de la página
    connectedCallback() {
        // Configuramos los eventos (clicks, etc.) del componente
        this.setupEventListeners();
    }

    // Método privado que configura todos los eventos del componente
    private setupEventListeners() {
        // Si no hay shadow DOM, no podemos configurar eventos
        if (!this.shadowRoot) return;

        // Escuchamos todos los clicks que ocurran dentro del shadow DOM
        this.shadowRoot.addEventListener('click', (e) => {
            // Obtenemos el elemento donde se hizo click
            const target = e.target as HTMLElement;
            
            // Buscamos el elemento cajon-texto más cercano al click
            // (en caso de que se haga click en un elemento hijo)
            const cajonTexto = target.closest('cajon-texto');
            
            // Si encontramos un cajon-texto
            if (cajonTexto) {
                // Obtenemos la ruta a la que debe navegar (atributo data-route)
                const route = cajonTexto.getAttribute('data-route');
                
                // Si tiene una ruta definida
                if (route) {
                    // Mostramos en la consola a dónde vamos a navegar (para debug)
                    console.log('Navegando a:', route);
                    
                    // Creamos un evento personalizado para notificar que queremos navegar
                    const navigationEvent = new CustomEvent('navigate', { 
                        detail: route,           // La ruta a la que queremos ir
                        bubbles: true,           // El evento puede subir por el DOM
                        composed: true           // El evento puede salir del shadow DOM
                    });
                    
                    // Enviamos el evento a nivel global del documento
                    // para que otros componentes (como LoadPage) puedan escucharlo
                    document.dispatchEvent(navigationEvent);
                }
            }
        });
    }
}

// Exportamos la clase para que pueda ser importada en otros archivos
export default CajonList;