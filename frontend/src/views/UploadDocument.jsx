import { useEffect, useState } from "react";
import { Sidebar } from "../components/uploadDocSidebar/sidebar";
import SummarySection from "../components/uploadDocSidebar/summary-section";
import Loader from "../components/uploadDocSidebar/loader";
import { v4 as uuidv4 } from "uuid";
import AuthAxios from "../utils/authaxios";
import { useNavigate, useParams } from "react-router-dom";
import chatTriangler from "../assets/svgs/chat-triangle.svg";
import Markdown from "react-markdown";
import TextToSpeech from "../utils/TextToSpeech";
import { translateToLanguage } from "../services/LanguageEnglish";
const UploadDocument = () => {
  const { id } = useParams();
  const [activeDocId, setActiveDocId] = useState(id);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStageTime, setLoadingStageTime] = useState(1000);
  const [summary, setSummary] = useState("");
  const [judgement, setJudgement] = useState("");
  const [paths, setPaths] = useState([]);
  const [lsi, setLsi] = useState(null);
  const [loadingJudgement, setLoadingJudgement] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [translatedSummary, setTranslatedSummary] = useState("");
  const [translatedjudgement, setTranslatedjudgement] = useState("");

  const navigate = useNavigate();

  const toggleKey = (key) => {
    setSelectedKey(selectedKey === key ? null : key);
  };

  const CallSummarizeApi = async (text) => {
    try {
      setLoading(true);

      const startTime = Date.now();
      const response = await fetch("http://127.0.0.1:8000/api/summarize/", {
        // credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input_text: text }),
      });

      const data = await response.json();
      const duration = Date.now() - startTime;

      setLoadingStageTime(duration + 1000);
      setSummary(data?.summary_text || "");
      setJudgement(data?.case_outcome || "");
      setLsi(data?.legalStatute || {});
      setPaths(data?.paths || []);
      const translation = await translateToLanguage(data?.summary_text, "en");
          const judgementTranslation = await translateToLanguage(data?.case_outcome, "en");
          setTranslatedSummary(translation);
          setTranslatedjudgement(judgementTranslation);

      const res = await AuthAxios.post("/doc", {
        summary: data?.summary_text || "",
        paths: data?.paths || [],
        judgement: data?.case_outcome || "",
        documentId: await uuidv4(),
        statutes: data?.legalStatute || {},
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error during API call:", error);
    }
  };
  
  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await AuthAxios.get("/doc");
      const data = res.data;
      if (data.success) {
        setDocs(data.data);
        if (data.data.length > 0) {
          const firstDoc = data.data[0];
          setActiveDocId(firstDoc.id);
          setSummary(firstDoc.summary || "");
          setPaths(firstDoc.paths || []);
          setJudgement(firstDoc.judgement || "");
          setLsi(firstDoc.statutes || {});
          const translation = await translateToLanguage(firstDoc.summary, "en");
          const judgementTranslation = await translateToLanguage(firstDoc.judgement, "en");
          setTranslatedSummary(translation);
          setTranslatedjudgement(judgementTranslation);
        }
      } else {
        console.error("Failed to fetch documents");
      }

    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  useEffect(() => {
    if (activeDocId) {
      const fetchActiveDoc = async () => {
        setLoading(true);
        try {
          const res = await AuthAxios.get(`/doc/${activeDocId}`);
          const data = res.data;
          if (data.success) {
            setSummary(data.data.summary || "");
            setPaths(data.data.paths || []);
            setLsi(data.data.statutes || {});
            console.log(data.data.statutes);
            setJudgement(data.data.judgement || "");
            const translation = await translateToLanguage(firstDoc.summary, "en");
          const judgementTranslation = await translateToLanguage(firstDoc.judgement, "en");
          setTranslatedSummary(translation);
          setTranslatedjudgement(judgementTranslation);
          } else {
            console.error("Failed to fetch the active document");
          }
        } catch (err) {
          console.error("Error fetching active document:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchActiveDoc();
    }
  }, [activeDocId]);

  return (
    <div className="dark:bg-PrimaryBlack dark:text-gray-200 bg-PrimaryWhite text-black min-h-screen w-full flex justify-center">
      <div className="min-h-screen">
        <Sidebar
          activeDocId={activeDocId}
          docs={docs}
          onDocSelect={(docId) => setActiveDocId(docId)}
          handlePdfText={(text) => CallSummarizeApi(text)}
        />
      </div>

      {loading && <Loader loadingStageTime={loadingStageTime} />}

      <div className="flex-1 gap-4 p-10 dark:bg-PrimaryBlack bg-PrimaryWhite max-h-[100vh] w-[70vw] overflow-y-scroll">
        {!loading && summary && (
          <div>
            <h3 className="ml-5 mt-5 text-5xl font-extrabold">Summary</h3>
            <p className="p-4 dark:bg-PrimaryGrayLight dark:text-white text-black bg-SecondaryWhite h-fit w-[80%] m-5 rounded-md">
              <div className="my-2">
                <TextToSpeech text={summary} />
              </div>
              {translatedSummary}
            </p>
          </div>
        )}

        {!loadingJudgement && judgement && (
          <div>
            <h3 className="ml-5 mt-5 text-5xl font-extrabold">Judgement</h3>
            <p className="p-4 dark:bg-PrimaryGrayLight dark:text-white text-black bg-SecondaryWhite h-fit w-[80%] m-5 rounded-md">
              <div className="my-2">
                <TextToSpeech text={judgement} />
              </div>

              {translatedjudgement}
            </p>
          </div>
        )}

        <div className="pt-4 px-6 rounded-xl">
          {lsi && lsi.length > 0 && (
            <h1
              className="text-xxl font-bold mb-2"
              style={{
                fontSize: "2.5rem",
              }}
            >
              LAWS
            </h1>
          )}
          {lsi && lsi.length > 0 && (
            <div className="space-y-2">
              {lsi.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedKey(item.description);
                  }}
                  className="dark:bg-PrimaryGrayLight text-black bg-SecondaryWhite rounded-xl p-3 flex justify-between items-center"
                >
                  <div>
                    <h5 className="dark:text-gray-200 text-black">
                      {item.Law}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {selectedKey && (
          <div className="sidebarMain relative bg-blue-700">
            {/* Close Button */}
            <button
              onClick={() => setSelectedKey(null)}
              className="absolute top-2 right-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              &times;
            </button>

            {/* Markdown Content */}
            <Markdown className="dark:text-gray-200 text-white p-4">
              {selectedKey}
            </Markdown>
          </div>
        )}

        {paths && paths.length > 0 && (
          <div className="mt-4 pl-4">
            <h4
              style={{
                fontSize: "2.5rem",
              }}
              className="dark:text-gray-200 mb-2 text-black text-lg font-bold mb-2"
            >
              Prior Case Retrieval
            </h4>
            <div className="space-y-2">
              {paths.map((path, index) => (
                <div
                  key={index}
                  className="dark:bg-PrimaryGrayLight bg-SecondaryWhite rounded-xl p-3 flex justify-between items-center"
                >
                  <div>
                    <h5 className="black:text-gray-200 text-black">{path}</h5>
                  </div>
                  <button
                    onClick={() => {
                      const pathname = path.split(".")[0];
                      navigate(`/files/source/${pathname}`);
                    }}
                    className="px-5 py-2 flex flex-row-reverse items-center gap-2 text-sm dark:bg-PrimaryGrayLighter bg-TertiaryWhite dark:text-gray-200 text-black rounded-xl hover:bg-PrimaryGrayDark/30 transition-colors"
                  >
                    <img
                      src={chatTriangler}
                      alt="chat"
                      className="dark:text-gray-200"
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
  );
};

export default UploadDocument;
