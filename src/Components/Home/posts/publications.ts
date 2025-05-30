// Importamos el servicio que maneja las interacciones (likes y bookmarks)
import { InteractionService } from './../../../Services/flux/Interactionservice';

// Definimos qué información necesita una publicación guardada
interface SavedPublication {
    id: string;           // Identificador único de la publicación
    username: string;     // Nombre del usuario que la escribió
    text: string;         // El texto de la reseña
    stars: number;        // Calificación en estrellas (1-5)
    hasImage: boolean;    // Si tiene imagen o no
    timestamp: number;    // Cuándo se creó
}

// Esta es la clase principal que crea cada publicación que vemos en pantalla
export class Publication extends HTMLElement {
    // Variables que guardan si el usuario le dio like o guardó la publicación
    liked: boolean = false;
    bookmarked: boolean = false;

    // Conexión con el servicio que maneja likes y bookmarks
    private interactionService = InteractionService.getInstance();
    // ID único para identificar esta publicación específica
    private publicationId: string = '';
    // Función para cancelar la suscripción cuando se destruye el componente
    private unsubscribe?: () => void;

    constructor() {
        super(); // Llamamos al constructor padre
        // Creamos un "shadow DOM" - como una caja aislada para nuestro HTML/CSS
        this.attachShadow({ mode: 'open' });
    }

    // Esta función se ejecuta cuando la publicación aparece en pantalla
    connectedCallback() {
        // Obtenemos toda la información que viene desde el HTML
        const username = this.getAttribute('username') || '';     // Nombre del usuario
        const text = this.getAttribute('text') || '';             // Texto de la reseña
        const hasImage = this.hasAttribute('has-image');          // Si tiene imagen
        const stars = parseInt(this.getAttribute('stars') || '0'); // Calificación
        const imageUrl = this.getAttribute('image-url') || '';     // URL de la imagen subida

        // Verificamos si ya estaba guardada antes
        this.bookmarked = this.hasAttribute('bookmarked');
        // Configuramos el sistema de likes y bookmarks
        this.SetupInteractionSystem();

        // Si tenemos un lugar donde poner el HTML, lo creamos
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    /* Estilos para que la publicación se vea como una tarjeta bonita */
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

                    /* Cuando pasas el mouse por encima, se eleva un poquito */
                    :host(:hover) {
                        transform: translateY(-2px);
                        box-shadow: 0 15px 30px rgba(0,0,0,0.15);
                    }

                    /* Contenedor principal con espaciado interno */
                    .publication-container {
                        padding: 20px;
                    }
                    
                    /* Cabecera donde va la foto de perfil y el nombre */
                    .header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 12px;
                    }
                    
                    /* Foto de perfil circular */
                    .profile-pic {
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;
                        margin-right: 12px;
                        object-fit: cover;
                    }
                    
                    /* Nombre de usuario en negrita */
                    .username {
                        font-weight: bold;
                        font-size: 16px;
                        color: #333;
                    }
                    
                    /* El texto de la reseña */
                    .publication-text {
                        margin-bottom: 16px;
                        font-size: 16px;
                        line-height: 1.5;
                        color: #333;
                    }
                    
                    /* ESTILOS PARA IMÁGENES SUBIDAS POR USUARIO */
                    .user-image {
                        width: 100%;
                        border-radius: 12px;
                        margin-bottom: 16px;
                        max-height: 500px;
                        object-fit: cover;
                        cursor: pointer;
                        transition: transform 0.2s ease;
                        border: 2px solid #f0f0f0;
                    }

                    /* Efecto cuando pasas el mouse sobre la imagen */
                    .user-image:hover {
                        transform: scale(1.02);
                        border-color: #AAAB54;
                    }

                    /* ESTILOS PARA IMÁGENES ALEATORIAS (versión anterior) */
                    .publication-image {
                        width: 100%;
                        border-radius: 8px;
                        margin-bottom: 16px;
                        max-height: 400px;
                        object-fit: cover;
                    }

