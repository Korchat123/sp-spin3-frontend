import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

// Components
import Navbarmenu from "./component/Navbarmenu";
import CartSidebar from "./component/customer/CartSidebar"; // ✅ 1. Import CartSidebar
import CookBoard from "./pages/CookBoard";
import IndexPage from "./pages/customer/IndexPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CheckoutPage from "./pages/cashier/CheckOutPage";
import TableMap from "./pages/shared/TableMap";
import OrderList from "./pages/cashier/OrderList";
import OrderHistory from "./pages/cashier/OrderHistory";
import MenuPage from "./pages/customer/MenuPage";
import PaymentPage from "./pages/customer/PaymentPage";
import OrderPage from "./pages/customer/OrderPage";
import BookingPage from "./pages/customer/BookingPage";
import OrderHistoryPage from "./pages/customer/OrderHistoryPage";
import Reserve from "./component/Reserve";
import OrderTrackingPage from "./pages/customer/OrderTrackingPage";
import ProtectedRoute from "./component/ProtectedRoute";

// Rider Components
import DriverDashboard from "./component/rider/DriverDashboard";
import OrderDetail from "./component/rider/OrderDetail";
import DeliveryHistory from "./component/rider/DeliveryHistory";

// Contexts
import { UserContext } from "./context/userContext/UserContext";
import { useShop } from "./context/ShopProvider"; // ✅ 2. Import useShop Context

// ==========================================
//  Global Cart Sidebar Manager
// ทำหน้าที่ซิงค์ข้อมูลตะกร้าให้แสดงผลได้จากทุกหน้า
// ==========================================
const GlobalCartSidebar = () => {
  const { isCartOpen, setIsCartOpen } = useShop();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("crispyCart");
    return saved ? JSON.parse(saved) : [];
  });

  // คอยดักจับว่ามีการเพิ่ม/ลด สินค้าจากหน้าอื่นหรือไม่ (เช่น จาก MenuPage หรือ OrderHistory)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("crispyCart");
      setCartItems(saved ? JSON.parse(saved) : []);
    };

    // ดักฟังทั้ง Event มาตรฐานและ Event ที่เราสร้างเอง
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleStorageChange);
    };
  }, []);

  // ฟังก์ชันอัปเดตจำนวนสินค้า
  const handleUpdateQty = (id, delta) => {
    const updatedCart = cartItems
      .map((item) => {
        if (item.id === id) return { ...item, qty: item.qty + delta };
        return item;
      })
      .filter((item) => item.qty > 0);

    setCartItems(updatedCart);
    localStorage.setItem("crispyCart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated")); // ส่งสัญญาณไปบอกหน้าอื่นๆ ว่าตะกร้าเปลี่ยน
  };

  return (
    <CartSidebar
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      cartItems={cartItems}
      onUpdateQty={handleUpdateQty}
    />
  );
};

// ==========================================
// Component for global Cook redirection on public routes
// ==========================================
const GlobalCookGuard = () => {
  const { myUserInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const publicPaths = ["/", "/home", "/menu", "/login", "/register"];
    if (
      myUserInfo?.role === "cook" &&
      publicPaths.includes(location.pathname)
    ) {
      navigate("/cookBoard", { replace: true });
    } else if (
      myUserInfo?.role === "rider" &&
      location.pathname !== "/driver"
    ) {
      navigate("/driver", { replace: true });
    }
  }, [myUserInfo, location.pathname, navigate]);

  return null;
};

// ==========================================
// Component สำหรับ Dev Mode
// ==========================================
const DevRoleSwitcher = () => {
  const userCtx = useContext(UserContext);
  if (!userCtx) return null;
  if (!import.meta.env.DEV) return null;

  const { setMyUserInfo } = userCtx;

  return (
    <div className="fixed bottom-0 right-0 bg-black/80 text-white p-3 z-9999 flex gap-3 text-sm rounded-tl-xl border-t-2 border-l-2 border-[#e4002b] shadow-2xl backdrop-blur-sm">
      <span className="font-black text-yellow-400 font-['Bebas_Neue'] tracking-wider">
        DEV MODE :
      </span>
      <button
        className="hover:text-[#e4002b] transition-colors font-bold cursor-pointer"
        onClick={() =>
          setMyUserInfo({ role: "customer", name: "Dev Customer" })
        }
      >
        Customer
      </button>
      <span className="opacity-30">|</span>
      <button
        className="hover:text-[#e4002b] transition-colors font-bold cursor-pointer"
        onClick={() => setMyUserInfo({ role: "cook", name: "Dev Cook" })}
      >
        Cook
      </button>
      <span className="opacity-30">|</span>
      <button
        className="hover:text-[#e4002b] transition-colors font-bold cursor-pointer"
        onClick={() => setMyUserInfo({ role: "cashier", name: "Dev Cashier" })}
      >
        Cashier
      </button>
      <span className="opacity-30">|</span>
      <button
        className="hover:text-[#e4002b] transition-colors font-bold cursor-pointer"
        onClick={() => setMyUserInfo({ role: "rider", name: "Dev Rider" })}
      >
        Rider
      </button>
      <span className="opacity-30">|</span>
      <button
        className="text-red-400 hover:text-red-500 transition-colors font-bold cursor-pointer"
        onClick={() => setMyUserInfo(null)}
      >
        Clear
      </button>
    </div>
  );
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  return (
    <Router>
      <GlobalCookGuard />
      <Navbarmenu />
      <GlobalCartSidebar /> {/* ✅ 3. วาง Global Cart ไว้ใต้ Navbar เลย */}
      <DevRoleSwitcher />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<IndexPage />} />
        <Route path="/home" element={<IndexPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* CUSTOMER ROUTES */}
        <Route
          path="/order"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <OrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-history"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-tracking"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <OrderTrackingPage />
            </ProtectedRoute>
          }
        />

        {/* RIDER ROUTES */}
        <Route
          path="/driver"
          element={
            <ProtectedRoute allowedRoles={["rider"]}>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/order/:orderId"
          element={
            <ProtectedRoute allowedRoles={["rider"]}>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/history"
          element={
            <ProtectedRoute allowedRoles={["rider"]}>
              <DeliveryHistory />
            </ProtectedRoute>
          }
        />

        {/* COOK ROUTES */}
        <Route
          path="/cookBoard"
          element={
            <ProtectedRoute allowedRoles={["cook"]}>
              <CookBoard />
            </ProtectedRoute>
          }
        />

        {/* CASHIER ROUTES */}
        <Route
          path="/cashier/checkout"
          element={
            <ProtectedRoute allowedRoles={["cashier"]}>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cashier/orders"
          element={
            <ProtectedRoute allowedRoles={["cashier"]}>
              <OrderList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cashier/history"
          element={
            <ProtectedRoute allowedRoles={["cashier"]}>
              <OrderHistory />
            </ProtectedRoute>
          }
        />

        {/* SHARED ROUTES */}
        <Route
          path="/shared/tables"
          element={
            <ProtectedRoute allowedRoles={["cashier"]}>
              <TableMap />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
