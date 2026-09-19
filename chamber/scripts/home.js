
const hamburger = document.getElementById("hamburger");
const primaryNav = document.getElementById("primary-nav");

hamburger.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", isOpen);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});


document.getElementById("lastModified").textContent =
  `Last Modification: ${document.lastModified}`;
