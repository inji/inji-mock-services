import React from "react";

export interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  buttonLabel?: string;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  title,
  message,
  buttonLabel = "Done",
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-[16px]">
      <div className="bg-white rounded-[16px] p-[24px] max-w-[400px] w-full shadow-lg flex flex-col items-center text-center gap-[16px]">
        <div className="w-[48px] h-[48px] rounded-full bg-[#ecfdf5] flex items-center justify-center text-[#047857]">
          <svg className="size-[24px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-[18px] font-semibold text-[#101828]">{title}</h3>
        <p className="text-[14px] text-[#4a5565]">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-[10px] bg-[#155dfc] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#124bce]"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
