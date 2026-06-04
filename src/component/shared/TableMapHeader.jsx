import React from "react";
import { WifiOff, Zap } from "lucide-react";

export default function TableMapHeader({ onTriggerMockBooking }) {
  return (
    <header className="flex justify-between items-start mb-6 gap-4 flex-wrap">
      <div className="logo-area">
        <h1 className="font-['Bebas_Neue'] text-[3rem] leading-[0.9] tracking-wide text-[#242424]">
          SERIOUS PUNCH:
          <br />
          <span className="text-[#e4002b]">TABLE MAP</span>
        </h1>
        <p className="text-[#888888] font-medium text-sm mt-2">
          จัดการสถานะโต๊ะและพื้นที่ภายในร้าน
        </p>
      </div>

      <div className="flex items-center gap-3 mt-2 sm:mt-0">
        {/* แสดงปุ่มจำลองจองออนไลน์เฉพาะตอนรันเซิร์ฟเวอร์พัฒนาในเครื่องตัวเอง (DEV) เท่านั้น */}
        {import.meta.env.DEV && (
          <button
            onClick={onTriggerMockBooking}
            className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-indigo-650 hover:from-purple-600 hover:to-indigo-750 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all shadow-sm hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            title="ปุ่มนี้จะหายไปอัตโนมัติเมื่อทำการ Build/Deploy จริง"
          >
            <Zap size={14} />
            <span>จำลองจองออนไลน์ (Dev Only)</span>
          </button>
        )}

        {/* ป้าย Offline */}
        <div className="hidden sm:flex items-center text-xs font-bold text-gray-400 bg-white px-3 py-2.5 rounded-xl border border-gray-200 shadow-sm">
          <span className="w-4 h-4 mr-2 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
            <WifiOff size={8} className="text-gray-500" />
          </span>
          = OFFLINE (Walk-in Only)
        </div>
      </div>
    </header>
  );
}
