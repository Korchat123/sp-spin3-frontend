import React from 'react'
import { Link } from 'react-router-dom'

export default function StatCard({ label, value, change, changeColor, dotColor, href }) {
  const content = (
    <div className={`bg-white border border-brand-border-outer rounded-xl py-[14px] px-[15px] transition-all ${href ? 'hover:shadow-md hover:border-brand-text-tertiary cursor-pointer' : ''}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[11px] text-brand-text-secondary uppercase tracking-wider font-semibold">{label}</span>
        <div className="w-[7px] h-[7px] rounded-full" style={{ backgroundColor: dotColor }}></div>
      </div>
      <div className="text-[21px] font-bold text-brand-text-primary mb-0.5">{value}</div>
      <div className="text-[11px] font-medium" style={{ color: changeColor }}>{change}</div>
    </div>
  );

  if (href) {
    return <Link to={href} className="no-underline">{content}</Link>;
  }

  return content;
}
