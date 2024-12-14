import { ChatInput } from "./chat-input";
import { UserMessage } from "./user-message";
import chatTriangler from "../../assets/svgs/chat-triangle.svg";
import logo from "../../assets/logoSih.svg";
import { useState,useEffect } from "react";
import { translateToLanguage } from "../../services/LanguageEnglish";
import TextToSpeech from "../../utils/TextToSpeech";


export function ChatArea({ messages, onSend ,handleStateChange}) {
  return (
    <div className="flex-1 flex flex-col h-screen ">
      <div className="flex-1 overflow-y-auto p-7 space-y-6">
        {messages &&
          messages.length > 0 &&
          messages.map((message) => (
            
            <div>
              {message.user ? (
                <UserMessage content={message.user} user={message.user} />
              ) : (
                <Message content={message.ai.text} sources={message.ai.sources} stateChange={handleStateChange}  />
              )}
            </div>
          ))}
      </div>
      <ChatInput onSend={onSend} />
    </div>
  );
}
function Message({ content, sources, stateChange }) {
  const [translatedContent, setTranslatedContent] = useState(content); // To hold the translated content
  const [loading, setLoading] = useState(false);

  const sourcePath = sources[0]?.split(".")[0] || "";

  // Fetch the target language from localStorage
  const targetLang = localStorage.getItem("targetLanguage") || "hi"; // Default to English

  useEffect(() => {
    const translateContent = async () => {
      setLoading(true);
      try {
        // Call the translation API to translate the content
        const translatedText = await translateToLanguage(content, targetLang);
        console.log("Translated Text:", translatedText);
        setTranslatedContent(translatedText); // Update state with translated content
      } catch (error) {
        console.error("Error translating content:", error);
        setTranslatedContent(content); // Fallback to original content if translation fails
      }
      setLoading(false);
    };

    if (content) {
      translateContent(); // Trigger translation on content change
    }
  }, [content, targetLang]); // Re-run the translation if content or language changes

  return (
    <div className={`flex justify-start mb-4 dark:bg-PrimaryGrayDark bg-SecondaryWhite pt-4 pb-8 pr-10 pl-6 rounded-xl`}>
      <div className="max-w-6xl flex">
        <div className="mt-2.5 mr-1">
          <img src={logo} alt="logo" width={120} className="bg-DarkBlue dark:bg-PrimaryGrayLight m-2 p-1 rounded-full" />
        </div>
        <div className="flex space-x-3 justify-start items-center">
          <div>
            <div className="rounded-lg px-4 py-3">
              {sources && (
                <div className="flex items-center gap-5">
                  <h1 className="dark:text-PrimaryGrayTextDark text-DarkBlue">LawVista AI</h1>
                  <div className="my-4"><TextToSpeech text={content} /></div>
                </div>
              )}
              <p className="dark:text-gray-200 text-PrimaryGrayDark whitespace-pre-wrap">
                {loading ? "Translating..." : translatedContent} {/* Show loading text or translated content */}
              </p>
            </div>

            {sources && sources.length > 0 && (
              <div className="mt-4 pl-4">
                <h4 className="dark:text-gray-400 text-DarkBlue text-sm mb-2">Cases Refferred</h4>
                <div className="space-y-2">
                  {sources.map((source, index) => (
                    <div
                      key={index}
                      className="dark:bg-PrimaryGrayLight bg-[#DBE4FF] rounded-xl p-3 flex justify-between items-center"
                      onClick={() => stateChange(sourcePath)}
                    >
                      <div>
                        <h5 className="dark:text-gray-200 text-PrimaryGrayDark">{source}</h5>
                        <p className="dark:text-PrimaryGrayTextDark text-PrimaryGrayLighter text-sm">
                          {source}
                        </p>
                      </div>
                      <button
                        onClick={source.onView}
                        className="px-5 py-2 text-sm dark:bg-PrimaryGrayLighter bg-[#8AA6FA] text-gray-200 rounded-xl hover:bg-PrimaryGrayDark/30 transition-colors flex justify-center items-center space-x-1 gap-2"
                      >
                        <img
                          src={chatTriangler}
                          alt="chat"
                          width={15}
                          height={10}
                        />
                        View Document
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

