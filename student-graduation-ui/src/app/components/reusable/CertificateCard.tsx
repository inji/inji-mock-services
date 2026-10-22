import React from "react";
import type { Certificate } from "@/data/types";
import StatusBadge from "./StatusBadge";

export interface CertificateCardProps {
  certificate: Certificate;
  onAction?: (cert: Certificate) => void;
  actionLabel?: string;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  onAction,
  actionLabel = "View Details",
}) => {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-[20px] shadow-sm flex flex-col justify-between gap-[16px]">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[12px] font-medium text-[#667085]">REGISTRATION NO.</span>
          <h4 className="text-[18px] font-semibold text-[#101828] mt-[2px]">
            {certificate.registrationNumber}
          </h4>
        </div>
        <StatusBadge status="Issued" variant="verified" />
      </div>

      <div className="flex flex-col gap-[6px]">
        <p className="text-[14px] text-[#364153] font-medium">{certificate.degreeTitle}</p>
        <p className="text-[12px] text-[#667085]">
          Graduation: {certificate.graduationMonth ? `${certificate.graduationMonth} ` : ""}{certificate.graduationYear}
        </p>
      </div>

      {onAction && (
        <button
          onClick={() => onAction(certificate)}
          className="w-full py-[8px] bg-[#155dfc] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#124bce] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default CertificateCard;
