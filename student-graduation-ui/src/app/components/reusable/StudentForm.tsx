import React, { useState } from "react";
import type { Student, AcademicYear } from "@/data/types";

export interface StudentFormProps {
  initialValues?: Partial<Student>;
  courseOptions: string[];
  academicYearOptions: string[];
  onSubmit: (student: Partial<Student>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  initialValues = {},
  courseOptions,
  academicYearOptions,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<Student>>({
    studentId: initialValues.studentId || "STU001234",
    fullName: initialValues.fullName || "John Doe",
    email: initialValues.email || "student@email.com",
    phone: initialValues.phone || "+1 234 567 8900",
    course: initialValues.course || courseOptions[0] || "Bachelor of Computer Science",
    year: (initialValues.year || academicYearOptions[0] || "First Year") as AcademicYear,
    address: initialValues.address || "123 Main Street, City, State 12345",
    guardian: initialValues.guardian || {
      name: "Parent or Guardian Name",
      phone: "+1 234 567 8900",
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
        <div className="flex flex-col gap-[4px]">
          <label className="text-[14px] font-medium text-[#364153]">Student ID</label>
          <input
            type="text"
            value={formData.studentId || ""}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            className="px-[14px] py-[10px] border border-[#d1d5dc] rounded-[10px] text-[16px]"
            required
          />
        </div>

        <div className="flex flex-col gap-[4px]">
          <label className="text-[14px] font-medium text-[#364153]">Full Name</label>
          <input
            type="text"
            value={formData.fullName || ""}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="px-[14px] py-[10px] border border-[#d1d5dc] rounded-[10px] text-[16px]"
            required
          />
        </div>

        <div className="flex flex-col gap-[4px]">
          <label className="text-[14px] font-medium text-[#364153]">Email Address</label>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="px-[14px] py-[10px] border border-[#d1d5dc] rounded-[10px] text-[16px]"
            required
          />
        </div>

        <div className="flex flex-col gap-[4px]">
          <label className="text-[14px] font-medium text-[#364153]">Phone Number</label>
          <input
            type="text"
            value={formData.phone || ""}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="px-[14px] py-[10px] border border-[#d1d5dc] rounded-[10px] text-[16px]"
          />
        </div>

        <div className="flex flex-col gap-[4px]">
          <label className="text-[14px] font-medium text-[#364153]">Course / Program</label>
          <select
            value={formData.course || ""}
            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
            className="px-[14px] py-[10px] border border-[#d1d5dc] rounded-[10px] text-[16px] bg-white"
          >
            {courseOptions.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-[4px]">
          <label className="text-[14px] font-medium text-[#364153]">Academic Year</label>
          <select
            value={formData.year || ""}
            onChange={(e) => setFormData({ ...formData, year: e.target.value as AcademicYear })}
            className="px-[14px] py-[10px] border border-[#d1d5dc] rounded-[10px] text-[16px] bg-white"
          >
            {academicYearOptions.map((y, i) => (
              <option key={i} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-[4px]">
        <label className="text-[14px] font-medium text-[#364153]">Address</label>
        <textarea
          value={formData.address || ""}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="px-[14px] py-[10px] border border-[#d1d5dc] rounded-[10px] text-[16px] min-h-[80px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
        <div className="flex flex-col gap-[4px]">
          <label className="text-[14px] font-medium text-[#364153]">Guardian Name</label>
          <input
            type="text"
            value={formData.guardian?.name || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                guardian: { name: e.target.value, phone: formData.guardian?.phone || "" },
              })
            }
            className="px-[14px] py-[10px] border border-[#d1d5dc] rounded-[10px] text-[16px]"
          />
        </div>

        <div className="flex flex-col gap-[4px]">
          <label className="text-[14px] font-medium text-[#364153]">Guardian Phone</label>
          <input
            type="text"
            value={formData.guardian?.phone || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                guardian: { name: formData.guardian?.name || "", phone: e.target.value },
              })
            }
            className="px-[14px] py-[10px] border border-[#d1d5dc] rounded-[10px] text-[16px]"
          />
        </div>
      </div>

      <div className="flex gap-[12px] justify-end mt-[12px]">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-[20px] py-[10px] border border-[#d1d5dc] text-[#364153] rounded-[10px] font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-[20px] py-[10px] bg-[#3d5092] text-white rounded-[10px] font-medium hover:bg-[#2b3c73] transition-colors"
        >
          {isLoading ? "Saving..." : "Register Student"}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
