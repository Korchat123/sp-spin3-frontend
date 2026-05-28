import React, { useMemo } from 'react'

const data = [
  { day: 'Mon', value: 12000 },
  { day: 'Tue', value: 15400 },
  { day: 'Wed', value: 18200 },
  { day: 'Thu', value: 14500 },
  { day: 'Fri', value: 21000 },
  { day: 'Sat', value: 25800 },
  { day: 'Sun', value: 22400 },
]

export default function RevenueChart() {
  const maxVal = useMemo(() => Math.max(...data.map(d => d.value)), [])

  return (
    <div className="h-[150px] w-full mt-4 flex items-end gap-1">
      {data.map((entry) => {
        const isPeak = entry.value === maxVal
        const heightPct = (entry.value / maxVal) * 100
        const label = entry.value >= 1000 ? `${(entry.value / 1000).toFixed(1)}k` : entry.value

        return (
          <div key={entry.day} className="flex-1 flex flex-col items-center justify-end gap-1" style={{ height: '100%' }}>
            {/* Value label */}
            <span
              className="text-[9px] font-bold leading-none"
              style={{ color: isPeak ? '#3D4A5C' : '#9AA3AE' }}
            >
              {label}
            </span>

            {/* Bar */}
            <div
              className="w-full rounded-t-[4px] transition-all"
              style={{
                height: `${heightPct}%`,
                backgroundColor: isPeak ? '#3D4A5C' : '#D0D5DE',
                maxHeight: 'calc(100% - 28px)',
              }}
            />

            {/* Day label */}
            <span
              className="text-[10px] leading-none"
              style={{
                color: isPeak ? '#1A2333' : '#9AA3AE',
                fontWeight: isPeak ? 'bold' : 'normal',
              }}
            >
              {entry.day}
            </span>
          </div>
        )
      })}
    </div>
  )
}
