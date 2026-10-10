import { useState, useEffect } from "react";
import { instituteService, studentService } from "@/services";
import type { Institute, Student } from "@/data/types";
import svgPaths from "@/imports/EducationalInstitutePortal-3/svg-89o4hae5ek";
import imgLogo from "@/imports/EducationalInstitutePortal-3/73da5574736f6a1e3d533885140e2c14827bbc1f.png";

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

function Heading1() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="[word-break:break-word] absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[32px] left-0 not-italic text-[#101828] text-[24px] top-0 tracking-[0.0703px] whitespace-nowrap">Add New Student</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#4a5565] text-[16px] top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">Register a new student in the system</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[60px] relative shrink-0 w-[266.602px]" data-name="Container">
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

export default function EducationalInstitutePortal() {
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [courses, setCourses] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // CGPA is intentionally not part of this form (will be captured later).
  // createStudent() still sends the default value; updateStudent() keeps the existing value.
  const emptyForm: Partial<Student> = {
    studentId: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    course: "",
    year: "" as any,
    dateOfBirth: "",
    enrollmentDate: "",
    guardian: { name: "", phone: "" },
  };

  const [formValues, setFormValues] = useState<Partial<Student>>(emptyForm);

  useEffect(() => {
    instituteService.getInstitute().then(setInstitute);
    studentService.getCourseOptions().then(setCourses);
    studentService.getAcademicYearOptions().then(setYears);
    
    // AddStudentPage is strictly for registering a new student
    studentService.setStudentToEdit(null);
    setIsEditMode(false);
    setEditingId(null);
    setFormValues(emptyForm);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    try {
      if (isEditMode && editingId) {
        await studentService.updateStudent(editingId, formValues);
        setFeedback({ type: "success", message: `Student "${formValues.fullName}" updated successfully!` });
        // Optionally redirect back to registry
        // window.dispatchEvent(new CustomEvent("navigate", { detail: "student-registry" }));
      } else {
        await studentService.createStudent(formValues);
        // Dispatch event to navigate to the success page
        window.dispatchEvent(
          new CustomEvent("navigate", { detail: "student-registered" })
        );
        // Reset form
        setFormValues(emptyForm);
      }
    } catch (error: any) {
      setFeedback({ type: "error", message: error?.message || "Failed to save student. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () =>
    window.dispatchEvent(new CustomEvent("navigate", { detail: isEditMode ? "student-registry" : "dashboard" }));

  // Make sure an existing value (edit mode) is always selectable even if it isn't in the option list
  const courseList = courses.length > 0 ? courses : ["Bachelor of Computer Science"];
  const courseOptionsWithCurrent =
    formValues.course && !courseList.includes(formValues.course) ? [formValues.course, ...courseList] : courseList;
  const yearList = years.length > 0 ? years : ["First Year", "Second Year", "Third Year", "Final Year"];
  const yearOptionsWithCurrent =
    formValues.year && !yearList.includes(formValues.year as string) ? [formValues.year as string, ...yearList] : yearList;

  return (
    <div className="bg-[#f9fafb] relative size-full min-h-[1000px]" data-name="Educational Institute Portal">
      <Header institute={institute} />

      <div className="absolute left-0 top-[81px] w-[1344px] pt-[32px] pb-[48px] flex justify-center">
        <div className="w-[960px] flex flex-col gap-[24px]">
          {/* Back link */}
          <button
            type="button"
            id="add-student-back"
            className="self-start flex items-center gap-[8px] text-[16px] leading-[24px] text-[#4a5565] hover:text-[#101828] transition-colors"
            onClick={goBack}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15.8333 10H4.16667" />
              <path d="M10 15.8333L4.16667 10L10 4.16667" />
            </svg>
            {isEditMode ? "Back to Registry" : "Back to Dashboard"}
          </button>

          {/* Feedback banner */}
          {feedback && (
            <div
              className={`p-[16px] rounded-[12px] text-[14px] font-medium ${
                feedback.type === "success"
                  ? "bg-[#dcfce7] text-[#016630] border border-[#bbf7d0]"
                  : "bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            id="add-student-form"
            className="bg-white p-[32px] rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] flex flex-col w-full"
          >
            {/* Title */}
            <div className="flex flex-col gap-[4px] mb-[32px]">
              <h2 className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[32px] text-[#101828] text-[24px] tracking-[0.0703px]">
                {isEditMode ? "Edit Student Details" : "Add New Student"}
              </h2>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] text-[#4a5565] text-[16px] tracking-[-0.3125px]">
                {isEditMode ? "Update the student's information" : "Register a new student in the system"}
              </p>
            </div>

            {/* Personal Information */}
            <section className="flex flex-col gap-[16px]">
              <Heading2 />
              <div className="grid grid-cols-2 gap-x-[16px] gap-y-[16px]">
                <Field label="Student ID" htmlFor="student-id">
                  <input
                    id="student-id"
                    type="text"
                    value={formValues.studentId || ""}
                    onChange={(e) => setFormValues({ ...formValues, studentId: e.target.value })}
                    placeholder="STU001234"
                    className={inputClass}
                    required
                  />
                </Field>

                <Field label="Full Name" htmlFor="full-name">
                  <input
                    id="full-name"
                    type="text"
                    value={formValues.fullName || ""}
                    onChange={(e) => setFormValues({ ...formValues, fullName: e.target.value })}
                    placeholder="John Doe"
                    className={inputClass}
                    required
                  />
                </Field>

                <Field label="Email Address" htmlFor="email">
                  <input
                    id="email"
                    type="email"
                    value={formValues.email || ""}
                    onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                    placeholder="student@email.com"
                    className={inputClass}
                    required
                  />
                </Field>

                <Field label="Phone Number" htmlFor="phone">
                  <input
                    id="phone"
                    type="tel"
                    value={formValues.phone || ""}
                    onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                    className={inputClass}
                    required
                  />
                </Field>

                <Field label="Date of Birth" htmlFor="dob">
                  <input
                    id="dob"
                    type="date"
                    value={formValues.dateOfBirth || ""}
                    onChange={(e) => setFormValues({ ...formValues, dateOfBirth: e.target.value })}
                    className={inputClass}
                    required
                  />
                </Field>
                <div />

                <div className="col-span-2">
                  <Field label="Address" htmlFor="address">
                    <input
                      id="address"
                      type="text"
                      value={formValues.address || ""}
                      onChange={(e) => setFormValues({ ...formValues, address: e.target.value })}
                      placeholder="123 Main Street, City, State 12345"
                      className={inputClass}
                      required
                    />
                  </Field>
                </div>
              </div>
            </section>

            {/* Academic Information */}
            <section className="flex flex-col gap-[16px] border-t border-[#e5e7eb] mt-[24px] pt-[24px]">
              <SectionHeading>Academic Information</SectionHeading>
              <div className="grid grid-cols-2 gap-x-[16px] gap-y-[16px]">
                <div className="col-span-2">
                  <Field label="Course/Program" htmlFor="course" spaced>
                    <SelectWrapper>
                      <select
                        id="course"
                        value={formValues.course || ""}
                        onChange={(e) => setFormValues({ ...formValues, course: e.target.value })}
                        className={selectClass}
                        required
                      >
                        <option value="" disabled hidden></option>
                        {courseOptionsWithCurrent.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </SelectWrapper>
                  </Field>
                </div>

                <Field label="Enrollment Date" htmlFor="enrollment-date">
                  <input
                    id="enrollment-date"
                    type="date"
                    value={formValues.enrollmentDate || ""}
                    onChange={(e) => setFormValues({ ...formValues, enrollmentDate: e.target.value })}
                    className={inputClass}
                    required
                  />
                </Field>

                <Field label="Academic Year" htmlFor="academic-year" spaced>
                  <SelectWrapper>
                    <select
                      id="academic-year"
                      value={(formValues.year as string) || ""}
                      onChange={(e) => setFormValues({ ...formValues, year: e.target.value as any })}
                      className={selectClass}
                      required
                    >
                      <option value="" disabled hidden></option>
                      {yearOptionsWithCurrent.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </SelectWrapper>
                </Field>
              </div>
            </section>

            {/* Graduation Details Section (Edit Mode Only) */}
            {isEditMode && (
              <section className="border-t border-[#e5e7eb] mt-[24px] pt-[24px] flex items-center justify-between">
                <div>
                  <p className="font-medium text-[18px] text-[#101828]">Graduation Status</p>
                  <p className="text-[14px] text-[#4a5565]">Manage graduation records to issue credentials</p>
                </div>
                <button
                  type="button"
                  className="px-[16px] py-[8px] bg-green-600 hover:bg-green-700 text-white rounded-[8px] text-[14px] font-medium transition-colors"
                  data-name="Button"
                  onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "graduation-details" }))}
                >
                  Graduation Details
                </button>
              </section>
            )}

            {/* Guardian Information */}
            <section className="flex flex-col gap-[16px] border-t border-[#e5e7eb] mt-[24px] pt-[24px]">
              <SectionHeading>Guardian Information</SectionHeading>
              <div className="grid grid-cols-2 gap-x-[16px] gap-y-[16px]">
                <Field label="Guardian Name" htmlFor="guardian-name">
                  <input
                    id="guardian-name"
                    type="text"
                    value={formValues.guardian?.name || ""}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        guardian: { name: e.target.value, phone: formValues.guardian?.phone || "" },
                      })
                    }
                    placeholder="Parent or Guardian Name"
                    className={inputClass}
                    required
                  />
                </Field>

                <Field label="Guardian Phone" htmlFor="guardian-phone">
                  <input
                    id="guardian-phone"
                    type="tel"
                    value={formValues.guardian?.phone || ""}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        guardian: { name: formValues.guardian?.name || "", phone: e.target.value },
                      })
                    }
                    placeholder="+1 234 567 8900"
                    className={inputClass}
                    required
                  />
                </Field>
              </div>
            </section>

            {/* Actions */}
            <div className="flex justify-end items-center gap-[12px] border-t border-[#e5e7eb] mt-[40px] pt-[24px]">
              <button
                type="button"
                id="add-student-cancel"
                onClick={goBack}
                className="h-[40px] px-[16px] bg-white border border-[#d1d5dc] rounded-[8px] text-[14px] font-medium text-[#364153] hover:bg-[#f9fafb] transition-colors"
                data-name="Button"
              >
                Cancel
              </button>

              <button
                type="submit"
                id="add-student-submit"
                disabled={isSubmitting}
                className="h-[40px] px-[16px] bg-[#f0b100] hover:bg-[#d99e00] disabled:opacity-50 text-white rounded-[8px] text-[14px] font-medium transition-colors"
                data-name="Button"
              >
                {isSubmitting ? "Processing..." : isEditMode ? "Update Student" : "Register Student"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form building blocks (match Figma: 14px label + red asterisk, 42px inputs)
// ---------------------------------------------------------------------------

const inputClass =
  "w-full h-[42px] px-[12px] bg-white border border-[#d1d5dc] rounded-[8px] text-[16px] text-[#101828] placeholder:text-[#99a1af] outline-none focus:border-[#f0b100] focus:ring-2 focus:ring-[#f0b100]/20 transition-colors";

const selectClass = `${inputClass} appearance-none pr-[36px] cursor-pointer`;

function Field({
  label,
  htmlFor,
  spaced = false,
  children,
}: {
  label: string;
  htmlFor: string;
  /** Figma shows "Course/Program *" and "Academic Year *" with a space before the asterisk */
  spaced?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[6px] w-full">
      <label htmlFor={htmlFor} className="text-[14px] leading-[20px] font-normal text-[#364153]">
        {label}
        {spaced ? " " : ""}
        <span className="text-[#fb2c36]">*</span>
      </label>
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] text-[#101828] text-[18px] tracking-[-0.4395px]">
      {children}
    </p>
  );
}

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full">
      {children}
      <svg
        className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2 text-[#99a1af]"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 6l4 4 4-4" />
      </svg>
    </div>
  );
}

