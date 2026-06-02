import { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

// Components
import Navbarmenu from "./component/Navbarmenu";
import CartSidebar from "./component/customer/CartSidebar";
import LoginModal from "./component/LoginModal";
import CookBoard from "./pages/CookBoard";
import CookIngredientDashboard from "./pages/CookIngredientDashboard";
import IndexPage from "./pages/customer/IndexPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CheckoutPage from "./pages/cashier/CheckOutPage";
import TableMap from "./pages/shared/TableMap";
import OrderList from "./pages/cashier/OrderList";
import OrderHistory from "./pages/cashier/OrderHistory";
import SettingsMockup from "./pages/cashier/SettingsMockup";
import MenuPage from "./pages/customer/MenuPage";
import PaymentPage from "./pages/customer/PaymentPage";
import OrderPage from "./pages/customer/OrderPage";
import OrderHistoryPage from "./pages/customer/OrderHistoryPage";
import BookingPage from "./pages/customer/BookingPage";
import CustomerAccountPage from "./pages/customer/CustomerAccountPage";
import OrderTrackingPage from "./pages/customer/OrderTrackingPage";
import OrderStatusPage from "./pages/customer/OrderStatusPage";
import ReservePage from "./pages/customer/ReservePage";
import ProtectedRoute from "./component/ProtectedRoute";
import OwnerAppFeature from "./owner-app-feature/OwnerAppFeature";

// Rider Components
import DriverDashboard from "./component/rider/DriverDashboard";
import OrderDetail from "./component/rider/OrderDetail";
import DeliveryHistory from "./component/rider/DeliveryHistory";

// Contexts
import { UserContext } from "./context/userContext/UserContext";
import { useShop } from "./context/ShopProvider";
import { redirectToOwnerApp } from "./utils/navigation";
import { loginAPI } from "./services/authService";

// ==========================================
//  Global Cart Sidebar Manager
// ==========================================
const GlobalCartSidebar = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQty,
    setIsLoginModalOpen,
  } = useShop();
  const location = useLocation();

  // Hide on owner dashboard
  if (location.pathname.startsWith("/owner")) return null;

  return (
    <CartSidebar
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      cartItems={cart}
      onUpdateQty={updateCartQty}
      onOpenLoginModal={() => setIsLoginModalOpen(true)}
    />
  );
};

// ==========================================
//  Global Login Modal Manager
// ==========================================
const GlobalLoginModal = () => {
  const { isLoginModalOpen, setIsLoginModalOpen } = useShop();
  return (
    <LoginModal
      isOpen={isLoginModalOpen}
      onClose={() => setIsLoginModalOpen(false)}
    />
  );
};

