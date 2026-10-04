
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


const pokemonGrid = document.getElementById('pokemonGrid');
const searchInput = document.getElementById('searchInput');
const typeFilterBtn = document.getElementById('typeFilterBtn');
const typeDropdown = document.getElementById('typeDropdown');
const typeFilterLabel = document.getElementById('typeFilterLabel');
const sortBtn = document.getElementById('sortBtn');
const sortDropdown = document.getElementById('sortDropdown');
const sortLabel = document.getElementById('sortLabel');
const loadingEl = document.getElementById('loading');
const noResultsEl = document.getElementById('noResults');
const favCountEl = document.getElementById('favCount');

let allPokemon = [];
let filteredPokemon = [];
let currentTypeFilter = 'all';
let currentSort = 'number';


function getFavorites() {
    const stored = localStorage.getItem('pokedexFavorites');
    return stored ? JSON.parse(stored) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem('pokedexFavorites', JSON.stringify(favorites));
}

function toggleFavorite(event, pokemonId) {
    event.stopPropagation();
    
    let favorites = getFavorites();
    const index = favorites.indexOf(pokemonId);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(pokemonId);
    }
    
    saveFavorites(favorites);
    updateFavCount();
    renderPokemonGrid();
}

function updateFavCount() {
    const favorites = getFavorites();
    favCountEl.textContent = favorites.length;
}

function isFavorite(pokemonId) {
    const favorites = getFavorites();
    return favorites.includes(pokemonId);
}


async function fetchAllPokemon(limit = 251) {
    try {
        loadingEl.hidden = false;
        
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch Pokémon');
        
        const data = await response.json();
        
        
        const pokemonDetails = await Promise.all(
            data.results.map(async (pokemon) => {
                const res = await fetch(pokemon.url);
                return await res.json();
            })
        );
        
        allPokemon = pokemonDetails;
        filteredPokemon = [...allPokemon];
        
        loadingEl.hidden = true;
        applyFiltersAndSort();
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
        loadingEl.hidden = true;
        pokemonGrid.innerHTML = '<p>Error loading Pokémon. Please try again later.</p>';
    }
}


function renderPokemonGrid() {
    pokemonGrid.innerHTML = '';
    
    if (filteredPokemon.length === 0) {
        noResultsEl.hidden = false;
        return;
    }
    
    noResultsEl.hidden = true;
    
    filteredPokemon.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.setAttribute('role', 'listitem');
        
        const dexNumber = String(pokemon.id).padStart(3, '0');
        const spriteUrl = pokemon.sprites.other?.['official-artwork']?.front_default 
            || pokemon.sprites.front_default;
        const favorited = isFavorite(pokemon.id);
        
        card.innerHTML = `
            <button class="fav-btn ${favorited ? 'favorited' : ''}" 
                    aria-label="${favorited ? 'Remove from favorites' : 'Add to favorites'}">
                ${favorited ? '❤️' : '🤍'}
            </button>
            <span class="dex-number">#${dexNumber}</span>
            <img src="${spriteUrl}" 
                 alt="${pokemon.name} sprite" 
                 loading="lazy"
                 width="96" 
                 height="96">
            <span class="pokemon-name">#${pokemon.name}</span>
        `;
        
        
        const favBtn = card.querySelector('.fav-btn');
        favBtn.addEventListener('click', (e) => toggleFavorite(e, pokemon.id));
        
        
        card.addEventListener('click', () => {
            window.location.href = `detail.html?id=${pokemon.id}`;
        });
        
        pokemonGrid.appendChild(card);
    });
}


function applyFiltersAndSort() {
    filteredPokemon = [...allPokemon];
    
   
    if (currentTypeFilter !== 'all') {
        filteredPokemon = filteredPokemon.filter(pokemon => 
            pokemon.types.some(type => type.type.name === currentTypeFilter)
        );
    }
    
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filteredPokemon = filteredPokemon.filter(pokemon => {
            const name = pokemon.name.toLowerCase();
            const number = String(pokemon.id);
            return name.includes(searchTerm) || number.includes(searchTerm);
        });
    }
    
    
    if (currentSort === 'name') {
        filteredPokemon.sort((a, b) => a.name.localeCompare(b.name));
    } else {
        filteredPokemon.sort((a, b) => a.id - b.id);
    }
    
    renderPokemonGrid();
}


let searchTimeout;
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        applyFiltersAndSort();
    }, 300);
});


typeFilterBtn.addEventListener('click', () => {
    const isExpanded = typeFilterBtn.getAttribute('aria-expanded') === 'true';
    typeFilterBtn.setAttribute('aria-expanded', !isExpanded);
    typeDropdown.classList.toggle('show');
});

typeDropdown.addEventListener('click', (e) => {
    if (e.target.classList.contains('dropdown-item')) {
        const type = e.target.dataset.type;
        currentTypeFilter = type;
        typeFilterLabel.textContent = type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1);
        
        
        typeDropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.classList.remove('active');
        });
        e.target.classList.add('active');
        
        
        typeFilterBtn.setAttribute('aria-expanded', 'false');
        typeDropdown.classList.remove('show');
        
        applyFiltersAndSort();
    }
});

sortBtn.addEventListener('click', () => {
    const isExpanded = sortBtn.getAttribute('aria-expanded') === 'true';
    sortBtn.setAttribute('aria-expanded', !isExpanded);
    sortDropdown.classList.toggle('show');
});

sortDropdown.addEventListener('click', (e) => {
    if (e.target.classList.contains('dropdown-item')) {
        const sort = e.target.dataset.sort;
        currentSort = sort;
        sortLabel.textContent = `Sort: ${sort.charAt(0).toUpperCase() + sort.slice(1)}`;
        
        // Update active state
        sortDropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Close dropdown
        sortBtn.setAttribute('aria-expanded', 'false');
        sortDropdown.classList.remove('show');
        
        applyFiltersAndSort();
    }
});


document.addEventListener('click', (e) => {
    if (!e.target.closest('.filter-dropdown')) {
        typeFilterBtn.setAttribute('aria-expanded', 'false');
        typeDropdown.classList.remove('show');
        sortBtn.setAttribute('aria-expanded', 'false');
        sortDropdown.classList.remove('show');
    }
});


document.addEventListener('DOMContentLoaded', () => {
    updateFavCount();
    fetchAllPokemon(251); 
});