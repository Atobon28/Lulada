// Este archivo crea un componente que muestra las notificaciones de la app
export class CardNotifications extends HTMLElement {

  // Lista de usuarios que dieron like a las publicaciones
  repost: {
      username: string; // Nombre del usuario que dio like
    }[] = [
      {
        username: "CrisTiJauregui", // Usuario 1
      },
      {
        username: "DanaBanana", // Usuario 2
      },
      {
        username: "FoodLover", // Usuario 3
      },
    ];

// Lista de reseñas/publicaciones que recibieron likes
reviews: {
  username: string;    // Quien escribió la reseña original
  text: string;        // Texto de la reseña
  stars: number;       // Calificación en estrellas (1-5)
  restaurant: string;  // Nombre del restaurante
  location: string;    // Zona de la ciudad (centro, norte, sur, oeste)
  hasImage?: boolean;  // Si la reseña tiene imagen (opcional)
}[] = [
  {
    // Primera reseña - sobre BarBurguer
    username: "CrisTiJauregui",
    text: "El coctel de hierva buena en @BarBurguer esta super delicioso para los amantes como yo de los sabores frescos, costo 20.000 y lo recomiendo 100%",
    stars: 5,
    restaurant: "BarBurguer",
    location: "centro",
  },
  {
    // Segunda reseña - sobre AsianRooftop (mala experiencia)
    username: "DanaBanana",
    text: "Este @AsianRooftop es terrible! No le quito todas las estrellas porque la mesera era super atenta, el problema es que una margarita y el licor me dijeron que venia aparte, como es posible???? De nunca volver.",
    stars: 1,
    hasImage: true, // Esta reseña incluye una imagen
    restaurant: "AsianRooftop",
    location: "norte",
  },
  {
    // Tercera reseña - sobre Frenchrico
    username: "FoodLover",
    text: "La pasta en @Frenchrico es increíble! Los mejores sabores italianos que he probado en mucho tiempo.",
    stars: 4,
    restaurant: "Frenchrico",
    location: "sur",
  },
];

constructor() {
  super(); // Llama al constructor de HTMLElement
  this.attachShadow({ mode: "open" }); // Crea un shadow DOM para aislar el CSS
}

// Se ejecuta cuando el componente se añade a la página
connectedCallback() {
  let notificationsHTML = ""; // Variable para guardar todo el HTML de las notificaciones
  let contador = 0; // Contador para saber qué usuario dio like a cada reseña

  // Por cada reseña, crear una notificación
  this.reviews.forEach((review) => {
  notificationsHTML += /*html*/ `
          <div class="notification-card">
            <div class="notification-header">
              <div class="profile">
                  <span>👤</span>
              </div>
              <!-- Mostrar quién dio like usando el contador -->
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
      contador++; // Aumentar el contador para el siguiente usuario
  });

  // Si existe el shadow DOM, insertar el HTML y CSS
  if (this.shadowRoot) {
    this.shadowRoot.innerHTML = /*html*/ `
              <style>
                /* CSS para que el componente ocupe toda la pantalla */
                :host {
                      display: block;
                      font-family: Arial, sans-serif;
                  }
                  
                  /* Diseño principal con sidebar y contenido */
                  .main-layout {
                      display: flex;
                      margin-top: 10px;
                  }
                  
                  /* Barra lateral (sidebar) */
                  .sidebar {
                      width: 150pxpx;
                  }
                  
                  /* Área de contenido principal */
                  .content {
                      flex-grow: 1;
                      display: flex;
                  }
                  
                  /* Sección donde van las notificaciones */
                  .reviews-section {
                      padding: 90px;
                      background-color: white;
                      flex-grow: 1;
                  }
                  
                  /* Sección de sugerencias */
                  .suggestions-section {
                      width: 150px;
                      padding: 12px 12px;
                  }
                  
                  /* Estilo de cada tarjeta de notificación */
                  .notification-card {
                      display: flex;
                      flex-direction: column; /* Los elementos van uno debajo del otro */
                      border: 1px solid #f0f0f0; /* Borde gris claro */
                      border-radius: 16px; /* Esquinas redondeadas */
                      padding: 16px; /* Espacio interno */
                      margin: 0px 0px 16px 0px; /* Espacio entre tarjetas */
                      background-color: #fff; /* Fondo blanco */
                      box-shadow: 0 2px 5px rgba(0,0,0,0.05); /* Sombra suave */
                  }
                  
                  /* Cabecera de cada notificación (foto de perfil + texto) */
                  .notification-header {
                      display: flex;
                      align-items: center; /* Centrar verticalmente */
                      margin-bottom: 16px; /* Espacio debajo */
                  }
                  
                  /* Foto de perfil circular */
                  .profile {
                      width: 30px;
                      height: 30px;
                      border-radius: 40%; /* Forma circular */
                      background-color: #eee; /* Fondo gris claro */
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 16px;
                      color: #888;
                  }
                  
                  /* Estilo del nombre de usuario */
                  .username {
                      font-size: 14px;
                      margin: 0;
                      color: #333;
                  }
                  
                  /* Mensaje cuando no hay contenido para mostrar */
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
              <!-- Si hay reseñas, mostrar las notificaciones, si no, mostrar mensaje de "no hay reseñas" -->
              ${this.reviews.length > 0 ? notificationsHTML : '<div class="no-reviews">No hay reseñas para mostrar</div>'}
          `;
  }
}
}

// Exportar el componente para poder usarlo en otros archivos
export default CardNotifications;