import React from 'react'
import { Link } from 'react-router-dom'
import { useOrders } from '../../hooks/useOrders'
import { ORDER_STATUS_STYLES } from '../../utils/statusStyles'
import { formatElapsed } from '../../utils/format'

export default function RecentOrdersList() {
  const { orders, isLoading } = useOrders();
  
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="bg-white border border-brand-border-outer rounded-xl overflow-hidden flex flex-col h-full">
      <div className="px-4 py-3 border-b border-brand-border-inner flex justify-between items-center">
        <h3 className="text-[14px] font-bold text-brand-text-primary">Recent Orders</h3>
        <Link to="/orders" className="text-[12px] text-brand-text-dark font-medium hover:underline">View All</Link>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-brand-text-tertiary text-[12px]">Loading...</div>
        ) : recentOrders.length > 0 ? (
          recentOrders.map((order) => {
            const statusStyle = ORDER_STATUS_STYLES[order.status];
            return (
              <Link 
                key={order.id} 
                to="/orders" 
                className="flex items-center gap-2 py-[10px] px-4 border-b border-brand-border-inner hover:bg-brand-hover-row transition-colors no-underline last:border-0"
              >
                <span className="text-[12px] font-medium text-brand-text-primary min-w-[40px]">#{order.id}</span>
                <span className="flex-1 text-[12px] text-brand-text-secondary truncate">
                  {order.items.map(i => i.name).join(', ')}
                </span>
                <span 
                  className="text-[10px] py-[2px] px-2 rounded-full font-medium min-w-[58px] text-center"
                  style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                >
                  {order.status}
                </span>
                <span className="text-[11px] text-brand-text-tertiary min-w-[38px] text-right">
                  {formatElapsed(order.createdAt)}
                </span>
              </Link>
            )
          })
        ) : (
          <div className="p-8 text-center text-brand-text-tertiary text-[12px]">No recent orders</div>
        )}
      </div>
    </div>
  )
}
