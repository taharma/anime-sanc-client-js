document.addEventListener("DOMContentLoaded", initialize);

const images = [
  "/image/random6.jpg",
  "/image/random7.jpg",
  "/image/random8.jpg",
  "/image/random9.jpg",
  "/image/random3.jpg",
];

const categoryNames = [
  "<button class='category-button'>Anime</button>", // 1열
  "<button class='category-button'>Manga</button>", // 2열
  "<button class='category-button'>Popular Works</button>", // 3열
  "<button class='category-button'>Characters</button>", // 4열
  "<button class='category-button'>Forum</button>", // 5열
];

function createCard(image, title, description, author, date) {
  return `
    <div class="card shadow" style="position: relative;" onclick="redirectToPost()">
      <img src="${image}" class="card-img-top">
      <div class="card-body">
        <span class="badge rounded-pill bg-primary">News</span>
        <h4 class="mt-2">${title}</h4>
        <p class="card-text">${description}</p>
        <div class="card-meta">
          <p class="card-author"><strong>Author:</strong> ${author}</p>
        </div>
      </div>
      <div class="icon-container">
        <button class="icon-button heart" onclick="toggleIcon(event, this)">
          <img src="icon/heart-fill.svg">
        </button>
        <button class="icon-button bookmark" onclick="toggleIcon(event, this)">
          <img src="/icon/bookmark-plus-fill.svg">
        </button>
      </div>
    </div>
  `;
}

function toggleIcon(button) {
  button.classList.toggle("clicked");
}

function createCardRow(rowId, cards, categoryName) {
  return `
    <h3>${categoryName}</h3>
    <div class="card-wrapper" id="wrapper-${rowId}">
      <div class="card-container">
        ${cards.join("")}
      </div>
      <a class="carousel-control-next" href="javascript:void(0);" role="button" onclick="rotateCarousel(${rowId})">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
  `;
}

function rotateCarousel(rowId) {
  const container = document.querySelector(`#wrapper-${rowId} .card-container`);
  const cards = container.querySelectorAll(".card");

  cards.forEach((card) => (card.style.transform = "scale(1)"));

  const firstCard = container.querySelector(".card:first-child");
  container.appendChild(firstCard.cloneNode(true));
  container.removeChild(firstCard);

  const updatedCards = container.querySelectorAll(".card");
  updatedCards[2].style.transform = "scale(1.1)";
}

function initialize() {
  const cardRows = [];
  for (let i = 0; i < categoryNames.length; i++) {
    const cards = [];
    for (let j = 0; j < 5; j++) {
      cards.push(
        createCard(
          images[j],
          `Blog Post ${j + 1}`,
          `これはテスト用のテキストです。`,
          `Author ${j + 1}`
        )
      );
    }
    cardRows.push(createCardRow(i, cards, categoryNames[i]));
  }
  document.getElementById("card-rows").innerHTML = cardRows.join("");

  for (let i = 0; i < categoryNames.length; i++) {
    const container = document.querySelector(`#wrapper-${i} .card-container`);
    const cards = container.querySelectorAll(".card");
    cards[2].style.transform = "scale(1.1)";
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

function toggleIcon(event, button) {
  event.stopPropagation(); // 부모 요소의 클릭 이벤트가 실행되지 않도록 방지
  button.classList.toggle("clicked");
}

function redirectToPost() {
  window.location.href = "post.html";
}
