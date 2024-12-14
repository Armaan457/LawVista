import MainLogo from "../assets/fullLogoSih.svg";
import bgLine from "../assets/pngs/bg-line.png";
import arrow from "../assets/svgs/arrow-right.svg";
import desktop from "../assets/svgs/desktop.svg";
import noteBox from "../assets/svgs/noteBox.svg";
import chatBox from "../assets/svgs/chatBox.svg";
import uploadBox from "../assets/svgs/uploadBox.svg";
import textBox from "../assets/svgs/textBox.svg";
import bentoGrid from "../assets/svgs/bentoGrid.svg";
import auction from "../assets/svgs/auction.svg";
import { useNavigate } from "react-router-dom";
import AccessibilityButton from "../components/AccessibilityButton";

const MainHome = ({setContrast}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <nav className="flex items-center flex-evenly justify-around py-4 drop-shadow-md bg-[#F4F6FC]/95 sticky top-0 z-10">
        <img src={MainLogo} />
        <div className="flex gap-16">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#footer">Contact</a>
        </div>
        <div className="flex gap-10 items-center">
          <button onClick={handleLogin}>Login</button>
          <Button showIcon={false} />
          <AccessibilityButton setIsContrast={setContrast} />
        </div>
      </nav>
      <main className="bg-[#F4F6FC] w-full min-h-full pb-14">
        {/* <img src={bgLine} className="absolute -z-10" /> */}

        <div className="flex flex-col items-center" id="home">
          <h1 className="mt-16 text-7xl font-semibold text-[#0E1A45] text-center">
            Meet Your Intelligent
            <br />
            ReSearch Engine
          </h1>
          <p className="mt-10 text-center leading-7 text-lg text-slate-600">
            The AI-powered workspace to help you read,
            <br />
            write, and organize research with ease.
          </p>
          <Button showIcon={true} classes="mt-5" />
          <img src={desktop} className="mt-7" />
        </div>

        <img
          src={noteBox}
          className="absolute top-0 right-0 -translate-x-72 translate-y-52"
        />
        <img
          src={textBox}
          className="absolute top-0 right-0 -translate-x-96 translate-y-96"
        />
        <img
          src={uploadBox}
          className="absolute top-0 left-0 translate-x-96 translate-y-96"
        />
        <img
          src={chatBox}
          className="absolute top-0 left-0 translate-x-64 translate-y-52"
        />
      </main>
      <div className="bg-[#EEF1FC]" id="features">
        <h2 className="text-[#0E1A45] font-semibold tracking-widest text-center pt-16">
          POWERFUL FEATURES
        </h2>
        <h1 className="mt-4 text-4xl font-semibold text-[#0E1A45] text-center">
          Research, Analyze and Note
        </h1>
        <p className="mt-4 text-center leading-7 text-lg text-slate-600">
          Get everything you need in an aesthetic,
          <br />
          analyzed and documented fashion.
        </p>
        <img src={bentoGrid} className="mt-10 mx-auto pb-16" />
      </div>

      <footer
        className="p-20 flex justify-center items-center bg-[#F4F6FC] gap-14"
        id="footer"
      >
        <img src={MainLogo} width={500} height={500} />
        <img src={auction} />
        <Button showIcon={true} classes="h-11" />
      </footer>
    </>
  );
};

export const Button = ({ showIcon, classes = "" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/register");
  };

  return (
    <button
      className={`bg-[#0E1A45] text-white px-5 py-2 rounded-md cursor-pointer hover:bg-[#192C6F] ${classes}`}
      onClick={handleClick}
    >
      <div className="flex m-auto">
        Get Started{showIcon && <img src={arrow} className="ml-3" />}
      </div>
    </button>
  );
};

export default MainHome;
