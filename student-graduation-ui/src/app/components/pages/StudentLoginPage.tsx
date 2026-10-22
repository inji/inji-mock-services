import { useState, useEffect } from "react";
import { instituteService } from "@/services/instituteService";
import { authService } from "@/services/authService";
import { studentService } from "@/services/studentService";
import type { Institute } from "@/data/types";
import imgLogo from "@/imports/EducationalInstitutePortal-1/73da5574736f6a1e3d533885140e2c14827bbc1f.png";

// ---------------------------------------------------------------------------
// Student Login Page
// Mirrors AdminLoginPage structure but adapted for the student portal design:
// - Golden/tan background with university illustration on the left
// - White login card on the right with Student ID + Password fields
// ---------------------------------------------------------------------------

function Logo() {
  return (
    <div className="flex justify-center mb-[8px]">
      <img
        alt="University Logo"
        className="h-[73px] w-[111px] object-contain"
        src={imgLogo}
      />
    </div>
  );
}

function BackButton() {
  return (
    <div className="absolute left-[32px] top-[24px] cursor-pointer" data-name="Button">
      <div className="flex items-center gap-[6px]">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 12L6 8L10 4"
            stroke="#4A5565"
            strokeWidth="1.33"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-[#4a5565] tracking-[-0.3125px] leading-[24px]">
          Back
        </p>
      </div>
    </div>
  );
}

function Heading({ name }: { name: string }) {
  return (
    <div className="text-center">
      <div className="font-['Cinzel:Bold',sans-serif] font-bold text-[24px] text-black leading-[32px] whitespace-nowrap">
        {name}
      </div>
    </div>
  );
}

function Subtitle({ systemName }: { systemName: string }) {
  return (
    <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-[#4a5565] text-center leading-[24px] tracking-[-0.3125px] mt-[4px]">
      {systemName}
    </p>
  );
}

function StudentIdInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative h-[46px] w-full rounded-[10px]">
      <div className="flex items-center overflow-clip pl-[40px] pr-[16px] py-[10px] rounded-[inherit] size-full">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-[#101828] tracking-[-0.3125px] w-full bg-transparent outline-none"
          placeholder="STU001234"
        />
      </div>
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
      {/* Person icon */}
      <div className="absolute left-[12px] top-[13px] size-[20px] pointer-events-none">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 10C12.0711 10 13.75 8.32107 13.75 6.25C13.75 4.17893 12.0711 2.5 10 2.5C7.92893 2.5 6.25 4.17893 6.25 6.25C6.25 8.32107 7.92893 10 10 10Z"
            stroke="#99A1AF"
            strokeWidth="1.67"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.75 17.5C3.75 14.0482 6.54822 11.25 10 11.25C13.4518 11.25 16.25 14.0482 16.25 17.5"
            stroke="#99A1AF"
            strokeWidth="1.67"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

function PasswordInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative h-[46px] w-full rounded-[10px]">
      <div className="flex items-center overflow-clip pl-[40px] pr-[16px] py-[10px] rounded-[inherit] size-full">
        <input
          type="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-[#101828] tracking-[-0.3125px] w-full bg-transparent outline-none"
          placeholder="••••••••"
        />
      </div>
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
      {/* Lock icon */}
      <div className="absolute left-[12px] top-[13px] size-[20px] pointer-events-none">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3.33" y="9.17" width="13.33" height="8.33" rx="2" stroke="#99A1AF" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.66669 9.16667V5.83333C6.66669 3.99238 8.15907 2.5 10 2.5C11.841 2.5 13.3334 3.99238 13.3334 5.83333V9.16667" stroke="#99A1AF" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[4px] w-full">
      <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px] text-[#364153] leading-[20px] tracking-[-0.1504px]">
        {label}
      </p>
      {children}
    </div>
  );
}

function LoginCard({ institute }: { institute: Institute | null }) {
  const [studentId, setStudentId] = useState("STU001234");
  const [password, setPassword] = useState("••••••••");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const name = institute?.name || "University of Utopia";
  const systemName = "Verifiable Credentials Management System";

  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      // Validate that the student exists in the backend database
      const student = await studentService.getStudentById(studentId);
      if (!student) {
        setErrorMsg("Student ID not found in registry.");
        return;
      }
      authService.setLoggedInStudentId(student.studentId);
      window.dispatchEvent(new CustomEvent("navigate", { detail: "student-dashboard" }));
    } catch {
      setErrorMsg("An error occurred while signing in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] mx-auto flex flex-col items-center">
      <div className="w-full flex justify-start mb-8">
        <BackButton />
      </div>

      <Logo />
      <Heading name={name} />
      <Subtitle systemName={systemName} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-8 w-full">
        <FormField label="Student ID">
          <StudentIdInput value={studentId} onChange={setStudentId} />
        </FormField>

        <FormField label="Password">
          <PasswordInput value={password} onChange={setPassword} />
        </FormField>

        <div className="flex items-center justify-between">
          <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#155dfc] leading-[20px] tracking-[-0.1504px] cursor-pointer">
            Forgot password?
          </p>
          {errorMsg && <p className="text-red-500 text-[14px]">{errorMsg}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#3d5092] hover:bg-[#2e3e73] transition-colors h-[40px] w-full rounded-[10px] text-white font-['Inter:Medium',sans-serif] font-medium text-[16px] tracking-[-0.3125px] leading-[24px] mt-2"
          data-name="Button"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="border-t border-[#e5e7eb] w-full mt-8 pt-6">
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#4a5565] text-center leading-[20px] tracking-[-0.1504px]">
          Secure access for authorized institutional representatives only
        </p>
      </div>
    </div>
  );
}

import bgImage from "@/assets/student-login-bg.png";

export default function StudentLoginPage() {
  const [institute, setInstitute] = useState<Institute | null>(null);

  useEffect(() => {
    instituteService.getInstitute().then(setInstitute);
  }, []);

  return (
    <div className="w-full h-screen min-h-[800px] flex items-center justify-between px-[64px] relative">
      {/* Background illustration - left side */}
      <div className="flex-1 flex justify-center items-center h-full max-w-[700px]">
        <img
          alt="Student login illustration"
          src={bgImage}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Login area - right side */}
      <div className="w-[448px] bg-white rounded-[16px] drop-shadow-2xl py-[48px] px-[32px] shrink-0 mr-[64px]">
        <LoginCard institute={institute} />
      </div>
    </div>
  );
}
