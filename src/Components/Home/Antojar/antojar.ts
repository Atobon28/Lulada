// Importamos el servicio que maneja las publicaciones
import PublicationsService from '../../../Services/PublicationsService';

// Definimos la clase principal que representa el popup de "Antojar"
export class LuladaAntojar extends HTMLElement {
    shadow: ShadowRoot; // El contenedor donde va nuestro HTML y CSS
    selectedStars: number = 0; // Cuántas estrellas ha seleccionado el usuario (0-5)
    selectedZone: string = ""; // Qué zona de Cali seleccionó (centro, norte, sur, oeste)
    selectedPhoto: string | undefined = undefined; // La foto que subió el usuario (en formato base64)

    constructor() {
        super(); // Llamamos al constructor de HTMLElement
        // Creamos un shadow DOM (como una caja privada para nuestro HTML)
        this.shadow = this.attachShadow({ mode: 'open' });
        console.log("Componente LuladaAntojar creado");
    }

    // Esta función se ejecuta cuando el componente se añade a la página
    connectedCallback() {
        console.log("Componente LuladaAntojar conectado al DOM");
        this.render(); // Dibujamos el popup
        this.setupEvents(); // Configuramos todos los botones y eventos
    }

    // Esta función dibuja todo el HTML y CSS del popup
    render() {
        this.shadow.innerHTML = `
            <style>
                /* === ESTILOS CSS === */
                /* Estilo principal del popup */
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
                
                /* Estilos para móviles */
                @media (max-width: 600px) {
                    .popup {
                        padding: 15px;
                        border-radius: 15px;
                        max-width: 95vw;
                        margin: 10px auto;
                    }
                }
                
                /* Botón X para cerrar el popup */
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
                    transform: scale(1.1); /* Se agranda un poco al pasar el mouse */
                }

                /* Cabecera con foto de perfil y texto */
                .header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                    margin-left: 10px;
                }
                .profile-pic {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%; /* Hace la imagen circular */
                    margin-right: 12px;
                    object-fit: cover;
                }
                .header-text {
                    font-size: 18px;
                    color: #999;
                    font-weight: normal;
                }

                /* Área de texto donde el usuario escribe su reseña */
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
                
                /* Textarea más pequeño en móviles */
                @media (max-width: 600px) {
                    textarea {
                        min-height: 100px;
                        font-size: 14px;
                        padding: 8px;
                    }
                }
                
                /* Borde verde cuando el usuario hace click en el textarea */
                textarea:focus {
                    border-color: #AAAB54;
                }

                /* === ESTILOS PARA LA FOTO === */
                /* Contenedor que muestra la foto seleccionada */
                .photo-container {
                    margin-bottom: 16px;
                    display: none; /* Oculto al principio */
                }

                /* La imagen de vista previa */
                .photo-preview {
                    width: 100%;
                    max-height: 300px;
                    border-radius: 8px;
                    object-fit: cover;
                    border: 2px solid #AAAB54;
                    margin-bottom: 10px;
                }

                /* Botones para manejar la foto */
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

                /* Botón rojo para quitar la foto */
                .photo-btn.remove {
                    color: #e74c3c;
                    border-color: #e74c3c;
                }

                .photo-btn.remove:hover {
                    background: #e74c3c;
                    color: white;
                }

                /* Input de archivo oculto (se activa con el ícono) */
                .file-input {
                    display: none;
                }

                /* === SELECTOR DE ZONA === */
                .zone-selector {
                    display: flex;
                    align-items: center;
                    margin-bottom: 16px;
                    gap: 10px;
                }
                
                /* En móviles, el selector se pone vertical */
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
                
                /* El dropdown para seleccionar zona */
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

                /* === PARTE INFERIOR DEL POPUP === */
                .bottom-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 16px;
                    border-top: 1px solid #f0f0f0;
                }
                
                /* En móviles, los elementos se apilan verticalmente */
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

                /* Iconos (como el de la cámara) */
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
                    transform: scale(1.1); /* Se agranda al pasar el mouse */
                    color: #AAAB54;
                }

                /* Ícono activo (cuando ya seleccionaste algo) */
                .action-icon.active {
                    color: #AAAB54;
                    transform: scale(1.1);
                }
                
                /* === ESTRELLAS DE CALIFICACIÓN === */
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
                    color: #ddd; /* Estrellas vacías en gris */
                    display: inline-block;
                    font-size: 24px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .star-outline:hover,
                .star-outline.active {
                    color: #FFD700 !important; /* Se vuelven doradas */
                }

                /* === BOTÓN DE PUBLICAR === */
                .publish-button {
                    background-color: #AAAB54; /* Verde de la marca */
                    color: white;
                    border: none;
                    border-radius: 20px;
                    padding: 10px 30px;
                    font-size: 16px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.2s ease;
                }
                
                /* En móviles, el botón ocupa todo el ancho */
                @media (max-width: 600px) {
                    .publish-button {
                        width: 100%;
                        padding: 12px;
                        font-size: 16px;
                        order: 3;
                    }
                }
                
                .publish-button:hover {
                    transform: scale(1.05); /* Se agranda un poco */
                    background-color: rgb(132, 134, 58); /* Verde más oscuro */
                }
                .publish-button:disabled {
                    background-color: #ccc; /* Gris cuando está deshabilitado */
                    cursor: not-allowed;
                    transform: none;
                }

                /* Contenedores para organizar los elementos */
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
            </style>
            
            <!-- === HTML DEL POPUP === -->
            <div class="popup">
                <!-- Botón X para cerrar -->
                <button id="cerrar" class="close-button">✕</button>
                
                <!-- Cabecera con foto de perfil y texto -->
                <div class="header">
                    <img 
                        id="profile-pic"
                        src=""
                        alt="Profile" 
                        class="profile-pic"
                    >
                    <div class="header-text">¿Qué probaste?</div>
                </div>
                
                <!-- Área donde el usuario escribe su reseña -->
                <textarea placeholder="Cuéntanos tu experiencia..."></textarea>
                
                <!-- Contenedor que aparece cuando el usuario sube una foto -->
                <div class="photo-container" id="photo-container">
                    <img id="photo-preview" class="photo-preview" alt="Vista previa">
                    <div class="photo-actions">
                        <button class="photo-btn remove" id="remove-photo">Quitar foto</button>
                    </div>
                </div>

                <!-- Input oculto para seleccionar archivos -->
                <input type="file" id="file-input" class="file-input" accept="image/*">
                
                <!-- Selector de zona de Cali -->
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
                
                <!-- Parte inferior con ícono de foto, estrellas y botón publicar -->
                <div class="bottom-actions">
                    <div class="icon-container">
                        <div class="icon-wrapper">
                            <!-- Ícono de cámara para subir fotos -->
                            <svg class="action-icon photo-icon" id="photo-icon" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                        </div>
                    </div>
                    
                    <!-- Las 5 estrellas para calificar -->
                    <div class="rating-stars">
                        <span class="star-outline" data-value="1">☆</span>
                        <span class="star-outline" data-value="2">☆</span>
                        <span class="star-outline" data-value="3">☆</span>
                        <span class="star-outline" data-value="4">☆</span>
                        <span class="star-outline" data-value="5">☆</span>
                    </div>
                    
                    <!-- Botón para publicar la reseña -->
                    <button id="publicar" class="publish-button">Publicar</button>
                </div>
            </div>
        `;

        // Ponemos una foto de perfil aleatoria
        this.updateProfilePicture();
    }

