// src/component/Navbarmenu.jsx
import { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  User,
  LogOut,
  Settings,
  History,
  LayoutDashboard,
  Drumstick
} from "lucide-react";
import Logo from "../assets/picture/Logo.png";
import Slogan from "../assets/picture/slogan.png";
import EditProfileModal from "../pages/shared/EditProfileModal";

// Import Context
import { UserContext } from "../context/userContext/UserContext";
import { useShop } from "../context/ShopProvider";
import { redirectToOwnerApp } from "../utils/navigation";
import { orderService } from "../services/orderService";
import { filterOrdersForUser, isPastOrderStatus } from "../utils/customerOrders";

// Import Separated Sub-Components
import OrderStatusPopup from "./customer/OrderStatusPopup";
import ProfileDropdown from "./customer/ProfileDropdown";

const Navbarmenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrderStatusOpen, setIsOrderStatusOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [ongoingOrders, setOngoingOrders] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { myUserInfo, setMyUserInfo } = useContext(UserContext);
  const { cartCount, setIsCartOpen } = useShop();

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

  const isDashboardPage =
    location.pathname.startsWith("/cashier") ||
    location.pathname.startsWith("/cookBoard") ||
    location.pathname.startsWith("/cook/ingredients") ||
    location.pathname.startsWith("/driver") ||
    location.pathname.startsWith("/shared") ||
    location.pathname.startsWith("/owner");

  const isLoggedInUser = !!myUserInfo;

  // 🛡️ ตัวแปรเช็คว่าเป็นพนักงานหรือไม่ (ถ้าเป็นพนักงาน จะเอาไปใช้ซ่อนปุ่มตะกร้า/สั่งอาหาร)
  const isStaff = myUserInfo?.role && myUserInfo.role !== "customer";

  useEffect(() => {
    if (!isLoggedInUser || isStaff || isDashboardPage) {
      setOngoingOrders([]);
      return;
    }

    let isMounted = true;
    const fetchOngoingOrders = async () => {
      try {
        const orders = await orderService.getOrders();
        if (!isMounted) return;
        setOngoingOrders(
          filterOrdersForUser(orders, myUserInfo).filter(
            (order) => !isPastOrderStatus(order.status),
          ),
        );
      } catch (error) {
        console.error("Failed to fetch ongoing orders:", error);
        if (isMounted) setOngoingOrders([]);
      }
    };

    fetchOngoingOrders();
    const interval = setInterval(fetchOngoingOrders, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isDashboardPage, isLoggedInUser, isStaff, myUserInfo]);

  // Rules of Hooks: Conditional return must come AFTER all hooks
  if (
    location.pathname.startsWith("/rider") ||
    location.pathname.startsWith("/driver") ||
    location.pathname.startsWith("/rider-tracking") ||
    isDashboardPage
  ) {
    return null;
  }

  const handleLogout = () => {
    setMyUserInfo(null);
    setOngoingOrders([]);
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  const goToDashboard = () => {
    setIsProfileOpen(false);
    if (myUserInfo?.role === "owner") {
      redirectToOwnerApp();
    } else if (myUserInfo?.role === "cook") navigate("/cookBoard");
    else if (myUserInfo?.role === "cashier") navigate("/cashier/orders");
    else if (myUserInfo?.role === "rider") navigate("/driver");
    else navigate("/menu");
  };

  const ongoingOrdersCount = ongoingOrders.length;

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
            {/* ซ่อนเมนู Order จากพนักงาน */}
            {!isStaff && (
              <li>
                <Link
                  to="/order"
                  className="hover:text-[#e4002b] transition duration-300"
                >
                  Order
                </Link>
              </li>
            )}
          </ul>

          <div className="flex items-center space-x-4 border-l-2 border-neutral/20 pl-6 ml-2 relative">
            {/* ซ่อน Order Status Icon จากพนักงาน */}
            {isLoggedInUser && !isStaff && (
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
                  orders={ongoingOrders}
                  navigate={navigate}
                  onClose={() => setIsOrderStatusOpen(false)}
                />
              </div>
            )}

            {/* ซ่อน Cart Icon (Desktop) จากพนักงาน */}
            {!isStaff && (
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
            )}

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
          {/* ซ่อน Cart Icon (Mobile) จากพนักงาน */}
          {!isStaff && (
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
          )}

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

          {/* ซ่อนเมนู Order จากพนักงานในมือถือ */}
          {!isStaff && (
            <li>
              <Link to="/order" className="block hover:text-[#e4002b]">
                ORDER
              </Link>
            </li>
          )}

          {isLoggedInUser ? (
            <>
              {/* ซ่อนปุ่ม Order History ในมือถือ ถ้าไม่ใช่ Customer */}
              {!isStaff && (
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
