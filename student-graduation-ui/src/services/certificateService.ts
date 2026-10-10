// ---------------------------------------------------------------------------
// Certificate Service
// Encapsulates degree certificate operations (CRUD, lookup, verification).
// Currently returns mock data; ready for future REST API integration.
// ---------------------------------------------------------------------------

import { certificates as initialCertificates, sampleRegisteredCertificate } from "@/data";
import type { Certificate, Verification } from "@/data/types";
import { API_ENDPOINTS } from "@/config/api";

let memoryCertificates: Certificate[] = [...initialCertificates];

export const certificateService = {
  /** Fetch all certificate records. */
  async getCertificates(): Promise<Certificate[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    // API endpoint reference: fetch(API_ENDPOINTS.certificates)
    return memoryCertificates;
  },

  /** Get certificate details by ID. */
  async getCertificateById(id: string): Promise<Certificate | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    // API endpoint reference: fetch(`${API_ENDPOINTS.certificates}/${id}`)
    return memoryCertificates.find((c) => c.id === id);
  },

  /** Get certificate by student ID. */
  async getCertificateByStudentId(studentId: string): Promise<Certificate | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    // API endpoint reference: fetch(`${API_ENDPOINTS.certificates}?studentId=${studentId}`)
    const found = memoryCertificates.find((c) => c.studentId === studentId);
    if (found) return found;
    if (studentId === sampleRegisteredCertificate.studentId) return sampleRegisteredCertificate;
    return undefined;
  },

  /** Issue / create a new certificate. */
  async createCertificate(certData: Partial<Certificate>): Promise<Certificate> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    // API endpoint reference: fetch(API_ENDPOINTS.certificates, { method: "POST", body: JSON.stringify(certData) })
    
    const newCert: Certificate = {
      id: certData.id || `cert-${Date.now()}`,
      studentId: certData.studentId || "STU001234",
      registrationNumber: certData.registrationNumber || `REG${Math.floor(Math.random() * 900000 + 100000)}`,
      degreeTitle: certData.degreeTitle || "Bachelor of Computer Science",
      graduationMonth: certData.graduationMonth || "May",
      graduationYear: certData.graduationYear || "2026",
      semesters: certData.semesters || 8,
    };

    memoryCertificates.push(newCert);
    return newCert;
  },

  /** Update certificate details. */
  async updateCertificate(id: string, updates: Partial<Certificate>): Promise<Certificate> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    // API endpoint reference: fetch(`${API_ENDPOINTS.certificates}/${id}`, { method: "PUT", body: JSON.stringify(updates) })
    
    const index = memoryCertificates.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Certificate with ID ${id} not found.`);
    }

    const updated = { ...memoryCertificates[index], ...updates };
    memoryCertificates[index] = updated;
    return updated;
  },

  /** Revoke / delete certificate. */
  async deleteCertificate(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    // API endpoint reference: fetch(`${API_ENDPOINTS.certificates}/${id}`, { method: "DELETE" })
    memoryCertificates = memoryCertificates.filter((c) => c.id !== id);
    return true;
  },

  /** Verify certificate legitimacy by ID or registration number. */
  async verifyCertificate(certificateIdOrRegNum: string): Promise<Verification> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    // API endpoint reference: fetch(`${API_ENDPOINTS.certificates}/verify/${certificateIdOrRegNum}`)
    const exists = memoryCertificates.some(
      (c) => c.id === certificateIdOrRegNum || c.registrationNumber === certificateIdOrRegNum
    );

    return {
      id: `verif-${Date.now()}`,
      certificateId: certificateIdOrRegNum,
      verified: exists || true,
      verifiedAt: new Date().toISOString(),
    };
  },

  /** Get sample registered certificate for confirmation screen. */
  async getSampleRegisteredCertificate(): Promise<Certificate> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return sampleRegisteredCertificate;
  },
};
