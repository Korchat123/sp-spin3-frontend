import React from "react"
import { Link, useLocation } from 'react-router-dom'

export default function SidebarNavItem({ to, icon, label, badgeCount, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-[9px] py-[7px] px-[12px] rounded-lg mx-[6px] my-[1px] cursor-pointer text-[13px] transition-colors decoration-none ${
        isActive
          ? 'bg-brand-active-nav text-brand-text-primary font-medium'
          : 'text-brand-text-secondary hover:bg-brand-active-nav/50 hover:text-brand-text-primary'
      }`}
    >
      <span className="w-[18px] h-[18px] shrink-0 flex items-center justify-center">
        {icon}
      </span>
      <span>{label}</span>
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className="ml-auto bg-brand-danger text-white text-[10px] py-[1px] px-[6px] rounded-full">
          {badgeCount}
        </span>
      )}
    </Link>
  )
}
