// Este archivo define un componente web personalizado llamado "CajonTexto"
// Es como crear un nuevo tipo de elemento HTML que podemos usar en nuestra página

class CajonTexto extends HTMLElement {
  constructor() {
    // Llamamos al constructor de HTMLElement (la clase padre)
    super();
    
    // Creamos un "shadow DOM" que es como un espacio privado para nuestro componente
    // El modo 'open' significa que se puede acceder desde fuera si es necesario
    this.attachShadow({ mode: 'open' });
  }
  
  // Este método se ejecuta automáticamente cuando el componente se añade a la página
  connectedCallback() {
    // Obtenemos el texto que queremos mostrar desde los atributos del elemento HTML
    // Por ejemplo: <cajon-texto label="Mi texto"></cajon-texto>
    const label = this.getAttribute('label');
    
    // Si no hay texto (label), no hacemos nada y salimos de la función
    if (!label) return;
    
    // Creamos todo el HTML y CSS de nuestro componente
    this.shadowRoot!.innerHTML = /*html*/ `
      <style>
        /* Estilos CSS para nuestra caja de texto */
        .card {
          width: 100%;                              /* Ocupa todo el ancho disponible */
          padding: 16px;                            /* Espacio interno de 16 píxeles */
          border-radius: 12px;                      /* Bordes redondeados */
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Sombra suave */
          background-color: white;                   /* Fondo blanco */
          font-family: sans-serif;                   /* Fuente sin serifas */
          font-weight: 600;                         /* Texto en negrita */
          font-size: 14px;                          /* Tamaño de fuente */
          color: #000;                              /* Color del texto: negro */
          display: flex;                            /* Usar flexbox para alinear contenido */
          align-items: center;                      /* Centrar verticalmente */
          justify-content: flex-start;              /* Alinear al inicio (izquierda) */
          cursor: pointer;                          /* Mostrar cursor de mano al pasar por encima */
          transition: background 0.2s ease;         /* Animación suave cuando cambia el fondo */
          margin-bottom: 16px;                      /* Espacio debajo del elemento */
          box-sizing: border-box;                   /* Incluir padding y border en el tamaño total */
        }
        
        /* Estilo cuando el usuario pasa el mouse por encima */
        .card:hover {
          background-color: #f9f9f9;               /* Cambiar a un gris muy claro */
        }
      </style>
      
      <!-- El HTML que se muestra: una caja con el texto -->
      <div class="card">
        ${label}
      </div>
    `;
  }
}

// Exportamos la clase para que otros archivos puedan usarla
export default CajonTexto;