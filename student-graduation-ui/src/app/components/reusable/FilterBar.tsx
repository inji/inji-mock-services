import React from "react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDropdownProps {
  label?: string;
  value: string;
  options: (string | FilterOption)[];
  onChange: (value: string) => void;
  className?: string;
}

export const FilterBar: React.FC<FilterDropdownProps> = ({
  label,
  value,
  options,
  onChange,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-[4px] ${className}`}>
      {label && <label className="text-[12px] font-medium text-[#364153]">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-[12px] py-[8px] border border-[#d1d5dc] rounded-[8px] text-[14px] bg-white outline-none focus:border-[#155dfc] cursor-pointer"
      >
        {options.map((opt, idx) => {
          const optValue = typeof opt === "string" ? opt : opt.value;
          const optLabel = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={idx} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default FilterBar;
