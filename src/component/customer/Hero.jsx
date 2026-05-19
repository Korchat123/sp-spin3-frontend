import React, { useState, useEffect } from "react";

export default function Hero() {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // เลื่อนลงมาเกิน 150px ถึงจะกางเต็มจอ
      if (window.scrollY > 150) {
        setIsExpanded(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full bg-[#242424] flex flex-col items-center justify-center pt-8 pb-24 relative overflow-hidden">
      {/* ─── Hero Text ─── */}
      <h1 className="text-7xl md:text-[140px] font-['Bebas_Neue'] font-black text-[#eeeeee] leading-[0.85] tracking-widest text-center mb-12 uppercase z-10 px-4 mt-8">
        SERIOUSLY. <br />
        <span className="text-[#e4002b] inline-block hover:-translate-y-2 hover:drop-shadow-[0_4px_0_#800018] transition-all duration-300 cursor-default">
          GOOD.
        </span>{" "}
        CHICKEN.
      </h1>

      {/* ─── Image Container ─── */}
      <div
        // เอาคลาส group ออกไปแล้ว เพื่อไม่ให้มันส่งสัญญาณ Hover ไปที่รูป
        className={`h-100 md:h-[70vh] bg-[#1c1c1c] relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-y border-white/5 overflow-hidden transition-all duration-1200 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isExpanded
            ? "w-full max-w-full rounded-none" // ตอนขยาย: กางเต็ม 100% ขอบเหลี่ยม นิ่งๆ
            : "w-[90%] md:w-[85%] max-w-350 rounded-4xl md:rounded-[3rem]" // ตอนโหลดครั้งแรก
        }`}
      >
        <img
          src="/images/hero-1.png"
          alt="Serious Punch Hero"
          // เอา hover:scale-105 ออกไปแล้ว ภาพจะอยู่นิ่งๆ ทรงพลัง
          className="w-full h-full object-cover grayscale-20] contrast-110 brightness-90"
        />
      </div>
    </section>
  );
}
