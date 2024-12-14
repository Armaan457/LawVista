import { SearchBar } from "./search-bar";
import { ChatListItem } from "./chat-list-item";
import penchat from "../../assets/svgs/pen-chat.svg";
import chat from "../../assets/svgs/chatgray.svg";

export function Sidebar({
  chats,
  activeChatId,
  onChatSelect,
  onSearch,
  createNewChat,
}) {
  return (
    <div className="min-w-[400px] w-[400px] dark:bg-PrimaryGrayDark bg-TertiaryWhite h-screen flex flex-col">
      {/* Header Section */}
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <h1 className="dark:text-gray-200 text-DarkBlue font-semibold">Chats</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center">
        <SearchBar onSearch={onSearch} />
        <button
          className="bg-PrimaryBlue p-2.5 mr-3 rounded-lg"
          onClick={createNewChat}
        >
          <img src={penchat} alt="New Chat" width={18} height={10} />
        </button>
      </div>

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto pl-5 pt-3 scrollbar-minimal">
        <h1 className="text-[#676767] flex gap-1 pb-2">
          <img src={chat} alt="Chats Icon" />
          Recent Chats
        </h1>
        <div className="overflow-y-auto h-[92%] flex flex-col gap-3  scrollbar-thin scrollbar-thumb-PrimaryGrayDark scrollbar-track-PrimaryGrayLight">
          {chats && chats.length > 0 ? (
            chats.map((chat) => {
              const firstMessage = chat.chatHistory?.[0]?.user || "New Chat...";
              const secondMessage =
                chat.chatHistory?.[1]?.ai?.text || "Start a new chat";

              return (
                <ChatListItem
                  key={chat.chatId}
                  title={firstMessage}
                  subtitle={secondMessage}
                  isActive={chat.chatId === activeChatId}
                  onClick={() => onChatSelect(chat.chatId)}
                />
              );
            })
          ) : (
            <div className="text-PrimaryGrayTextLight">No Chats Found</div>
          )}
        </div>
      </div>

      {/* Footer */}
      <button className="p-4 text-gray-400 hover:text-gray-200 transition-colors">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </button>
    </div>
  );
}

export default Sidebar;
