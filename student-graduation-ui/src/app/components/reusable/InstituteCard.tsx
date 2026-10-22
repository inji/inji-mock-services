import React from "react";
import type { Institute } from "@/data/types";

export interface InstituteCardProps {
  institute: Institute;
  logoSrc?: string;
}

export const InstituteCard: React.FC<InstituteCardProps> = ({ institute, logoSrc }) => {
  return (
    <div className="flex items-center gap-[12px]">
      {logoSrc && (
        <div className="w-[40px] h-[40px] flex items-center justify-center">
          <img src={logoSrc} alt={institute.name} className="max-h-full max-w-full object-contain" />
        </div>
      )}
      <div className="flex flex-col">
        <h3 className="font-['Cinzel:Bold',sans-serif] font-bold text-[24px] text-black leading-[32px]">
          {institute.name}
        </h3>
        <p className="font-['Inter:Light',sans-serif] font-light text-[16px] text-[#1c398e] tracking-[1px]">
          {institute.portalLabel}
        </p>
      </div>
    </div>
  );
};

export default InstituteCard;
