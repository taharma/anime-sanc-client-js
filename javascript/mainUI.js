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

const categoryNames = [
    "<button class='category-button'>Anime</button> <a href='#' class='see-all-link'>모두 보기</a>",
    "<button class='category-button'>Manga</button> <a href='#' class='see-all-link'>모두 보기</a>",
    "<button class='category-button'>Popular Works</button> <a href='#' class='see-all-link'>모두 보기</a>",
    "<button class='category-button'>Characters</button> <a href='#' class='see-all-link'>모두 보기</a>",
    "<button class='category-button'>Forum</button> <a href='#' class='see-all-link'>모두 보기</a>",
];

let posts = [];
const currentIndexes = Array(categoryNames.length).fill(0);

// 서버에서 게시물 데이터를 가져오는 함수
async function fetchPosts() {
    try {
        const response = await fetch("http://localhost:9000/api/notes");
        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }
        posts = await response.json();
        console.log("Fetched posts:", posts);
        displayPosts();
    } catch (error) {
        console.error("Error fetching posts:", error);
        alert("게시물을 가져오는 중 오류가 발생했습니다.");
    }
}

// 게시물 데이터를 카드로 표시하는 함수
function displayPosts() {
    if (posts.length === 0) {
        document.getElementById("card-rows").innerHTML = "<p>게시물이 없습니다.</p>";
        return;
    }

    const cardRows = [];
    for (let i = 0; i < categoryNames.length; i++) {
        const cards = [];
        for (let j = 0; j < 5; j++) {
            const index = (currentIndexes[i] + j) % posts.length;
            const post = posts[index];
            if (!post) continue;
            cards.push(
                createCard(
                    images[index % images.length],
                    escapeHTML(post.title) || "Default Title",
                    escapeHTML(post.contents) || "Default Content",
                    `Author ${index + 1}`,
                    `Date ${index + 1}`,
                    post.id
                )
            );
        }
        cardRows.push(createCardRow(i, cards, categoryNames[i]));
    }

    document.getElementById("card-rows").innerHTML = cardRows.join("");

    // 카드의 스타일 조정
    for (let i = 0; i < categoryNames.length; i++) {
        const container = document.querySelector(`#wrapper-${i} .card-container`);
        const cards = container.querySelectorAll(".card");
        if (cards[2]) {
            cards[2].style.transform = "scale(1.1)";
        }
    }
}

// 에스케이프 함수 추가하여 XSS 방지
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function createCard(image, title, description, author, date, id) {
    return `
        <div class="card shadow" style="position: relative;" onclick="redirectToPost('${id}')">
            <img src="${image}" class="card-img-top" alt="${escapeHTML(title)}">
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
                    <img src="icon/heart-fill.svg" alt="Like">
                </button>
                <span class="like-count">235</span>
                <button class="icon-button bookmark" onclick="toggleIcon(event, this)">
                    <img src="/icon/bookmark-plus-fill.svg" alt="Bookmark">
                </button>
            </div>
        </div>
    `;
}

function createCardRow(rowId, cards, categoryName) {
    return `
        <h3>${categoryName}</h3>
        <div class="card-wrapper" id="wrapper-${rowId}">
            <a class="carousel-control-prev" href="javascript:void(0);" role="button" 
               onclick="rotateCarousel(${rowId}, -1)" aria-label="Previous">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
            </a>
            <div class="card-container">
                ${cards.join("")}
            </div>
            <a class="carousel-control-next" href="javascript:void(0);" role="button" 
               onclick="rotateCarousel(${rowId}, 1)" aria-label="Next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
            </a>
        </div>
    `;
}

function rotateCarousel(rowId, direction) {
    currentIndexes[rowId] = (currentIndexes[rowId] + direction + posts.length) % posts.length;
    displayPosts();
    const container = document.querySelector(`#wrapper-${rowId} .card-container`);
    const cards = container.querySelectorAll(".card");
    cards.forEach((card) => {
        card.classList.remove("scaled");
        card.classList.remove("card-normal");
    });
    if (cards[1]) {
        cards[1].classList.add("card-normal");
    }
    if (cards[2]) {
        cards[2].classList.add("scaled");
    }
}

function initialize() {
    fetchPosts();
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

function toggleIcon(event, button) {
    event.stopPropagation();
    button.classList.toggle("clicked");
}

function redirectToPost(id) {
    window.location.href = `post.html?id=${id}`;
}

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const authButtons = document.getElementById("auth-buttons");

    if (authButtons) {
        if (isLoggedIn === "true") {
            showProfileWriteLogoutButtons();
        } else {
            showLoginAndRegisterButtons();
        }
    } else {
        console.warn('auth-buttons 요소를 찾을 수 없습니다.');
    }
}

function showProfileWriteLogoutButtons() {
    const authButtons = document.getElementById("auth-buttons");
    authButtons.innerHTML = `
        <li class="nav-item">
            <a class="nav-link" href="Profile.html" id="profile-button" aria-label="프로필">
                <img src="/icon/user.png" alt="프로필 아이콘" class="profile-icon">
            </a>
            <div id="profile-dropdown" class="dropdown-content">
                <a href="Profile.html">프로필</a>
                <a href="#">설정</a>
                <a href="#">알림</a>
                <a href="#">메시지</a>
                <a href="#" id="logout-button">로그아웃</a>
            </div>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="PostWriting.html" id="write-button">글쓰기</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="#" id="logout-button">로그아웃</a>
        </li>
    `;

    // 프로필 버튼 드롭다운 토글 기능
    const profileButton = document.getElementById("profile-button");
    const profileDropdown = document.getElementById("profile-dropdown");

    if (profileButton) {
        profileButton.addEventListener("click", function(event) {
            event.preventDefault();
            profileDropdown.style.display = profileDropdown.style.display === "block" ? "none" : "block";
        });
    }

    // 로그아웃 버튼 이벤트 리스너 추가
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", function(event) {
            event.preventDefault();
            logout();
        });
    }

    // 페이지 외부 클릭 시 드롭다운 닫기
    window.addEventListener("click", function(event) {
        if (!event.target.closest('#profile-button')) {
            profileDropdown.style.display = "none";
        }
    });
}

function showLoginAndRegisterButtons() {
    const authButtons = document.getElementById("auth-buttons");
    authButtons.innerHTML = `
        <li class="nav-item">
            <a class="nav-link" href="./login.html" id="login-button">로그인</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="./register.html" id="register-button">신규 등록</a>
        </li>
    `;
}

function login() {
    console.log("로그인 함수 호출됨");
    localStorage.setItem("isLoggedIn", "true");
    // 예시로 memberId를 설정합니다. 실제 구현 시 서버에서 받아온 값을 사용하세요.
    localStorage.setItem("memberId", "12345");
    alert("로그인에 성공했습니다.");
    checkLoginStatus();
    console.log("로그인 상태 확인 완료");
}

function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("memberId");
    showLoginAndRegisterButtons();
    alert("로그아웃 되었습니다.");
}
