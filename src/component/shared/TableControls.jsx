// ปุ่มสลับ Tab และเปลี่ยนมุมมอง
import React from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, Rows3 } from "lucide-react";

const TableControls = ({ currentFilter, setFilter, currentView, setView }) => {
  const filters = [
    { id: "ALL", label: "All" },
    { id: "FREE", label: "Available" },
    { id: "OCCUPIED", label: "Occupied" },
    { id: "BILL", label: "Bill" },
    { id: "RESERVED", label: "Reserved" },
  ];

  return (
    <>
      <div className="flex justify-between items-center flex-wrap gap-3 mb-5">
        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`border-2 border-[#242424] px-4 py-2 font-bold uppercase text-[0.85rem] transition-colors ${
                currentFilter === f.id
                  ? "bg-[#242424] text-white"
                  : "bg-white text-[#242424]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Date Tabs */}
        <div className="flex gap-2">
          <button className="bg-white border-2 border-[#242424] px-3 py-2 flex items-center justify-center">
            <ChevronLeft size={16} />
          </button>
          <div className="bg-[#e4002b] border-2 border-[#e4002b] text-white px-4 py-2 font-bold">
            9 APR
          </div>
          <button className="bg-white border-2 border-[#242424] px-3 py-2 flex items-center justify-center">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* View Toggles */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView("floor")}
          className={`border-2 border-[#242424] px-3 py-2 font-bold text-xs uppercase flex items-center gap-2 transition-colors ${
            currentView === "floor"
              ? "bg-[#242424] text-white"
              : "bg-white text-[#242424]"
          }`}
        >
          <LayoutGrid size={15} /> Floor Plan
        </button>
        <button
          onClick={() => setView("list")}
          className={`border-2 border-[#242424] px-3 py-2 font-bold text-xs uppercase flex items-center gap-2 transition-colors ${
            currentView === "list"
              ? "bg-[#242424] text-white"
              : "bg-white text-[#242424]"
          }`}
        >
          <Rows3 size={15} /> List
        </button>
      </div>
    </>
  );
};

export default TableControls;
