export class Navigation extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                    }
                    .navigation {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background-color: #f0f0f0;
                        padding: 10px;
                        text-align: center;
                    }
                    .navigation-container {
                        display: flex;
                        gap: 20px;
                    }
                    .navigation a {
                        text-decoration: none;
                        color: #333;
                        font-weight: bold;
                        padding: 5px 10px;
                    }
                    .navigation a:hover {
                        color: #666;
                        background-color: #e0e0e0;
                        border-radius: 5px;
                    }
                </style>
                <div class="navigation">
                    <div class="navigation-container">
                        <a href="#" data-section="cali">Cali</a>
                        <a href="#" data-section="norte">Norte</a>
                        <a href="#" data-section="sur">Sur</a>
                        <a href="#" data-section="oeste">Oeste</a>
                        <a href="#" data-section="centro">Centro</a>
                    </div>
                </div>
            `;
            
            this.shadowRoot.querySelectorAll('a').forEach((link: Element) => {
                link.addEventListener('click', (e: Event) => {
                    e.preventDefault();
                    const target = e.target as HTMLElement;
                    const section = target.getAttribute('data-section');
                    this.dispatchEvent(new CustomEvent('navigate', { 
                        detail: section,
                        bubbles: true,
                        composed: true
                    }));
                });
            });
        }
    }
}

customElements.define('navigation', Navigation);