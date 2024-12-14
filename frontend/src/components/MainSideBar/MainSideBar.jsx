import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logoSih.svg";
import styles from "./MainSideBar.module.css";
import { LogOut } from "lucide-react";
import { User, MessageCircle, Upload, NotebookPen } from "lucide-react";
import { useEffect, useState } from "react";
import AuthAxios from "../../utils/authaxios";
import toast from "react-hot-toast";
import { MoonIcon, SunIcon } from "lucide-react";
import AccessibilityButton from "../AccessibilityButton";
import { Languages } from "lucide-react";
const MainSideBar = ({setContrast}) => {
  const location = useLocation();
  const router = useNavigate();
  const [showSource, setShowSource] = useState(false);

  // Initialize dark mode state from localStorage
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  // Language state from localStorage or default to 'English'
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem("targetLanguage");
    return savedLanguage || "English"; // Default to English
  });

  // Effect to apply theme on component mount and when dark state changes
  useEffect(() => {
    if (dark) {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // Effect to apply language change when it updates
  useEffect(() => {
    localStorage.setItem("targetLanguage", language);
  }, [language]);

  // Theme toggle handler
  const darkModeHandler = () => {
    setDark((prevDark) => !prevDark);
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLanguageChange = (lang) => {
    setLanguage(lang); // Update the language state
    console.log("Language changed to:", lang);
    
    // Set the language in localStorage
    localStorage.setItem("targetLanguage", lang);

    // Refresh the page to apply the changes
    window.location.reload();
    setShowSource(false); // Close the language dropdown
  };

  const languageOptions = {
    en: "English",
    hi: "Hindi",
    ta: "Tamil",
    te: "Telugu",
    bn: "Bengali",
    mr: "Marathi",
    //add more languages and short codes here
    pu : "Punjabi",
    gu : "Gujarati",
    or : "Oriya",
    as : "Assamese",
    ka : "Kannada",
    ma : "Malayalam",
    ur : "Urdu",
    sa : "Sanskrit",
    ne : "Nepali",
    bh : "Bhojpuri",
  };

  return (
    <div className="min-w-[70px] dark:bg-PrimaryBlack bg-DarkBlue flex flex-col items-center py-4 justify-between">
      <div>
        <img
          src={logo}
          style={{ marginLeft: "-2px" }}
          className={styles.logo}
          alt=""
        />
        <div onClick={() => setShowSource(!showSource)}>
          <Languages
            size={30}
            color="white"
            style={{
              marginTop: "20px",
              marginLeft: "5px",
            }}
          />
        </div>

        {/* Language Dropdown */}
        {showSource && (
          <div className="bg-white text-black absolute p-3 mt-2 rounded-xl shadow-lg w-32 z-10">
            <ul>
              {Object.entries(languageOptions).map(([code, name]) => (
                <li
                  key={code}
                  className="cursor-pointer py-1 px-2 hover:bg-gray-200 rounded"
                  onClick={() => handleLanguageChange(name)} // Use language name for the selection
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          style={{
            marginTop: "100px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "30px",
          }}
        >
          {/* Home */}
          <div
            className={`${styles.logoDiv} ${
              isActive("/") && !isActive("/upload") && !isActive("/notebook")
                ? "bg-PrimaryBlue p-1.5 rounded-xl"
                : ""
            }`}
            onClick={() => {
              router("/");
            }}
          >
            <MessageCircle
              size={27}
              color={`${
                isActive("/") && !isActive("/upload") && !isActive("/notebook")
                  ? "white"
                  : "gray"
              }`}
            />
          </div>

          {/* Upload */}
          <div
            className={`${styles.logoDiv} ${
              isActive("/upload") ? "bg-PrimaryBlue p-1.5 rounded-xl" : ""
            }`}
            onClick={() => {
              router("/upload");
            }}
          >
            <Upload
              size={27}
              color={`${isActive("/upload") ? "white" : "gray"}`}
            />
          </div>

          {/* Notebook */}
          <div
            className={`${styles.logoDiv} ${
              isActive("/notebook") ? "bg-PrimaryBlue p-1.5 rounded-xl" : ""
            }`}
            onClick={() => {
              router("/notebook");
            }}
          >
            <NotebookPen
              size={27}
              color={`${isActive("/notebook") ? "white" : "gray"}`}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="text-white">
          <button onClick={darkModeHandler}>
            {dark ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>

        <div>
          <AccessibilityButton setIsContrast={setContrast} white={true} />
        </div>

        <div
          onClick={async () => {
            const response = await AuthAxios.get("/auth/logout");
            const data = response.data;
            if (data.success) {
              toast.success("Logged out successfully");
              router("/landing");
            }
          }}
        >
          <LogOut size={30} color="white" />
        </div>
        <div
          style={{
            height: "30px",
            width: "30px",
            borderRadius: "50%",
            backgroundColor: "#FFA500",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <User size={25} color="white" />
        </div>
      </div>
    </div>
  );
};

export default MainSideBar;
