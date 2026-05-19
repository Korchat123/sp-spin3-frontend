// src/component/customer/PromoCarousel.jsx
import React, { useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import ProductCard from "./ProductCard";

export default function PromoCarousel({ title, items }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !trackRef.current) return;

      const container = containerRef.current;
      const track = trackRef.current;

      const rect = container.getBoundingClientRect();
      const maxScrollVertical = container.offsetHeight - window.innerHeight;

      let scrolled = -rect.top;
      if (scrolled < 0) scrolled = 0;
      if (scrolled > maxScrollVertical) scrolled = maxScrollVertical;

      const progress = maxScrollVertical > 0 ? scrolled / maxScrollVertical : 0;

      const viewportWidth = track.parentElement.clientWidth;
      const maxScrollHorizontal = track.scrollWidth - viewportWidth;

      track.style.transform = `translateX(-${progress * maxScrollHorizontal}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scroll = (direction) => {
    if (!containerRef.current || !trackRef.current) return;
    const maxScrollVertical =
      containerRef.current.offsetHeight - window.innerHeight;
    const viewportWidth = trackRef.current.parentElement.clientWidth;
    const maxScrollHorizontal = trackRef.current.scrollWidth - viewportWidth;

    const ratio = maxScrollVertical / (maxScrollHorizontal || 1);
    const scrollAmount = 350 * ratio;

    window.scrollBy({
      top: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section ref={containerRef} className="w-full relative h-[250vh] my-12">
      <div className="sticky top-[10vh] md:top-[15vh] w-full overflow-hidden py-12">
        <div className="flex justify-between items-end mb-8 px-4 md:px-8">
          <h2 className="text-4xl md:text-6xl font-['Bebas_Neue'] text-[#242424] tracking-wider uppercase leading-none">
            {title}
          </h2>
          <div className="hidden md:flex gap-3 relative z-20">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 flex items-center justify-center bg-white border-2 border-[#242424] rounded-full hover:bg-[#e4002b] hover:text-white transition-all shadow-sm active:translate-y-1"
            >
              <ArrowLeft size={24} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 flex items-center justify-center bg-[#242424] text-white border-2 border-[#242424] rounded-full hover:bg-[#e4002b] transition-all shadow-sm active:translate-y-1"
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-6 w-max will-change-transform pb-8 px-4 md:px-8"
        >
          {items &&
            items.map((item, index) => (
              <div key={item.id || index} className="shrink-0">
                <ProductCard item={item} />
              </div>
            ))}

          {/* ─── การ์ดพิเศษ (Brand Promo) ที่เราแก้กัณฑ์ที่แล้ว ─── */}
          {/* 1. เปลี่ยนจาก <div /> เป็น <a /> (Link Tag) */}
          <a
            href="/all-menu" // แก้เป็น Path ที่ต้องการเลิ้งค์ไป (join the crispy club / see all menu)
            className="shrink-0 w-75 md:w-112.5 h-80 md:h-95 rounded-md overflow-hidden relative group cursor-pointer bg-[#242424] flex items-center justify-center shadow-lg border border-[#333] transition-all duration-300"
          >
            <img
              src="/images/serious-punch-lifestyle.jpg"
              alt="Serious Punch Lifestyle"
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
              onError={(e) => {
                //  แก้ตรงนี้: เอา STREET CULTURE ออก เหลือแค่ BG สีดำเปล่าๆ
                e.target.src = "https://placehold.co/600x400/242424/242424";
              }}
            />

            {/* ส่วนข้อความ (เดิมดีอยู่แล้ว เราหุ้มไว้ในลิ้งค์ <a/> แล้ว) */}
            <div className="relative z-10 p-8 flex flex-col justify-end h-full w-full bg-linear-to-t from-black/90 via-black/40 to-transparent">
              <h3 className="font-['Bebas_Neue'] text-white text-4xl leading-none drop-shadow-md">
                JOIN THE
                <br />
                <span className="text-[#e4002b]">CRISPY CLUB</span>
              </h3>
              <div className="mt-4 flex items-center gap-2 text-white font-bold text-sm uppercase tracking-widest hover:text-[#e4002b] transition-colors">
                See All Menu <ArrowUpRight size={18} />
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
