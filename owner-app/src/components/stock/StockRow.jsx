import React from 'react'
import { MoreVertical, Calendar, AlertCircle } from 'lucide-react'
import { getStockStatus } from '../../utils/getStockStatus'
import { STOCK_STATUS_STYLES } from '../../utils/statusStyles'
import { formatTHB, formatDate } from '../../utils/format'
import Badge from '../common/Badge'

export default function StockRow({ lot, onEdit }) {
  const status = getStockStatus(lot.quantity, lot.reorderPoint, lot.expiryDate);
  const style = STOCK_STATUS_STYLES[status];

  return (
    <tr className="border-b border-brand-border-inner hover:bg-brand-hover-row transition-colors group">
      <td className="py-4 px-6">
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-bold text-brand-text-primary">{lot.ingredientName}</span>
          <span className="text-[11px] text-brand-text-tertiary">Lot ID: {lot.id}</span>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <span className={`text-[14px] font-bold ${lot.quantity <= lot.reorderPoint ? 'text-brand-danger' : 'text-brand-text-primary'}`}>
            {lot.quantity} {lot.unit}
          </span>
          {lot.quantity <= lot.reorderPoint && lot.quantity > 0 && (
            <AlertCircle size={14} className="text-brand-danger" />
          )}
        </div>
      </td>
      <td className="py-4 px-6">
        <span className="text-[13px] font-medium text-brand-text-secondary">{formatTHB(lot.price)}</span>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-1.5">
          <Calendar size={14} className="text-brand-text-tertiary" />
          <span className={`text-[12px] ${status === 'Exp Soon' ? 'text-brand-warning-text font-bold' : 'text-brand-text-secondary'}`}>
            {lot.expiryDate ? formatDate(lot.expiryDate) : 'No Expiry'}
          </span>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex justify-center">
          {status !== 'Good' ? (
            <Badge 
              label={status}
              bg={style.bg}
              text={style.text}
              border={style.border}
              className="min-w-[75px]"
            />
          ) : (
            <span className="text-[11px] text-brand-success font-bold uppercase tracking-widest">In Stock</span>
          )}
        </div>
      </td>
      <td className="py-4 px-6 text-right">
        <button 
          onClick={() => onEdit(lot)}
          className="p-2 hover:bg-brand-sidebar rounded-lg text-brand-text-tertiary hover:text-brand-text-secondary transition-colors"
        >
          <MoreVertical size={16} />
        </button>
      </td>
    </tr>
  )
}
