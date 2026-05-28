import React from 'react'
import { Lock, Unlock, Mail, Clock, MoreVertical } from 'lucide-react'
import { STAFF_ROLE_STYLES } from '../../utils/statusStyles'
import { formatDate } from '../../utils/format'
import Badge from '../common/Badge'

export default function StaffRow({ member, onToggleLock }) {
  const roleStyle = STAFF_ROLE_STYLES[member.role];
  const initials = member.name.split(' ').map(n => n[0]).join('');

  return (
    <tr className="border-b border-brand-border-inner hover:bg-brand-hover-row transition-colors group">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0"
            style={{ backgroundColor: roleStyle.bg, color: roleStyle.text }}
          >
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-brand-text-primary">{member.name}</span>
            <div className="flex items-center gap-1.5 text-[11px] text-brand-text-tertiary">
              <Mail size={12} />
              <span>{member.email}</span>
            </div>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex flex-col gap-1">
          <Badge 
            label={member.role.charAt(0).toUpperCase() + member.role.slice(1)}
            bg={roleStyle.bg}
            text={roleStyle.text}
            className="w-fit"
          />
          <span className="text-[11px] text-brand-text-tertiary pl-1">{member.area}</span>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-1.5 text-brand-text-secondary text-[12px]">
          <Clock size={14} className="text-brand-text-tertiary" />
          <span>{member.isPending ? 'Never logged in' : formatDate(member.lastLogin)}</span>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex justify-center">
          {member.isPending ? (
            <Badge 
              label="Pending"
              bg="#FEF3E2"
              text="#C96A00"
              className="min-w-[70px]"
            />
          ) : (
            <Badge 
              label={member.isLocked ? 'Locked' : 'Active'}
              bg={member.isLocked ? '#FCEBEB' : '#E1F5EE'}
              text={member.isLocked ? '#E24B4A' : '#0F6E56'}
              className="min-w-[70px]"
            />
          )}
        </div>
      </td>
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-3">
          {!member.isPending && (
            <button 
              onClick={() => onToggleLock(member.id, !member.isLocked)}
              title={member.isLocked ? 'Unlock Account' : 'Lock Account'}
              className={`p-2 rounded-lg transition-colors ${
                member.isLocked 
                  ? 'text-brand-danger hover:bg-brand-danger-bg' 
                  : 'text-brand-text-tertiary hover:bg-brand-sidebar hover:text-brand-text-secondary'
              }`}
            >
              {member.isLocked ? <Lock size={18} /> : <Unlock size={18} />}
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
