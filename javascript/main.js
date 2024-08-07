document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", handleLogin);

  fetchPosts();
});

async function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Implement login logic here
  console.log(
    `Logging in with username: ${username} and password: ${password}`
  );
}

async function fetchPosts() {
  try {
    const response = await fetch("http://localhost:8080/api/posts");
    const posts = await response.json();
    displayPosts(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

function displayPosts(posts) {
  const postsList = document.getElementById("posts-list");
  postsList.innerHTML = "";
  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
        `;
    postsList.appendChild(postElement);
  });
}
