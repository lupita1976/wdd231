import discoverData from '../data/discover.mjs';

// Function to create card HTML
function createCard(item) {
    return `
        <article class="discover-card" data-id="${item.id}">
            <h2>${item.name}</h2>
            <figure>
                <img src="${item.image}" alt="${item.name}" loading="lazy" width="300" height="200">
            </figure>
            <address>${item.address}</address>
            <p>${item.description}</p>
            <button class="learn-more-btn" data-id="${item.id}">${item.buttonText}</button>
        </article>
    `;
}

// Function to render all cards
function renderCards() {
    const gridContainer = document.getElementById('discover-grid');
    if (gridContainer) {
        gridContainer.innerHTML = discoverData.map(item => createCard(item)).join('');
    }
}

// Function to handle visitor messages with localStorage
function handleVisitorMessage() {
    const messageContainer = document.getElementById('visitor-message');
    const now = Date.now();
    const lastVisit = localStorage.getItem('lastDiscoverVisit');
    
    let message = '';
    let messageClass = '';
    
    if (!lastVisit) {
        // First visit
        message = '<strong>Welcome!</strong> Let us know if you have any questions.';
        messageClass = 'first-visit';
    } else {
        const lastVisitTime = parseInt(lastVisit, 10);
        const timeDifference = now - lastVisitTime;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        
        if (daysDifference < 1) {
            // Less than a day
            message = '<strong>Back so soon! Awesome!</strong>';
            messageClass = 'returning-soon';
        } else {
            // One or more days
            const dayWord = daysDifference === 1 ? 'day' : 'days';
            message = `<strong>You last visited ${daysDifference} ${dayWord} ago.</strong>`;
            messageClass = 'returning';
        }
    }
    
    // Update localStorage with current visit
    localStorage.setItem('lastDiscoverVisit', now.toString());
    
    // Display message
    if (messageContainer) {
        messageContainer.innerHTML = message;
        messageContainer.className = `visitor-message ${messageClass}`;
    }
}

// Function to handle "Learn More" button clicks
function handleLearnMoreButtons() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('learn-more-btn')) {
            const itemId = parseInt(e.target.dataset.id, 10);
            const item = discoverData.find(d => d.id === itemId);
            
            if (item) {
                alert(`${item.name}\n\n${item.description}\n\n ${item.address}`);
            }
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    renderCards();
    handleVisitorMessage();
    handleLearnMoreButtons();
});