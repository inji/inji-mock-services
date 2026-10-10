// ---------------------------------------------------------------------------
// Student Portal Service
// Encapsulates student-facing portal operations (dashboard, profile,
// certificate requests). Currently returns mock data; ready for future
// REST API integration.
// ---------------------------------------------------------------------------

import { studentNotifications, studentDashboardStats, certificates, studentAcademicPerformance } from "@/data";
import type { Student, StudentDashboardData, Certificate, AcademicPerformanceData } from "@/data/types";
import { studentService } from "./studentService";
import { activityService } from "./activityService";
import { API_BASE_URL } from "@/config/api";

// API endpoint references for future REST integration
const STUDENT_PORTAL_ENDPOINTS = {
  dashboard: `${API_BASE_URL}/student-portal/dashboard`,
  profile: `${API_BASE_URL}/student-portal/profile`,
  requestCertificate: `${API_BASE_URL}/student-portal/certificates/request`,
  certificateQR: `${API_BASE_URL}/student-portal/certificates/qr`,
} as const;

export const studentPortalService = {
  /** Fetch student dashboard data (welcome info, notifications, stats). */
  async getStudentDashboard(studentId: string): Promise<StudentDashboardData> {
    const student = await studentService.getStudentById(studentId);

    if (!student) {
      throw new Error(`Student ${studentId} not found`);
    }

    // Check if the student has graduation records
    const graduationDetails = await studentService.getGraduationDetails(studentId);
    // Assuming backend returns an array for getGraduationDetails sometimes, or an object
    const gradDetailObj = Array.isArray(graduationDetails) ? graduationDetails[0] : graduationDetails;

    const isGraduated = student.status === "Graduated";
    const hasGradDetails = gradDetailObj?.graduationMonth != null && Boolean(gradDetailObj?.classification?.trim());

    // Generate stats dynamically from the actual student record
    const stats = [
      { id: "stat-cgpa", label: "Current CGPA", value: student.cgpa.toString(), icon: "cgpa" },
      { id: "stat-credits", label: "Completed Credits", value: `${student.creditsCompleted || 0}/${student.totalCredits || 0}`, icon: "credits" },
      { id: "stat-certs", label: "Certificates", value: hasGradDetails ? "1" : "0", icon: "certificates" },
    ];

    const notifications: any[] = [];

    if (isGraduated || hasGradDetails) {
      let updatedAtStr = gradDetailObj?.updatedAt || student.updatedAt;
      let timeAgo = "just now";
      
      if (updatedAtStr) {
        if (!updatedAtStr.endsWith("Z")) {
          updatedAtStr += "Z";
        }
        const date = new Date(updatedAtStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) {
          timeAgo = "just now";
        } else if (diffInSeconds < 3600) {
          const m = Math.floor(diffInSeconds / 60);
          timeAgo = `${m} minute${m > 1 ? "s" : ""} ago`;
        } else if (diffInSeconds < 86400) {
          const h = Math.floor(diffInSeconds / 3600);
          timeAgo = `${h} hour${h > 1 ? "s" : ""} ago`;
        } else {
          const d = Math.floor(diffInSeconds / 86400);
          timeAgo = `${d} day${d > 1 ? "s" : ""} ago`;
        }
      }

      notifications.unshift({
        id: "notif-1",
        type: "success",
        message: "Your degree certificate request has been approved!",
        timeAgo: timeAgo,
      });
    }

    return {
      student,
      notifications,
      stats,
    };
  },

  /** Fetch full student profile with academic details. */
  async getStudentProfile(studentId: string): Promise<Student | undefined> {
    return studentService.getStudentById(studentId);
  },

  /** Check certificate eligibility for a student based on graduation logic. */
  async checkEligibility(studentId: string): Promise<{ eligible: boolean; message: string }> {
    const student = await studentService.getStudentById(studentId);

    if (!student) {
      return {
        eligible: false,
        message: "Student record not found.",
      };
    }

    const graduationDetails = await studentService.getGraduationDetails(studentId);
    const gradDetailObj = Array.isArray(graduationDetails) ? graduationDetails[0] : graduationDetails;

    const isGraduated = student.status?.toUpperCase() === "GRADUATED";
    const hasGradDetails =
      Boolean(student.graduationDetails?.graduationMonth != null && student.graduationDetails?.classification?.trim()) ||
      Boolean(gradDetailObj?.graduationMonth != null && gradDetailObj?.classification?.trim());

    const isEligible = isGraduated || hasGradDetails;

    return {
      eligible: isEligible,
      message: isEligible
        ? "You have completed all required credits and met all graduation requirements. You are eligible to request your degree certificate."
        : "Your graduation certificate details (graduation month and classification) have not yet been completed by the administration.",
    };
  },


  /** Submit a certificate generation request. */
  async requestCertificate(studentId: string): Promise<Certificate> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    const existing = certificates.find((c) => c.studentId === studentId);
    if (existing) return existing;

    const student = await studentService.getStudentById(studentId);

    return {
      id: `cert-${studentId}`,
      studentId,
      registrationNumber: `REG${studentId.replace("STU", "")}`,
      degreeTitle: student?.course || "Bachelor of Computer Science",
      graduationYear: student?.graduationYear || "2026",
      semesters: student?.numberOfSemesters || 8,
    };
  },

  /**
   * Request a verifiable credential using the Pre-Authorized Code flow.
   * Returns the credential_offer_uri which can be rendered as a QR code.
   */
  async requestCredential(studentId: string): Promise<{ credentialOfferUri: string } | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}/request-credential`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-API-Key": "certify-admin-key-change-me"
        },
        body: JSON.stringify({ expiresInSeconds: 600 }),
      });

      if (!response.ok) {
        console.error("Failed to request credential:", await response.text());
        return null;
      }

      const data = await response.json();
      
      // The backend returns credentialOfferUri pointing to the internal docker network (e.g. http://certify-nginx:80).
      // We must replace it with the host's IP/hostname and the exposed port 8091 so the mobile wallet can resolve it.
      let offerUri = data.credentialOfferUri;
      if (offerUri) {
        offerUri = offerUri.replace("http://certify-nginx:80", `http://${window.location.hostname}:8091`);
        // Handle URL encoded versions as well
        offerUri = offerUri.replace("http%3A%2F%2Fcertify-nginx%3A80", encodeURIComponent(`http://${window.location.hostname}:8091`));

        // Log legitimate activity
        studentService.getStudentById(studentId).then((st) => {
          activityService.logActivity({
            type: "certificate-requested",
            title: "Certificate request received",
            subject: st?.fullName || studentId,
            timestamp: new Date().toISOString(),
          });
        }).catch(() => {
          activityService.logActivity({
            type: "certificate-requested",
            title: "Certificate request received",
            subject: studentId,
            timestamp: new Date().toISOString(),
          });
        });
      }
      
      return { credentialOfferUri: offerUri };
    } catch (error) {
      console.error("Error requesting credential:", error);
      return null;
    }
  },

  /** Get a mock QR code data URL for the student's certificate. */
  async getCertificateQRCode(studentId: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    // API endpoint reference: fetch(`${STUDENT_PORTAL_ENDPOINTS.certificateQR}/${studentId}`)

    // In production, this would return a real QR code image URL from the backend.
    // For mock purposes, we return a placeholder identifier.
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CERT-${studentId}-VERIFIED`;
  },

  /** Get academic performance data (semesters and grades). */
  async getAcademicPerformance(studentId: string): Promise<AcademicPerformanceData | null> {
    const student = await studentService.getStudentById(studentId);

    if (!student) {
      return null;
    }

    // Patch the mock academic performance with the real overall CGPA and credits from the backend
    return {
      ...studentAcademicPerformance,
      overallCgpa: student.cgpa,
      totalCredits: student.totalCredits || 0,
      creditsCompleted: student.creditsCompleted || 0,
    };
  },
};