                    /* Modal (ventana emergente) para ver imagen en grande */
                    .image-modal {
                        display: none;
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100vw;
                        height: 100vh;
                        background-color: rgba(0, 0, 0, 0.9);
                        z-index: 10000;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                    }

                    /* La imagen dentro del modal */
                    .image-modal img {
                        max-width: 90%;
                        max-height: 90%;
                        object-fit: contain;
                        border-radius: 8px;
                    }

                    /* Botón X para cerrar el modal */
                    .image-modal .close-btn {
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        color: white;
                        font-size: 30px;
                        cursor: pointer;
                        background: rgba(0, 0, 0, 0.5);
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: background-color 0.2s ease;
                    }

                    /* Efecto hover del botón cerrar */
                    .image-modal .close-btn:hover {
                        background: rgba(0, 0, 0, 0.8);
                    }

                    /* Pie de la publicación donde van las estrellas y botones */
                    .footer {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    
                    /* Las estrellas de calificación */
                    .stars {
                        color: #FFD700;
                        font-size: 24px;
                        letter-spacing: 2px;
                    }
                    
                    /* Contenedor de los botones de acción (like, bookmark) */
                    .actions {
                        display: flex;
                        align-items: center;
                        gap: 16px;
                    }
                    
                    /* Iconos de acción básicos */
                    .action-icon {
                        cursor: pointer;
                        transition: all 0.2s ease;
                        color: #666;
                        width: 24px;
                        height: 24px;
                    }
                    
                    /* Efecto cuando pasas el mouse sobre los iconos */
                    .action-icon:hover {
                        transform: scale(1.1);
                    }
                    
                    /* ESTILOS RESPONSIVOS PARA MÓVIL */
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

                        .user-image {
                            border-radius: 10px;
                            max-height: 300px;
                        }

                        .image-modal .close-btn {
                            top: 15px;
                            right: 15px;
                            font-size: 25px;
                            width: 35px;
                            height: 35px;
                        }
                    }
                    
                    /* Efectos hover para los grupos de botones */
                    .like-group:hover,
                    .bookmark-group:hover{
                      background-color: rgba(0, 0, 0, 0.05);
                    }
                    
                    /* Estilos para el contador de likes */
                    .like-count{
                      color:red !important;
                      font-weight: 600;
                      font-size: 14px;
                      min-width: 16px;
                      text-align: center;
                    }
                    
                    /* Estilos para el contador de bookmarks */
                    .bookmark-count{
                    color:#FFD700 !important;
                    font-weight: 600;
                    font-size: 14px;
                    min-width: 16px;
                    text-align: center;
                    }
                    
                    /* Animación del corazón cuando le das like */
                    .like-icon.like{
                    animation:heartBeat 0.4s ease;
                    }
                    
                    /* Animación del bookmark cuando lo guardas */
                    .bookmark-icon.bookmark{
                    animation:bookmarkBounce 0.3s ease
                    }
                    
                    /* Definición de la animación del corazón */
                    @keyframes heartBeat {
                    0% {transform: scale(1);}
                    25% {transform: scale(1.2);}
                    50% {transform: scale(1.1);}
                    100% {transform: scale(1);}
                    }
                    
                    /* Definición de la animación del bookmark */
                    @keyframes bookmarkBounce {
                    0% {transform: scale(1);}
                    50% {transform: scale(1.15);}
                    100% {transform: scale(1);}
                    }
                </style>
                
                <!-- AQUÍ EMPIEZA EL HTML DE LA PUBLICACIÓN -->
                <div class="publication-container">
                    <!-- Cabecera con foto y nombre de usuario -->
                    <div class="header">
                        <img 
                            src="https://randomuser.me/api/portraits/thumb/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg" 
                            alt="${username}" 
                            class="profile-pic"
                        >
                        <div class="username">@${username}</div>
                    </div>
                    
                    <!-- El texto de la reseña -->
                    <div class="publication-text">
                        ${text}
                    </div>
                    
                    <!-- Aquí va la imagen si existe -->
                    ${this.generateImageHTML(hasImage, imageUrl)}
                    
