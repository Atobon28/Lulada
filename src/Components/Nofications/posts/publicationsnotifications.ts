export class Publication extends HTMLElement {
    liked: boolean = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const username = this.getAttribute('username') || '';
        const text = this.getAttribute('text') || '';
        const hasImage = this.hasAttribute('has-image');
        const stars = parseInt(this.getAttribute('stars') || '0');

        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    :host {
                        display: block;
                        background-color: white;
                        border-radius: 12px;
                        border: 1px solid #e0e0e0;
                        margin-bottom: 16px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    }
                    .publication-container {
                        padding: 16px;
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 12px;
                    }
                    .profile-pic {
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;
                        margin-right: 12px;
                        object-fit: cover;
                    }
                    .username {
                        font-weight: bold;
                    }
                    .publication-text {
                        margin-bottom: 12px;
                    }
                    .publication-image {
                        width: 100%;
                        border-radius: 8px;
                        margin-bottom: 12px;
                        max-height: 400px;
                        object-fit: cover;
                    }
                    .footer {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .stars {
                        color: #FFD700;
                    }
                    .actions {
                        display: flex;
                        align-items: center;
                    }
                    .action-icon {
                        margin-left: 12px;
                        cursor: pointer;
                    }
                    .location-icon, .bookmark-icon {
                        color: #888;
                    }
                    .like-icon {
                        color: ${this.liked ? 'red' : '#888'};
                        fill: ${this.liked ? 'red' : 'none'};
                    }
                </style>
                
                <div class="publication-container">
                    <div class="header">
                        <img 
                            src="" 
                            alt="${username}" 
                            class="profile-pic"
                        >
                        <div class="username">@${username}</div>
                    </div>
                    
                    ${hasImage ? `
                        <img 
                            src="" 
                            alt="Publication image" 
                            class="publication-image"
                        >
                    ` : ''}
                    
                    <div class="publication-text">
                        ${text}
                    </div>
                    
                    <div class="footer">
                        <div class="stars">
                            ${'★'.repeat(stars)}${'☆'.repeat(5-stars)}
                        </div>
                        <div class="actions">
                            <svg class="action-icon location-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <svg class="action-icon like-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <svg class="action-icon bookmark-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            `;

            const likeIcon = this.shadowRoot.querySelector('.like-icon') as SVGElement;
            if (likeIcon) {
                likeIcon.addEventListener('click', () => {
                    this.liked = !this.liked;
                    likeIcon.style.color = this.liked ? 'red' : '#888';
                    likeIcon.style.fill = this.liked ? 'red' : 'none';
                    
                    this.dispatchEvent(new CustomEvent('publication-liked', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            username: username,
                            liked: this.liked
                        }
                    }));
                });
            }
        }
    }
}

customElements.define('lulada-publication', Publication);