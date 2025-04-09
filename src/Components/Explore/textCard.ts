export class TextCard extends HTMLElement {
    static get observedAttributes() {
        return ['text', 'position-col', 'position-row', 'span-cols', 'span-rows'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        if (!this.shadowRoot) return;
        
        const text = this.getAttribute('text') || '';
        const col = this.getAttribute('position-col') || '1';
        const row = this.getAttribute('position-row') || '1';
        const spanCols = this.getAttribute('span-cols') || '1';
        const spanRows = this.getAttribute('span-rows') || '1';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    grid-column: ${col} / span ${spanCols};
                    grid-row: ${row} / span ${spanRows};
                    display: block;
                }
                
                .text-card {
                    padding: 20px;
                    font-size: 14px;
                    line-height: 1.5;
                    background-color: #fff;
                    border-radius: 4px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    transition: all 0.3s ease;
                    transform-origin: top left;
                }
                
                .text-card:hover {
                    transform: scale(1.05) rotate(2deg);
                    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
                    background-color: #f8f8f8;
                }
                
                @media (max-width: 768px) {
                    :host {
                        grid-column: 1 !important;
                        grid-row: auto !important;
                    }
                }
            </style>
            
            <div class="text-card">
                ${text}
            </div>
        `;
    }
}

export default TextCard;