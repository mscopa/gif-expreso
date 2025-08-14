export class UiService {
  constructor() {
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
    card.innerHTML = `
      <div class="gif-container">
        <img src="${gifUrl}" alt="${transformedText}">
      </div>
      <div class="text-container">
        <p class="original-text">"${userText}"</p>
        <p class="transformed-text">${transformedText}</p>
      </div>
    `;
    this.resultsContainer.prepend(card);
  }

  renderHistory(history) {
    this.historyContainer.innerHTML = history.map(item => `
      <div class="history-card">
        <img src="${item.gifUrl}" alt="${item.transformedText}">
        <p>"${item.userText}"</p>
        <small>${new Date(item.timestamp).toLocaleString()}</small>
      </div>
    `).join('');
  }
}