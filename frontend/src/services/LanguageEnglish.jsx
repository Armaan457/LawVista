import axios from 'axios';

/**
 * Function to detect language and translate text to English using Google Translation API v2.
 *
 * @param {string} text - The text to translate.
 * @param {string} apiKey - Your Google Cloud API key.
 * @returns {Promise<string>} - The translated text in English.
 */
export const translateToEnglishV2 = async (text, apiKey) => {
  const endpoint = `https://translation.googleapis.com/language/translate/v2`;

  try {
    // Make the request to translate to English
    const response = await axios.get(endpoint, {
      params: {
        q: text,
        target: 'en', // Translate to English
        key: 'AIzaSyCTxPR4C6-5HNRhvRG5k4dCF-gCRlm72Vc',
      },
    });

    const translatedText = response.data.data.translations[0].translatedText;
    console.log(`Translated Text: ${translatedText}`);
    return translatedText;
  } catch (error) {
    console.error('Error translating text:', error.response || error.message);
    throw new Error('Failed to translate text.');
  }
};

    
/**
 * Function to translate text to a specified language using Google Translation API v2.
 *
 * @param {string} text - The text to translate.
 * @param {string} targetLang - The target language code (e.g., 'es' for Spanish, 'fr' for French).
 * @param {string} apiKey - Your Google Cloud API key.
 * @returns {Promise<string>} - The translated text in the target language.
 */export const translateToLanguage = async (text, targetLang) => {
  const endpoint = `https://translation.googleapis.com/language/translate/v2`;

  // Language mapping to language codes
  const languageOptions = {
    English: "en",
    Hindi: "hi",
    Tamil: "ta",
    Telugu: "te",
    Bengali: "bn",
    Marathi: "mr",
    Punjabi: "pa",
    Gujarati: "gu",
    Oriya: "or",
    Assamese: "as",
    Kannada: "ka",
    Malayalam: "ma",
    Urdu: "ur",
    Sanskrit: "sa",
    Nepali: "ne",
    Bhojpuri: "bh",

    // Add more languages and short codes here
  };

//   pu : "Punjabi",
//   gu : "Gujarati",
//   or : "Oriya",
//   as : "Assamese",
//   ka : "Kannada",
//   ma : "Malayalam",
//   ur : "Urdu",
//   sa : "Sanskrit",
//   ne : "Nepali",
//   bh : "Bhojpuri",

  try {
    // Retrieve the selected language name from localStorage, or default to 'Hindi'
    const selectedLanguage = localStorage.getItem("targetLanguage") || "Hindi"; // Default to Hindi if no language is selected
    
    // Map the language name to its code
    const languageCode = languageOptions[selectedLanguage];
    console.log(`Selected Language: ${selectedLanguage}, Code: ${languageCode}`);
    
    if (!languageCode) {
      console.log(`Unsupported language: ${selectedLanguage}. Defaulting to Hindi.`);
      // Default to Hindi if no valid language found
      languageCode = "hi";
    }

    // Make the request to translate the text
    const response = await axios.get(endpoint, {
      params: {
        q: text,             // Input text
        target: languageCode, // Target language code
        key: "AIzaSyCTxPR4C6-5HNRhvRG5k4dCF-gCRlm72Vc",         // Your API key
      },
    });

    // Extract and return translated text
    const translatedText = response.data.data.translations[0].translatedText;
    console.log(`Translated Text: ${translatedText}`);
    return translatedText;
  } catch (error) {
    console.error('Error translating text:', error.response || error.message);
    throw new Error('Failed to translate text.');
  }
};


