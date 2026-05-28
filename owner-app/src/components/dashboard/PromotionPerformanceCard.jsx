import React from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle } from 'lucide-react'
import { usePromotions } from '../../hooks/usePromotions'
import { formatTHB } from '../../utils/format'

export default function PromotionPerformanceCard() {
  const { promotions, isLoading } = usePromotions();

  const totalSaved = promotions.reduce((sum, item) => sum + item.totalAmountSaved, 0);

  return (
    <Link 
      to="/promotions" 
      className="bg-white border border-brand-border-outer rounded-xl p-4 flex flex-col h-full hover:shadow-md hover:border-brand-text-tertiary transition-all no-underline"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[14px] font-bold text-brand-text-primary">Promotions</h3>
        <PlusCircle size={18} className="text-brand-text-secondary" />
      </div>
      
      <div className="flex flex-col gap-1">
        <div className="text-[21px] font-bold text-brand-success">
          {isLoading ? '...' : formatTHB(totalSaved)}
        </div>
        <div className="text-[11px] text-brand-text-tertiary uppercase tracking-wider font-semibold">Total Discount Used</div>
      </div>

      <div className="mt-auto pt-3 flex flex-col gap-1.5 border-t border-brand-border-inner">
        {isLoading ? (
          <div className="text-[11px] text-brand-text-tertiary">Loading...</div>
        ) : promotions.length > 0 ? (
          promotions.slice(0, 2).map((item) => (
            <div key={item.id} className="flex justify-between text-[11px]">
              <span className="text-brand-text-secondary truncate pr-2">{item.code}</span>
              <span className="text-brand-text-primary font-medium">{item.usageCount} uses</span>
            </div>
          ))
        ) : (
          <div className="text-[11px] text-brand-text-tertiary">No active promos</div>
        )}
      </div>
    </Link>
  )
}
