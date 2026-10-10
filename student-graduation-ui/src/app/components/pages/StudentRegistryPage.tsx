import { useState, useEffect } from "react";
import { instituteService, studentService } from "@/services";
import type { Institute, Student } from "@/data/types";
import imgLogo from "@/imports/EducationalInstitutePortal-8/73da5574736f6a1e3d533885140e2c14827bbc1f.png";

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

export default function EducationalInstitutePortal() {
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [selectedYear, setSelectedYear] = useState("All Academic Years");
  const [graduatingOnly, setGraduatingOnly] = useState(false);
  const [courses, setCourses] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    instituteService.getInstitute().then(setInstitute);
    studentService.getCourseOptions().then(setCourses);
    studentService.getAcademicYearOptions().then(setYears);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    studentService
      .getStudents({ search: searchQuery, course: selectedCourse, year: selectedYear })
      .then((data) => {
        setStudentsList(data);
        setCurrentPage(1);
      })
      .finally(() => setIsLoading(false));
  }, [searchQuery, selectedCourse, selectedYear]);

  // Filter graduating if toggled (when final year is mentioned in the year)
  const displayedStudents = graduatingOnly
    ? studentsList.filter(s => Boolean(s.year && String(s.year).toLowerCase().includes("final")))
    : studentsList;

  const totalPages = Math.max(1, Math.ceil(displayedStudents.length / itemsPerPage));
  const currentStudents = displayedStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPaginationItems = () => {
    if (totalPages <= 1) {
      return [1];
    }
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 2) {
      return [1, 2, "...", totalPages];
    } else if (currentPage >= totalPages - 1) {
      return [1, "...", totalPages - 1, totalPages];
    } else {
      return [1, "...", currentPage, "...", totalPages];
    }
  };

  return (
    <div className="bg-[#f9fafb] min-h-screen w-full flex flex-col" data-name="Educational Institute Portal">
      <Header institute={institute} />
      
      <div className="w-full max-w-[1240px] mx-auto px-[24px] md:px-[40px] py-[28px] flex flex-col gap-[24px]">
        <div className="flex flex-col gap-[8px]">
          <button 
            className="flex items-center gap-[8px] text-[#4b5563] text-[14px] hover:text-[#111827] w-fit cursor-pointer"
            onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "dashboard" }))}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-[24px] font-semibold text-[#111827]">Student Registry</h1>
            <p className="text-[14px] text-[#6b7280]">View and manage all registered students</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[16px] border border-[#e5e7eb] shadow-sm flex flex-col">
          
          <div className="p-[24px] flex flex-col gap-[20px]">
            <div>
              <h2 className="text-[18px] font-bold text-[#111827]">All Students</h2>
              <p className="text-[14px] text-[#6b7280]">Filter and search through the student database</p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <svg className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[#9ca3af]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search by name, email, student ID, or course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-[44px] pr-[16px] py-[10px] border border-[#e5e7eb] rounded-[8px] text-[14px] outline-none focus:border-[#3b82f6] text-[#111827] placeholder:text-[#9ca3af]"
              />
            </div>

            {/* Filter Container */}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] p-[16px] flex flex-col gap-[12px]">
              <div className="flex items-center gap-[6px] text-[#6b7280] text-[11px] font-bold tracking-wider uppercase">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                FILTERS
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] items-end">
                {/* 1. Quick Filter Card */}
                <div 
                  onClick={() => {
                    setGraduatingOnly(prev => !prev);
                    setCurrentPage(1);
                  }}
                  className={`bg-white border rounded-[8px] px-[12px] py-[8px] flex items-center gap-[12px] cursor-pointer transition-all h-[46px] shadow-sm ${
                    graduatingOnly 
                      ? 'border-[#af8010] ring-2 ring-[#fde68a] bg-[#fffbeb]' 
                      : 'border-[#e2e8f0] hover:border-[#cbd5e1]'
                  }`}
                >
                  <div className="w-[32px] h-[32px] rounded-[6px] bg-[#af8010] flex items-center justify-center text-white shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#6b7280] font-bold uppercase tracking-wider leading-tight">QUICK FILTER</span>
                    <span className="text-[13px] font-bold text-[#111827] leading-tight">Graduating Students</span>
                  </div>
                </div>

                {/* 2. Academic Year */}
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[11px] text-[#6b7280] font-bold uppercase tracking-wider flex items-center gap-[6px]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    ACADEMIC YEAR
                  </label>
                  <div className="relative">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full appearance-none px-[12px] py-[8px] border border-[#e2e8f0] rounded-[8px] text-[13px] bg-white text-[#374151] outline-none focus:border-[#3b82f6] h-[46px] shadow-sm cursor-pointer pr-[32px]"
                    >
                      <option value="All Academic Years">All Academic Years</option>
                      {years.map((y, i) => (
                        <option key={i} value={y}>{y}</option>
                      ))}
                    </select>
                    <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#9ca3af]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 3. Course Program */}
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[11px] text-[#6b7280] font-bold uppercase tracking-wider flex items-center gap-[6px]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    COURSE PROGRAM
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full appearance-none px-[12px] py-[8px] border border-[#e2e8f0] rounded-[8px] text-[13px] bg-white text-[#374151] outline-none focus:border-[#3b82f6] h-[46px] shadow-sm cursor-pointer pr-[32px]"
                    >
                      <option value="All Courses">All Courses</option>
                      {courses.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>
                    <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#9ca3af]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-[12px] text-[#6b7280]">
              Showing <strong className="text-[#111827]">{currentStudents.length}</strong> of <strong className="text-[#111827]">{displayedStudents.length}</strong> students
            </div>
          </div>

          {/* Table Container - overflow-hidden to prevent native scrollbar */}
          <div className="w-full overflow-hidden border-t border-[#e5e7eb]">
            {isLoading ? (
              <div className="p-[32px] text-center text-[#4a5565]">Loading registry data...</div>
            ) : currentStudents.length === 0 ? (
              <div className="p-[32px] text-center text-[#4a5565]">No student records match your filters.</div>
            ) : (
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="border-b border-[#e5e7eb] text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">
                    <th className="py-[14px] px-[16px] whitespace-nowrap">Student ID</th>
                    <th className="py-[14px] px-[16px] whitespace-nowrap">Name</th>
                    <th className="py-[14px] px-[16px] whitespace-nowrap">Email</th>
                    <th className="py-[14px] px-[16px]">Course</th>
                    <th className="py-[14px] px-[16px] whitespace-nowrap">Year</th>
                    <th className="py-[14px] px-[16px] whitespace-nowrap">CGPA</th>
                    <th className="py-[14px] px-[16px] whitespace-nowrap">Status</th>
                    <th className="py-[14px] px-[16px] whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map((st) => {
                    const isGraduating = Boolean(st.year && String(st.year).toLowerCase().includes("final"));
                    return (
                      <tr key={st.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] text-[13px] transition-colors">
                        <td className="py-[14px] px-[16px] font-medium text-[#4b5563] whitespace-nowrap">
                          {st.studentId}
                        </td>
                        <td className="py-[14px] px-[16px] whitespace-nowrap">
                          <div className="flex items-center gap-[8px]">
                            <span className="font-semibold text-[#111827]">{st.fullName}</span>
                            {isGraduating && (
                              <span className="inline-flex items-center gap-[4px] px-[8px] py-[2px] bg-[#fef3c7] text-[#a16207] text-[10px] font-medium rounded-full">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                                </svg>
                                Graduating
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-[14px] px-[16px] text-[#4b5563] whitespace-nowrap">
                          {st.email}
                        </td>
                        <td className="py-[14px] px-[16px] text-[#4b5563] max-w-[200px] leading-snug">
                          {st.course}
                        </td>
                        <td className="py-[14px] px-[16px] text-[#4b5563] whitespace-nowrap">
                          {st.year}
                        </td>
                        <td className="py-[14px] px-[16px] text-[#4b5563] whitespace-nowrap">
                          {st.cgpa.toFixed(1)}
                        </td>
                        <td className="py-[14px] px-[16px] whitespace-nowrap">
                          <span className="inline-flex items-center px-[8px] py-[2px] rounded-full text-[10px] font-bold uppercase bg-[#dcfce7] text-[#15803d]">
                            Active
                          </span>
                        </td>
                        <td className="py-[14px] px-[16px] whitespace-nowrap">
                          <div className="flex items-center gap-[12px]">
                            <button className="flex items-center gap-[4px] text-[#39519c] hover:text-[#1e293b] font-medium text-[13px] cursor-pointer">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                              View
                            </button>
                            <button 
                              className="flex items-center gap-[4px] text-[#2563eb] hover:text-[#1d4ed8] font-medium text-[13px] cursor-pointer"
                              onClick={() => {
                                studentService.setStudentToEdit(st);
                                window.dispatchEvent(new CustomEvent("navigate", { detail: "edit-student" }));
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center items-center gap-[16px] py-[20px] text-[13px] border-t border-[#e5e7eb]">
            <button 
              className={`flex items-center gap-[6px] font-medium transition-colors ${
                currentPage === 1 
                  ? 'text-[#cbd5e1] cursor-not-allowed select-none' 
                  : 'text-[#4b5563] hover:text-[#111827] cursor-pointer'
              }`}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg> 
              Previous
            </button>
            
            <div className="flex items-center gap-[6px]">
              {getPaginationItems().map((item, idx) => {
                if (item === "...") {
                  return (
                    <span key={`dots-${idx}`} className="w-[28px] text-center text-[#9ca3af] font-medium text-[13px] select-none">
                      ...
                    </span>
                  );
                }
                const pageNum = Number(item);
                const isActive = currentPage === pageNum;
                return (
                  <button 
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-[28px] h-[28px] rounded-[6px] flex items-center justify-center font-semibold text-[13px] transition-colors cursor-pointer ${
                      isActive 
                        ? 'bg-[#111827] text-white shadow-sm' 
                        : 'text-[#4b5563] hover:bg-[#f3f4f6]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button 
              className={`flex items-center gap-[6px] font-medium transition-colors ${
                currentPage === totalPages 
                  ? 'text-[#cbd5e1] cursor-not-allowed select-none' 
                  : 'text-[#4b5563] hover:text-[#111827] cursor-pointer'
              }`}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next 
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
