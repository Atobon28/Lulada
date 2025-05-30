import './publications';
import './reviews';
import PublicationsService, { Publication } from '../../../Services/PublicationsService';

export class ReviewsContainer extends HTMLElement {
   // Reseñas que vienen incluidas por defecto con la aplicación
   // Estas son las publicaciones de ejemplo que siempre aparecerán
   staticReviews: Publication[] = [
       {
           username: "CrisTiJauregui",
           text: "El coctel de hierva buena en @BarBurguer esta super delicioso para los amantes como yo de los sabores frescos, costo 20.000 y lo recomiendo 100%",
           stars: 5,
           restaurant: "BarBurguer",
           location: "centro",
           timestamp: Date.now() - 86400000 // Hace 1 día
       },
       {
           username: "DanaBanana",
           text: "Este @AsianRooftop es terrible! No le quito todas las estrellas porque la mesera era super atenta, el problema es que la cocina, terrible, pedi una margarita y era sin licor me dijeron que venia aparte, como es posible???? De nunca volver.",
           stars: 1,
           hasImage: true, // Esta reseña tiene imagen
           restaurant: "AsianRooftop",
           location: "norte",
           timestamp: Date.now() - 172800000 // Hace 2 días
       },
       {
           username: "FoodLover",
           text: "La pasta en @Frenchrico es increíble! Los mejores sabores italianos que he probado en mucho tiempo.",
           stars: 4,
           restaurant: "Frenchrico",
           location: "sur",
           timestamp: Date.now() - 259200000 // Hace 3 días
       },
       {
           username: "GourmetCali",
           text: "El sushi en @SushiLab es exquisito, especialmente el rollo Dragon. Altamente recomendado para los amantes del sushi.",
           stars: 5,
           restaurant: "SushiLab",
           location: "oeste",
           timestamp: Date.now() - 345600000 // Hace 4 días
       },
       {
           username: "CafeAddict",
           text: "El brunch en @MoraCafé me pareció muy completo. Café refill, huevos al gusto y pan artesanal por 35.000. Súper plan de domingo.",
           stars: 4,
           restaurant: "MoraCafé",
           location: "centro",
           timestamp: Date.now() - 432000000 // Hace 5 días
       }
   ];

   // Variable para saber qué zona está seleccionada (centro, norte, sur, oeste, o todas)
   locationFilter: string | null = null;
   // Servicio que maneja las publicaciones nuevas que crean los usuarios
   publicationsService: PublicationsService;

   constructor() {
       super();
       // Crear el contenedor con shadow DOM para aislar los estilos
       this.attachShadow({ mode: 'open' });
       // Obtener la instancia del servicio de publicaciones
       this.publicationsService = PublicationsService.getInstance();
       // Configurar los eventos que escuchará este componente
       this.setupEventListeners();
       // Dibujar el componente en la pantalla
       this.render();
   }

   setupEventListeners() {
       // Escuchar cuando el usuario cambie el filtro de ubicación (centro, norte, sur, oeste)
       document.addEventListener('location-filter-changed', (e: Event) => {
           const event = e as CustomEvent;
           this.updateLocationFilter(event.detail);
       });

       // Otra forma de escuchar el mismo evento (para compatibilidad)
       document.addEventListener('location-changed', (e: Event) => {
           const event = e as CustomEvent;
           this.updateLocationFilter(event.detail);
       });

       // Escuchar cuando se cree una nueva publicación
       document.addEventListener('nueva-publicacion', () => {
           console.log(' Nueva publicación detectada, actualizando reviews...');
           this.render(); // Volver a dibujar para mostrar la nueva publicación
       });

       // Escuchar cuando se actualice una publicación existente
       document.addEventListener('publicacion-actualizada', () => {
           this.render();
       });

       // Escuchar cuando se elimine una publicación
       document.addEventListener('publicacion-eliminada', () => {
           this.render();
       });
   }

   // Función que se ejecuta cuando el usuario cambia el filtro de zona
   updateLocationFilter(location: string) {
       console.log(' ReviewsContainer: Actualizando filtro de ubicación a:', location);
       
       // Si selecciona 'cali', mostrar todas las zonas (sin filtro)
       this.locationFilter = location === 'cali' ? null : location;
       // Volver a dibujar con el nuevo filtro aplicado
       this.render();
       
       console.log(' Filtro aplicado:', this.locationFilter || 'todos');
   }

