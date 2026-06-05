import React from "react";
import { WifiOff } from "lucide-react";

export default function TableMapHeader() {
  return (
    <header className="flex justify-between items-start mb-6 gap-4 flex-wrap">
      <div className="logo-area">
        <h1 className="font-['Bebas_Neue'] text-[3rem] leading-[0.9] tracking-wide text-[#242424]">
          SERIOUS PUNCH:
          <br />
          <span className="text-[#e4002b]">TABLE MAP</span>
        </h1>
        <p className="text-[#888888] font-medium text-sm mt-2">
          Manage table status, walk-ins, and customer reservations.
        </p>
      </div>

      <div className="hidden sm:flex items-center text-xs font-bold text-gray-400 bg-white px-3 py-2.5 rounded-xl border border-gray-200 shadow-sm mt-2">
        <span className="w-4 h-4 mr-2 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
          <WifiOff size={8} className="text-gray-500" />
        </span>
        = OFFLINE (Walk-in Only)
      </div>
    </header>
  );
}
