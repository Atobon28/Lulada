import { FirebasePublicationsService, CreatePublicationData } from '../../../Services/firebase/FirebasePublicationsService';
import { FirebaseUserService } from '../../../Services/firebase/FirebaseUserService';

export class LuladaAntojar extends HTMLElement {
    shadow: ShadowRoot;
    selectedStars: number = 0;
    selectedZone: string = "";
    selectedPhoto: string | undefined = undefined;
    
    private firebasePublications: FirebasePublicationsService;
    private firebaseUser: FirebaseUserService;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.firebasePublications = FirebasePublicationsService.getInstance();
        this.firebaseUser = FirebaseUserService.getInstance();
    }

    connectedCallback() {
        this.render();
        this.setupEvents();
    }

    render() {
        this.shadow.innerHTML = `
            <style>
                .popup {
                    background: white;
                    padding: 25px;
                    border-radius: 20px;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                    max-width: 550px;
                    width: 100%;
                    font-family: Arial, sans-serif;
                    position: relative;
                    box-sizing: border-box;
                }
                
                @media (max-width: 600px) {
                    .popup {
                        padding: 15px;
                        border-radius: 15px;
                        max-width: 95vw;
                        margin: 10px auto;
                    }
                }
                
                .close-button {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #333;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    z-index: 10;
                }
                .close-button:hover {
                    transform: scale(1.1);
                }

                .header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                    margin-left: 10px;
                }
                .profile-pic {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    margin-right: 12px;
                    object-fit: cover;
                    border: 2px solid #AAAB54;
                }
                .header-text {
                    font-size: 18px;
                    color: #999;
                    font-weight: normal;
                }
                .user-info {
                    display: flex;
                    flex-direction: column;
                }
                .user-name {
                    font-size: 14px;
                    font-weight: bold;
                    color: #333;
                }
                .auth-status {
                    font-size: 11px;
                    color: #22c55e;
                    font-weight: 500;
                }

                .restaurant-input {
                    width: 100%;
                    padding: 12px 16px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 16px;
                    margin-bottom: 16px;
                    box-sizing: border-box;
                    outline: none;
                    transition: border-color 0.2s ease;
                }

                .restaurant-input:focus {
                    border-color: #AAAB54;
                }

                .restaurant-input::placeholder {
                    color: #999;
                }

                textarea {
                    width: 100%;
                    min-height: 140px;
                    border: none;
                    resize: none;
                    font-size: 16px;
                    margin-bottom: 16px;
                    outline: none;
                    font-family: Arial, sans-serif;
                    line-height: 1.5;
                    color: #333;
                    box-sizing: border-box;
                    padding: 10px;
                    border: 1px solid #eee;
                    border-radius: 8px;
                }
                
                @media (max-width: 600px) {
                    textarea {
                        min-height: 100px;
                        font-size: 14px;
                        padding: 8px;
                    }
                }
                
                textarea:focus {
                    border-color: #AAAB54;
                }

                .photo-container {
                    margin-bottom: 16px;
                    display: none;
                }

                .photo-preview {
                    width: 100%;
                    max-height: 300px;
                    border-radius: 8px;
                    object-fit: cover;
                    border: 2px solid #AAAB54;
                    margin-bottom: 10px;
                }

                .photo-actions {
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                }

                .photo-btn {
                    padding: 6px 12px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    background: white;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s ease;
                }

                .photo-btn:hover {
                    background: #f5f5f5;
                }

                .photo-btn.remove {
                    color: #e74c3c;
                    border-color: #e74c3c;
                }

                .photo-btn.remove:hover {
                    background: #e74c3c;
                    color: white;
                }

                .file-input {
                    display: none;
                }

                .zone-selector {
                    display: flex;
                    align-items: center;
                    margin-bottom: 16px;
                    gap: 10px;
                }
                
                @media (max-width: 600px) {
                    .zone-selector {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 8px;
                    }
                }
                
                .zone-label {
                    font-size: 16px;
                    color: #666;
                    min-width: 120px;
                }
                
                @media (max-width: 600px) {
                    .zone-label {
                        min-width: auto;
                        font-size: 14px;
                    }
                }
                
                .zone-select {
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 14px;
                    color: #333;
                    background-color: white;
                    min-width: 120px;
                }
                
                @media (max-width: 600px) {
                    .zone-select {
                        width: 100%;
                        max-width: none;
                        min-width: auto;
                    }
                }
                
                .zone-select:focus {
                    outline: none;
                    border-color: #AAAB54;
                }

                .bottom-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 16px;
                    border-top: 1px solid #f0f0f0;
                }
                
                @media (max-width: 600px) {
                    .bottom-actions {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 15px;
                    }
                }
                
                .icon-buttons {
                    display: flex;
                    gap: 15px;
                }

                .action-icon {
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: #666;
                    width: 24px;
                    height: 24px;
                    stroke: currentColor;
                    stroke-width: 2;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    fill: none;
                }
                .action-icon:hover {
                    transform: scale(1.1);
                    color: #AAAB54;
                }

                .action-icon.active {
                    color: #AAAB54;
                    transform: scale(1.1);
                }
                
                .stars {
                    display: flex;
                    gap: 5px;
                }
                .star {
                    color: #FFD700;
                    font-size: 24px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .star-outline {
                    color: #ddd;
                    display: inline-block;
                    font-size: 24px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .star-outline:hover,
                .star-outline.active {
                    color: #FFD700 !important;
                }

                .publish-button {
                    background-color: #AAAB54;
                    color: white;
                    border: none;
                    border-radius: 20px;
                    padding: 10px 30px;
                    font-size: 16px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.2s ease;
                }
                
                @media (max-width: 600px) {
                    .publish-button {
                        width: 100%;
                        padding: 12px;
                        font-size: 16px;
                        order: 3;
                    }
                }
                
                .publish-button:hover:not(:disabled) {
                    transform: scale(1.05);
                    background-color: rgb(132, 134, 58);
                }
                .publish-button:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                    transform: none;
                }

                .icon-container {
                    display: flex;
                    align-items: center;
                }
                
                @media (max-width: 600px) {
                    .icon-container {
                        justify-content: flex-start;
                    }
                }
                
                .icon-wrapper {
                    width: 30px;
                    height: 30px;
                    margin-right: 10px;
                }
                .rating-stars {
                    display: flex;
                    align-items: center;
                }
                
                @media (max-width: 600px) {
                    .rating-stars {
                        justify-content: center;
                    }
                }

                .auth-warning {
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    color: white;
                    padding: 12px 16px;
                    border-radius: 8px;
                    margin-bottom: 16px;
                    font-size: 14px;
                    text-align: center;
                }

                .loading {
                    display: none;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    color: #666;
                }

                .loading.visible {
                    display: flex;
                }

                .loading-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid #f3f3f3;
                    border-top: 2px solid #AAAB54;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
            
            <div class="popup">
                <button id="cerrar" class="close-button">✕</button>
                
                <div class="header">
                    <img 
                        id="profile-pic"
                        src=""
                        alt="Profile" 
                        class="profile-pic"
                    >
                    <div>
                        <div id="user-info" class="user-info">
                            <div class="user-name">Usuario</div>
                            <div class="auth-status" id="auth-status"></div>
                        </div>
                    </div>
                </div>

                <div id="auth-warning" class="auth-warning" style="display: none;">
                    ⚠️ Inicia sesión para que tu reseña aparezca con tu nombre real
                </div>
                
                <input 
                    type="text" 
                    id="restaurant-input"
                    class="restaurant-input"
                    placeholder="¿En qué restaurante comiste?"
                    maxlength="100"
                >
                
                <textarea placeholder="Cuéntanos tu experiencia..."></textarea>
                
                <div class="photo-container" id="photo-container">
                    <img id="photo-preview" class="photo-preview" alt="Vista previa">
                    <div class="photo-actions">
                        <button class="photo-btn remove" id="remove-photo">Quitar foto</button>
                    </div>
                </div>

                <input type="file" id="file-input" class="file-input" accept="image/*">
                
                <div class="zone-selector">
                    <label class="zone-label" for="zone-select">Zona de Cali:</label>
                    <select id="zone-select" class="zone-select">
                        <option value="">Seleccionar zona</option>
                        <option value="centro">Centro</option>
                        <option value="norte">Norte</option>
                        <option value="sur">Sur</option>
                        <option value="oeste">Oeste</option>
                    </select>
                </div>
                
                <div class="bottom-actions">
                    <div class="icon-container">
                        <div class="icon-wrapper">
                            <svg class="action-icon photo-icon" id="photo-icon" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                        </div>
                    </div>
                    
                    <div class="rating-stars">
                        <span class="star-outline" data-value="1">☆</span>
                        <span class="star-outline" data-value="2">☆</span>
                        <span class="star-outline" data-value="3">☆</span>
                        <span class="star-outline" data-value="4">☆</span>
                        <span class="star-outline" data-value="5">☆</span>
                    </div>
                    
                    <button id="publicar" class="publish-button">
                        <span class="button-text">Publicar</span>
                        <div class="loading">
                            <div class="loading-spinner"></div>
                            <span>Publicando...</span>
                        </div>
                    </button>
                </div>
            </div>
        `;

        this.updateUserInfo();
    }

    private async updateUserInfo(): Promise<void> {
        const authState = this.firebaseUser.getAuthState();
        const profilePic = this.shadow.querySelector('#profile-pic') as HTMLImageElement;
        const userInfo = this.shadow.querySelector('#user-info .user-name');
        const authStatus = this.shadow.querySelector('#auth-status');
        const authWarning = this.shadow.querySelector('#auth-warning') as HTMLElement;

        if (authState.isAuthenticated && authState.user) {
            // Usuario autenticado
            profilePic.src = authState.user.photoURL || 'https://randomuser.me/api/portraits/women/44.jpg';
            if (userInfo) userInfo.textContent = authState.user.displayName || 'Usuario';
            if (authStatus) authStatus.textContent = '✓ Verificado con Firebase';
            authWarning.style.display = 'none';
        } else {
            // Usuario no autenticado
            profilePic.src = 'https://randomuser.me/api/portraits/women/44.jpg';
            if (userInfo) userInfo.textContent = 'Usuario Anónimo';
            if (authStatus) authStatus.textContent = 'No verificado';
            authWarning.style.display = 'block';
        }
    }

    setupEvents() {
        const cerrar = this.shadow.querySelector('#cerrar');
        const publicar = this.shadow.querySelector('#publicar');
        const textarea = this.shadow.querySelector('textarea') as HTMLTextAreaElement;
        const restaurantInput = this.shadow.querySelector('#restaurant-input') as HTMLInputElement;
        const estrellas = this.shadow.querySelectorAll('.star-outline');
        const zoneSelect = this.shadow.querySelector('#zone-select') as HTMLSelectElement;
        
        const photoIcon = this.shadow.querySelector('#photo-icon');
        const fileInput = this.shadow.querySelector('#file-input') as HTMLInputElement;
        const removePhotoBtn = this.shadow.querySelector('#remove-photo');

        // Evento cerrar
        if (cerrar) {
            cerrar.addEventListener('click', () => {
                this.resetComponentState();
                this.dispatchEvent(new CustomEvent('antojar-cerrado', { bubbles: true, composed: true }));
            });
        }

        // Evento publicar
        if (publicar) {
            publicar.addEventListener('click', async () => {
                await this.handlePublish(textarea, restaurantInput);
            });
        }

        // Eventos para otros controles
        if (zoneSelect) {
            zoneSelect.addEventListener('change', () => {
                this.selectedZone = zoneSelect.value;
                this.updatePublishButton();
            });
        }

        if (photoIcon) {
            photoIcon.addEventListener('click', () => {
                fileInput?.click();
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                const file = target.files?.[0];
                if (file) {
                    this.handlePhotoSelection(file);
                }
            });
        }

        if (removePhotoBtn) {
            removePhotoBtn.addEventListener('click', () => {
                this.removePhoto();
            });
        }

        estrellas.forEach((estrella) => {
            estrella.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const value = parseInt(target.getAttribute('data-value') || '0');
                this.selectedStars = value;

                estrellas.forEach((e) => {
                    const starValue = parseInt(e.getAttribute('data-value') || '0');
                    if (starValue <= value) {
                        e.textContent = '★';
                        e.classList.add('active');
                    } else {
                        e.textContent = '☆';
                        e.classList.remove('active');
                    }
                });

                this.updatePublishButton();
            });
        });

        if (textarea) {
            textarea.addEventListener('input', () => {
                this.updatePublishButton();
            });
        }

        if (restaurantInput) {
            restaurantInput.addEventListener('input', () => {
                this.updatePublishButton();
            });
        }
    }

    private async handlePublish(textarea: HTMLTextAreaElement, restaurantInput: HTMLInputElement): Promise<void> {
        const texto = textarea.value.trim();
        const restaurant = restaurantInput.value.trim();
        
        if (!texto || !restaurant || this.selectedStars === 0 || !this.selectedZone) {
            alert('Por favor completa todos los campos: restaurante, texto, calificación y zona.');
            return;
        }

        const authState = this.firebaseUser.getAuthState();
        
        if (!authState.isAuthenticated || !authState.user) {
            const proceed = confirm('No has iniciado sesión. Tu reseña se publicará como usuario anónimo. ¿Continuar?');
            if (!proceed) return;
        }

        this.setPublishingState(true);

        try {
            const publicationData: CreatePublicationData = {
                text: texto,
                stars: this.selectedStars,
                restaurant: restaurant,
                location: this.selectedZone as 'centro' | 'norte' | 'sur' | 'oeste',
                imageUrl: this.selectedPhoto
            };

            const currentUser = authState.user || {
                uid: `anonymous_${Date.now()}`,
                displayName: 'Usuario Anónimo',
                email: null,
                photoURL: null
            };

            const publicationId = await this.firebasePublications.createPublication(publicationData, currentUser);

            if (publicationId) {
                this.showSuccessMessage(true);
                this.resetComponentState();
                this.dispatchEvent(new CustomEvent('antojar-cerrado', { bubbles: true, composed: true }));
                
                // Disparar evento global
                document.dispatchEvent(new CustomEvent('nueva-publicacion-firebase', {
                    detail: { publicationId, userId: currentUser.uid }
                }));
            } else {
                throw new Error('No se pudo crear la publicación');
            }

        } catch (error) {
            console.error('Error publicando en Firebase:', error);
            this.showErrorMessage();
        } finally {
            this.setPublishingState(false);
        }
    }

    private setPublishingState(isPublishing: boolean): void {
        const button = this.shadow.querySelector('#publicar') as HTMLButtonElement;
        const buttonText = button.querySelector('.button-text') as HTMLElement;
        const loading = button.querySelector('.loading') as HTMLElement;

        if (isPublishing) {
            button.disabled = true;
            buttonText.style.display = 'none';
            loading.classList.add('visible');
        } else {
            button.disabled = false;
            buttonText.style.display = 'inline';
            loading.classList.remove('visible');
        }
    }

    private showSuccessMessage(isFirebase = false): void {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            z-index: 10001;
            font-family: Arial, sans-serif;
            font-weight: 600;
            box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 18px;">${isFirebase ? '🔥' : '🎉'}</span>
                <span>¡Reseña publicada ${isFirebase ? 'en Firebase' : 'exitosamente'}!</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 400);
        }, 4000);
    }

    private showErrorMessage(): void {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            z-index: 10001;
            font-family: Arial, sans-serif;
            font-weight: 600;
            box-shadow: 0 8px 24px rgba(220, 38, 38, 0.3);
            transform: translateX(100%);
            transition: transform 0.4s ease;
        `;
        
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 18px;">❌</span>
                <span>Error al publicar. Intenta de nuevo.</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 400);
        }, 4000);
    }

    // Resto de métodos (sin cambios)
    handlePhotoSelection(file: File) {
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona un archivo de imagen válido.');
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('La imagen es muy grande. Por favor selecciona una imagen menor a 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target?.result as string;
            this.selectedPhoto = base64;
            this.showPhotoPreview(base64);
            this.updatePhotoIcon(true);
            this.updatePublishButton();
        };

        reader.onerror = () => {
            console.error("Error al leer el archivo");
            alert('Error al procesar la imagen. Por favor intenta de nuevo.');
        };

        reader.readAsDataURL(file);
    }

    showPhotoPreview(base64: string) {
        const photoContainer = this.shadow.querySelector('#photo-container') as HTMLElement;
        const photoPreview = this.shadow.querySelector('#photo-preview') as HTMLImageElement;

        if (photoContainer && photoPreview) {
            photoPreview.src = base64;
            photoContainer.style.display = 'block';
        }
    }

    removePhoto() {
        this.selectedPhoto = undefined;
        
        const photoContainer = this.shadow.querySelector('#photo-container') as HTMLElement;
        const fileInput = this.shadow.querySelector('#file-input') as HTMLInputElement;
        
        if (photoContainer) {
            photoContainer.style.display = 'none';
        }
        
        if (fileInput) {
            fileInput.value = '';
        }
        
        this.updatePhotoIcon(false);
        this.updatePublishButton();
    }

    updatePhotoIcon(hasPhoto: boolean) {
        const photoIcon = this.shadow.querySelector('#photo-icon');
        if (photoIcon) {
            if (hasPhoto) {
                photoIcon.classList.add('active');
            } else {
                photoIcon.classList.remove('active');
            }
        }
    }

    updatePublishButton() {
        const publicar = this.shadow.querySelector('#publicar') as HTMLButtonElement;
        const textarea = this.shadow.querySelector('textarea') as HTMLTextAreaElement;
        const restaurantInput = this.shadow.querySelector('#restaurant-input') as HTMLInputElement;
        
        if (publicar && textarea && restaurantInput) {
            const hasText = textarea.value.trim().length > 0;
            const hasRestaurant = restaurantInput.value.trim().length > 0;
            const hasStars = this.selectedStars > 0;
            const hasZone = this.selectedZone !== "";
            
            publicar.disabled = !(hasText && hasRestaurant && hasStars && hasZone);
        }
    }

    resetComponentState() {
        const textarea = this.shadow.querySelector('textarea') as HTMLTextAreaElement;
        const restaurantInput = this.shadow.querySelector('#restaurant-input') as HTMLInputElement;
        const estrellas = this.shadow.querySelectorAll('.star-outline');
        const zoneSelect = this.shadow.querySelector('#zone-select') as HTMLSelectElement;

        if (textarea) {
            textarea.value = '';
        }

        if (restaurantInput) {
            restaurantInput.value = '';
        }

        this.selectedStars = 0;
        estrellas.forEach((estrella) => {
            estrella.textContent = '☆';
            estrella.classList.remove('active');
        });

        this.selectedZone = "";
        if (zoneSelect) {
            zoneSelect.value = "";
        }

        this.removePhoto();
        this.updatePublishButton();
    }
}

if (!customElements.get('lulada-antojar')) {
    customElements.define('lulada-antojar', LuladaAntojar);
}