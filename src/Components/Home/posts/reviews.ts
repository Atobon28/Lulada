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
                        margin-bottom: 20px;
                    }
                    .review {
                        background-color: white;
                        border-radius: 20px;
                        padding: 20px;
                        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                    }
                    .review-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 12px;
                    }
                    .stars {
                        color: #FFD700;
                        font-size: 24px;
                        letter-spacing: 2px;
                    }
                    .username {
                        font-weight: bold;
                        font-size: 16px;
                        color: #333;
                    }
                    .review-text {
                        font-size: 16px;
                        line-height: 1.5;
                        color: #333;
                    }
                </style>
                <div class="review">
                    <div class="review-header">
                        <div class="username">@${username}</div>
                        <div class="stars">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</div>
                    </div>
                    <p class="review-text">${text}</p>
                </div>
            `;
        }
    }
}

export default Review;