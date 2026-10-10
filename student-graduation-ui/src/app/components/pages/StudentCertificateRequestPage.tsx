import { useState, useEffect } from "react";
import { instituteService } from "@/services/instituteService";
import { studentPortalService } from "@/services/studentPortalService";
import { authService } from "@/services/authService";
import type { Institute, Student } from "@/data/types";
import imgLogo from "@/imports/EducationalInstitutePortal-1/73da5574736f6a1e3d533885140e2c14827bbc1f.png";
import { Navbar } from "@/app/components/reusable/Navbar";

// ---------------------------------------------------------------------------
// Student Certificate Request Page
// Matches Figma design precisely:
// - Outer background is seamless grey #e5e7eb with Navbar and Logout button
// - Wide card (max-w-[960px]) so eligibility status fits on 1 line
// - Confirmation text wraps cleanly into exactly 2 lines
// - Interactive checkbox with checkmark [✓]
// - Button starts in soft periwinkle blue (#8aaefd) and turns SOLID BLACK when checked
// - Eligibility status determined dynamically by graduation logic
// - Font family & weights accurately match Figma typography
// ---------------------------------------------------------------------------

function formatBirthDate(dateStr?: string): string {
  if (!dateStr) return "May 15, 2000";
  if (/^[A-Za-z]+ \d{1,2}, \d{4}$/.test(dateStr)) return dateStr;
  try {
    const parts = dateStr.split(/[-/]/);
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      if (month >= 0 && month < 12 && !isNaN(day) && !isNaN(year)) {
        return `${monthNames[month]} ${day}, ${year}`;
      }
    }
  } catch {}
  return dateStr;
}

function formatEnrollmentDate(dateStr?: string): string {
  if (!dateStr) return "September 2022";
  if (/^[A-Za-z]+ \d{4}$/.test(dateStr)) return dateStr;
  try {
    const parts = dateStr.split(/[-/]/);
    if (parts.length >= 2) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      if (month >= 0 && month < 12 && !isNaN(year)) {
        return `${monthNames[month]} ${year}`;
      }
    }
  } catch {}
  return dateStr;
}

function BackLink({ onBack }: { onBack: () => void }) {
  return (
    <div
      onClick={onBack}
      className="flex items-center gap-[6px] cursor-pointer text-[#4a5565] hover:text-[#101828] transition-colors self-start"
      data-name="Button"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px] leading-[20px] tracking-[-0.1504px]">
        Back to Dashboard
      </p>
    </div>
  );
}

