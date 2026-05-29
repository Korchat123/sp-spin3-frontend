// src/component/Navbarmenu.jsx
import { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Drumstick } from "lucide-react";
import Logo from "../assets/picture/Logo.png";
import Slogan from "../assets/picture/slogan.png";
import EditProfileModal from "../pages/shared/EditProfileModal";

// Import Context
import { UserContext } from "../context/userContext/UserContext";
import { useShop } from "../context/ShopProvider";

// Import Separated Sub-Components
import OrderStatusPopup from "./customer/OrderStatusPopup";
import ProfileDropdown from "./customer/ProfileDropdown";

// ==========================================
// MOCK DATA: สำหรับทดสอบ Order Status
// ==========================================
const MOCK_ONGOING_ORDERS = [
  {
    id: "SFC-8821",
    type: "delivery",
    status: "cooking",
    items: "Serious Bucket, Coke",
    total: 450,
  },
  {
    id: "SFC-8822",
    type: "pickup",
    status: "ready",
    items: "Spicy Chicken Burger",
    total: 120,
  },
];

const Navbarmenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrderStatusOpen, setIsOrderStatusOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const navigate = useNavigate();
  const { myUserInfo, setMyUserInfo } = useContext(UserContext);
<<<<<<< HEAD

  // ดึงฟังก์ชัน setIsCartOpen มาจาก Context ด้วย เพื่อเอาไว้สั่งเปิดตะกร้า
  const { cartCount, setIsCartOpen } = useShop();
=======
  const { cartCount } = useShop();