   // Función que obtiene TODAS las reseñas (las fijas + las nuevas que crean los usuarios)
   getAllReviews(): Publication[] {
       // Obtener las publicaciones que han creado los usuarios
       const dynamicPublications = this.publicationsService.getPublications();
       
       // Combinar las publicaciones de los usuarios con las que vienen por defecto
       const allReviews = [
           ...dynamicPublications, // Primero las nuevas (para que aparezcan arriba)
           ...this.staticReviews   // Después las que vienen incluidas
       ];

       // Ordenar todas por fecha: las más recientes primero
       return allReviews.sort((a, b) => {
           const timestampA = a.timestamp || 0;
           const timestampB = b.timestamp || 0;
           return timestampB - timestampA; // Orden descendente (newest first)
       });
   }

   // Función que filtra las reseñas según la zona seleccionada
   getFilteredReviews(): Publication[] {
       const allReviews = this.getAllReviews();
       
       // Si no hay filtro activo o es 'cali', mostrar todas las reseñas
       if (!this.locationFilter || this.locationFilter === 'cali') {
           console.log(' Mostrando todas las reseñas:', allReviews.length);
           return allReviews;
       }
       
       // Si hay filtro, solo mostrar las reseñas de esa zona específica
       const filtered = allReviews.filter(review => review.location === this.locationFilter);
       console.log(` Reseñas filtradas para ${this.locationFilter}:`, filtered.length);
       return filtered;
   }

   // Función para buscar reseñas por nombre de restaurante
   searchReviews(query: string): Publication[] {
       return this.publicationsService.searchByRestaurant(query);
   }

   // Función que cuenta cuántas reseñas hay en cada zona
   getLocationStats() {
       const allReviews = this.getAllReviews();
       // Objeto para contar reseñas por zona
       const stats: { [key: string]: number } = {
           centro: 0,
           norte: 0,
           sur: 0,
           oeste: 0
       };

       // Contar cuántas reseñas hay en cada zona
       allReviews.forEach(review => {
           if (Object.prototype.hasOwnProperty.call(stats, review.location)) {
               stats[review.location]++;
           }
       });

       return {
           byZone: stats,        // Conteo por zona
           total: allReviews.length  // Total de reseñas
       };
   }

