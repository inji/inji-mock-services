import { useState, useEffect } from "react";
import { instituteService } from "@/services/instituteService";
import { studentPortalService } from "@/services/studentPortalService";
import { authService } from "@/services/authService";
import type { Institute, AcademicPerformanceData, SemesterRecord, CourseGrade } from "@/data/types";
import imgLogo from "@/imports/EducationalInstitutePortal-1/73da5574736f6a1e3d533885140e2c14827bbc1f.png";
import { Navbar } from "@/app/components/reusable/Navbar";

function BackLink() {
  return (
    <div
      className="flex items-center gap-[8px] cursor-pointer"
      data-name="Button"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M15.8333 10H4.16667" stroke="#6b7280" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 15.8333L4.16667 10L10 4.16667" stroke="#6b7280" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="font-['Inter:Medium',sans-serif] font-medium text-[14px] text-[#4a5565] leading-[20px] tracking-[-0.1504px]">
        Back to Dashboard
      </span>
    </div>
  );
}

// --- Icons ---

function RibbonIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white">
      <circle cx="12" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.5 12.5L7 21L12 18L17 21L15.5 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-[#101828]">
      <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 6H23V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// --- Main Page ---

export default function StudentGradesPage() {
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [data, setData] = useState<AcademicPerformanceData | null>(null);

  useEffect(() => {
    instituteService.getInstitute().then(setInstitute);
    
    const loggedInId = authService.getLoggedInStudentId();
    if (!loggedInId) {
      window.dispatchEvent(new CustomEvent("navigate", { detail: "student-login" }));
      return;
    }
    
    studentPortalService.getAcademicPerformance(loggedInId).then(setData);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    authService.setLoggedInStudentId(null);
    window.dispatchEvent(new CustomEvent("navigate", { detail: "student-login" }));
  };

  return (
    <div className="bg-[#e5e7eb] min-h-screen w-full flex flex-col">
      {institute && (
        <Navbar
          institute={{ ...institute, portalLabel: "Student Portal" }}
          logoSrc={imgLogo}
          onLogout={handleLogout}
        />
      )}

      <div className="w-full flex-1 px-[64px] py-[32px] flex flex-col gap-[24px] items-center">
        <div className="w-full max-w-[1000px] flex flex-col gap-[24px] items-start">
          <BackLink />

          <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-[40px] w-full">
          <h1 className="font-['Inter:Bold',sans-serif] font-bold text-[24px] text-[#101828] leading-[32px] mb-[32px]">
            Academic Performance
          </h1>

          {/* Highlights */}
          {data && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] mb-[40px]">
              <div className="bg-[#263961] rounded-[12px] p-[32px] flex items-center justify-between">
                <div>
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[rgba(255,255,255,0.7)] leading-[20px] mb-[8px]">
                    Overall CGPA
                  </p>
                  <p className="font-['Inter:Bold',sans-serif] font-bold text-[40px] text-white leading-[48px]">
                    {data.overallCgpa.toFixed(1)}
                  </p>
                </div>
                <RibbonIcon />
              </div>
              
              <div className="bg-[#bfdbfe] rounded-[12px] p-[32px] flex items-center justify-between">
                <div>
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#4a5565] leading-[20px] mb-[8px]">
                    Credits Completed
                  </p>
                  <p className="font-['Inter:Bold',sans-serif] font-bold text-[40px] text-[#101828] leading-[48px]">
                    {data.creditsCompleted}/{data.totalCredits}
                  </p>
                </div>
                <TrendUpIcon />
              </div>
            </div>
          )}

        </div>
        </div>
      </div>
    </div>
  );
}
