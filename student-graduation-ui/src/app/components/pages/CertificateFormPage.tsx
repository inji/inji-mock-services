import { useState, useEffect } from "react";
import { instituteService, certificateService, studentService } from "@/services";
import { institute, students, certificates } from "@/data";
import type { Institute, Certificate, Student } from "@/data/types";
import svgPaths from "@/imports/EducationalInstitutePortal-6/svg-gblxv6uzl2";
import imgLogo from "@/imports/EducationalInstitutePortal-6/73da5574736f6a1e3d533885140e2c14827bbc1f.png";
import { imgCalendarToday, imgArrowBackIosNew } from "@/imports/EducationalInstitutePortal-6/svg-vrovh";

function Heading({ institute }: { institute: Institute | null }) {
  return (
    <div className="h-[28px] relative shrink-0 w-[287px]" data-name="Heading 1">
      <div className="-translate-y-full [word-break:break-word] absolute flex flex-col font-['Cinzel:Bold',sans-serif] font-bold justify-end leading-[0] left-0 text-[24px] text-black top-[30px] whitespace-nowrap">
        <p className="leading-[32px]">{institute?.name || "University of Utopia"}</p>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] absolute font-['Inter:Light',sans-serif] font-light leading-[20px] left-0 not-italic text-[#1c398e] text-[16px] top-0 tracking-[1px] whitespace-nowrap">{institute.portalLabel}</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[48px] relative shrink-0 w-[276px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading />
        <Paragraph />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[48px] relative shrink-0 w-[349px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <div className="h-[40px] relative shrink-0 w-[61px]" data-name="logo">
          <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo} />
        </div>
        <Container2 />
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

function Container() {
  return (
    <div className="absolute content-stretch flex h-[48px] items-center justify-between left-[64px] right-[64px] top-[16px]" data-name="Container">
      <Container1 />
      <Button />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-white border-[#e5e7eb] border-b border-solid h-[81px] left-0 top-0 w-[1344px]" data-name="Header">
      <Container />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-0 size-[20px] top-[2px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p33f6b680} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M15.8333 10H4.16667" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute h-[24px] left-[32px] top-[32px] w-[211.984px]" data-name="Button">
      <Icon1 />
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[120.5px] not-italic text-[#4a5565] text-[16px] text-center top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">Back to Student Registry</p>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="[word-break:break-word] absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[32px] left-0 not-italic text-[#101828] text-[24px] top-0 tracking-[0.0703px] whitespace-nowrap">Update Student Information</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#4a5565] text-[16px] top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">{`Update details for ${students[0].fullName}`}</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[60px] relative shrink-0 w-[302.695px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading1 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex h-[60px] items-center relative shrink-0 w-full" data-name="Container">
      <Container5 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[#101828] text-[18px] top-0 tracking-[-0.4395px] whitespace-nowrap">Personal Information</p>
    </div>
  );
}

function Label() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Student ID</p>
    </div>
  );
}

function TextInput() {
  return (
    <div className="h-[42px] relative rounded-[10px] shrink-0 w-full" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#0a0a0a] text-[16px] tracking-[-0.3125px] whitespace-nowrap">{students[0].studentId}</p>
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Input() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[66px] items-start left-0 top-0 w-[440px]" data-name="Input">
      <Label />
      <TextInput />
    </div>
  );
}

function Label1() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[0] left-0 not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[20px]">Full Name</span>
        <span className="leading-[20px] text-[#fb2c36]">*</span>
      </p>
    </div>
  );
}

function TextInput1() {
  return (
    <div className="h-[42px] relative rounded-[10px] shrink-0 w-full" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#0a0a0a] text-[16px] tracking-[-0.3125px] whitespace-nowrap">{students[0].fullName}</p>
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Input1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[66px] items-start left-[456px] top-0 w-[440px]" data-name="Input">
      <Label1 />
      <TextInput1 />
    </div>
  );
}

function Label2() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[0] left-0 not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[20px]">Email Address</span>
        <span className="leading-[20px] text-[#fb2c36]">*</span>
      </p>
    </div>
  );
}

