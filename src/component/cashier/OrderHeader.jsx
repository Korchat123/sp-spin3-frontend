// ส่วนบนที่โชว์ #SP-8829 และ DINE-IN: T-02
// src/components/cashier/OrderHeader.jsx

import React from "react";

const OrderHeader = ({ orderNo, tableType, dateStr }) => {
  return (
    <header className="flex justify-between items-center mb-5">
      <div className="bg-[#242424] text-white py-4 px-8 rounded-md flex gap-10 border-l-[6px] border-[#e4002b]">
        <div>
          <span className="text-[#888888] text-sm uppercase">Order No.</span>
          <h2 className="font-['Bebas_Neue'] text-3xl tracking-wider m-0">
            {orderNo}
          </h2>
        </div>
        <div>
          <span className="text-[#888888] text-sm uppercase">Type / Table</span>
          <h2 className="font-['Bebas_Neue'] text-3xl tracking-wider m-0">
            {tableType}
          </h2>
        </div>
      </div>
      <div className="font-['Bebas_Neue'] text-2xl">{dateStr}</div>
    </header>
  );
};

export default OrderHeader;
