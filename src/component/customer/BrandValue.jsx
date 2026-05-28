// src/component/customer/BrandValue.jsx
import React, { useState, useEffect, useRef } from "react";
import { HandFist } from "lucide-react";

export default function BrandValue() {
  const [fillPercent, setFillPercent] = useState(0);
  const sectionRef = useRef(null);

  const coreValues = [
    "Quality & Crunch",
    "Crispiness",
    "Authentic",
    "Secret Recipe",
    "Street Culture",
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // ปรับระยะให้ม่านลงมาสมูทขึ้น
      const startPoint = windowHeight * 0.8;
      const endPoint = windowHeight * 0.2;

      let percent = ((startPoint - rect.top) / (startPoint - endPoint)) * 100;
      if (percent < 0) percent = 0;
      if (percent > 100) percent = 100;

      setFillPercent(percent);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDark = fillPercent > 55;

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-32 overflow-hidden"
    >
      {/* ─── CSS สำหรับแอนิเมชันตอนกลายร่าง (สั่นกึกๆ) ─── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes mutateShake {
          0% { transform: translateX(0) scale(1); }
          20% { transform: translateX(12px) scale(1.02) rotate(-1deg); }
          40% { transform: translateX(4px) scale(1.05) rotate(1deg); }
          60% { transform: translateX(10px) scale(1.05) rotate(-0.5deg); }
          80% { transform: translateX(6px) scale(1.05) rotate(0.5deg); }
          100% { transform: translateX(8px) scale(1.05) rotate(0); }
        }
        .text-mutate {
          animation: mutateShake 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `,
        }}
      />

      {/* ─── 🎬 ม่านสีดำ ─── */}
      <div
        className="absolute top-0 left-0 w-full bg-[#242424] z-0 pointer-events-none ease-out"
        style={{ height: `${fillPercent}%` }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-12 md:mb-16">
          <h2
            className={`text-6xl md:text-4xl font-['Bebas_Neue'] tracking-wider leading-none uppercase text-left transition-colors duration-500 ${isDark ? "text-white" : "text-[#242424]"}`}
          >
            NOT JUST ANOTHER{" "}
            <div
              className={`md:text-8xl font-['Bebas_Neue'] transition-colors duration-500 ${isDark ? "text-[#e4002b]" : "text-[#DC5F00]"}`}
            >
              FRIED CHICKEN.
            </div>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          <div className="md:col-start-3 md:col-span-6 flex flex-col items-start font-['IBM_Plex_Sans_Thai']">
            <p
              className={`text-lg md:text-xl font-medium leading-relaxed mb-8 transition-colors duration-500 ${isDark ? "text-gray-300" : "text-[#242424]"}`}
            >
              Welcome to Serious Punch. We take our crunch seriously. No soggy
              skin, no boring flavors. Just perfectly seasoned, mind-blowing
              fried chicken fueled by street culture and good vibes. This is
              what makes Serious Punch life changing.
            </p>
          </div>

          <div className="md:col-start-10 md:col-span-3 font-['IBM_Plex_Sans_Thai'] font-medium">
            <ul className="flex flex-col gap-4 text-sm md:text-base">
              {coreValues.map((item, index) => (
                <li
                  key={index}
                  className={`relative flex items-center gap-3 transition-colors duration-300 ${
                    isDark ? "text-gray-200 font-bold" : "text-[#242424]"
                  }`}
                  // 🚨 เพิ่ม delay ให้ตัว Text ด้วย เพื่อให้สั่นไล่ตามกำปั้น
                  style={{
                    animationDelay: isDark ? `${index * 150}ms` : "0ms",
                  }}
                >
                  <div className="relative flex items-center justify-center w-6 h-6">
                    {/* 🚨 กำปั้นค่อยๆ เด้งไล่ระดับตาม index */}
                    <HandFist
                      strokeWidth={2.5}
                      className={`relative z-10 w-5 h-5 text-[#DC5F00] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                        isDark
                          ? "opacity-100 scale-125 rotate-15"
                          : "opacity-0 scale-50 rotate-0"
                      }`}
                      style={{
                        transitionDelay: isDark ? `${index * 150}ms` : "0ms",
                      }}
                    />
                  </div>

                  <span
                    className={`inline-block ${isDark ? "text-mutate" : ""}`}
                    // 🚨 ข้อความสั่นไล่ระดับ
                    style={{
                      animationDelay: isDark ? `${index * 150}ms` : "0ms",
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
