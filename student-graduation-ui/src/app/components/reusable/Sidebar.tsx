import React from "react";

export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
}

export interface SidebarProps {
  items: NavItem[];
  onSelect: (id: string) => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, onSelect, className = "" }) => {
  return (
    <aside className={`flex flex-col gap-[8px] p-[16px] bg-white border-r border-[#e5e7eb] w-[240px] min-h-screen ${className}`}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`flex items-center gap-[12px] px-[16px] py-[10px] rounded-[8px] text-[14px] font-medium transition-colors text-left ${
            item.active
              ? "bg-[#155dfc] text-white"
              : "text-[#364153] hover:bg-[#f3f4f6]"
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;
