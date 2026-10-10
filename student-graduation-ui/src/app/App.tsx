import { useState, useRef, useEffect, useCallback } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { studentService, authService } from "@/services";

import LandingPage from "./components/pages/LandingPage";
import AdminLoginPage from "./components/pages/AdminLoginPage";
import DashboardPage from "./components/pages/DashboardPage";
import AddStudentPage from "./components/pages/AddStudentPage";
import StudentRegisteredPage from "./components/pages/StudentRegisteredPage";
import StudentDetailPage from "./components/pages/StudentDetailPage";
import CertificateFormPage from "./components/pages/CertificateFormPage";
import CertificateAddedPage from "./components/pages/CertificateAddedPage";
import StudentRegistryPage from "./components/pages/StudentRegistryPage";
import StudentLoginPage from "./components/pages/StudentLoginPage";
import StudentDashboardPage from "./components/pages/StudentDashboardPage";
import StudentCertificateRequestPage from "./components/pages/StudentCertificateRequestPage";
import StudentCertificateGeneratedPage from "./components/pages/StudentCertificateGeneratedPage";
import StudentProfilePage from "./components/pages/StudentProfilePage";
import StudentGradesPage from "./components/pages/StudentGradesPage";
import GraduationDetailsPage from "./components/pages/GraduationDetailsPage";
import EditStudentPage from "./components/pages/EditStudentPage";

type Screen =
  | "landing"
  | "admin-login"
  | "dashboard"
  | "add-student"
  | "edit-student"
  | "student-registered"
  | "student-detail"
  | "certificate-form"
  | "certificate-added"
  | "student-registry"
  | "student-login"
  | "student-dashboard"
  | "student-certificate-request"
  | "student-certificate-generated"
  | "student-profile"
  | "student-grades"
  | "graduation-details";

// ---------------------------------------------------------------------------
// Responsive scaling shell
// Figma exports use absolute px values. We measure the outer viewport width
// and apply a proportional CSS transform so the design fills the screen at
// every viewport / zoom level without any horizontal scroll.
// ---------------------------------------------------------------------------

interface ScaledScreenProps {
  /** Natural design width exported from Figma (px) */
  designWidth: number;
  children: React.ReactNode;
}

