import { ApiService } from "./Api.mjs";
import { StorageService } from "./Storage.mjs";
import { UiService } from "./Ui.mjs";

const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const STORAGE_KEY = "gifExpresoHistory";

const apiService = new ApiService(GIPHY_API_KEY, GEMINI_API_KEY);
const storageService = new StorageService(STORAGE_KEY);
const uiService = new UiService(storageService);

uiService.renderHistory(storageService.getHistory());

uiService.bindSubmit(async userText => {
  try {
    const transformedText = await apiService.transformTextWithGemini(userText);
    const gifUrl = await apiService.generateGiphy(transformedText);
    uiService.renderCard(userText, transformedText, gifUrl);
    storageService.save({ userText, transformedText, gifUrl });
    uiService.renderHistory(storageService.getHistory());
  } catch (error) {
    alert("An error ocurred. Try again.");
  }
});
