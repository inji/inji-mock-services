import React, { useState } from "react";
import type { Institute } from "@/data/types";

export interface InstituteFormProps {
  initialValues: Institute;
  onSubmit: (values: Institute) => void;
  isLoading?: boolean;
}

export const InstituteForm: React.FC<InstituteFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Institute>(initialValues);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[16px] max-w-[400px]">
      <div className="flex flex-col gap-[4px]">
        <label className="text-[14px] font-medium text-[#364153]">Institute Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="px-[14px] py-[8px] border border-[#d1d5dc] rounded-[8px] text-[14px]"
          required
        />
      </div>

      <div className="flex flex-col gap-[4px]">
        <label className="text-[14px] font-medium text-[#364153]">Portal Label</label>
        <input
          type="text"
          value={formData.portalLabel}
          onChange={(e) => setFormData({ ...formData, portalLabel: e.target.value })}
          className="px-[14px] py-[8px] border border-[#d1d5dc] rounded-[8px] text-[14px]"
          required
        />
      </div>

      <div className="flex flex-col gap-[4px]">
        <label className="text-[14px] font-medium text-[#364153]">System Name</label>
        <input
          type="text"
          value={formData.systemName}
          onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
          className="px-[14px] py-[8px] border border-[#d1d5dc] rounded-[8px] text-[14px]"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="py-[10px] bg-[#3d5092] text-white font-medium text-[16px] rounded-[10px] hover:bg-[#2b3c73] transition-colors"
      >
        {isLoading ? "Saving..." : "Save Institute Settings"}
      </button>
    </form>
  );
};

export default InstituteForm;
