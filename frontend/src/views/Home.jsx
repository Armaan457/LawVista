import { useEffect, useState } from "react";
import { Sidebar } from "../components/sidebar/sidebar";
import { ChatArea } from "../components/chat/chat-area";
import Casepdf from "../components/CasePdf/Casepdf";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import AuthAxios from "../utils/authaxios";
import toast from "react-hot-toast";
import Loader from "../components/loader";
import { v4 as uuidv4 } from "uuid";
import { translateToEnglishV2 } from "../services/LanguageEnglish";

export default function Home() {
  const [showSource, setShowSource] = useState(null);
  const [chats, setChats] = useState(null);
  const [filteredChats, setFilteredChats] = useState(null); // Filtered chats
  const [activeChat, setActiveChat] = useState(null);
  const [activeId, setActiveId] = useState(null); // Active chat ID state
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state

  const location = useLocation();
  const navigate = useNavigate();

  const { id } = useParams(); // Chat ID from URL params

  // Handle Send Message
  const handleSend = async (message) => {
    //handle google Translation to english if language is not english
    // try {
    //   message = await translateToEnglishV2(
    //     message,
    //     "auto",
    //   );
    // } catch (error) {
    //   toast.error("Failed to translate message to English");
    //   return;
    // }

    console.log("Message to send:", message);
    const newMessage = { user: message, ai: null };
    setMessages((prev) => [...(prev || []), newMessage]); // Optimistic update
    setLoading(true);
    try {
      const res = await AuthAxios.post(`/chat/update-chat/${id}`, {
        userMessage: message,
      });
      fetchChats();
      const data = res.data;
      if (data.success) {
        setActiveChat(data.data);
        setMessages(data.data.chatHistory);
      } else {
        toast.error("Failed to send message");
        setMessages((prev) => prev?.slice(0, -1)); // Remove optimistic message
      }
    } catch (err) {
      toast.error("An error occurred while sending the message");
      setMessages((prev) => prev?.slice(0, -1)); // Remove optimistic message
    } finally {
      setLoading(false);
    }
  };

  // Fetch Chat Details
  const fetchActiveChat = async (chatId) => {
    if (!chatId) return;
    setActiveChat(null); // Clear previous chat
    setMessages(null);
    try {
      const res = await AuthAxios.get(`/chat/${chatId}`);
      const data = res.data;
      if (data.success) {
        setActiveChat(data.data || null);
        setMessages(data.data.chatHistory || []);
      } else {
        toast.error("Failed to fetch chat details");
      }
    } catch (err) {
      toast.error("An error occurred while fetching the chat");
    } finally {
      setLoading(false);
    }
  };

  // Fetch All Chats
  const fetchChats = async () => {
    setLoading(true);
    try {
      const res = await AuthAxios.get("/chat");
      const data = res.data;
      if (data.success) {
        setChats(data.data);
        setFilteredChats(data.data); // Initialize filtered chats
      } else {
        toast.error("Failed to fetch chats");
      }
    } catch (err) {
      toast.error("An error occurred while fetching chats");
    } finally {
      setLoading(false);
    }
  };

  // Create New Chat
  const createChat = async () => {
    const newChatId = await uuidv4(); // Generate a new UUID
    const newChat = {
      chatId: newChatId,
      title: `New Chat ${newChatId.substring(0, 5)}`,
      subtitle: "This is a new chat",
    };

    setChats((prevChats) => {
      const updatedChats = [...prevChats, newChat];
      setFilteredChats(updatedChats); // Update filtered chats as well
      return updatedChats;
    });

    setActiveId(newChatId); // Set it as active
    navigate(`/chat/${newChatId}`);
  };

  // Filter Chats Based on Search
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (!searchTerm) {
      setFilteredChats(chats);
      return;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = chats.filter((chat) => {
      const firstUserMessage = chat.chatHistory?.[0]?.user?.toLowerCase();
      const secondAiMessage = chat.chatHistory?.[1]?.ai?.text?.toLowerCase();
      return (
        (firstUserMessage && firstUserMessage.includes(lowercasedTerm)) ||
        (secondAiMessage && secondAiMessage.includes(lowercasedTerm))
      );
    });
    setFilteredChats(filtered);
  };
  
  

  // Fetch active chat when ID changes
  useEffect(() => {
    if (id) {
      setActiveId(id);
      fetchActiveChat(id);
    }
  }, [id]);

  // Fetch all chats once
  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <>
      <Sidebar
        chats={filteredChats} // Use filtered chats
        activeChatId={activeId}
        createNewChat={createChat} // Pass createChat to Sidebar
        onSearch={handleSearch} // Pass handleSearch to Sidebar
        onChatSelect={(chatId) => navigate(`/chat/${chatId}`)} // Update active chat on selection
      />
      <div className="flex dark:bg-PrimaryBlack dark:text-gray-200 bg-PrimaryWhite text-black h-screen w-full">
        {activeChat && (
          <ChatArea
            messages={messages} // Use messages state here
            onSend={handleSend}
            handleStateChange={(newState) =>
              navigate(`/${id}/source/${newState}`)
            }
          />
        )}

        {loading && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-20 flex justify-center items-center">
            <div className="relative">
              <Loader />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
