import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, ChevronLeft, MapPin } from "lucide-react";

import Sidebar from "../../component/shared/SideBar";
import MenuCard from "../../component/customer/MenuCard";
import ProductModal from "../../component/customer/ProductModal";
import { useShop } from "../../context/ShopProvider";

const CashierMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const orderType = location.state?.type || "WALK-IN";
  const tableId = location.state?.tableId || null;

  const {
    cart,
    updateCartQty,
    cartCount,
    addToCart: shopAddToCart,
    menus,
    menusLoading,
  } = useShop();

  const [activeTab, setActiveTab] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredMenu =
    activeTab === "all" ? menus : menus.filter((m) => m.category === activeTab);

  const tabs = [
    { id: "all", label: "ALL" },
    { id: "chicken", label: "CHICKEN" },
    { id: "burger", label: "BURGERS" },
    { id: "combo", label: "COMBOS" },
    { id: "side", label: "SIDES" },
    { id: "drink", label: "DRINKS" },
  ];

  return (
    <div className="flex bg-[#eeeeee] min-h-screen font-['IBM_Plex_Sans_Thai'] text-[#242424]">
      <Sidebar />

      <main className="flex-1 ml-60 p-6 md:p-10 flex flex-col h-screen overflow-y-auto pb-24">
        <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="font-['Bebas_Neue'] text-3xl md:text-4xl leading-none text-[#242424] mt-1 tracking-wider">
                <span className="text-[#e4002b]">SFC</span> POS
              </h1>
              <div className="flex items-center gap-2 text-xs font-bold mt-1">
                <span className="bg-[#242424] text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {orderType}
                </span>
                {tableId && (
                  <span className="bg-yellow-400 text-[#242424] px-2 py-0.5 rounded-md uppercase tracking-wider">
                    TABLE: {tableId}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
            <MapPin size={14} className="text-[#e4002b]" /> ASOK (HQ)
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-2 mb-8 w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm tracking-wider transition-all cursor-pointer border-2 ${
                activeTab === tab.id
                  ? "bg-[#242424] text-white border-[#242424] shadow-md -translate-y-0.5"
                  : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-[#242424]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {menusLoading ? (
            <div className="col-span-full text-center py-20 text-gray-400 font-bold">
              กำลังโหลดเมนู...
            </div>
          ) : (
            filteredMenu.map((item) => {
              const cartItem = cart.find((c) => c.id === item.id);
              const qty = cartItem ? cartItem.qty : 0;

              return (
                <MenuCard
                  key={item._id}
                  item={item}
                  qtyInCart={qty}
                  isCashierMode={true}
                  // 💡 ส่ง +1 เพื่อบวก และเช็กลิมิต 99 ไปด้วย
                  onIncrease={() => {
                    if (qty === 0) shopAddToCart(item.id, 1);
                    else if (qty < 99) updateCartQty(item.id, 1);
                  }}
                  // 💡 ส่ง -1 เพื่อลบ (ShopProvider จะลบออกจากตะกร้าให้เองถ้าเหลือ 0)
                  onDecrease={() => {
                    if (qty > 0) updateCartQty(item.id, -1);
                  }}
                  onOpenModal={() => setSelectedItem(item)}
                />
              );
            })
          )}
        </div>
      </main>

      {cartCount > 0 && (
        <div className="fixed bottom-8 right-8 z-50 animate-[slideUp_0.2s_ease-out]">
          <button
            onClick={() =>
              navigate("/cashier/checkout", {
                state: { tableId, type: orderType },
              })
            }
            className="bg-[#e4002b] hover:bg-[#c90025] text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-4 shadow-[0_10px_30px_rgba(228,0,43,0.3)] transition-all active:scale-95 cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag size={24} />
              <span className="absolute -top-2 -right-2 bg-white text-[#e4002b] text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                {cartCount}
              </span>
            </div>
            <div className="flex flex-col items-start border-l border-white/20 pl-4">
              <span className="text-[10px] uppercase tracking-widest opacity-80">
                Proceed to
              </span>
              <span className="font-['Bebas_Neue'] text-2xl leading-none mt-1">
                CHECKOUT
              </span>
            </div>
          </button>
        </div>
      )}

      <ProductModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        onAddToCart={(id, name, qty) => shopAddToCart(id, qty)}
      />
    </div>
  );
};

export default CashierMenu;
