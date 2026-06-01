import React from "react";
import { LayoutGrid, Map, Settings, Plus } from "lucide-react"; // 👈 นำเข้าไอคอน Plus

export default function TableControls({
  currentZone,
  setZone,
  currentFilter,
  setFilter,
  currentView,
  setView,
  isEditMode,
  setIsEditMode,
  onAddTable, // 👈 รับฟังก์ชันมาจาก TableMap
}) {
  const zones = ["ALL", "INDOOR", "OUTDOOR"];
  const filters = ["ALL", "FREE", "OCCUPIED", "BILL", "RESERVED"];

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-2 rounded-2xl border-2 border-gray-200 shadow-sm">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-full md:w-auto">
          {zones.map((zone) => (
            <button
              key={zone}
              onClick={() => setZone(zone)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold tracking-wider transition-all cursor-pointer ${
                currentZone === zone
                  ? "bg-[#242424] text-white shadow-md"
                  : "text-gray-500 hover:text-[#242424] hover:bg-gray-200"
              }`}
            >
              {zone}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end px-2">
          <button
            onClick={() => setView("floor")}
            title="Grid View"
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              currentView === "floor"
                ? "bg-[#e4002b] text-white shadow-md"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <LayoutGrid size={20} />
          </button>

          <div className="relative mt-1 md:mt-0">
            <span className="absolute -top-3 right-1 text-[9px] font-black text-gray-300 uppercase tracking-widest bg-white px-1">
              Phase 2
            </span>
            <button
              onClick={() => setView("visual")}
              title="Interactive Blueprint Prototype"
              className={`p-1.5 px-3 rounded-lg flex items-center gap-2 border-2 cursor-pointer transition-none ${
                currentView === "visual"
                  ? "bg-gray-600 text-white border-gray-600 shadow-md"
                  : "bg-gray-50 text-gray-400 border-dashed border-gray-300"
              }`}
            >
              <Map size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">
                Table Map
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2 transition-all cursor-pointer ${
                currentFilter === f
                  ? "border-[#242424] bg-[#242424] text-white shadow-[3px_3px_0_#e4002b]"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
          <div className="relative">
            <span className="absolute -top-3 right-2 text-[9px] font-black text-gray-400 uppercase tracking-widest bg-[#eeeeee] px-1 z-10">
              Phase 2
            </span>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex flex-1 lg:flex-none items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-none ${
                isEditMode
                  ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-300 shadow-md"
                  : "bg-transparent text-gray-400 border-2 border-dashed border-gray-300 opacity-80"
              }`}
            >
              <Settings
                size={16}
                className={isEditMode ? "animate-spin-slow" : ""}
              />
              {isEditMode ? "EXIT EDIT MODE" : "EDIT TABLES"}
            </button>
          </div>

          {/* 👈 ปุ่ม ADD NEW โผล่มาเฉพาะตอนอยู่ใน Edit Mode */}
          {isEditMode && (
            <button
              onClick={onAddTable}
              className="flex items-center justify-center gap-1 bg-[#242424] hover:bg-[#e4002b] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer animate-in fade-in slide-in-from-right-4 shadow-sm"
            >
              <Plus size={16} /> ADD NEW
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
