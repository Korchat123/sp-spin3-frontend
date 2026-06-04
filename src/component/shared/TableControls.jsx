import React from "react";
import { LayoutGrid, Map, Settings, Plus } from "lucide-react";

export default function TableControls({
  currentZone,
  setZone,
  currentFilter,
  setFilter,
  currentView,
  setView,
  isEditMode,
  setIsEditMode,
  onAddTable,
  counts,
}) {
  const zones = ["ALL", "INDOOR", "OUTDOOR"];

  const filterConfigs = [
    {
      id: "ALL",
      label: "ALL",
      colorDot: "bg-gray-300",
      count: counts?.total || 0,
    },
    {
      id: "FREE",
      label: "FREE",
      colorDot: "bg-white border-2 border-gray-300",
      count: counts?.free || 0,
    },
    {
      id: "OCCUPIED",
      label: "OCCUPIED",
      colorDot: "bg-[#242424]",
      count: counts?.occ || 0,
    },
    {
      id: "RESERVED",
      label: "RESERVED",
      colorDot: "bg-yellow-400",
      count: counts?.res || 0,
    },
    {
      id: "OVERSTAY",
      label: "OVERSTAY",
      colorDot: "bg-[#e4002b] animate-pulse",
      count: counts?.over || 0,
    },
  ];

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl w-full md:w-auto">
          {zones.map((zone) => (
            <button
              key={zone}
              onClick={() => setZone(zone)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold tracking-wider transition-all cursor-pointer ${
                currentZone === zone
                  ? "bg-[#242424] text-white shadow-sm"
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
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              currentView === "floor"
                ? "bg-[#e4002b] text-white shadow-sm"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <LayoutGrid size={20} />
          </button>

          {/* 💡 ใส่ป้าย Phase 2 สำหรับ Table Map Visual */}
          <div className="relative mt-1 md:mt-0">
            <span className="absolute -top-3 right-1 text-[9px] font-black text-gray-300 uppercase tracking-widest bg-white px-1 z-10">
              Phase 2
            </span>
            <button
              onClick={() => setView("visual")}
              className={`p-1.5 px-3 rounded-xl flex items-center gap-2 border-2 cursor-pointer transition-colors ${
                currentView === "visual"
                  ? "bg-gray-600 text-white border-gray-600 shadow-sm"
                  : "bg-gray-50 text-gray-400 border-dashed border-gray-200 hover:border-gray-300"
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

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        {/* 💡 เอาคำอธิบาย OFFLINE ออกไปแล้ว ทำให้แถบ Filter คลีนขึ้นเยอะ */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm w-full xl:w-auto">
          {filterConfigs.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                currentFilter === f.id
                  ? "bg-gray-100 text-[#242424] shadow-inner"
                  : "bg-transparent text-gray-500 hover:bg-gray-50"
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${f.colorDot}`}></span>
              {f.label}
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${currentFilter === f.id ? "bg-[#242424] text-white" : "bg-gray-200 text-gray-500"}`}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto mt-2 xl:mt-0">
          {/* 💡 ใส่ป้าย Phase 2 สำหรับ Edit Tables! */}
          <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
            <span className="absolute -top-3 right-2 text-[9px] font-black text-gray-400 uppercase tracking-widest bg-[#eeeeee] px-1 z-10">
              Phase 2
            </span>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-all ${
                isEditMode
                  ? "bg-yellow-50 text-yellow-700 border border-yellow-300 shadow-sm"
                  : "bg-white text-gray-400 border border-dashed border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Settings
                size={16}
                className={isEditMode ? "animate-spin-slow" : ""}
              />
              {isEditMode ? "EXIT EDIT MODE" : "EDIT TABLES"}
            </button>
          </div>

          {isEditMode && (
            <button
              onClick={onAddTable}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-[#242424] hover:bg-[#e4002b] text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer shadow-sm"
            >
              <Plus size={16} strokeWidth={3} /> ADD NEW
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
