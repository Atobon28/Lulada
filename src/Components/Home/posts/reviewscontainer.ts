import './publications';
import './reviews';
import PublicationsService, { Publication } from '../../../Services/PublicationsService';

export class ReviewsContainer extends HTMLElement {
   // Reseñas que vienen incluidas por defecto
   staticReviews: Publication[] = [
       {
           username: "CrisTiJauregui",
           text: "El coctel de hierva buena en @BarBurguer esta super delicioso para los amantes como yo de los sabores frescos, costo 20.000 y lo recomiendo 100%",
           stars: 5,
           restaurant: "BarBurguer",
           location: "centro",
           timestamp: Date.now() - 86400000
       },
       {
           username: "DanaBanana",
           text: "Este @AsianRooftop es terrible! No le quito todas las estrellas porque la mesera era super atenta, el problema es que la cocina, terrible, pedi una margarita y era sin licor me dijeron que venia aparte, como es posible???? De nunca volver.",
           stars: 1,
           hasImage: true,
           restaurant: "AsianRooftop",
           location: "norte",
           timestamp: Date.now() - 172800000
       },
       {
           username: "FoodLover",
           text: "La pasta en @Frenchrico es increíble! Los mejores sabores italianos que he probado en mucho tiempo.",
           stars: 4,
           restaurant: "Frenchrico",
           location: "sur",
           timestamp: Date.now() - 259200000
       },
       {
           username: "GourmetCali",
           text: "El sushi en @SushiLab es exquisito, especialmente el rollo Dragon. Altamente recomendado para los amantes del sushi.",
           stars: 5,
           restaurant: "SushiLab",
           location: "oeste",
           timestamp: Date.now() - 345600000
       },
       {
           username: "CafeAddict",
           text: "El brunch en @MoraCafé me pareció muy completo. Café refill, huevos al gusto y pan artesanal por 35.000. Súper plan de domingo.",
           stars: 4,
           restaurant: "MoraCafé",
           location: "centro",
           timestamp: Date.now() - 432000000
       }
   ];

   locationFilter: string | null = null;
   publicationsService: PublicationsService;

   constructor() {
       super();
       this.attachShadow({ mode: 'open' });
       this.publicationsService = PublicationsService.getInstance();
       this.setupEventListeners();
       this.render();
   }

   setupEventListeners() {
       // Escuchar cambios en filtro de ubicación
       document.addEventListener('location-filter-changed', (e: Event) => {
           const event = e as CustomEvent;
           this.updateLocationFilter(event.detail);
       });

       document.addEventListener('location-changed', (e: Event) => {
           const event = e as CustomEvent;
           this.updateLocationFilter(event.detail);
       });

       // Escuchar eventos de publicaciones
       document.addEventListener('nueva-publicacion', () => {
           this.render();
       });

       document.addEventListener('publicacion-actualizada', () => {
           this.render();
       });

       document.addEventListener('publicacion-eliminada', () => {
           this.render();
       });
   }

   updateLocationFilter(location: string) {
       this.locationFilter = location === 'cali' ? null : location;
       this.render();
   }

   // Obtiene todas las reseñas (estáticas + dinámicas)
   getAllReviews(): Publication[] {
       const dynamicPublications = this.publicationsService.getPublications();
       
       const allReviews = [
           ...dynamicPublications,
           ...this.staticReviews
       ];

       // Ordenar por fecha: más recientes primero
       return allReviews.sort((a, b) => {
           const timestampA = a.timestamp || 0;
           const timestampB = b.timestamp || 0;
           return timestampB - timestampA;
       });
   }

   // Filtra reseñas según la zona seleccionada
   getFilteredReviews(): Publication[] {
       const allReviews = this.getAllReviews();
       
       if (!this.locationFilter || this.locationFilter === 'cali') {
           return allReviews;
       }
       
       const filtered = allReviews.filter(review => review.location === this.locationFilter);
       return filtered;
   }

   searchReviews(query: string): Publication[] {
       return this.publicationsService.searchByRestaurant(query);
   }