export default function StudentCertificateRequestPage() {
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [eligibility, setEligibility] = useState<{ eligible: boolean; message: string } | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const studentId = authService.getLoggedInStudentId() || "STU001234";

  useEffect(() => {
    instituteService.getInstitute().then(setInstitute);
    studentPortalService.getStudentProfile(studentId).then((s) => {
      if (s) setStudent(s);
    });
    studentPortalService.checkEligibility(studentId).then(setEligibility);
  }, [studentId]);

  const isEligible = Boolean(eligibility?.eligible);
  const canGenerate = isEligible && confirmed && !isSubmitting;

  const handleGenerate = () => {
    if (!canGenerate) return;
    setIsSubmitting(true);
    window.dispatchEvent(new CustomEvent("navigate", { detail: "student-certificate-generated" }));
  };

  const handleCancel = () => {
    window.dispatchEvent(new CustomEvent("navigate", { detail: "student-dashboard" }));
  };

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

      <div className="flex-1 w-full max-w-[960px] mx-auto py-[28px] px-[24px] flex flex-col gap-[16px]">
        {/* Back to Dashboard */}
        <BackLink onBack={handleCancel} />

        {/* Main Card */}
        <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-[32px] flex flex-col gap-[24px] shadow-sm w-full">
          {/* Header */}
          <div>
            <h1 className="font-['Inter:Bold',sans-serif] font-bold text-[24px] text-[#101828] leading-[32px]">
              Download Degree Certificate
            </h1>
            <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#4a5565] leading-[20px] mt-[4px]">
              Review your details and submit a certificate request.
            </p>
          </div>

          {/* Eligibility Banner - 1 Single Line for Status/Message */}
          {isEligible ? (
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-[8px] px-[20px] py-[14px] flex items-start gap-[12px]">
              <div className="mt-[2px] shrink-0 text-[#16a34a]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="#16a34a" strokeWidth="1.8" />
                  <path d="M6 10.5L8.5 13L14 7" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#15803d] leading-[20px]">
                  Eligible for Certificate
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[13px] text-[#15803d] leading-[20px] mt-[2px] whitespace-nowrap overflow-hidden text-ellipsis">
                  {eligibility?.message || "You have completed all required credits and met all graduation requirements. You are eligible to request your degree certificate."}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-[#fffbeb] border border-[#fef08a] rounded-[8px] px-[20px] py-[14px] flex items-start gap-[12px]">
              <div className="mt-[2px] shrink-0 text-[#d97706]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="#d97706" strokeWidth="1.8" />
                  <path d="M10 6V10" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="10" cy="14" r="1" fill="#d97706" />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#b45309] leading-[20px]">
                  Not Eligible for Certificate
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[13px] text-[#b45309] leading-[20px] mt-[2px] whitespace-nowrap overflow-hidden text-ellipsis">
                  {eligibility?.message || "Your graduation certificate details (graduation month and classification) have not yet been completed by the administration."}
                </p>
              </div>
            </div>
          )}

          {/* Review Your Information */}
          <div>
            <h2 className="font-['Inter:Bold',sans-serif] font-bold text-[16px] text-[#101828] leading-[24px]">
              Review Your Information
            </h2>
            <p className="font-['Inter:Regular',sans-serif] font-normal text-[13px] text-[#4a5565] leading-[20px] mt-[4px]">
              Please verify that the following information is correct. If you notice any errors, please update your profile before submitting the request.
            </p>
          </div>

          {/* Unified Information Box */}
          <div className="border border-[#e5e7eb] rounded-[8px] overflow-hidden">
            {/* Personal Information Header */}
            <div className="bg-[#f9fafb] px-[20px] py-[12px] flex items-center gap-[10px] border-b border-[#e5e7eb]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#364153" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#364153" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#101828] leading-[20px]">
                Personal Information
              </h3>
            </div>

            {/* Personal Information Fields */}
            <div className="p-[20px]">
              <div className="grid grid-cols-2 gap-x-[64px] gap-y-[16px]">
                <div>
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-[#6b7280] leading-[18px]">
                    Full Name
                  </p>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#101828] leading-[20px] mt-[2px]">
                    {student?.fullName || "John Smith"}
                  </p>
                </div>
                <div>
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-[#6b7280] leading-[18px]">
                    Student ID
                  </p>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#101828] leading-[20px] mt-[2px]">
                    {student?.studentId || "STU001234"}
                  </p>
                </div>
                <div>
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-[#6b7280] leading-[18px]">
                    Email Address
                  </p>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#101828] leading-[20px] mt-[2px]">
                    {student?.email || "john.smith@student.edu"}
                  </p>
                </div>
                <div>
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-[#6b7280] leading-[18px]">
                    Phone Number
                  </p>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#101828] leading-[20px] mt-[2px]">
                    {student?.phone || "+1 234 567 8900"}
                  </p>
                </div>
                <div>
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-[#6b7280] leading-[18px]">
                    Date of Birth
                  </p>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#101828] leading-[20px] mt-[2px]">
                    {formatBirthDate(student?.dateOfBirth)}
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Information Header */}
            <div className="bg-[#f9fafb] px-[20px] py-[12px] flex items-center gap-[10px] border-t border-b border-[#e5e7eb]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 10V15C22 15 22 15 22 15" stroke="#364153" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 12.5V16.5C6 18 9 19 12 19C15 19 18 18 18 16.5V12.5" stroke="#364153" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 4L2 9L12 14L22 9L12 4Z" stroke="#364153" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#101828] leading-[20px]">
                Academic Information
              </h3>
            </div>

            {/* Academic Information Fields */}
            <div className="p-[20px]">
              <div className="grid grid-cols-2 gap-x-[64px] gap-y-[16px]">
                <div>
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-[#6b7280] leading-[18px]">
                    Course/Program
                  </p>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#101828] leading-[20px] mt-[2px]">
                    {student?.course || "Bachelor of Computer Science"}
                  </p>
                </div>
                <div>
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-[#6b7280] leading-[18px]">
                    Academic Year
                  </p>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#101828] leading-[20px] mt-[2px]">
                    {student?.graduationYear || "2026"}
                  </p>
                </div>
                <div>
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-[#6b7280] leading-[18px]">
                    Current CGPA
                  </p>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#101828] leading-[20px] mt-[2px]">
                    {student?.cgpa ?? "8.5"}
                  </p>
                </div>
                <div>
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-[#6b7280] leading-[18px]">
                    Credits Completed
                  </p>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#101828] leading-[20px] mt-[2px]">
                    {student ? `${student.creditsCompleted ?? 0}/${student.totalCredits ?? 0}` : "0/0"}
                  </p>
                </div>
                <div>
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-[#6b7280] leading-[18px]">
                    Enrollment Date
                  </p>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#101828] leading-[20px] mt-[2px]">
                    {formatEnrollmentDate(student?.enrollmentDate)}
                  </p>
                </div>
                <div>
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-[#6b7280] leading-[18px]">
                    Number of Semester
                  </p>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#101828] leading-[20px] mt-[2px]">
                    {student?.numberOfSemesters || 8}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-[#fffbeb] border border-[#fef08a] rounded-[8px] p-[20px] flex items-start gap-[12px]">
            <div className="mt-[2px] shrink-0 text-[#d97706]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#d97706" strokeWidth="1.8" />
                <path d="M10 6V10" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="10" cy="14" r="1" fill="#d97706" />
              </svg>
            </div>
            <div className="flex flex-col gap-[6px]">
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#b45309] leading-[20px]">
                Important Notes
              </p>
              <div className="space-y-[4px]">
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[13px] text-[#b45309] leading-[18px]">
                  Ensure all course fees and library dues are cleared
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[13px] text-[#b45309] leading-[18px]">
                  The certificate will be issued as a digital verifiable credential
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[13px] text-[#b45309] leading-[18px]">
                  Scan the QR code for your certificate and download into digital wallet.
                </p>
              </div>
            </div>
          </div>

          {/* Confirmation Box with Checkbox - exactly 2 lines */}
          <div className="bg-white border border-[#e5e7eb] rounded-[8px] px-[20px] py-[16px]">
            <div
              onClick={() => isEligible && setConfirmed(!confirmed)}
              className={`flex items-start gap-[12px] ${isEligible ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
            >
              {/* Checkbox Icon */}
              <div
                className={`w-[16px] h-[16px] rounded-[3px] mt-[2px] shrink-0 flex items-center justify-center transition-colors ${
                  confirmed
                    ? "bg-[#294594] border border-[#294594]"
                    : "bg-white border border-[#d1d5db]"
                }`}
              >
                {confirmed && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 5.2L4 7.2L8 2.8"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              {/* Confirmation text */}
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[13px] text-[#374151] leading-[20px] select-none">
                I confirm that all the information provided above is accurate and complete. I understand that the certificate will be issued as a verifiable digital credential and that providing false information may result in the cancellation of my certificate request.
              </p>
            </div>
          </div>

          {/* Actions: Divider & Right-Aligned Buttons */}
          <div className="border-t border-[#e5e7eb] pt-[20px] flex items-center justify-end gap-[12px]">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-white border border-[#d1d5dc] rounded-[8px] px-[24px] py-[9px] font-['Inter:Medium',sans-serif] font-medium text-[14px] text-[#364153] hover:bg-[#f9fafb] transition-colors cursor-pointer"
              data-name="Button"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={canGenerate ? handleGenerate : undefined}
              disabled={!canGenerate}
              className={`rounded-[8px] px-[24px] py-[9px] font-['Inter:Medium',sans-serif] font-medium text-[14px] transition-colors ${
                canGenerate
                  ? "bg-black hover:bg-[#1f2937] text-white cursor-pointer shadow-sm"
                  : "bg-[#8aaefd] text-white cursor-not-allowed opacity-90"
              }`}
              data-name="Button"
            >
              {isSubmitting ? "Generating..." : "Generate Certificate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
