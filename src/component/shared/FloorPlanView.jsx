import React from "react";
import { Users, Clock, Settings, WifiOff } from "lucide-react";

export default function FloorPlanView({
  tables,
  isEditMode,
  onOpenModal,
  formatTime,
  isOverstay,
}) {
  const getTableStyle = (table) => {
    if (isEditMode)
      return "border-dashed border-gray-300 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:border-gray-400";

    // 💡 โต๊ะนั่งแช่ (เกิน 2 ชม) เปลี่ยนเป็นสีแดงจางๆ ขอบแดงอ่อนๆ และกระพริบเบาๆ
    if (table.status === "OCCUPIED" && isOverstay(table.startTime)) {
      return "bg-red-50 border-2 border-red-200 text-[#e4002b] shadow-sm animate-pulse";
    }

    if (table.status === "FREE" && !table.isOnline) {
      return "bg-gray-200 border-2 border-gray-300 text-gray-500 shadow-sm opacity-80";
    }

    switch (table.status) {
      case "FREE":
        return "bg-white border-2 border-gray-200 text-[#242424] hover:border-[#242424] shadow-sm";
      case "OCCUPIED":
        return "bg-[#242424] border-2 border-[#242424] text-white shadow-md";
      case "RESERVED":
        return "bg-yellow-400 border-2 border-yellow-500 text-[#242424] shadow-md";
      default:
        return "bg-gray-100 border-2 border-gray-200 text-gray-400";
    }
  };

  const getCapacityRange = (tableId, cap) => {
    const match = tableId.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (num >= 1 && num <= 6) return "1-2";
      if (num >= 7 && num <= 12) return "3-6";
      if (num >= 13 && num <= 20) return "7-10";
    }
    if (cap >= 7) return "7-10";
    if (cap >= 3) return "3-6";
    return "1-2";
  };

  const getCapacityBadgeStyle = (range) => {
    switch (range) {
      case "1-2":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "3-6":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "7-10":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      default:
        return "bg-gray-100 text-gray-655";
    }
  };

  if (tables.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-gray-300 rounded-3xl p-10 mt-4">
        <p className="text-gray-400 font-bold text-xl uppercase tracking-widest">
          No Tables in this zone
        </p>
      </div>
    );
  }

  // แยกกลุ่มโต๊ะแบ่งโซนความจุด้วยเส้นบางๆ เพื่อจิตวิทยาการมองเห็น (UX)
  const smallTables = tables.filter(
    (t) => getCapacityRange(t.id, t.cap) === "1-2",
  );
  const mediumTables = tables.filter(
    (t) => getCapacityRange(t.id, t.cap) === "3-6",
  );
  const largeTables = tables.filter(
    (t) => getCapacityRange(t.id, t.cap) === "7-10",
  );

  const renderTableSection = (title, paxLabel, tableList) => {
    if (tableList.length === 0) return null;
    return (
      <div className="mb-8 last:mb-0">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-black text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-md uppercase tracking-wider whitespace-nowrap">
            {title} ({paxLabel})
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {tableList.map((table) => {
            const isOver2Hrs =
              table.status === "OCCUPIED" && isOverstay(table.startTime);
            const capRange = getCapacityRange(table.id, table.cap);

            return (
              <div
                key={table.id}
                onClick={() =>
                  onOpenModal(table.id, isEditMode ? "CONFIG" : "ACTION")
                }
                className={`group relative flex flex-col items-center justify-center p-4 h-32 rounded-2xl transition-all duration-300 cursor-pointer ${
                  !isEditMode && "hover:-translate-y-1"
                } ${getTableStyle(table)}`}
              >
                {!table.isOnline && (
                  <div className="absolute top-2 left-2 text-[0.65rem] opacity-60 flex items-center gap-1">
                    <WifiOff size={14} className="text-red-500" />
                  </div>
                )}

                <div className="flex flex-col items-center text-center z-0 w-full">
                  <span className="font-['Bebas_Neue'] text-3xl tracking-wider mb-1">
                    {table.id}
                  </span>

                  <div className="flex flex-col items-center gap-1 text-xs font-bold w-full">
                    {/* จำนวนคนที่โต๊ะรับได้ (1-2, 3-6, 7-10 Pax) ยังโชว์เด่นชัดเหมือนเดิม */}
                    <span
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] ${
                        table.status === "OCCUPIED"
                          ? "bg-white/20 text-white border border-transparent"
                          : getCapacityBadgeStyle(capRange)
                      }`}
                    >
                      <Users size={10} /> {capRange} Pax
                    </span>

                    {!isEditMode &&
                      table.status === "OCCUPIED" &&
                      table.startTime && (
                        <span
                          className={`flex items-center gap-1 mt-1 ${isOver2Hrs ? "text-[#e4002b]/80" : "text-gray-300"}`}
                        >
                          <Clock size={12} /> {formatTime(table.startTime)}
                        </span>
                      )}
                  </div>
                </div>

                {/* 🏷️ สติกเกอร์เหลืองจะดึงเลขไอดีจองมาแสดงผลโดยอัตโนมัติ (เช่น RES-0001) */}
                {table.status === "RESERVED" && (
                  <div className="absolute -top-3 -left-3 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border-2 bg-yellow-400 text-[#242424] border-[#242424] shadow-sm transform -rotate-6 z-0">
                    {table.reservationId || "Reserved"}
                  </div>
                )}

                {isEditMode && (
                  <div className="absolute -bottom-3 -right-3 bg-white p-2 rounded-full text-gray-500 shadow-md border border-gray-200 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-500 z-10">
                    <Settings size={18} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-white border-4 border-[#242424] rounded-3xl p-6 md:p-8 shadow-[8px_8px_0_#242424] overflow-y-auto mt-2">
      {renderTableSection("Small Tables", "1-2 PAX", smallTables)}
      {renderTableSection("Medium Tables", "3-6 PAX", mediumTables)}
      {renderTableSection("Large Tables", "7-10 PAX", largeTables)}
    </div>
  );
}
