
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


const detailHeader = document.getElementById('detailHeader');
const detailFooter = document.getElementById('detailFooter');
const detailMain = document.querySelector('.detail-main');
const pokemonNameEl = document.getElementById('pokemonName');
const pokemonNumberEl = document.getElementById('pokemonNumber');
const pokemonImageEl = document.getElementById('pokemonImage');
const typeBadgesEl = document.getElementById('typeBadges');
const pokemonWeightEl = document.getElementById('pokemonWeight');
const pokemonHeightEl = document.getElementById('pokemonHeight');
const abilitiesListEl = document.getElementById('abilitiesList');
const flavorTextEl = document.getElementById('flavorText');
const statsContainerEl = document.getElementById('statsContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const favBtnLarge = document.getElementById('favBtnLarge');

let currentPokemonId = null;


function getPokemonIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}


function updateUrl(id) {
    const newUrl = `${window.location.pathname}?id=${id}`;
    window.history.pushState({ id }, '', newUrl);
}


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


async function fetchSpeciesData(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        if (!response.ok) throw new Error('Species data not found');
        return await response.json();
    } catch (error) {
        console.error('Error fetching species data:', error);
        return null;
    }
}


function getFlavorText(speciesData) {
    if (!speciesData || !speciesData.flavor_text_entries) return 'No description available.';

    const englishEntry = speciesData.flavor_text_entries.find(
        entry => entry.language.name === 'en'
    );

    if (!englishEntry) return 'No description available.';

  
    return englishEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ');
}


function updateThemeColor(primaryType) {
    const color = typeColors[primaryType] || '#1a237e';

    detailHeader.style.backgroundColor = color;
    detailMain.style.backgroundColor = color;
    detailFooter.style.backgroundColor = color;

    
    document.querySelectorAll('.stat-bar-fill').forEach(bar => {
        bar.style.backgroundColor = color;
    });

    
    document.querySelectorAll('.stat-name').forEach(name => {
        name.style.color = color;
    });
}

function renderPokemon(pokemon, speciesData) {
    currentPokemonId = pokemon.id;

    
    pokemonNameEl.textContent = pokemon.name;
    pokemonNumberEl.textContent = `#${String(pokemon.id).padStart(3, '0')}`;

    
    const spriteUrl = pokemon.sprites.other?.['official-artwork']?.front_default
        || pokemon.sprites.front_default;
    pokemonImageEl.src = spriteUrl;
    pokemonImageEl.alt = `${pokemon.name} sprite`;

    
    typeBadgesEl.innerHTML = '';
    pokemon.types.forEach(typeInfo => {
        const typeName = typeInfo.type.name;
        const badge = document.createElement('span');
        badge.className = 'type-badge';
        badge.textContent = typeName;
        badge.style.backgroundColor = typeColors[typeName] || '#999';
        typeBadgesEl.appendChild(badge);
    });

    const primaryType = pokemon.types[0].type.name;
    updateThemeColor(primaryType);

    // Weight and Height
    pokemonWeightEl.textContent = `${(pokemon.weight / 10).toFixed(1)}kg`;
    pokemonHeightEl.textContent = `${(pokemon.height / 10).toFixed(1)}m`;

   
    abilitiesListEl.innerHTML = '';
    pokemon.abilities.forEach(abilityInfo => {
        const abilityName = document.createElement('span');
        abilityName.className = 'ability-name';
        abilityName.textContent = abilityInfo.ability.name.replace('-', ' ');
        abilitiesListEl.appendChild(abilityName);
    });

    
    flavorTextEl.textContent = getFlavorText(speciesData);

    
    statsContainerEl.innerHTML = '';
    const statNames = {
        hp: 'HP',
        attack: 'ATK',
        defense: 'DEF',
        'special-attack': 'SATK',
        'special-defense': 'SDEF',
        speed: 'SPD'
    };

    pokemon.stats.forEach(stat => {
        const statName = statNames[stat.stat.name] || stat.stat.name;
        const statValue = stat.base_stat;
        const percentage = Math.min((statValue / 255) * 100, 100);

        const row = document.createElement('div');
        row.className = 'stat-row';
        row.innerHTML = `
            <span class="stat-name">${statName}</span>
            <span class="stat-value">${String(statValue).padStart(3, '0')}</span>
            <div class="stat-bar-bg">
                <div class="stat-bar-fill" style="width: 0%"></div>
            </div>
        `;
        statsContainerEl.appendChild(row);

        
        setTimeout(() => {
            row.querySelector('.stat-bar-fill').style.width = `${percentage}%`;
        }, 100);
    });

    
    prevBtn.disabled = pokemon.id <= 1;
    nextBtn.disabled = pokemon.id >= 1025; // Current max Pokémon

    
    updateFavButtonState();

    
    document.title = `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} - Pokedex`;
}


async function loadPokemon(id) {
    if (!id) {
        pokemonNameEl.textContent = 'Not Found';
        return;
    }

    const pokemon = await fetchPokemon(id);
    if (!pokemon) {
        pokemonNameEl.textContent = 'Not Found';
        pokemonNumberEl.textContent = '';
        return;
    }

    const speciesData = await fetchSpeciesData(id);
    renderPokemon(pokemon, speciesData);
    updateUrl(id);
}

prevBtn.addEventListener('click', () => {
    if (currentPokemonId && currentPokemonId > 1) {
        loadPokemon(currentPokemonId - 1);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPokemonId && currentPokemonId < 1025) {
        loadPokemon(currentPokemonId + 1);
    }
});


function getFavorites() {
    const stored = localStorage.getItem('pokedexFavorites');
    return stored ? JSON.parse(stored) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem('pokedexFavorites', JSON.stringify(favorites));
}

function toggleFavorite() {
    if (!currentPokemonId) return;

    let favorites = getFavorites();
    const index = favorites.indexOf(currentPokemonId);

    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(currentPokemonId);
    }

    saveFavorites(favorites);
    updateFavButtonState();
}

function updateFavButtonState() {
    const favorites = getFavorites();
    const isFav = favorites.includes(currentPokemonId);

    if (isFav) {
        favBtnLarge.classList.add('favorited');
    } else {
        favBtnLarge.classList.remove('favorited');
    }
}

favBtnLarge.addEventListener('click', toggleFavorite);


window.addEventListener('popstate', (event) => {
    const id = event.state?.id || getPokemonIdFromUrl();
    if (id) loadPokemon(id);
});


document.addEventListener('DOMContentLoaded', () => {
    const id = getPokemonIdFromUrl();
    if (id) {
        loadPokemon(id);
    } else {
        
        loadPokemon(25);
    }
});