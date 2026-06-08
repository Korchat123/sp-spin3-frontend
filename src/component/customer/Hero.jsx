// src/component/customer/Hero.jsx
import { useState, useEffect } from "react";
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

  
    </section>
  );
}
