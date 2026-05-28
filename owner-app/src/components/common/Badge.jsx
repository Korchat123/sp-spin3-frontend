import React from 'react'

export default function Badge({ label, bg, text, border, className = '' }) {
  return (
    <span 
      className={`text-[10px] py-[2px] px-2 rounded-full font-medium text-center inline-block ${className}`}
      style={{ 
        backgroundColor: bg, 
        color: text, 
        border: border ? `1px solid ${border}` : 'none' 
      }}
    >
      {label}
    </span>
  )
}
