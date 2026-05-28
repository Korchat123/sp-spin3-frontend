// src/component/customer/Hero.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bike, Store, Utensils, ArrowRight } from "lucide-react";

export default function Hero() {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsExpanded(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full bg-[#242424] flex flex-col items-center justify-center pt-8 relative overflow-visible">
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
        className={`h-[60vh] md:h-[70vh] bg-[#1c1c1c] relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-y border-white/5 overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] z-10 mb-12 md:mb-16 ${
          isExpanded
            ? "w-full max-w-full rounded-none"
            : "w-[90%] md:w-[85%] max-w-7xl rounded-4xl md:rounded-[3rem]"
        }`}
      >
        <img
          src="/images/hero-1.png"
          alt="Serious Punch Hero"
          className="w-full h-full object-cover contrast-110 brightness-90"
        />
      </div>

      {/* ─── Quick Actions Bar (Minimal Hover) ─── */}
      <div className="w-full max-w-4xl mx-auto px-4 pb-16 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 z-20">
        {/* Option 1: Delivery */}
        <Link
          to="/order"
          className="w-full md:w-auto flex-1 flex items-center justify-between gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 px-6 py-4 rounded-full transition-all duration-300 group cursor-pointer backdrop-blur-sm"
        >
          <div className="flex items-center gap-4">
            {/* 🚨 วงกลมเปลี่ยนเป็นสีแดงตอน Hover และไอคอนมอเตอร์ไซค์จะขยับ (Wiggle) 🚨 */}
            <div className="bg-[#242424] group-hover:bg-[#e4002b] text-white p-3 rounded-full transition-colors duration-300">
              <Bike
                size={20}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:-rotate-12 group-hover:-translate-y-1"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-['Bebas_Neue'] text-2xl tracking-widest leading-none mt-1 group-hover:text-white transition-colors">
                DELIVERY
              </span>
              <span className="font-['IBM_Plex_Sans_Thai'] text-[10px] opacity-60 uppercase font-bold tracking-wider group-hover:opacity-100 transition-opacity">
                Order to your door
              </span>
            </div>
          </div>
          <ArrowRight
            size={18}
            className="text-[#e4002b] opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
          />
        </Link>

        {/* Option 2: Pick-up */}
        <Link
          to="/order?type=pickup"
          className="w-full md:w-auto flex-1 flex items-center justify-between gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 px-6 py-4 rounded-full transition-all duration-300 group cursor-pointer backdrop-blur-sm"
        >
          <div className="flex items-center gap-4">
            {/* 🚨 วงกลมเปลี่ยนเป็นสีแดงตอน Hover และไอคอนร้านจะเด้งดึ๋งๆ (Bounce) 🚨 */}
            <div className="bg-[#242424] group-hover:bg-[#e4002b] text-white p-3 rounded-full transition-colors duration-300">
              <Store
                size={20}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-['Bebas_Neue'] text-2xl tracking-widest leading-none mt-1 group-hover:text-white transition-colors">
                PICK-UP
              </span>
              <span className="font-['IBM_Plex_Sans_Thai'] text-[10px] opacity-60 uppercase font-bold tracking-wider group-hover:opacity-100 transition-opacity">
                Grab it on the go
              </span>
            </div>
          </div>
          <ArrowRight
            size={18}
            className="text-[#e4002b] opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
          />
        </Link>

        {/* Option 3: Dine-in */}
        <Link
          to="/menu"
          className="w-full md:w-auto flex-1 flex items-center justify-between gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 px-6 py-4 rounded-full transition-all duration-300 group cursor-pointer backdrop-blur-sm"
        >
          <div className="flex items-center gap-4">
            {/* 🚨 วงกลมเปลี่ยนเป็นสีแดงตอน Hover และไอคอนส้อมมีดจะไขว้กัน (Rotate) 🚨 */}
            <div className="bg-[#242424] group-hover:bg-[#e4002b] text-white p-3 rounded-full transition-colors duration-300">
              <Utensils
                size={20}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:rotate-12"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-['Bebas_Neue'] text-2xl tracking-widest leading-none mt-1 group-hover:text-white transition-colors">
                DINE-IN
              </span>
              <span className="font-['IBM_Plex_Sans_Thai'] text-[10px] opacity-60 uppercase font-bold tracking-wider group-hover:opacity-100 transition-opacity">
                Eat at our store
              </span>
            </div>
          </div>
          <ArrowRight
            size={18}
            className="text-[#e4002b] opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
          />
        </Link>
      </div>
    </section>
  );
}
