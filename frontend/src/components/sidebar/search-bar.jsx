import { useState } from "react";
import search from "../../assets/svgs/search.svg";

export function SearchBar({ onSearch }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="px-4 py-2 gap-0.5 w-full">
      <div className="relative flex dark:bg-PrimaryGrayLight dark:text-PrimaryGrayTextLight bg-PrimaryWhite text-PrimaryGrayDark px-3 rounded-lg">
        {/* Toggle visibility of the SVG icon */}
        <img
          src={search}
          alt="searchicon"
          className={`transition-opacity ${isFocused ? "opacity-0" : "opacity-100"}`}
        />
        <input
          type="text"
          placeholder="Search"
          className="w-full dark:bg-PrimaryGrayLight dark:text-PrimaryGrayTextDark dark:placeholder:text-PrimaryGrayTextDark bg-PrimaryWhite text-PrimaryGrayDark placeholder:text-PrimaryGrayDark rounded-lg pl-1 pr-10 py-2"
          onChange={(e) => onSearch?.(e.target.value)}
          onFocus={() => setIsFocused(true)} // Set focused state to true
          onBlur={() => setIsFocused(false)} // Reset focused state to false
        />
      </div>
    </div>
  );
}
