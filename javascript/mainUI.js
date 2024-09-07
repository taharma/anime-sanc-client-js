document.addEventListener("DOMContentLoaded", initialize);




const images = [
  "/image/random6.jpg",
  "/image/random7.jpg",
  "/image/random8.jpg",
  "/image/random9.jpg",
  "/image/random3.jpg",
];

const categoryNames = [
  "<button class='category-button'>Anime</button> <a href='#' class='see-all-link'>すべて見る</a>", // 1열
  "<button class='category-button'>Manga</button> <a href='#' class='see-all-link'>すべて見る</a>", // 2열
  "<button class='category-button'>Popular Works</button> <a href='#' class='see-all-link'>すべて見る</a>", // 3열
  "<button class='category-button'>Characters</button> <a href='#' class='see-all-link'>すべて見る</a>", // 4열
  "<button class='category-button'>Forum</button> <a href='#' class='see-all-link'>すべて見る</a>", // 5열
];

let posts = []; // 모든 게시물 데이터를 저장할 배열
const currentIndexes = Array(categoryNames.length).fill(0); // 각 열의 현재 인덱스를 저장하는 배열

// 서버에서 게시물 데이터를 가져오는 함수
async function fetchPosts() {
  try {
    const response = await fetch("http://localhost:9000/api/notes");
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    posts = await response.json();
    console.log("Fetched posts:", posts); // ★ 서버에서 가져온 게시물 데이터를 확인합니다.
    displayPosts(); // ★ 게시물 데이터를 화면에 표시합니다.
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}
// 게시물 데이터를 카드로 표시하는 함수
function displayPosts() {
  const cardRows = [];

  // 5개의 열을 생성하고, 각 열마다 5개의 카드를 생성
  for (let i = 0; i < categoryNames.length; i++) {
    const cards = [];
    for (let j = 0; j < 5; j++) {
      const index = (currentIndexes[i] + j) % posts.length; // 각 열에 대한 현재 인덱스에서 시작
      const post = posts[index]; // 서버에서 가져온 게시물 데이터
      cards.push(
        createCard(
          images[index % images.length], // 이미지는 순환하면서 사용
          post.title || "Default Title", // 게시물 제목 (없을 시 기본값 사용)
          post.contents || "Default Content", // 게시물 내용 (없을 시 기본값 사용)
          `Author ${index + 1}`, // 저자 이름은 임의로 설정
          `Date ${index + 1}` // 날짜는 임의로 설정
        )
      );
    }
    cardRows.push(createCardRow(i, cards, categoryNames[i]));
  }

  document.getElementById("card-rows").innerHTML = cardRows.join(""); // 모든 카드 행을 HTML에 추가

  // 각 행의 중간 카드를 강조하는 스타일 적용
  for (let i = 0; i < categoryNames.length; i++) {
    const container = document.querySelector(`#wrapper-${i} .card-container`);
    const cards = container.querySelectorAll(".card");
    if (cards[2]) {
      cards[2].style.transform = "scale(1.1)"; // 중간 카드를 강조하는 효과
    }
  }
}

// 카드 요소를 생성하는 함수
function createCard(image, title, description, author, date, id) {
  return `
    <div class="card shadow" style="position: relative;" onclick="redirectToPost('${id}')">
      <!-- 카드 클릭 시 ID를 전달하도록 수정 -->
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

// 카드 행을 생성하는 함수
function createCardRow(rowId, cards, categoryName) {
  return `
    <h3>${categoryName}</h3>
    <div class="card-wrapper" id="wrapper-${rowId}">
      <!-- 왼쪽 방향 회전 버튼 추가 -->
      <a class="carousel-control-prev" href="javascript:void(0);" role="button" onclick="rotateCarousel(${rowId}, -1)">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <div class="card-container">
        ${cards.join("")}
      </div>
      <!-- 기존 오른쪽 방향 회전 버튼 -->
      <a class="carousel-control-next" href="javascript:void(0);" role="button" onclick="rotateCarousel(${rowId}, 1)">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
  `;
}

// 회전 카루셀 기능
function rotateCarousel(rowId, direction) {
  // 클릭된 열에 대한 인덱스를 증가 또는 감소시켜 다음 게시물을 보여줌
  currentIndexes[rowId] = (currentIndexes[rowId] + direction + posts.length) % posts.length; // 클릭된 열의 인덱스를 증가시키되, 전체 게시물 수를 초과하지 않도록 함
  displayPosts(); // 게시물 재표시

  // 회전 효과 설정
  const container = document.querySelector(`#wrapper-${rowId} .card-container`);
  const cards = container.querySelectorAll(".card");

  // 모든 카드에서 크기 관련 클래스를 제거
  cards.forEach((card) => {
    card.classList.remove("scaled");
    card.classList.remove("card-normal");
  });

  // 2번째 카드를 기본 크기로 설정
  if (cards[1]) {
    cards[1].classList.add("card-normal"); // 2번째 카드는 기본 크기
  }

  // 3번째 카드를 확대 크기로 설정
  if (cards[2]) {
    cards[2].classList.add("scaled"); // 3번째 카드를 확대
  }
}
// 초기화 함수
function initialize() {
  fetchPosts(); // 서버에서 게시물 데이터를 가져오는 함수 호출   - 로그인 후 게시글 및 자바 스크립트 작업 파트가 안뜨는 상황이 발생하고 있음. 
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