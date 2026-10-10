import { useState, useEffect, useMemo } from "react";
import { dashboardService, instituteService, studentService, activityService, parseDate } from "@/services";
import type { Institute, DashboardStats, Student, ActivityType, UpcomingGraduation } from "@/data/types";
import imgLogo from "@/imports/EducationalInstitutePortal-2/73da5574736f6a1e3d533885140e2c14827bbc1f.png";

// ---------------------------------------------------------------------------
// Header Component
// ---------------------------------------------------------------------------
function Header({ institute }: { institute: Institute | null }) {
  const handleLogout = () => {
    window.dispatchEvent(new CustomEvent("navigate", { detail: "logout" }));
  };

  return (
    <div className="w-full bg-white border-b border-[#e5e7eb] px-[64px] py-[16px] flex items-center justify-between" data-name="Header">
      <div className="flex gap-[12px] items-center">
        <div className="h-[40px] w-[61px] shrink-0" data-name="logo">
          <img alt="University Logo" className="size-full object-contain pointer-events-none" src={imgLogo} />
        </div>
        <div className="flex flex-col">
          <h1 className="font-['Cinzel:Bold',sans-serif] font-bold text-[24px] text-black leading-[32px]">
            {institute?.name || "University of Utopia"}
          </h1>
          <p className="font-['Inter:Light',sans-serif] font-light text-[#1c398e] text-[16px] tracking-[1px] leading-[20px]">
            {institute?.portalLabel || "Admin Portal"}
          </p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="bg-[rgba(64,123,255,0.7)] hover:bg-[#3b82f6] text-white h-[40px] px-[16px] rounded-[10px] flex items-center gap-[8px] transition-colors cursor-pointer"
        data-name="Button"
      >
        <svg className="size-[20px]" fill="none" viewBox="0 0 20 20">
          <path d="M7.5 17.5H4.16667C3.24619 17.5 2.5 16.7538 2.5 15.8333V4.16667C2.5 3.24619 3.24619 2.5 4.16667 2.5H7.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.3333 14.1667L17.5 10L13.3333 5.83333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M17.5 10H7.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </svg>
        <span className="font-['Inter:Medium',sans-serif] font-medium text-[16px] tracking-[-0.3125px]">
          Logout
        </span>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat Tile Component
// ---------------------------------------------------------------------------
interface StatCardProps {
  label: string;
  value: string;
  caption?: string;
  captionColor?: string;
  iconBg: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, caption, captionColor, iconBg, icon }: StatCardProps) {
  return (
    <div
      className="bg-white rounded-[10px] drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] p-[24px] flex items-center justify-between w-full"
      data-name="Container"
    >
      <div className="flex flex-col gap-[4px]">
        <p className="font-['Inter:Regular',sans-serif] text-[#4a5565] text-[14px] tracking-[-0.1504px]">
          {label}
        </p>
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#101828] text-[30px] leading-[36px] tracking-[0.3955px]">
          {value}
        </p>
        {caption ? (
          <p className="font-['Inter:Regular',sans-serif] text-[12px] leading-[16px]" style={{ color: captionColor || "#6a7282" }}>
            {caption}
          </p>
        ) : null}
      </div>
      <div className="rounded-[10px] size-[48px] flex items-center justify-center shrink-0" style={{ backgroundColor: iconBg }}>
        {icon}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Activity Feed Item Component
// ---------------------------------------------------------------------------
function ActivityRow({ type, title, subject, timeAgo }: { type: ActivityType; title: string; subject: string; timeAgo: string }) {
  const getIcon = () => {
    switch (type) {
      case "student-registered":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        );
      case "certificate-issued":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
          </svg>
        );
      case "student-updated":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        );
      case "certificate-requested":
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
    }
  };

  return (
    <div className="flex items-start gap-[12px] py-[14px] border-b border-[#f3f4f6] last:border-b-0 w-full" data-name="Container">
      <div className="bg-[#1c398e] text-white size-[32px] rounded-full flex items-center justify-center shrink-0 mt-[2px]">
        {getIcon()}
      </div>
      <div className="flex flex-col gap-[2px] flex-1">
        <p className="font-['Inter:Medium',sans-serif] font-medium text-[#101828] text-[14px] tracking-[-0.1504px] leading-[20px]">
          {title}
        </p>
        <p className="font-['Inter:Regular',sans-serif] text-[#4a5565] text-[14px] tracking-[-0.1504px] leading-[20px]">
          {subject}
        </p>
        <p className="font-['Inter:Regular',sans-serif] text-[#6a7282] text-[12px] leading-[16px]">
          {timeAgo}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Upcoming Graduation Card Component
// ---------------------------------------------------------------------------
function UpcomingGraduationCard({ item }: { item: UpcomingGraduation }) {
  return (
    <div className="bg-[#f5f9ff] rounded-[10px] p-[16px] flex flex-col gap-[8px] w-full" data-name="Container">
      <div className="flex items-center justify-between">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#101828] text-[16px] tracking-[-0.3125px]">
          {item.period}
        </p>
        <span className="bg-[#1c398e] text-white text-[12px] font-semibold px-[12px] py-[4px] rounded-full">
          0 Students
        </span>
      </div>
      <p className="font-['Inter:Regular',sans-serif] text-[#4a5565] text-[14px] tracking-[-0.1504px]">
        {item.program || "Various Programs"}
      </p>
      <div className="bg-[#e5e7eb] h-[8px] rounded-full w-full overflow-hidden mt-[4px]">
        <div className="bg-[#1c398e] h-full rounded-full transition-all duration-300" style={{ width: "0%" }} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Dashboard Page Component
// ---------------------------------------------------------------------------
export default function DashboardPage() {
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      instituteService.getInstitute(),
      dashboardService.getDashboard(),
      studentService.getStudents(),
    ])
      .then(([inst, stats, students]) => {
        setInstitute(inst);
        setDashboardStats(stats);
        setStudentsList(students);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Periodic refresh to keep relative times accurate as time passes
  useEffect(() => {
    const timer = setInterval(() => {
      if (studentsList.length > 0) {
        const recentActivity = activityService.getRecentActivities(studentsList);
        setDashboardStats((prev) => (prev ? { ...prev, recentActivity } : prev));
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [studentsList]);

  // Sort newly registered students by createdAt descending
  const newlyRegisteredStudents = useMemo(() => {
    return [...studentsList].sort((a, b) => {
      const timeA = parseDate(a.createdAt)?.getTime() || 0;
      const timeB = parseDate(b.createdAt)?.getTime() || 0;
      return timeB - timeA;
    });
  }, [studentsList]);

  // Filter newly registered students by search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return newlyRegisteredStudents.slice(0, 10);
    const q = searchQuery.toLowerCase().trim();
    return newlyRegisteredStudents.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q)
    );
  }, [newlyRegisteredStudents, searchQuery]);

  const handleNavigate = (target: string, student?: Student) => {
    if (student) {
      studentService.setStudentToEdit(student);
    }
    window.dispatchEvent(new CustomEvent("navigate", { detail: target }));
  };

  // Stat tiles from live data
  const statMap = useMemo(() => {
    const map = new Map<string, { value: string; caption: string }>();
    if (dashboardStats?.stats) {
      for (const st of dashboardStats.stats) {
        map.set(st.id, { value: st.value, caption: st.caption });
      }
    }
    return map;
  }, [dashboardStats]);

  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-[#f9fafb] min-h-screen w-full flex flex-col items-center" data-name="Educational Institute Portal">
      <Header institute={institute} />

      <main className="w-full max-w-[1344px] px-[64px] py-[32px] flex flex-col gap-[32px]" data-name="Main Content">
        {/* Title Section */}
        <div className="flex flex-col gap-[8px]" data-name="Container">
          <h2 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#101828] text-[24px] leading-[32px] tracking-[0.0703px]">
            Dashboard
          </h2>
          <p className="font-['Inter:Regular',sans-serif] text-[#4a5565] text-[16px] leading-[24px] tracking-[-0.3125px]">
            Manage student registrations and information.
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full" data-name="Container">
          {/* Card 1: Student Registry */}
          <div
            onClick={() => handleNavigate("student-registry")}
            className="bg-[#1c398e] hover:bg-[#162e73] transition-colors rounded-[10px] p-[24px] flex items-center gap-[20px] cursor-pointer shadow-md"
            data-name="Button"
          >
            <div className="bg-white rounded-[10px] size-[56px] flex items-center justify-center shrink-0">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#155DFC" strokeWidth="2" />
                <circle cx="12" cy="10" r="3" stroke="#155DFC" strokeWidth="2" />
                <path d="M7 18c0-2.5 2.5-4 5-4s5 1.5 5 4" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-white text-[20px] leading-[28px] tracking-[-0.4492px]">
                Student Registry
              </h3>
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[#f3e8ff] text-[16px] leading-[24px] tracking-[-0.3125px]">
                View and edit details for existing students.
              </p>
            </div>
          </div>

          {/* Card 2: Add New Student */}
          <div
            onClick={() => handleNavigate("add-student")}
            className="bg-[#1c398e] hover:bg-[#162e73] transition-colors rounded-[10px] p-[24px] flex items-center gap-[20px] cursor-pointer shadow-md"
            data-name="Button"
          >
            <div className="bg-white rounded-[10px] size-[56px] flex items-center justify-center shrink-0">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" />
                <circle cx="8.5" cy="7" r="4" stroke="#155DFC" strokeWidth="2" />
                <line x1="20" y1="8" x2="20" y2="14" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" />
                <line x1="23" y1="11" x2="17" y2="11" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-white text-[20px] leading-[28px] tracking-[-0.4492px]">
                Add New Student
              </h3>
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[#f3e8ff] text-[16px] leading-[24px] tracking-[-0.3125px]">
                Register a new student in the system
              </p>
            </div>
          </div>
        </div>

        {/* Top 3 Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-full" data-name="Container">
          <StatCard
            label="Total Students"
            value={statMap.get("total-students")?.value || (loading ? "..." : "0")}
            iconBg="#af8010"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
          <StatCard
            label="Active Students"
            value={statMap.get("active-students")?.value || (loading ? "..." : "0")}
            iconBg="#af8010"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
          <StatCard
            label="Courses Offered"
            value={statMap.get("courses-offered")?.value || (loading ? "..." : "0")}
            iconBg="#1c398e"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            }
          />
        </div>

        {/* Bottom 3 Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-full" data-name="Container">
          <StatCard
            label="Graduating This Year"
            value={statMap.get("graduating-this-year")?.value || (loading ? "..." : "0")}
            caption={statMap.get("graduating-this-year")?.caption || `Expected in ${currentYear}`}
            captionColor="#155dfc"
            iconBg="#d08700"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            }
          />
          <StatCard
            label="Certificates Issued"
            value={statMap.get("certificates-issued")?.value || (loading ? "..." : "0")}
            caption={statMap.get("certificates-issued")?.caption || "All-time total"}
            captionColor="#6a7282"
            iconBg="#d08700"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            }
          />
          <StatCard
            label="Pending Requests"
            value={statMap.get("pending-requests")?.value || (loading ? "..." : "0")}
            caption={statMap.get("pending-requests")?.caption || "Requires attention"}
            captionColor="#e17900"
            iconBg="#e17900"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            }
          />
        </div>

        {/* Middle Section: Recent Activity & Upcoming Graduations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full" data-name="Container">
          {/* Left: Recent Activity */}
          <div className="bg-white rounded-[10px] drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] p-[24px] flex flex-col gap-[16px] min-h-[480px]">
            <div className="flex items-center gap-[8px]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a5565" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#101828] text-[18px] tracking-[-0.4395px]">
                Recent Activity
              </h3>
            </div>

            <div className="flex flex-col">
              {dashboardStats?.recentActivity && dashboardStats.recentActivity.length > 0 ? (
                dashboardStats.recentActivity.map((act) => (
                  <ActivityRow
                    key={act.id}
                    type={act.type}
                    title={act.title}
                    subject={act.subject}
                    timeAgo={act.timeAgo}
                  />
                ))
              ) : (
                <div className="py-[32px] text-center text-[#6a7282] text-[14px]">
                  No recent activity recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Right: Upcoming Graduations */}
          <div className="bg-white rounded-[10px] drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] p-[24px] flex flex-col gap-[16px] min-h-[480px]">
            <div className="flex items-center gap-[8px]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a5565" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#101828] text-[18px] tracking-[-0.4395px]">
                Upcoming Graduations
              </h3>
            </div>

            <div className="flex flex-col gap-[16px]">
              {(dashboardStats?.upcomingGraduations || []).map((item) => (
                <UpcomingGraduationCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Newly Registered Students Table */}
        <div className="bg-white rounded-[10px] drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] overflow-hidden w-full" data-name="Container">
          {/* Table Header Bar */}
          <div className="p-[24px] border-b border-[#e5e7eb] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]">
            <div className="flex flex-col">
              <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#101828] text-[18px] tracking-[-0.4395px]">
                Newly Registered Students
              </h3>
              <p className="font-['Inter:Regular',sans-serif] text-[#4a5565] text-[14px] tracking-[-0.1504px]">
                View and manage student information
              </p>
            </div>
            {/* Search Input */}
            <div className="relative w-full sm:w-[256px]">
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[42px] pl-[40px] pr-[16px] border border-[#d1d5dc] rounded-[10px] text-[14px] outline-none focus:border-[#155dfc] text-[#101828] placeholder:text-[#99a1af] transition-colors"
              />
              <div className="absolute left-[12px] top-[11px] pointer-events-none text-[#99a1af]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="9.16667" cy="9.16667" r="6.66667" stroke="#99A1AF" strokeWidth="1.66667" />
                  <path d="M17.5 17.5L13.9167 13.9167" stroke="#99A1AF" strokeWidth="1.66667" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f9fafb] border-b border-[#e5e7eb] text-[#6a7282] uppercase text-[12px] tracking-[0.6px] font-['Inter:Medium',sans-serif] font-medium">
                  <th className="py-[12px] px-[24px]">Student ID</th>
                  <th className="py-[12px] px-[24px]">Name</th>
                  <th className="py-[12px] px-[24px]">Email</th>
                  <th className="py-[12px] px-[24px]">Course</th>
                  <th className="py-[12px] px-[24px]">Year</th>
                  <th className="py-[12px] px-[24px]">CGPA</th>
                  <th className="py-[12px] px-[24px]">Status</th>
                  <th className="py-[12px] px-[24px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb] text-[14px] font-['Inter:Regular',sans-serif]">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((st) => {
                    const isGraduated = st.status?.toUpperCase() === "GRADUATED";
                    const isActive = st.status?.toUpperCase() === "ACTIVE" || !st.status;

                    return (
                      <tr
                        key={st.studentId}
                        onClick={() => handleNavigate("student-detail", st)}
                        className="hover:bg-[#f9fafb] transition-colors cursor-pointer"
                      >
                        <td className="py-[18px] px-[24px] font-['Inter:Medium',sans-serif] font-medium text-[#101828]">
                          {st.studentId}
                        </td>
                        <td className="py-[18px] px-[24px] text-[#101828]">
                          {st.fullName}
                        </td>
                        <td className="py-[18px] px-[24px] text-[#4a5565]">
                          {st.email}
                        </td>
                        <td className="py-[18px] px-[24px] text-[#4a5565] max-w-[240px] truncate">
                          {st.course}
                        </td>
                        <td className="py-[18px] px-[24px] text-[#4a5565]">
                          {st.year}
                        </td>
                        <td className="py-[18px] px-[24px] text-[#4a5565]">
                          {typeof st.cgpa === "number" ? st.cgpa.toFixed(1) : "0.0"}
                        </td>
                        <td className="py-[18px] px-[24px]">
                          <span
                            className={`inline-flex items-center px-[10px] py-[2px] rounded-full text-[12px] font-['Inter:Medium',sans-serif] font-medium ${
                              isGraduated
                                ? "bg-[#dbeafe] text-[#1d4ed8]"
                                : isActive
                                ? "bg-[#dcfce7] text-[#016630]"
                                : "bg-[#f3f4f6] text-[#4a5565]"
                            }`}
                          >
                            {st.status || "Active"}
                          </span>
                        </td>
                        <td className="py-[18px] px-[24px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigate("student-detail", st);
                            }}
                            className="inline-flex items-center gap-[6px] text-[#9810fa] hover:text-[#7e02d6] font-['Inter:Medium',sans-serif] font-medium text-[14px] transition-colors cursor-pointer"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M1.37467 8.232C1.31911 8.08232 1.31911 7.91768 1.37467 7.768C1.9158 6.4559 2.83434 5.33403 4.01385 4.5446C5.19335 3.75517 6.5807 3.33374 8 3.33374C9.4193 3.33374 10.8066 3.75517 11.9862 4.5446C13.1657 5.33403 14.0842 6.4559 14.6253 7.768C14.6809 7.91768 14.6809 8.08232 14.6253 8.232C14.0842 9.5441 13.1657 10.666 11.9862 11.4554C10.8066 12.2448 9.4193 12.6663 8 12.6663C6.5807 12.6663 5.19335 12.2448 4.01385 11.4554C2.83434 10.666 1.9158 9.5441 1.37467 8.232Z" stroke="#9810FA" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                              <circle cx="8" cy="8" r="2" stroke="#9810FA" strokeWidth="1.33333" />
                            </svg>
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-[36px] text-center text-[#6a7282]">
                      {loading ? "Loading students..." : "No students found matching your search."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
