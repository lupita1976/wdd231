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
const resultsGrid = document.getElementById('resultsGrid');
const searchCriteriaEl = document.getElementById('searchCriteria');
const loadingEl = document.getElementById('loading');
const noResultsEl = document.getElementById('noResults');
const favCountEl = document.getElementById('favCount');

// ===== GET URL PARAMS =====
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        name: params.get('name') || '',
        type: params.get('type') || '',
        minStat: params.get('minStat') || '',
        maxWeight: params.get('maxWeight') || ''
    };
}

// ===== DISPLAY SEARCH CRITERIA =====
function displaySearchCriteria(params) {
    const criteria = [];
    
    if (params.name) criteria.push(`<span class="criteria-item"><strong>Name:</strong> ${params.name}</span>`);
    if (params.type) criteria.push(`<span class="criteria-item"><strong>Type:</strong> ${params.type}</span>`);
    if (params.minStat) criteria.push(`<span class="criteria-item"><strong>Min Stat:</strong> ${params.minStat}</span>`);
    if (params.maxWeight) criteria.push(`<span class="criteria-item"><strong>Max Weight:</strong> ${params.maxWeight}kg</span>`);
    
    if (criteria.length === 0) {
        searchCriteriaEl.innerHTML = '<h2>No search criteria specified</h2>';
    } else {
        searchCriteriaEl.innerHTML = `
            <h2>Search Criteria</h2>
            <div class="criteria-list">
                ${criteria.join('')}
            </div>
        `;
    }
}

// ===== FETCH ALL POKEMON =====
async function fetchAllPokemon(limit = 151) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch Pokémon');
        
        const data = await response.json();
        
        const pokemonDetails = await Promise.all(
            data.results.map(async (pokemon) => {
                const res = await fetch(pokemon.url);
                return await res.json();
            })
        );
        
        return pokemonDetails;
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
        return [];
    }
}

// ===== FILTER POKEMON =====
function filterPokemon(pokemonList, params) {
    return pokemonList.filter(pokemon => {
        // Filter by name
        if (params.name && !pokemon.name.toLowerCase().includes(params.name.toLowerCase())) {
            return false;
        }
        
        // Filter by type
        if (params.type && !pokemon.types.some(type => type.type.name === params.type)) {
            return false;
        }
        
        // Filter by minimum stat
        if (params.minStat) {
            const minStat = parseInt(params.minStat);
            const maxStat = Math.max(...pokemon.stats.map(stat => stat.base_stat));
            if (maxStat < minStat) {
                return false;
            }
        }
        
        // Filter by maximum weight
        if (params.maxWeight) {
            const maxWeight = parseFloat(params.maxWeight);
            const weightInKg = pokemon.weight / 10;
            if (weightInKg > maxWeight) {
                return false;
            }
        }
        
        return true;
    });
}

// ===== RENDER RESULTS =====
function renderResults(pokemonList) {
    resultsGrid.innerHTML = '';
    
    if (pokemonList.length === 0) {
        noResultsEl.hidden = false;
        loadingEl.hidden = true;
        return;
    }
    
    noResultsEl.hidden = true;
    loadingEl.hidden = true;
    
    pokemonList.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.setAttribute('role', 'listitem');
        
        const dexNumber = String(pokemon.id).padStart(3, '0');
        const spriteUrl = pokemon.sprites.other?.['official-artwork']?.front_default 
            || pokemon.sprites.front_default;
        
        card.innerHTML = `
            <span class="dex-number">#${dexNumber}</span>
            <img src="${spriteUrl}" 
                 alt="${pokemon.name} sprite" 
                 loading="lazy"
                 width="96" 
                 height="96">
            <span class="pokemon-name">#${pokemon.name}</span>
        `;
        
        card.addEventListener('click', () => {
            window.location.href = `detail.html?id=${pokemon.id}`;
        });
        
        resultsGrid.appendChild(card);
    });
}

// ===== UPDATE FAVORITES COUNT =====
function updateFavCount() {
    const stored = localStorage.getItem('pokedexFavorites');
    const favorites = stored ? JSON.parse(stored) : [];
    favCountEl.textContent = favorites.length;
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', async () => {
    updateFavCount();
    
    const params = getUrlParams();
    displaySearchCriteria(params);
    
    loadingEl.hidden = false;
    
    const allPokemon = await fetchAllPokemon(151);
    const filteredPokemon = filterPokemon(allPokemon, params);
    
    renderResults(filteredPokemon);
});