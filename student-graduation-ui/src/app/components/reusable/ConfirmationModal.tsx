import React from "react";

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-[16px]">
      <div className="bg-white rounded-[16px] p-[24px] max-w-[400px] w-full shadow-lg flex flex-col gap-[16px]">
        <h3 className="text-[18px] font-semibold text-[#101828]">{title}</h3>
        <p className="text-[14px] text-[#4a5565]">{message}</p>
        <div className="flex gap-[12px] justify-end mt-[8px]">
          <button
            onClick={onCancel}
            className="px-[16px] py-[8px] border border-[#d1d5dc] rounded-[8px] text-[14px] font-medium text-[#364153]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-[16px] py-[8px] bg-[#155dfc] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#124bce]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
