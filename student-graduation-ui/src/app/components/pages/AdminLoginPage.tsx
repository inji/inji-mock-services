import { useState, useEffect } from "react";
import { instituteService } from "@/services/instituteService";
import { authService } from "@/services/authService";
import type { Institute } from "@/data/types";
import svgPaths from "@/imports/EducationalInstitutePortal-1/svg-qexg2w8lzv";
import imgLogo from "@/imports/EducationalInstitutePortal-1/73da5574736f6a1e3d533885140e2c14827bbc1f.png";

function Paragraph({ systemName }: { systemName: string }) {
  return (
    <div className="absolute h-[24px] left-0 top-[120px] w-[384px]" data-name="Paragraph">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[192.84px] not-italic text-[#4a5565] text-[16px] text-center top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">{systemName}</p>
    </div>
  );
}

function Heading({ name }: { name: string }) {
  return (
    <div className="absolute h-[28px] left-[48px] top-[82px] w-[287px]" data-name="Heading 1">
      <div className="-translate-y-full [word-break:break-word] absolute flex flex-col font-['Cinzel:Bold',sans-serif] font-bold justify-end leading-[0] left-0 text-[24px] text-black top-[30px] whitespace-nowrap">
        <p className="leading-[32px]">{name}</p>
      </div>
    </div>
  );
}

function Container1({ institute }: { institute: Institute | null }) {
  return (
    <div className="absolute h-[144px] left-[32px] top-[70px] w-[384px]" data-name="Container">
      <Paragraph systemName={institute?.systemName || "Student Management System"} />
      <div className="absolute h-[73px] left-[136px] top-[-1px] w-[111px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo} />
      </div>
      <Heading name={institute?.name || "University of Utopia"} />
    </div>
  );
}

function Label() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Email Address</p>
    </div>
  );
}

function EmailInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="absolute h-[46px] left-0 rounded-[10px] top-0 w-[384px]" data-name="Email Input">
      <div className="content-stretch flex items-center overflow-clip pl-[40px] pr-[16px] py-[10px] relative rounded-[inherit] size-full">
        <input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[#101828] tracking-[-0.3125px] w-full bg-transparent outline-none"
          placeholder="admin@institute.edu"
        />
      </div>
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[12px] size-[20px] top-[13px] pointer-events-none" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pd919a80} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p189c1170} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container3({ email, setEmail }: { email: string; setEmail: (v: string) => void }) {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Container">
      <EmailInput value={email} onChange={setEmail} />
      <Icon />
    </div>
  );
}

function Container2({ email, setEmail }: { email: string; setEmail: (v: string) => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[70px] items-start relative shrink-0 w-full" data-name="Container">
      <Label />
      <Container3 email={email} setEmail={setEmail} />
    </div>
  );
}

function Label1() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Password</p>
    </div>
  );
}

function PasswordInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="absolute h-[46px] left-0 rounded-[10px] top-0 w-[384px]" data-name="Password Input">
      <div className="content-stretch flex items-center overflow-clip pl-[40px] pr-[16px] py-[10px] relative rounded-[inherit] size-full">
        <input
          type="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[#101828] tracking-[-0.3125px] w-full bg-transparent outline-none"
          placeholder="••••••••"
        />
      </div>
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[12px] size-[20px] top-[13px] pointer-events-none" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2566d000} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1bf79e00} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container5({ password, setPassword }: { password: string; setPassword: (v: string) => void }) {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Container">
      <PasswordInput value={password} onChange={setPassword} />
      <Icon1 />
    </div>
  );
}

function Container4({ password, setPassword }: { password: string; setPassword: (v: string) => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[70px] items-start relative shrink-0 w-full" data-name="Container">
      <Label1 />
      <Container5 password={password} setPassword={setPassword} />
    </div>
  );
}

function Link() {
  return (
    <div className="h-[20px] relative shrink-0 w-[115.164px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#155dfc] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Forgot password?</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Link />
    </div>
  );
}

function Button({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="bg-[#3d5092] hover:bg-[#2e3e73] transition-colors h-[40px] relative rounded-[10px] shrink-0 w-full"
      data-name="Button"
    >
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[191.8px] not-italic text-[16px] text-center text-white top-[7.5px] tracking-[-0.3125px] whitespace-nowrap">
        {isSubmitting ? "Signing In..." : "Sign In"}
      </p>
    </button>
  );
}

function Form({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  isSubmitting,
}: {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="absolute content-stretch flex flex-col gap-[20px] h-[264px] items-start left-[32px] top-[246px] w-[384px]"
      data-name="Form"
    >
      <Container2 email={email} setEmail={setEmail} />
      <Container4 password={password} setPassword={setPassword} />
      <Container6 />
      <Button isSubmitting={isSubmitting} />
    </form>
  );
}

function Paragraph1() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[192.13px] not-italic text-[#4a5565] text-[14px] text-center top-[0.5px] tracking-[-0.1504px] w-[371px]">Secure access for authorized institutional representatives only</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex flex-col h-[65px] items-start left-[32px] pt-[25px] top-[542px] w-[384px]" data-name="Container">
      <div aria-hidden className="absolute border-[#e5e7eb] border-solid border-t inset-0 pointer-events-none" />
      <Paragraph1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-0 size-[16px] top-[4px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p203476e0} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12.6667 8H3.33333" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute h-[24px] left-[32.5px] top-[32px] w-[60.594px]" data-name="Button">
      <Icon2 />
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[42.5px] not-italic text-[#4a5565] text-[16px] text-center top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">Back</p>
    </div>
  );
}

function Container({ institute }: { institute: Institute | null }) {
  const [email, setEmail] = useState("admin@institute.edu");
  const [password, setPassword] = useState("••••••••");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await authService.login({ email, password });
      window.dispatchEvent(new CustomEvent("navigate", { detail: "dashboard" }));
    } catch {
      // noop mock error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="-translate-x-1/2 absolute bg-white drop-shadow-[0px_20px_12.5px_rgba(0,0,0,0.1),0px_8px_5px_rgba(0,0,0,0.1)] h-[631px] left-[calc(50%+0.5px)] rounded-[16px] top-[135px] w-[448px]" data-name="Container">
      <Container1 institute={institute} />
      <Form
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
      <Container7 />
      <Button1 />
    </div>
  );
}

export default function EducationalInstitutePortal() {
  const [institute, setInstitute] = useState<Institute | null>(null);

  useEffect(() => {
    instituteService.getInstitute().then(setInstitute);
    authService.getCurrentUser().then((u) => {
      if (u?.email) {
        // user prefill if available
      }
    });
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#263961] relative size-full to-[#4d76c7]" data-name="Educational Institute Portal">
      <Container institute={institute} />
    </div>
  );
}
