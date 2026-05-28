import React from 'react'
import { CUSTOMER_TIER_STYLES } from '../../utils/statusStyles'
import { formatTHB, formatDate } from '../../utils/format'
import Badge from '../common/Badge'

export default function CustomerRow({ customer, onClick }) {
  const tierStyle = CUSTOMER_TIER_STYLES[customer.tier];

  return (
    <tr 
      onClick={() => onClick(customer)}
      className="group border-b border-brand-border-inner hover:bg-brand-hover-row cursor-pointer transition-colors"
    >
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span className="text-[13px] font-bold text-brand-text-primary group-hover:text-brand-text-dark-neutral transition-colors">
            {customer.name}
          </span>
          <span className="text-[11px] text-brand-text-tertiary">ID: {customer.id}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span className="text-[12px] text-brand-text-primary">{customer.phone}</span>
          <span className="text-[11px] text-brand-text-secondary">{customer.email}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <Badge 
          label={customer.tier}
          bg={tierStyle.bg}
          text={tierStyle.text}
          border={tierStyle.border}
        />
      </td>
      <td className="py-3 px-4">
        <span className="text-[13px] font-medium text-brand-text-primary">{customer.points.toLocaleString()} pts</span>
      </td>
      <td className="py-3 px-4">
        <span className="text-[13px] font-medium text-brand-text-primary">{formatTHB(customer.totalSpent)}</span>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex flex-col items-end">
          <span className="text-[12px] text-brand-text-primary font-medium">{formatDate(customer.lastVisit)}</span>
          <span className="text-[10px] text-brand-text-tertiary uppercase tracking-wider">{customer.lastChannel}</span>
        </div>
      </td>
    </tr>
  )
}
