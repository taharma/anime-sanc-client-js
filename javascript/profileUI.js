function toggleDropdown() {
  var dropdown = document.getElementById("dropdown");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

window.onclick = function(event) {
  if (!event.target.matches('.icon2 img')) {
      var dropdown = document.getElementById("dropdown");
      if (dropdown.style.display === "block") {
          dropdown.style.display = "none";
      }
  }
}

function showContent(sectionId) {
  document.querySelectorAll('.content-section').forEach(section => {
      section.classList.toggle('active', section.id === sectionId);
  });
}