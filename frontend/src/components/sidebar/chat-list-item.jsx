import { useState,useEffect } from "react";
import deleteicon from "../../assets/svgs/delete.svg";
import { translateToLanguage } from "../../services/LanguageEnglish"; // Assuming translation logic is available

export function ChatListItem({ title, subtitle, isActive, onClick, onDelete }) {
  const [translatedTitle, setTranslatedTitle] = useState(title);
  const [translatedSubtitle, setTranslatedSubtitle] = useState(subtitle);
  const [loading, setLoading] = useState(false);

  // Fetch the language from localStorage and translate title and subtitle
  const targetLang = localStorage.getItem("targetLanguage") || "hi";

  const translateContent = async () => {
    try {
      setLoading(true);
      const translatedTitleText = await translateToLanguage(title, targetLang, "YOUR_GOOGLE_API_KEY");
      const translatedSubtitleText = await translateToLanguage(subtitle, targetLang, "YOUR_GOOGLE_API_KEY");
      setTranslatedTitle(translatedTitleText);
      setTranslatedSubtitle(translatedSubtitleText);
    } catch (error) {
      console.error("Error translating content:", error);
    } finally {
      setLoading(false);
    }
  };

  // Translate the content when the component is mounted or language changes
  useEffect(() => {
    translateContent();
  }, [title, subtitle, targetLang]);

  return (
    <button
      onClick={onClick}
      className={`relative w-[95%] text-left pb-2 px-4 pt-3 transition-colors rounded-xl ${
        isActive
          ? "dark:bg-PrimaryGrayHover bg-PrimaryWhite hover:bg-SecondaryWhite dark:hover:bg-PrimaryGrayLight"
          : "dark:bg-PrimaryGrayDark bg-PrimaryWhite hover:bg-SecondaryWhite dark:hover:bg-PrimaryGrayLight"
      }`}
    >
      {isActive && (
        <img
          src={deleteicon}
          alt="del"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the button's onClick
            onDelete();
          }}
          className="absolute top-2 right-2 cursor-pointer"
        />
      )}

      <h3 className="dark:text-white text-black font-medium truncate">
        {loading ? "Translating..." : translatedTitle}
      </h3>
      <p
        className={`text-sm pt-1 truncate ${
          isActive ? "dark:text-white text-black" : "text-PrimaryGrayTextLight"
        }`}
      >
        {loading ? "Translating..." : translatedSubtitle}
      </p>
    </button>
  );
}
