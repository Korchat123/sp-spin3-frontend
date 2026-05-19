// ส่วนสีขาวด้านขวาที่โชว์ Subtotal, VAT และยอดรวมสีแดง

// src/components/cashier/BillingSummary.jsx
import React from "react";

const BillingSummary = ({
  rawSubtotal,
  discountAmount,
  scAmount,
  taxAmount,
  finalTotal,
}) => {
  return (
    <div className="bg-white border-[3px] border-[#242424] p-5 rounded-lg">
      <div className="flex justify-between mb-2 text-lg text-[#555]">
        <span>Subtotal</span>
        <span>
          ฿{rawSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>

      {discountAmount > 0 && (
        <div className="flex justify-between mb-2 text-lg text-[#e4002b]">
          <span>Discount</span>
          <span>
            -฿
            {discountAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      )}

      {scAmount > 0 && (
        <div className="flex justify-between mb-2 text-lg text-[#555]">
          <span>Service Charge</span>
          <span>
            ฿{scAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      )}

      <div className="flex justify-between mb-2 text-lg text-[#555]">
        <span>VAT (7%)</span>
        <span>
          ฿{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="flex justify-between mt-4 pt-4 border-t-2 border-dashed border-[#ccc] font-['Bebas_Neue'] text-4xl text-[#e4002b]">
        <span>Total Amount</span>
        <span>
          ฿{finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
};

export default BillingSummary;
