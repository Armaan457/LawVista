import chatTriangler from "../../assets/svgs/chat-triangle.svg";

export function ChatInput({ onSend }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("message");
    if (input.value.trim()) {
      onSend(input.value);
      input.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 ">
      <div className="relative">
        <input
          name="message"
          type="text"
          placeholder="Ask your query..."
          className="w-full dark:bg-PrimaryGrayDark bg-TertiaryWhite dark:text-PrimaryGrayTextDark text-PrimaryGrayDark rounded-lg pl-4 pr-12 py-5  "
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text- transition-colors dark:bg-PrimaryBlue bg-DarkBlue rounded-lg"
        >
          <img src={chatTriangler} alt="chat" />
        </button>
      </div>
    </form>
  );
}
