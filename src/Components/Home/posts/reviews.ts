export class Review extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const username = this.getAttribute('username') || '';
        const text = this.getAttribute('text') || '';
        const stars = parseInt(this.getAttribute('stars') || '0');

        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        margin-bottom: 10px;
                    }
                    .review {
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        padding: 10px;
                    }
                    .review-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .stars {
                        color: gold;
                    }
                </style>
                <div class="review">
                    <div class="review-header">
                        <strong>@${username}</strong>
                        <div class="stars">${'★'.repeat(stars)}${'☆'.repeat(5-stars)}</div>
                    </div>
                    <p>${text}</p>
                </div>
            `;
        }
    }
}

customElements.define('review', Review);