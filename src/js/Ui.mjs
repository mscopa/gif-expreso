export class UiService {
  constructor(storageService) {
    this.storageService = storageService;
    this.form = document.getElementById('gif-form');
    this.input = document.getElementById('user-input');
    this.resultsContainer = document.getElementById('results-container');
    this.historyContainer = document.getElementById('history-container');
  }

  bindSubmit(handler) {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const userText = this.input.value.trim();
      if (userText) {
        await handler(userText);
        this.input.value = '';
      }
    });
  }

  renderCard(userText, transformedText, gifUrl) {
    const card = document.createElement('div');
    card.className = 'gif-card';
    card.dataset.id = Date.now();
    
    card.innerHTML = `
        <div class="gif-container">
        <img src="${gifUrl}" alt="${transformedText}">
        </div>
        <div class="text-container">
        <p class="original-text">"${userText}"</p>
        <p class="transformed-text">${transformedText}</p>
        <span class="favorite-star">☆</span>
        </div>
    `;

    card.addEventListener('dblclick', () => {
        card.querySelector('.favorite-star').textContent = '★';
        card.style.borderColor = '#FFD700';
    });
    
    this.resultsContainer.prepend(card);

    const gifImg = card.querySelector('img');
    gifImg.style.cursor = 'zoom-in';
    gifImg.addEventListener('click', () => {
        window.open(gifImg.src, '_blank');
    });
    }

  renderHistory(history) {
    this.historyContainer.innerHTML = history.map((item, index) => `
        <div class="history-card">
        <img src="${item.gifUrl}" alt="${item.transformedText}">
        <div class="history-actions">
            <span class="history-star">${item.starred ? '★' : '☆'}</span>
            <span class="delete-btn" data-index="${index}">🗑️</span>
        </div>
        <p>"${item.userText}"</p>
        <small>${new Date(item.timestamp).toLocaleString()}</small>
        </div>
    `).join('');

    document.querySelectorAll('.history-star').forEach((star, index) => {
        star.addEventListener('click', (e) => {
        e.stopPropagation();
        const updatedHistory = this.storageService.toggleStar(index);
        this.renderHistory(updatedHistory);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = e.target.dataset.index;
        const updatedHistory = this.storageService.removeFromHistory(index);
        this.renderHistory(updatedHistory);
        });
    });
    }
}