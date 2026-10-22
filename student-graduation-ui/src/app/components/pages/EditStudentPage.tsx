import { useState, useEffect } from "react";
import { instituteService, studentService } from "@/services";
import type { Institute, Student } from "@/data/types";
import imgLogo from "@/imports/EducationalInstitutePortal-3/73da5574736f6a1e3d533885140e2c14827bbc1f.png";

function Container1({ institute }: { institute: Institute | null }) {
  return (
    <div className="h-[48px] flex gap-[12px] items-center">
      <div className="h-[40px] w-[61px] relative shrink-0">
        <img alt="" className="inset-0 size-full object-contain pointer-events-none" src={imgLogo} />
      </div>
      <div className="flex flex-col">
        <span className="font-['Cinzel:Bold',sans-serif] font-bold text-[22px] text-black leading-tight">
          {institute?.name || "University of Utopia"}
        </span>
        <span className="font-['Inter:Light',sans-serif] font-light text-[#1c398e] text-[14px] tracking-[1px] leading-tight">
          {institute?.portalLabel || "Admin Portal"}
        </span>
      </div>
    </div>
  );
}

function Header({ institute }: { institute: Institute | null }) {
  return (
    <header className="w-full bg-white border-b border-[#e5e7eb] px-[32px] md:px-[64px] py-[16px] sticky top-0 z-50">
      <div className="max-w-[1240px] mx-auto flex items-center justify-between w-full">
        <Container1 institute={institute} />
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "logout" }))}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-[16px] py-[8px] rounded-[8px] flex items-center gap-[8px] font-medium text-[14px] transition-colors shadow-sm cursor-pointer"
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