   getLocationStats() {
       const allReviews = this.getAllReviews();
       const stats: { [key: string]: number } = {
           centro: 0,
           norte: 0,
           sur: 0,
           oeste: 0
       };

       allReviews.forEach(review => {
           if (Object.prototype.hasOwnProperty.call(stats, review.location)) {
               stats[review.location]++;
           }
       });

       return {
           byZone: stats,
           total: allReviews.length
       };
   }

   // Función principal que renderiza el contenido
   render() {
       if (!this.shadowRoot) return;

       const filteredReviews = this.getFilteredReviews();
       const stats = this.getLocationStats();
       let reviewsHTML = '';
           
       filteredReviews.forEach(review => {
           // Marcar como nueva si fue creada en los últimos 10 segundos
           const isNew = review.timestamp && (Date.now() - review.timestamp) < 10000;
           const imageUrlAttr = review.imageUrl ? `image-url="${review.imageUrl}"` : '';
           
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

       this.shadowRoot.innerHTML = `
           <style>
               :host {
                   display: block;
                   max-width: 650px;
                   margin: 0 auto;
                   padding: 16px;
                   background-color: rgb(255, 255, 255);
               }

               lulada-publication {
                   display: block;
                   width: 100%;
                   margin-bottom: 20px;
               }

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

               @keyframes fadeIn {
                   from { opacity: 0; transform: translateY(20px); }
                   to { opacity: 1; transform: translateY(0); }
               }

               .new-publication {
                   border: 2px solid #4CAF50 !important;
                   animation: fadeIn 0.5s ease-in;
               }

               @keyframes photoGlow {
                   0%, 100% { box-shadow: 0 4px 12px rgba(170, 171, 84, 0.3); }
                   50% { box-shadow: 0 8px 20px rgba(170, 171, 84, 0.5); }
               }

               .with-photo {
                   animation: photoGlow 2s ease-in-out;
                   border-left: 4px solid #AAAB54;
               }

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

               /* Responsive */
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
       
       // Agregar efectos especiales a publicaciones con fotos
       setTimeout(() => {
           this.addPhotoIndicators();
       }, 100);
   }

   private getPhotosCount(reviews: Publication[]): number {
       return reviews.filter(review => review.hasImage && review.imageUrl).length;
   }

   private addPhotoIndicators(): void {
       if (!this.shadowRoot) return;

       const publications = this.shadowRoot.querySelectorAll('lulada-publication');
       publications.forEach(pub => {
           const hasImageUrl = pub.hasAttribute('image-url');
           if (hasImageUrl) {
               pub.classList.add('with-photo');
               
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

   // Métodos públicos
   public filterByLocation(location: string) {
       this.updateLocationFilter(location);
   }

   public getStats() {
       return this.getLocationStats();
   }

   public exportReviews(): string {
       return this.publicationsService.exportPublications();
   }

   public clearAllReviews() {
       this.publicationsService.clearPublications();
       this.render();
   }

   public getUniqueLocations(): Array<{name: string, count: number}> {
       const allReviews = this.getAllReviews();
       const locationMap = new Map<string, number>();

       allReviews.forEach(review => {
           const current = locationMap.get(review.location) || 0;
           locationMap.set(review.location, current + 1);
       });

       return Array.from(locationMap.entries()).map(([name, count]) => ({
           name,
           count
       }));
   }

   public getPhotoStats(): {
       totalReviews: number,
       reviewsWithPhotos: number,
       percentage: number,
       storageInfo: ReturnType<PublicationsService['getStorageInfo']>
   } {
       const allReviews = this.getAllReviews();
       const reviewsWithPhotos = this.getPhotosCount(allReviews);
       
       return {
           totalReviews: allReviews.length,
           reviewsWithPhotos,
           percentage: allReviews.length > 0 ? (reviewsWithPhotos / allReviews.length) * 100 : 0,
           storageInfo: this.publicationsService.getStorageInfo()
       };
   }

   public clearPhotosOnly(): void {
       this.publicationsService.clearPhotosOnly();
       this.render();
   }

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