   // Función principal que dibuja todo el contenido en la pantalla
   render() {
       if (!this.shadowRoot) return;

       // Obtener las reseñas que se van a mostrar (ya filtradas)
       const filteredReviews = this.getFilteredReviews();
       // Obtener estadísticas para mostrar información adicional
       const stats = this.getLocationStats();
       let reviewsHTML = '';
           
       // Crear el HTML para cada reseña
       filteredReviews.forEach(review => {
           // Marcar como "nueva" si fue creada en los últimos 10 segundos
           const isNew = review.timestamp && (Date.now() - review.timestamp) < 10000;
           
           // Si la reseña tiene imagen, preparar el atributo para pasárselo al componente
           const imageUrlAttr = review.imageUrl ? `image-url="${review.imageUrl}"` : '';
           
           // Crear el HTML de cada publicación
           reviewsHTML += `
               <lulada-publication 
                   username="${review.username}" 
                   text="${review.text}" 
                   stars="${review.stars}"
                   ${review.hasImage ? 'has-image="true"' : ''}
                   ${imageUrlAttr}
                   ${isNew ? 'style="border: 2px solid #4CAF50; animation: fadeIn 0.5s ease-in;"' : ''}
               ></lulada-publication>
           `;
       });

       // Crear todo el HTML del componente con estilos incluidos
       this.shadowRoot.innerHTML = `
           <style>
               /* Estilos del contenedor principal */
               :host {
                   display: block;
                   max-width: 650px;
                   margin: 0 auto;
                   padding: 16px;
                   background-color: rgb(255, 255, 255);
               }

               /* Estilos para cada publicación */
               lulada-publication {
                   display: block;
                   width: 100%;
                   margin-bottom: 20px;
               }

               /* Estilos para el mensaje que aparece cuando hay filtro activo */
               .filter-info {
                   text-align: center;
                   padding: 12px;
                   margin-bottom: 20px;
                   background: linear-gradient(135deg, rgba(170, 171, 84, 0.1), rgba(170, 171, 84, 0.05));
                   border: 1px solid rgba(170, 171, 84, 0.2);
                   border-radius: 10px;
                   color: #666;
                   font-size: 14px;
                   position: relative;
               }

               /* Línea verde a la izquierda del mensaje de filtro */
               .filter-info::before {
                   content: '';
                   position: absolute;
                   top: 0;
                   left: 0;
                   width: 4px;
                   height: 100%;
                   background: #AAAB54;
                   border-radius: 10px 0 0 10px;
               }

               .filter-title {
                   font-weight: bold;
                   color: #AAAB54;
                   margin-bottom: 4px;
               }

               .filter-stats {
                   font-size: 12px;
                   color: #888;
                   margin-top: 6px;
               }

               /* Estilos para cuando no hay reseñas que mostrar */
               .no-reviews {
                   text-align: center;
                   padding: 40px 24px;
                   color: #666;
                   font-style: italic;
                   background: white;
                   border-radius: 20px;
                   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                   font-size: 16px;
                   line-height: 1.5;
                   border: 2px dashed #ddd;
               }

               .no-reviews-icon {
                   font-size: 48px;
                   margin-bottom: 16px;
                   opacity: 0.5;
               }

               /* Indicador pequeño para publicaciones que tienen foto */
               .photo-indicator {
                   display: inline-flex;
                   align-items: center;
                   gap: 4px;
                   background: linear-gradient(135deg, #AAAB54, #999A4A);
                   color: white;
                   padding: 4px 8px;
                   border-radius: 12px;
                   font-size: 11px;
                   font-weight: bold;
                   margin-left: 8px;
               }

               /* Animación para publicaciones nuevas */
               @keyframes fadeIn {
                   from { opacity: 0; transform: translateY(20px); }
                   to { opacity: 1; transform: translateY(0); }
               }

               .new-publication {
                   border: 2px solid #4CAF50 !important;
                   animation: fadeIn 0.5s ease-in;
               }

               /* Animación especial para publicaciones con foto */
               @keyframes photoGlow {
                   0%, 100% { box-shadow: 0 4px 12px rgba(170, 171, 84, 0.3); }
                   50% { box-shadow: 0 8px 20px rgba(170, 171, 84, 0.5); }
               }

               .with-photo {
                   animation: photoGlow 2s ease-in-out;
                   border-left: 4px solid #AAAB54;
               }

               /* Caja con información sobre las fotos */
               .stats-info {
                   background: #f8f9fa;
                   padding: 12px;
                   border-radius: 8px;
                   margin-bottom: 16px;
                   text-align: center;
                   font-size: 13px;
                   color: #666;
               }

               .stats-photos {
                   color: #AAAB54;
                   font-weight: bold;
               }

               /* Estilos para dispositivos móviles */
               @media (max-width: 768px) {
                   :host {
                       padding: 12px;
                   }
                   
                   .filter-info {
                       font-size: 13px;
                       padding: 10px;
                   }
                   
                   .no-reviews {
                       padding: 30px 20px;
                       font-size: 15px;
                   }

                   .no-reviews-icon {
                       font-size: 36px;
                       margin-bottom: 12px;
                   }

                   .stats-info {
                       font-size: 12px;
                       padding: 10px;
                   }
               }
           </style>
           
           ${this.locationFilter ? `
               <div class="filter-info">
                   <div class="filter-title"> Filtro activo</div>
                   <div>Mostrando reseñas de: <strong>${this.locationFilter.charAt(0).toUpperCase() + this.locationFilter.slice(1)}</strong></div>
                   <div class="filter-stats">
                       ${filteredReviews.length} de ${stats.total} reseñas
                       ${this.getPhotosCount(filteredReviews) > 0 ? `<span class="stats-photos"> ${this.getPhotosCount(filteredReviews)} con fotos</span>` : ''}
                   </div>
               </div>
           ` : this.getPhotosCount(filteredReviews) > 0 ? `
               <div class="stats-info">
                    <span class="stats-photos">${this.getPhotosCount(filteredReviews)}</span> de ${filteredReviews.length} reseñas incluyen fotos
               </div>
           ` : ''}
           
           ${filteredReviews.length > 0 ? 
               reviewsHTML : 
               `<div class="no-reviews">
                   <div class="no-reviews-icon"></div>
                   ${this.locationFilter ? 
                       `No hay reseñas para <strong>${this.locationFilter}</strong>.<br>¡Sé el primero en compartir tu experiencia en esta zona!` :
                       'No hay reseñas disponibles.<br>¡Sé el primero en compartir tu experiencia!'
                   }
               </div>`
           }
       `;

       console.log(` Renderizadas ${filteredReviews.length} reseñas para ubicación: ${this.locationFilter || 'todas'}`);
       
       // Después de dibujar, agregar efectos especiales a las publicaciones con fotos
       setTimeout(() => {
           this.addPhotoIndicators();
       }, 100);
   }

