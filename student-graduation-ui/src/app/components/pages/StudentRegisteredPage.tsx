import { useState, useEffect } from "react";
import { instituteService, certificateService } from "@/services";
import { institute, sampleRegisteredCertificate } from "@/data";
import type { Institute, Certificate } from "@/data/types";
import svgPaths from "@/imports/EducationalInstitutePortal-4/svg-5cxh11ym15";
import imgLogo from "@/imports/EducationalInstitutePortal-4/73da5574736f6a1e3d533885140e2c14827bbc1f.png";

function Heading({ institute }: { institute: Institute | null }) {
  return (
    <div className="h-[28px] relative shrink-0 w-[287px]" data-name="Heading 1">
      <div className="-translate-y-full [word-break:break-word] absolute flex flex-col font-['Cinzel:Bold',sans-serif] font-bold justify-end leading-[0] left-0 text-[24px] text-black top-[30px] whitespace-nowrap">
        <p className="leading-[32px]">{institute?.name || "University of Utopia"}</p>
      </div>
    </div>
  );
}

function Paragraph({ institute }: { institute: Institute | null }) {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] absolute font-['Inter:Light',sans-serif] font-light leading-[20px] left-0 not-italic text-[#1c398e] text-[16px] top-0 tracking-[1px] whitespace-nowrap">{institute?.portalLabel || "Admin Portal"}</p>
    </div>
  );
}

function Container2({ institute }: { institute: Institute | null }) {
  return (
    <div className="h-[48px] relative shrink-0 w-[276px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading institute={institute} />
        <Paragraph institute={institute} />
      </div>
    </div>
  );
}

function Container1({ institute }: { institute: Institute | null }) {
  return (
    <div className="h-[48px] relative shrink-0 w-[349px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <div className="h-[40px] relative shrink-0 w-[61px]" data-name="logo">
          <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo} />
        </div>
        <Container2 institute={institute} />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p38966ca0} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p14ca9100} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M17.5 10H7.5" id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[26.5px] not-italic text-[#364153] text-[16px] text-center top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">Logout</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[rgba(64,123,255,0.7)] h-[40px] relative rounded-[10px] shrink-0 w-[111.773px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[16px] relative size-full">
        <Icon />
        <Text />
      </div>
    </div>
  );
}

function Container({ institute }: { institute: Institute | null }) {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container1 institute={institute} />
      <Button />
    </div>
  );
}

function Header({ institute }: { institute: Institute | null }) {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[81px] items-start left-0 pb-px pt-[16px] px-[64px] top-0 w-[1344px]" data-name="Header">
      <div aria-hidden className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <Container institute={institute} />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[14px] size-[36px] top-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="Icon">
          <path d={svgPaths.pf3c7c00} id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d="M13.5 16.5L18 21L33 6" id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute bg-[#dcfce7] left-[352px] rounded-[16777200px] size-[64px] top-0" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="absolute h-[32px] left-0 top-[80px] w-[768px]" data-name="Heading 2">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[32px] left-[384.09px] not-italic text-[#101828] text-[24px] text-center top-0 tracking-[0.0703px] whitespace-nowrap">Student Registered Successfully!</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[24px] left-0 top-[120px] w-[768px]" data-name="Paragraph">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[384.03px] not-italic text-[#4a5565] text-[16px] text-center top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">The student has been added to the system</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[144px] left-[32px] top-[32px] w-[768px]" data-name="Container">
      <Container4 />
      <Heading1 />
      <Paragraph1 />
    </div>
  );
}

