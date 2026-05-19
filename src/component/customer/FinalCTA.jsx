// src/component/customer/FinalCTA.jsx
import React, { useEffect, useRef, useState } from "react";
import { Pointer } from "lucide-react";

export default function FinalCTA() {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);

  // เปลี่ยนเป็น Sprinkles (สปริงเกิล) ทรงเรียวยาว สีพาสเทล
  const sprinkles = [
    {
      color: "bg-[#FDE68A]",
      size: "w-6 h-1.5 md:w-8 md:h-2",
      pos: "top-[15%] left-[10%]",
      delay: "0s",
      angle: 15,
    },
    {
      color: "bg-[#FBCFE8]",
      size: "w-7 h-1.5 md:w-9 md:h-2",
      pos: "top-[25%] left-[80%]",
      delay: "1s",
      angle: -45,
    },
    {
      color: "bg-[#A7F3D0]",
      size: "w-5 h-1.5 md:w-6 md:h-1.5",
      pos: "top-[70%] left-[15%]",
      delay: "2s",
      angle: 60,
    },
    {
      color: "bg-[#e2bee2]",
      size: "w-8 h-1.5 md:w-10 md:h-2",
      pos: "top-[60%] left-[85%]",
      delay: "0.5s",
      angle: -20,
    },
    {
      color: "bg-[#fff59d]",
      size: "w-6 h-1.5 md:w-7 md:h-2",
      pos: "top-[85%] left-[50%]",
      delay: "1.5s",
      angle: 80,
    },
    {
      color: "bg-[#FFDAB9]",
      size: "w-7 h-1.5 md:w-8 md:h-2",
      pos: "top-[20%] left-[45%]",
      delay: "2.5s",
      angle: -60,
    },
    {
      color: "bg-[#FBCFE8]",
      size: "w-5 h-1.5 md:w-6 md:h-1.5",
      pos: "top-[80%] left-[75%]",
      delay: "0.8s",
      angle: 30,
    },
    {
      color: "bg-[#A7F3D0]",
      size: "w-8 h-1.5 md:w-9 md:h-2",
      pos: "top-[35%] left-[20%]",
      delay: "1.2s",
      angle: -10,
    },
    {
      color: "bg-[#FDE68A]",
      size: "w-6 h-1.5 md:w-7 md:h-1.5",
      pos: "top-[10%] left-[60%]",
      delay: "0.3s",
      angle: 45,
    },
    {
      color: "bg-[#e2bee2]",
      size: "w-7 h-1.5 md:w-9 md:h-2",
      pos: "top-[50%] left-[5%]",
      delay: "1.8s",
      angle: -75,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const totalDistance = windowHeight + rect.height;
      const scrolled = windowHeight - rect.top;

      let p = scrolled / totalDistance;
      p = Math.max(0, Math.min(1, p));
      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full relative py-12 px-4 md:px-8 z-10 flex justify-center overflow-visible">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes hand-shake {
          0%, 100% { transform: rotate(-12deg) scale(1.1); }
          25% { transform: rotate(-30deg) scale(1.1); }
          75% { transform: rotate(10deg) scale(1.1); }
        }
        .animate-hand-shake { animation: hand-shake 0.2s ease-in-out infinite; }

        /* อนิเมชันให้สปริงเกิลลอยขึ้นลงเบาๆ */
        @keyframes float-sprinkle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-sprinkle { animation: float-sprinkle 4s ease-in-out infinite; }
      `,
        }}
      />

      <div
        ref={containerRef}
        className="w-full max-w-300 h-[75vh] md:h-[80vh] bg-[#e4002b] rounded-4xl md:rounded-[3rem] relative flex items-center justify-center shadow-2xl overflow-hidden"
      >
        {/* 🚨 Layer 0: Sprinkles Background (เรียงตัวกระจายรอบๆ) */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {sprinkles.map((piece, i) => (
            // หุ้มด้วย div เพื่อแยกอนิเมชันลอย (float) ออกจากการหมุน (rotate)
            <div
              key={i}
              className={`absolute ${piece.pos} animate-sprinkle opacity-90`}
              style={{ animationDelay: piece.delay }}
            >
              <div
                className={`${piece.color} ${piece.size} rounded-full`}
                style={{ transform: `rotate(${piece.angle}deg)` }}
              />
            </div>
          ))}
        </div>

        {/* 1. Text Content (อยู่ตรงกลางนิ่งๆ) */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full max-w-4xl pointer-events-none">
          <h2 className="text-[50px] md:text-[90px] font-['Bebas_Neue'] text-white leading-[0.85] tracking-widest uppercase text-center mb-4 md:mb-6">
            FOODIES, <br />
            IT'S TIME TO{" "}
            <span className="text-[#242424] drop-shadow-[4px_4px_0_white]">
              REJOICE.
            </span>
          </h2>
          <p className="text-[#eeeeee] font-['IBM_Plex_Sans_Thai'] font-medium text-base md:text-xl leading-relaxed max-w-2xl mx-auto drop-shadow-md">
            We're Serious Punch: the fried chicken joint of your dreams.
            Discover the crunchy items that set our menu apart.
          </p>
        </div>

        {/* 2. รูปไก่ & ปุ่ม ORDER NOW (บินทะลุกล่องขึ้นมา) */}
        <div
          className="absolute left-1/2 z-20 pointer-events-none will-change-transform flex justify-center items-center"
          style={{
            transform: `translate(-50%, ${150 - progress * 300}%)`,
            top: "50%",
          }}
        >
          <img
            src="/images/cta-menu.png"
            alt="Serious Punch Menu"
            className="w-70 md:w-125 h-auto object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.7)]"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />

          <button
            className={`absolute z-30 right-[-10%] top-[-10%] md:right-[-5%] md:top-[5%] bg-[#DC5F00] text-white font-['Bebas_Neue'] w-28 h-28 md:w-36 md:h-36 flex items-center justify-center transition-all duration-300 shadow-2xl group pointer-events-auto
              hover:bg-[#ff6e00] hover:scale-110
            `}
            style={{
              clipPath:
                "polygon(50% 0%, 61% 16%, 79% 9%, 84% 26%, 100% 31%, 95% 48%, 100% 64%, 84% 71%, 81% 89%, 63% 84%, 50% 100%, 37% 84%, 19% 89%, 16% 71%, 0% 64%, 5% 48%, 0% 31%, 16% 26%, 21% 9%, 39% 16%)",
            }}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              alert("พร้อมสั่งไก่ทอดแล้ว");
            }}
          >
            <span className="text-2xl md:text-3xl tracking-wider text-center leading-none mt-1 -rotate-12 transition-opacity group-hover:hidden">
              ORDER <br />
              NOW!
            </span>
            <Pointer
              size={44}
              strokeWidth={2.5}
              className="hidden group-hover:block animate-hand-shake drop-shadow-md text-white"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
