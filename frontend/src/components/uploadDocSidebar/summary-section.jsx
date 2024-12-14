import LegalStatures from "./legal-staturers";
import chatTriangler from "../../assets/svgs/chat-triangle.svg";
import TextToSpeech from "../../utils/TextToSpeech";

const SummarySection = ({ document }) => {
  return (
    <div className="p-10 flex flex-col h-screen w-full">
      <div className="flex-1 overflow-y-auto p-7 space-y-6 no-scrollbar">
        <h1 className="text-3xl font-semibold text-center">
          {document.title.split(".")[0]}
        </h1>
        <div className="bg-PrimaryGrayDark p-7 rounded-2xl my-5">
          <h1 className="font-bold text-PrimaryGrayTextDark">Summary</h1>
          <p className="mt-5 leading-8">{document.summary}</p>
        </div>

        <div className="bg-PrimaryGrayDark p-7 rounded-2xl my-5">
          <h1 className="font-bold text-PrimaryGrayTextDark">
            Judgement Prediction
          </h1>
          <p className="mt-5 leading-8">{document.prediction}</p>
        </div>

        <div className="bg-PrimaryGrayDark p-7 rounded-2xl my-5">
          <h1 className="font-bold text-PrimaryGrayTextDark">Legal Statures</h1>
          <div className="mt-5 leading-8">
            {document.statures.map((stature, index) => (
              <LegalStatures
                key={stature.id}
                index={index + 1}
                stature={stature.section}
              />
            ))}
          </div>
        </div>

        <div className="bg-PrimaryGrayDark p-7 rounded-2xl my-5">
          <h1 className="font-bold text-PrimaryGrayTextDark">Relevant Cases</h1>
          <div className="mt-5 leading-8">
            
            {document.sources && document.sources.length > 0 && (
              <div>
                  {document.sources.map((source, index) => (
                    <div
                      key={index}
                      className="bg-PrimaryGrayLight rounded-xl p-3 flex justify-between items-center"
                    >
                      <div>
                        <h5 className="text-gray-200">{source.title}</h5>
                        <p className="text-PrimaryGrayTextDark text-sm">
                          {source.subtitle}
                        </p>
                      </div>
                      <button
                        onClick={source.onView}
                        className="px-5 py-2 text-sm bg-PrimaryGrayLighter text-gray-200 rounded-xl hover:bg-PrimaryGrayDark/30 transition-colors flex justify-center items-center space-x-1 gap-2 "
                      >
                        <img
                          src={chatTriangler}
                          alt="chat"
                          width={15}
                          height={10}
                        />
                        View Document
                      </button>
                    </div>
                  ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
