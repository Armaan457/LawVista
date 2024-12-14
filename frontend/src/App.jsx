import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // Import UUID
import Home from "./views/Home";
import MainSideBar from "./components/MainSideBar/MainSideBar";
import UploadDocument from "./views/UploadDocument";
import Casepdf from "./components/CasePdf/Casepdf";
import { Sidebar } from "./components/sidebar/sidebar";
import NotebookPage from "./views/Notebook";
import { Toaster } from "react-hot-toast";
import RegisterPage from "./views/Register";
import Draggable from "react-draggable";
import LoginPage from "./views/Login";
import MainHome from "./views/MainHome";
import AuthAxios from "./utils/authaxios";
import NoteBookMain from "./components/notebook/NotebookPage";
import { Pencil } from "lucide-react";
import NotebookWriter from "./components/notebook/NoteBookWriter";

const initialChats = [
  {
    id: "1",
    title: "Gujarat State vs Jetthalal",
    subtitle: "Gujarat State vs Jetthalal was an amazing case about...",
  },
  {
    id: "2",
    title: "Gujarat State vs Dhanji",
    subtitle: "Gujarat State vs Dhanji was an amazing case about...",
  },
];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isContrast, setIsContrast] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await AuthAxios.get("/chat");
      const data = res.data;
      setLoading(false);

      if (data.success) {
        setChats(data.data);
      } else {
        toast.error("Failed to fetch chats");
      }
    };
    fetch();
  }, []);

  const createChat = async () => {
    const newChatId = await uuidv4(); // Generate a new UUID
    const newChat = {
      chatId: newChatId,
      title: `New Chat ${newChatId.substring(0, 5)}`,
      subtitle: "This is a new chat",
    };

    setChats((prevChats) => {
      const updatedChats = [...prevChats, newChat];
      return updatedChats;
    });

    setActiveId(newChatId); // Set it as active
    navigate(`/${newChatId}`);
  };
  

  // Redirect to a new chat ID if user lands on "/"
  useEffect(() => {
    if (location.pathname === "/") {
      createChat(); // Automatically create a new chat if landing on "/"
    }
  }, [location.pathname]);

  // Function to create a new chat
  

  const setActiveChatId = (id) => {
    setActiveId(id);
    navigate(`/${id}`);
  };

  const handleSearch = (query) => {
    console.log("Searching:", query);
  };

  console.log(location.pathname);
  return (
    <div className={`${location.pathname === "/landing" ? " " : "flex flex-1 h-[100vh] dark:bg-PrimaryBlack bg-white"} ${isContrast ? "invert contrast-150 saturate-200 brightness-125" : ""}`}>
      <Toaster position="top-right" reverseOrder={false} />

      {!(
        location.pathname === "/landing" ||
        location.pathname === "/register" || location.pathname === "/login"
      ) && <MainSideBar setContrast={setIsContrast} />}

      <div className={location.pathname === "/landing" ? "" : "flex w-full"}>
        <div className={location.pathname === "/landing" ? "" : "flex w-full"}>
          <Routes>
            <Route path="/landing" element={<MainHome setContrast={setIsContrast} />} />
            <Route path="/:id" element={<Home />} />
            <Route path="/:id/source/:source" element={<Casepdf />} />
            <Route path="/upload" element={<UploadDocument />} />
            <Route path="/upload/:id" element={<UploadDocument />} />
            <Route path="/notebook" element={<NotebookPage />} />
            <Route path="/notebook/:id" element={<NoteBookMain />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
        {!(
          location.pathname === "/register" || location.pathname === "/login" || location === "/landing"
        ) && <NotebookWriter />}
      </div>
    </div>
  );
}
