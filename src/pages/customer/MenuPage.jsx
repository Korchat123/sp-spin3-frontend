// src/pages/customer/MenuPage.jsx
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { HandFist, ShoppingCart, ArrowRight, CheckCircle } from "lucide-react";
import MenuCard from "../../component/customer/MenuCard";
import CartSidebar from "../../component/customer/CartSidebar";
import {
  menuData,
  MENU,
  AUTOPLAY_INTERVAL_MS,
  TOAST_DURATION_MS,
} from "../../assets/menuData";

const MenuPage = () => {
  const PROMOS = menuData;
  // --- States ---
  const [activeTab, setActiveTab] = useState("all");
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("crispyCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem("crispyCart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PROMOS.length);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  // --- Functions ---
  const handleAddToCart = (id, name) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prev, { id, qty: 1 }];
    });

    // โชว์ Toast
    setToastMsg(`Added: ${name}`);
    setTimeout(() => setToastMsg(""), TOAST_DURATION_MS);
  };

  const handleUpdateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) return { ...item, qty: item.qty + delta };
          return item;
        })
        .filter((item) => item.qty > 0),
    ); // ลบออกถ้า qty เป็น 0
  };

  const filteredMenu =
    activeTab === "all" ? MENU : MENU.filter((m) => m.cat === activeTab);

  // คำนวณสรุปยอดตะกร้า
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => {
    const menuData = MENU.find((m) => m.id === item.id);
    return sum + (menuData ? menuData.price * item.qty : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-[#eeeeee] font-['IBM_Plex_Sans_Thai'] text-[#242424]">
      {/* --- MAIN LAYOUT --- */}
      <div className="flex flex-col md:flex-row relative">
        {/* --- PROMO PANEL (ซ้าย) --- */}
        <aside className="relative w-full h-100 md:w-105 md:shrink-0 md:sticky md:top-18 md:h-[calc(100vh-72px)] bg-[#242424] overflow-hidden">
          {PROMOS.map((promo, i) => (
            <div
              key={promo.id}
              className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-500 ${i === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            >
              <div className="absolute inset-0">
                <img
                  src={promo.img}
                  alt={promo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-transparent" />
              </div>
              <div className="relative z-20 p-8 pb-16 text-white">
                <span className="text-[#e4002b] font-bold text-sm tracking-[3px] shadow-sm">
                  {promo.tag}
                </span>
                <h2 className="font-['Bebas_Neue'] text-5xl leading-[0.9] my-2 drop-shadow-md">
                  {promo.title}
                </h2>
                <div className="font-['Bebas_Neue'] text-4xl mb-4">
                  {promo.price}
                </div>
                <button
                  onClick={() =>
                    alert("ระบบโปรโมชั่นคอมโบเซตจะมาในเฟสถัดไปครับ!")
                  }
                  className="bg-[#e4002b] text-white px-8 py-3 rounded-md font-bold font-['Bebas_Neue'] text-xl hover:bg-white hover:text-black transition shadow-lg"
                >
                  ORDER NOW
                </button>
              </div>
            </div>
          ))}
          {/* Promo Dots */}
          <div className="absolute bottom-5 left-0 w-full flex justify-center gap-3 z-30">
            {PROMOS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === currentSlide ? "bg-[#e4002b] scale-150" : "bg-white/40"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </aside>

        {/* --- MENU GRID (ขวา) --- */}
        <main className="flex-1 p-6 md:p-12 pb-32 md:pb-12">
          <div className="mb-10">
            <span className="text-[#e4002b] font-black tracking-widest text-sm uppercase">
              Explore Flavors
            </span>
            <h2 className="text-5xl font-black font-['Bebas_Neue'] mt-2 text-[#242424]">
              SERIOUS SELECTIONS
            </h2>
          </div>

          {/* TABS */}
          <div
            className="flex gap-3 mb-8 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {[
              { id: "all", label: "ALL" },
              { id: "bucket", label: "BUCKETS" },
              { id: "sandwich", label: "SANDWICHES" },
              { id: "side", label: "SIDES" },
              { id: "desserts", label: "DESSERTS" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-md font-bold whitespace-nowrap transition-colors border-2 ${
                  activeTab === tab.id
                    ? "bg-[#242424] text-white border-[#242424]"
                    : "border-[#242424] text-[#242424] hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMenu.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </main>
      </div>

      {/* --- MOBILE CART STICKY BAR --- */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-[#242424] p-4 flex justify-between items-center text-white z-40 border-t-4 border-[#e4002b] cursor-pointer"
        onClick={() => setIsCartOpen(true)}
      >
        <div>
          <div className="text-xs opacity-60 uppercase font-bold">
            {totalItems} Items
          </div>
          <div className="text-xl font-black text-[#e4002b]">
            ฿{totalPrice.toLocaleString()}.-
          </div>
        </div>
        <button className="bg-[#e4002b] px-6 py-2 rounded-full font-black text-sm font-['Bebas_Neue'] shadow-lg flex items-center gap-2">
          VIEW CART <ArrowRight size={16} />
        </button>
      </div>

      {/* --- TOAST NOTIFICATION --- */}
      <div
        className={`fixed bottom-8 right-8 bg-[#242424] text-white px-6 py-4 rounded-lg shadow-2xl border-l-4 border-[#e4002b] flex items-center gap-3 transition-all duration-300 z-60 ${toastMsg ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}
      >
        <CheckCircle className="text-[#e4002b]" size={20} />
        <span className="font-bold">{toastMsg}</span>
      </div>

      {/* --- CART SIDEBAR COMPONENT --- */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateQty}
      />
    </div>
  );
};

export default MenuPage;