function EmailInput() {
  return (
    <div className="h-[42px] relative rounded-[10px] shrink-0 w-full" data-name="Email Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#0a0a0a] text-[16px] tracking-[-0.3125px] whitespace-nowrap">{students[0].email}</p>
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Input2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[66px] items-start left-0 top-[82px] w-[440px]" data-name="Input">
      <Label2 />
      <EmailInput />
    </div>
  );
}

function Label3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[0] left-0 not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[20px]">Phone Number</span>
        <span className="leading-[20px] text-[#fb2c36]">*</span>
      </p>
    </div>
  );
}

function PhoneInput() {
  return (
    <div className="h-[42px] relative rounded-[10px] shrink-0 w-full" data-name="Phone Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#0a0a0a] text-[16px] tracking-[-0.3125px] whitespace-nowrap">+1 234 567 8900</p>
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Input3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[66px] items-start left-[456px] top-[82px] w-[440px]" data-name="Input">
      <Label3 />
      <PhoneInput />
    </div>
  );
}

function Label4() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[0] left-0 not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[20px]">Date of Birth</span>
        <span className="leading-[20px] text-[#fb2c36]">*</span>
      </p>
    </div>
  );
}

function CalendarToday() {
  return (
    <div className="absolute contents left-[402px] top-[9px]" data-name="calendar_today">
      <div className="absolute inset-[26.19%_3.86%_26.19%_92.05%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3px_-2px] mask-size-[24px_24px]" style={{ maskImage: `url("${imgCalendarToday}")` }} data-name="calendar_today">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 20">
          <path d={svgPaths.p21617900} fill="var(--fill-0, #1C1B1F)" id="calendar_today" />
        </svg>
      </div>
    </div>
  );
}

function DatePicker() {
  return (
    <div className="h-[42px] relative rounded-[10px] shrink-0 w-full" data-name="Date Picker">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <CalendarToday />
        <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[12px] not-italic text-[#0a0a0a] text-[16px] top-[9px] tracking-[-0.3125px] whitespace-nowrap">{students[0].dateOfBirth}</p>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Input4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[66px] items-start left-0 top-[164px] w-[440px]" data-name="Input">
      <Label4 />
      <DatePicker />
    </div>
  );
}

function Label5() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[0] left-0 not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[20px]">Address</span>
        <span className="leading-[20px] text-[#fb2c36]">*</span>
      </p>
    </div>
  );
}

function TextInput2() {
  return (
    <div className="h-[42px] relative rounded-[10px] shrink-0 w-full" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#0a0a0a] text-[16px] tracking-[-0.3125px] whitespace-nowrap">{students[0].address}</p>
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Input5() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[66px] items-start left-0 top-[246px] w-[896px]" data-name="Input">
      <Label5 />
      <TextInput2 />
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[312px] relative shrink-0 w-full" data-name="Container">
      <Input />
      <Input1 />
      <Input2 />
      <Input3 />
      <Input4 />
      <Input5 />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[381px] items-start pb-px relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <Heading2 />
      <Container7 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[#101828] text-[18px] top-0 tracking-[-0.4395px] whitespace-nowrap">Academic Information</p>
    </div>
  );
}

function Label6() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[0] left-0 not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[20px]">{`Course/Program `}</span>
        <span className="leading-[20px] text-[#fb2c36]">*</span>
      </p>
    </div>
  );
}

function Option() {
  return <div className="absolute left-[-219.5px] size-0 top-[78px]" data-name="Option" />;
}

function Option1() {
  return <div className="absolute left-[-219.5px] size-0 top-[78px]" data-name="Option" />;
}

function Option2() {
  return <div className="absolute left-[-219.5px] size-0 top-[78px]" data-name="Option" />;
}

function Option3() {
  return <div className="absolute left-[-219.5px] size-0 top-[78px]" data-name="Option" />;
}

function Option4() {
  return <div className="absolute left-[-219.5px] size-0 top-[78px]" data-name="Option" />;
}

function Option5() {
  return <div className="absolute left-[-219.5px] size-0 top-[78px]" data-name="Option" />;
}

function Option6() {
  return <div className="absolute left-[-219.5px] size-0 top-[78px]" data-name="Option" />;
}

