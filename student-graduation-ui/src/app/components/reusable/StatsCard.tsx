import React from "react";
import type { DashboardStat } from "@/data/types";

export interface StatsCardProps {
  stat: DashboardStat;
  icon?: React.ReactNode;
  iconBgColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stat, icon, iconBgColor = "bg-[#155dfc]" }) => {
  return (
    <div className="bg-white content-stretch flex flex-col justify-between p-[24px] relative rounded-[12px] shrink-0 size-full shadow-sm border border-[#e5e7eb]">
      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col gap-[4px]">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[#4a5565] text-[14px] tracking-[-0.1504px]">
            {stat.label}
          </p>
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[36px] text-[#101828] text-[30px] tracking-[0.3955px]">
            {stat.value}
          </p>
        </div>
        {icon && (
          <div className={`flex items-center justify-center p-[10px] rounded-[10px] ${iconBgColor} shrink-0`}>
            {icon}
          </div>
        )}
      </div>
      {stat.caption && (
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-[#667085] mt-[8px]">
          {stat.caption}
        </p>
      )}
    </div>
  );
};

export default StatsCard;
