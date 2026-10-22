import type { Certificate } from "./types";

// Degree certificate records associated with students.
export const certificates: Certificate[] = [
  {
    id: "cert-STU001234",
    studentId: "STU001234",
    registrationNumber: "REG001234",
    degreeTitle: "Bachelor of Computer Science",
    graduationYear: "2026",
  },
];

/** Certificate details shown on the "Student Registered" confirmation screen. */
export const sampleRegisteredCertificate: Certificate = {
  id: "cert-STUD12345678",
  studentId: "STUD12345678",
  registrationNumber: "REG23456i",
  degreeTitle: "Bachelor of computer science",
  graduationMonth: "January",
  graduationYear: "2026",
};

export const getCertificateByStudentId = (
  studentId: string,
): Certificate | undefined =>
  certificates.find((c) => c.studentId === studentId);
