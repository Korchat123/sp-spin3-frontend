import React from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { useStock } from '../../hooks/useStock'
import { getStockStatus } from '../../utils/getStockStatus'
import { STOCK_STATUS_STYLES } from '../../utils/statusStyles'

export default function StockAlertCard() {
  const { stock, isLoading } = useStock();

  // Robust debugging
  console.log('StockAlertCard Data Check:', {
    stock,
    type: typeof stock,
    isArray: Array.isArray(stock),
    isLoading
  });

  const alerts = Array.isArray(stock) 
    ? stock
        .filter(item => {
          if (!item) return false;
          const status = getStockStatus(item.quantity, item.reorderPoint, item.expiryDate);
          return status === 'Low Stock' || status === 'Empty' || status === 'Exp Soon';
        })
        .slice(0, 3)
    : [];

  return (
    <Link 
      to="/stock" 
      className="bg-white border border-brand-border-outer rounded-xl p-4 flex flex-col h-full hover:shadow-md hover:border-brand-text-tertiary transition-all no-underline"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[14px] font-bold text-brand-text-primary">Stock Alerts</h3>
        <AlertCircle size={18} className="text-brand-danger" />
      </div>
      
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <div className="py-4 text-center text-brand-text-tertiary text-[12px]">Loading...</div>
        ) : alerts.length > 0 ? (
          alerts.map((item) => {
            const status = getStockStatus(item.quantity, item.reorderPoint, item.expiryDate);
            const style = STOCK_STATUS_STYLES[status];
            return (
              <div key={item.id} className="flex justify-between items-center py-1">
                <span className="text-[12px] text-brand-text-primary font-medium">{item.ingredientName}</span>
                <span 
                  className="text-[10px] py-[1px] px-2 rounded-full font-medium"
                  style={{ backgroundColor: style.bg, color: style.text, border: style.border ? `1px solid ${style.border}` : 'none' }}
                >
                  {status}
                </span>
              </div>
            )
          })
        ) : (
          <div className="py-4 text-center text-brand-text-tertiary text-[12px]">
            {Array.isArray(stock) ? 'All stock good' : 'Invalid stock data'}
          </div>
        )}
      </div>
    </Link>
  )
}
