import { InteractionService } from '../../../Services/fluxLikeandSave/InteractionsService';

export class Publication extends HTMLElement {
    private interactionService: InteractionService;
    private publicationId: string;
    private unsubscribe?: () => void;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.interactionService = InteractionService.getInstance();
        this.publicationId = '';
    }

    connectedCallback() {
        const username = this.getAttribute('username') || '';
        const text = this.getAttribute('text') || '';
        const hasImage = this.hasAttribute('has-image');
        const stars = parseInt(this.getAttribute('stars') || '0');
        
        this.publicationId = this.generatePublicationId(username, text);
        this.render(username, text, hasImage, stars);
        this.setupEventListeners(username);
        this.subscribeToStore();
    }

    disconnectedCallback() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    private generatePublicationId(username: string, text: string): string {
        const shortText = text.substring(0, 50);
        return btoa(username + shortText).replace(/[^a-zA-Z0-9]/g, '');
    }

    private render(username: string, text: string, hasImage: boolean, stars: number) {
        const isLiked = this.interactionService.isLiked(this.publicationId);
        const isBookmarked = this.interactionService.isBookmarked(this.publicationId);

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
                        transition: transform 0.2s ease, box-shadow 0.2s ease;
                    }

                    :host(:hover) {
                        transform: translateY(-2px);
                        box-shadow: 0 15px 30px rgba(0,0,0,0.15);
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
                        gap: 16px;
                    }
                    .action-icon {
                        cursor: pointer;
                        transition: all 0.2s ease;
                        color: #666;
                        width: 24px;
                        height: 24px;
                    }
                    .action-icon:hover {
                        transform: scale(1.1);
                    }
                    .like-icon {
                        color: ${isLiked ? 'red' : '#666'};
                        fill: ${isLiked ? 'red' : 'none'};
                    }
                    .like-icon:hover {
                        color: red;
                    }
                    .bookmark-icon {
                        color: ${isBookmarked ? '#FFD700' : '#666'};
                        fill: ${isBookmarked ? '#FFD700' : 'none'};
                    }
                    .bookmark-icon:hover {
                        color: #FFD700;
                    }

                    @media (max-width: 768px) {
                        .publication-container {
                            padding: 15px;
                        }
                        
                        .header {
                            margin-bottom: 10px;
                        }
                        
                        .profile-pic {
                            width: 40px;
                            height: 40px;
                            margin-right: 10px;
                        }
                        
                        .username {
                            font-size: 15px;
                        }
                        
                        .publication-text {
                            font-size: 15px;
                            margin-bottom: 12px;
                        }
                        
                        .stars {
                            font-size: 20px;
                            letter-spacing: 1px;
                        }
                        
                        .action-icon {
                            width: 22px;
                            height: 22px;
                        }
                        
                        .actions {
                            gap: 12px;
                        }
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
        }
    }

    private setupEventListeners(username: string): void {
        const likeIcon = this.shadowRoot?.querySelector('.like-icon') as SVGElement;
        const bookmarkIcon = this.shadowRoot?.querySelector('.bookmark-icon') as SVGElement;
        
        if (likeIcon) {
            likeIcon.addEventListener('click', () => {
                this.interactionService.toggleLike(this.publicationId, username);
            });
        }

        if (bookmarkIcon) {
            bookmarkIcon.addEventListener('click', () => {
                this.interactionService.toggleBookmark(this.publicationId, username);
            });
        }
    }

    private subscribeToStore(): void {
        this.unsubscribe = this.interactionService.subscribe(() => {
            this.updateIconStates();
        });
    }

    private updateIconStates(): void {
        const likeIcon = this.shadowRoot?.querySelector('.like-icon') as SVGElement;
        const bookmarkIcon = this.shadowRoot?.querySelector('.bookmark-icon') as SVGElement;
        
        const isLiked = this.interactionService.isLiked(this.publicationId);
        const isBookmarked = this.interactionService.isBookmarked(this.publicationId);

        if (likeIcon) {
            likeIcon.style.color = isLiked ? 'red' : '#666';
            likeIcon.style.fill = isLiked ? 'red' : 'none';
        }

        if (bookmarkIcon) {
            bookmarkIcon.style.color = isBookmarked ? '#FFD700' : '#666';
            bookmarkIcon.style.fill = isBookmarked ? '#FFD700' : 'none';
        }
    }

    // Métodos públicos para acceso externo
    public toggleLike() {
        this.liked = !this.liked;
        const likeIcon = this.shadowRoot?.querySelector('.like-icon') as SVGElement;
        if (likeIcon) {
            likeIcon.style.color = this.liked ? 'red' : '#666';
            likeIcon.style.fill = this.liked ? 'red' : 'none';
            
            // Disparar evento personalizado
            this.dispatchEvent(new CustomEvent('publication-liked', {
                bubbles: true,
                composed: true,
                detail: {
                    username: this.getAttribute('username'),
                    liked: this.liked
                }
            }));
        }
    }

    public toggleBookmark() {
        this.bookmarked = !this.bookmarked;
        const bookmarkIcon = this.shadowRoot?.querySelector('.bookmark-icon') as SVGElement;
        if (bookmarkIcon) {
            bookmarkIcon.style.color = this.bookmarked ? '#FFD700' : '#666';
            bookmarkIcon.style.fill = this.bookmarked ? '#FFD700' : 'none';
            
            // Disparar evento personalizado
            this.dispatchEvent(new CustomEvent('publication-bookmarked', {
                bubbles: true,
                composed: true,
                detail: {
                    username: this.getAttribute('username'),
                    bookmarked: this.bookmarked
                }
            }));
        }
    }
}

export default Publication;