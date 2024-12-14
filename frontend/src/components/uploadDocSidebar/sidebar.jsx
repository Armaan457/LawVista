import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import upload from "../../assets/svgs/upload.svg";
import UploadButton from "./blueButton";
import DocumentListItem from "./upload-doc-list-item";
import { SearchBar } from "../sidebar/search-bar";

export function Sidebar({ activeDocId, docs, onDocSelect, handlePdfText }) {
  const navigate = useNavigate();
  const [filteredDocs, setFilteredDocs] = useState(docs); // State for filtered docs

  const f = async () => {
    const res = await fetch("http://localhost:3000/api/doc",{
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log("sidebar",data.data);
    setFilteredDocs(data.data);
  }

  useEffect(() => {
    f();
  }, []);


  // Handle search input
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredDocs(docs); // Reset to full docs list if search term is empty
      return;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = docs.filter((doc) =>
      doc.summary.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredDocs(filtered);
  };

  return (
    <div className="w-[400px] h-[100vh] dark:bg-PrimaryGrayDark bg-TertiaryWhite overflow-hidden">
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <h1 className="dark:text-gray-200 text-DarkBlue font-semibold">
            Your Documents
          </h1>
        </div>
      </div>

      <div className="px-4 pt-3 flex justify-center items-center flex-col gap-2">
        <UploadButton
          name="Upload Document"
          svg={upload}
          handleText={handlePdfText}
        />
        <SearchBar onSearch={handleSearch} /> {/* Pass handleSearch to SearchBar */}
      </div>

      <div className="flex-1 overflow-y-auto pl-5  max-h-[90vh] min-h-[70vh] overflow-auto">
        {filteredDocs &&
          filteredDocs.length > 0 &&
          filteredDocs.map((doc) => (
            <DocumentListItem
              key={doc.documentId}
              title={doc.summary}
              isActive={doc.documentId === activeDocId}
              onClick={() => {
                navigate(`/upload/${doc.documentId}`);
                onDocSelect(doc.documentId);
              }}
            />
          ))}
        {/* {filteredDocs.length === 0 && (
          <p className="text-gray-500 text-sm">No documents found.</p>
        )} */}
      </div>
    </div>
  );
}
