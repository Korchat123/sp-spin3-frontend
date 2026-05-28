import React from 'react'
import { MoreVertical, Calendar, TrendingUp, ToggleLeft, ToggleRight } from 'lucide-react'
import { getPromoStatus } from '../../utils/getPromoStatus'
import { PROMO_STATUS_STYLES } from '../../utils/statusStyles'
import { formatTHB, formatDate } from '../../utils/format'
import Badge from '../common/Badge'

export default function PromotionRow({ promo, onToggle, onEdit }) {
  const status = getPromoStatus(promo.startDate, promo.endDate);
  const statusStyle = PROMO_STATUS_STYLES[status];
  const isExpired = status === 'Expired';

  return (
    <tr className={`border-b border-brand-border-inner hover:bg-brand-hover-row transition-colors group ${isExpired ? 'opacity-60' : ''}`}>
      <td className="py-4 px-6">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-brand-text-primary">{promo.name}</span>
            <span className="px-1.5 py-0.5 rounded bg-brand-sidebar text-brand-text-secondary text-[10px] font-bold border border-brand-border-inner uppercase tracking-wider">
              {promo.code}
            </span>
          </div>
          <span className="text-[11px] text-brand-text-tertiary">
            {promo.discountType === 'percentage' ? `${promo.discountValue}% Off` : promo.discountType === 'fixed' ? `฿${promo.discountValue} Off` : 'Free Item'}
          </span>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <Badge 
            label={status}
            bg={statusStyle.bg}
            text={statusStyle.text}
            className="min-w-[80px]"
          />
          {status === 'ExpSoon' && (
            <span className="text-[10px] text-brand-warning-text font-bold">Ends soon!</span>
          )}
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-1.5 text-[12px] text-brand-text-secondary">
          <Calendar size={14} className="text-brand-text-tertiary" />
          <span>{formatDate(promo.startDate)} - {formatDate(promo.endDate)}</span>
        </div>
      </td>
      <td className="py-4 px-6 text-center">
        <div className="flex flex-col items-center">
          <span className="text-[14px] font-bold text-brand-text-primary">{promo.usageCount.toLocaleString()}</span>
          <span className="text-[10px] text-brand-text-tertiary uppercase tracking-wider font-bold">Usages</span>
        </div>
      </td>
      <td className="py-4 px-6 text-right">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-brand-success font-bold">
            <TrendingUp size={14} />
            <span className="text-[14px]">{formatTHB(promo.totalAmountSaved)}</span>
          </div>
          <span className="text-[10px] text-brand-text-tertiary uppercase tracking-wider font-bold">Saved by Customers</span>
        </div>
      </td>
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-3">
          <button 
            onClick={() => onToggle(promo.id, !promo.active)}
            className={`transition-colors ${promo.active ? 'text-brand-success' : 'text-brand-text-tertiary'}`}
            disabled={isExpired}
          >
            {promo.active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
          </button>
          <button 
            onClick={() => onEdit(promo)}
            className="p-2 hover:bg-brand-sidebar rounded-lg text-brand-text-tertiary hover:text-brand-text-secondary transition-colors"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}
