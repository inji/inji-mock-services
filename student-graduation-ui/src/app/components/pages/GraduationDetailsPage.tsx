import { useState, useEffect } from "react";
import { instituteService } from "@/services/instituteService";
import { studentService } from "@/services/studentService";
import type { Institute, Student } from "@/data/types";

function Header({ institute }: { institute: Institute | null }) {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[81px] justify-center px-[64px] top-0 w-[1344px] border-b border-[#e5e7eb]">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-[12px]">
          <div>
            <h1 className="text-[24px] font-bold">{institute?.name || "University of Utopia"}</h1>
            <p className="text-[16px] text-[#1c398e] tracking-[1px]">{institute?.portalLabel || "Admin Portal"}</p>
          </div>
        </div>
        <button
          className="bg-[rgba(64,123,255,0.7)] px-[16px] py-[8px] rounded-[10px] flex items-center gap-[8px]"
          data-name="Button"
        >
          <span className="text-[#364153] font-medium text-[16px]">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function GraduationDetailsPage() {
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    instituteService.getInstitute().then(setInstitute);
    const studentToEdit = studentService.getStudentToEdit();
    if (studentToEdit) {
      setStudent(studentToEdit);
    } else {
      window.dispatchEvent(new CustomEvent("navigate", { detail: "student-registry" }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      // Compute classification from CGPA
      const computedClassification = student.cgpa >= 8 ? "First Class with Distinction" : student.cgpa >= 6 ? "First Class" : "Second Class";

      const details = {
        registrationNumber: student.studentId, // Using STU-xxx as reg number
        degreeTitle: student.course || "Degree",
        graduationMonth: month,
        graduationYear: year,
        classification: computedClassification,
      };

      await studentService.addGraduationDetails(student.id, details);
      
      setFeedback({ type: "success", message: "Graduation details saved successfully!" });
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("navigate", { detail: "student-registry" }));
      }, 1500);
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Failed to save graduation details" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!student) return null;

  return (
    <div className="bg-[#f9fafb] relative size-full min-h-[1000px]" data-name="Graduation Details Portal">
      <Header institute={institute} />

      <div className="absolute left-[32px] top-[81px] pt-[32px] w-[1280px] flex flex-col gap-[24px]">
        <div className="flex items-center gap-[12px]">
          <button 
            type="button"
            className="p-[8px] hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center text-[#4a5565]"
            onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "edit-student" }))}
            title="Back to Edit Student"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15.8333 10H4.16667" />
              <path d="M8.33333 14.1667L4.16667 10L8.33333 5.83333" />
            </svg>
          </button>
          <div>
            <h2 className="text-[24px] font-semibold text-[#101828]">Graduation Details</h2>
            <p className="text-[16px] text-[#4a5565]">Submit graduation records for {student.fullName}</p>
          </div>
        </div>

        {feedback && (
          <div className={`p-[16px] rounded-[10px] text-[14px] font-medium ${feedback.type === "success" ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"}`}>
            {feedback.message}
          </div>
        )}

        <div className="bg-white rounded-[20px] shadow-sm border border-[#e5e7eb] p-[32px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
            
            <div className="grid grid-cols-2 gap-[24px]">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[14px] font-medium text-[#364153]">Student ID</label>
                <input
                  type="text"
                  value={student.studentId}
                  disabled
                  className="px-[12px] py-[10px] border border-[#d1d5dc] rounded-[10px] text-[16px] bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[14px] font-medium text-[#364153]">Student Name</label>
                <input
                  type="text"
                  value={student.fullName}
                  disabled
                  className="px-[12px] py-[10px] border border-[#d1d5dc] rounded-[10px] text-[16px] bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[14px] font-medium text-[#364153]">Degree Title (Auto-fetched)</label>
                <input
                  type="text"
                  value={student.course}
                  disabled
                  className="px-[12px] py-[10px] border border-[#d1d5dc] rounded-[10px] text-[16px] bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[14px] font-medium text-[#364153]">Academic Year (Auto-fetched)</label>
                <input
                  type="text"
                  value={student.year}
                  disabled
                  className="px-[12px] py-[10px] border border-[#d1d5dc] rounded-[10px] text-[16px] bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[14px] font-medium text-[#364153]">Classification (Auto-fetched)</label>
                <input
                  type="text"
                  value={`${student.cgpa >= 8 ? "First Class with Distinction" : student.cgpa >= 6 ? "First Class" : "Second Class"} (CGPA: ${student.cgpa})`}
                  disabled
                  className="px-[12px] py-[10px] border border-[#d1d5dc] rounded-[10px] text-[16px] bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[14px] font-medium text-[#364153]">Graduation Month (1-12) *</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value) || 1)}
                  className="px-[12px] py-[10px] border border-[#d1d5dc] rounded-[10px] text-[16px]"
                  required
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[14px] font-medium text-[#364153]">Graduation Year *</label>
                <input
                  type="number"
                  min="1900"
                  max="2100"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value) || 2024)}
                  className="px-[12px] py-[10px] border border-[#d1d5dc] rounded-[10px] text-[16px]"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-[16px] border-t border-[#e5e7eb]">
              <button
                type="button"
                className="px-[20px] py-[10px] border border-[#d1d5dc] rounded-[10px] text-[16px] font-medium text-[#4a5565]"
                data-name="Button"
                onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "edit-student" }))}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-[24px] py-[12px] bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-[10px] text-[16px] font-medium transition-colors"
                data-name="Button"
              >
                {isSubmitting ? "Saving..." : "Submit Graduation Record"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