export default function EducationalInstitutePortal() {
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    instituteService.getInstitute().then(setInstitute);
    
    // Dynamic import to avoid circular dependency issues if any, or just import at top.
    // Assuming studentService is imported.
    import("@/services").then(({ studentService }) => {
      setStudent(studentService.getLastCreatedStudent());
    });
  }, []);

  return (
    <div className="bg-[#f9fafb] relative size-full min-h-[900px]" data-name="Educational Institute Portal">
      <Header institute={institute} />
      <div className="absolute left-[256px] top-[145px] w-[832px] bg-white rounded-[16px] border border-[#e5e7eb] p-[32px] shadow-sm flex flex-col gap-[32px]">
        <Container3 />

        <div className="mt-[160px] flex flex-col gap-[20px] bg-[#fffbeb] p-[24px] rounded-[12px]">
          <h3 className="font-semibold text-[20px] text-[#101828]">Student Details</h3>
          <div className="grid grid-cols-2 gap-[24px] text-[14px]">
            <div>
              <p className="text-[#6e4f06] mb-1">Student ID</p>
              <p className="font-semibold text-black text-[16px]">{student?.studentId || "N/A"}</p>
            </div>
            <div>
              <p className="text-[#6e4f06] mb-1">Full Name</p>
              <p className="font-semibold text-black text-[16px]">{student?.fullName || "N/A"}</p>
            </div>
            <div>
              <p className="text-[#6e4f06] mb-1">Email</p>
              <p className="font-medium text-black text-[16px] flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                {student?.email || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[#6e4f06] mb-1">Phone</p>
              <p className="font-medium text-black text-[16px] flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                {student?.phone || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[#6e4f06] mb-1">Course</p>
              <p className="font-semibold text-black text-[16px]">{student?.course || "N/A"}</p>
            </div>
            <div>
              <p className="text-[#6e4f06] mb-1">Academic Year</p>
              <p className="font-semibold text-black text-[16px]">{student?.year || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[20px] bg-[#f0f6ff] border border-[#dbeafe] p-[24px] rounded-[12px]">
          <h3 className="font-semibold text-[20px] text-[#1e3a8a]">Degree Certificate Details</h3>
          <div className="grid grid-cols-2 gap-[24px] text-[14px]">
            <div>
              <p className="text-[#3b82f6] mb-1">Registration Number</p>
              <p className="font-semibold text-[#1e3a8a] text-[16px]">
                {student?.graduationDetails?.registrationNumber || student?.registrationNumber || "REG001200"}
              </p>
            </div>
            <div>
              <p className="text-[#3b82f6] mb-1">Degree Title</p>
              <p className="font-semibold text-[#1e3a8a] text-[16px]">
                {student?.graduationDetails?.degreeTitle || student?.course || "Bachelor of computer science"}
              </p>
            </div>
            <div>
              <p className="text-[#3b82f6] mb-1">Graduation Date</p>
              <p className="font-semibold text-[#1e3a8a] text-[16px]">
                {(() => {
                  const m = student?.graduationDetails?.graduationMonth;
                  const monthName = m ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][m - 1] : "May";
                  const yr = student?.graduationDetails?.graduationYear || student?.graduationYear || "2026";
                  return `${monthName} ${yr}`;
                })()}
              </p>
            </div>
            <div>
              <p className="text-[#3b82f6] mb-1">Semesters</p>
              <p className="font-semibold text-[#1e3a8a] text-[16px]">8</p>
            </div>

          </div>
        </div>

        <div className="flex flex-col gap-[8px] bg-[#fafafa] border border-[#e5e7eb] p-[20px] rounded-[12px] text-[14px]">
          <p className="text-[#4b5563]"><strong className="text-[#111827] font-semibold">Student Login ID:</strong> {student?.studentId || "STUD12345678"}</p>
          <p className="text-[#6b7280]">A temporary password has been sent to the student's email address</p>
        </div>

        <div className="flex gap-[16px] justify-between">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "dashboard" }))}
            className="px-[24px] flex-1 py-[12px] bg-black hover:bg-gray-800 text-white rounded-[10px] text-[16px] font-medium transition-colors cursor-pointer"
            data-name="Button"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "add-student" }))}
            className="px-[24px] flex-1 py-[12px] border border-black text-black flex items-center justify-center gap-2 hover:bg-gray-50 rounded-[10px] text-[16px] font-medium transition-colors cursor-pointer"
            data-name="Button"
          >
            Add Another Student
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>

      </div>
    </div>
  );
}
