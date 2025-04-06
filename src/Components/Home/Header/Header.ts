interface LocationSelectEvent extends CustomEvent {
  detail: string;
}

class Header extends HTMLElement {
  shadowRoot: ShadowRoot;

  constructor() {
    super();
    
    this.shadowRoot = this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                width: 100%;
                background-color: white;
            }

            .header-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 20px;
            }

            .logo-container {
                align-self: flex-start;
                width: 300px;
                margin-bottom: 20px;
            }

            .location-tags a {
              position: relative;
              text-decoration: none;
              color: #666;
              font-weight: bold;
              padding: 5px 10px;
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
        </style>
        
        <div class="header-container">
            <div class="logo-container">
                <lulada-logo></lulada-logo>
            </div>
            <div class="location-tags">
                <a href="#" data-section="cali">Cali</a>
                <a href="#" data-section="norte">Norte</a>
                <a href="#" data-section="sur">Sur</a>
                <a href="#" data-section="oeste">Oeste</a>
                <a href="#" data-section="centro">Centro</a>
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
          this.dispatchEvent(new CustomEvent<string>('location-select', { 
            detail: section,
            bubbles: true,
            composed: true
          }) as LocationSelectEvent);
        }
      });
    });
  }
}

export default Header;