import React from "react";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-[36px] pr-[16px] py-[8px] border border-[#d1d5dc] rounded-[8px] text-[14px] outline-none focus:border-[#155dfc]"
      />
      <div className="absolute left-[10px] pointer-events-none text-[#99a1af]">
        <svg className="size-[16px]" fill="none" viewBox="0 0 20 20" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
};

export default SearchBar;
