export class StorageService {
  constructor(key) {
    this.storageKey = key;
  }

  save(data) {
    const history = this.getHistory();
    history.unshift({
      userText: data.userText,
      transformedText: data.transformedText,
      gifUrl: data.gifUrl,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(this.storageKey, JSON.stringify(history));
  }

  getHistory() {
    const history = localStorage.getItem(this.storageKey);
    return history ? JSON.parse(history) : [];
  }

  clearHistory() {
    localStorage.removeItem(this.storageKey);
  }
}