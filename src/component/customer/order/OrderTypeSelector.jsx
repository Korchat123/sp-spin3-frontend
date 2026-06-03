import React from "react";
import { Bike, Store, Utensils } from "lucide-react";

const OrderTypeSelector = ({ eatType, setEatType }) => {
  const buttons = [
    { key: "delivery", icon: Bike, label: "DELIVERY" },
    { key: "pickup", icon: Store, label: "PICK-UP" },
    { key: "reserve", icon: Utensils, label: "RESERVE" }
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {buttons.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => setEatType(key)}
          className={`py-3 px-1 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 font-bold border-2 border-[#242424] cursor-pointer
            ${eatType === key 
              ? "bg-[#DC5F00] text-white shadow-[4px_4px_0_#242424] -translate-y-1" 
              : "bg-[#333333] text-gray-400 opacity-80 hover:bg-[#444] hover:opacity-100"}`}
        >
          <Icon size={20} className={eatType === key ? "animate-bounce" : ""} />
          <span className="font-['Bebas_Neue'] text-lg tracking-wider">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default OrderTypeSelector;
