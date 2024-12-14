import { useState, useEffect } from "react";
import fileText from "../../assets/svgs/file-text.svg";
import deleteicon from "../../assets/svgs/delete.svg";
import { translateToLanguage } from "../../services/LanguageEnglish"; // Assuming translation logic is available

const DocumentListItem = ({ title, onClick, isActive, onDelete }) => {
  const [translatedTitle, setTranslatedTitle] = useState(title);
  const [loading, setLoading] = useState(false);

  // Fetch the language from localStorage and translate title
  const targetLang = localStorage.getItem("targetLanguage") || "hi"; // Default to English

  useEffect(() => {
    const translateContent = async () => {
      setLoading(true);
      try {
        const translatedTitleText = await translateToLanguage(title, targetLang);
        setTranslatedTitle(translatedTitleText);
      } catch (error) {
        console.error("Error translating content:", error);
        setTranslatedTitle(title); // Fallback to original content if translation fails
      }
      setLoading(false);
    };

    if (title) {
      translateContent(); // Trigger translation when title changes
    }
  }, [title, targetLang]);

  return (
    <div className="my-3">
      <button
        onClick={onClick}
        className={`relative w-[95%] text-left pb-2 px-4 pt-3 transition-colors rounded-xl flex items-center gap-2 ${
          isActive
            ? "dark:bg-PrimaryGrayHover bg-PrimaryWhite hover:bg-SecondaryWhite dark:hover:bg-PrimaryGrayLight"
            : "dark:bg-PrimaryGrayDark bg-PrimaryWhite hover:bg-SecondaryWhite dark:hover:bg-PrimaryGrayLight"
        }`}
      >
        <img src={fileText} width={18} height={18} alt="file" />
        <h3 className="dark:text-white text-black font-medium truncate">
          {loading ? "Translating..." : translatedTitle}
        </h3>

        {isActive && (
          <img
            src={deleteicon}
            alt="del"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the button's onClick
              onDelete(); // Trigger the delete action
            }}
            className="cursor-pointer ml-auto"
          />
        )}
      </button>
    </div>
  );
};

export default DocumentListItem;
