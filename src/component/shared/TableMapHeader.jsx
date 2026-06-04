import React from "react";
import { WifiOff } from "lucide-react"; // 💡 เอา AlertCircle ออกด้วยเพราะไม่ได้ใช้แล้ว

const TableMapHeader = () => {
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

      <div className="flex flex-col items-end gap-3 mr-16">
        <div className="hidden sm:flex items-center text-xs font-bold text-gray-400 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
          <span className="w-4 h-4 mr-2 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
            <WifiOff size={8} className="text-gray-500" />
          </span>
          = OFFLINE (Walk-in Only)
        </div>
      </div>
    </header>
  );
};

export default TableMapHeader;
