// src/component/customer/OrderStep.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Bike,
  Store,
  Utensils,
  CheckCircle2,
  Clock,
  Flame,
  Drumstick,
  ArrowRight,
} from "lucide-react";

export default function OrderStep() {
  const [activeStep, setActiveStep] = useState(1);
  const [expandProgress, setExpandProgress] = useState(0);
  const cardRefs = useRef([]);
  const finaleRef = useRef(null);

  const steps = [
    {
      id: 1,
      title: "DELIVERY",
      icon: Bike,
      image: "/images/step-delivery.png",
      link: "/order",
      ctaText: "Click to start delivery order",
      desc: [
        "ส่งไว ทันใจวัยรุ่นหิว",
        "ครอบคลุมกรุงเทพฯ และปริมณฑล",
        "รับประกันความกรอบ",
        "สั่งเลยตอนนี้!",
      ],
    },
    {
      id: 2,
      title: "PICK UP STORE",
      icon: Store,
      image: "/images/step-pickup.png",
      link: "/order?type=pickup",
      ctaText: "Click to start pick-up order",
      desc: [
        "สั่งล่วงหน้าผ่านเว็บ",
        "แวะโฉบมารับที่หน้าร้าน",
        "ไม่ต้องรอคิว",
        "สะดวก รวดเร็ว พร้อมลุย",
      ],
    },
    {
      id: 3,
      title: "DINE-IN",
      icon: Utensils,
      image: "/images/step-dinein.png",
      link: "/menu",
      ctaText: "Click to make a reservation",
      desc: [
        "แวะมานั่งชิลที่ร้าน",
        "เสพ Vibe สตรีทคัลเจอร์",
        "กินไก่ทอดร้อนๆ",
        "ชวนเพื่อนมาปาร์ตี้",
      ],
    },
  ];

  const finalePromises = [
    { title: "ANYTIME", icon: Clock, desc: "หิวเมื่อไหร่ จัดได้ทันที" },
    {
      title: " ",
      bgImage: "/images/step-anywhere2.png",
      desc: " ",
    },
    { title: "ANY VIBE", icon: Flame, desc: "ปาร์ตี้บ้าน หรือที่ร้านก็ชิลสุด" },
  ];

  const scrollToCard = (index) => {
    if (cardRefs.current[index]) {
      const cardPosition =
        cardRefs.current[index].getBoundingClientRect().top + window.scrollY;

      const offset = window.innerWidth < 768 ? 250 : 350;
      const offsetPosition = cardPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const { top, bottom } = card.getBoundingClientRect();
        if (
          scrollPosition >= top + window.scrollY &&
          scrollPosition <= bottom + window.scrollY
        ) {
          setActiveStep(steps[index].id);
        }
      });

      if (finaleRef.current) {
        const rect = finaleRef.current.getBoundingClientRect();
        const scrolled = -rect.top;
        const expandDistance = window.innerHeight * 0.7;

        if (scrolled >= 0) {
          let progress = scrolled / expandDistance;
          setExpandProgress(Math.max(0, Math.min(1, progress)));
        } else {
          setExpandProgress(0);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full flex flex-col relative">
      <section className="w-full bg-[#eeeeee] relative pb-[10vh]">
        <div className="sticky top-15 md:top-20 z-40 bg-[#eeeeee] pt-12 pb-6 px-4 w-full">
          <div className="w-full max-w-7xl mx-auto md:px-8">
            <h2 className="text-4xl md:text-5xl font-['Bebas_Neue'] font-black text-[#242424] tracking-widest uppercase text-center md:text-left md:ml-[33%]">
              CHOOSE YOUR <span className="text-[#e4002b]">FIGHTING STYLE</span>
            </h2>
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-4 md:mt-12">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 relative items-start">
            <div className="md:w-1/3 w-full md:sticky md:top-50 flex flex-row md:flex-col justify-center gap-6 z-30 sticky top-32.5 bg-[#eeeeee]/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none py-4 md:border-none border-b border-gray-200">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => scrollToCard(index)}
                  className={`flex items-center gap-6 transition-all duration-300 cursor-pointer group outline-none ${
                    activeStep === step.id
                      ? "opacity-100"
                      : "opacity-40 hover:opacity-80"
                  }`}
                >
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                      activeStep === step.id
                        ? "bg-[#242424] text-white shadow-[4px_4px_0_#e4002b] -translate-y-1"
                        : "bg-white text-[#242424] border-2 group-hover:border-[#242424]"
                    }`}
                  >
                    <step.icon
                      size={activeStep === step.id ? 28 : 24}
                      strokeWidth={activeStep === step.id ? 2.5 : 2}
                    />
                  </div>
                  <span
                    className={`font-['Bebas_Neue'] tracking-widest text-2xl hidden md:block transition-all duration-300 text-left ${
                      activeStep === step.id
                        ? "text-[#242424] scale-110 ml-2"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  >
                    {step.title}
                  </span>
                </button>
              ))}
            </div>

            <div className="md:w-2/3 flex flex-col gap-16 md:gap-20 w-full items-center md:items-start pb-[10vh]">
              {steps.map((step, index) => (
                <Link
                  to={step.link}
                  key={step.id}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className={`flex flex-col bg-white rounded-3xl p-6 md:p-8 shadow-sm w-full max-w-120 transition-all duration-700 cursor-pointer group border-2 border-transparent hover:-translate-y-2 ${
                    activeStep === step.id
                      ? "opacity-100 translate-y-0"
                      : "opacity-30 translate-y-12"
                  }`}
                >
                  <div className="w-full h-45 md:h-50 relative mb-8 flex justify-center items-end group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-3xl font-['Bebas_Neue'] text-[#242424]">
                      {step.title}
                    </h3>
                    <span className="text-[#e4002b] opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      <ArrowRight size={28} />
                    </span>
                  </div>

                  <ul className="flex flex-col gap-3 font-['IBM_Plex_Sans_Thai'] text-gray-600 mb-4">
                    {step.desc.map((line, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2
                          size={18}
                          className="text-[#DC5F00] shrink-0"
                        />
                        {line}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-4 border-t border-gray-100 font-bold text-sm text-gray-400 group-hover:text-[#242424] transition-colors uppercase tracking-wider">
                    {step.ctaText}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- ส่วน Finale ด้านล่าง ปรับธีมใหม่ให้ดุดันแบบ SFC --- */}
      <section
        ref={finaleRef}
        className="w-full bg-[#eeeeee] h-[250vh] relative z-50"
      >
        <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
          <div
            className="bg-[#242424] flex flex-col items-center justify-center relative shadow-2xl overflow-hidden"
            style={{
              width: `${80 + expandProgress * 20}%`,
              height: `${60 + expandProgress * 40}vh`,
              borderRadius: `${(1 - expandProgress) * 40}px`,
            }}
          >
            {/* 🚧 เปลี่ยนจากลายตารางเป็นลายเส้นเฉียง (Danger Stripes) สไตล์ Street */}
            <div
              className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  -45deg,
                  #ffffff,
                  #ffffff 2px,
                  transparent 2px,
                  transparent 24px
                )`,
              }}
            />

            {/* ข้อความก่อนขยาย */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-300 z-10"
              style={{ opacity: Math.max(0, 1 - expandProgress * 2) }}
            >
              <Drumstick
                size={64}
                className="text-[#e4002b] animate-bounce drop-shadow-lg"
                strokeWidth={1.5}
              />
              <span className="text-white font-['Bebas_Neue'] tracking-widest mt-4 text-4xl animate-pulse drop-shadow-md">
                READY TO ORDER ?
              </span>
            </div>

            {/* เนื้อหาหลักตอนขยายเต็มจอ */}
            <div
              className="w-full max-w-5xl mx-auto px-4 flex flex-col items-center transition-all duration-300 z-10"
              style={{
                opacity:
                  expandProgress > 0.6 ? (expandProgress - 0.6) * 2.5 : 0,
                transform: `translateY(${(1 - expandProgress) * 30}px)`,
              }}
            >
              {/* แก้สีตัวอักษรให้เป็นสีขาว และไฮไลท์สีแดง เพื่อให้อ่านง่ายบนพื้นดำ */}
              <h2 className="text-5xl md:text-7xl font-['Bebas_Neue'] font-black text-white tracking-widest uppercase mb-16 text-center leading-[0.9] drop-shadow-lg">
                NO MATTER HOW YOU FIGHT. <br />
                <span className="text-[#e4002b]">WE DELIVER THE CRUNCH.</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-4xl mb-16">
                {finalePromises.map((item, idx) => (
                  <div
                    key={idx}
                    // ปรับการ์ดให้เป็นสไตล์ Brutalist (พื้นขาว, ขอบหนา, เงาแดง)
                    className="relative bg-white border-4 border-[#242424] rounded-2xl p-8 flex flex-col items-center text-center overflow-hidden group hover:-translate-y-2 hover:shadow-[12px_12px_0_#e4002b] transition-all duration-300"
                  >
                    {item.bgImage && (
                      <>
                        <div
                          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-700"
                          style={{ backgroundImage: `url('${item.bgImage}')` }}
                        ></div>

                        <div className="absolute inset-0 bg-black/50 z-0"></div>
                      </>
                    )}

                    <div className="relative z-10 flex flex-col items-center w-full">
                      {item.icon ? (
                        <div className="w-16 h-16 mb-6 rounded-full border-4 border-[#242424] text-white bg-[#242424] flex items-center justify-center group-hover:bg-[#e4002b] transition-colors duration-300 shadow-[4px_4px_0_#242424]">
                          <item.icon size={32} strokeWidth={2.5} />
                        </div>
                      ) : (
                        <div className="h-22 w-full"></div>
                      )}

                      <h3
                        className={`text-3xl font-['Bebas_Neue'] mb-2 tracking-wide ${item.bgImage ? "text-white drop-shadow-md" : "text-[#242424]"}`}
                      >
                        {item.title}
                      </h3>

                      <p
                        className={`font-['IBM_Plex_Sans_Thai'] font-bold leading-snug ${item.bgImage ? "text-gray-100 drop-shadow-md" : "text-gray-600"}`}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ปรับปุ่มให้สว่างขึ้นเพื่อดึงดูดสายตา */}
              <Link
                to="/menu"
                className="bg-white text-[#242424] font-['Bebas_Neue'] text-3xl tracking-widest py-4 md:py-5 px-16 rounded-xl border-4 border-[#242424] shadow-[8px_8px_0_#e4002b] hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0_#e4002b] transition-all group relative overflow-hidden"
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  START YOUR ORDER
                </span>
                <div className="absolute inset-0 w-0 bg-[#e4002b] group-hover:w-full transition-all duration-300 ease-out z-0"></div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
