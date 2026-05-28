import React from 'react'
import { formatTHB } from '../../utils/format'

export default function MenuCard({ item, onToggleAvailability }) {
  return (
    <div className={`bg-white border border-brand-border-outer rounded-xl overflow-hidden shadow-sm flex flex-col transition-all duration-200 ${!item.available ? 'opacity-70 grayscale-[0.5]' : 'hover:shadow-md'}`}>
      <div className="aspect-[4/3] bg-brand-sidebar relative overflow-hidden">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-text-tertiary">
            <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="bg-white/90 backdrop-blur-sm border border-brand-border-inner px-2 py-1 rounded-lg text-[10px] font-bold text-brand-text-primary shadow-sm">
            {item.category}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-[14px] font-bold text-brand-text-primary leading-tight">{item.name}</h3>
          <span className="text-[14px] font-bold text-brand-text-primary shrink-0">{formatTHB(item.price)}</span>
        </div>
        {item.description && (
          <p className="text-[11px] text-brand-text-secondary line-clamp-2 mt-1">{item.description}</p>
        )}
      </div>

      <div className="px-4 py-3 border-t border-brand-border-inner bg-brand-subheader flex items-center justify-between">
        <span className={`text-[11px] font-bold ${item.available ? 'text-brand-success' : 'text-brand-danger'}`}>
          {item.available ? 'Available' : 'Out of Stock'}
        </span>
        
        {/* Toggle Switch */}
        <button 
          onClick={() => onToggleAvailability(item.id, !item.available)}
          className={`w-9 h-5 rounded-full relative transition-colors duration-200 focus:outline-none ${item.available ? 'bg-brand-success' : 'bg-brand-text-tertiary'}`}
        >
          <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-transform duration-200 ${item.available ? 'translate-x-4.5' : 'translate-x-1'}`}></div>
        </button>
      </div>
    </div>
  )
}
