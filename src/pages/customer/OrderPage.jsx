import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { OrdersContext } from "../../context/ordersContext/OrdersContext";
import { UserContext } from "../../context/userContext/UserContext";
import { useShop } from "../../context/ShopProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Trash2, 
  PlusCircle, 
  MessageSquare, 
  ShoppingCart, 
  Bike, 
  Store, 
  Utensils, 
  Check, 
  // AlertCircle, 
  Info, 
  UploadCloud, 
  ShieldCheck, 
  // CreditCard, 
  RefreshCw 
} from "lucide-react";

// --- รายการสินค้าในตะกร้า (Middle Panel Item Component) ---
const OrderItem = ({ item, orderId, onUpdateQty, onRemove, onEdit, isSelected, onUpdateNote }) => {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [tempNote, setTempNote] = useState(item.note || "");

  // Sync tempNote if item.note changes externally
  useEffect(() => {
    setTempNote(item.note || "");
  }, [item.note]);

  const handleSave = (e) => {
    e.stopPropagation();
    onUpdateNote(item.id, tempNote);
    setIsEditingNote(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setTempNote(item.note || "");
    setIsEditingNote(false);
  };

  return (
    <div
      className={`flex flex-col p-4 rounded-3xl transition-all duration-300 ease-in-out cursor-pointer mb-3
        ${isSelected 
          ? 'bg-[#FDE68A] border-2 border-[#242424] shadow-[4px_4px_0_#242424]' 
          : 'bg-[#ffffff] border-2 border-[#e5e7eb] hover:border-[#242424] hover:shadow-[4px_4px_0_#242424]'}`}
      onClick={() => onEdit(item)}
    >
      {/* Upper Section */}
      <div className="flex items-center justify-between gap-4 ">
        {/* Left Side: Image + Info */}
        <div className="flex items-center gap-4 min-w-0">
          {/* Squircle Image Container */}
          <div className="w-16 h-16 rounded-[24px] overflow-hidden bg-[#eeeeee] border-2 border-[#242424] shrink-0 flex items-center justify-center shadow-[2px_2px_0_#242424]">
            <img 
              src={item.img || item.image} 
              alt={item.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://placehold.co/100x100/eeeeee/242424?text=FOOD";
              }}
            />
          </div>
          
          <div className="min-w-0">
            <h3 className="font-bold text-[#242424] text-base font-['IBM_Plex_Sans_Thai'] break-words leading-tight">
              {item.name}
            </h3>
            <p className="text-sm font-bold text-[#e4002b] font-['IBM_Plex_Sans_Thai'] mt-1">
              {item.price ? `${(item.price * item.quantity).toLocaleString()} THB` : "TBA"}
            </p>
            <span className="text-[10px] text-[#DC5F00] font-black uppercase tracking-wider mt-1 block">
              {item.size || 'REGULAR'}
            </span>
          </div>
        </div>
        
        {/* Right Side: Qty Controls + Trash */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Qty Control สไตล์ Brutalist */}
          <div className="flex items-center bg-[#ffffff] rounded-xl border-2 border-[#242424] overflow-hidden shadow-[2px_2px_0_#242424]" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => onUpdateQty(item.id, -1)} 
              className="w-8 h-8 flex items-center justify-center hover:bg-[#eeeeee] text-[#242424] font-bold border-r-2 border-[#242424] cursor-pointer"
              disabled={item.quantity <= 1}
            > - </button>
            <span className="w-8 text-center font-bold text-[#242424] text-sm font-['Bebas_Neue']">{item.quantity}</span>
            <button 
              onClick={() => onUpdateQty(item.id, 1)} 
              className="w-8 h-8 flex items-center justify-center hover:bg-[#eeeeee] text-[#242424] font-bold border-l-2 border-[#242424] cursor-pointer"
            > + </button>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); onRemove(item.id); }} 
            className="p-2.5 bg-[#ffffff] border border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-500 transition-colors shrink-0 cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Divider and Note Bottom row */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
        {!isEditingNote ? (
          <div className="flex items-center justify-between gap-2">
            <div 
              onClick={() => setIsEditingNote(true)}
              className="flex items-center gap-2 text-xs text-[#DC5F00] font-bold cursor-pointer hover:opacity-80 transition-opacity"
            >
              <MessageSquare size={14} className="shrink-0" />
              <span className="truncate max-w-[240px]">
                {item.note || 'เพิ่มคำขอพิเศษ (เช่น ไม่เผ็ด, แยกผัก)'}
              </span>
            </div>
            <button
              onClick={() => setIsEditingNote(true)}
              className="text-xs text-gray-400 hover:text-[#242424] hover:underline font-bold transition-all cursor-pointer"
            >
              แก้ไข
            </button>
          </div>
        ) : (
          <div className="space-y-2 w-full">
            <textarea
              rows={2}
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              placeholder="ใส่โน้ตสำหรับเมนูนี้ (เช่น ไม่เผ็ด, ขอซอสเพิ่ม)..."
              className="w-full bg-[#fcfcfc] text-xs font-semibold text-[#242424] border-2 border-[#242424] rounded-xl p-2.5 focus:outline-none focus:border-[#DC5F00] resize-none leading-relaxed font-['IBM_Plex_Sans_Thai'] shadow-[2px_2px_0_#242424]"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="px-3 py-1.5 bg-[#DC5F00] hover:bg-[#c25400] text-white rounded-lg text-[10px] font-black uppercase border-2 border-black shadow-[2px_2px_0_#000] hover:shadow-none hover:translate-y-0.5 transition-all cursor-pointer"
              >
                บันทึก
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-[10px] font-black uppercase border border-gray-300 cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const OrderPage = () => {
  const { orderList } = useContext(OrdersContext);
  const { myUserInfo } = useContext(UserContext);
  const { cart, setCart, updateCartQty, selectedBranch, selectBranch } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [customizingItem, setCustomizingItem] = useState(null);

  // --- EAT TYPE SELECTION ---
  const [eatType, setEatType] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    let type = params.get("type");
    if (!type) {
      type = localStorage.getItem("selectedOrderType");
    }
    if (type === "pickup") return "pickup";
    if (type === "delivery") return "delivery";
    if (type === "reserve") return "reserve";
    return null; // gray defaults
  });

  // Sync eatType from URL search query params or localStorage on mount/update
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let type = params.get("type");
    if (!type) {
      type = localStorage.getItem("selectedOrderType");
    }
    if (type === "pickup" || type === "delivery" || type === "reserve") {
      setEatType(type);
      localStorage.removeItem("selectedOrderType");
    }
  }, [location.search]);

  // --- DELIVERY STATE ---
  const [deliveryAddress, setDeliveryAddress] = useState({
    tag: "Home",
    firstname: myUserInfo?.name || "Somchai",
    lastname: myUserInfo?.surname || "Jaidee",
    address: myUserInfo?.address || "123/45 Sukhumvit Rd, Khlong Toei, Bangkok 10110"
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({ ...deliveryAddress });

  // --- PICKUP STATE ---
  // selectedBranch is pulled from useShop context, we can default to "branch1" if not selected
  useEffect(() => {
    if (!selectedBranch) {
      selectBranch("branch1");
    }
  }, [selectedBranch, selectBranch]);

  const formattedBranchName = useMemo(() => {
    if (selectedBranch === "branch1") return "Asok Branch (HQ)";
    if (selectedBranch === "branch2") return "Siam Branch";
    return selectedBranch || "Asok Branch (HQ)";
  }, [selectedBranch]);

  const [pickupDate, setPickupDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [pickupTime, setPickupTime] = useState("13:00 - 13:30");

  // --- RESERVE STATE ---
  const [reserveDate, setReserveDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [reserveTime, setReserveTime] = useState("13:00-15:00");
  const [reserveMembers, setReserveMembers] = useState("1-2P");
  const [reserveComment, setReserveComment] = useState("");
  const [tableState, setTableState] = useState("checking"); // checking, free, reserve

  // --- PAYMENT STATE ---
  const [paymentMethod, setPaymentMethod] = useState(null); // null, credit, promptpay, cash
  const [creditCard, setCreditCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });
  const [uploadedSlip, setUploadedSlip] = useState(null); // File object URL for preview
  const [uploadedSlipFile, setUploadedSlipFile] = useState(null);

  // --- POLLING & SECURE PROGRESS ---
  const [isPolling, setIsPolling] = useState(false);
  const [pollingStep, setPollingStep] = useState(0);
  const pollingMessages = [
    "Establishing secure connection...",
    "Sending transaction payload... ⏳",
    "Verifying payment slip details...",
    "Order verified! Preparing receipt..."
  ];

  // Helper Cart list mapping
  const cartItems = useMemo(() => {
    return orderList && orderList[0] ? orderList[0].orderList || orderList[0].List || [] : [];
  }, [orderList]);

  // Sync address form when user info or delivery info changes
  useEffect(() => {
    if (myUserInfo) {
      setDeliveryAddress(prev => ({
        ...prev,
        firstname: myUserInfo.name || prev.firstname,
        lastname: myUserInfo.surname || prev.lastname,
        address: myUserInfo.address || prev.address
      }));
    }
  }, [myUserInfo]);

  useEffect(() => {
    setAddressForm({ ...deliveryAddress });
  }, [deliveryAddress]);

  // Calculate Subtotals
  const subTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  }, [cartItems]);

  const tax = subTotal * 0.07;
  const netTotal = subTotal + tax;

  // Reservation Unlock Thresholds
  const isOneTwoUnlocked = subTotal >= 600;
  const isThreeSixUnlocked = subTotal >= 1200;
  const isSevenTenUnlocked = subTotal >= 2500;

  // Reserve warning check: Is the order below the required minimum for the selected tier?
  const isReserveBelowMinimum = useMemo(() => {
    if (eatType !== "reserve") return false;
    if (reserveMembers === "1-2P" && subTotal < 600) return true;
    if (reserveMembers === "3-6P" && subTotal < 1200) return true;
    if (reserveMembers === "7-10P" && subTotal < 2500) return true;
    return false;
  }, [eatType, reserveMembers, subTotal]);

  // Handle table state checking simulation
  useEffect(() => {
    if (eatType !== "reserve") return;
    
    // Default to checking if requirements not met
    const currentTierLocked = 
      (reserveMembers === "1-2P" && !isOneTwoUnlocked) ||
      (reserveMembers === "3-6P" && !isThreeSixUnlocked) ||
      (reserveMembers === "7-10P" && !isSevenTenUnlocked) ||
      (reserveMembers === "11+");

    if (currentTierLocked) {
      setTableState("checking");
      return;
    }

    setTableState("checking");
    const timer = setTimeout(() => {
      // Simulate 80% free, 20% reserved
      const outcome = Math.random() > 0.2 ? "free" : "reserve";
      setTableState(outcome);
    }, 1500);

    return () => clearTimeout(timer);
  }, [eatType, reserveDate, reserveTime, reserveMembers, subTotal, isOneTwoUnlocked, isThreeSixUnlocked, isSevenTenUnlocked]);

  // Auto-adjust selected seat tier if spend falls below requirements
  useEffect(() => {
    if (eatType === "reserve") {
      if (reserveMembers === "7-10P" && subTotal < 2500) {
        if (subTotal >= 1200) setReserveMembers("3-6P");
        else if (subTotal >= 600) setReserveMembers("1-2P");
      }
      if (reserveMembers === "3-6P" && subTotal < 1200) {
        if (subTotal >= 600) setReserveMembers("1-2P");
      }
    }
  }, [subTotal, eatType, reserveMembers]);

  // Sync quantities to Shop Context Cart
  const handleUpdateQty = useCallback((itemId, change) => {
    updateCartQty(itemId, change);
  }, [updateCartQty]);

  // Sync remove to Shop Context Cart
  const handleRemove = useCallback((itemId) => {
    if (window.confirm("ลบรายการนี้ออกจากตะกร้า?")) {
      setCart(prev => prev.filter(i => i.id !== itemId));
      if (customizingItem?.id === itemId) setCustomizingItem(null);
    }
  }, [customizingItem, setCart]);

  // Handle note updates from summary items
  const handleUpdateNote = useCallback((itemId, newNote) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, note: newNote };
      }
      return item;
    }));
  }, [setCart]);

  // Address editing saves
  const handleSaveAddress = () => {
    if (!addressForm.firstname || !addressForm.lastname || !addressForm.address) {
      alert("กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน");
      return;
    }
    setDeliveryAddress({ ...addressForm });
    setIsEditingAddress(false);
  };

  // Slip upload handlers
  const handleSlipChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedSlipFile(file);
      setUploadedSlip(URL.createObjectURL(file));
    }
  };

  const handleSlipDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedSlipFile(file);
      setUploadedSlip(URL.createObjectURL(file));
    }
  };

  // ORDER SUBMIT & Simulated verification polling
  const handleOrderSubmit = () => {
    if (cartItems.length === 0) {
      alert("กรุณาเลือกรายการอาหารก่อน");
      return;
    }
    if (!eatType) {
      alert("กรุณาเลือกประเภทการสั่งซื้อที่แถบด้านซ้าย");
      return;
    }
    if (!paymentMethod) {
      alert("กรุณาเลือกวิธีการชำระเงินที่แถบด้านขวา");
      return;
    }
    if (paymentMethod === "promptpay" && !uploadedSlip) {
      alert("กรุณาอัปโหลดสลิปเพื่อยืนยันการโอนเงิน");
      return;
    }
    if (isReserveBelowMinimum) {
      alert("ยอดรวมออเดอร์ยังไม่ถึงเกณฑ์ที่กำหนดสำหรับโต๊ะนี้");
      return;
    }
    if (eatType === "reserve" && tableState !== "free") {
      alert("🙏 ขออภัย ขณะนี้โต๊ะถูกจองเต็มแล้ว\nกรุณาเลือกบริการรูปแบบอื่น หรือเลือกช่วงเวลาใหม่อีกครั้ง 🍗");
      return;
    }

    // Trigger Polling animation
    setIsPolling(true);
    setPollingStep(0);
  };

  // Run Polling simulation progress steps
  useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(() => {
      setPollingStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          // Complete and Redirect
          setTimeout(() => {
            setIsPolling(false);
            
            // Clear cart globally
            setCart([]);
            localStorage.removeItem("crispyCart");
            window.dispatchEvent(new Event("cartUpdated"));

            const namesList = cartItems.map(item => `${item.name} x${item.quantity}${item.note ? ` (Note: ${item.note})` : ''}`);
            const randomCode = Math.floor(100000 + Math.random() * 900000);

            if (eatType === "delivery" || eatType === "pickup") {
              navigate("/order-status", {
                state: {
                  orderNo: `#SP-${randomCode}`,
                  status: "Preparing your food",
                  timeDelivery: eatType === "delivery" ? "As soon as possible (~30 mins)" : `${pickupDate} (${pickupTime})`,
                  menuList: namesList,
                  totalPrice: netTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                  contact: myUserInfo?.phone || "081-234-5678",
                  address: eatType === "delivery" ? `${deliveryAddress.firstname} ${deliveryAddress.lastname} - ${deliveryAddress.address}` : `${formattedBranchName}`,
                  eatType: eatType === "delivery" ? "Delivery" : "Pickup"
                }
              });
            } else if (eatType === "reserve") {
              navigate("/reserve", {
                state: {
                  tableNo: `#RES-${randomCode}`,
                  detail: `${formattedBranchName}`,
                  person: reserveMembers,
                  date: reserveDate,
                  time: reserveTime,
                  comment: reserveComment || "No special requests",
                  menuList: namesList,
                  totalPrice: netTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                }
              });
            }
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPolling, eatType, cartItems, netTotal, selectedBranch, pickupDate, pickupTime, reserveMembers, reserveDate, reserveTime, reserveComment, deliveryAddress, myUserInfo, navigate, setCart]);

  return (
    <div className="pt-24 pb-20 bg-[#eeeeee] min-h-screen text-[#242424] font-['IBM_Plex_Sans_Thai'] relative overflow-hidden">
      
      {/* Background accents */}
      <div className="absolute top-10 left-10 w-16 h-4 bg-[#FBCFE8] rounded-full rotate-45 -z-10 opacity-70"></div>
      <div className="absolute top-40 right-20 w-12 h-4 bg-[#A7F3D0] rounded-full -rotate-12 -z-10 opacity-70"></div>
      <div className="absolute bottom-40 left-1/4 w-20 h-5 bg-[#FFDAB9] rounded-full rotate-60 -z-10 opacity-70"></div>

      <main className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Title */}
        {/* <div className="flex items-center gap-4 mb-8">
          <div className="flex gap-1 text-5xl font-['Bebas_Neue'] tracking-widest uppercase font-black drop-shadow-[4px_4px_0_#242424] text-[#e4002b]">
            <span className="rotate-[-4deg]">C</span>
            <span className="rotate-[4deg]">H</span>
            <span className="rotate-[-4deg]">E</span>
            <span className="rotate-[4deg]">C</span>
            <span className="rotate-[-4deg]">K</span>
            <span className="rotate-[4deg]">O</span>
            <span className="rotate-[-4deg]">U</span>
            <span className="rotate-[4deg]">T</span>
          </div>
        </div> */}

        {/* Unified 3-Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ============================================================== */}
          {/* PANEL 1 (LEFT): Eat Type Selector & Subcomponents (Col span 4) */}
          {/* ============================================================== */}
          <div className="lg:col-span-4 bg-white rounded-4xl p-6 border-4 border-[#242424] shadow-[8px_8px_0_#242424] space-y-6">
            <h2 className="text-2xl font-['Bebas_Neue'] tracking-widest uppercase border-b-2 border-[#eeeeee] pb-2 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-[#e4002b] rounded-full inline-block"></span>
              1. Setup Order Type
            </h2>

            {/* Type Selector Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {/* Delivery */}
              <button
                onClick={() => setEatType("delivery")}
                className={`py-3 px-1 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 font-bold border-2 border-[#242424] cursor-pointer
                  ${eatType === "delivery" 
                    ? "bg-[#DC5F00] text-white shadow-[4px_4px_0_#242424] -translate-y-1" 
                    : "bg-[#333333] text-gray-400 opacity-80 hover:bg-[#444] hover:opacity-100"}`}
              >
                <Bike size={20} className={eatType === "delivery" ? "animate-bounce" : ""} />
                <span className="font-['Bebas_Neue'] text-lg tracking-wider">DELIVERY</span>
              </button>

              {/* Pickup */}
              <button
                onClick={() => setEatType("pickup")}
                className={`py-3 px-1 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 font-bold border-2 border-[#242424] cursor-pointer
                  ${eatType === "pickup" 
                    ? "bg-[#DC5F00] text-white shadow-[4px_4px_0_#242424] -translate-y-1" 
                    : "bg-[#333333] text-gray-400 opacity-80 hover:bg-[#444] hover:opacity-100"}`}
              >
                <Store size={20} />
                <span className="font-['Bebas_Neue'] text-lg tracking-wider">PICK-UP</span>
              </button>

              {/* Reserve */}
              <button
                onClick={() => setEatType("reserve")}
                className={`py-3 px-1 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 font-bold border-2 border-[#242424] cursor-pointer
                  ${eatType === "reserve" 
                    ? "bg-[#DC5F00] text-white shadow-[4px_4px_0_#242424] -translate-y-1" 
                    : "bg-[#333333] text-gray-400 opacity-80 hover:bg-[#444] hover:opacity-100"}`}
              >
                <Utensils size={20} />
                <span className="font-['Bebas_Neue'] text-lg tracking-wider">RESERVE</span>
              </button>
            </div>

            {/* Subcomponents Details Box */}
            <div className="border-2 border-dashed border-gray-300 rounded-3xl p-4 min-h-60 bg-gray-50 flex flex-col justify-center">
              
              {/* Unchosen Placeholder */}
              {!eatType && (
                <div className="text-center text-gray-400 py-10">
                  <ShoppingCart size={40} className="mx-auto mb-3 opacity-30 animate-pulse" />
                  <p className="text-sm font-bold uppercase">Please select order type<br/>from the buttons above</p>
                </div>
              )}

              {/* DELIVERY SUBPANEL */}
              {eatType === "delivery" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-black text-sm uppercase text-[#DC5F00] tracking-wider">Delivery Details</h3>
                    <span className="text-[10px] bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full font-bold uppercase border border-red-200">Doorstep</span>
                  </div>

                  {/* Branch Display for Delivery */}
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">สาขาจัดส่ง (Shipping Branch)</label>
                    <select
                      value={selectedBranch || "branch1"}
                      disabled
                      className="w-full bg-[#eeeeee] text-[#242424]/60 border-2 border-black/40 rounded-xl p-2 text-xs font-bold cursor-not-allowed opacity-80"
                    >
                      <option value="branch1">Serious Fried Chicken สาขา อโศก (HQ) ✅</option>
                      <option value="branch2" disabled>Serious Fried Chicken สาขา สยาม (COMING SOON 🔒)</option>
                    </select>
                    {/* <p className="text-[10px] text-gray-500 mt-1 italic font-semibold">
                      * นำเข้าจากสาขาที่เลือกในหน้าเมนู ไม่สามารถแก้ไขได้ที่นี่ (Imported from Menu branch, cannot edit here)
                    </p> */}
                  </div>

                  {!isEditingAddress ? (
                    /* Default View Address */
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0_#242424]">
                        <span className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-md mb-2
                          ${deliveryAddress.tag === "Home" ? "bg-orange-100 text-orange-700 border border-orange-200" : ""}
                          ${deliveryAddress.tag === "Work" ? "bg-blue-100 text-blue-700 border border-blue-200" : ""}
                          ${deliveryAddress.tag === "Other" ? "bg-gray-100 text-gray-700 border border-gray-200" : ""}
                        `}>
                          📍 {deliveryAddress.tag}
                        </span>
                        <p className="font-black text-sm text-[#242424]">{deliveryAddress.firstname} {deliveryAddress.lastname}</p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed font-semibold">{deliveryAddress.address}</p>
                      </div>
                      <button
                        onClick={() => setIsEditingAddress(true)}
                        className="w-full py-2.5 bg-[#242424] text-white rounded-xl font-bold text-xs uppercase hover:bg-[#e4002b] shadow-[3px_3px_0_#eeeeee] hover:shadow-none hover:translate-y-0.5 transition-all duration-300"
                      >
                        ✏️ Change Address
                      </button>
                    </div>
                  ) : (
                    /* Edit View Address Form */
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Address Tag</label>
                        <div className="grid grid-cols-3 gap-1">
                          {["Home", "Work", "Other"].map(t => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setAddressForm({ ...addressForm, tag: t })}
                              className={`py-1.5 rounded-lg border-2 border-black text-xs font-black
                                ${addressForm.tag === t ? "bg-[#DC5F00] text-white" : "bg-white text-black hover:bg-gray-100"}`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Firstname</label>
                          <input
                            type="text"
                            value={addressForm.firstname}
                            onChange={(e) => setAddressForm({ ...addressForm, firstname: e.target.value })}
                            className="w-full border-2 border-black rounded-lg p-2 text-xs focus:outline-none focus:border-[#DC5F00]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Lastname</label>
                          <input
                            type="text"
                            value={addressForm.lastname}
                            onChange={(e) => setAddressForm({ ...addressForm, lastname: e.target.value })}
                            className="w-full border-2 border-black rounded-lg p-2 text-xs focus:outline-none focus:border-[#DC5F00]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">ที่อยู่จัดส่ง (Address Details)</label>
                        <textarea
                          rows={3}
                          value={addressForm.address}
                          onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                          className="w-full border-2 border-black rounded-lg p-2 text-xs focus:outline-none focus:border-[#DC5F00] resize-none leading-tight"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleSaveAddress}
                          className="flex-1 py-2 bg-[#DC5F00] text-white rounded-xl text-xs font-bold border-2 border-black hover:bg-[#c25400] transition-colors"
                        >
                          Save Address
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingAddress(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PICKUP SUBPANEL */}
              {eatType === "pickup" && (
                <div className="space-y-4">
                  <h3 className="font-black text-sm uppercase text-[#DC5F00] tracking-wider">Store Details</h3>
                  
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Select Branch</label>
                    <select
                      value={selectedBranch || "branch1"}
                      disabled
                      className="w-full bg-[#eeeeee] text-[#242424]/60 border-2 border-black/40 rounded-xl p-2 text-xs font-bold cursor-not-allowed opacity-80"
                    >
                      <option value="branch1">Serious Fried Chicken สาขา อโศก (HQ) ✅</option>
                      <option value="branch2" disabled>Serious Fried Chicken สาขา สยาม (COMING SOON 🔒)</option>
                    </select>
                    {/* <p className="text-[10px] text-gray-500 mt-1 italic font-semibold">
                      * นำเข้าจากสาขาที่เลือกในหน้าเมนู ไม่สามารถแก้ไขได้ที่นี่ (Imported from Menu branch, cannot edit here)
                    </p> */}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Pick Date</label>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full bg-white border-2 border-black rounded-lg p-2 text-xs font-bold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Pick Time</label>
                      <select
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full bg-white border-2 border-black rounded-lg p-2 text-xs font-bold focus:outline-none"
                      >
                        <option>10:00 - 10:30</option>
                        <option>11:00 - 11:30</option>
                        <option>12:00 - 12:30</option>
                        <option>13:00 - 13:30</option>
                        <option>14:00 - 14:30</option>
                        <option>15:00 - 15:30</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* RESERVE SUBPANEL */}
              {eatType === "reserve" && (
                <div className="space-y-4">
                  <h3 className="font-black text-sm uppercase text-[#DC5F00] tracking-wider border-b border-[#eeeeee] pb-1">Table Reservation</h3>

                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Select Branch</label>
                    <select
                      value={selectedBranch || "branch1"}
                      disabled
                      className="w-full bg-[#eeeeee] text-[#242424]/60 border-2 border-black/40 rounded-xl p-2 text-xs font-bold cursor-not-allowed opacity-80"
                    >
                      <option value="branch1">Serious Fried Chicken สาขา อโศก (HQ) ✅</option>
                      <option value="branch2" disabled>Serious Fried Chicken สาขา สยาม (COMING SOON 🔒)</option>
                    </select>
                    {/* <p className="text-[10px] text-gray-500 mt-1 italic font-semibold">
                      * นำเข้าจากสาขาที่เลือกในหน้าเมนู ไม่สามารถแก้ไขได้ที่นี่ (Imported from Menu branch, cannot edit here)
                    </p> */}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Booking Date</label>
                      <input
                        type="date"
                        value={reserveDate}
                        onChange={(e) => setReserveDate(e.target.value)}
                        className="w-full bg-white border-2 border-black rounded-lg p-2 text-xs font-bold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Booking Time</label>
                      <select
                        value={reserveTime}
                        onChange={(e) => setReserveTime(e.target.value)}
                        className="w-full bg-white border-2 border-black rounded-lg p-2 text-xs font-bold focus:outline-none"
                      >
                        <option value="10:00-12:00">10:00 - 12:00</option>
                        <option value="13:00-15:00">13:00 - 15:00</option>
                        <option value="16:00-18:00">16:00 - 18:00</option>
                        <option value="19:00-21:00">19:00 - 21:00</option>
                      </select>
                    </div>
                  </div>

                  {/* Members Selection Dropdown (Unlocks based on food totals) */}
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Number of People</label>
                    <select
                      value={reserveMembers}
                      onChange={(e) => setReserveMembers(e.target.value)}
                      className="w-full bg-white border-2 border-black rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#DC5F00]"
                    >
                      <option value="1-2P" disabled={!isOneTwoUnlocked}>
                        1-2 People {!isOneTwoUnlocked ? "🔒 (Requires >= ฿600)" : "✅"}
                      </option>
                      <option value="3-6P" disabled={!isThreeSixUnlocked}>
                        3-6 People {!isThreeSixUnlocked ? "🔒 (Requires >= ฿1200)" : "✅"}
                      </option>
                      <option value="7-10P" disabled={!isSevenTenUnlocked}>
                        7-10 People {!isSevenTenUnlocked ? "🔒 (Requires >= ฿2500)" : "✅"}
                      </option>
                      <option value="11+">
                        11+ People (Contact Staff) 📞
                      </option>
                    </select>
                  </div>

                  {/* 11+ Contact Warning */}
                  {reserveMembers === "11+" && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-[11px] font-black text-red-700 leading-tight">
                      💬 กรุณาติดต่อพนักงานที่เบอร์โทร <span className="underline font-bold">020-22542-555675</span>
                    </div>
                  )}

                  {/* Dynamic Table State Box */}
                  <div className="relative pt-2">
                    {tableState === "checking" && (
                      <div className="bg-gray-100 border-[3px] border-[#242424] rounded-2xl p-3 flex items-center justify-center gap-3 shadow-[4px_4px_0_#cccccc]">
                        <RefreshCw className="animate-spin text-gray-500 shrink-0" size={16} />
                        <span className="text-[#888888] text-sm uppercase font-black tracking-wide font-mono">
                          Table State: <span className="font-bold">Checking...</span>
                        </span>
                      </div>
                    )}
                    {tableState === "free" && (
                      <div className="bg-green-100 border-[3px] border-[#242424] rounded-2xl p-3 flex items-center justify-center gap-2 shadow-[4px_4px_0_#242424]">
                        <span className="text-[#242424] text-sm uppercase font-black tracking-wide font-mono">
                          Table State: <span className="text-green-600 font-extrabold animate-pulse">FREE ✅</span>
                        </span>
                      </div>
                    )}
                    {tableState === "reserve" && (
                      <div className="bg-red-100 border-[3px] border-[#242424] rounded-2xl p-3 flex items-center justify-center gap-2 shadow-[4px_4px_0_#242424]">
                        <span className="text-[#242424] text-sm uppercase font-black tracking-wide font-mono">
                          Table State: <span className="text-red-500 font-extrabold animate-pulse">RESERVE ❌</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Tier details info summary */}
            {eatType === "reserve" && (
              <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200 space-y-2 text-[10px] text-amber-900 font-bold leading-normal">
                <p className="text-xs uppercase font-black text-[#DC5F00] tracking-wider mb-1">🍽️ Seats Spend Requirements</p>
                <div className="flex justify-between border-b border-amber-100 pb-1">
                  <span>1-2 People</span>
                  <span className={subTotal >= 600 ? "text-green-700" : "text-amber-600"}>฿600+ {subTotal >= 600 && "✓"}</span>
                </div>
                <div className="flex justify-between border-b border-amber-100 pb-1">
                  <span>3-6 People</span>
                  <span className={subTotal >= 1200 ? "text-green-700" : "text-amber-600"}>฿1,200+ {subTotal >= 1200 && "✓"}</span>
                </div>
                <div className="flex justify-between">
                  <span>7-10 People</span>
                  <span className={subTotal >= 2500 ? "text-green-700" : "text-amber-600"}>฿2,500+ {subTotal >= 2500 && "✓"}</span>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* PANEL 2 (MIDDLE): Order Summary List (Col span 4) */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 bg-white rounded-4xl p-6 border-4 border-[#242424] shadow-[8px_8px_0_#242424] space-y-6">
            <h2 className="text-2xl font-['Bebas_Neue'] tracking-widest uppercase border-b-2 border-[#eeeeee] pb-2 flex items-center justify-between">
              <span>2. Order Summary</span>
              <span className="bg-[#242424] text-white text-xs px-3 py-1 rounded-full font-['IBM_Plex_Sans_Thai'] tracking-normal font-black">
                {cartItems.length} รายการ
              </span>
            </h2>
            
            <div className="space-y-1 max-h-120 overflow-y-auto pr-1">
              {cartItems.length === 0 ? (
                <div className="text-center py-20 text-[#242424]/40 font-bold uppercase">
                  <ShoppingCart size={36} className="mx-auto mb-2 opacity-30" />
                  ตะกร้าว่างอยู่
                </div>
              ) : (
                cartItems.map((item) => (
                  <OrderItem 
                    key={item.id} 
                    item={item} 
                    orderId="current-cart" 
                    onUpdateQty={handleUpdateQty} 
                    onRemove={handleRemove} 
                    onEdit={setCustomizingItem}
                    isSelected={customizingItem?.id === item.id}
                    onUpdateNote={handleUpdateNote}
                  />
                ))
              )}
            </div>

            <button 
              onClick={() => navigate("/menu")}
              className="w-full py-3.5 border-2 border-dashed border-[#242424] text-[#242424] bg-[#eeeeee] rounded-3xl font-bold flex items-center justify-center gap-2 hover:bg-[#242424] hover:text-white transition-all duration-300 shadow-[4px_4px_0_#e5e7eb] cursor-pointer"
            >
              <PlusCircle size={18} /> เพิ่มเมนูอื่นต่อ (Add Items)
            </button>
          </div>

          {/* ============================================================== */}
          {/* PANEL 3 (RIGHT): Totals & Payments Slip Upload (Col span 4) */}
          {/* ============================================================== */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Payment Details breakdown */}
            <div className="bg-white rounded-4xl p-6 border-4 border-[#242424] shadow-[8px_8px_0_#242424] space-y-4">
              <h2 className="text-2xl font-['Bebas_Neue'] tracking-widest uppercase border-b-2 border-[#eeeeee] pb-2 flex items-center gap-2">
                <span className="w-2.5 h-6 bg-[#e4002b] rounded-full inline-block"></span>
                3. Total Details
              </h2>
              
              <div className="space-y-3 text-sm font-bold text-[#242424]">
                <div className="flex justify-between">
                  <span className="text-[#242424]/70">ราคารวม (Subtotal)</span>
                  <span>{subTotal.toLocaleString()} THB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#242424]/70">ภาษี (Tax 7%)</span>
                  <span>{tax.toLocaleString(undefined, { maximumFractionDigits: 2 })} THB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#242424]/70">ค่าจัดส่ง (Delivery)</span>
                  <span className="text-[#DC5F00] font-black bg-[#DC5F00]/10 px-3 py-0.5 rounded-lg border border-[#DC5F00] text-[11px]">FREE</span>
                </div>
                
                <div className="pt-4 border-t-2 border-[#242424] flex justify-between items-end">
                  <span className="font-black text-lg">ยอดชำระสุทธิ</span>
                  <div className="text-right">
                    <span className="block text-[9px] text-[#242424] font-['Bebas_Neue'] tracking-widest uppercase leading-none">Net Total Amount</span>
                    <span className="text-3xl font-black text-[#e4002b] font-['Bebas_Neue'] tracking-wider leading-none">
                      {netTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Details */}
            <div className="bg-[#242424] text-white rounded-4xl p-6 border-4 border-[#242424] shadow-[8px_8px_0_#DC5F00] space-y-6">
              <h2 className="text-2xl font-['Bebas_Neue'] tracking-widest uppercase border-b-2 border-white/10 pb-2 text-[#FDE68A]">
                Secure Checkout
              </h2>

              {/* Payment Select Method Tabs */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest block mb-2">Select Method</label>
                <div className="grid grid-cols-3 gap-1 bg-black/40 p-1.5 rounded-2xl border border-white/10">
                  <button
                    disabled
                    type="button"
                    className="py-2 rounded-xl text-xs font-black text-gray-500 bg-gray-800/20 cursor-not-allowed opacity-50 relative group"
                    title="Credit Card coming soon"
                  >
                    Card (Soon 🔒)
                  </button>
                  <button
                    onClick={() => setPaymentMethod("promptpay")}
                    className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer
                      ${paymentMethod === "promptpay" ? "bg-[#DC5F00] text-white shadow-md" : "text-gray-400 hover:text-white"}`}
                  >
                    QR Prompt
                  </button>
                  <button
                    onClick={() => setPaymentMethod("cash")}
                    className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer
                      ${paymentMethod === "cash" ? "bg-[#DC5F00] text-white shadow-md" : "text-gray-400 hover:text-white"}`}
                  >
                    Cash
                  </button>
                </div>
              </div>

              {/* Dynamic Drawers */}
              <div className="border-t border-dashed border-white/10 pt-4">
                
                {/* None Selected placeholder */}
                {!paymentMethod && (
                  <p className="text-center text-xs text-gray-400 py-6 uppercase font-bold tracking-wider">
                    Please select a payment method above
                  </p>
                )}

                {/* CREDIT CARD */}
                {paymentMethod === "credit" && (
                  <div className="space-y-4">
                    {/* Simulated Visa Card mockup */}
                    <div className="bg-[#E9662A] rounded-2xl p-4 text-white shadow-md border border-white/20 select-none">
                      <div className="flex justify-between items-center mb-4">
                        <div className="w-10 h-7 bg-white/30 rounded-lg"></div>
                        <span className="font-['Bebas_Neue'] text-lg italic tracking-wider">VISA</span>
                      </div>
                      <div className="text-lg font-mono tracking-widest text-center py-2">
                        {creditCard.number ? creditCard.number.replace(/\d{4}(?=.)/g, '$& ') : "**** **** **** ****"}
                      </div>
                      <div className="flex justify-between text-[10px] opacity-80 mt-2 font-mono">
                        <div>
                          <p>CARDHOLDER</p>
                          <p className="font-bold text-xs uppercase">{creditCard.name || "YOUR NAME"}</p>
                        </div>
                        <div className="text-right">
                          <p>EXPIRES</p>
                          <p className="font-bold text-xs">{creditCard.expiry || "MM/YY"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-2 text-xs font-bold">
                      <input
                        type="text"
                        placeholder="Card Number"
                        maxLength={16}
                        value={creditCard.number}
                        onChange={(e) => setCreditCard({ ...creditCard, number: e.target.value.replace(/\D/g, "") })}
                        className="w-full bg-black/35 border border-white/20 rounded-xl p-2.5 focus:outline-none focus:border-[#DC5F00] text-white"
                      />
                      <input
                        type="text"
                        placeholder="Holder Name"
                        value={creditCard.name}
                        onChange={(e) => setCreditCard({ ...creditCard, name: e.target.value })}
                        className="w-full bg-black/35 border border-white/20 rounded-xl p-2.5 focus:outline-none focus:border-[#DC5F00] text-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={creditCard.expiry}
                          onChange={(e) => setCreditCard({ ...creditCard, expiry: e.target.value })}
                          className="w-full bg-black/35 border border-white/20 rounded-xl p-2.5 focus:outline-none focus:border-[#DC5F00] text-white"
                        />
                        <input
                          type="password"
                          placeholder="CVV"
                          maxLength={3}
                          value={creditCard.cvv}
                          onChange={(e) => setCreditCard({ ...creditCard, cvv: e.target.value.replace(/\D/g, "") })}
                          className="w-full bg-black/35 border border-white/20 rounded-xl p-2.5 focus:outline-none focus:border-[#DC5F00] text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PROMPTPAY QR & SLIP UPLOAD */}
                {paymentMethod === "promptpay" && (
                  <div className="space-y-4">
                    {/* Simulated QR Code SVG drawing */}
                    <div className="bg-white p-4 rounded-3xl border-2 border-black flex flex-col items-center justify-center">
                      <div className="w-32 h-6 bg-[#002f5f] rounded-lg mb-3 flex items-center justify-center text-white text-[10px] font-black tracking-widest font-mono select-none">
                        Prompt Pay
                      </div>
                      {/* Simulated QR block */}
                      <div className="w-32 h-32 bg-gray-100 border-2 border-[#242424] flex items-center justify-center p-2 relative">
                        <div className="w-full h-full bg-[#111] grid grid-cols-5 grid-rows-5 gap-1.5 opacity-90 p-1 rounded-sm">
                          <div className="bg-white rounded-xs"></div><div className="bg-white rounded-xs"></div><div className="bg-[#111] rounded-xs"></div><div className="bg-white rounded-xs"></div><div className="bg-[#111] rounded-xs"></div>
                          <div className="bg-[#111] rounded-xs"></div><div className="bg-white rounded-xs"></div><div className="bg-white rounded-xs"></div><div className="bg-white rounded-xs"></div><div className="bg-white rounded-xs"></div>
                          <div className="bg-white rounded-xs"></div><div className="bg-[#111] rounded-xs"></div><div className="bg-white rounded-xs"></div><div className="bg-[#111] rounded-xs"></div><div className="bg-white rounded-xs"></div>
                          <div className="bg-white rounded-xs"></div><div className="bg-white rounded-xs"></div><div className="bg-white rounded-xs"></div><div className="bg-[#111] rounded-xs"></div><div className="bg-white rounded-xs"></div>
                          <div className="bg-[#111] rounded-xs"></div><div className="bg-[#111] rounded-xs"></div><div className="bg-white rounded-xs"></div><div className="bg-white rounded-xs"></div><div className="bg-white rounded-xs"></div>
                        </div>
                        {/* Star mini sticker logo in center */}
                        <div className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-[#e4002b] rounded-full border-2 border-white flex items-center justify-center shadow-md">
                          <Check size={14} className="text-white" />
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500 font-extrabold uppercase mt-2 tracking-wide text-center">
                        Total Amount: <span className="text-[#e4002b] font-mono">฿{netTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </p>
                    </div>

                    {/* Drag & Drop Slip Uploader */}
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest block mb-2">Upload Slip receipt</label>
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleSlipDrop}
                        className="bg-black/35 border-2 border-dashed border-white/20 rounded-2xl p-4 text-center cursor-pointer hover:border-[#DC5F00] transition-colors relative flex flex-col justify-center items-center"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          id="slip-upload"
                          className="hidden"
                          onChange={handleSlipChange}
                        />
                        <label htmlFor="slip-upload" className="cursor-pointer flex flex-col items-center gap-1.5 w-full">
                          {uploadedSlip ? (
                            /* Slip Preview thumbnail */
                            <div className="flex items-center gap-3 w-full bg-[#111] p-2 rounded-xl border border-white/10">
                              <img
                                src={uploadedSlip}
                                alt="slip receipt preview"
                                className="w-12 h-12 object-cover rounded-lg border border-white/20 shrink-0"
                              />
                              <div className="text-left flex-1 min-w-0 text-white">
                                <p className="text-xs font-black truncate">{uploadedSlipFile?.name || "Uploaded Slip"}</p>
                                <p className="text-[9px] text-green-500 font-black tracking-wider uppercase mt-0.5">SLIP SELECTED ✓</p>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setUploadedSlip(null);
                                  setUploadedSlipFile(null);
                                }}
                                className="p-2 bg-red-900/40 hover:bg-red-700 text-red-300 rounded-lg hover:text-white transition-colors cursor-pointer text-[10px] font-bold"
                              >
                                Clear
                              </button>
                            </div>
                          ) : (
                            /* Upload Drop Prompt */
                            <>
                              <UploadCloud size={24} className="text-[#DC5F00] animate-bounce" />
                              <p className="text-xs font-bold text-gray-300">Drag & Drop or Click to Upload Slip</p>
                              <p className="text-[9px] text-gray-500 font-bold leading-none">Supports PNG, JPG, JPEG formats</p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* CASH NOTICE */}
                {paymentMethod === "cash" && (
                  <div className="bg-black/35 rounded-2xl p-4 border border-white/10 text-center space-y-2">
                    <ShieldCheck size={28} className="text-green-500 mx-auto animate-pulse" />
                    <h4 className="text-xs font-black uppercase text-white tracking-widest">PAY AT COUNTER</h4>
                    <p className="text-[10px] text-gray-400 leading-normal">
                      Confirm order now and settle payment directly with our cashier when picking up or upon food arrival.
                    </p>
                  </div>
                )}
              </div>

              {/* Reserve Constraint Warning Alert (ⓘ) */}
              {isReserveBelowMinimum && (
                <div className="bg-[#FDE68A] text-[#242424] rounded-2xl p-4 border-2 border-black flex gap-3 shadow-[4px_4px_0_#000] relative select-none">
                  <Info size={20} className="shrink-0 text-[#e4002b] mt-0.5" />
                  <div className="text-xs font-bold leading-normal">
                    <p className="font-extrabold uppercase text-[#e4002b] text-[10px] tracking-wide mb-1">
                      Minimum Order Required!
                    </p>
                    <p className="text-[11px]">
                      ยอดรวมของท่านยังไม่ครบตามที่กำหนด กรุณาเลือกออเดอร์ให้ครบด้วยครับ/ค่ะ [Your order is below the required minimum. Please select additional items to continue.]
                    </p>
                  </div>
                </div>
              )}

              {/* Table Full Warning Alert */}
              {eatType === "reserve" && tableState === "reserve" && (
                <div className="bg-[#fee2e2] text-[#991b1b] rounded-2xl p-4 border-2 border-black flex gap-3 shadow-[4px_4px_0_#000] relative select-none">
                  <Info size={20} className="shrink-0 text-[#e4002b] mt-0.5" />
                  <div className="text-xs font-bold leading-normal">
                    <p className="font-extrabold uppercase text-[#e4002b] text-[10px] tracking-wide mb-1">
                      Table Fully Booked!
                    </p>
                    <p className="text-[12px] font-['IBM_Plex_Sans_Thai'] whitespace-pre-line leading-relaxed font-bold">
                      🙏 ขออภัย ขณะนี้โต๊ะถูกจองเต็มแล้ว{"\n"}กรุณาเลือกบริการรูปแบบอื่น หรือเลือกช่วงเวลาใหม่อีกครั้ง 🍗
                    </p>
                  </div>
                </div>
              )}

              {/* Secure ORDER NOW submit CTA */}
              <button
                onClick={handleOrderSubmit}
                disabled={!paymentMethod || isReserveBelowMinimum || cartItems.length === 0 || (eatType === "reserve" && tableState !== "free")}
                className={`w-full py-4.5 rounded-3xl font-['Bebas_Neue'] tracking-widest text-2xl uppercase border-2 border-black transition-all duration-300 relative overflow-hidden group select-none cursor-pointer
                  ${(!paymentMethod || isReserveBelowMinimum || cartItems.length === 0 || (eatType === "reserve" && tableState !== "free"))
                    ? "bg-gray-500 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-[#e4002b] text-white shadow-[6px_6px_0_#000] hover:translate-y-1 hover:shadow-[2px_2px_0_#000]"}`}
              >
                <span className="relative z-10">
                  {cartItems.length === 0 
                    ? "CART EMPTY" 
                    : isReserveBelowMinimum 
                      ? "BELOW MINIMUM" 
                      : (eatType === "reserve" && tableState === "checking")
                        ? "CHECKING AVAILABILITY..."
                        : (eatType === "reserve" && tableState === "reserve")
                          ? "TABLE FULL"
                          : !paymentMethod 
                            ? "SELECT PAYMENT" 
                            : "ORDER NOW"}
                </span>
                {paymentMethod && !isReserveBelowMinimum && cartItems.length > 0 && !(eatType === "reserve" && tableState !== "free") && (
                  <div className="absolute inset-0 bg-[#DC5F00] translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"></div>
                )}
              </button>

              <p className="text-[9px] text-center text-gray-400 font-extrabold tracking-widest uppercase mt-4">
                🔒 Secured with SSL 256-bit encryption verification
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Payment simulated polling processing overlay */}
      {isPolling && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-9999 font-['IBM_Plex_Sans_Thai']">
          <div className="bg-[#242424] text-white rounded-3xl p-8 border-4 border-[#242424] shadow-[8px_8px_0_#e4002b] max-w-sm w-full text-center space-y-6 animate-[bounce_0.5s_ease-out]">
            <div className="relative w-20 h-20 mx-auto">
              {/* Spinning progress loader circle */}
              <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#e4002b] border-t-transparent animate-spin"></div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-['Bebas_Neue'] text-3xl tracking-widest text-[#FDE68A]">
                PROCESSING TRANSACTION
              </h3>
              <p className="text-xs text-gray-400 uppercase font-black tracking-wider">
                Verifying with payment gateway
              </p>
            </div>

            {/* Dynamic steps text */}
            <div className="bg-black/40 p-4 rounded-2xl border border-white/10 text-xs font-mono font-bold text-green-400 leading-normal">
              {pollingMessages[pollingStep]}
            </div>
          </div>
        </div>
      )}

      {/* Black Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full h-3 bg-[#1a1a1a] z-50"></div>
    </div>
  );
};

export default OrderPage;
