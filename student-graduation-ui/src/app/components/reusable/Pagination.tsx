import React from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalRecords?: number;
  pageSize?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
  pageSize = 10,
}) => {
  if (totalPages <= 1) return null;

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = totalRecords ? Math.min(currentPage * pageSize, totalRecords) : currentPage * pageSize;

  return (
    <div className="flex items-center justify-between py-[12px] px-[16px] border-t border-[#e5e7eb] text-[14px] text-[#4a5565]">
      <div>
        {totalRecords ? (
          <span>
            Showing <strong className="font-medium text-[#101828]">{startRecord}</strong> to{" "}
            <strong className="font-medium text-[#101828]">{endRecord}</strong> of{" "}
            <strong className="font-medium text-[#101828]">{totalRecords}</strong> results
          </span>
        ) : (
          <span>
            Page <strong className="font-medium text-[#101828]">{currentPage}</strong> of{" "}
            <strong className="font-medium text-[#101828]">{totalPages}</strong>
          </span>
        )}
      </div>

      <div className="flex gap-[8px]">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-[12px] py-[6px] border border-[#d1d5dc] rounded-[6px] disabled:opacity-50 hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-[12px] py-[6px] border border-[#d1d5dc] rounded-[6px] disabled:opacity-50 hover:bg-gray-50 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
