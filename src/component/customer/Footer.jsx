// src/component/customer/Footer.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const eyeRef = useRef(null);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!eyeRef.current) return;
      const eye = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = eye.left + eye.width / 2;
      const eyeCenterY = eye.top + eye.height / 2;

      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;
      const angle = Math.atan2(deltaY, deltaX);

      const maxDistance = eye.width / 4;
      const distance = Math.min(maxDistance, Math.hypot(deltaX, deltaY) / 8);

      setPupilPos({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const footerLinks = [
    { label: "Our Branches", href: "#" },
    { label: "Allergen Information", href: "#" },
    { label: "Contact Us", href: "#" },
  ];

  // แยกตัวอักษรเพื่อทำเอฟเฟกต์ Dancing Letters (แบบตั้งค้างไว้เฉยๆ)
  const friedChickenText = "FRIED CHICKEN.".split("");

  return (
    <footer className="w-full relative bg-transparent flex flex-col justify-between">
      {/* CSS สำหรับแอนิเมชันไก่ลอย */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float-cute {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        .animate-float-cute { animation: float-cute 3s ease-in-out infinite; }
      `,
        }}
      />

      {/* ─── ส่วนบน: Sign up & รูปไก่เท้าคาง ─── */}
      <div className="w-full pt-32 pb-16 relative">
        {/* พื้นที่สำหรับรูปไก่เท้าคาง */}
        <div className="absolute -top-4 md:-top-8 left-1/2 -translate-x-1/2 z-20 flex justify-center pointer-events-none">
          <img
            src="/images/chicken-resting.png"
            alt="Cute Chicken Resting"
            className="w-32 md:w-44 lg:w-48 drop-shadow-xl animate-float-cute"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center mt-4">
          <h2 className="text-4xl md:text-5xl font-['Bebas_Neue'] text-[#242424] tracking-widest mb-6 text-center">
            JOIN THE CRISPY CLUB
          </h2>

          <form className="flex w-full max-w-md mt-2 border-2 border-[#242424] bg-white shadow-[8px_8px_0_#242424] hover:-translate-y-1 hover:shadow-[12px_12px_0_#242424] transition-all duration-300">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-transparent focus:outline-none font-['IBM_Plex_Sans_Thai'] text-[#242424]"
              aria-label="Email for newsletter"
            />
            <Link
              to="/register"
              className="bg-[#242424] text-white font-['Bebas_Neue'] px-6 py-3 text-xl tracking-wider border-l-2 border-[#242424] hover:bg-[#e4002b] transition-colors flex items-center justify-center"
            >
              SIGN UP
            </Link>
          </form>
        </div>
      </div>

      {/* ─── ส่วนกลาง: โลโก้ และ เมนู ─── */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-t-2 border-[#242424]/20 w-full">
        {/* ซ้าย: โลโก้แบบคิวท์ๆ */}
        <div className="flex flex-col items-start leading-[0.85] text-[#242424]">
          <h1 className="text-[60px] md:text-[100px] font-['Bebas_Neue'] font-black tracking-wider flex items-center flex-wrap">
            SERI
            {/* ลูกตาจ้องมอง */}
            <span
              ref={eyeRef}
              className="relative inline-flex items-center justify-center w-[0.8em] h-[0.8em] rounded-[30%] border-[0.15em] border-[#242424] mx-1 md:mx-2 bg-white"
            >
              <span
                className="absolute w-[0.3em] h-[0.3em] bg-[#e4002b] rounded-full shadow-inner"
                style={{
                  transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`,
                  transition: "transform 0.1s ease-out",
                }}
              ></span>
            </span>
            US
          </h1>

          {/* 🚨 Dancing Letters: เอา Hover ออกแล้ว แต่ยังคงความเอียงของตัวอักษรไว้ */}
          <h1 className="text-[55px] md:text-[90px] font-['Bebas_Neue'] font-black tracking-wider text-[#DC5F00] flex flex-wrap mt-2">
            {friedChickenText.map((char, index) => (
              <span
                key={index}
                className={`inline-block drop-shadow-sm
                  ${char === " " ? "w-3 md:w-5" : ""} 
                  ${index % 2 === 0 ? "rotate-[-4deg] translate-y-1" : "rotate-[4deg] -translate-y-1"}
                `}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* ขวา: เมนูหลัก */}
        <div className="flex flex-col items-start md:items-end w-full md:w-auto">
          <div className="flex flex-col items-start md:items-end gap-2 mb-8 font-['IBM_Plex_Sans_Thai'] text-lg font-bold uppercase tracking-wide text-[#242424]">
            {footerLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="group flex items-center gap-2 hover:text-[#e4002b] transition-colors"
              >
                <ArrowUpRight
                  size={20}
                  strokeWidth={2.5}
                  className="opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#e4002b]"
                />
                <span>{link.label}</span>
              </a>
            ))}
          </div>

          {/* Social Media & Legal Links */}
          <div className="flex flex-col items-start md:items-end gap-3 font-['IBM_Plex_Sans_Thai'] text-sm font-bold text-[#242424]/70">
            <div className="flex gap-6 text-[#242424]">
              <a
                href="#"
                className="hover:text-[#e4002b] transition-transform hover:scale-110"
              >
                INSTAGRAM
              </a>
              <a
                href="#"
                className="hover:text-[#e4002b] transition-transform hover:scale-110"
              >
                TIKTOK
              </a>
              <a
                href="#"
                className="hover:text-[#e4002b] transition-transform hover:scale-110"
              >
                FACEBOOK
              </a>
            </div>
            <div className="flex gap-4 font-normal mt-2">
              <a
                href="#"
                className="hover:text-[#242424] transition-colors underline decoration-[#242424]/30 hover:decoration-[#e4002b] underline-offset-4"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-[#242424] transition-colors underline decoration-[#242424]/30 hover:decoration-[#e4002b] underline-offset-4"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ส่วนก้นสุด: บาร์สีดำจัดกึ่งกลาง */}
      <div className="w-full bg-[#1a1a1a] py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex justify-center items-center">
          <p className="text-white/80 text-sm md:text-base font-['IBM_Plex_Sans_Thai'] tracking-wide text-center">
            © {new Date().getFullYear()} Serious Fried Chicken. All rights
            reserved. Let's get crispy.
          </p>
        </div>
      </div>
    </footer>
  );
}
