import { Clock, Trash2 } from 'lucide-react'
import { ORDER_STATUS_STYLES, ORDER_TYPE_STYLES } from '../../utils/statusStyles'
import { formatTHB, formatElapsed, formatOrderId } from '../../utils/format'
import Badge from '../common/Badge'

const getOrderStatuses = (type) => [
  'New',
  'Cooking',
  'Ready',
  ...(type === 'Delivery' ? ['Delivery', 'Delivered'] : []),
  'Finished',
  'Cancelled',
];

export default function OrderRow({ order, onUpdateStatus, onDelete, onView }) {
  const orderStatuses = getOrderStatuses(order.type);
  const normalizedStatus = orderStatuses.includes(order.status) ? order.status : 'Ready';
  const statusStyle = ORDER_STATUS_STYLES[normalizedStatus] || ORDER_STATUS_STYLES.New;
  const typeStyle = ORDER_TYPE_STYLES[order.type] || ORDER_TYPE_STYLES.Delivery;

  return (
    <tr className="border-b border-brand-border-inner hover:bg-brand-hover-row transition-colors group cursor-pointer">
      <td className="py-4 px-6" onClick={() => onView?.(order)}>
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-bold text-brand-text-primary group-hover:text-brand-text-dark-neutral group-hover:underline decoration-brand-text-tertiary underline-offset-4">
            {formatOrderId(order)}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] text-brand-text-tertiary">
            <Clock size={12} />
            <span>{formatElapsed(order.createdAt)}</span>
          </div>
        </div>
      </td>
      <td className="py-4 px-6" onClick={() => onView?.(order)}>
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
      <td className="py-4 px-6 max-w-xs" onClick={() => onView?.(order)}>
        <div className="flex flex-col text-left w-full">
          <span className="text-[13px] font-medium text-brand-text-primary truncate group-hover:text-brand-text-dark-neutral group-hover:underline decoration-brand-text-tertiary underline-offset-4">
            {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
          </span>
          <span className="text-[11px] text-brand-text-tertiary uppercase tracking-wider font-bold">
            {order.items.length} items
          </span>
        </div>
      </td>
      <td className="py-4 px-6 text-right" onClick={() => onView?.(order)}>
        <span className="text-[14px] font-bold text-brand-text-primary">{formatTHB(order.total)}</span>
      </td>
      <td className="py-4 px-6" onClick={() => onView?.(order)}>
        <div className="flex justify-center">
          <Badge 
            label={normalizedStatus}
            bg={statusStyle.bg}
            text={statusStyle.text}
            className="min-w-[70px]"
          />
        </div>
      </td>
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <select
            value={normalizedStatus}
            onChange={(e) => onUpdateStatus(order.id, e.target.value)}
            className="px-2 py-1.5 rounded-lg bg-white border border-brand-border-outer text-[11px] font-bold text-brand-text-secondary outline-none"
          >
            {orderStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <button
            onClick={() => onDelete?.(order)}
            className="p-2 rounded-lg border border-brand-danger bg-white text-brand-danger hover:bg-brand-danger hover:text-white transition-all shadow-sm hover:shadow-md"
            title="Delete order"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}