export default function EditStudentPage() {
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [courses, setCourses] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Student State
  const [studentId, setStudentId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [course, setCourse] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [cgpa, setCgpa] = useState<string>("0.0");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");

  // Certificate Details State
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [degreeTitle, setDegreeTitle] = useState("");
  const [graduationMonth, setGraduationMonth] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [classification, setClassification] = useState("");

  useEffect(() => {
    instituteService.getInstitute().then(setInstitute);
    studentService.getCourseOptions().then(setCourses);

    const toEdit = studentService.getStudentToEdit();
    if (toEdit) {
      setStudentId(toEdit.studentId || "");
      setFullName(toEdit.fullName || "");
      setEmail(toEdit.email || "");
      setPhone(toEdit.phone || "");
      setDateOfBirth(toEdit.dateOfBirth || "2004-05-10");
      setAddress(toEdit.address || "123 Main St, City, State 12345");
      setCourse(toEdit.course || "Bachelor of Computer Science");
      setEnrollmentDate(toEdit.enrollmentDate || "2022-09-01");
      setAcademicYear(String(toEdit.year || "2026"));
      setCgpa(toEdit.cgpa != null ? String(toEdit.cgpa) : "8.5");
      setGuardianName(toEdit.guardian?.name || "Robert Smith");
      setGuardianPhone(toEdit.guardian?.phone || "+1 234 567 8901");

      // Leave graduation month and classification empty like the Figma design
      setGraduationMonth("");
      setClassification("");

      if (toEdit.graduationDetails?.registrationNumber) {
        setRegistrationNumber(toEdit.graduationDetails.registrationNumber);
        setDegreeTitle(toEdit.graduationDetails.degreeTitle || toEdit.course || "");
        setGraduationYear(toEdit.graduationDetails.graduationYear ? String(toEdit.graduationDetails.graduationYear) : String(toEdit.year || "2026"));
      } else if (toEdit.registrationNumber) {
        setRegistrationNumber(toEdit.registrationNumber);
        setDegreeTitle(toEdit.course || "");
        setGraduationYear(String(toEdit.year || "2026").match(/\d{4}/)?.[0] || "2026");
      } else {
        // Fetch from backend
        studentService.getGraduationDetails(toEdit.studentId).then((res) => {
          if (Array.isArray(res) && res.length > 0 && res[0].registrationNumber) {
            const detail = res[0];
            setRegistrationNumber(detail.registrationNumber);
            setDegreeTitle(detail.degreeTitle || toEdit.course || "");
            setGraduationYear(detail.graduationYear ? String(detail.graduationYear) : String(toEdit.year || "2026"));
          } else {
            studentService.getStudentById(toEdit.studentId).then(fresh => {
              if (fresh?.graduationDetails?.registrationNumber) {
                setRegistrationNumber(fresh.graduationDetails.registrationNumber);
                setDegreeTitle(fresh.graduationDetails.degreeTitle || fresh.course || "");
                setGraduationYear(fresh.graduationDetails.graduationYear ? String(fresh.graduationDetails.graduationYear) : String(fresh.year || "2026"));
              } else if (fresh?.registrationNumber) {
                setRegistrationNumber(fresh.registrationNumber);
                setDegreeTitle(fresh.course || "");
                setGraduationYear(String(fresh.year || "2026").match(/\d{4}/)?.[0] || "2026");
              }
            });
          }
        });
      }
    }
    return () => {
      studentService.setStudentToEdit(null);
    };
  }, []);

  const goBack = () => {
    studentService.setStudentToEdit(null);
    window.dispatchEvent(new CustomEvent("navigate", { detail: "student-registry" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const studentUpdates: Partial<Student> = {
        studentId,
        fullName,
        email,
        phone,
        dateOfBirth,
        address,
        course,
        enrollmentDate,
        year: academicYear as any,
        cgpa: parseFloat(cgpa) || 0,
        guardian: {
          name: guardianName,
          phone: guardianPhone,
        },
      };

      const hasMonth = Boolean(graduationMonth && graduationMonth.trim() !== "");
      const hasClassification = Boolean(classification && classification.trim() !== "");
      const bothGradDetailsEntered = hasMonth && hasClassification;

      if (bothGradDetailsEntered) {
        studentUpdates.graduationDetails = {
          registrationNumber: registrationNumber.trim(),
          degreeTitle: degreeTitle.trim() || course,
          graduationMonth: parseInt(graduationMonth, 10),
          graduationYear: graduationYear ? parseInt(graduationYear, 10) : 2026,
          classification: classification.trim(),
          certificateStatus: "ISSUED",
        };
        studentUpdates.status = "Graduated";
      } else if (registrationNumber.trim()) {
        studentUpdates.graduationDetails = {
          registrationNumber: registrationNumber.trim(),
          degreeTitle: degreeTitle.trim() || course,
          graduationYear: graduationYear ? parseInt(graduationYear, 10) : 2026,
          graduationMonth: undefined,
          classification: undefined,
          certificateStatus: "PENDING",
        };
      }

      await studentService.updateStudent(studentId, studentUpdates);

      if (bothGradDetailsEntered) {
        // Only when both graduation details are filled, take to Certificate Information Added page
        studentService.setStudentToEdit(null);
        window.dispatchEvent(new CustomEvent("navigate", { detail: "certificate-added" }));
      } else {
        // If only updating CGPA or other fields, do NOT take to that page
        studentService.setStudentToEdit(null);
        setFeedback({ type: "success", message: "Student information updated successfully!" });
        setTimeout(() => {
          goBack();
        }, 1200);
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.message || "Failed to update student information." });
    } finally {
      setIsSubmitting(false);
    }
  };


  const courseList = courses.length > 0 ? courses : [
    "Bachelor of Computer Science",
    "Bachelor of Engineering",
    "Bachelor of Commerce",
    "Bachelor of Science",
    "Bachelor of Arts",
    "Master of Science",
    "Master of Business Administration",
  ];

  return (
    <div className="bg-[#f9fafb] min-h-screen w-full flex flex-col" data-name="Update Student Page">
      <Header institute={institute} />

      <div className="w-full max-w-[960px] mx-auto px-[24px] py-[32px] flex flex-col gap-[20px]">
        {/* Back Link */}
        <button
          type="button"
          onClick={goBack}
          className="self-start flex items-center gap-[8px] text-[14px] text-[#6b7280] hover:text-[#111827] transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Student Registry
        </button>

        {/* Title and Subtitle */}
        <div>
          <h1 className="text-[24px] font-bold text-[#111827]">Update Student Information</h1>
          <p className="text-[14px] text-[#6b7280] mt-[4px]">
            Update details for {fullName || "the student"}
          </p>
        </div>

        {feedback && (
          <div
            className={`p-[16px] rounded-[8px] text-[14px] font-medium ${
              feedback.type === "success"
                ? "bg-[#dcfce7] text-[#15803d] border border-[#86efac]"
                : "bg-[#fee2e2] text-[#b91c1c] border border-[#fca5a5]"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Main Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-[16px] border border-[#e5e7eb] shadow-sm p-[32px] flex flex-col gap-[28px]">
          
          {/* 1. Personal Information */}
          <div className="flex flex-col gap-[16px]">
            <h2 className="text-[16px] font-bold text-[#111827]">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                  Student ID
                </label>
                <input
                  type="text"
                  value={studentId}
                  disabled
                  className="w-full px-[14px] py-[10px] bg-[#f9fafb] border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#6b7280] outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                  Full Name<span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-[14px] py-[10px] bg-white border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                  Email Address<span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-[14px] py-[10px] bg-white border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                  Phone Number<span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-[14px] py-[10px] bg-white border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                  Date of Birth<span className="text-[#ef4444]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-[14px] py-[10px] bg-white border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                Address<span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-[14px] py-[10px] bg-white border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] shadow-sm"
              />
            </div>
          </div>

          {/* 2. Academic Information */}
          <div className="flex flex-col gap-[16px] border-t border-[#f3f4f6] pt-[20px]">
            <h2 className="text-[16px] font-bold text-[#111827]">Academic Information</h2>

            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                Course/Program <span className="text-[#ef4444]">*</span>
              </label>
              <div className="relative">
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full appearance-none px-[14px] py-[10px] bg-white border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] shadow-sm pr-[36px] cursor-pointer"
                >
                  {courseList.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
                <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#9ca3af]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                  Enrollment Date<span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={enrollmentDate}
                  onChange={(e) => setEnrollmentDate(e.target.value)}
                  className="w-full px-[14px] py-[10px] bg-white border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                  Academic Year <span className="text-[#ef4444]">*</span>
                </label>
                <div className="relative">
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full appearance-none px-[14px] py-[10px] bg-white border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] shadow-sm pr-[36px] cursor-pointer"
                  >
                    {!["First Year", "Second Year", "Third Year", "Final Year"].includes(academicYear) && academicYear && (
                      <option value={academicYear}>{academicYear}</option>
                    )}
                    <option value="First Year">First Year</option>
                    <option value="Second Year">Second Year</option>
                    <option value="Third Year">Third Year</option>
                    <option value="Final Year">Final Year</option>
                  </select>
                  <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#9ca3af]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                  CGPA<span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  required
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  placeholder="8.5"
                  className="w-full px-[14px] py-[10px] bg-white border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* 3. Guardian Information */}
          <div className="flex flex-col gap-[16px] border-t border-[#f3f4f6] pt-[20px]">
            <h2 className="text-[16px] font-bold text-[#111827]">Guardian Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                  Guardian Name<span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="w-full px-[14px] py-[10px] bg-white border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                  Guardian Phone<span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  className="w-full px-[14px] py-[10px] bg-white border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* 4. Certificate Details */}
          <div className="flex flex-col gap-[16px] border-t border-[#f3f4f6] pt-[20px]">
            <div className="flex items-center gap-[8px]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
              </svg>
              <h2 className="text-[16px] font-bold text-[#111827]">Certificate Details</h2>
            </div>

            {/* Amber Alert Banner */}
            <div className="bg-[#fffbeb] border border-[#fde68a] rounded-[8px] p-[16px] flex flex-col gap-[4px]">
              <span className="font-bold text-[13px] text-[#b45309]">Final Year Student</span>
              <p className="text-[12px] text-[#92400e]">
                Add certificate details below for graduation certificate issuance. These details will appear on the student&apos;s degree certificate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                  Registration Number<span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="REG001234"
                  className="w-full px-[14px] py-[10px] bg-white border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                  Degree Title<span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="text"
                  value={degreeTitle}
                  onChange={(e) => setDegreeTitle(e.target.value)}
                  placeholder="Bachelor of Computer Science"
                  className="w-full px-[14px] py-[10px] bg-white border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                  Graduation Month <span className="text-[#ef4444]">*</span>
                </label>
                <div className="relative">
                  <select
                    value={graduationMonth}
                    onChange={(e) => setGraduationMonth(e.target.value)}
                    className="w-full appearance-none px-[14px] py-[10px] bg-white border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] shadow-sm pr-[36px] cursor-pointer"
                  >
                    <option value="">Select Month</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                  <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#9ca3af]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                  Graduation Year<span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="text"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  placeholder="2026"
                  className="w-full px-[14px] py-[10px] bg-white border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                Classification (Honors/Distinction) <span className="text-[#ef4444]">*</span>
              </label>
              <div className="relative">
                <select
                  value={classification}
                  onChange={(e) => setClassification(e.target.value)}
                  className="w-full appearance-none px-[14px] py-[10px] bg-white border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] shadow-sm pr-[36px] cursor-pointer"
                >
                  <option value="">Select Classification</option>
                  <option value="First Class with Distinction">First Class with Distinction</option>
                  <option value="First Class">First Class</option>
                  <option value="Second Class (Upper Division)">Second Class (Upper Division)</option>
                  <option value="Second Class (Lower Division)">Second Class (Lower Division)</option>
                  <option value="Pass">Pass</option>
                </select>
                <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#9ca3af]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="border-t border-[#e5e7eb] pt-[24px] flex justify-end items-center gap-[12px]">
            <button
              type="button"
              onClick={goBack}
              className="px-[24px] py-[10px] border border-[#d1d5db] bg-white text-[#374151] hover:bg-gray-50 rounded-[8px] text-[14px] font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-[24px] py-[10px] bg-[#1c398e] hover:bg-[#152e75] text-white rounded-[8px] text-[14px] font-semibold transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Student Information"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
