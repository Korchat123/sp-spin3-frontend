import React from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useWaste } from '../../hooks/useWaste'
import { formatTHB } from '../../utils/format'

export default function RecentWasteCard() {
  const { waste, isLoading } = useWaste();

  const totalWaste = waste.reduce((sum, item) => sum + item.estimatedCost, 0);

  return (
    <Link 
      to="/waste" 
      className="bg-white border border-brand-border-outer rounded-xl p-4 flex flex-col h-full hover:shadow-md hover:border-brand-text-tertiary transition-all no-underline"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[14px] font-bold text-brand-text-primary">Recent Waste</h3>
        <Trash2 size={18} className="text-brand-text-secondary" />
      </div>
      
      <div className="flex flex-col gap-1">
        <div className="text-[21px] font-bold text-brand-danger">
          {isLoading ? '...' : `-${formatTHB(totalWaste)}`}
        </div>
        <div className="text-[11px] text-brand-text-tertiary uppercase tracking-wider font-semibold">Total Lost (Monthly)</div>
      </div>

      <div className="mt-auto pt-3 flex flex-col gap-1.5 border-t border-brand-border-inner">
        {isLoading ? (
          <div className="text-[11px] text-brand-text-tertiary">Loading...</div>
        ) : waste.length > 0 ? (
          waste.slice(0, 2).map((item) => (
            <div key={item.id} className="flex justify-between text-[11px]">
              <span className="text-brand-text-secondary truncate pr-2">{item.itemName}</span>
              <span className="text-brand-text-primary font-medium">-{formatTHB(item.estimatedCost)}</span>
            </div>
          ))
        ) : (
          <div className="text-[11px] text-brand-text-tertiary">No waste recorded</div>
        )}
      </div>
    </Link>
  )
}
