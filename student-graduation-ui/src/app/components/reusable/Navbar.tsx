import React from "react";
import type { Institute } from "@/data/types";
import InstituteCard from "./InstituteCard";

export interface NavbarProps {
  institute: Institute;
  logoSrc?: string;
  onLogout?: () => void;
  showLogout?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  institute,
  logoSrc,
  onLogout,
  showLogout = true,
}) => {
  return (
    <div className="relative z-10 bg-white content-stretch flex h-[81px] items-center justify-between px-[64px] w-full border-b border-[#e5e7eb]">
      <div className="absolute top-0 bottom-0 -left-[100vw] -right-[100vw] bg-white border-b border-[#e5e7eb] -z-10" />
      <InstituteCard institute={institute} logoSrc={logoSrc} />
      {showLogout && onLogout && (
        <button
          onClick={onLogout}
          className="flex items-center gap-[8px] text-[#4a5565] font-['Inter:Medium',sans-serif] font-medium text-[14px] leading-[20px] tracking-[-0.1504px] hover:text-[#101828] transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.3333 14.1667L17.5 10L13.3333 5.83333" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17.5 10H7.5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Logout</span>
        </button>
      )}
    </div>
  );
};

export default Navbar;
