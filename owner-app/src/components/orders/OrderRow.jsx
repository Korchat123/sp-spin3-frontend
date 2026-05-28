import React from 'react'
import { MoreVertical, ChevronRight, Clock } from 'lucide-react'
import { ORDER_STATUS_STYLES, ORDER_TYPE_STYLES } from '../../utils/statusStyles'
import { formatTHB, formatElapsed } from '../../utils/format'
import Badge from '../common/Badge'

export default function OrderRow({ order, onUpdateStatus }) {
  const statusStyle = ORDER_STATUS_STYLES[order.status];
  const typeStyle = ORDER_TYPE_STYLES[order.type];

  const getNextStatus = (current) => {
    switch (current) {
      case 'New': return 'Cooking';
      case 'Cooking': return 'Ready';
      case 'Ready': return order.type === 'In-Restaurant' ? 'Paid' : 'Delivered';
      default: return null;
    }
  };

  const nextStatus = getNextStatus(order.status);

  return (
    <tr className="border-b border-brand-border-inner hover:bg-brand-hover-row transition-colors group">
      <td className="py-4 px-6">
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-bold text-brand-text-primary">#{order.id}</span>
          <div className="flex items-center gap-1.5 text-[11px] text-brand-text-tertiary">
            <Clock size={12} />
            <span>{formatElapsed(order.createdAt)}</span>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex flex-col gap-1">
          <Badge 
            label={order.type}
            bg={typeStyle.bg}
            text={typeStyle.text}
            className="w-fit"
          />
          {order.tableId && (
            <span className="text-[12px] font-medium text-brand-text-secondary pl-1">Table {order.tableId}</span>
          )}
        </div>
      </td>
      <td className="py-4 px-6 max-w-xs">
        <div className="flex flex-col">
          <span className="text-[13px] font-medium text-brand-text-primary truncate">
            {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
          </span>
          <span className="text-[11px] text-brand-text-tertiary uppercase tracking-wider font-bold">
            {order.items.length} items
          </span>
        </div>
      </td>
      <td className="py-4 px-6 text-right">
        <span className="text-[14px] font-bold text-brand-text-primary">{formatTHB(order.total)}</span>
      </td>
      <td className="py-4 px-6">
        <div className="flex justify-center">
          <Badge 
            label={order.status}
            bg={statusStyle.bg}
            text={statusStyle.text}
            className="min-w-[70px]"
          />
        </div>
      </td>
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          {nextStatus && (
            <button 
              onClick={() => onUpdateStatus(order.id, nextStatus)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-page border border-brand-border-outer text-[11px] font-bold text-brand-text-dark-neutral hover:bg-brand-sidebar hover:border-brand-border-active transition-all group/btn shadow-sm"
            >
              Move to {nextStatus}
              <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          )}
          <button className="p-2 hover:bg-brand-sidebar rounded-lg text-brand-text-tertiary hover:text-brand-text-secondary transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}
