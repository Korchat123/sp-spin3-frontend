// ส่วนที่กรอกเงินที่รับมา และปุ่มลัดอย่าง +100, +500

// src/components/cashier/CashCalculator.jsx
import React from "react";

const CashCalculator = ({
  paymentType,
  payAmount,
  setPayAmount,
  finalTotal,
  changeAmount,
}) => {
  const isCash = paymentType === "CASH";

  const handleQuickCash = (amount) => {
    if (amount === "exact") {
      setPayAmount(finalTotal);
    } else {
      setPayAmount((prev) => (Number(prev) || 0) + amount);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Input Section */}
      <div className="bg-[#242424] p-4 rounded-lg flex flex-col gap-2">
        <div className="flex flex-col items-end text-white w-full">
          <span className="text-xs text-[#aaaaaa] mb-1">
            {isCash
              ? "CUSTOMER PAY (CASH)"
              : `EXACT AMOUNT (${paymentType} PAY)`}
          </span>
          <div className="flex items-center gap-2 w-full justify-end border-b-2 border-transparent focus-within:border-[#e4002b] transition-colors pb-1">
            <span className="text-3xl font-mono">฿</span>
            <input
              type="number"
              className={`
                bg-transparent border-none text-white text-4xl font-mono text-right w-full outline-none
                ${!isCash ? "text-[#28a745]" : ""}
              `}
              placeholder="0.00"
              value={payAmount || ""}
              onChange={(e) => setPayAmount(e.target.value)}
              readOnly={!isCash}
            />
          </div>
        </div>

        {/* Quick Cash Grid - Only show if CASH */}
        {isCash && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            <button
              onClick={() => handleQuickCash("exact")}
              className="bg-[#28a745] text-white border border-[#1e7e34] py-2 rounded font-bold hover:bg-[#218838]"
            >
              Exact
            </button>
            <button
              onClick={() => handleQuickCash(100)}
              className="bg-[#3a3a3a] text-white border border-[#555] py-2 rounded font-bold hover:bg-[#4a4a4a]"
            >
              +100
            </button>
            <button
              onClick={() => handleQuickCash(500)}
              className="bg-[#3a3a3a] text-white border border-[#555] py-2 rounded font-bold hover:bg-[#4a4a4a]"
            >
              +500
            </button>
            <button
              onClick={() => handleQuickCash(1000)}
              className="bg-[#3a3a3a] text-white border border-[#555] py-2 rounded font-bold hover:bg-[#4a4a4a]"
            >
              +1000
            </button>
          </div>
        )}
      </div>

      {/* Change Box */}
      <div className="bg-[#d4edda] border-2 border-[#28a745] p-4 rounded-lg flex justify-between items-center text-[#28a745] font-bold">
        <span className="text-sm">TOTAL RETURN</span>
        <span className="text-2xl">
          ฿
          {changeAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
};

export default CashCalculator;
