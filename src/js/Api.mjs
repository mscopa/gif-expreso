export class ApiService {
  constructor(giphyApiKey, geminiApiKey) {
    this.giphyApiKey = giphyApiKey;
    this.geminiApiKey = geminiApiKey;
    this.baseGiphyUrl = 'https://api.giphy.com/v1/gifs';
    this.baseGeminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  }

  async transformTextWithGemini(userText) {
    try {
        const prompt = `Act as an emotion-to-GIF-search-term translator. Transform this text into a single word or short phrase (2-3 words max) for searching a GIF that represents: "${userText}". Return ONLY the search term without quotes, periods or additional text.
        Examples:
        Input: "I'm happy" → Output: happy dance
        Input: "This is frustrating" → Output: angry face
        Input: "I love this" → Output: heart eyes`;
        const response = await fetch(`${this.baseGeminiUrl}?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
            parts: [{ text: prompt }]
            }]
        })
        });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API response error:', errorData);
        throw new Error(`Error ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Detailed Gemini API error:', error);
      const fallbackTerms = {
        'happy': 'happy dance',
        'sad': 'sad cat',
        'angry': 'angry face',
        'excited': 'excited jump',
        'love': 'heart eyes',
        'i feel good': 'happy celebration',
      };
      const lowerText = userText.toLowerCase();
      return fallbackTerms[lowerText] || userText;
    }
  }

  async generateGiphy(searchTerm) {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/translate?api_key=${this.giphyApiKey}&s=${searchTerm}`
      );
      const data = await response.json();
      return data.data.images.fixed_height.url;
      
    } catch (error) {
      console.log('Giphy error, using default gif');
      return 'https://media.giphy.com/media/3o7aTskHEUdgCQAXde/giphy.gif';
    }
  }
}