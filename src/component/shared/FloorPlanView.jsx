// src/component/shared/FloorPlanView.jsx
import React from "react";
import { Users, Clock, Settings } from "lucide-react";

export default function FloorPlanView({
  tables,
  isEditMode,
  onOpenModal,
  formatTime,
}) {
  // 🎨 Color Psychology (ใช้เฉพาะโหมดปกติ)
  const getTableStyle = (status) => {
    switch (status) {
      case "FREE":
        return "bg-white border-gray-200 text-[#242424] hover:border-[#242424] shadow-sm";
      case "OCCUPIED":
        return "bg-[#e4002b] border-[#e4002b] text-white shadow-md";
      case "BILL":
        return "bg-red-50 border-[#e4002b] text-[#e4002b] animate-pulse shadow-[0_0_15px_rgba(228,0,43,0.4)]";
      case "RESERVED":
        return "bg-[#242424] border-[#242424] text-white shadow-md opacity-95";
      default:
        return "bg-gray-100 border-gray-200 text-gray-400";
    }
  };

  // 👈 ลบ 11+ ออก เหลือแค่ขนาดโต๊ะจริงที่มีในร้าน
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
          const isOccupiedOrBill =
            table.status === "OCCUPIED" || table.status === "BILL";

          return (
            <div
              key={table.id}
              onClick={() =>
                onOpenModal(table.id, isEditMode ? "CONFIG" : "ACTION")
              }
              className={`group relative flex flex-col items-center justify-center p-4 h-32 rounded-2xl border-4 transition-all duration-300 cursor-pointer ${
                isEditMode
                  ? "border-dashed border-gray-300 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:border-gray-400"
                  : `hover:-translate-y-1 ${getTableStyle(table.status)}`
              }`}
            >
              {/* ข้อมูลภายในโต๊ะ */}
              <div className="flex flex-col items-center text-center z-0">
                <span className="font-['Bebas_Neue'] text-3xl tracking-wider mb-1">
                  {table.id}
                </span>

                <div className="flex flex-col items-center gap-1 text-xs font-bold opacity-90">
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors ${
                      isEditMode
                        ? "bg-gray-200 text-gray-500" // โหมดเทา
                        : "bg-black/10" // 👈 คลีนๆ สีเดียวกันหมด
                    }`}
                  >
                    <Users size={12} /> {getCapacityRange(table.cap)}
                  </span>

                  {/* ซ่อนเวลาตอนอยู่ในโหมด Edit */}
                  {!isEditMode && isOccupiedOrBill && table.startTime && (
                    <span className="flex items-center gap-1 mt-1">
                      <Clock size={12} /> {formatTime(table.startTime)}
                    </span>
                  )}
                </div>
              </div>

              {/* ป้ายกำกับสถานะจอง */}
              {table.status === "RESERVED" && (
                <div
                  className={`absolute -top-3 -left-3 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border-2 shadow-sm transform -rotate-6 z-0 transition-colors ${
                    isEditMode
                      ? "bg-gray-200 text-gray-400 border-gray-300 shadow-none" // โหมดเทา
                      : "bg-yellow-400 text-[#242424] border-[#242424]"
                  }`}
                >
                  Reserved
                </div>
              )}

              {/* 🛠️ เฟืองสำหรับ Edit Mode */}
              {isEditMode && (
                <div className="absolute -bottom-3 -right-3 bg-gray-50 p-2 rounded-full text-gray-400 border-2 border-dashed border-gray-300 transition-all duration-300 group-hover:scale-110 group-hover:bg-gray-200 group-hover:border-gray-400 group-hover:text-gray-600 z-10">
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
