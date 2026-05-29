import { Clock, User } from 'lucide-react'
import { TABLE_STATUS_STYLES } from '../../utils/statusStyles'
import { formatTHB, formatElapsed } from '../../utils/format'

export default function TableCard({ table, order, onClick }) {
  const isOccupied = table.status !== 'Available';
  const style = TABLE_STATUS_STYLES[table.status];
  
  return (
    <div 
      onClick={() => onClick(table)}
      className="bg-white border border-brand-border-outer rounded-xl flex flex-col shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer h-full"
      style={{ borderTop: isOccupied ? `4px solid ${style.accent}` : undefined }}
    >
      {/* Card Header */}
      <div 
        className="px-3 py-2.5 flex justify-between items-center border-b border-brand-border-inner"
        style={{ backgroundColor: isOccupied ? `${style.accent}1A` : undefined }} // 1A is ~10% opacity
      >
        <div className="flex flex-col">
          <span className="text-[14px] font-bold text-brand-text-primary">Table {table.number}</span>
          <span className="text-[10px] text-brand-text-secondary font-medium uppercase tracking-wider">{table.area}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div 
            className="w-1.5 h-1.5 rounded-full" 
            style={{ backgroundColor: style.accent }}
          ></div>
          <span className="text-[11px] font-bold" style={{ color: style.accent }}>{table.status}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-brand-text-secondary">
            <User size={14} />
            <span className="text-[12px] font-medium">{table.seats} Seats</span>
          </div>
          {isOccupied && table.seatedAt && (
            <div className="flex items-center gap-1.5 text-brand-text-secondary">
              <Clock size={14} />
              <span className="text-[12px] font-medium">{formatElapsed(table.seatedAt)}</span>
            </div>
          )}
        </div>

        {isOccupied && order ? (
          <div className="bg-brand-page border border-brand-border-inner rounded-lg p-2 flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-brand-text-primary uppercase tracking-wider">Order #{order.id}</span>
              <span className="text-[10px] text-brand-text-tertiary">{order.items.length} items</span>
            </div>
            <div className="flex flex-col gap-0.5">
              {order.items.slice(0, 2).map((item, i) => (
                <div key={i} className="flex justify-between text-[11px]">
                  <span className="text-brand-text-secondary truncate pr-2">{item.quantity}x {item.name}</span>
                  <span className="text-brand-text-primary font-medium">{formatTHB(item.price * item.quantity)}</span>
                </div>
              ))}
              {order.items.length > 2 && (
                <span className="text-[10px] text-brand-text-tertiary italic">+{order.items.length - 2} more items</span>
              )}
            </div>
            <div className="pt-1.5 border-t border-brand-border-inner flex justify-between items-center">
              <span className="text-[11px] font-bold text-brand-text-primary">Total</span>
              <span className="text-[12px] font-bold text-brand-text-primary">{formatTHB(order.total)}</span>
            </div>
          </div>
        ) : !isOccupied && (
          <div className="flex-1 flex items-center justify-center py-6">
            <button className="px-4 py-1.5 rounded-lg border border-brand-border-outer text-brand-text-dark-neutral text-[12px] font-bold hover:bg-brand-hover-row transition-colors">
              Open Table
            </button>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      {isOccupied && (
        <div className="px-3 py-2 border-t border-brand-border-inner bg-brand-subheader">
          <button 
            className="w-full py-1.5 rounded-lg text-white text-[12px] font-bold shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: style.accent }}
          >
            {table.status === 'Payment' ? 'Process Payment' : 'Manage Table'}
          </button>
        </div>
      )}
    </div>
  )
}
