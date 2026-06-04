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

  const getCapacityRange = (cap) => {
    if (cap >= 7) return "7-10";
    if (cap >= 3) return "3-6";
    return "1-2";
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

  return (
    <div className="flex-1 bg-white border-4 border-[#242424] rounded-3xl p-6 md:p-8 shadow-[8px_8px_0_#242424] overflow-y-auto mt-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {tables.map((table) => {
          const isOver2Hrs =
            table.status === "OCCUPIED" && isOverstay(table.startTime);

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
                  <WifiOff size={14} />
                </div>
              )}

              <div className="flex flex-col items-center text-center z-0">
                <span className="font-['Bebas_Neue'] text-3xl tracking-wider mb-1">
                  {table.id}
                </span>

                <div className="flex flex-col items-center gap-1 text-xs font-bold opacity-90">
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${isEditMode || (!table.isOnline && table.status === "FREE") ? "bg-black/5" : "bg-black/10"}`}
                  >
                    <Users size={12} /> {getCapacityRange(table.cap)}
                  </span>

                  {!isEditMode &&
                    table.status === "OCCUPIED" &&
                    table.startTime && (
                      // 💡 ปรับสีตัวอักษรเวลาให้เข้ากับพื้นหลังสีแดงจาง
                      <span
                        className={`flex items-center gap-1 mt-1 ${isOver2Hrs ? "text-[#e4002b]/80" : "text-gray-300"}`}
                      >
                        <Clock size={12} /> {formatTime(table.startTime)}
                      </span>
                    )}
                </div>
              </div>

              {table.status === "RESERVED" && (
                <div className="absolute -top-3 -left-3 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border-2 bg-yellow-400 text-[#242424] border-[#242424] shadow-sm transform -rotate-6 z-0">
                  Reserved
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
}
