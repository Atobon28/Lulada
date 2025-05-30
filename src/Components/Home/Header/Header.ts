// Definimos una interfaz para el evento personalizado que se dispara cuando se selecciona una ubicación
interface LocationSelectEvent extends CustomEvent {
  detail: string; // El detalle del evento contendrá el nombre de la ubicación seleccionada
}

// Creamos una clase para el componente del header principal de la página de inicio
class HeaderHome extends HTMLElement {
  shadowRoot: ShadowRoot; // El Shadow DOM para aislar el HTML y CSS de este componente
  currentSelected: string = 'cali'; // Variable que guarda cuál ubicación está seleccionada actualmente (por defecto 'cali')

  constructor() {
    super(); // Llamamos al constructor de la clase padre HTMLElement
    
    // Creamos el Shadow DOM en modo 'open' (accesible desde fuera)
    this.shadowRoot = this.attachShadow({ mode: 'open' });

    // Definimos todo el HTML y CSS del componente dentro del Shadow DOM
    this.shadowRoot.innerHTML = `
        <style>
            /* Estilos para el componente host (el elemento principal) */
            :host {
                display: block; /* El componente se muestra como bloque */
                width: 100%; /* Ocupa todo el ancho disponible */
                background-color: white; /* Fondo blanco */
                position: relative; /* Posicionamiento relativo */
                z-index: 10; /* Aparece por encima de otros elementos */
            }

            /* Estilos para el contenedor principal del header */
            .header-container {
                display: flex; /* Usa flexbox para organizar elementos */
                flex-direction: column; /* Los elementos van en columna (uno debajo del otro) */
                align-items: flex-start; /* Alinea elementos al inicio (izquierda) */
                padding: 15px 20px 0px 20px; /* Espaciado interno: arriba, derecha, abajo, izquierda */
                border-bottom: 1px solid #e0e0e0; /* Línea gris en la parte inferior */
                width: 100%; /* Ocupa todo el ancho */
                position: relative; /* Posicionamiento relativo */
                box-sizing: border-box; /* Incluye padding y border en el ancho total */
            }

            /* Estilos para el contenedor del logo */
            .logo-container {
                align-self: flex-start; /* Se alinea al inicio del contenedor */
                margin-bottom: 15px; /* Espacio de 15px debajo del logo */
            }

            /* Estilos para el contenedor de la navegación */
            .navigation-container {
                width: 100%; /* Ocupa todo el ancho disponible */
                display: flex; /* Usa flexbox */
                justify-content: center; /* Centra el contenido horizontalmente */
                padding-bottom: 10px; /* Espacio de 10px en la parte inferior */
            }

            /* Estilos para el contenedor de las etiquetas de ubicación */
            .location-tags {
                display: flex; /* Usa flexbox para organizar los enlaces */
                gap: 40px; /* Espacio de 40px entre cada enlace */
            }

            /* Estilos para cada enlace de ubicación */
            .location-tags a {
              position: relative; /* Necesario para el pseudo-elemento ::after */
              text-decoration: none; /* Quita el subrayado por defecto de los enlaces */
              color: #666; /* Color gris para el texto */
              font-weight: bold; /* Texto en negrita */
              padding: 5px 0; /* Espaciado interno arriba y abajo */
              transition: all 0.2s ease; /* Transición suave para todos los cambios */
            }

            /* Pseudo-elemento para crear la línea animada debajo de cada enlace */
            .location-tags a::after {
              content: ''; /* Contenido vacío (solo es una línea visual) */
              position: absolute; /* Posicionado en relación al enlace */
              left: 0; /* Empieza desde la izquierda */
              bottom: 0; /* Se posiciona en la parte inferior */
              height: 2px; /* Altura de 2px */
              width: 100%; /* Ocupa todo el ancho del enlace */
              background-color: #AAAB54; /* Color verde de la línea */
              transform: scaleX(0); /* Inicialmente invisible (escala 0) */
              transform-origin: left; /* La animación empieza desde la izquierda */
              transition: transform 0.3s ease; /* Transición suave para la animación */
            }

            /* Efectos cuando el usuario pasa el mouse sobre un enlace */
            .location-tags a:hover {
              color: #333; /* Cambia a un gris más oscuro */
              transform: translateY(-2px); /* Se eleva 2px hacia arriba */
            }

            /* Muestra la línea animada cuando se hace hover */
            .location-tags a:hover::after {
              transform: scaleX(1); /* La línea se hace visible (escala completa) */
            }

            /* Estilos para el enlace que está actualmente seleccionado */
            .location-tags a.active {
              color: #333; /* Color gris oscuro */
            }

            /* La línea se mantiene visible en el enlace activo */
            .location-tags a.active::after {
              transform: scaleX(1); /* Línea completamente visible */
            }

            /* Estilos responsive para pantallas pequeñas (móviles) */
            @media (max-width: 900px) {
                .header-container {
                    align-items: center; /* Centra todo el contenido */
                }
                
                .logo-container {
                    align-self: center; /* Centra el logo */
                }
                
                .navigation-container {
                    justify-content: center; /* Mantiene la navegación centrada */
                }
                
                .location-tags {
                    gap: 20px; /* Reduce el espacio entre enlaces */
                    flex-wrap: wrap; /* Permite que los enlaces se envuelvan en varias líneas */
                    justify-content: center; /* Centra los enlaces */
                }
            }
        </style>
        
        <!-- HTML del componente -->
        <div class="header-container">
            <!-- Contenedor del logo -->
            <div class="logo-container">
                <lulada-logo></lulada-logo> <!-- Componente personalizado para el logo -->
            </div>
            <!-- Contenedor de la navegación -->
            <div class="navigation-container">
                <div class="location-tags">
                    <!-- Enlaces para cada ubicación de Cali -->
                    <!-- data-section guarda el identificador de cada ubicación -->
                    <!-- class="active" marca cuál está seleccionado por defecto -->
                    <a href="#" data-section="cali" class="active">Cali</a>
                    <a href="#" data-section="norte">Norte</a>
                    <a href="#" data-section="sur">Sur</a>
                    <a href="#" data-section="oeste">Oeste</a>
                    <a href="#" data-section="centro">Centro</a>
                </div>
            </div>
        </div>
    `;

    // Configuramos los event listeners (manejadores de eventos) después de crear el HTML
    this.addEventListeners();
  }

