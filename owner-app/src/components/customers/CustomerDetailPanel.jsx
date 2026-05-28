import React from 'react'
import { X, Calendar, MapPin, Phone, Mail, ShoppingBag } from 'lucide-react'
import { CUSTOMER_TIER_STYLES } from '../../utils/statusStyles'
import { formatTHB, formatDate } from '../../utils/format'
import Badge from '../common/Badge'

export default function CustomerDetailPanel({ customer, onClose }) {
  if (!customer) return null;

  const tierStyle = CUSTOMER_TIER_STYLES[customer.tier];

  return (
    <div className="fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl border-l border-brand-border-outer z-[200] flex flex-col transform transition-transform duration-300 ease-in-out">
      {/* Panel Header */}
      <div className="px-6 py-5 border-b border-brand-border-inner flex items-center justify-between bg-brand-hover-row">
        <h2 className="text-[16px] font-bold text-brand-text-primary">Member Profile</h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-brand-sidebar rounded-lg text-brand-text-secondary transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Profile Overview */}
      <div className="p-6 flex flex-col gap-6 overflow-y-auto flex-1">
        <div className="flex items-center gap-4">
          <div className="w-[70px] h-[70px] rounded-full bg-brand-active-nav flex items-center justify-center text-[24px] font-bold text-brand-text-primary">
            {customer.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[18px] font-bold text-brand-text-primary">{customer.name}</span>
            <Badge 
              label={customer.tier}
              bg={tierStyle.bg}
              text={tierStyle.text}
              border={tierStyle.border}
              className="w-fit"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-brand-text-secondary">
            <Phone size={16} />
            <span className="text-[13px]">{customer.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-brand-text-secondary">
            <Mail size={16} />
            <span className="text-[13px]">{customer.email}</span>
          </div>
          {customer.lineId && (
            <div className="flex items-center gap-3 text-brand-text-secondary">
              <span className="text-[13px] font-bold">LINE</span>
              <span className="text-[13px]">{customer.lineId}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-brand-page border border-brand-border-inner flex flex-col gap-1">
            <span className="text-[10px] text-brand-text-tertiary uppercase tracking-wider font-bold">Total Spent</span>
            <span className="text-[16px] font-bold text-brand-text-primary">{formatTHB(customer.totalSpent)}</span>
          </div>
          <div className="p-4 rounded-xl bg-brand-page border border-brand-border-inner flex flex-col gap-1">
            <span className="text-[10px] text-brand-text-tertiary uppercase tracking-wider font-bold">Available Points</span>
            <span className="text-[16px] font-bold text-brand-text-primary">{customer.points.toLocaleString()}</span>
          </div>
        </div>

        {/* History / Insights */}
        <div className="flex flex-col gap-4 mt-2">
          <h3 className="text-[14px] font-bold text-brand-text-primary">Engagement History</h3>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-sidebar flex items-center justify-center shrink-0 mt-0.5">
              <Calendar size={14} className="text-brand-text-secondary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-brand-text-primary">Last Visited</span>
              <span className="text-[12px] text-brand-text-secondary">{formatDate(customer.lastVisit)} via {customer.lastChannel}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-sidebar flex items-center justify-center shrink-0 mt-0.5">
              <ShoppingBag size={14} className="text-brand-text-secondary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-brand-text-primary">Total Visits</span>
              <span className="text-[12px] text-brand-text-secondary">{customer.orderCount} complete orders</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <button className="w-full py-2.5 rounded-lg bg-brand-text-dark text-white text-[13px] font-bold hover:bg-brand-text-dark/90 transition-colors">
            Send Promotion Message
          </button>
          <button className="w-full py-2.5 rounded-lg border border-brand-border-outer bg-white text-brand-text-secondary text-[13px] font-bold hover:bg-brand-hover-row transition-colors">
            Edit Member Info
          </button>
        </div>
      </div>
    </div>
  )
}
