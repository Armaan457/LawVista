import { useSpeechSynthesis } from "react-speech-kit";

const TextToSpeech = ({ text }) => {
  const { speak } = useSpeechSynthesis();

  return <div>
    <button className="bg-PrimaryBlue px-4 py-1 rounded-md text-white" onClick={() => speak({ text: text })}>Speak</button>
  </div>;
};

export default TextToSpeech;
