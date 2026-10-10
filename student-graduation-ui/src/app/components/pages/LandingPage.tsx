import { useState, useEffect } from "react";
import { instituteService } from "@/services/instituteService";
import type { Institute } from "@/data/types";
import svgPaths from "@/imports/EducationalInstitutePortal/svg-k1h4b1i1ue";
import imgLogo from "@/imports/EducationalInstitutePortal/73da5574736f6a1e3d533885140e2c14827bbc1f.png";

function Heading() {
  return (
    <div className="absolute h-[40px] left-0 top-[104px] w-[896px]" data-name="Heading 1">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-[447.5px] not-italic text-[#4a5565] text-[20px] text-center top-[16.5px] tracking-[-0.4492px] whitespace-nowrap">University Portal</p>
    </div>
  );
}

function Heading1({ name }: { name: string }) {
  return (
    <div className="-translate-x-1/2 absolute h-[28px] left-1/2 top-[81.5px] w-[287px]" data-name="Heading 2">
      <div className="-translate-y-full [word-break:break-word] absolute flex flex-col font-['Cinzel:Bold',sans-serif] font-bold justify-end leading-[0] left-[calc(50%-230.5px)] text-[40px] text-black top-[30px] whitespace-nowrap">
        <p className="leading-[32px]">{name}</p>
      </div>
    </div>
  );
}

function Container1({ institute }: { institute: Institute | null }) {
  const name = institute?.name || "University of Utopia";
  return (
    <div className="absolute h-[184px] left-0 top-0 w-[896px]" data-name="Container">
      <Heading />
      <div className="-translate-x-1/2 absolute h-[73px] left-[calc(50%+1px)] top-[-13.5px] w-[111px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo} />
      </div>
      <Heading1 name={name} />
    </div>
  );
}

function Heading2() {
  return (
    <div className="absolute h-[32px] left-[32px] top-[120px] w-[372px]" data-name="Heading 2">
      <p className="[word-break:break-word] absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[32px] left-[calc(50%-84.5px)] not-italic text-[24px] text-white top-0 tracking-[0.0703px] whitespace-nowrap">Student Portal</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[48px] left-[32px] top-[164px] w-[372px]" data-name="Paragraph">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[186px] not-italic text-[16px] text-center text-white top-[-0.5px] tracking-[-0.3125px] w-[372px]">Access your grades, personal details, and manage your degree certificates</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[158.91px] size-[20px] top-[2px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pf9ff300} id="Vector" stroke="var(--stroke-0, #91B3FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="-translate-x-1/2 absolute h-[24px] left-1/2 top-[236.5px] w-[179px]" data-name="Container">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#91b3ff] text-[16px] top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">Continue as Student</p>
      <Icon />
    </div>
  );
}

function ProiconsPersonCircle() {
  return (
    <div className="-translate-x-1/2 absolute left-[calc(50%-1px)] size-[40px] top-[62px]" data-name="proicons:person-circle">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="proicons:person-circle">
          <path d={svgPaths.pc6f7dc0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#263961] col-2 drop-shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)] justify-self-stretch relative rounded-[16px] row-1 self-stretch shrink-0" data-name="Button">
      <Heading2 />
      <Paragraph />
      <Container3 />
      <ProiconsPersonCircle />
    </div>
  );
}

function Heading3() {
  return (
    <div className="absolute h-[32px] left-[32px] top-[120px] w-[372px]" data-name="Heading 2">
      <p className="[word-break:break-word] absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[32px] left-[calc(50%-75.5px)] not-italic text-[24px] text-white top-0 tracking-[0.0703px] whitespace-nowrap">Admin Portal</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[48px] left-[32px] top-[164px] w-[372px]" data-name="Paragraph">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[175.5px] not-italic text-[16px] text-center text-white top-[-0.5px] tracking-[-0.3125px] w-[351px]">Issue and manage verifiable degree certificates for students</p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[147.15px] size-[20px] top-[2px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pf9ff300} id="Vector" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="-translate-x-1/2 absolute h-[24px] left-[calc(50%-0.5px)] top-[236.5px] w-[168px]" data-name="Container">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#f0b100] text-[16px] top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">Continue as Admin</p>
      <Icon1 />
    </div>
  );
}

function EosIconsAdmin() {
  return (
    <div className="-translate-x-1/2 absolute left-[calc(50%-1px)] size-[40px] top-[62px]" data-name="eos-icons:admin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="eos-icons:admin">
          <path d={svgPaths.p22dfe300} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#263961] col-1 drop-shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)] justify-self-stretch relative rounded-[16px] row-1 self-stretch shrink-0" data-name="Button">
      <Heading3 />
      <Paragraph1 />
      <Container4 />
      <EosIconsAdmin />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[292px] left-0 top-[232px] w-[896px]" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[20px] left-0 top-[556px] w-[896px]" data-name="Paragraph">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[448.02px] not-italic text-[#4a5565] text-[14px] text-center top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Secure access for authorized users only</p>
    </div>
  );
}

function Container({ institute }: { institute: Institute | null }) {
  return (
    <div className="absolute h-[576px] left-[231.5px] top-[162.5px] w-[896px]" data-name="Container">
      <Container1 institute={institute} />
      <Container2 />
      <Paragraph2 />
    </div>
  );
}

export default function EducationalInstitutePortal() {
  const [institute, setInstitute] = useState<Institute | null>(null);

  useEffect(() => {
    instituteService.getInstitute().then(setInstitute);
  }, []);

  return (
    <div className="bg-white relative size-full" data-name="Educational Institute Portal">
      <Container institute={institute} />
    </div>
  );
}
