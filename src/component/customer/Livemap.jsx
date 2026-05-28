import React, { useState, useEffect } from 'react';

// ---------------------------------------------------------
// 1. Component: แผนที่จำลอง (LiveMap)
// ---------------------------------------------------------
const LiveMap = () => {
  return (
    <div className="w-[65%] relative bg-[#E8EAED] flex items-center justify-center overflow-hidden border-r border-gray-200">
      {/* ปุ่มกลับหน้าหลัก */}
      <button className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full shadow-md text-gray-700 font-semibold hover:bg-gray-50 flex items-center gap-2 z-30">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        กลับหน้าหลัก
      </button>

      {/* เส้นทางจำลอง */}
      <svg className="absolute w-full h-full z-10">
        <path d="M 200,200 Q 400,300 500,600 T 700,800" fill="transparent" stroke="#4A90E2" strokeWidth="5" strokeDasharray="10 10" />
      </svg>
      
      {/* พินบนแผนที่ */}
      <div className="absolute top-[20%] left-[25%] bg-white p-3 rounded-full shadow-lg z-20 text-3xl">🏪</div>
      <div className="absolute top-[55%] left-[55%] bg-orange-500 text-white p-3 rounded-full shadow-lg z-30 text-3xl border-4 border-white animate-bounce">🛵💨</div>
      <div className="absolute bottom-[20%] right-[25%] bg-white p-3 rounded-full shadow-lg z-20 text-3xl">🏠</div>
    </div>
  );
};
