// ===== POKEMON TYPE COLORS =====
const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
};

// ===== DOM ELEMENTS =====
const favoritesGrid = document.getElementById('favoritesGrid');
const emptyState = document.getElementById('emptyState');
const loadingEl = document.getElementById('loading');
const favCountEl = document.getElementById('favCount');

// ===== FAVORITES FUNCTIONS =====
function getFavorites() {
    const stored = localStorage.getItem('pokedexFavorites');
    return stored ? JSON.parse(stored) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem('pokedexFavorites', JSON.stringify(favorites));
}

function updateFavCount() {
    const favorites = getFavorites();
    favCountEl.textContent = favorites.length;
}

function removeFromFavorite(pokemonId) {
    let favorites = getFavorites();
    const index = favorites.indexOf(pokemonId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        saveFavorites(favorites);
        updateFavCount();
        loadFavorites(); // Reload the grid
    }
}

// ===== FETCH POKEMON DATA =====
async function fetchPokemon(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) throw new Error('Pokémon not found');
        return await response.json();
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
        return null;
    }
}

// ===== RENDER FAVORITES =====
function renderFavorites(pokemonList) {
    favoritesGrid.innerHTML = '';
    
    if (pokemonList.length === 0) {
        emptyState.hidden = false;
        loadingEl.hidden = true;
        return;
    }
    
    emptyState.hidden = true;
    loadingEl.hidden = true;
    
    pokemonList.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.setAttribute('role', 'listitem');
        
        const dexNumber = String(pokemon.id).padStart(3, '0');
        const spriteUrl = pokemon.sprites.other?.['official-artwork']?.front_default 
            || pokemon.sprites.front_default;
        
        card.innerHTML = `
            <button class="fav-btn favorited" 
                    aria-label="Remove from favorites"
                    data-id="${pokemon.id}">
                ❤️
            </button>
            <span class="dex-number">#${dexNumber}</span>
            <img src="${spriteUrl}" 
                 alt="${pokemon.name} sprite" 
                 loading="lazy"
                 width="96" 
                 height="96">
            <span class="pokemon-name">#${pokemon.name}</span>
        `;
        
        // Remove favorite button click
        const favBtn = card.querySelector('.fav-btn');
        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFromFavorite(pokemon.id);
        });
        
        // Card click - navigate to detail
        card.addEventListener('click', () => {
            window.location.href = `detail.html?id=${pokemon.id}`;
        });
        
        favoritesGrid.appendChild(card);
    });
}

// ===== LOAD FAVORITES =====
async function loadFavorites() {
    const favorites = getFavorites();
    
    if (favorites.length === 0) {
        emptyState.hidden = false;
        loadingEl.hidden = true;
        return;
    }
    
    loadingEl.hidden = false;
    
    try {
        const pokemonDetails = await Promise.all(
            favorites.map(id => fetchPokemon(id))
        );
        
        const validPokemon = pokemonDetails.filter(p => p !== null);
        renderFavorites(validPokemon);
    } catch (error) {
        console.error('Error loading favorites:', error);
        loadingEl.hidden = true;
        favoritesGrid.innerHTML = '<p>Error loading favorites. Please try again.</p>';
    }
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    updateFavCount();
    loadFavorites();
});