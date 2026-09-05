const hamburger = document.getElementById("hamburger");
const primaryNav = document.getElementById("primary-nav");

hamburger.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", isOpen);
});

// Cierra el menú al elegir un link (útil en pantallas pequeñas)
primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});