function Option7() {
  return <div className="absolute left-[-219.5px] size-0 top-[78px]" data-name="Option" />;
}

function Option8() {
  return <div className="absolute left-[-219.5px] size-0 top-[78px]" data-name="Option" />;
}

function ArrowBackIosNew() {
  return (
    <div className="absolute contents left-[859px] size-[17px] top-[11px]" data-name="arrow_back_ios_new">
      <div className="absolute flex inset-[40.42%_2.43%_40.6%_96.07%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="-rotate-90 flex-none h-[100cqw] w-[100cqh]">
          <div className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.78px_-4.764px] mask-size-[17px_17px] relative size-full" style={{ maskImage: `url("${imgArrowBackIosNew}")` }} data-name="arrow_back_ios_new">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.40208 13.4321">
              <path d={svgPaths.p192bbb80} fill="var(--fill-0, #B0B7C2)" id="arrow_back_ios_new" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dropdown() {
  return (
    <div className="h-[39px] relative rounded-[10px] shrink-0 w-full" data-name="Dropdown">
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Option />
      <Option1 />
      <Option2 />
      <Option3 />
      <Option4 />
      <Option5 />
      <Option6 />
      <Option7 />
      <Option8 />
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[12px] not-italic text-[#0a0a0a] text-[16px] top-[9px] tracking-[-0.3125px] whitespace-nowrap">{students[0].course}</p>
      <ArrowBackIosNew />
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[63px] items-start left-0 top-0 w-[896px]" data-name="Container">
      <Label6 />
      <Dropdown />
    </div>
  );
}

function Label7() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[0] left-0 not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[20px]">Enrollment Date</span>
        <span className="leading-[20px] text-[#fb2c36]">*</span>
      </p>
    </div>
  );
}

function CalendarToday1() {
  return (
    <div className="absolute contents left-[402px] top-[9px]" data-name="calendar_today">
      <div className="absolute inset-[26.19%_3.86%_26.19%_92.05%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3px_-2px] mask-size-[24px_24px]" style={{ maskImage: `url("${imgCalendarToday}")` }} data-name="calendar_today">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 20">
          <path d={svgPaths.p21617900} fill="var(--fill-0, #1C1B1F)" id="calendar_today" />
        </svg>
      </div>
    </div>
  );
}

function DatePicker1() {
  return (
    <div className="h-[42px] relative rounded-[10px] shrink-0 w-full" data-name="Date Picker">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <CalendarToday1 />
        <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[12px] not-italic text-[#0a0a0a] text-[16px] top-[9px] tracking-[-0.3125px] whitespace-nowrap">{students[0].enrollmentDate}</p>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Input6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[66px] items-start left-0 top-[79px] w-[440px]" data-name="Input">
      <Label7 />
      <DatePicker1 />
    </div>
  );
}

function Label8() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[0] left-0 not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[20px]">{`Academic Year `}</span>
        <span className="leading-[20px] text-[#fb2c36]">*</span>
      </p>
    </div>
  );
}

function Option9() {
  return <div className="absolute left-[-675.5px] size-0 top-[-1px]" data-name="Option" />;
}

function Option10() {
  return <div className="absolute left-[-675.5px] size-0 top-[-1px]" data-name="Option" />;
}

function Option11() {
  return <div className="absolute left-[-675.5px] size-0 top-[-1px]" data-name="Option" />;
}

function Option12() {
  return <div className="absolute left-[-675.5px] size-0 top-[-1px]" data-name="Option" />;
}

function Option13() {
  return <div className="absolute left-[-675.5px] size-0 top-[-1px]" data-name="Option" />;
}

function Dropdown1() {
  return (
    <div className="h-[39px] relative rounded-[10px] shrink-0 w-full" data-name="Dropdown">
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Option9 />
      <Option10 />
      <Option11 />
      <Option12 />
      <Option13 />
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[12px] not-italic text-[#0a0a0a] text-[16px] top-[9px] tracking-[-0.3125px] whitespace-nowrap">{students[0].graduationYear}</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[66px] items-start left-[456px] top-[79px] w-[440px]" data-name="Container">
      <Label8 />
      <Dropdown1 />
    </div>
  );
}

function Label9() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[0] left-0 not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[20px]">CGPA</span>
        <span className="leading-[20px] text-[#fb2c36]">*</span>
      </p>
    </div>
  );
}

