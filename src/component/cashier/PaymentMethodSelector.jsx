// src/components/cashier/PaymentMethodSelector.jsx
import { Coins, QrCode, CreditCard } from "lucide-react";

const PaymentMethodSelector = ({ selectedMethod, onSelectMethod }) => {
  // 💡 เพิ่มคุณสมบัติ disabled เข้าไปล็อคปุ่ม QR กับ CARD
  const methods = [
    { id: "CASH", label: "CASH", icon: Coins, disabled: false },
    { id: "QR", label: "QR PAY", icon: QrCode, disabled: true },
    { id: "CARD", label: "CARD", icon: CreditCard, disabled: true },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {methods.map((method) => {
        const Icon = method.icon;
        const isActive = selectedMethod === method.id;

        return (
          <button
            key={method.id}
            type="button"
            disabled={method.disabled} // สั่ง HTML ให้ปิดการทำงานปุ่มนี้
            onClick={() => !method.disabled && onSelectMethod(method.id)}
            className={`
              flex flex-col items-center gap-1 p-4 rounded-xl border-2 font-bold transition-all
              ${
                isActive
                  ? "bg-[#242424] border-[#242424] text-white shadow-md" // สีดำเมื่อถูกเลือก
                  : method.disabled
                    ? "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed" // สีเทาและเมาส์เป็นรูปกากบาทเมื่อกดไม่ได้
                    : "bg-white border-gray-200 text-[#242424] hover:border-[#242424]" // ปกติเป็นสีขาว ขอบเทา (ถ้าเอาเมาส์ชี้ขอบจะดำ)
              }
            `}
          >
            <Icon size={24} />
            <span className="text-xs uppercase tracking-wider">
              {method.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default PaymentMethodSelector;
