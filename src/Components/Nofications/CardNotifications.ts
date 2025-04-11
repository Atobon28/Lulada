export class CardNotifications extends HTMLElement {

  repost: {
      username: string;
    }[] = [
      {
        username: "DanaBanana",
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
    text: "@BarBurguer es delicioso! El mejor martini de la ciudad, el ambiente es increíble, nunca pensé tomar cocteles con hamburguesas y la verdad me arrepiento de no haber probado esto antes.",
    stars: 5,
    restaurant: "BarBurguer",
    location: "centro",
    hasImage: true,
  },
  {
    username: "CrisTiJauregui",
    text: "El coctel de hierva buena en @BarBurguer esta super delicioso para los amantes como yo de los sabores frescos, costo 20.000 y lo recomiendo 100%",
    stars: 5,
    restaurant: "BarBurguer",
    location: "centro",
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

  this.reviews.forEach((review, index) => {
    if (index < 2) { // Only show the first two notifications to match the image
      notificationsHTML += /*html*/ `
            <div class="notification-card">
              <div class="notification-header">
                <div class="profile">
                    <img src="https://randomuser.me/api/portraits/thumb/men/${Math.floor(Math.random() * 100)}.jpg" alt="Profile" class="profile-img">
                </div>
                <p class="username">@${this.repost[contador].username}</p>
                <p class="like-text">le dio like a tu post</p>
              </div>
              <div class="publication-container">
                <div class="publication-header">
                  <div class="author-profile">
                    <img src="https://randomuser.me/api/portraits/thumb/men/${Math.floor(Math.random() * 100) + 20}.jpg" alt="Author" class="profile-img">
                  </div>
                  <p class="author-username">@${review.username}</p>
                </div>
                <p class="review-text">${review.text}</p>
                ${review.hasImage ? `<div class="review-image">
                  <img src="https://images.unsplash.com/photo-1575650772417-e6b418b0d106?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Martini" class="post-image">
                </div>` : ''}
              </div>
            </div>
        `;
        contador++;
    }
  });

  if (this.shadowRoot) {
    this.shadowRoot.innerHTML = /*html*/ `
              <style>
                :host {
                  display: block;
                  font-family: Arial, sans-serif;
                  --card-radius: 12px;
                  --card-padding: 16px;
                  --card-margin: 16px;
                  --pale-olive: #a4a859;
                }
                
                .notification-card {
                  display: flex;
                  flex-direction: column;
                  border: 1px solid #f0f0f0;
                  border-radius: var(--card-radius);
                  margin-bottom: var(--card-margin);
                  background-color: #fff;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
                  overflow: hidden;
                }
                
                .notification-header {
                  display: flex;
                  align-items: center;
                  padding: 12px var(--card-padding);
                  background-color: #f9f9f9;
                }
                
                .profile {
                  width: 30px;
                  height: 30px;
                  border-radius: 50%;
                  overflow: hidden;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                
                .author-profile {
                  width: 30px;
                  height: 30px;
                  border-radius: 50%;
                  overflow: hidden;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                
                .profile-img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }
                
                .username {
                  font-size: 14px;
                  margin: 0 5px 0 8px;
                  color: #333;
                  font-weight: normal;
                }
                
                .author-username {
                  font-size: 14px;
                  margin: 0 0 0 8px;
                  color: #333;
                  font-weight: bold;
                }
                
                .like-text {
                  font-size: 14px;
                  margin: 0;
                  color: #666;
                  font-weight: normal;
                }
                
                .publication-container {
                  padding: var(--card-padding);
                  background-color: white;
                  border-radius: 8px;
                  margin: 0 var(--card-padding) var(--card-padding);
                  border: 1px solid #f0f0f0;
                  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                
                .publication-header {
                  display: flex;
                  align-items: center;
                  margin-bottom: 12px;
                }
                
                .review-text {
                  font-size: 14px;
                  line-height: 1.4;
                  color: #333;
                  margin: 0 0 12px 0;
                }
                
                .review-image {
                  width: 100%;
                  margin-top: 10px;
                  border-radius: 8px;
                  overflow: hidden;
                }
                
                .post-image {
                  width: 100%;
                  display: block;
                }
                
                .no-reviews {
                  padding: 40px;
                  text-align: center;
                  color: #666;
                  font-style: italic;
                  background-color: #f9f9f9;
                  border-radius: 8px;
                  margin-top: 20px;
                }
              </style>
              <div class="notifications-container">
                ${this.reviews.length > 0 ? notificationsHTML : '<div class="no-reviews">No hay notificaciones para mostrar</div>'}
              </div>
          `;
  }
}
}

export default CardNotifications;