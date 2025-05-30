// Interfaz para eventos de búsqueda personalizados
interface SearchEvent extends CustomEvent {
    detail: string;
}

// Componente de encabezado con funcionalidad de búsqueda
class HeaderExplorer extends HTMLElement {
    shadowRoot: ShadowRoot;
    searchInput: HTMLInputElement | null = null;

    constructor() {
        super();
        // Crea Shadow DOM para aislar estilos
        this.shadowRoot = this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    background-color: white;
                    position: relative;
                    z-index: 10;
                }

                .header-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    position: relative;
                }

                .logo-container {
                    width: 300px;
                }

                .search-container {
                    flex-grow: 1;
                    display: flex;
                    justify-content: center;
                    padding: 0 20px;
                }

                .search-bar {
                    width: 100%;
                    max-width: 400px;
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .search-input {
                    width: 100%;
                    padding: 10px 15px;
                    padding-right: 45px;
                    border: 1px solid #ddd;
                    border-radius: 20px;
                    font-size: 16px;
                    color: #666;
                    outline: none;
                    transition: all 0.3s ease;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }

                .search-input:focus {
                    border-color: #AAAB54;
                    box-shadow: 0 0 5px rgba(170, 171, 84, 0.3);
                }

                .search-input::placeholder {
                    color: #bbb;
                }

                .search-icon {
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 20px;
                    height: 20px;
                    pointer-events: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2;
                    background-color: white;
                    padding-left: 5px;
                }

                .search-icon img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            </style>
            
            <div class="header-container">
                <div class="logo-container">
                    <lulada-logo></lulada-logo>
                </div>
                <div class="search-container">
                    <div class="search-bar">
                        <input type="text" class="search-input" placeholder="Busca y anótate" maxlength="100" />
                        <span class="search-icon">
                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNOS41IDNBNi41IDYuNSAwIDAgMSAxNiA5LjVjMCAxLjYxLS41OSAzLjA5LTEuNTYgNC4yM2wuMjcuMjdoLjc5bDUgNWwtMS41IDEuNWwtNS01di0uNzlsLS4yNy0uMjdBNi41MiA2LjUyIDAgMCAxIDkuNSAxNkE2LjUgNi41IDAgMCAxIDMgOS41QTYuNSA2LjUgMCAwIDEgOS41IDNtMCAyQzcgNSA1IDcgNSA5LjVTNyAxNCA5LjUgMTRTMTQgMTIgMTQgOS41UzEyIDUgOS41IDUiLz48L3N2Zz4=" />
                        </span>
                    </div>
                </div>
            </div>
        `;

        this.searchInput = this.shadowRoot.querySelector('.search-input');
        this.addEventListeners();
    }

    // Configura los eventos del input de búsqueda
    addEventListeners(): void {
        if (this.searchInput) {
            this.searchInput.addEventListener('keypress', (e: KeyboardEvent) => {
                if (e.key === 'Enter') {
                    const searchValue = this.searchInput?.value.trim();
                    
                    if (searchValue) {
                        this.dispatchEvent(new CustomEvent<string>('search-submit', { 
                            detail: searchValue,
                            bubbles: true,
                            composed: true
                        }) as SearchEvent);
                    }
                }
            });
        }
    }

    // Obtiene el valor actual del campo de búsqueda
    getSearchValue(): string {
        return this.searchInput?.value || '';
    }

    // Establece el valor del campo de búsqueda
    setSearchValue(value: string): void {
        if (this.searchInput) {
            this.searchInput.value = value;
        }
    }
}

export default HeaderExplorer;