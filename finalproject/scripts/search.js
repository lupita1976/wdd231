// ===== FAVORITES COUNT =====
function updateFavCount() {
    const stored = localStorage.getItem('pokedexFavorites');
    const favorites = stored ? JSON.parse(stored) : [];
    const favCountEl = document.getElementById('favCount');
    if (favCountEl) {
        favCountEl.textContent = favorites.length;
    }
}

// ===== HAMBURGER MENU =====
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mainNav = document.getElementById('mainNav');

if (hamburgerBtn && mainNav) {
    hamburgerBtn.addEventListener('click', () => {
        const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
        hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
        mainNav.classList.toggle('active');
    });
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    updateFavCount();
});