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
                align-items: center;
                padding: 20px 0;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                width: 100%;
                position: relative;
                min-height: 80px;
            }

            .logo-container {
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 300px;
                padding-left: 20px;
            }

            .center-zone {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .location-tags {
                display: flex;
                gap: 25px;
                align-items: center;
            }

            .location-tags a {
              position: relative;
              text-decoration: none;
              color: #666;
              font-weight: bold;
              padding: 10px 20px;
              transition: all 0.2s ease;
              border-radius: 25px;
              cursor: pointer;
              font-size: 16px;
              border: 2px solid transparent;
            }

            .location-tags a:hover {
              color: #333;
              background-color: rgba(170, 171, 84, 0.1);
              border-color: rgba(170, 171, 84, 0.3);
            }

            .location-tags a.active {
              color: white;
              background-color: #AAAB54;
              border-color: #AAAB54;
            }

            /* Responsive */
            @media (max-width: 900px) {
                .header-container {
                    flex-direction: column;
                    padding: 15px 20px;
                    min-height: auto;
                }
                
                .logo-container {
                    position: static;
                    transform: none;
                    width: auto;
                    padding-left: 0;
                    margin-bottom: 15px;
                    text-align: center;
                }
                
                .center-zone {
                    width: 100%;
                }
                
                .location-tags {
                    flex-wrap: wrap;
                    gap: 10px;
                    justify-content: center;
                }
                
                .location-tags a {
                    padding: 8px 16px;
                    font-size: 14px;
                }
            }
        </style>
        
        <div class="header-container">
            <div class="logo-container">
                <lulada-logo></lulada-logo>
            </div>
            
            <div class="center-zone">
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

  addEventListeners(): void {
    const locationLinks: NodeListOf<HTMLAnchorElement> = this.shadowRoot.querySelectorAll('.location-tags a');
    
    locationLinks.forEach((link: HTMLAnchorElement) => {
      link.addEventListener('click', (e: Event) => {
        e.preventDefault();
        
        const target = e.currentTarget as HTMLAnchorElement;
        const section: string | null = target.getAttribute('data-section');
        
        if (section) {
          // Remover active de todos los enlaces
          locationLinks.forEach(l => l.classList.remove('active'));
          
          // Agregar active al enlace clickeado
          target.classList.add('active');
          
          // Actualizar el estado actual
          this.currentSelected = section;
          
          // Disparar múltiples eventos para asegurar compatibilidad
          document.dispatchEvent(new CustomEvent('location-changed', {
            detail: section
          }));
          
          document.dispatchEvent(new CustomEvent('location-filter-changed', {
            detail: section
          }));
          
          // Evento específico para el componente de reviews
          const reviewsContainer = document.querySelector('lulada-reviews-container');
          if (reviewsContainer) {
            reviewsContainer.dispatchEvent(new CustomEvent('location-select', {
              detail: section,
              bubbles: true
            }));
          }
          
          console.log('✅ Filtro de ubicación activado:', section);
        }
      });
    });
  }
}

export default HeaderHome;