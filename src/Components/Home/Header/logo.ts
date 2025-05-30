// Este archivo crea un componente personalizado que muestra el logo de Lulada
class Lulada extends HTMLElement {
    shadowRoot: ShadowRoot; // Declara el shadow DOM que aislará los estilos de este componente
  
    constructor() {
      super(); // Llama al constructor de HTMLElement (la clase padre)
      
      // Crea un shadow DOM en modo 'open' para que se pueda acceder desde fuera si es necesario
      this.shadowRoot = this.attachShadow({ mode: 'open' });
  
      // Aquí definimos todo el HTML y CSS del logo dentro del shadow DOM
      this.shadowRoot.innerHTML = `
          <style>
              /* Estilos para el componente completo */
              :host {
                  display: block;           /* Se comporta como un bloque */
                  text-align: left;         /* Texto alineado a la izquierda */
                  margin: 0;                /* Sin márgenes externos */
                  padding: 0;               /* Sin espaciado interno */
              }
              
              /* Contenedor del logo */
              .logo-wrapper {
                  margin: 0;               /* Sin márgenes */
                  padding: 0;              /* Sin padding */
                  text-align: left;        /* Contenido alineado a la izquierda */
              }
              
              /* Estilos para la imagen del logo */
              img {
                  max-width: 300px;        /* Ancho máximo de 300 píxeles */
                  height: auto;            /* Altura automática para mantener proporción */
                  margin: 0;               /* Sin márgenes */
                  padding: 0;              /* Sin padding */
                  display: block;          /* Se comporta como bloque */
              }
              
              /* Estilos para mostrar errores si la imagen no carga */
              .error {
                  color: red;              /* Texto en rojo */
                  background-color: #ffeeee; /* Fondo rosa claro */
                  padding: 10px;           /* Espaciado interno */
                  margin: 0;               /* Sin márgenes */
              }

              /* RESPONSIVE: Estilos para pantallas pequeñas (móviles) */
              @media (max-width: 900px) {
                  /* En móviles, centrar todo */
                  :host {
                      text-align: center;   /* Centrar contenido */
                  }
                  
                  .logo-wrapper {
                      text-align: center;   /* Centrar el contenedor */
                  }
                  
                  /* En móviles, hacer el logo más pequeño */
                  img {
                      max-width: 200px;     /* Reducir tamaño a 200px */
                      margin: 0 auto;       /* Centrar horizontalmente */
                  }
              }
          </style>
          
          <!-- HTML del componente -->
          <div class="logo-wrapper">
              <img 
                  src="https://i.postimg.cc/xdhdVv5d/Recurso-5-ASCAAS.jpg" 
                  alt="Lulada Logo"
              >
          </div>
      `;

      // Configurar manejo de errores para la imagen
      const img = this.shadowRoot.querySelector('img');
      if (img) {
        // Si la imagen no puede cargar, ejecutar esta función
        img.onerror = () => {
          img.onerror = null;  // Evitar bucles infinitos de error
          img.classList.add('error');  // Agregar clase de error
          // Mostrar mensaje de error al usuario
          img.insertAdjacentHTML('afterend', '<div class="error">Image Load Failed: ' + img.src + '</div>');
        };
      }
    }
  }
  
  
  export default Lulada; // Exportar la clase para poder usarla en otros archivos