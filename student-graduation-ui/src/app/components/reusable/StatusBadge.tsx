import React from "react";

export interface StatusBadgeProps {
  status: string;
  variant?: "active" | "inactive" | "graduated" | "verified" | "pending" | "custom";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant, className = "" }) => {
  const getBadgeStyle = () => {
    const s = (variant || status).toLowerCase();
    if (s.includes("active") || s.includes("verified")) {
      return "bg-[#ecfdf5] text-[#047857] border-[#abf7d0]";
    }
    if (s.includes("inactive") || s.includes("pending")) {
      return "bg-[#fffbeb] text-[#b45309] border-[#fde68a]";
    }
    if (s.includes("graduated")) {
      return "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]";
    }
    return "bg-[#f3f4f6] text-[#374151] border-[#e5e7eb]";
  };

  return (
    <span
      className={`inline-flex items-center px-[8px] py-[2px] rounded-full text-[12px] font-medium border ${getBadgeStyle()} ${className}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
