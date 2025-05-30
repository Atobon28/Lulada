// Definimos una clase que extiende HTMLElement para crear un componente web personalizado
class RootComponent extends HTMLElement {
    // Propiedad para guardar qué sección está activa actualmente
    seccionActual: string; 

    // Constructor: se ejecuta cuando se crea una nueva instancia del componente
    constructor() {
        // Llamamos al constructor de la clase padre (HTMLElement)
        super()
        
        // Creamos un Shadow DOM para encapsular nuestros estilos y HTML
        // El modo 'open' significa que se puede acceder desde fuera del componente
        this.attachShadow({ mode: 'open' })
        
        // Establecemos 'main' como la sección inicial por defecto
        this.seccionActual = 'main';
        
        // Si el shadowRoot se creó correctamente
        if (this.shadowRoot) {
            // Definimos el HTML interno del componente (actualmente vacío)
            this.shadowRoot.innerHTML= `
            `;
        }
    }
       
    // Método para cambiar de página/sección dentro de la aplicación
    // Recibe como parámetro el nombre de la sección a la que queremos ir
    changePage(section: string) { // Ejemplos: 'profile', 'settings', 'antojar', etc.
        
        // Actualizamos la propiedad con la nueva sección actual
        this.seccionActual = section;
        
        // Buscamos el contenedor principal dentro de nuestro shadowRoot
        const mainContainer = this.shadowRoot?.querySelector('.main-container');
        
        // Si no encontramos el contenedor, salimos de la función
        if (!mainContainer) return;

        // Dependiendo de la sección solicitada, mostramos diferente contenido
        if (section === 'profile') {
            // Si la sección es 'profile', mostramos el título "Mi perfil"
            mainContainer.innerHTML = `<h1>Mi perfil</h1>`;
        } else if (section === 'settings') {
            // Si la sección es 'settings', mostramos el título "Configuración"
            mainContainer.innerHTML = `<h1>Configuración</h1>`;
        } else {
            // Para cualquier otra sección no reconocida, mostramos un error
            mainContainer.innerHTML = `<h1>Error</h1>`;
        }
    }
}

// Exportamos la clase para que pueda ser importada y usada en otros archivos
export default RootComponent;