function ScaledScreen({ designWidth, children }: ScaledScreenProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState<number>(0);

  const recalculate = useCallback(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const vw = wrapper.offsetWidth;
    const newScale = vw >= designWidth ? 1 : vw / designWidth;
    const contentH = content.scrollHeight;

    setScale(newScale);
    setContentHeight(contentH);
  }, [designWidth]);

  useEffect(() => {
    // Slight defer so the DOM can paint before measuring
    const id = requestAnimationFrame(recalculate);
    return () => cancelAnimationFrame(id);
  }, [recalculate]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;
    
    const obs = new ResizeObserver(() => {
      requestAnimationFrame(recalculate);
    });
    obs.observe(wrapper);
    obs.observe(content);

    // Also observe DOM mutations inside content because content might fetch data
    // and expand without triggering a resize if it's within a min-h-screen container
    const mutObs = new MutationObserver(() => {
      requestAnimationFrame(recalculate);
    });
    mutObs.observe(content, { childList: true, subtree: true, characterData: true });

    return () => {
      obs.disconnect();
      mutObs.disconnect();
    };
  }, [recalculate]);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        maxWidth: "1440px",
        margin: "0 auto",
        overflow: "hidden",
        // Reserve vertical space equal to the scaled content height so the
        // page scrollbar reflects the true content length.
        height: contentHeight > 0 ? `${contentHeight * scale}px` : "100vh",
        position: "relative",
      }}
    >
      <div
        ref={contentRef}
        style={{
          width: `${designWidth}px`,
          margin: "0 auto",
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          // Negative margin-bottom cancels the phantom space that transform:scale
          // leaves behind (the DOM box is still full-size but rendered smaller).
          marginBottom: `${-contentHeight * (1 - scale)}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Navigation helpers
// ---------------------------------------------------------------------------

function getClickedButtonText(e: React.MouseEvent): string {
  let el = e.target as HTMLElement | null;
  let depth = 0;
  while (el && el !== (e.currentTarget as HTMLElement) && depth < 10) {
    if (el.getAttribute("data-name") === "Button") {
      return el.textContent?.trim() ?? "";
    }
    el = el.parentElement;
    depth++;
  }
  return "";
}

function isStudentRowClick(e: React.MouseEvent): boolean {
  let el = e.target as HTMLElement | null;
  let depth = 0;
  while (el && el !== (e.currentTarget as HTMLElement) && depth < 10) {
    const dn = (el.getAttribute("data-name") ?? "").toLowerCase();
    if (dn.includes("row") || dn.includes("student")) return true;
    el = el.parentElement;
    depth++;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Design widths per screen (px — matches the Figma artboard width)
// ---------------------------------------------------------------------------

const DESIGN_WIDTHS: Record<Screen, number> = {
  "landing": 1360,
  "admin-login": 1344,
  "dashboard": 1344,
  "add-student": 1344,
  "edit-student": 1344,
  "student-registered": 1344,
  "student-detail": 1344,
  "certificate-form": 1344,
  "certificate-added": 1344,
  "student-registry": 1344,
  "student-login": 1344,
  "student-dashboard": 1344,
  "student-certificate-request": 1344,
  "student-certificate-generated": 1344,
  "student-profile": 1344,
  "student-grades": 1344,
  "graduation-details": 1344,
};

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");

  const go = useCallback((target: Screen) => {
    if (target === "add-student") {
      studentService.setStudentToEdit(null);
    }
    if (target === "landing" || target === "admin-login" || target === "student-login") {
      studentService.setStudentToEdit(null);
      authService.setLoggedInStudentId(null);
    }
    setScreen(target);
  }, []);

  useEffect(() => {
    const handleNav = (e: any) => {
      if (e.detail === "logout") {
        studentService.setStudentToEdit(null);
        authService.setLoggedInStudentId(null);
        go("landing");
        return;
      }
      if (e.detail === "add-student") {
        studentService.setStudentToEdit(null);
      }
      if (e.detail) go(e.detail);
    };
    window.addEventListener("navigate", handleNav);
    return () => window.removeEventListener("navigate", handleNav);
  }, [go]);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target?.closest("button:disabled, button[disabled]")) {
      return;
    }
    const btn = getClickedButtonText(e);

    switch (screen) {
      case "landing":
        if (btn.includes("Admin")) go("admin-login");
        else if (btn.includes("Student")) go("student-login");
        break;

      case "admin-login":
        if (btn.includes("Back")) go("landing");
        break;

      case "dashboard":
        if (btn.includes("Add New Student") || btn.includes("Register a new")) {
          studentService.setStudentToEdit(null);
          go("add-student");
        }
        else if (btn.includes("Student Registry") || btn.includes("View and edit")) go("student-registry");
        else if (btn.includes("Logout")) {
          studentService.setStudentToEdit(null);
          authService.setLoggedInStudentId(null);
          go("landing");
        }
        else if (btn.includes("View") || isStudentRowClick(e)) {
          go("student-detail");
        }
        break;

      case "add-student":
      case "edit-student":
        if (btn.includes("Cancel")) {
          studentService.setStudentToEdit(null);
          go("dashboard");
        }
        else if (btn.includes("Back to Dashboard")) {
          studentService.setStudentToEdit(null);
          go("dashboard");
        }
        else if (btn.includes("Graduation Details")) go("graduation-details");
        break;

      case "student-registered":
        if (btn.includes("Back to Dashboard")) go("dashboard");
        else if (btn.includes("Add Another Student")) go("add-student");
        break;

      case "student-detail":
        if (btn.includes("Back to Dashboard") || (btn.includes("Back") && !btn.includes("Registry"))) go("dashboard");
        else if (btn.includes("Certificate") || btn.includes("Add")) go("certificate-form");
        break;

      case "certificate-form":
        if (btn.includes("Back to Dashboard")) go("dashboard");
        else if (btn.includes("Back")) go("student-detail");
        else if (btn.includes("Save") || btn.includes("Submit") || btn.includes("Issue") || btn.includes("Add Certificate")) {
          go("certificate-added");
        }
        break;

      case "certificate-added":
        if (btn.includes("Back to Student Registry") || btn.includes("Student Registry")) go("student-registry");
        else if (btn.includes("Dashboard")) go("dashboard");
        break;

      case "student-registry":
        if (btn.includes("Add New Student")) go("add-student");
        else if (btn.includes("Dashboard")) go("dashboard");
        else if (btn.includes("Logout")) go("landing");
        else if (btn.includes("Back")) go("dashboard");
        else if (btn.includes("View") || btn.includes("Details") || isStudentRowClick(e)) go("student-detail");
        break;

      // --- Student Portal Screens ---

      case "student-login":
        if (btn.includes("Back")) go("landing");
        break;

      case "student-dashboard":
        if (btn.includes("Get My Certificate") || btn.includes("View and Download")) go("student-certificate-request");
        else if (btn.includes("My Profile") || btn.includes("View your personal information")) go("student-profile");
        else if (btn.includes("View Grades") || btn.includes("Academic Performance")) go("student-grades");
        else if (btn.includes("Logout")) go("landing");
        break;

      case "student-profile":
      case "student-grades":
        if (btn.includes("Back to Dashboard") || btn.includes("Dashboard")) go("student-dashboard");
        break;

      case "student-certificate-request":
        if (btn.includes("Generate Certificate") || btn.includes("Generating")) go("student-certificate-generated");
        else if (btn.includes("Cancel") || btn.includes("Back to Dashboard")) go("student-dashboard");
        break;

      case "student-certificate-generated":
        if (btn.includes("Back to Dashboard") || btn.includes("Dashboard")) go("student-dashboard");
        break;
    }
  };

  const designWidth = DESIGN_WIDTHS[screen];

  const renderScreen = () => {
    switch (screen) {
      case "landing":                      return <LandingPage />;
      case "admin-login":                  return <AdminLoginPage />;
      case "dashboard":                    return <DashboardPage />;
      case "add-student":                  return <AddStudentPage />;
      case "edit-student":                 return <EditStudentPage />;
      case "student-registered":           return <StudentRegisteredPage />;
      case "student-detail":               return <StudentDetailPage />;
      case "certificate-form":             return <CertificateFormPage />;
      case "certificate-added":            return <CertificateAddedPage />;
      case "student-registry":             return <StudentRegistryPage />;
      case "student-login":                return <StudentLoginPage />;
      case "student-dashboard":            return <StudentDashboardPage />;
      case "student-certificate-request":  return <StudentCertificateRequestPage />;
      case "student-certificate-generated":return <StudentCertificateGeneratedPage />;
      case "student-profile":              return <StudentProfilePage />;
      case "student-grades":               return <StudentGradesPage />;
      case "graduation-details":           return <GraduationDetailsPage />;
    }
  };

  return (
    <AuthProvider>
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          backgroundColor: screen === "admin-login" ? "#3d5c9d" : screen === "student-login" ? "#c5a55a" : (screen === "student-profile" || screen === "student-grades" || screen === "student-dashboard" || screen === "student-certificate-request" || screen === "student-certificate-generated") ? "#e5e7eb" : "#f9fafb",
          overflowX: "hidden",
        }}
        onClick={handleClick}
      >
        <ScaledScreen key={screen} designWidth={designWidth}>
          {renderScreen()}
        </ScaledScreen>
      </div>
    </AuthProvider>
  );
}
