// Componente que alterna entre header normal y responsive
class HeaderCompleto extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                
                .lulada-header,
                .lulada-responsive-header {
                    width: 100%;
                    transition: all 0.3s ease;
                }
                
                .lulada-header {
                    display: block;
                }
                
                .lulada-responsive-header {
                    display: none;
                }
                
                @media (max-width: 900px) {
                    .lulada-header {
                        display: none !important;
                    }
                    
                    .lulada-responsive-header {
                        display: block !important;
                    }
                }
                
                @media (min-width: 901px) {
                    .lulada-header {
                        display: block !important;
                    }
                    
                    .lulada-responsive-header {
                        display: none !important;
                    }
                }
            </style>
            
            <div class="lulada-header">
                <lulada-header></lulada-header>
            </div>
                    
            <div class="lulada-responsive-header">
                <lulada-responsive-header></lulada-responsive-header>
            </div>
            `;
        }
        
        this.resizeHandler = this.resizeHandler.bind(this);
        this.resizeHandler(); 
    }
    
    connectedCallback() {
        window.addEventListener('resize', this.resizeHandler);
    }
    
    disconnectedCallback(){
        window.removeEventListener('resize', this.resizeHandler);
    }
    
    resizeHandler() {
        const Header = this.shadowRoot?.querySelector('.lulada-header') as HTMLDivElement;
        const Headerresponsive = this.shadowRoot?.querySelector('.lulada-responsive-header') as HTMLDivElement;
        
        if (Header && Headerresponsive) {
            if (window.innerWidth < 900) { 
                Header.style.display = 'none'; 
                Headerresponsive.style.display = 'block'; 
            } else {
                Header.style.display = 'block'; 
                Headerresponsive.style.display = 'none'; 
            }
        }
    }
}

export default HeaderCompleto;