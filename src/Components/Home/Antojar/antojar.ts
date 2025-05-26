export class LuladaAntojar extends HTMLElement {
    shadow: ShadowRoot;
    selectedStars: number = 0;
    locationSelected: boolean = false;
    selectedZone: string = "";

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        console.log("Componente LuladaAntojar creado");
    }

    connectedCallback() {
        console.log("Componente LuladaAntojar conectado al DOM");
        this.render();
        this.setupEvents();
    }

    render() {
        this.shadow.innerHTML = `
            <style>
                /* Estilos del popup */
                .popup {
                    background: white;
                    padding: 25px;
                    border-radius: 20px;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                    max-width: 550px;
                    width: 100%;
                    font-family: Arial, sans-serif;
                    position: relative;
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
                }
                .header-text {
                    font-size: 18px;
                    color: #999;
                    font-weight: normal;
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
                }
                .zone-selector {
                    display: flex;
                    align-items: center;
                    margin-bottom: 16px;
                    gap: 10px;
                }
                .zone-label {
                    font-size: 16px;
                    color: #666;
                    min-width: 120px;
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
                }
                
                /* Modificado para que sea azul al hover y amarillo cuando activo */
                .location-icon:hover {
                    color: #4285F4 !important; /* Azul de Google */
                }
                .location-icon.active {
                    color: rgb(244, 238, 66) !important; /* Amarillo */
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
                    color: #FFD700;
                    display: inline-block;
                    font-size: 24px;
                    cursor: pointer;
                }
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
                .publish-button:hover {
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
                .icon-wrapper {
                    width: 30px;
                    height: 30px;
                    margin-right: 10px;
                }
                .rating-stars {
                    display: flex;
                    align-items: center;
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
                    <div class="header-text">¿Qué probaste?</div>
                </div>
                <textarea placeholder="Cuéntanos tu experiencia..."></textarea>
                
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
                            <svg class="action-icon photo-icon" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                        </div>
                        <div class="icon-wrapper">
                            <svg id="location-icon" class="action-icon location-icon" viewBox="0 0 24 24">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
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
                    <button id="publicar" class="publish-button">Publicar</button>
                </div>
            </div>
        `;

        // Generar una imagen de perfil aleatoria al cargar inicialmente
        this.updateProfilePicture();
    }

    setupEvents() {
        console.log("Configurando eventos del componente LuladaAntojar");
        const cerrar = this.shadow.querySelector('#cerrar');
        const publicar = this.shadow.querySelector('#publicar');
        const textarea = this.shadow.querySelector('textarea') as HTMLTextAreaElement;
        const estrellas = this.shadow.querySelectorAll('.star-outline');
        const locationIcon = this.shadow.querySelector('#location-icon');
        const zoneSelect = this.shadow.querySelector('#zone-select') as HTMLSelectElement;

        if (cerrar) {
            cerrar.addEventListener('click', () => {
                console.log("Botón cerrar clickeado");
                this.resetComponentState();
                this.dispatchEvent(new CustomEvent('antojar-cerrado', { bubbles: true, composed: true }));
            });
        }

        if (publicar) {
            publicar.addEventListener('click', () => {
                console.log("Botón publicar clickeado");
                const texto = textarea.value.trim();
                if (texto && this.selectedStars > 0 && this.selectedZone) {
                    // Crear objeto de publicación
                    const nuevaPublicacion = {
                        username: "Usuario" + Math.floor(Math.random() * 1000),
                        text: texto,
                        stars: this.selectedStars,
                        location: this.selectedZone,
                        hasImage: false,
                        timestamp: Date.now()
                    };

                    // Guardar en sessionStorage
                    const publicaciones = JSON.parse(sessionStorage.getItem('publicaciones') || '[]');
                    publicaciones.unshift(nuevaPublicacion); // Agregar al inicio
                    sessionStorage.setItem('publicaciones', JSON.stringify(publicaciones));

                    this.dispatchEvent(new CustomEvent('resena-publicada', {
                        detail: nuevaPublicacion,
                        bubbles: true,
                        composed: true
                    }));

                    this.resetComponentState();
                    
                    // Mostrar mensaje de éxito
                    alert('¡Publicación creada exitosamente!');
                } else {
                    alert('Por favor completa todos los campos: texto, calificación y zona.');
                }
            });
        }

        // Selector de zona
        if (zoneSelect) {
            zoneSelect.addEventListener('change', () => {
                this.selectedZone = zoneSelect.value;
                this.updatePublishButton();
            });
        }

        // Funcionalidad para las estrellas
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

        // Funcionalidad para el icono de ubicación
        if (locationIcon) {
            locationIcon.addEventListener('click', () => {
                this.locationSelected = !this.locationSelected;
                if (this.locationSelected) {
                    locationIcon.classList.add('active');
                } else {
                    locationIcon.classList.remove('active');
                }
            });
        }

        // Actualizar botón cuando se escribe
        if (textarea) {
            textarea.addEventListener('input', () => {
                this.updatePublishButton();
            });
        }
    }

    updatePublishButton() {
        const publicar = this.shadow.querySelector('#publicar') as HTMLButtonElement;
        const textarea = this.shadow.querySelector('textarea') as HTMLTextAreaElement;
        
        if (publicar && textarea) {
            const hasText = textarea.value.trim().length > 0;
            const hasStars = this.selectedStars > 0;
            const hasZone = this.selectedZone !== "";
            
            publicar.disabled = !(hasText && hasStars && hasZone);
        }
    }

    updateProfilePicture() {
        const profilePic = this.shadow.querySelector('#profile-pic') as HTMLImageElement;
        if (profilePic) {
            const gender = Math.random() > 0.5 ? 'men' : 'women';
            const randomId = Math.floor(Math.random() * 100);
            profilePic.src = `https://randomuser.me/api/portraits/thumb/${gender}/${randomId}.jpg`;
        }
    }

    resetComponentState() {
        console.log("Reiniciando estado del componente");
        const textarea = this.shadow.querySelector('textarea') as HTMLTextAreaElement;
        const estrellas = this.shadow.querySelectorAll('.star-outline');
        const locationIcon = this.shadow.querySelector('#location-icon');
        const zoneSelect = this.shadow.querySelector('#zone-select') as HTMLSelectElement;

        // Limpiar texto
        if (textarea) {
            textarea.value = '';
        }

        // Resetear estrellas
        this.selectedStars = 0;
        estrellas.forEach((estrella) => {
            estrella.textContent = '☆';
            estrella.classList.remove('active');
        });

        // Resetear ubicación
        this.locationSelected = false;
        if (locationIcon) {
            locationIcon.classList.remove('active');
        }

        // Resetear zona
        this.selectedZone = "";
        if (zoneSelect) {
            zoneSelect.value = "";
        }

        // Generar nueva imagen de perfil
        this.updateProfilePicture();
        
        // Actualizar botón
        this.updatePublishButton();
    }
}

// Asegúrate de que el componente esté registrado una sola vez
if (!customElements.get('lulada-antojar')) {
    console.log("Registrando componente LuladaAntojar");
    customElements.define('lulada-antojar', LuladaAntojar);
} else {
    console.log("Componente LuladaAntojar ya está registrado");
}