   // Función que cuenta cuántas publicaciones tienen fotos
   private getPhotosCount(reviews: Publication[]): number {
       return reviews.filter(review => review.hasImage && review.imageUrl).length;
   }

   // Función que agrega efectos visuales especiales a las publicaciones que tienen fotos
   private addPhotoIndicators(): void {
       if (!this.shadowRoot) return;

       // Buscar todas las publicaciones en la pantalla
       const publications = this.shadowRoot.querySelectorAll('lulada-publication');
       publications.forEach(pub => {
           // Si la publicación tiene foto, agregarle efectos especiales
           const hasImageUrl = pub.hasAttribute('image-url');
           if (hasImageUrl) {
               pub.classList.add('with-photo'); // Clase CSS para efectos especiales
               
               // Agregar un pequeño indicador visual en el header
               setTimeout(() => {
                   const header = pub.shadowRoot?.querySelector('.header');
                   
                   if (header && !header.querySelector('.photo-indicator')) {
                       const indicator = document.createElement('span');
                       indicator.className = 'photo-indicator';
                       header.appendChild(indicator);
                   }
               }, 50);
           }
       });
   }

   // Métodos públicos que pueden ser llamados desde fuera del componente

   // Filtrar publicaciones por ubicación desde fuera
   public filterByLocation(location: string) {
       this.updateLocationFilter(location);
   }

   // Obtener estadísticas desde fuera
   public getStats() {
       return this.getLocationStats();
   }

   // Exportar todas las reseñas a un formato de texto
   public exportReviews(): string {
       return this.publicationsService.exportPublications();
   }

   // Borrar todas las reseñas creadas por usuarios (no las que vienen por defecto)
   public clearAllReviews() {
       this.publicationsService.clearPublications();
       this.render();
   }

   // Obtener una lista de todas las ubicaciones que tienen reseñas y cuántas hay en cada una
   public getUniqueLocations(): Array<{name: string, count: number}> {
       const allReviews = this.getAllReviews();
       const locationMap = new Map<string, number>();

       // Contar reseñas por ubicación
       allReviews.forEach(review => {
           const current = locationMap.get(review.location) || 0;
           locationMap.set(review.location, current + 1);
       });

       // Convertir a array con formato { name: "centro", count: 5 }
       return Array.from(locationMap.entries()).map(([name, count]) => ({
           name,
           count
       }));
   }

   // MÉTODOS RELACIONADOS CON LAS FOTOS
   
   // Obtener estadísticas detalladas sobre las fotos en las publicaciones
   public getPhotoStats(): {
       totalReviews: number,
       reviewsWithPhotos: number,
       percentage: number,
       storageInfo: ReturnType<PublicationsService['getStorageInfo']>
   } {
       const allReviews = this.getAllReviews();
       const reviewsWithPhotos = this.getPhotosCount(allReviews);
       
       return {
           totalReviews: allReviews.length,                    // Total de reseñas
           reviewsWithPhotos,                                  // Cuántas tienen foto
           percentage: allReviews.length > 0 ? (reviewsWithPhotos / allReviews.length) * 100 : 0, // Porcentaje
           storageInfo: this.publicationsService.getStorageInfo() // Info del almacenamiento
       };
   }

   // Eliminar solo las fotos pero mantener el texto de las reseñas
   public clearPhotosOnly(): void {
       this.publicationsService.clearPhotosOnly();
       this.render();
       console.log(' Fotos eliminadas, manteniendo texto de reseñas');
   }

   // Función para desarrolladores: mostrar información de debug sobre las fotos
   public debugPhotos(): void {
       console.log(' ReviewsContainer: Debug de fotos');
       const stats = this.getPhotoStats();
       console.log('- Estadísticas:', stats);
       
       const filteredReviews = this.getFilteredReviews();
       console.log('- Reseñas con fotos en vista actual:');
       filteredReviews.forEach((review, index) => {
           if (review.hasImage && review.imageUrl) {
               console.log(`  ${index}: @${review.username} - ${review.imageUrl.substring(0, 50)}...`);
           }
       });
   }
}

export default ReviewsContainer;