// Componente que muestra las notificaciones de la app
export class CardNotifications extends HTMLElement {

  // Lista de usuarios que dieron like a las publicaciones
  repost: {
      username: string;
    }[] = [
      {
        username: "CrisTiJauregui",
      },
      {
        username: "DanaBanana",
      },
      {
        username: "FoodLover",
      },
    ];

// Lista de reseñas/publicaciones que recibieron likes
reviews: {
  username: string;
  text: string;
  stars: number;
  restaurant: string;
  location: string;
  hasImage?: boolean;
}[] = [
  {
    username: "CrisTiJauregui",
    text: "El coctel de hierva buena en @BarBurguer esta super delicioso para los amantes como yo de los sabores frescos, costo 20.000 y lo recomiendo 100%",
    stars: 5,
    restaurant: "BarBurguer",
    location: "centro",
  },
  {
    username: "DanaBanana",
    text: "Este @AsianRooftop es terrible! No le quito todas las estrellas porque la mesera era super atenta, el problema es que una margarita y el licor me dijeron que venia aparte, como es posible???? De nunca volver.",
    stars: 1,
    hasImage: true,
    restaurant: "AsianRooftop",
    location: "norte",
  },
  {
    username: "FoodLover",
    text: "La pasta en @Frenchrico es increíble! Los mejores sabores italianos que he probado en mucho tiempo.",
    stars: 4,
    restaurant: "Frenchrico",
    location: "sur",
  },
];

constructor() {
  super();
  this.attachShadow({ mode: "open" });
}

connectedCallback() {
  let notificationsHTML = "";
  let contador = 0;

  // Por cada reseña, crear una notificación
  this.reviews.forEach((review) => {
  notificationsHTML += /*html*/ `
          <div class="notification-card">
            <div class="notification-header">
              <div class="profile">
                  <span>👤</span>
              </div>
              <p class="username" style="margin-left:8px">@${this.repost[contador].username}</p>
              <p style="margin-left:5px; font-weight:normal"> le dió like a tu post</p>
            </div>
            <!-- Mostrar la publicación original que recibió el like -->
            <lulada-publication 
              username="${review.username}" 
              text="${review.text}" 
              stars="${review.stars}"
              ${review.hasImage ? 'has-image="true"' : ""}
            ></lulada-publication>
          </div>
      `;
      contador++;
  });

  if (this.shadowRoot) {
    this.shadowRoot.innerHTML = /*html*/ `
              <style>
                  :host {
                      display: block;
                      font-family: Arial, sans-serif;
                  }
                  
                  .main-layout {
                      display: flex;
                      margin-top: 10px;
                  }
                  
                  .sidebar {
                      width: 150pxpx;
                  }
                  
                  .content {
                      flex-grow: 1;
                      display: flex;
                  }
                  
                  .reviews-section {
                      padding: 90px;
                      background-color: white;
                      flex-grow: 1;
                  }
                  
                  .suggestions-section {
                      width: 150px;
                      padding: 12px 12px;
                  }
                  
                  /* Estilo de cada tarjeta de notificación */
                  .notification-card {
                      display: flex;
                      flex-direction: column;
                      border: 1px solid #f0f0f0;
                      border-radius: 16px;
                      padding: 16px;
                      margin: 0px 0px 16px 0px;
                      background-color: #fff;
                      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                  }
                  
                  /* Cabecera de cada notificación */
                  .notification-header {
                      display: flex;
                      align-items: center;
                      margin-bottom: 16px;
                  }
                  
                  .profile {
                      width: 30px;
                      height: 30px;
                      border-radius: 40%;
                      background-color: #eee;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 16px;
                      color: #888;
                  }
                  
                  .username {
                      font-size: 14px;
                      margin: 0;
                      color: #333;
                  }
                  
                  .no-content {
                      padding: 40px;
                      text-align: center;
                      color: #666;
                      font-style: italic;
                      background-color: #f9f9f9;
                      border-radius: 8px;
                      margin-top: 20px;
                  }
              </style>
              ${this.reviews.length > 0 ? notificationsHTML : '<div class="no-reviews">No hay reseñas para mostrar</div>'}
          `;
  }
}
}

export default CardNotifications;