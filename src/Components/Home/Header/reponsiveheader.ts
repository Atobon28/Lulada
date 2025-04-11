interface LocationSelectEvent extends CustomEvent {
  detail: string;
}

class reponsiveheader extends HTMLElement {
  shadowRoot: ShadowRoot;
  currentSelected: string = 'cali';

  constructor() {
    super();
    
    this.shadowRoot = this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
        <style>
         :host {
                display: block;
                font-family: Arial, sans-serif;
                width: 100%;
            }

            .header-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 20px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                width: 100%;
                position: relative;
            }
            
            .nav-item {
                margin: 0 15px;
                font-size: 14px;
                cursor: pointer;
                color: #333;
                text-decoration: none;
                font-weight: 500;
            }
            
            .header-top {
                display: flex;
                justify-content: space-between;
                width: 100%;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .logo-container {
                width: 300px;
            }

            .icons-section {
                display: flex;
                align-items: center;
            }
           
            .icon {
                margin-left: 15px;
                cursor: pointer;
                color: #555;
                font-size: 20px;
            }
           
            .settings-icon, .notification-icon {
                color: #888;
            }

            .location-tags {
                display: flex;
                justify-content: center;
                width: 100%;
            }

            .location-tags a {
              position: relative;
              text-decoration: none;
              color: #666;
              font-weight: bold;
              padding: 5px 10px;
              margin: 0 15px;
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
        </style>
        
        <div class="header-container">
            <div class="header-top">
                <div class="logo-container">
                    <lulada-logo></lulada-logo>
                </div>
                <div class="icons-section">
                    <div class="icon settings-icon">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNMTkuNDMgMTIuOThjLjA0LS4zMi4wNy0uNjQuMDctLjk4cy0uMDMtLjY2LS4wNy0uOThsMi4xMS0xLjY1Yy4xOS0uMTUuMjQtLjQyLjEyLS42NGwtMi0zLjQ2YS41LjUgMCAwIDAtLjYxLS4yMmwtMi40OSAxYy0uNTItLjQtMS4wOC0uNzMtMS42OS0uOThsLS4zOC0yLjY1QS40OS40OSAwIDAgMCAxNCAyaC00Yy0uMjUgMC0uNDYuMTgtLjQ5LjQybC0uMzggMi42NWMtLjYxLjI1LTEuMTcuNTktMS42OS45OGwtMi40OS0xYS42LjYgMCAwIDAtLjE4LS4wM2MtLjE3IDAtLjM0LjA5LS40My4yNWwtMiAzLjQ2Yy0uMTMuMjItLjA3LjQ5LjEyLjY0bDIuMTEgMS42NWMtLjA0LjMyLS4wNy42NS0uMDcuOThzLjAzLjY2LjA3Ljk4bC0yLjExIDEuNjVjLS4xOS4xNS0uMjQuNDItLjEyLjY0bDIgMy40NmEuNS41IDAgMCAwIC42MS4yMmwyLjQ5LTFjLjUyLjQgMS4wOC43MyAxLjY5Ljk4bC4zOCAyLjY1Yy4wMy4yNC4yNC40Mi40OS40Mmg0Yy4yNSAwIC40Ni0uMTguNDktLjQybC4zOC0yLjY1Yy42MS0uMjUgMS4xNy0uNTkgMS42OS0uOThsMi40OSAxcS4wOS4wMy4xOC4wM2MuMTcgMCAuMzQtLjA5LjQzLS4yNWwyLTMuNDZjLjEyLS4yMi4wNy0uNDktLjEyLS42NHptLTEuOTgtMS43MWMuMDQuMzEuMDUuNTIuMDUuNzNzLS4wMi40My0uMDUuNzNsLS4xNCAxLjEzbC44OS43bDEuMDguODRsLS43IDEuMjFsLTEuMjctLjUxbC0xLjA0LS40MmwtLjkuNjhjLS40My4zMi0uODQuNTYtMS4yNS43M2wtMS4wNi40M2wtLjE2IDEuMTNsLS4yIDEuMzVoLTEuNGwtLjE5LTEuMzVsLS4xNi0xLjEzbC0xLjA2LS40M2MtLjQzLS4xOC0uODMtLjQxLTEuMjMtLjcxbC0uOTEtLjdsLTEuMDYuNDNsLTEuMjcuNTFsLS43LTEuMjFsMS4wOC0uODRsLjg5LS43bC0uMTQtMS4xM2MtLjAzLS4zMS0uMDUtLjU0LS4wNS0uNzRzLjAyLS40My4wNS0uNzNsLjE0LTEuMTNsLS44OS0uN2wtMS4wOC0uODRsLjctMS4yMWwxLjI3LjUxbDEuMDQuNDJsLjktLjY4Yy40My0uMzIuODQtLjU2IDEuMjUtLjczbDEuMDYtLjQzbC4xNi0xLjEzbC4yLTEuMzVoMS4zOWwuMTkgMS4zNWwuMTYgMS4xM2wxLjA2LjQzYy40My4xOC44My40MSAxLjIzLjcxbC45MS43bDEuMDYtLjQzbDEuMjctLjUxbC43IDEuMjFsLTEuMDcuODVsLS44OS43ek0xMiA4Yy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0czQtMS43OSA0LTRzLTEuNzktNC00LTRtMCA2Yy0xLjEgMC0yLS45LTItMnMuOS0yIDItMnMyIC45IDIgMnMtLjkgMi0yIDIiLz48L3N2Zz4=" class="menu-icon" alt="Configuración">
                    </div>
                    <div class="icon notification-icon">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNNSAxOXEtLjQyNSAwLS43MTItLjI4OFQ0IDE4dC4yODgtLjcxMlQ1IDE3aDF2LTdxMC0yLjA3NSAxLjI1LTMuNjg3VDEwLjUgNC4ydi0uN3EwLS42MjUuNDM4LTEuMDYyVDEyIDJ0MS4wNjMuNDM4VDEzLjUgMy41di43cTIgLjUgMy4yNSAyLjExM1QxOCAxMHY3aDFxLjQyNSAwIC43MTMuMjg4VDIwIDE4dC0uMjg4LjcxM1QxOSAxOXptNyAzcS0uODI1IDAtMS40MTItLjU4N1QxMCAyMGg0cTAgLjgyNS0uNTg3IDEuNDEzVDEyIDIybS00LTVoOHYtN3EwLTEuNjUtMS4xNzUtMi44MjVUMTIgNlQ5LjE3NSA3LjE3NVQ4IDEweiIvPjwvc3ZnPg==" class="menu-icon" alt="Notificaciones">
                    </div>
                </div>
            </div>
            <div class="location-tags">
                <a href="#" data-section="cali" class="active">Cali</a>
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
          const prevSelected = this.shadowRoot.querySelector(`.location-tags a[data-section="${this.currentSelected}"]`);
          if (prevSelected) {
            prevSelected.classList.remove('active');
          }
          
          this.currentSelected = section;
          target.classList.add('active');
          
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

export default reponsiveheader;