import { useRef } from "react"
import pdfToText from "react-pdftotext";

const UploadButton = ({ name, svg,handleText }) => {
  const fileInput = useRef();

  

  const handleClick = () => {
    if(fileInput.current) {
      fileInput.current.click();
    }
  }

  function extractText(event) {
    const file = event.target.files[0];
    pdfToText(file)
      .then((text) => {
        handleText(text);
      })
      .catch((error) =>
        console.error(error, "Failed to extract text from pdf")
      );
  }

  return (
    <button className="bg-PrimaryBlue text-white px-5 py-1.5 rounded-md flex w-full justify-center items-center gap-2 hover:bg-blue-500 transition-colors" onClick={handleClick}>
        {name}
        <img src={svg} alt="chat" width={18} height={10} />
        <input type="file" className="hidden" ref={fileInput}  accept=".pdf, .doc, .docx" onChange={extractText} />
    </button>
  )
}

export default UploadButton
