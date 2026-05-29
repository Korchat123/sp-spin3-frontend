import React, { useRef, useState } from "react";
import { Users, Settings, Move } from "lucide-react";

export default function VisualFloorPlan({
  tables,
  isEditMode,
  onOpenModal,
  onUpdatePosition,
}) {
  const containerRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);

  const getShapeStyle = (cap) => {
    if (cap >= 7)
      return { classes: "w-[140px] h-[80px] rounded-2xl", label: "7-10" };
    if (cap >= 3)
      return { classes: "w-[80px] h-[80px] rounded-2xl", label: "3-6" };
    return { classes: "w-[80px] h-[80px] rounded-full", label: "1-2" };
  };

  const handlePointerDown = (e, id) => {
    if (!isEditMode) return;
    e.target.setPointerCapture(e.pointerId);
    setDraggingId(id);
  };

  const handlePointerMove = (e) => {
    if (!draggingId || !containerRef.current || !isEditMode) return;
    const rect = containerRef.current.getBoundingClientRect();
    let newX = ((e.clientX - rect.left) / rect.width) * 100;
    let newY = ((e.clientY - rect.top) / rect.height) * 100;

    newX = Math.max(8, Math.min(92, newX));
    newY = Math.max(10, Math.min(90, newY));
    onUpdatePosition(draggingId, newX, newY);
  };

  const handlePointerUp = () => setDraggingId(null);

  return (
    <div className="w-full mt-2">
      <div
        className="flex-1 overflow-x-auto overflow-y-hidden rounded-3xl pb-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative bg-[#f8f9fa] border-4 border-[#e5e7eb] rounded-xl min-w-200 h-150 touch-none overflow-hidden"
          style={{
            backgroundImage: "radial-gradient(#d1d5db 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          {/* ลายน้ำบอก Phase 2 แบบเนียนๆ ไม่เกะกะสายตา */}
          <div className="absolute top-6 left-6 z-0 pointer-events-none select-none">
            <span className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] border border-gray-300 px-2 py-1 rounded opacity-50">
              Phase 2: Prototype
            </span>
          </div>

          <div className="absolute top-10 left-0 w-[60%] flex justify-center z-0 pointer-events-none select-none">
            <span className="text-gray-300 font-black text-6xl opacity-30 uppercase tracking-[0.2em]">
              Indoor
            </span>
          </div>
          <div className="absolute top-10 right-0 w-[40%] flex justify-center z-0 pointer-events-none select-none">
            <span className="text-gray-300 font-black text-6xl opacity-30 uppercase tracking-[0.2em]">
              Outdoor
            </span>
          </div>

          <div className="absolute top-0 left-[60%] w-0.5 h-full border-r-2 border-dashed border-gray-300 z-0 pointer-events-none" />

          {tables.map((table) => {
            const shape = getShapeStyle(table.cap);
            const tableStyle =
              draggingId === table.id
                ? "bg-gray-200 border-gray-400 z-50 shadow-xl scale-105 cursor-grabbing"
                : isEditMode
                  ? "bg-white/80 border-dashed border-gray-400 text-gray-500 hover:border-gray-500 z-10 cursor-grab"
                  : "bg-transparent border-dashed border-gray-300 text-gray-300 z-10 pointer-events-none";

            return (
              <div
                key={table.id}
                onPointerDown={(e) => handlePointerDown(e, table.id)}
                className={`absolute flex flex-col justify-center items-center border-2 transition-all duration-200 group ${shape.classes} ${tableStyle}`}
                style={{
                  left: `${table.x}%`,
                  top: `${table.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {isEditMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenModal(table.id, "CONFIG");
                    }}
                    className="absolute -top-3 -right-3 bg-white p-1.5 rounded-full text-gray-400 border border-gray-300 hover:scale-110 hover:bg-gray-100 hover:text-gray-600 transition-all z-20 shadow-sm cursor-pointer"
                  >
                    <Settings size={14} />
                  </button>
                )}

                <div className="text-[0.65rem] flex items-center gap-1 mb-0.5 font-bold opacity-70">
                  <Users size={12} /> {shape.label}
                </div>
                <div className="font-['Bebas_Neue'] text-2xl md:text-3xl tracking-wider leading-none">
                  {table.id}
                </div>

                {isEditMode && (
                  <div className="text-[8px] font-bold text-gray-400 flex items-center gap-1 mt-1 opacity-60">
                    <Move size={10} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[0.7rem] text-gray-400 mt-1 text-center md:hidden font-bold tracking-wider opacity-60">
        ← เลื่อนซ้าย-ขวาเพื่อดูพื้นที่ทั้งหมด →
      </p>
    </div>
  );
}