function NumberInput() {
  return (
    <div className="h-[42px] relative rounded-[10px] shrink-0 w-full" data-name="Number Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#0a0a0a] text-[16px] tracking-[-0.3125px] whitespace-nowrap">{students[0].cgpa.toFixed(1)}</p>
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Input7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[66px] items-start left-0 top-[161px] w-[440px]" data-name="Input">
      <Label9 />
      <NumberInput />
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[227px] relative shrink-0 w-full" data-name="Container">
      <Container10 />
      <Input6 />
      <Container11 />
      <Input7 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[296px] items-start pb-px relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <Heading3 />
      <Container9 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[#101828] text-[18px] top-0 tracking-[-0.4395px] whitespace-nowrap">Guardian Information</p>
    </div>
  );
}

function Label10() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[0] left-0 not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[20px]">Guardian Name</span>
        <span className="leading-[20px] text-[#fb2c36]">*</span>
      </p>
    </div>
  );
}

function TextInput3() {
  return (
    <div className="h-[42px] relative rounded-[10px] shrink-0 w-full" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#0a0a0a] text-[16px] tracking-[-0.3125px] whitespace-nowrap">{students[0].guardian?.name}</p>
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Input8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[66px] items-start left-0 top-0 w-[440px]" data-name="Input">
      <Label10 />
      <TextInput3 />
    </div>
  );
}

function Label11() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[0] left-0 not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[20px]">Guardian Phone</span>
        <span className="leading-[20px] text-[#fb2c36]">*</span>
      </p>
    </div>
  );
}

function PhoneInput1() {
  return (
    <div className="h-[42px] relative rounded-[10px] shrink-0 w-full" data-name="Phone Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#0a0a0a] text-[16px] tracking-[-0.3125px] whitespace-nowrap">{students[0].guardian?.phone}</p>
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Input9() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[66px] items-start left-[456px] top-0 w-[440px]" data-name="Input">
      <Label11 />
      <PhoneInput1 />
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[66px] relative shrink-0 w-full" data-name="Container">
      <Input8 />
      <Input9 />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[135px] items-start pb-px relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <Heading4 />
      <Container13 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p3eeeaa80} id="Vector" stroke="var(--stroke-0, #AF8010)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2f14bd80} id="Vector_2" stroke="var(--stroke-0, #AF8010)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[28px] relative shrink-0 w-[147.008px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[#101828] text-[18px] top-0 tracking-[-0.4395px] whitespace-nowrap">Certificate Details</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex gap-[12px] h-[28px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon2 />
      <Heading5 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#af8010] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Final Year Student</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#af8010] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">{`Add certificate details below for graduation certificate issuance. These details will appear on the student's degree certificate.`}</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="bg-[#fff7e5] h-[78px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border border-[rgba(175,128,16,0.59)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-px pt-[17px] px-[17px] relative size-full">
        <Paragraph2 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Label12() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[0] left-0 not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[20px]">Registration Number</span>
        <span className="leading-[20px] text-[#fb2c36]">*</span>
      </p>
    </div>
  );
}

function TextInput4() {
  return (
    <div className="h-[42px] relative rounded-[10px] shrink-0 w-full" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(10,10,10,0.5)] tracking-[-0.3125px] whitespace-nowrap">{certificates[0].registrationNumber}</p>
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Input10() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[66px] items-start left-0 top-0 w-[440px]" data-name="Input">
      <Label12 />
      <TextInput4 />
    </div>
  );
}

function Label13() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[0] left-0 not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[20px]">Degree Title</span>
        <span className="leading-[20px] text-[#fb2c36]">*</span>
      </p>
    </div>
  );
}

