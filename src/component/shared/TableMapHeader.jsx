// ส่วนหัวและสรุปจำนวนโต๊ะ
import React from "react";

const TableMapHeader = ({ freeCount, occCount }) => {
  return (
    <header className="flex justify-between items-start mb-6 gap-4 flex-wrap">
      <div className="logo-area">
        <h1 className="font-['Bebas_Neue'] text-[3rem] leading-[0.9] tracking-wide">
          SERIOUS PUNCH:
          <br />
          <span className="text-[#e4002b]">TABLE MAP</span>
        </h1>
      </div>
      <div className="flex gap-3 flex-wrap">
        <div className="bg-[#242424] text-white py-3 px-5 rounded font-bold flex items-center gap-2 border-b-4 border-[#e4002b] text-sm">
          FREE: <span>{freeCount}</span>
        </div>
        <div className="bg-[#242424] text-white py-3 px-5 rounded font-bold flex items-center gap-2 border-b-4 border-[#555555] text-sm">
          OCCUPIED: <span>{occCount}</span>
        </div>
      </div>
    </header>
  );
};

export default TableMapHeader;