// ==========================================
// Global Role Guard
// ดัก Cook, Rider และ Cashier ไม่ให้หลุดไปหน้าของ Customer
// ==========================================
const GlobalRoleGuard = () => {
  const { myUserInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 🚦 1. หน้าที่สงวนไว้ให้ "ลูกค้าที่แท้จริง" เท่านั้น (พนักงานห้ามเข้าเด็ดขาด)
    const customerOnlyPaths = [
      "/order",
      "/payment",
      "/booking",
      "/account",
      "/order-tracking",
      "/order-history",
    ];

    // 🚦 2. หน้าสำหรับคนที่ "ยังไม่ล็อกอิน" (ถ้าล็อกอินเป็นพนักงานแล้ว ไม่ควรกลับมาหน้า Login อีก)
    const guestOnlyPaths = ["/login", "/register"];

    const isStaff = myUserInfo?.role && myUserInfo.role !== "customer";
    const currentPath = location.pathname;

    if (isStaff) {
      // ถ้าพนักงานพยายามแอบเข้าหน้าทำรายการของลูกค้า หรือหน้า Login/Register ซ้ำ
      if (
        customerOnlyPaths.includes(currentPath) ||
        guestOnlyPaths.includes(currentPath)
      ) {
        // เตะกลับไปหน้าทำงาน (Dashboard) ของแต่ละตำแหน่งทันที
        if (myUserInfo.role === "owner") {
          redirectToOwnerApp();
        } else if (myUserInfo.role === "cook") {
          navigate("/cookBoard", { replace: true });
        } else if (myUserInfo.role === "rider") {
          navigate("/driver", { replace: true });
        } else if (myUserInfo.role === "cashier") {
          navigate("/cashier/orders", { replace: true });
        }
      }
    }
  }, [myUserInfo, location.pathname, navigate]);

  return null;
};
// ==========================================
// Component สำหรับ Dev Mode
// ==========================================
const DevRoleSwitcher = () => {
  const userCtx = useContext(UserContext);
  const location = useLocation();
  if (!userCtx) return null;
  if (!import.meta.env.DEV) return null;

  // Hide on owner dashboard to avoid clutter
  if (location.pathname.startsWith("/owner")) return null;

  const { setMyUserInfo } = userCtx;
  const devAccounts = {
    customer: ["red@gmail.com", "red12345"],
    owner: ["owner@spc.com", "owner123"],
    cook: ["cook@gmail.com", "cook123"],
    cashier: ["cashier@spc.com", "cashier123"],
    rider: ["rider@spc.com", "rider123"],
  };

  const switchRole = async (role) => {
    const [email, password] = devAccounts[role];
    try {
      setMyUserInfo(await loginAPI(email, password));
    } catch (error) {
      console.error(`Dev login failed for ${role}:`, error);
      window.alert(`Dev login failed for ${role}. Run the user seed script and try again.`);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 bg-black/80 text-white p-3 z-9999 flex gap-3 text-sm rounded-tl-xl border-t-2 border-l-2 border-[#e4002b] shadow-2xl backdrop-blur-sm">
      <span className="font-black text-yellow-400 font-['Bebas_Neue'] tracking-wider">
        DEV MODE :
      </span>
      <button
        className="hover:text-[#e4002b] transition-colors font-bold cursor-pointer"
        onClick={() => switchRole("customer")}
      >
        Customer
      </button>
      <span className="opacity-30">|</span>
      <button
        className="hover:text-[#e4002b] transition-colors font-bold cursor-pointer"
        onClick={() => switchRole("owner")}
      >
        Owner
      </button>
      <span className="opacity-30">|</span>
      <button
        className="hover:text-[#e4002b] transition-colors font-bold cursor-pointer"
        onClick={() => switchRole("cook")}
      >
        Cook
      </button>
      <span className="opacity-30">|</span>
      <button
        className="hover:text-[#e4002b] transition-colors font-bold cursor-pointer"
        onClick={() => switchRole("cashier")}
      >
        Cashier
      </button>
      <span className="opacity-30">|</span>
      <button
        className="hover:text-[#e4002b] transition-colors font-bold cursor-pointer"
        onClick={() => switchRole("rider")}
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
      <GlobalRoleGuard /> {/* 👈 ใช้ Component ที่อัปเกรดแล้ว */}
      <Navbarmenu />
      <GlobalCartSidebar />
      <GlobalLoginModal />
      <DevRoleSwitcher />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<IndexPage />} />
        <Route path="/home" element={<IndexPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* OWNER FEATURE (INTEGRATED) */}
        <Route path="/owner/*" element={<OwnerAppFeature />} />
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
          path="/account"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerAccountPage />
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
        <Route
          path="/order-status"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <OrderStatusPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reserve"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <ReservePage />
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
        />{" "}
        {/* 👈 เพิ่มหน้า History ฝั่ง Customer เข้าไปในนี้ด้วย */}
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
        <Route
          path="/cook/ingredients"
          element={
            <ProtectedRoute allowedRoles={["cook"]}>
              <CookIngredientDashboard />
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
        <Route
          path="/cashier/settings"
          element={
            <ProtectedRoute allowedRoles={["cashier"]}>
              <SettingsMockup />
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
