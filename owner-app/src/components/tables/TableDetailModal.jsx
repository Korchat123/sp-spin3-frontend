import React from 'react'
import { X, User, Clock, Plus, Printer, ArrowRightLeft, CreditCard, ShoppingBag } from 'lucide-react'
import { TABLE_STATUS_STYLES } from '../../utils/statusStyles'
import { formatTHB, formatElapsed } from '../../utils/format'
import Badge from '../common/Badge'

export default function TableDetailModal({ table, order, onClose }) {
  if (!table) return null;

  const isOccupied = table.status !== 'Available';
  const style = TABLE_STATUS_STYLES[table.status];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1A2333]/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-border-inner flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[18px]"
              style={{ backgroundColor: style.accent }}
            >
              {table.number}
            </div>
            <div className="flex flex-col">
              <h2 className="text-[16px] font-bold text-brand-text-primary">Table {table.number}</h2>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-brand-text-secondary uppercase tracking-wider font-bold">{table.area}</span>
                <span className="w-1 h-1 rounded-full bg-brand-text-tertiary"></span>
                <span className="text-[11px] font-bold" style={{ color: style.accent }}>{table.status}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-brand-sidebar rounded-lg text-brand-text-secondary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
          {/* Left Side: Order Details */}
          <div className="flex-[1.5] p-6 border-r border-brand-border-inner">
            {isOccupied && order ? (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-[14px] font-bold text-brand-text-primary uppercase tracking-widest">Active Order #{order.id}</h3>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-border-outer text-brand-text-dark-neutral text-[12px] font-bold hover:bg-brand-hover-row transition-colors">
                    <Plus size={14} /> Add Items
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-start gap-4">
                      <div className="flex-1 flex flex-col">
                        <span className="text-[13px] font-medium text-brand-text-primary">{item.name}</span>
                        <span className="text-[11px] text-brand-text-tertiary">฿{item.price.toLocaleString()} x {item.quantity}</span>
                      </div>
                      <span className="text-[13px] font-bold text-brand-text-primary">{formatTHB(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-brand-border-inner flex flex-col gap-2">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-brand-text-secondary">Subtotal</span>
                    <span className="text-brand-text-primary font-medium">{formatTHB(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-brand-text-secondary">Service Charge (10%)</span>
                    <span className="text-brand-text-primary font-medium">{formatTHB(order.subtotal * 0.1)}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-brand-text-secondary">VAT (7%)</span>
                    <span className="text-brand-text-primary font-medium">{formatTHB(order.tax)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-dashed border-brand-border-inner">
                    <span className="text-[14px] font-bold text-brand-text-primary">Total Amount</span>
                    <span className="text-[18px] font-bold text-brand-text-primary">{formatTHB(order.total)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 gap-4 opacity-50 text-center">
                <div className="w-16 h-16 rounded-full bg-brand-sidebar flex items-center justify-center">
                  <ShoppingBag className="text-brand-text-tertiary" size={32} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] font-bold text-brand-text-primary">No active order</span>
                  <span className="text-[12px] text-brand-text-secondary">Open the table to start serving</span>
                </div>
                <button className="mt-2 px-6 py-2 rounded-lg bg-brand-text-dark text-white text-[13px] font-bold shadow-md hover:bg-brand-text-dark/90 transition-colors">
                  Open Table
                </button>
              </div>
            )}
          </div>

          {/* Right Side: Quick Actions */}
          <div className="flex-1 p-6 bg-brand-hover-row">
            <h3 className="text-[11px] font-bold text-brand-text-tertiary uppercase tracking-widest mb-4">Table Management</h3>
            
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-3 w-full p-3 rounded-xl border border-brand-border-inner bg-white hover:bg-white/50 transition-colors text-left group">
                <div className="w-8 h-8 rounded-lg bg-brand-sidebar flex items-center justify-center text-brand-text-secondary group-hover:bg-white transition-colors">
                  <Printer size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-brand-text-primary">Print Bill</span>
                  <span className="text-[10px] text-brand-text-tertiary italic">Preview guest check</span>
                </div>
              </button>

              <button className="flex items-center gap-3 w-full p-3 rounded-xl border border-brand-border-inner bg-white hover:bg-white/50 transition-colors text-left group">
                <div className="w-8 h-8 rounded-lg bg-brand-sidebar flex items-center justify-center text-brand-text-secondary group-hover:bg-white transition-colors">
                  <ArrowRightLeft size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-brand-text-primary">Move Table</span>
                  <span className="text-[10px] text-brand-text-tertiary italic">Transfer order to other table</span>
                </div>
              </button>

              <div className="mt-4 pt-4 border-t border-brand-border-inner">
                <h3 className="text-[11px] font-bold text-brand-text-tertiary uppercase tracking-widest mb-3">Status Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2 rounded-lg border border-brand-border-outer bg-white text-[12px] font-bold text-brand-text-secondary hover:bg-brand-hover-row transition-colors">
                    Available
                  </button>
                  <button className="py-2 rounded-lg border border-[#0F6E56] bg-[#E1F5EE] text-[12px] font-bold text-[#0F6E56] hover:bg-[#D4EFE6] transition-colors">
                    Eating
                  </button>
                  <button className="py-2 rounded-lg border border-[#C96A00] bg-[#FEF3E2] text-[12px] font-bold text-[#C96A00] hover:bg-[#FDE5B4] transition-colors">
                    Cooking
                  </button>
                  <button className="py-2 rounded-lg border border-brand-danger bg-brand-danger-bg text-brand-danger text-[12px] font-bold hover:bg-[#FAD6D6] transition-colors">
                    Payment
                  </button>
                </div>
              </div>
            </div>

            {isOccupied && (
              <div className="mt-auto pt-8">
                <button className="w-full py-3 rounded-xl bg-brand-text-dark text-white text-[14px] font-bold shadow-xl hover:bg-brand-text-dark/90 flex items-center justify-center gap-2 transition-all active:scale-95">
                  <CreditCard size={18} />
                  Checkout & Payment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
