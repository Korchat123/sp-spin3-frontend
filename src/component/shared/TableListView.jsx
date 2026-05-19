// มุมมองแบบการ์ดรายชื่อ

import React from "react";
import { Users } from "lucide-react";

const TableListView = ({
  tables,
  statusLabel,
  shapeLabel,
  onOpenModal,
  formatTime,
}) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
      {tables.map((table) => {
        // แถบสีด้านบนการ์ด
        let topBarColor =
          table.status === "FREE"
            ? "bg-[#cccccc]"
            : table.status === "RESERVED"
              ? "bg-[#555555]"
              : "bg-[#e4002b]";

        // สีป้าย Status
        let chipClass =
          table.status === "FREE"
            ? "bg-[#eeeeee] text-[#888888]"
            : table.status === "RESERVED"
              ? "bg-[#3a3a3a] text-[#aaaaaa]"
              : "bg-[#e4002b] text-white";

        return (
          <div
            key={table.id}
            onClick={() => onOpenModal(table.id)}
            className={`bg-white border-[3px] border-[#242424] rounded-lg p-4 cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-lg relative overflow-hidden flex flex-col gap-1 ${table.status === "BILL" ? "animate-pulse" : ""}`}
          >
            <div
              className={`absolute top-0 left-0 right-0 h-[5px] ${topBarColor}`}
            ></div>
            <div className="font-['Bebas_Neue'] text-3xl leading-none text-[#242424] mt-2">
              {table.id}
            </div>
            <div className="text-[0.78rem] text-[#888888] flex items-center gap-1">
              <Users size={13} /> {table.cap} ที่นั่ง ·{" "}
              {shapeLabel[table.shape]}
            </div>
            <div
              className={`inline-block text-[0.72rem] font-bold px-3 py-[3px] rounded-full uppercase mt-1 self-start ${chipClass}`}
            >
              {statusLabel[table.status]}
            </div>
            {table.startTime && (
              <div className="text-[0.78rem] font-bold text-[#e4002b] mt-1">
                ⏱ {formatTime(table.startTime)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TableListView;
