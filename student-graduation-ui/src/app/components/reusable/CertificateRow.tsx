import React from "react";
import type { Certificate } from "@/data/types";
import StatusBadge from "./StatusBadge";

export interface CertificateRowProps {
  certificate: Certificate;
  onView?: (certificate: Certificate) => void;
}

export const CertificateRow: React.FC<CertificateRowProps> = ({ certificate, onView }) => {
  return (
    <tr
      className="border-b border-[#e5e7eb] hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onView && onView(certificate)}
    >
      <td className="py-[12px] px-[16px] text-[14px] font-medium text-[#101828]">
        {certificate.registrationNumber}
      </td>
      <td className="py-[12px] px-[16px] text-[14px] text-[#4a5565]">
        {certificate.degreeTitle}
      </td>
      <td className="py-[12px] px-[16px] text-[14px] text-[#4a5565]">
        {certificate.graduationYear}
      </td>
      <td className="py-[12px] px-[16px]">
        <StatusBadge status="Issued" variant="verified" />
      </td>
    </tr>
  );
};

export default CertificateRow;
