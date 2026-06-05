import React from "react";
import { Wifi, WifiOff } from "lucide-react";

export default function TableListView({
  tables,
  statusLabel,
  onOpenModal,
  formatTime,
}) {
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "FREE":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "OCCUPIED":
        return "bg-red-50 text-red-700 border border-red-200";
      case "RESERVED":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getCapacityText = (cap) => {
    if (cap >= 7) return "7-10 คน (Large)";
    if (cap >= 3) return "3-6 คน (Medium)";
    return "1-2 คน (Small)";
  };

  return (
    <div className="flex-1 bg-white border-4 border-[#242424] rounded-3xl p-6 md:p-8 shadow-[8px_8px_0_#242424] overflow-y-auto mt-2">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs md:text-sm">
          <thead>
            <tr className="border-b-4 border-[#242424] text-[#888888] font-bold uppercase tracking-widest text-[10px]">
              <th className="pb-3 pl-2">โต๊ะ</th>
              <th className="pb-3">ประเภทความจุ</th>
              <th className="pb-3">สถานะออนไลน์</th>
              <th className="pb-3">สถานะใช้งาน</th>
              <th className="pb-3">เวลาใช้งาน</th>
              <th className="pb-3 pr-2 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-150">
            {tables.map((table) => (
              <tr
                key={table.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-4 pl-2 font-bebas text-2xl tracking-wide text-[#242424]">
                  {table.id}
                </td>
                <td className="py-4 font-semibold text-[#242424]">
                  {getCapacityText(table.cap)}
                </td>
                <td className="py-4">
                  <span
                    className={`inline-flex items-center gap-1 font-bold ${table.isOnline ? "text-emerald-600" : "text-red-500"}`}
                  >
                    {table.isOnline ? (
                      <Wifi size={14} />
                    ) : (
                      <WifiOff size={14} />
                    )}
                    {table.isOnline ? "Online" : "Offline"}
                  </span>
                </td>
                <td className="py-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusBadgeStyle(table.status)}`}
                  >
                    {statusLabel[table.status] || table.status}
                  </span>
                </td>
                <td className="py-4 font-semibold text-gray-500">
                  {table.status === "OCCUPIED" && table.startTime
                    ? formatTime(table.startTime)
                    : "-"}
                </td>
                <td className="py-4 pr-2 text-right">
                  <button
                    onClick={() => onOpenModal(table.id)}
                    className="bg-[#242424] text-white hover:bg-[#e4002b] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                  >
                    จัดการโต๊ะ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