  // Función que configura los eventos de click para los enlaces de ubicación
  addEventListeners(): void {
    // Buscamos todos los enlaces dentro de .location-tags
    const locationLinks: NodeListOf<HTMLAnchorElement> = this.shadowRoot.querySelectorAll('.location-tags a');
    
    // Para cada enlace, agregamos un event listener
    locationLinks.forEach((link: HTMLAnchorElement) => {
      link.addEventListener('click', (e: Event) => {
        // Prevenimos el comportamiento por defecto del enlace (no navegar)
        e.preventDefault();
        
        // Obtenemos el elemento que fue clickeado
        const target = e.currentTarget as HTMLAnchorElement;
        // Extraemos el valor del atributo data-section (ej: 'norte', 'sur', etc.)
        const section: string | null = target.getAttribute('data-section');
        
        // Si el enlace tiene una sección definida
        if (section) {
          // Buscamos el enlace que estaba activo anteriormente
          const prevSelected = this.shadowRoot.querySelector(`.location-tags a[data-section="${this.currentSelected}"]`);
          if (prevSelected) {
            // Le quitamos la clase 'active' al enlace anterior
            prevSelected.classList.remove('active');
          }
          
          // Actualizamos cuál es la ubicación seleccionada actualmente
          this.currentSelected = section;
          // Agregamos la clase 'active' al enlace que fue clickeado
          target.classList.add('active');
          
          // Disparamos un evento personalizado para informar que se cambió la ubicación
          // Este evento puede ser escuchado por otros componentes
          this.dispatchEvent(new CustomEvent<string>('location-select', { 
            detail: section, // Enviamos qué ubicación fue seleccionada
            bubbles: true, // El evento puede subir por el DOM
            composed: true // El evento puede salir del Shadow DOM
          }) as LocationSelectEvent);

          // También disparamos un evento global en el documento
          // Para que otros componentes que no están relacionados directamente puedan escucharlo
          document.dispatchEvent(new CustomEvent('location-filter-changed', {
            detail: section // Enviamos la ubicación seleccionada
          }));
          
          // Mensaje en la consola para debug/desarrollo
          console.log(' Filtro de ubicación activado:', section);
        }
      });
    });
  }
}

// Exportamos la clase para que pueda ser usada en otros archivos
export default HeaderHome;