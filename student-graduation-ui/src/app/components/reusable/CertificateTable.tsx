import React from "react";
import type { Certificate } from "@/data/types";
import CertificateRow from "./CertificateRow";
import EmptyState from "./EmptyState";

export interface CertificateTableProps {
  certificates: Certificate[];
  onViewCertificate?: (cert: Certificate) => void;
}

export const CertificateTable: React.FC<CertificateTableProps> = ({
  certificates,
  onViewCertificate,
}) => {
  if (certificates.length === 0) {
    return <EmptyState message="No degree certificates found." />;
  }

  return (
    <div className="w-full overflow-x-auto border border-[#e5e7eb] rounded-[10px]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#f9fafb] border-b border-[#e5e7eb] text-[12px] font-semibold text-[#4a5565] uppercase">
            <th className="py-[12px] px-[16px]">Reg Number</th>
            <th className="py-[12px] px-[16px]">Degree Title</th>
            <th className="py-[12px] px-[16px]">Graduation Year</th>
            <th className="py-[12px] px-[16px]">Status</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((cert) => (
            <CertificateRow key={cert.id} certificate={cert} onView={onViewCertificate} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CertificateTable;
