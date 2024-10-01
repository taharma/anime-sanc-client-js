document.addEventListener("DOMContentLoaded", function() {
  checkLoginStatus(); // 페이지 로드 시 로그인 상태 확인
  initialize(); // 초기화 함수 호출
});

const images = [
  "/image/random6.jpg",
  "/image/random7.jpg",
  "/image/random8.jpg",
  "/image/random9.jpg",
  "/image/random3.jpg",
];

const categories = {
  anime: 'アニメ',
  manga: '漫画',
  popular: '人気作品',
  character: 'キャラクター',
  forum: 'フォーラム'
};

let currentCategory = 'anime'; // 기본 카테고리 설정
let posts = [];
const currentIndexes = Array(Object.keys(categories).length).fill(0);

// 서버에서 게시물 데이터를 가져오는 함수
async function fetchPosts(category) {
  try {
    const response = await fetch(`http://localhost:9000/api/notes?category=${category}`); // 카테고리 필터링 적용
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    posts = await response.json();
    console.log("Fetched posts:", posts);
    displayPosts();
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

// 게시물 데이터를 카드로 표시하는 함수 수정
function displayPosts() {
  const cardRows = [];
  for (let i = 0; i < 5; i++) { // 5개의 열을 생성
    const cards = [];
    for (let j = 0; j < 6; j++) { // 각 열마다 6개의 카드 표시
      const index = (currentIndexes[0] + j) % posts.length;
      const post = posts[index];
      cards.push(
        createCard(
          images[index % images.length],
          post.title || "Default Title",
          post.contents || "Default Content",
          `Author ${index + 1}`,
          `Date ${index + 1}`,
          post.id
        )
      );
    }
    cardRows.push(`<div class="card-wrapper">${cards.join("")}</div>`);
  }

  document.getElementById("card-rows").innerHTML = cardRows.join("");
}

// 카테고리 변경 함수
function changeCategory(category) {
  currentCategory = category;
  fetchPosts(category); // 카테고리에 맞는 게시물 데이터를 가져옴
}

// 카드 요소를 생성하는 함수
function createCard(image, title, description, author, date, id) {
  return `
    <div class="card shadow" style="position: relative;" onclick="redirectToPost('${id}')">
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
        <span class="like-count">235</span>
        <button class="icon-button bookmark" onclick="toggleIcon(event, this)">
          <img src="/icon/bookmark-plus-fill.svg">
        </button>
      </div>
    </div>
  `;
}

function initialize() {
  fetchPosts(currentCategory); // 기본 카테고리의 게시물 데이터를 가져옴
}

function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    showLogoutButton();
  } else {
    showLoginAndRegisterButtons();
  }
}

function showLogoutButton() {
  const authButtons = document.getElementById("auth-buttons");
  authButtons.innerHTML = `
    <li class="nav-item">
      <a class="nav-link" href="#" id="logout-button" onclick="logout()">ログアウト</a>
    </li>
  `;
}

function showLoginAndRegisterButtons() {
  const authButtons = document.getElementById("auth-buttons");
  authButtons.innerHTML = `
    <li class="nav-item">
      <a class="nav-link" href="./login.html" id="login-button">로그인</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="./register.html" id="register-button">新規登録</a>
    </li>
  `;
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  checkLoginStatus();
}