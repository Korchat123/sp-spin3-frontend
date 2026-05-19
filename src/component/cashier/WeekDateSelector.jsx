// แถบเลือกวันที่ด้านบน ที่มีปุ่มซ้ายขวา และปฏิทิน
// ทำหน้าที่แค่ส่งค่า "วันที่ถูกเลือก" กลับไปให้หน้าหลัก

import React from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const WeekDateSelector = ({ selectedDate, setSelectedDate }) => {
  // จำลองข้อมูล 1 สัปดาห์ (สมมติว่าเป็นวันที่ 1-7 พ.ค.)
  const weekDays = [
    { day: "MON", date: 1 },
    { day: "TUE", date: 2 },
    { day: "WED", date: 3 },
    { day: "THU", date: 4 }, // สมมติให้วันนี้เป็นวันที่ 4
    { day: "FRI", date: 5 },
    { day: "SAT", date: 6 },
    { day: "SUN", date: 7 },
  ];

  return (
    <div className="flex items-center justify-between bg-white border-2 border-[#cccccc] rounded-lg p-2 mb-6">
      <button className="p-2 text-[#888888] hover:text-[#242424] hover:bg-[#eeeeee] rounded transition-colors">
        <ChevronLeft size={24} />
      </button>

      <div className="flex flex-1 justify-center gap-2 md:gap-4 overflow-x-auto px-4">
        {weekDays.map((d) => (
          <button
            key={d.date}
            onClick={() => setSelectedDate(d.date)}
            className={`flex flex-col items-center justify-center min-w-14 py-2 rounded-md transition-all ${
              selectedDate === d.date
                ? "bg-[#242424] text-white shadow-md" // วันที่เลือก (สีดำ)
                : "bg-transparent text-[#888888] hover:bg-[#eeeeee] hover:text-[#242424]" // วันอื่นๆ (สีเทา)
            }`}
          >
            <span className="text-[0.7rem] font-bold">{d.day}</span>
            <span className="text-xl font-['Bebas_Neue'] leading-none mt-1">
              {d.date}
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="p-2 text-[#888888] hover:text-[#242424] hover:bg-[#eeeeee] rounded transition-colors">
          <ChevronRight size={24} />
        </button>
        <div className="w-0.5 bg-[#cccccc] mx-1 my-2"></div>
        <button
          className="p-2 text-[#888888] hover:text-[#242424] hover:bg-[#eeeeee] rounded transition-colors"
          title="ดูปฏิทินย้อนหลัง"
        >
          <Calendar size={24} />
        </button>
      </div>
    </div>
  );
};

export default WeekDateSelector;