function TextInput5() {
  return (
    <div className="h-[42px] relative rounded-[10px] shrink-0 w-full" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(10,10,10,0.5)] tracking-[-0.3125px] whitespace-nowrap">{certificates[0].degreeTitle}</p>
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Input11() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[66px] items-start left-[456px] top-0 w-[440px]" data-name="Input">
      <Label13 />
      <TextInput5 />
    </div>
  );
}

function Label14() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[0] left-0 not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[20px]">{`Graduation Month `}</span>
        <span className="leading-[20px] text-[#fb2c36]">*</span>
      </p>
    </div>
  );
}

function Option14() {
  return <div className="absolute left-[-219.5px] size-0 top-[-593px]" data-name="Option" />;
}

function Option15() {
  return <div className="absolute left-[-219.5px] size-0 top-[-593px]" data-name="Option" />;
}

function Option16() {
  return <div className="absolute left-[-219.5px] size-0 top-[-593px]" data-name="Option" />;
}

function Option17() {
  return <div className="absolute left-[-219.5px] size-0 top-[-593px]" data-name="Option" />;
}

function Option18() {
  return <div className="absolute left-[-219.5px] size-0 top-[-593px]" data-name="Option" />;
}

function Option19() {
  return <div className="absolute left-[-219.5px] size-0 top-[-593px]" data-name="Option" />;
}

function Option20() {
  return <div className="absolute left-[-219.5px] size-0 top-[-593px]" data-name="Option" />;
}

function Option21() {
  return <div className="absolute left-[-219.5px] size-0 top-[-593px]" data-name="Option" />;
}

function Option22() {
  return <div className="absolute left-[-219.5px] size-0 top-[-593px]" data-name="Option" />;
}

function Option23() {
  return <div className="absolute left-[-219.5px] size-0 top-[-593px]" data-name="Option" />;
}

function Option24() {
  return <div className="absolute left-[-219.5px] size-0 top-[-593px]" data-name="Option" />;
}

function Option25() {
  return <div className="absolute left-[-219.5px] size-0 top-[-593px]" data-name="Option" />;
}

function Option26() {
  return <div className="absolute left-[-219.5px] size-0 top-[-593px]" data-name="Option" />;
}

function CalendarToday2() {
  return (
    <div className="absolute contents left-[402px] top-[9px]" data-name="calendar_today">
      <div className="absolute inset-[28.21%_3.86%_20.51%_92.05%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3px_-2px] mask-size-[24px_24px]" style={{ maskImage: `url("${imgCalendarToday}")` }} data-name="calendar_today">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 20">
          <path d={svgPaths.p21617900} fill="var(--fill-0, #848484)" id="calendar_today" />
        </svg>
      </div>
    </div>
  );
}

function Dropdown2() {
  return (
    <div className="h-[39px] relative rounded-[10px] shrink-0 w-full" data-name="Dropdown">
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Option14 />
      <Option15 />
      <Option16 />
      <Option17 />
      <Option18 />
      <Option19 />
      <Option20 />
      <Option21 />
      <Option22 />
      <Option23 />
      <Option24 />
      <Option25 />
      <Option26 />
      <CalendarToday2 />
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[12px] not-italic text-[16px] text-[rgba(10,10,10,0.5)] top-[11.5px] tracking-[-0.3125px] whitespace-nowrap">Select Month</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[66px] items-start left-0 top-[82px] w-[440px]" data-name="Container">
      <Label14 />
      <Dropdown2 />
    </div>
  );
}

function Label15() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[0] left-0 not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[20px]">Graduation Year</span>
        <span className="leading-[20px] text-[#fb2c36]">*</span>
      </p>
    </div>
  );
}

function NumberInput1() {
  return (
    <div className="h-[42px] relative rounded-[10px] shrink-0 w-full" data-name="Number Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(10,10,10,0.5)] tracking-[-0.3125px] whitespace-nowrap">{certificates[0].graduationYear}</p>
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Input12() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[66px] items-start left-[456px] top-[82px] w-[440px]" data-name="Input">
      <Label15 />
      <NumberInput1 />
    </div>
  );
}

function Label16() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[0] left-0 not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[20px]">{`Classification (Honors/Distinction) `}</span>
        <span className="leading-[20px] text-[#fb2c36]">*</span>
      </p>
    </div>
  );
}

