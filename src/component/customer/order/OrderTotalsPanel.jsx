import React from "react";

const OrderTotalsPanel = ({ subTotal, tax, netTotal }) => {
  return (
    <div className="bg-white rounded-4xl p-6 border-4 border-[#242424] shadow-[8px_8px_0_#242424] space-y-4">
      <h2 className="text-2xl font-['Bebas_Neue'] tracking-widest uppercase border-b-2 border-[#eeeeee] pb-2 flex items-center gap-2">
        <span className="w-2.5 h-6 bg-[#e4002b] rounded-full inline-block"></span>
        3. Total Details
      </h2>

      <div className="space-y-3 text-sm font-bold text-[#242424]">
        <div className="flex justify-between">
          <span className="text-[#242424]/70">ราคารวม (Subtotal)</span>
          <span>{subTotal.toLocaleString()} THB</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#242424]/70">ภาษี (Tax 7%)</span>
          <span>{tax.toLocaleString(undefined, { maximumFractionDigits: 2 })} THB</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#242424]/70">ค่าจัดส่ง (Delivery)</span>
          <span className="text-[#DC5F00] font-black bg-[#DC5F00]/10 px-3 py-0.5 rounded-lg border border-[#DC5F00] text-[11px]">FREE</span>
        </div>
        <div className="pt-4 border-t-2 border-[#242424] flex justify-between items-end">
          <span className="font-black text-lg">ยอดชำระสุทธิ</span>
          <div className="text-right">
            <span className="block text-[9px] text-[#242424] font-['Bebas_Neue'] tracking-widest uppercase leading-none">Net Total Amount</span>
            <span className="text-3xl font-black text-[#e4002b] font-['Bebas_Neue'] tracking-wider leading-none">
              {netTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTotalsPanel;
