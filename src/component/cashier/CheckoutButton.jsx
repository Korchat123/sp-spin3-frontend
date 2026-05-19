// ปุ่มสีเทาใหญ่ๆ ด้านล่าง "CHECKOUT & PRINT RECEIPT"

// src/components/cashier/CheckoutButton.jsx
import React from "react";

const CheckoutButton = ({ onCheckout, disabled }) => {
  return (
    <button
      onClick={onCheckout}
      disabled={disabled}
      className={`
        w-full py-5 rounded-lg font-['Bebas_Neue'] text-3xl tracking-widest transition-all
        ${
          disabled
            ? "bg-[#cccccc] text-gray-500 cursor-not-allowed shadow-[0_6px_0_#999999]"
            : "bg-[#e4002b] text-white shadow-[0_6px_0_#800018] active:translate-y-1 active:shadow-[0_2px_0_#800018] hover:bg-[#cc0026] cursor-pointer"
        }
      `}
    >
      CHECKOUT & PRINT RECEIPT
    </button>
  );
};

export default CheckoutButton;
