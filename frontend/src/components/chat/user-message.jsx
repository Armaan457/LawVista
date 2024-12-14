import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { translateToLanguage } from "../../services/LanguageEnglish"; // Assuming this function is defined for translation

export function UserMessage({ content, user }) {
  const [translatedContent, setTranslatedContent] = useState(content); // State to hold translated content
  const [loading, setLoading] = useState(false);

  // Get the language from localStorage
  const targetLang = localStorage.getItem("targetLanguage") || "hi"; // Default to 'en' if not set

  useEffect(() => {
    const translateContent = async () => {
      setLoading(true);
      try {
        // Call the translation function
        const translatedText = await translateToLanguage(content, targetLang);
        setTranslatedContent(translatedText); // Update the translated content
      } catch (error) {
        console.error("Error translating content: ", error);
        setTranslatedContent(content); // Fallback to original content if translation fails
      }
      setLoading(false);
    };

    if (content) {
      translateContent(); // Trigger translation on content change
    }
  }, [content, targetLang]);

  return (
    <div className={`flex justify-start dark:bg-PrimaryGrayDark bg-SecondaryWhite rounded-xl pb-3 pt-1`}>
      <div className="max-w-6xl flex justify-center items-center gap-2 pl-6 ">
        <div>
          {user.image ? (
            <img src={user.image} alt="logo" width={40} />
          ) : (
            <User size={30} />
          )}
        </div>
        <div className="flex space-x-3 justify-start items-center">
          <div>
            <div className="rounded-lg px-4 py-3">
              <h1 className="dark:text-PrimaryGrayTextDark text-DarkBlue">You</h1>
              <p className="dark:text-gray-200 text-PrimaryGrayDark whitespace-pre-wrap">
                {loading ? "Translating..." : translatedContent}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
