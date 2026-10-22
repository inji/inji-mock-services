import { useState, useEffect } from "react";
import { instituteService } from "@/services/instituteService";
import { studentPortalService } from "@/services/studentPortalService";
import { authService } from "@/services/authService";
import type { Institute, Student } from "@/data/types";
import imgLogo from "@/imports/EducationalInstitutePortal-1/73da5574736f6a1e3d533885140e2c14827bbc1f.png";
import { Navbar } from "@/app/components/reusable/Navbar";

// --- Back Link ---

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

// --- Info Field ---

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-[#6b7280] leading-[18px]">
        {label}
      </p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#101828] leading-[20px] mt-[4px]">
        {value}
      </p>
    </div>
  );
}

const formatDate = (dateString?: string) => {
  if (!dateString || dateString === "—") return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

// --- Main Page ---

export default function StudentProfilePage() {
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    instituteService.getInstitute().then(setInstitute);
    
    const loggedInId = authService.getLoggedInStudentId();
    if (!loggedInId) {
      window.dispatchEvent(new CustomEvent("navigate", { detail: "student-login" }));
      return;
    }
    
    studentPortalService.getStudentProfile(loggedInId).then((s) => {
      if (s) setStudent(s);
    });
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
        <div className="w-full max-w-[900px] flex flex-col gap-[24px] items-start">
          <BackLink />

          <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-[40px] w-full">
          {/* Header */}
          <div className="flex items-center gap-[20px] mb-[40px]">
            <div className="bg-[#263961] size-[72px] rounded-full flex items-center justify-center shrink-0">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 12C14.4853 12 16.5 9.98528 16.5 7.5C16.5 5.01472 14.4853 3 12 3C9.51472 3 7.5 5.01472 7.5 7.5C7.5 9.98528 9.51472 12 12 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.5 21C4.5 17.6863 7.85786 15 12 15C16.1421 15 19.5 17.6863 19.5 21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="font-['Inter:Bold',sans-serif] font-bold text-[24px] text-[#101828] leading-[32px]">
                My Profile
              </h1>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#6b7280] leading-[20px]">
                View your personal information
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-[40px]">
            <h2 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] text-[#101828] leading-[24px] mb-[16px]">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[24px] gap-x-[48px] border-t border-[#f3f4f6] pt-[24px]">
              <InfoField label="Full Name" value={student?.fullName || "—"} />
              <InfoField label="Student ID" value={student?.studentId || "—"} />
              <InfoField label="Email Address" value={student?.email || "—"} />
              <InfoField label="Phone Number" value={student?.phone || "—"} />
              <InfoField label="Date of Birth" value={formatDate(student?.dateOfBirth)} />
              <InfoField label="Address" value={student?.address || "—"} />
            </div>
          </div>

          {/* Academic Information */}
          <div>
            <h2 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] text-[#101828] leading-[24px] mb-[16px]">
              Academic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[24px] gap-x-[48px] border-t border-[#f3f4f6] pt-[24px]">
              <InfoField label="Course" value={student?.course || "—"} />
              <InfoField label="Current Year" value={student?.year || "—"} />
              <InfoField label="Enrollment Date" value={formatDate(student?.enrollmentDate)} />
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
