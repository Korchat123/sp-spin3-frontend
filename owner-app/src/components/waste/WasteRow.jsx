import React from 'react'
import { WASTE_REASON_STYLES } from '../../utils/statusStyles'
import { formatTHB, formatDate } from '../../utils/format'
import Badge from '../common/Badge'

export default function WasteRow({ entry }) {
  const reasonStyle = WASTE_REASON_STYLES[entry.reason];

  return (
    <tr className="border-b border-brand-border-inner hover:bg-brand-hover-row transition-colors group">
      <td className="py-4 px-6">
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-bold text-brand-text-primary">{entry.itemName}</span>
          <span className="text-[11px] text-brand-text-tertiary">{formatDate(entry.date)}</span>
        </div>
      </td>
      <td className="py-4 px-6">
        <Badge 
          label={entry.reason}
          bg={reasonStyle.bg}
          text={reasonStyle.text}
          className="min-w-[90px]"
        />
      </td>
      <td className="py-4 px-6 text-center">
        <span className="text-[13px] font-medium text-brand-text-primary">
          {entry.quantity} {entry.unit}
        </span>
      </td>
      <td className="py-4 px-6 text-right">
        <span className="text-[14px] font-bold text-brand-danger">
          -{formatTHB(entry.estimatedCost)}
        </span>
      </td>
      <td className="py-4 px-6 text-right">
        <span className="text-[12px] text-brand-text-secondary font-medium">
          {entry.recordedBy}
        </span>
      </td>
    </tr>
  )
}
