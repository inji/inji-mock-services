import { useState, useEffect } from "react";
import { instituteService } from "@/services/instituteService";
import { studentPortalService } from "@/services/studentPortalService";
import { authService } from "@/services/authService";
import type { Institute, StudentDashboardData } from "@/data/types";
import imgLogo from "@/imports/EducationalInstitutePortal-1/73da5574736f6a1e3d533885140e2c14827bbc1f.png";
import { Navbar } from "@/app/components/reusable/Navbar";
import { StatsCard } from "@/app/components/reusable/StatsCard";

// ---------------------------------------------------------------------------
// Student Dashboard Page
// Shows welcome banner, quick-action cards, notifications, and stat tiles.
// All data loaded through studentPortalService for backend-readiness.
// ---------------------------------------------------------------------------

// --- Welcome Banner ---

function WelcomeBanner({ name, studentId }: { name: string; studentId: string }) {
  return (
    <div className="bg-[#425586] rounded-[12px] px-[32px] py-[24px] flex items-center justify-between">
      <div>
        <h1 className="font-['Inter:Bold',sans-serif] font-bold text-[28px] text-white leading-[36px]">
          Welcome back, {name}!
        </h1>
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-[#a9b5d2] leading-[24px] mt-[4px]">
          Student ID: {studentId}
        </p>
      </div>
      <div className="flex items-center justify-center">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="27" fill="#b48600" stroke="#b48600" strokeWidth="2" />
          <path
            d="M28 28C31.3137 28 34 25.3137 34 22C34 18.6863 31.3137 16 28 16C24.6863 16 22 18.6863 22 22C22 25.3137 24.6863 28 28 28Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 40C18 35.5817 22.4772 32 28 32C33.5228 32 38 35.5817 38 40"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

// --- Action Cards ---

function ActionCard({
  icon,
  title,
  subtitle,
  boldWord,
  iconBg,
  cardBg,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  boldWord?: string;
  iconBg: string;
  cardBg?: string;
}) {
  return (
    <div className={`${cardBg || "bg-white"} rounded-[12px] border border-[#e5e7eb] p-[20px] flex items-center gap-[16px] cursor-pointer hover:shadow-md transition-shadow`} data-name="Button">
      <div
        className="flex items-center justify-center rounded-[10px] size-[48px] shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>
      <div>
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] text-[#101828] leading-[24px]">
          {title}
        </p>
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#4a5565] leading-[20px] tracking-[-0.1504px]">
          {boldWord ? (
            <>
              <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold">{boldWord}</span>{" "}
              {subtitle.replace(boldWord, "").trim()}
            </>
          ) : (
            subtitle
          )}
        </p>
      </div>
    </div>
  );
}

function CertificateIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M22 10V15C22 15 22 15 22 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 13.2V17.5C6 19 9 20 12 20C15 20 18 19 18 17.5V13.2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 13L2 8L12 3L22 8L12 13Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function GradesIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M2 3H12V21H2V3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 3H22V21H12V3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ActionCards() {
  return (
    <div className="grid grid-cols-3 gap-[16px]">
      <ActionCard
        icon={<CertificateIcon />}
        title="Get My Certificate"
        subtitle="View and Download degree certificate."
        boldWord="View and Download"
        iconBg="#b48600"
        cardBg="bg-[#fdf3e1]"
      />
      <ActionCard
        icon={<GradesIcon />}
        title="View Grades"
        subtitle="Check your academic records"
        boldWord="Check"
        iconBg="#3d5092"
      />
      <ActionCard
        icon={<ProfileIcon />}
        title="My Profile"
        subtitle="View your personal details."
        boldWord="View"
        iconBg="#1d3557"
      />
    </div>
  );
}

// --- Notifications ---

function NotificationItem({
  message,
  timeAgo,
  type,
}: {
  message: string;
  timeAgo: string;
  type: "success" | "info";
}) {
  const bgColor = type === "success" ? "bg-[#eaffed]" : "bg-[#eff4ff]";
  const borderColor = type === "success" ? "border-[#bbf7d0]" : "border-[#3b82f6]";
  const textColor = type === "success" ? "text-[#166534]" : "text-[#1e40af]";

  return (
    <div className={`${bgColor} ${borderColor} border rounded-[8px] px-[20px] py-[14px]`}>
      <p className={`font-['Inter:Medium',sans-serif] font-medium text-[14px] ${textColor} leading-[20px]`}>
        {message}
      </p>
      <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-[#6b7280] leading-[18px] mt-[4px]">
        {timeAgo}
      </p>
    </div>
  );
}

function NotificationsSection({ notifications }: { notifications: { id: string; message: string; timeAgo: string; type: "success" | "info" }[] }) {
  return (
    <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-[24px]">
      <div className="flex items-center gap-[8px] mb-[16px]">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M15 6.66667C15 5.34058 14.4732 4.06881 13.5355 3.13113C12.5979 2.19345 11.3261 1.66667 10 1.66667C8.67392 1.66667 7.40215 2.19345 6.46447 3.13113C5.52678 4.06881 5 5.34058 5 6.66667C5 12.5 2.5 14.1667 2.5 14.1667H17.5C17.5 14.1667 15 12.5 15 6.66667Z" stroke="#101828" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11.4417 17.5C11.2952 17.7526 11.0849 17.9622 10.8319 18.1079C10.5789 18.2537 10.292 18.3304 10 18.3304C9.70802 18.3304 9.42113 18.2537 9.16815 18.1079C8.91516 17.9622 8.70484 17.7526 8.55835 17.5" stroke="#101828" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] text-[#101828] leading-[24px]">
          Recent Notifications
        </h2>
      </div>
      <div className="flex flex-col gap-[12px]">
        {notifications.map((n) => (
          <NotificationItem key={n.id} message={n.message} timeAgo={n.timeAgo} type={n.type} />
        ))}
      </div>
    </div>
  );
}

// --- Stat Cards ---

function StatIconCGPA() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.5 12.5L7 21L12 18L17 21L15.5 12.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function StatIconCredits() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M2 3H12V21H2V3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 3H22V21H12V3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function StatIconCertificates() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 13H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 9H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatCards({ stats }: { stats: { id: string; label: string; value: string; icon: string }[] }) {
  const iconMap: Record<string, React.ReactNode> = {
    cgpa: <StatIconCGPA />,
    credits: <StatIconCredits />,
    certificates: <StatIconCertificates />,
  };

  const bgMap: Record<string, string> = {
    cgpa: "bg-[#3d5092]",
    credits: "bg-[#3d5092]",
    certificates: "bg-[#b48600]",
  };

  const titleMap: Record<string, string> = {
    cgpa: "Current CGPA",
    credits: "Completed Credits",
    certificates: "Certificates",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
      {stats.map((s) => (
        <StatsCard
          key={s.id}
          stat={{ id: s.id, label: titleMap[s.id] || s.label, value: s.value, caption: "" }}
          icon={iconMap[s.icon] || <StatIconCGPA />}
          iconBgColor={bgMap[s.icon] || "bg-[#3d5092]"}
        />
      ))}
    </div>
  );
}

// --- Main Page ---

export default function StudentDashboardPage() {
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);

  useEffect(() => {
    instituteService.getInstitute().then(setInstitute);
    
    const loggedInId = authService.getLoggedInStudentId();
    if (!loggedInId) {
      window.dispatchEvent(new CustomEvent("navigate", { detail: "student-login" }));
      return;
    }
    
    studentPortalService.getStudentDashboard(loggedInId).then(setDashboardData);
  }, []);

  const student = dashboardData?.student;

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

      <div className="w-full flex-1 px-[64px] py-[32px] flex flex-col gap-[24px]">
        {/* Welcome Banner */}
        <WelcomeBanner
          name={student?.fullName || "Student"}
          studentId={student?.studentId || ""}
        />

        {/* Action Cards */}
        <ActionCards />

        {/* Notifications */}
        {dashboardData && (
          <NotificationsSection notifications={dashboardData.notifications} />
        )}

        {/* Stats */}
        {dashboardData && <StatCards stats={dashboardData.stats} />}
      </div>
    </div>
  );
}
