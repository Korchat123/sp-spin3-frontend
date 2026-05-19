//มุมมองแผนผังร้าน
import React from "react";
import { Users } from "lucide-react";

const FloorPlanView = ({ tables, onOpenModal, formatTime }) => {
  return (
    <div>
      <div
        className="flex-1 overflow-x-auto overflow-y-hidden"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div
          className="relative bg-white border-[5px] border-[#242424] rounded-xl min-w-[700px] h-[520px] shadow-[10px_10px_0px_rgba(0,0,0,0.05)]"
          style={{
            backgroundImage:
              "radial-gradient(#e0e0e0 1.5px, transparent 1.5px)",
            backgroundSize: "30px 30px",
          }}
        >
          {tables.map((table) => {
            // คำนวณรูปร่าง
            const shapeClass =
              table.shape === "square"
                ? "w-[95px] h-[95px] rounded-lg"
                : table.shape === "circle"
                  ? "w-[95px] h-[95px] rounded-full"
                  : "w-[190px] h-[95px] rounded-xl"; // long

            // คำนวณสีตาม Status
            let statusStyle = "";
            if (table.status === "FREE")
              statusStyle =
                "border-4 border-dashed border-[#cccccc] bg-white/90 text-[#bbbbbb]";
            if (table.status === "OCCUPIED")
              statusStyle =
                "bg-[#e4002b] text-white border-4 border-[#e4002b] shadow-[0_6px_0px_#800018]";
            if (table.status === "BILL")
              statusStyle =
                "bg-[#e4002b] text-white animate-pulse border-4 border-[#e4002b] shadow-[0_0_15px_#e4002b]";
            if (table.status === "RESERVED")
              statusStyle =
                "bg-[#3a3a3a] text-[#aaaaaa] border-4 border-dashed border-[#555555]";

            return (
              <div
                key={table.id}
                onClick={() => onOpenModal(table.id)}
                className={`absolute flex flex-col justify-center items-center cursor-pointer transition-transform hover:scale-105 hover:z-10 font-bold ${shapeClass} ${statusStyle}`}
                style={{ left: `${table.x}%`, top: `${table.y}%` }}
              >
                <div className="text-[0.75rem] flex items-center gap-1 mb-1">
                  <Users size={12} /> {table.cap}
                </div>
                <div className="font-['Bebas_Neue'] text-3xl leading-none">
                  {table.id}
                </div>
                {table.startTime && (
                  <div className="text-[0.8rem] mt-1 font-light bg-black/20 px-2 py-0.5 rounded-full">
                    {formatTime(table.startTime)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-[0.72rem] text-[#888888] mt-2 text-center md:hidden">
        ← เลื่อนซ้าย-ขวาเพื่อดูทั้ง floor
      </p>
    </div>
  );
};

export default FloorPlanView;
