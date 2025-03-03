
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { translateToLanguage } from "../../services/LanguageEnglish"; // Assuming you have this service
import Summary from "../summary/SummarySection";

const Casepdf = () => {
  const [caseData, setCaseData] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(""); // To store PDF file URL
  const [selectedSections, setSelectedSections] = useState([]); // Tracks selected sections
  const [translatedContent, setTranslatedContent] = useState({}); // To store translated content

  const [text, setText] = useState("");
  const { source } = useParams();
  const [summary, setSummary] = useState(false);

  useEffect(()=>{
    const fetchText = async () => {
      const response = await axios.get(`https://pub-d58fae2843f34cfcbf2cfb0606b5efaf.r2.dev/judgmenttxts/${source}.txt`);
      const data = response.data;
      setText(data);
    }
    fetchText();
  },[summary])

  // Fetch data when component mounts or source changes
  useEffect(() => {
    const fetchCaseData = async () => {
      const response = await fetch(`https://lawvista.onrender.com/api/cases/${source}`);
      const data = await response.json();
      setCaseData(data);
    };
    fetchCaseData();
  }, [source]);

  // Fetch PDF URL if judgement_path is available
  useEffect(() => {
    if (caseData?.data?.judgement_path) {
      const pdfPath = caseData.data.PDF_Path; // Assuming this field contains the PDF file path
      const pdfUrl = `https://pub-d58fae2843f34cfcbf2cfb0606b5efaf.r2.dev/${pdfPath}`;
      setPdfUrl(pdfUrl);
    }
  }, [caseData]);

  // Function to handle the translation of content
  const handleTranslation = async (text, lang) => {
    try {
      const translatedText = await translateToLanguage(text, lang);
      return translatedText;
    } catch (error) {
      console.error("Error translating content:", error);
      return text; // Fallback to original content if translation fails
    }
  };

  // Translate case details when language is selected
  useEffect(() => {
    const translateCaseData = async () => {
      const targetLang = localStorage.getItem("targetLanguage") || "hi"; // Default to English

      const translatedCaseData = {
        CourtName: await handleTranslation(caseData?.data?.Court_Name, targetLang),
        CaseTitle: await handleTranslation(caseData?.data?.Case_Title, targetLang),
        Author: await handleTranslation(caseData?.data?.Judgment_Author, targetLang),
        Bench: await handleTranslation(caseData?.data?.Bench, targetLang),
        Citations: await handleTranslation(caseData?.data?.Citations, targetLang),
      };

      setTranslatedContent(translatedCaseData);
    };

    if (caseData) {
      translateCaseData(); // Trigger translation once case data is fetched
    }
  }, [caseData]);

  // Toggle selection for a section
  const handleCheckboxChange = (section) => {
    setSelectedSections((prev) =>
      prev.includes(section)
        ? prev.filter((item) => item !== section)
        : [...prev, section]
    );
  };

  // Function to render selected content with headings
  const renderSelectedContent = () => {
    if (selectedSections.length === 0) {
      return null;
    }

    let hasContent = false;
    const contentSections = selectedSections.map((section) => {
      let content;
  
      if (section === "Issues") {
        content = caseData?.data?.Issues?.map((issue, index) => (
          <p key={index}>{issue || "No issue provided"}</p>  // Default content if issue is missing
        ));
      } else if (section === "Facts") {
        content = caseData?.data?.Facts?.map((fact, index) => (
          <p key={index}>{fact || "No fact provided"}</p>  // Default content if fact is missing
        ));
      } else if (section === "Conclusions") {
        content = caseData?.data?.Conclusions?.map((conclusion, index) => (
          <p key={index}>{conclusion || "No conclusion provided"}</p>  // Default content if conclusion is missing
        ));
      }

      if (content && content.length > 0) {
        hasContent = true;
        return (
          <div
            className="dark:bg-PrimaryGrayLight bg-TertiaryWhite dark:text-white text-black p-4 rounded-md mb-4"
            key={section}
            style={{ marginTop: "20px" }}
          >
            <h3 className="dark:text-white text-black font-semibold text-xl">
              {section}
            </h3>
            {content}
          </div>
        );
      }
      return null;
    });

    return (
      <>
        {contentSections}
        {!hasContent &&
          selectedSections.length !=
            0(
              <p style={{ color: "white", marginTop: "20px" }}>
                No content available for the selected sections.
              </p>
            )}
      </>
    );
  };

  const isCitations = caseData?.data?.Citations !== "Not Found";
  const isBenchFound = caseData?.data?.Bench !== "Not Found";
  const isAuthorFound = caseData?.data?.Judgment_Author !== "Not Found";

  return (
    <div className="flex-1 flex flex-col max-h-[100vh] overflow-scroll dark:bg-PrimaryBlack bg-PrimaryWhite items-center py-8" style={{ scrollbarWidth: "none" }}>
      <h2 className="dark:text-white text-black">
        {translatedContent?.CourtName || "Loading..."}
      </h2>
      <h1 className="dark:text-white text-black my-4 text-2xl font-bold">
        {translatedContent?.CaseTitle || "Loading..."}
      </h1>
      <h3 className="dark:text-[#787878] text-PrimaryGrayDark">
        Author: {isAuthorFound ? translatedContent?.Author : "Not Found"}
      </h3>
      <h4 className="dark:text-[#787878] text-PrimaryGrayLight">
        Bench: {isBenchFound ? translatedContent?.Bench : "Not Found"}
      </h4>
      {isCitations && (
        <h4 className="dark:text-[#787878] text-PrimaryGrayDark">
          Citations: {translatedContent?.Citations || "Loading..."}
        </h4>
      )}

      <div className="inputCheckbox" style={{ margin: "20px 0", color: "white" }}>
        {caseData?.data?.Issues.length > 0 && (
          <label>
            <input
              type="checkbox"
              checked={selectedSections.includes("Issues")}
              onChange={() => handleCheckboxChange("Issues")}
            />
            Issues
          </label>
        )}
        {caseData?.data?.Facts.length > 0 && (
          <label style={{ marginLeft: "10px" }}>
            <input
              type="checkbox"
              checked={selectedSections.includes("Facts")}
              onChange={() => handleCheckboxChange("Facts")}
            />
            Facts
          </label>
        )}
        {caseData?.data?.Conclusions.length > 0 && (
          <label style={{ marginLeft: "10px" }}>
            <input
              type="checkbox"
              checked={selectedSections.includes("Conclusions")}
              onChange={() => handleCheckboxChange("Conclusions")}
            />
            Conclusions
          </label>
        )}
      </div>
      {
        summary ? <Summary text={text}/> : null
      }
        

      <button className={`bg-PrimaryBlue text-white px-12 hover:bg-blue-700 py-3 rounded-lg ${summary ? "hidden" : ""}`}
        onClick={() => setSummary(true)}
      
      >Generate Summary</button>
      <div style={{ marginTop: "20px", width: "80%" }}>
        {renderSelectedContent()}
      </div>
      <div style={{ height: "80vh", width: "60vw", margin: "auto", marginBottom: "100px" }}>
        <iframe
          src={pdfUrl}
          style={{ width: "100%", minHeight: "100vh" }}
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  );
};

export default Casepdf;