>>>>>>> a2b49ff5228bf84842249119fa533d00a0660ede

  const profileRef = useRef(null);
  const statusRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsOrderStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Rules of Hooks: Conditional return must come AFTER all hooks
  // ใช้เงื่อนไข (ซ่อน Navbar ถ้าเป็น cook หรือ rider)
  if (myUserInfo?.role === "cook" || myUserInfo?.role === "rider") return null;

  const handleLogout = () => {
    setMyUserInfo(null);
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  const goToDashboard = () => {
    setIsProfileOpen(false);
    if (myUserInfo?.role === "cook") navigate("/cookBoard");
    else if (myUserInfo?.role === "cashier") navigate("/cashier/orders");
    else if (myUserInfo?.role === "rider") navigate("/driver");
    else navigate("/menu");
  };

  const isLoggedInUser = !!myUserInfo;

  const ongoingOrdersCount = MOCK_ONGOING_ORDERS.filter(
    (o) => !["delivered", "picked_up", "cancelled"].includes(o.status),
  ).length;

  return (
    <header className="bg-primary text-neutral shadow-lg sticky top-0 z-100">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center relative">
        {/* Logo Section */}
        <div className="relative w-36 h-12 flex items-center">
          <Link
            to="/"
            className="absolute -top-4 left-0 z-50 transition-transform hover:scale-105"
          >
            <img
              src={Logo}
              alt="Logo"
              className="h-37 w-auto max-w-none drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]"
            />
          </Link>
        </div>

        {/* Slogan */}
        <div className="hidden md:flex flex-1 justify-center px-4">
          <img
            src={Slogan}
            alt="Slogan"
            className="h-17 w-auto object-contain"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          <ul className="flex space-x-6 font-['Bebas_Neue'] text-xl tracking-wider pt-1">
            <li>
              <Link
                to="/"
                className="hover:text-[#e4002b] transition duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/menu"
                className="hover:text-[#e4002b] transition duration-300"
              >
                Menu
              </Link>
            </li>
            <li>
              <Link
                to="/order"
                className="hover:text-[#e4002b] transition duration-300"
              >
                Order
              </Link>
            </li>
          </ul>

          <div className="flex items-center space-x-4 border-l-2 border-neutral/20 pl-6 ml-2 relative">
            {/* 🍗 Order Status Icon */}
            {isLoggedInUser && (
              <div className="relative">
                <button
                  onClick={() => setIsOrderStatusOpen(!isOrderStatusOpen)}
                  className="relative p-2 hover:text-[#e4002b] transition-colors cursor-pointer"
                >
                  <Drumstick
                    size={24}
                    className={ongoingOrdersCount > 0 ? "animate-bounce" : ""}
                  />
                  {ongoingOrdersCount > 0 && (
                    <span className="absolute top-0 right-0 bg-[#e4002b] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center transform translate-x-1/4 -translate-y-1/4 shadow-md border-2 border-white">
                      {ongoingOrdersCount}
                    </span>
                  )}
                </button>

                <OrderStatusPopup
                  isOpen={isOrderStatusOpen}
                  statusRef={statusRef}
                  orders={MOCK_ONGOING_ORDERS}
                  navigate={navigate}
                  onClose={() => setIsOrderStatusOpen(false)}
                />
              </div>
            )}

            {/* Cart Icon (Desktop) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:text-[#e4002b] transition-colors cursor-pointer border-none bg-transparent"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#e4002b] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center transform translate-x-1/4 -translate-y-1/4 shadow-md border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Login Button */}
            {isLoggedInUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 bg-[#242424] text-white px-4 py-2 rounded-full font-['IBM_Plex_Sans_Thai'] text-sm hover:bg-[#e4002b] cursor-pointer transition-colors border-2 border-transparent hover:border-white shadow-md"
                >
                  <User size={18} />
                  <span>My Profile</span>
                </button>

<<<<<<< HEAD
                <ProfileDropdown
                  isOpen={isProfileOpen}
                  profileRef={profileRef}
                  myUserInfo={myUserInfo}
                  goToDashboard={goToDashboard}
                  handleLogout={handleLogout}
                  navigate={navigate}
                  onClose={() => setIsProfileOpen(false)}
                  onOpenEditProfile={() => setIsEditProfileOpen(true)}
                />
=======
                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-white border-2 border-[#242424] rounded-xl py-2 flex flex-col font-['IBM_Plex_Sans_Thai'] overflow-hidden animate-in fade-in zoom-in duration-200 shadow-xl">
                    <div className="px-4 py-2 border-b-2 border-gray-100 mb-1">
                      <p className="text-[10px] text-gray-400 uppercase font-black">
                        Logged in as
                      </p>
                      {myUserInfo?.role !== "customer" && (
                        <p className="font-bold text-[#e4002b] truncate">
                          {myUserInfo?.role?.toUpperCase()}
                        </p>
                      )}
                      <p className="text-m font-bold text-[#242424] truncate">
                        {myUserInfo?.name}
                      </p>
                    </div>

                    {/* ปุ่ม Dashboard สำหรับพนักงาน */}
                    {myUserInfo?.role !== "customer" && (
                      <button
                        onClick={goToDashboard}
                        className="flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 text-[#242424] font-bold cursor-pointer"
                      >
                        <LayoutDashboard size={16} className="text-[#e4002b]" />{" "}
                        Dashboard
                      </button>
                    )}

                    {/* ปุ่ม Edit Info */}
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate("/account");
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 text-[#242424] cursor-pointer"
                    >
                      <Settings size={16} /> Edit Info
                    </button>

                    {/* ปุ่ม Order History */}
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate("/order-history");
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 text-[#242424] cursor-pointer"
                    >
                      <History size={16} /> Order History
                    </button>

                    {/* ปุ่ม Sign Out */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-left hover:bg-[#e4002b] hover:text-white text-red-600 font-bold border-t-2 border-gray-100 mt-1 cursor-pointer"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
>>>>>>> a2b49ff5228bf84842249119fa533d00a0660ede
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-secondary hover:bg-[#e4002b] text-neutral px-6 py-2 rounded-full font-semibold transition duration-300 font-['Bebas_Neue'] text-xl tracking-wider shadow-md"
              >
                SIGN IN
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Cart Icon (Mobile) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-neutral cursor-pointer border-none bg-transparent"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#e4002b] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center transform translate-x-1/4 -translate-y-1/4 shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-neutral cursor-pointer"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Content */}
      <div
        className={`${isMenuOpen ? "block" : "hidden"} md:hidden bg-primary border-t border-accent/20`}
      >
        <ul className="flex flex-col p-4 space-y-4 font-['Bebas_Neue'] text-xl tracking-wider">
          <li>
            <Link to="/" className="block hover:text-[#e4002b]">
              HOME
            </Link>
          </li>
          <li>
            <Link to="/menu" className="block hover:text-[#e4002b]">
              MENU
            </Link>
          </li>
          <li>
            <Link to="/order" className="block hover:text-[#e4002b]">
              ORDER
            </Link>
          </li>

          {isLoggedInUser ? (
            <>
              {/* ซ่อนปุ่ม Order History ในมือถือ ถ้าไม่ใช่ Customer */}
              {(!myUserInfo.role || myUserInfo.role === "customer") && (
                <li>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/order-history");
                    }}
                    className="block text-left w-full hover:text-[#e4002b] cursor-pointer"
                  >
                    ORDER HISTORY
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="block text-red-500 w-full text-left cursor-pointer"
                >
                  SIGN OUT
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/login"
                className="block text-center w-full bg-[#242424] text-white py-3 rounded-lg"
              >
                SIGN IN
              </Link>
            </li>
          )}
        </ul>
      </div>

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        userInfo={myUserInfo}
      />
    </header>
  );
};

export default Navbarmenu;