    // Esta función configura todos los eventos (clicks, cambios, etc.)
    setupEvents() {
        console.log("Configurando eventos del componente LuladaAntojar");
        
        // Obtenemos todos los elementos que necesitamos
        const cerrar = this.shadow.querySelector('#cerrar'); // Botón X
        const publicar = this.shadow.querySelector('#publicar'); // Botón publicar
        const textarea = this.shadow.querySelector('textarea') as HTMLTextAreaElement; // Área de texto
        const estrellas = this.shadow.querySelectorAll('.star-outline'); // Las 5 estrellas
        const zoneSelect = this.shadow.querySelector('#zone-select') as HTMLSelectElement; // Selector de zona
        
        // Elementos para manejar fotos
        const photoIcon = this.shadow.querySelector('#photo-icon'); // Ícono de cámara
        const fileInput = this.shadow.querySelector('#file-input') as HTMLInputElement; // Input de archivo
        const removePhotoBtn = this.shadow.querySelector('#remove-photo'); // Botón quitar foto

        // === EVENTO: Botón cerrar ===
        if (cerrar) {
            cerrar.addEventListener('click', () => {
                console.log("Botón cerrar clickeado");
                this.resetComponentState(); // Limpiamos todo
                // Enviamos señal de que se cerró el popup
                this.dispatchEvent(new CustomEvent('antojar-cerrado', { bubbles: true, composed: true }));
            });
        }

        // === EVENTO: Botón publicar ===
        if (publicar) {
            publicar.addEventListener('click', () => {
                console.log("Botón publicar clickeado");
                const texto = textarea.value.trim(); // Obtenemos el texto sin espacios extra
                
                // Verificamos que el usuario haya llenado todo
                if (texto && this.selectedStars > 0 && this.selectedZone) {
                    // Creamos el objeto con los datos de la publicación
                    const nuevaPublicacion = {
                        username: "Usuario" + Math.floor(Math.random() * 1000), // Username aleatorio
                        text: texto,
                        stars: this.selectedStars,
                        location: this.selectedZone,
                        hasImage: !!this.selectedPhoto, // TRUE si hay foto
                        timestamp: Date.now(), // Momento actual
                        imageUrl: this.selectedPhoto // La foto en base64
                    };

                    try {
                        // Intentamos guardar usando el servicio de publicaciones
                        const publicationsService = PublicationsService.getInstance();
                        publicationsService.addPublication(nuevaPublicacion);
                        
                        console.log("Publicación creada:", nuevaPublicacion);
                        
                        this.resetComponentState(); // Limpiamos el formulario
                        // Cerramos el popup
                        this.dispatchEvent(new CustomEvent('antojar-cerrado', { bubbles: true, composed: true }));
                        
                        // Mostramos mensaje de éxito
                        this.showSuccessMessage();
                        
                    } catch (error) {
                        console.error("Error al publicar:", error);
                        // Si falla, usamos el método de respaldo (sessionStorage)
                        const publicaciones = JSON.parse(sessionStorage.getItem('publicaciones') || '[]');
                        publicaciones.unshift(nuevaPublicacion);
                        sessionStorage.setItem('publicaciones', JSON.stringify(nuevaPublicacion));
                        
                        // Enviamos evento de que se publicó
                        this.dispatchEvent(new CustomEvent('resena-publicada', {
                            detail: nuevaPublicacion,
                            bubbles: true,
                            composed: true
                        }));

                        this.resetComponentState();
                        alert('¡Publicación creada exitosamente!');
                    }
                } else {
                    // Si falta información, mostramos error
                    alert('Por favor completa todos los campos: texto, calificación y zona.');
                }
            });
        }

        // === EVENTO: Selector de zona ===
        if (zoneSelect) {
            zoneSelect.addEventListener('change', () => {
                this.selectedZone = zoneSelect.value; // Guardamos la zona seleccionada
                this.updatePublishButton(); // Verificamos si ya se puede publicar
            });
        }

        // === EVENTOS PARA FOTOS ===
        
        // Cuando hacen click en el ícono de cámara
        if (photoIcon) {
            photoIcon.addEventListener('click', () => {
                console.log("Icono de foto clickeado");
                fileInput?.click(); // Abrimos el selector de archivos
            });
        }

        // Cuando seleccionan un archivo
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                const file = target.files?.[0]; // Obtenemos el primer archivo
                if (file) {
                    this.handlePhotoSelection(file); // Procesamos la foto
                }
            });
        }

        // Cuando hacen click en "Quitar foto"
        if (removePhotoBtn) {
            removePhotoBtn.addEventListener('click', () => {
                this.removePhoto(); // Quitamos la foto
            });
        }

        // === EVENTOS PARA LAS ESTRELLAS ===
        estrellas.forEach((estrella) => {
            estrella.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const value = parseInt(target.getAttribute('data-value') || '0'); // Qué estrella clickearon (1-5)
                this.selectedStars = value; // Guardamos la calificación

                // Actualizamos la apariencia de todas las estrellas
                estrellas.forEach((e) => {
                    const starValue = parseInt(e.getAttribute('data-value') || '0');
                    if (starValue <= value) {
                        e.textContent = '★'; // Estrella llena (dorada)
                        e.classList.add('active');
                    } else {
                        e.textContent = '☆'; // Estrella vacía
                        e.classList.remove('active');
                    }
                });

                this.updatePublishButton(); // Verificamos si ya se puede publicar
            });
        });

        // === EVENTO: Escribir en el textarea ===
        if (textarea) {
            textarea.addEventListener('input', () => {
                this.updatePublishButton(); // Cada vez que escriben, verificamos el botón
            });
        }
    }

    // Esta función maneja cuando el usuario selecciona una foto
    handlePhotoSelection(file: File) {
        console.log("Foto seleccionada:", file.name);

        // Verificamos que sea realmente una imagen
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona un archivo de imagen válido.');
            return;
        }

        // Verificamos que no sea muy grande (máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB en bytes
        if (file.size > maxSize) {
            alert('La imagen es muy grande. Por favor selecciona una imagen menor a 5MB.');
            return;
        }

        // Convertimos la imagen a base64 (texto) para poder guardarla
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target?.result as string;
            this.selectedPhoto = base64; // Guardamos la foto
            this.showPhotoPreview(base64); // Mostramos la vista previa
            this.updatePhotoIcon(true); // Marcamos el ícono como activo
            this.updatePublishButton(); // Actualizamos el botón
            console.log("Foto convertida a base64 y almacenada");
        };

        reader.onerror = () => {
            console.error("Error al leer el archivo");
            alert('Error al procesar la imagen. Por favor intenta de nuevo.');
        };

        reader.readAsDataURL(file); // Iniciamos la conversión
    }

    // Esta función muestra la vista previa de la foto seleccionada
    showPhotoPreview(base64: string) {
        const photoContainer = this.shadow.querySelector('#photo-container') as HTMLElement;
        const photoPreview = this.shadow.querySelector('#photo-preview') as HTMLImageElement;

        if (photoContainer && photoPreview) {
            photoPreview.src = base64; // Ponemos la imagen
            photoContainer.style.display = 'block'; // Mostramos el contenedor
            console.log("Vista previa de foto mostrada");
        }
    }

    // Esta función quita la foto seleccionada
    removePhoto() {
        console.log("Quitando foto seleccionada");
        
        this.selectedPhoto = undefined; // Borramos la foto guardada
        
        const photoContainer = this.shadow.querySelector('#photo-container') as HTMLElement;
        const fileInput = this.shadow.querySelector('#file-input') as HTMLInputElement;
        
        if (photoContainer) {
            photoContainer.style.display = 'none'; // Ocultamos la vista previa
        }
        
        if (fileInput) {
            fileInput.value = ''; // Limpiamos el input de archivo
        }
        
        this.updatePhotoIcon(false); // Desactivamos el ícono
        this.updatePublishButton(); // Actualizamos el botón
    }

    // Esta función cambia la apariencia del ícono de foto
    updatePhotoIcon(hasPhoto: boolean) {
        const photoIcon = this.shadow.querySelector('#photo-icon');
        if (photoIcon) {
            if (hasPhoto) {
                photoIcon.classList.add('active'); // Lo marcamos como activo (verde)
            } else {
                photoIcon.classList.remove('active'); // Lo volvemos gris
            }
        }
    }

    // Esta función muestra un mensaje de éxito cuando se publica
    showSuccessMessage() {
        // Creamos un elemento de notificación
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #16a34a;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        // Mensaje diferente si tiene foto o no
        toast.textContent = this.selectedPhoto ? '🎉📸 ¡Reseña con foto publicada!' : '🎉 ¡Reseña publicada con éxito!';
        
        document.body.appendChild(toast); // Lo añadimos a la página
        
        // Animación de entrada (viene desde la derecha)
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);
        
        // Animación de salida y eliminación después de 3 segundos
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // Esta función verifica si el botón de publicar debe estar habilitado
    updatePublishButton() {
        const publicar = this.shadow.querySelector('#publicar') as HTMLButtonElement;
        const textarea = this.shadow.querySelector('textarea') as HTMLTextAreaElement;
        
        if (publicar && textarea) {
            // Verificamos que tenga: texto, estrellas y zona
            const hasText = textarea.value.trim().length > 0;
            const hasStars = this.selectedStars > 0;
            const hasZone = this.selectedZone !== "";
            
            // Solo habilitamos el botón si tiene las 3 cosas
            publicar.disabled = !(hasText && hasStars && hasZone);
        }
    }

    // Esta función pone una foto de perfil aleatoria
    updateProfilePicture() {
        const profilePic = this.shadow.querySelector('#profile-pic') as HTMLImageElement;
        if (profilePic) {
            const gender = Math.random() > 0.5 ? 'men' : 'women'; // Género aleatorio
            const randomId = Math.floor(Math.random() * 100); // ID aleatorio
            profilePic.src = `https://randomuser.me/api/portraits/thumb/${gender}/${randomId}.jpg`;
        }
    }

    // Esta función limpia todo el formulario (lo deja como al principio)
    resetComponentState() {
        console.log("Reiniciando estado del componente");
        
        const textarea = this.shadow.querySelector('textarea') as HTMLTextAreaElement;
        const estrellas = this.shadow.querySelectorAll('.star-outline');
        const zoneSelect = this.shadow.querySelector('#zone-select') as HTMLSelectElement;

        // Limpiamos el texto
        if (textarea) {
            textarea.value = '';
        }

        // Limpiamos las estrellas
        this.selectedStars = 0;
        estrellas.forEach((estrella) => {
            estrella.textContent = '☆'; // Todas vacías
            estrella.classList.remove('active');
        });

        // Limpiamos la zona
        this.selectedZone = "";
        if (zoneSelect) {
            zoneSelect.value = "";
        }

        // Limpiamos la foto
        this.removePhoto();

        // Ponemos nueva foto de perfil
        this.updateProfilePicture();
        // Actualizamos el botón (quedará deshabilitado)
        this.updatePublishButton();
    }
}

// Registramos el componente para poder usarlo en HTML como <lulada-antojar>
if (!customElements.get('lulada-antojar')) {
    console.log("Registrando componente LuladaAntojar");
    customElements.define('lulada-antojar', LuladaAntojar);
} else {
    console.log("Componente LuladaAntojar ya está registrado");
}