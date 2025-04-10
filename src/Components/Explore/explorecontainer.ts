// Removed imports that are causing errors

export class ExploreContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                    box-sizing: border-box;
                }
                
                images-explore {
                    width: 100%;
                }
            </style>
            
            <images-explore></images-explore>
        `;
    }
}

export default ExploreContainer;