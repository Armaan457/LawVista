import { LucideAccessibility } from "lucide-react";

const AccessibilityButton = ({ setIsContrast, white = false }) => {
  const handleClick = () => {
    setIsContrast((prev) => !prev);
  };

  return (
    <button onClick={handleClick}>
      <LucideAccessibility className={white ? "text-white" : ""} />
    </button>
  );
};

export default AccessibilityButton;
