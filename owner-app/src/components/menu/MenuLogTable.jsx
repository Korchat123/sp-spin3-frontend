
const ACTION_STYLES = {
  created:     'bg-green-100 text-green-700',
  deleted:     'bg-red-100 text-red-700',
  activated:   'bg-blue-100 text-blue-700',
  deactivated: 'bg-gray-100 text-gray-600',
}

const formatDate = (timestamp) => {
  const d = new Date(timestamp)
  return d.toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function MenuLogTable({ logs, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-brand-text-tertiary text-[13px]">
        Loading logs...
      </div>
    )
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-brand-text-tertiary text-[13px]">
        No activity yet
      </div>
    )
  }

  return (
    <div className="bg-white border border-brand-border-outer rounded-xl overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-brand-subheader border-b border-brand-border-inner">
            <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Action</th>
            <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Item</th>
            <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Done By</th>
            <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Date & Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={log._id || i} className="border-b border-brand-border-inner hover:bg-brand-hover-row transition-colors">
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-[11px] font-bold capitalize ${ACTION_STYLES[log.action] || 'bg-gray-100 text-gray-600'}`}>
                  {log.action}
                </span>
              </td>
              <td className="py-3 px-4 text-[13px] font-medium text-brand-text-primary">{log.menuName}</td>
              <td className="py-3 px-4">
                <div className="text-[13px] text-brand-text-primary">{log.performedBy}</div>
                <div className="text-[11px] text-brand-text-tertiary capitalize">{log.performedByRole}</div>
              </td>
              <td className="py-3 px-4 text-[12px] text-brand-text-secondary">{formatDate(log.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
