import { Header } from './Header/Header';
import { Logo } from './Header/Logo';
import { Navigation } from './navigation';
import { ReviewsContainer } from './posts/reviewscontainer';
import { Suggestions } from './suggestions';
import { Sidebar } from './Navbar/sidebar';

export class Home extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        font-family: Arial, sans-serif;
                    }
                    .main-layout {
                        display: flex;
                    }
                    .sidebar {
                        width: 250px;
                    }
                    .content {
                        flex-grow: 1;
                        display: flex;
                        flex-direction: column;
                    }
                    .content-area {
                        display: flex;
                    }
                    .reviews-section {
                        flex-grow: 1;
                        padding: 20px;
                        background-color: #f4f4f4;
                        display: flex;
                        justify-content: center;
                    }
                    .reviews-content {
                        width: 100%;
                        max-width: 600px;
                    }
                </style>
                
                <lulada-header></lulada-header>
                
                <div class="main-layout">
                    <div class="sidebar">
                        <lulada-sidebar></lulada-sidebar>
                    </div>
                    
                    <div class="content">
                        <div class="content-area">
                            <div class="reviews-section">
                                <div class="reviews-content">
                                    <lulada-reviews-container></lulada-reviews-container>
                                </div>
                            </div>
                            <lulada-suggestions></lulada-suggestions>
                        </div>
                    </div>
                </div>
            `;

            this.shadowRoot.addEventListener('location-select', (e: Event) => {
                const event = e as CustomEvent;
                console.log(`Selected location: ${event.detail}`);
                this.filterReviewsByLocation(event.detail);
            });

            this.shadowRoot.addEventListener('menuselect', (e: Event) => {
                const event = e as CustomEvent;
                console.log(`Selected menu: ${event.detail.menuItem}`);
            });
        }
    }

    filterReviewsByLocation(location: string): void {
        if (!this.shadowRoot) return;
        
        const reviewsContainer = this.shadowRoot.querySelector('lulada-reviews-container');
        if (reviewsContainer) {
            reviewsContainer.setAttribute('location-filter', location);
        }
    }
}

customElements.define('lulada-home', Home);