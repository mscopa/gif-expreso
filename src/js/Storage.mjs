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
      timestamp: new Date().toISOString(),
      starred: false
    });
    localStorage.setItem(this.storageKey, JSON.stringify(history));
  }

  toggleStar(index) {
    const history = this.getHistory();
    history[index].starred = !history[index].starred;
    localStorage.setItem(this.storageKey, JSON.stringify(history));
    return history;
    }

  getHistory() {
    const history = localStorage.getItem(this.storageKey);
    return history ? JSON.parse(history) : [];
  }

  clearHistory() {
    localStorage.removeItem(this.storageKey);
  }

  removeFromHistory(index) {
    const history = this.getHistory();
    history.splice(index, 1);
    localStorage.setItem(this.storageKey, JSON.stringify(history));
    return history;
    }
}