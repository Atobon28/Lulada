// Interface para el evento de selección de ubicación
interface LocationSelectEvent extends CustomEvent {
  detail: string;
}

// Header principal de la página de inicio
class HeaderHome extends HTMLElement {
  shadowRoot: ShadowRoot;
  currentSelected: string = 'cali';

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                width: 100%;
                background-color: white;
                position: relative;
                z-index: 10;
            }

            .header-container {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                padding: 15px 20px 0px 20px;
                border-bottom: 1px solid #e0e0e0;
                width: 100%;
                position: relative;
                box-sizing: border-box;
            }

            .logo-container {
                align-self: flex-start;
                margin-bottom: 15px;
            }

            .navigation-container {
                width: 100%;
                display: flex;
                justify-content: center;
                padding-bottom: 10px;
            }

            .location-tags {
                display: flex;
                gap: 40px;
            }

            .location-tags a {
              position: relative;
              text-decoration: none;
              color: #666;
              font-weight: bold;
              padding: 5px 0;
              transition: all 0.2s ease;
            }

            .location-tags a::after {
              content: '';
              position: absolute;
              left: 0;
              bottom: 0;
              height: 2px;
              width: 100%;
              background-color: #AAAB54;
              transform: scaleX(0);
              transform-origin: left;
              transition: transform 0.3s ease;
            }

            .location-tags a:hover {
              color: #333;
              transform: translateY(-2px);
            }

            .location-tags a:hover::after {
              transform: scaleX(1);
            }

            .location-tags a.active {
              color: #333;
            }

            .location-tags a.active::after {
              transform: scaleX(1);
            }

            @media (max-width: 900px) {
                .header-container {
                    align-items: center;
                }
                
                .logo-container {
                    align-self: center;
                }
                
                .navigation-container {
                    justify-content: center;
                }
                
                .location-tags {
                    gap: 20px;
                    flex-wrap: wrap;
                    justify-content: center;
                }
            }
        </style>
        
        <div class="header-container">
            <div class="logo-container">
                <lulada-logo></lulada-logo>
            </div>
            <div class="navigation-container">
                <div class="location-tags">
                    <a href="#" data-section="cali" class="active">Cali</a>
                    <a href="#" data-section="norte">Norte</a>
                    <a href="#" data-section="sur">Sur</a>
                    <a href="#" data-section="oeste">Oeste</a>
                    <a href="#" data-section="centro">Centro</a>
                </div>
            </div>
        </div>
    `;

    this.addEventListeners();
  }

  // Configurar eventos de click para enlaces de ubicación
  addEventListeners(): void {
    const locationLinks: NodeListOf<HTMLAnchorElement> = this.shadowRoot.querySelectorAll('.location-tags a');
    
    locationLinks.forEach((link: HTMLAnchorElement) => {
      link.addEventListener('click', (e: Event) => {
        e.preventDefault();
        
        const target = e.currentTarget as HTMLAnchorElement;
        const section: string | null = target.getAttribute('data-section');
        
        if (section) {
          const prevSelected = this.shadowRoot.querySelector(`.location-tags a[data-section="${this.currentSelected}"]`);
          if (prevSelected) {
            prevSelected.classList.remove('active');
          }
          
          this.currentSelected = section;
          target.classList.add('active');
          
          // Disparar evento personalizado
          this.dispatchEvent(new CustomEvent<string>('location-select', { 
            detail: section,
            bubbles: true,
            composed: true
          }) as LocationSelectEvent);

          // Evento global para otros componentes
          document.dispatchEvent(new CustomEvent('location-filter-changed', {
            detail: section
          }));
        }
      });
    });
  }
}

export default HeaderHome;