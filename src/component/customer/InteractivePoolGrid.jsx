// src/component/customer/InteractivePoolGrid.jsx
import React from "react";

export default function InteractivePoolGrid({ children }) {
  return (
    <div className="relative w-full min-h-screen bg-[#eeeeee] overflow-hidden">
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #242424 1.5px, transparent 1.5px),
            linear-gradient(to bottom, #242424 1.5px, transparent 1.5px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* เนื้อหาด้านบน */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
