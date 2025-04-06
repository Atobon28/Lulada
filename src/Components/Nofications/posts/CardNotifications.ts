import "./publicationsnotifications";

export class CardNotifications extends HTMLElement {

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
                    .notification-card {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        gap: 8px;
                        border: 1px solid #ccc;
                        border-radius: 16px;
                        padding: 24px 24px 10px 24px;
                        margin: 0px 0px 16px 0px;
                        background-color: #fff;
                    }
                    .notification-header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 8px;
                    }
                    .profile {
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        background-color: #ccc;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 24px;
                        color: white;
                    }
                    .notification-header {
                        font-weight: bold;
                        margin-bottom: 8px;
                    }
                    .no-reviews {
                        text-align: center;
                        padding: 20px;
                        color: #666;
                        font-style: italic;
                    }
                </style>
                ${this.reviews.length > 0 ? notificationsHTML : '<div class="no-reviews">No hay reseñas para mostrar</div>'}
            `;
    }
  }
}

customElements.define("card-notifications", CardNotifications);