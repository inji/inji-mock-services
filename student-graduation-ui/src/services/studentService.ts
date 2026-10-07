// ---------------------------------------------------------------------------
// Student Service
// Encapsulates student registry operations (CRUD, filter, lookup).
// Connected to the inji-usecase Spring Boot backend at /api/students.
// ---------------------------------------------------------------------------

import { courseOptions, academicYearOptions, newStudentDefaults } from "@/data";
import type { Student } from "@/data/types";
import { API_ENDPOINTS, DEFAULT_HEADERS } from "@/config/api";

// ---------------------------------------------------------------------------
// Field-mapping helpers: Backend StudentDto ↔ Frontend Student
// ---------------------------------------------------------------------------

interface BackendGraduationDto {
  id?: string;
  studentId?: string;
  registrationNumber?: string;
  degreeTitle?: string;
  graduationMonth?: number;
  graduationYear?: number;
  classification?: string;
  certificateStatus?: string;
  updatedAt?: string;
}

interface BackendStudentDto {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  courseProgram: string;
  academicYear: string;
  cgpa: number | null;
  status: string | null;
  dateOfBirth: string | null;
  address: string | null;
  enrollmentDate: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
  registrationNumber?: string | null;
  graduationDetails?: BackendGraduationDto | null;
  createdAt: string | null;
  updatedAt: string | null;
}

function mapBackendToFrontend(dto: BackendStudentDto): Student {
  const isGraduating = Boolean(dto.academicYear && dto.academicYear.toLowerCase().includes("final"));

  const regNo = dto.graduationDetails?.registrationNumber || dto.registrationNumber || undefined;

  return {
    id: dto.studentId,
    studentId: dto.studentId,
    fullName: dto.fullName,
    email: dto.email,
    phone: dto.phoneNumber || "",
    course: dto.courseProgram || "",
    year: (dto.academicYear || "First Year") as any,
    cgpa: dto.cgpa != null ? Number(dto.cgpa) : 0,
    status: (dto.status as any) || "Active",
    graduating: isGraduating,
    dateOfBirth: dto.dateOfBirth || undefined,
    address: dto.address || undefined,
    enrollmentDate: dto.enrollmentDate || undefined,
    guardian: dto.guardianName
      ? { name: dto.guardianName, phone: dto.guardianPhone || "" }
      : undefined,
    graduationDetails: dto.graduationDetails || undefined,
    registrationNumber: regNo,
    graduationYear: dto.graduationDetails?.graduationYear ? String(dto.graduationDetails.graduationYear) : undefined,
    updatedAt: dto.updatedAt || undefined,
  };
}

function mapFrontendToBackend(student: Partial<Student>): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    studentId: student.studentId,
    fullName: student.fullName,
    email: student.email,
    phoneNumber: student.phone || "",
    courseProgram: student.course || "",
    academicYear: student.year || "2024-2028",
    cgpa: student.cgpa ?? 0,
    status: student.status || "Active",
    dateOfBirth: student.dateOfBirth || "2000-01-01",
    address: student.address || "N/A",
    enrollmentDate: student.enrollmentDate || new Date().toISOString().split("T")[0],
    guardianName: student.guardian?.name || "N/A",
    guardianPhone: student.guardian?.phone || "N/A",
  };
  if (student.graduationDetails) {
    payload.graduationDetails = student.graduationDetails;
  }
  if (student.registrationNumber) {
    payload.registrationNumber = student.registrationNumber;
  }
  return payload;
}


// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const studentService = {
  /** Fetch full student registry from the backend, with optional client-side filtering. */
  async getStudents(query?: { search?: string; course?: string; year?: string }): Promise<Student[]> {
    try {
      const response = await fetch(API_ENDPOINTS.students, {
        headers: DEFAULT_HEADERS,
      });

      if (!response.ok) {
        console.error("Failed to fetch students:", response.status);
        return [];
      }

      const backendStudents: BackendStudentDto[] = await response.json();
      let result = backendStudents.map(mapBackendToFrontend);

      // Client-side filtering (backend GET /api/students doesn't support query params)
      if (query?.search) {
        const s = query.search.toLowerCase();
        result = result.filter(
          (st) =>
            st.fullName.toLowerCase().includes(s) ||
            st.studentId.toLowerCase().includes(s) ||
            st.email.toLowerCase().includes(s)
        );
      }
      if (query?.course && query.course !== "All Courses") {
        result = result.filter((st) => st.course === query.course);
      }
      if (query?.year && query.year !== "All Academic Years") {
        result = result.filter((st) => st.year === query.year);
      }

      return result;
    } catch (error) {
      console.error("Error fetching students:", error);
      return [];
    }
  },

  /** Get a single student record by student ID from the backend. */
  async getStudentById(id: string): Promise<Student | undefined> {
    try {
      const response = await fetch(`${API_ENDPOINTS.students}/${id}`, {
        headers: DEFAULT_HEADERS,
      });

      if (!response.ok) {
        console.warn("Student not found:", id);
        return undefined;
      }

      const dto: BackendStudentDto = await response.json();
      return mapBackendToFrontend(dto);
    } catch (error) {
      console.error("Error fetching student:", error);
      return undefined;
    }
  },

  /** Create/register a new student via the backend. */
  async createStudent(studentData: Partial<Student>): Promise<Student> {
    const backendPayload = mapFrontendToBackend(studentData);

    const response = await fetch(API_ENDPOINTS.students, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(backendPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create student: ${errorText}`);
    }

    const created: BackendStudentDto = await response.json();
    const student = mapBackendToFrontend(created);
    studentService._lastCreatedStudent = student;
    return student;
  },

  _lastCreatedStudent: null as Student | null,
  _studentToEdit: null as Student | null,

  getLastCreatedStudent(): Student | null {
    return studentService._lastCreatedStudent;
  },
  
  setStudentToEdit(student: Student | null) {
    studentService._studentToEdit = student;
  },

  getStudentToEdit(): Student | null {
    return studentService._studentToEdit;
  },

  /** Update student record by student ID via the backend. */
  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    // First fetch existing record to merge with updates
    const existing = await studentService.getStudentById(id);
    const merged = { ...existing, ...updates };
    const backendPayload = mapFrontendToBackend(merged);

    const response = await fetch(`${API_ENDPOINTS.students}/${id}`, {
      method: "PUT",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(backendPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update student: ${errorText}`);
    }

    const updated: BackendStudentDto = await response.json();
    return mapBackendToFrontend(updated);
  },

  /** Delete a student record by student ID via the backend. */
  async deleteStudent(id: string): Promise<boolean> {
    const response = await fetch(`${API_ENDPOINTS.students}/${id}`, {
      method: "DELETE",
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      console.error("Failed to delete student:", id);
      return false;
    }
    return true;
  },

  /** Get available course options for dropdowns (static — not from backend). */
  async getCourseOptions(): Promise<string[]> {
    return courseOptions;
  },

  /** Get academic year options for dropdowns (static — not from backend). */
  async getAcademicYearOptions(): Promise<string[]> {
    return academicYearOptions;
  },

  /** Get form default initializers. */
  async getNewStudentDefaults() {
    return newStudentDefaults;
  },

  /** Submit graduation details for a student. */
  async addGraduationDetails(studentId: string, details: any): Promise<any> {
    const response = await fetch(`${API_ENDPOINTS.students}/${studentId}/graduation`, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(details),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add graduation details: ${errorText}`);
    }

    return response.json();
  },

  /** Get graduation details for a student. */
  async getGraduationDetails(studentId: string): Promise<any> {
    try {
      const response = await fetch(`${API_ENDPOINTS.students}/${studentId}/graduation`, {
        headers: DEFAULT_HEADERS,
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch {
      return null;
    }
  },
};
