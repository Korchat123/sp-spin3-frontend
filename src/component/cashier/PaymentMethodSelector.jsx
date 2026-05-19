//ปุ่มเลือกช่องทางชำระ (CASH, QR PAY, CARD)

// src/components/cashier/PaymentMethodSelector.jsx
import React from "react";
import { Coins, QrCode, CreditCard } from "lucide-react";

const PaymentMethodSelector = ({ selectedMethod, onSelectMethod }) => {
  const methods = [
    { id: "CASH", label: "CASH", icon: Coins },
    { id: "QR", label: "QR PAY", icon: QrCode },
    { id: "CARD", label: "CARD", icon: CreditCard },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {methods.map((method) => {
        const Icon = method.icon;
        const isActive = selectedMethod === method.id;

        return (
          <button
            key={method.id}
            onClick={() => onSelectMethod(method.id)}
            className={`
              flex flex-col items-center gap-1 p-4 border-2 border-[#242424] rounded font-bold transition-colors
              ${isActive ? "bg-[#242424] text-white" : "bg-white text-[#242424] hover:bg-gray-100"}
            `}
          >
            <Icon size={24} />
            {method.label}
          </button>
        );
      })}
    </div>
  );
};

export default PaymentMethodSelector;