                    <!-- Pie con botones y estrellas -->
                    <div class="footer">
                        <div class="actions">
                          <!-- Botón de like con contador -->
                          <div style="display: flex; align-items: center; gap: 4px; cursor: pointer; padding: 4px 8px; border-radius: 8px; transition: background-color 0.2s ease;" class="like-group">
                            <svg class="action-icon like-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span class="like-count" style="font-size: 14px; font-weight: 600; color: red; display: none;">0</span>
                          </div>
                          
                          <!-- Botón de bookmark con contador -->
                          <div style="display: flex; align-items: center; gap: 4px; cursor: pointer; padding: 4px 8px; border-radius: 8px; transition: background-color 0.2s ease;" class="bookmark-group">
                            <svg class="action-icon bookmark-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <span class="bookmark-count" style="font-size: 14px; font-weight: 600; color: #FFD700; display: none;">0</span>
                          </div>
                        </div>

                        <!-- Las estrellas de calificación -->
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <div class="stars">
                                ${'★'.repeat(stars)}${'☆'.repeat(5-stars)}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal para ver imagen en grande -->
                <div class="image-modal" id="image-modal">
                    <div class="close-btn" id="close-modal">×</div>
                    <img id="modal-image" src="" alt="Imagen ampliada">
                </div>
            `;

            // Obtenemos referencias a los botones de like y bookmark
            const likeGroup = this.shadowRoot.querySelector('.like-group') as HTMLElement;
            const bookmarkGroup = this.shadowRoot.querySelector('.bookmark-group') as HTMLElement;
            
            // Configuramos qué pasa cuando haces click en el botón de like
            if (likeGroup) {
                likeGroup.addEventListener('click', () => {
                    const username = this.getAttribute('username') || 'current-user';
                    // Le decimos al servicio que cambie el estado del like
                    this.interactionService.toggleLike(this.publicationId, username);
                    
                    // Enviamos un evento para que otros componentes sepan que se dio like
                    this.dispatchEvent(new CustomEvent('publication-liked', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            username: username,
                            liked: this.interactionService.isLiked(this.publicationId)
                        }
                    }));
                });
            }

            // Configuramos qué pasa cuando haces click en el botón de bookmark
            if (bookmarkGroup) {
                bookmarkGroup.addEventListener('click', () => {
                    const username = this.getAttribute('username') || 'current-user';
                    // Le decimos al servicio que cambie el estado del bookmark
                    this.interactionService.toggleBookmark(this.publicationId, username);
                    // Verificamos si ahora está guardada o no
                    const isBookmarked = this.interactionService.isBookmarked(this.publicationId);
                    
                    if(isBookmarked){
                        // Si se guardó, la añadimos a la lista de guardadas
                        this.saveToSaveList();
                        console.log('publicacion guardada')
                    }else{
                        // Si se quitó, la removemos de la lista de guardadas
                        this.removeFromSavedList();
                        console.log('publicacion quitada')
                    }

                    // Enviamos un evento para que otros componentes sepan del cambio
                    this.dispatchEvent(new CustomEvent('publication-bookmarked', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            username: username,
                            bookmarked: isBookmarked
                        }
                    }));
                });
            }
        }
    }
    
    // Esta función se ejecuta cuando la publicación desaparece de pantalla
    disconnectedCallback() {
        // Cancelamos la suscripción al servicio para evitar problemas de memoria
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    // NUEVA FUNCIÓN: Decide qué HTML mostrar para la imagen
    private generateImageHTML(hasImage: boolean, imageUrl: string): string {
        // Si no tiene imagen, no mostramos nada
        if (!hasImage) {
            return '';
        }

        // Si hay una URL de imagen (subida por el usuario), la usamos
        if (imageUrl) {
            return `
                <img 
                    src="${imageUrl}" 
                    alt="Imagen de la reseña" 
                    class="user-image"
                    onclick="this.getRootNode().host.openImageModal('${imageUrl}')"
                    onerror="this.style.display='none'"
                >
            `;
        }

        // Si no hay URL, usamos una imagen aleatoria (para mantener compatibilidad)
        return `
            <img 
                src="https://picsum.photos/600/400?random=${Math.floor(Math.random() * 1000)}" 
                alt="Publication image" 
                class="publication-image"
            >
        `;
    }

    // Función para configurar los eventos de click (no se usa actualmente)
    private setupEventListeners(): void {
        const likeIcon = this.shadowRoot?.querySelector('.like-icon') as SVGElement;
        const bookmarkIcon = this.shadowRoot?.querySelector('.bookmark-icon') as SVGElement;
        const userImages = this.shadowRoot?.querySelectorAll('.user-image');
        const imageModal = this.shadowRoot?.querySelector('#image-modal') as HTMLElement;
        const closeModal = this.shadowRoot?.querySelector('#close-modal') as HTMLElement;
        
        // Configurar click en el icono de like
        if (likeIcon) {
            likeIcon.addEventListener('click', () => {
                this.liked = !this.liked;
                likeIcon.style.color = this.liked ? 'red' : '#666';
                likeIcon.style.fill = this.liked ? 'red' : 'none';
                
                this.dispatchEvent(new CustomEvent('publication-liked', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        username: this.getAttribute('username'),
                        liked: this.liked
                    }
                }));
            });
        }

        // Configurar click en el icono de bookmark
        if (bookmarkIcon) {
            bookmarkIcon.addEventListener('click', () => {
                this.bookmarked = !this.bookmarked;
                bookmarkIcon.style.color = this.bookmarked ? '#FFD700' : '#666';
                bookmarkIcon.style.fill = this.bookmarked ? '#FFD700' : 'none';
                
                this.dispatchEvent(new CustomEvent('publication-bookmarked', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        username: this.getAttribute('username'),
                        bookmarked: this.bookmarked
                    }
                }));
            });
        }

        // NUEVO: Configurar clicks en las imágenes para abrirlas en grande
        userImages?.forEach(img => {
            img.addEventListener('click', () => {
                const src = (img as HTMLImageElement).src;
                this.openImageModal(src);
            });
        });

        // NUEVO: Configurar el botón X del modal
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.closeImageModal();
            });
        }

        // NUEVO: Cerrar modal si haces click fuera de la imagen
        if (imageModal) {
            imageModal.addEventListener('click', (e) => {
                if (e.target === imageModal) {
                    this.closeImageModal();
                }
            });
        }
    }

    // NUEVA FUNCIÓN: Abre el modal para ver la imagen en grande
    public openImageModal(imageUrl: string): void {
        const modal = this.shadowRoot?.querySelector('#image-modal') as HTMLElement;
        const modalImage = this.shadowRoot?.querySelector('#modal-image') as HTMLImageElement;
        
        if (modal && modalImage) {
            modalImage.src = imageUrl;           // Ponemos la imagen en el modal
            modal.style.display = 'flex';        // Mostramos el modal
            
            // Evitamos que se pueda hacer scroll en la página
            document.body.style.overflow = 'hidden';
            
            console.log(' Modal de imagen abierto');
        }
    }

    // NUEVA FUNCIÓN: Cierra el modal de imagen
    public closeImageModal(): void {
        const modal = this.shadowRoot?.querySelector('#image-modal') as HTMLElement;
        
        if (modal) {
            modal.style.display = 'none';        // Ocultamos el modal
            
            // Restauramos el scroll de la página
            document.body.style.overflow = 'auto';
            
            console.log(' Modal de imagen cerrado');
        }
    }

    // Métodos públicos que pueden ser llamados desde fuera del componente
    public toggleLike() {
        this.liked = !this.liked;
        const likeIcon = this.shadowRoot?.querySelector('.like-icon') as SVGElement;
        if (likeIcon) {
            likeIcon.style.color = this.liked ? 'red' : '#666';
            likeIcon.style.fill = this.liked ? 'red' : 'none';
            
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
    
    // Configura el sistema de interacciones (likes y bookmarks)
    private SetupInteractionSystem() {
        const username = this.getAttribute('username') || '';
        const text = this.getAttribute('text') || '';
        const existingId= this.getAttribute('data-publication-id') ;
        
        // Si ya tiene un ID, lo usamos; si no, generamos uno nuevo
        if (existingId) {
            this.publicationId = existingId;
        }else {
            this.publicationId = this.generatePublicationId(username, text);
        }

        // Nos suscribimos a los cambios del servicio de interacciones
        this.unsubscribe = this.interactionService.subscribe(() => {
            this.updateInteractionUI();
        });
        
        // Actualizamos la interfaz con el estado inicial
        this.updateInteractionUI();
    }
    
    // Genera un ID único para la publicación basado en el usuario y texto
    private generatePublicationId(username: string, text: string): string {
       const content = `${username}-${text}`;
       // Convertimos a base64 y limpiamos caracteres especiales
       const hash =btoa(content).replace(/[^a-zA-Z0-9]/g, '');
       return `publication_${hash.substring(0,16)}`;
    }

    // Actualiza la interfaz (colores, contadores) según el estado actual
    private updateInteractionUI() {
        if (!this.shadowRoot) return;
        
        const likeIcon = this.shadowRoot.querySelector('.like-icon') as SVGElement;
        const bookmarkIcon = this.shadowRoot.querySelector('.bookmark-icon') as SVGElement;
        
        // Actualizamos el icono de like
        if (likeIcon) {
            const isLiked = this.interactionService.isLiked(this.publicationId);
            likeIcon.style.color = isLiked ? 'red' : '#666';
            likeIcon.style.fill = isLiked ? 'red' : 'none';
            
            // Mostramos el contador de likes
            this.updateCounter('.like-count', this.interactionService.getLikeCount(this.publicationId));
        }
        
        // Actualizamos el icono de bookmark
        if (bookmarkIcon) {
            const isBookmarked = this.interactionService.isBookmarked(this.publicationId);
            bookmarkIcon.style.color = isBookmarked ? '#FFD700' : '#666';
            bookmarkIcon.style.fill = isBookmarked ? '#FFD700' : 'none';
            
            // Mostramos el contador de bookmarks
            this.updateCounter('.bookmark-count', this.interactionService.getBookmarkCount(this.publicationId));
        }
    }

    // Actualiza un contador específico (likes o bookmarks)
    private updateCounter(selector: string, count: number) {
        const counter = this.shadowRoot?.querySelector(selector) as HTMLElement;
        if (counter) {
            // Si hay conteo, lo mostramos; si no, lo ocultamos
            counter.textContent = count > 0 ? count.toString() : '';
            counter.style.display = count > 0 ? 'inline' : 'none';
        }
    }
    
    // Guarda esta publicación en la lista de guardadas del localStorage
    private saveToSaveList() {
        // Obtenemos la lista actual de publicaciones guardadas
        const saved: SavedPublication[] = JSON.parse(localStorage.getItem('lulada_saved_reviews') || '[]');
        
        // Creamos un objeto con la información de esta publicación
        const publication: SavedPublication = {
            id:this.publicationId,
            username:this.getAttribute('username') || '',
            text:this.getAttribute('text') || '',
            stars: parseInt(this.getAttribute('stars') || '0'),
            hasImage: this.hasAttribute('has-image'),
            timestamp: Date.now()
        };
        
        // Verificamos que no esté ya guardada
        const exists = saved.find((p: SavedPublication) => p.id === this.publicationId);
        if(!exists){
            saved.unshift(publication);// La añadimos al inicio de la lista
            localStorage.setItem('lulada_saved_reviews',JSON.stringify(saved));
        }
    }
    
    // Quita esta publicación de la lista de guardadas del localStorage
    private removeFromSavedList(){
        // Obtenemos la lista actual
        const saved: SavedPublication[] = JSON.parse(localStorage.getItem('lulada_saved_reviews')|| '[]');
        // Filtramos para quitar esta publicación específica
        const filtered = saved.filter((p: SavedPublication) => p.id !== this.publicationId);
        // Guardamos la lista actualizada
        localStorage.setItem('lulada_saved_reviews', JSON.stringify(filtered));
    }
    // Este método es importante para que la página de guardados pueda actualizar su interfaz
}

export default Publication;