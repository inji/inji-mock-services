import React from "react";

export interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Data Available",
  message = "There are no records to display at this time.",
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-[32px] border border-dashed border-[#d1d5dc] rounded-[12px] bg-[#f9fafb] text-center gap-[8px]">
      <h3 className="text-[16px] font-semibold text-[#101828]">{title}</h3>
      <p className="text-[14px] text-[#4a5565] max-w-[360px]">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-[8px] px-[16px] py-[8px] bg-[#155dfc] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#124bce] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
