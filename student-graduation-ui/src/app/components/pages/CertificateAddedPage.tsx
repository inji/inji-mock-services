import { useState, useEffect } from "react";
import { instituteService } from "@/services";
import type { Institute } from "@/data/types";
import imgLogo from "@/imports/EducationalInstitutePortal-7/73da5574736f6a1e3d533885140e2c14827bbc1f.png";

function Header({ institute }: { institute: Institute | null }) {
  return (
    <header className="w-full bg-white border-b border-[#e5e7eb] px-[32px] md:px-[64px] py-[16px] sticky top-0 z-50">
      <div className="max-w-[1240px] mx-auto flex items-center justify-between w-full">
        <div className="flex gap-[12px] items-center">
          <div className="h-[40px] w-[61px] relative shrink-0">
            <img alt="Logo" className="inset-0 size-full object-contain pointer-events-none" src={imgLogo} />
          </div>
          <div className="flex flex-col">
            <span className="font-['Cinzel:Bold',sans-serif] font-bold text-[22px] text-black leading-tight">
              {institute?.name || "UNIVERSITY OF UTOPIA"}
            </span>
            <span className="font-['Inter:Light',sans-serif] font-light text-[#1c398e] text-[14px] tracking-[1px] leading-tight">
              {institute?.portalLabel || "Admin Portal"}
            </span>
          </div>
        </div>

        <button 
          onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "logout" }))}
          className="bg-[#5985e1] hover:bg-[#4a74cc] text-white px-[16px] py-[8px] rounded-[8px] flex items-center gap-[8px] font-medium text-[14px] transition-colors shadow-sm cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}

export default function CertificateAddedPage() {
  const [institute, setInstitute] = useState<Institute | null>(null);

  useEffect(() => {
    instituteService.getInstitute().then(setInstitute);
  }, []);

  return (
    <div className="bg-[#eaecf0] min-h-screen w-full flex flex-col" data-name="Educational Institute Portal">
      <Header institute={institute} />

      <div className="flex-1 w-full flex items-center justify-center p-[24px]">
        <div className="w-full max-w-[580px] bg-white rounded-[20px] border border-[#e5e7eb] p-[44px] shadow-md flex flex-col items-center text-center">
          {/* Green Check Icon Badge */}
          <div className="size-[72px] rounded-full bg-[#00c04b] flex items-center justify-center text-white shadow-sm">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          {/* Heading and Description */}
          <h2 className="text-[26px] font-bold text-[#101828] mt-[24px]">
            Certificate Information Added!
          </h2>
          <p className="text-[15px] text-[#475467] leading-[22px] max-w-[420px] mt-[10px]">
            The certificate details have been successfully saved to the system. The student can now request their digital certificate.
          </p>

          {/* Divider */}
          <hr className="w-full border-t border-[#f2f4f7] my-[28px]" />

          {/* Action Button */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "student-registry" }))}
            className="px-[28px] py-[12px] bg-black hover:bg-neutral-800 text-white rounded-[8px] text-[15px] font-semibold transition-colors cursor-pointer shadow-sm"
            data-name="Button"
          >
            Back to Student Registry
          </button>
        </div>
      </div>
    </div>
  );
}
