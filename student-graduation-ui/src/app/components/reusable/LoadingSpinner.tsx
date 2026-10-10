import React from "react";

export interface LoadingSpinnerProps {
  label?: string;
  size?: "sm" | "md" | "lg";
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = "Loading...",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "size-[16px]",
    md: "size-[24px]",
    lg: "size-[40px]",
  };

  return (
    <div className="flex flex-col items-center justify-center p-[24px] gap-[12px] text-[#4a5565]">
      <div className={`animate-spin rounded-full border-2 border-[#d1d5dc] border-t-[#155dfc] ${sizeClasses[size]}`} />
      {label && <span className="text-[14px] font-medium">{label}</span>}
    </div>
  );
};

export default LoadingSpinner;