function Option27() {
  return <div className="absolute left-[-219.5px] size-0 top-[-675px]" data-name="Option" />;
}

function Option28() {
  return <div className="absolute left-[-219.5px] size-0 top-[-675px]" data-name="Option" />;
}

function Option29() {
  return <div className="absolute left-[-219.5px] size-0 top-[-675px]" data-name="Option" />;
}

function Option30() {
  return <div className="absolute left-[-219.5px] size-0 top-[-675px]" data-name="Option" />;
}

function Option31() {
  return <div className="absolute left-[-219.5px] size-0 top-[-675px]" data-name="Option" />;
}

function Option32() {
  return <div className="absolute left-[-219.5px] size-0 top-[-675px]" data-name="Option" />;
}

function Option33() {
  return <div className="absolute left-[-219.5px] size-0 top-[-675px]" data-name="Option" />;
}

function ArrowBackIosNew1() {
  return (
    <div className="absolute contents left-[859px] size-[17px] top-[11px]" data-name="arrow_back_ios_new">
      <div className="absolute flex inset-[40.42%_2.43%_40.6%_96.07%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="-rotate-90 flex-none h-[100cqw] w-[100cqh]">
          <div className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.78px_-4.764px] mask-size-[17px_17px] relative size-full" style={{ maskImage: `url("${imgArrowBackIosNew}")` }} data-name="arrow_back_ios_new">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.40208 13.4321">
              <path d={svgPaths.p192bbb80} fill="var(--fill-0, #B0B7C2)" id="arrow_back_ios_new" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dropdown3() {
  return (
    <div className="h-[39px] relative rounded-[10px] shrink-0 w-full" data-name="Dropdown">
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Option27 />
      <Option28 />
      <Option29 />
      <Option30 />
      <Option31 />
      <Option32 />
      <Option33 />
      <ArrowBackIosNew1 />
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[12px] not-italic text-[16px] text-[rgba(10,10,10,0.5)] top-[11.5px] tracking-[-0.3125px] whitespace-nowrap">{`Select Classification `}</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[63px] items-start left-0 top-[164px] w-[896px]" data-name="Container">
      <Label16 />
      <Dropdown3 />
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[227px] relative shrink-0 w-full" data-name="Container">
      <Input10 />
      <Input11 />
      <Container18 />
      <Input12 />
      <Container19 />
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[389px] items-start relative shrink-0 w-full" data-name="Container">
      <Container15 />
      <Container16 />
      <Container17 />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-white h-[42px] relative rounded-[10px] shrink-0 w-[84.984px]" data-name="Button">
      <div aria-hidden className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[17px] py-[9px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[#364153] text-[16px] text-center tracking-[-0.3125px] whitespace-nowrap">Cancel</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#1c398e] h-[42px] relative rounded-[10px] shrink-0 w-[238.516px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[16px] py-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-white tracking-[-0.3125px] whitespace-nowrap">Update Student Information</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex gap-[16px] h-[67px] items-start justify-end pt-[25px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#e5e7eb] border-solid border-t inset-0 pointer-events-none" />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Form() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] h-[1396px] items-start relative shrink-0 w-full" data-name="Form">
      <Container6 />
      <Container8 />
      <Container12 />
      <Container14 />
      <Container20 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute bg-white content-stretch drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] flex flex-col gap-[32px] h-[1552px] items-start left-[32px] pt-[32px] px-[32px] rounded-[10px] top-[80px] w-[960px]" data-name="Container">
      <Container4 />
      <Form />
    </div>
  );
}

function MainContent() {
  return (
    <div className="absolute h-[1664px] left-[160px] top-[92px] w-[1024px]" data-name="Main Content">
      <Button1 />
      <Container3 />
    </div>
  );
}

function PQ() {
  return (
    <div className="absolute bg-[#f9fafb] h-[1799px] left-0 right-0 top-0" data-name="pQ">
      <Header />
      <MainContent />
    </div>
  );
}

export default function EducationalInstitutePortal() {
  return (
    <div className="bg-white relative size-full" data-name="Educational Institute Portal">
      <PQ />
    </div>
  );
}
