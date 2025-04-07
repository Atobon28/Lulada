export class Publication extends HTMLElement {
    liked: boolean = false;
    bookmarked: boolean = false;

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
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        background-color: white;
                        border-radius: 20px;
                        margin-bottom: 20px;
                        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                        overflow: hidden;
                        width: 100%;
                    }
                    .publication-container {
                        padding: 20px;
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
                        font-size: 16px;
                        color: #333;
                    }
                    .publication-text {
                        margin-bottom: 16px;
                        font-size: 16px;
                        line-height: 1.5;
                        color: #333;
                    }
                    .publication-image {
                        width: 100%;
                        border-radius: 8px;
                        margin-bottom: 16px;
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
                        font-size: 24px;
                        letter-spacing: 2px;
                    }
                    .actions {
                        display: flex;
                        align-items: center;
                    }
                    .action-icon {
                        margin-right: 16px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        color: #666;
                        width: 24px;
                        height: 24px;
                    }
                    .action-icon:hover {
                        transform: scale(1.1);
                    }
                    .location-icon:hover {
                        color: #4285F4;
                    }
                    .like-icon {
                        color: ${this.liked ? 'red' : '#666'};
                        fill: ${this.liked ? 'red' : 'none'};
                    }
                    .like-icon:hover {
                        color: red;
                    }
                    .bookmark-icon {
                        color: ${this.bookmarked ? '#FFD700' : '#666'};
                        fill: ${this.bookmarked ? '#FFD700' : 'none'};
                    }
                    .bookmark-icon:hover {
                        color: #FFD700;
                    }
                </style>
                
                <div class="publication-container">
                    <div class="header">
                        <img 
                            src="https://randomuser.me/api/portraits/thumb/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg" 
                            alt="${username}" 
                            class="profile-pic"
                        >
                        <div class="username">@${username}</div>
                    </div>
                    
                    <div class="publication-text">
                        ${text}
                    </div>
                    
                    ${hasImage ? `
                        <img 
                            src="https://picsum.photos/600/400?random=${Math.floor(Math.random() * 1000)}" 
                            alt="Publication image" 
                            class="publication-image"
                        >
                    ` : ''}
                    
                    <div class="footer">
                        <div class="actions">
                            <svg class="action-icon location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <svg class="action-icon like-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <svg class="action-icon bookmark-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </div>
                        <div class="stars">
                            ${'★'.repeat(stars)}${'☆'.repeat(5-stars)}
                        </div>
                    </div>
                </div>
            `;

            const likeIcon = this.shadowRoot.querySelector('.like-icon') as SVGElement;
            const bookmarkIcon = this.shadowRoot.querySelector('.bookmark-icon') as SVGElement;
            
            if (likeIcon) {
                likeIcon.addEventListener('click', () => {
                    this.liked = !this.liked;
                    likeIcon.style.color = this.liked ? 'red' : '#666';
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

            if (bookmarkIcon) {
                bookmarkIcon.addEventListener('click', () => {
                    this.bookmarked = !this.bookmarked;
                    bookmarkIcon.style.color = this.bookmarked ? '#FFD700' : '#666';
                    bookmarkIcon.style.fill = this.bookmarked ? '#FFD700' : 'none';
                    
                    this.dispatchEvent(new CustomEvent('publication-bookmarked', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            username: username,
                            bookmarked: this.bookmarked
                        }
                    }));
                });
            }
        }
    }
}

export default Publication;
