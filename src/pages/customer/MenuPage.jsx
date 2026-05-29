// src/pages/customer/MenuPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import {
  HandFist,
  ShoppingCart,
  ArrowRight,
  CheckCircle,
  MapPin,
} from "lucide-react";
import MenuCard from "../../component/customer/MenuCard";
import CartSidebar from "../../component/customer/CartSidebar";
import { OrdersContext } from "../../context/ordersContext/OrdersContext";
import ProductModal from "../../component/customer/ProductModal";
import LoginModal from "../../component/LoginModal";
import { useShop } from "../../context/ShopProvider";
import {
  PROMOTIONS,
  MENU,
  AUTOPLAY_INTERVAL_MS,
  TOAST_DURATION_MS,
} from "../../assets/menuData";

const MenuPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    cart,
    cartCount,
    addToCart: shopAddToCart,
    updateCartQty,
    isCartOpen,
    setIsCartOpen,
    isLoginModalOpen,
    setIsLoginModalOpen,
    toastMsg,
    showToast,
    selectedBranch,
    selectBranch,
  } = useShop();

  // --- Local UI States ---
  const [activeTab, setActiveTab] = useState("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const totalItems = cartCount;

  // เช็ค URL เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab) setActiveTab(currentTab);

    if (searchParams.get("cart") === "open") {
      setIsCartOpen(true);
      searchParams.delete("cart");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, setIsCartOpen]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PROMOTIONS.length);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  // --- Functions ---
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams(tabId === "all" ? {} : { tab: tabId });
  };

  const handleSelectBranch = (branchId) => {
    selectBranch(branchId);
    setIsBranchModalOpen(false);

    if (pendingAction) {
      if (pendingAction.type === "ADD") {
        executeAddToCart(
          pendingAction.item.id,
          pendingAction.item.name,
          pendingAction.qty,
        );
      } else if (pendingAction.type === "VIEW") {
        setSelectedItem(pendingAction.item);
      }
      setPendingAction(null);
    }
  };

  const checkBranchBeforeAction = (type, item, qty = 1) => {
    if (!selectedBranch) {
      setPendingAction({ type, item, qty });
      setIsBranchModalOpen(true);
    } else {
      if (type === "ADD") {
        executeAddToCart(item.id, item.name, qty);
      } else if (type === "VIEW") {
        setSelectedItem(item);
      }
    }
  };

  // ฟังก์ชันใส่ตะกร้า
  const executeAddToCart = (id, name, qty = 1) => {
    shopAddToCart(id, qty);
    showToast(`Added: ${name}`);
  };

  const handleUpdateQty = (id, delta) => {
    updateCartQty(id, delta);
  };

  const filteredMenu =
    activeTab === "all" ? MENU : MENU.filter((m) => m.cat === activeTab);

  const totalPrice = cart.reduce((sum, item) => {
    return sum + ((item.price || 0) * item.qty);
  }, 0);

  return (
    <div className="min-h-screen bg-[#eeeeee] font-['IBM_Plex_Sans_Thai'] text-[#242424]">
      {/* Branch Selector Modal */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full border-4 border-[#242424] shadow-[12px_12px_0_#242424] text-center relative">
            <button
              onClick={() => {
                setIsBranchModalOpen(false);
                setPendingAction(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <div className="w-16 h-16 bg-[#e4002b] rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <MapPin size={32} color="white" />
            </div>
            <h2 className="font-['Bebas_Neue'] text-4xl mb-2">
              CHOOSE YOUR STORE
            </h2>
            <p className="text-gray-600 mb-8">
              Please select a branch before ordering.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => handleSelectBranch("branch1")}
                className="w-full p-4 border-2 border-[#242424] rounded-xl font-bold hover:bg-[#e4002b] hover:text-white transition-colors flex justify-between items-center"
              >
                <span>Asok Branch (HQ)</span>
                <span className="text-sm bg-[#242424] text-white px-2 py-1 rounded">
                  OPEN
                </span>
              </button>
              <button
                disabled
                className="w-full p-4 border-2 border-gray-300 text-gray-400 rounded-xl font-bold bg-gray-100 flex justify-between items-center cursor-not-allowed"
              >
                <span>Siam Branch</span>
                <span className="text-sm bg-gray-300 text-gray-500 px-2 py-1 rounded">
                  COMING SOON
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row relative">
        <aside className="relative w-full h-100 md:w-105 md:shrink-0 md:sticky md:top-20 md:h-[calc(100vh-80px)] bg-[#242424] overflow-hidden z-10">
          {PROMOTIONS.map((promo, i) => (
            <div
              key={promo.id}
              className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-500 ${i === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            >
              <div className="absolute inset-0">
                <img
                  src={promo.img}
                  alt={promo.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/600x800/242424/e4002b?text=PROMO";
                  }}
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
                  onClick={() => alert("โปรโมชั่นคอมโบเซตจะมาในเฟสถัดไปครับ!")}
                  className="bg-[#e4002b] text-white px-8 py-3 rounded-md font-bold font-['Bebas_Neue'] text-xl hover:bg-white hover:text-black transition shadow-lg cursor-pointer"
                >
                  ORDER NOW
                </button>
              </div>
            </div>
          ))}
          <div className="absolute bottom-5 left-0 w-full flex justify-center gap-3 z-30">
            {PROMOTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === currentSlide ? "bg-[#e4002b] scale-150" : "bg-white/40"} cursor-pointer`}
              />
            ))}
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-12 pb-32 md:pb-12 z-0">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[#e4002b] font-black tracking-widest text-sm uppercase">
                Explore Flavors
              </span>
              <h2 className="text-5xl font-black font-['Bebas_Neue'] mt-2 text-[#242424]">
                SERIOUS SELECTIONS
              </h2>
            </div>
            {selectedBranch ? (
              <button
                onClick={() => setIsBranchModalOpen(true)}
                className="flex items-center gap-2 bg-white border-2 border-[#242424] px-4 py-2 rounded-lg shadow-[4px_4px_0_#242424] hover:bg-gray-100 transition-colors text-sm font-bold cursor-pointer"
              >
                <MapPin size={16} className="text-[#e4002b]" /> Store:{" "}
                {selectedBranch === "branch1" ? "Asok (HQ)" : selectedBranch}
              </button>
            ) : (
              <button
                onClick={() => setIsBranchModalOpen(true)}
                className="flex items-center gap-2 bg-[#e4002b] text-white border-2 border-[#242424] px-4 py-2 rounded-lg shadow-[4px_4px_0_#242424] hover:bg-black transition-colors text-sm font-bold animate-pulse cursor-pointer"
              >
                <MapPin size={16} /> Choose Store
              </button>
            )}
          </div>

          <div
            className="flex gap-3 mb-8 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {[
              { id: "all",      label: "ALL" },
              { id: "chicken",  label: "CHICKEN" },
              { id: "burger",   label: "BURGERS" },
              { id: "combo",    label: "COMBOS" },
              { id: "side",     label: "SIDES" },
              { id: "dessert",  label: "DESSERTS" },
              { id: "drink",    label: "DRINKS" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-6 py-2 rounded-md font-bold whitespace-nowrap transition-colors border-2 cursor-pointer ${activeTab === tab.id ? "bg-[#242424] text-white border-[#242424]" : "border-[#242424] text-[#242424] hover:bg-gray-200"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {filteredMenu.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onAddToCart={(id, name) =>
                  checkBranchBeforeAction("ADD", { id, name })
                }
                onOpenModal={() => checkBranchBeforeAction("VIEW", item)}
              />
            ))}
          </div>
        </main>
      </div>

      {/* --- MOBILE CART STICKY BAR --- */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-[#242424] p-4 flex justify-between items-center text-white z-40 border-t-4 border-[#e4002b] cursor-pointer"
        onClick={() => navigate("/order")}
      >
        <div>
          <div className="text-xs opacity-60 uppercase font-bold">
            {totalItems} Items
          </div>
          <div className="text-xl font-black text-[#e4002b]">
            ฿{totalPrice.toLocaleString()}.-
          </div>
        </div>
        <button className="bg-[#e4002b] px-6 py-2 rounded-full font-black text-sm font-['Bebas_Neue'] shadow-lg flex items-center gap-2 cursor-pointer">
          VIEW CART <ArrowRight size={16} />
        </button>
      </div>

      {/* Toast Noti */}
      <div
        className={`fixed bottom-8 right-8 bg-[#242424] text-white px-6 py-4 rounded-lg shadow-2xl border-l-4 border-[#e4002b] flex items-center gap-3 transition-all duration-300 z-60 ${toastMsg ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}
      >
        <CheckCircle className="text-[#e4002b]" size={20} />
        <span className="font-bold">{toastMsg}</span>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        onAddToCart={(id, name, qty) =>
          checkBranchBeforeAction("ADD", { id, name }, qty)
        }
      />

      {/* Cart Sidebar */}
      <div className="relative z-9998">
        <CartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cart}
          onUpdateQty={handleUpdateQty}
          onOpenLoginModal={() => setIsLoginModalOpen(true)} // ✅ ส่ง Props ตัวนี้เข้าไป
        />
      </div>

      {/* LoginModal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default MenuPage;

