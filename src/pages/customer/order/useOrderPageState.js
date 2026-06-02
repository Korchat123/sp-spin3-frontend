import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { OrdersContext } from "../../../context/ordersContext/OrdersContext";
import { UserContext } from "../../../context/userContext/UserContext";
import { useShop } from "../../../context/ShopProvider";

export const useOrderPageState = () => {
  const { orderList } = useContext(OrdersContext);
  const { myUserInfo } = useContext(UserContext);
  const { setCart, updateCartQty, selectedBranch, selectBranch } = useShop();
  const navigate = useNavigate();
  const location = useLocation();

  const [customizingItem, setCustomizingItem] = useState(null);
  const [eatType, setEatType] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    let type = params.get("type");
    if (!type) {
      type = localStorage.getItem("selectedOrderType");
    }
    if (type === "pickup") return "pickup";
    if (type === "delivery") return "delivery";
    if (type === "reserve") return "reserve";
    return null;
  });

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

  const [deliveryAddress, setDeliveryAddress] = useState({
    tag: "Home",
    firstname: myUserInfo?.name || "Somchai",
    lastname: myUserInfo?.surname || "Jaidee",
    address: myUserInfo?.address || "123/45 Sukhumvit Rd, Khlong Toei, Bangkok 10110"
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({ ...deliveryAddress });

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

  const [pickupDate, setPickupDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [pickupTime, setPickupTime] = useState("13:00 - 13:30");

  const [reserveDate, setReserveDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [reserveTime, setReserveTime] = useState("13:00-15:00");
  const [reserveMembers, setReserveMembers] = useState("1-2P");
  const [reserveComment, setReserveComment] = useState("");
  const [tableState, setTableState] = useState("checking");

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [creditCard, setCreditCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });
  const [uploadedSlip, setUploadedSlip] = useState(null);
  const [uploadedSlipFile, setUploadedSlipFile] = useState(null);

  const [isPolling, setIsPolling] = useState(false);
  const [pollingStep, setPollingStep] = useState(0);
  const pollingMessages = [
    "Establishing secure connection...",
    "Sending transaction payload... ⏳",
    "Verifying payment slip details...",
    "Order verified! Preparing receipt..."
  ];

  const cartItems = useMemo(() => {
    return orderList && orderList[0] ? orderList[0].orderList || orderList[0].List || [] : [];
  }, [orderList]);

  const formattedBranchName = useMemo(() => {
    if (selectedBranch === "branch1") return "Asok Branch (HQ)";
    if (selectedBranch === "branch2") return "Siam Branch";
    return selectedBranch || "Asok Branch (HQ)";
  }, [selectedBranch]);

  const subTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  }, [cartItems]);

  const tax = subTotal * 0.07;
  const netTotal = subTotal + tax;

  const isOneTwoUnlocked = subTotal >= 600;
  const isThreeSixUnlocked = subTotal >= 1200;
  const isSevenTenUnlocked = subTotal >= 2500;

  const isReserveBelowMinimum = useMemo(() => {
    if (eatType !== "reserve") return false;
    if (reserveMembers === "1-2P" && subTotal < 600) return true;
    if (reserveMembers === "3-6P" && subTotal < 1200) return true;
    if (reserveMembers === "7-10P" && subTotal < 2500) return true;
    return false;
  }, [eatType, reserveMembers, subTotal]);

  useEffect(() => {
    if (!selectedBranch) {
      selectBranch("branch1");
    }
  }, [selectedBranch, selectBranch]);

  useEffect(() => {
    if (eatType !== "reserve") return;

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
      const outcome = Math.random() > 0.2 ? "free" : "reserve";
      setTableState(outcome);
    }, 1500);

    return () => clearTimeout(timer);
  }, [eatType, reserveDate, reserveTime, reserveMembers, subTotal, isOneTwoUnlocked, isThreeSixUnlocked, isSevenTenUnlocked]);

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

  const handleUpdateQty = useCallback((itemId, change) => {
    updateCartQty(itemId, change);
  }, [updateCartQty]);

  const handleRemove = useCallback((itemId) => {
    if (window.confirm("ลบรายการนี้ออกจากตะกร้า?")) {
      setCart(prev => prev.filter(i => i.id !== itemId));
      if (customizingItem?.id === itemId) setCustomizingItem(null);
    }
  }, [customizingItem, setCart]);

  const handleUpdateNote = useCallback((itemId, newNote) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, note: newNote };
      }
      return item;
    }));
  }, [setCart]);

  const handleSaveAddress = () => {
    if (!addressForm.firstname || !addressForm.lastname || !addressForm.address) {
      alert("กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน");
      return;
    }
    setDeliveryAddress({ ...addressForm });
    setIsEditingAddress(false);
  };

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

    setIsPolling(true);
    setPollingStep(0);
  };

  useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(() => {
      setPollingStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          setTimeout(() => {
            setIsPolling(false);
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
  }, [isPolling, eatType, cartItems, netTotal, selectedBranch, pickupDate, pickupTime, reserveMembers, reserveDate, reserveTime, reserveComment, deliveryAddress, myUserInfo, navigate, setCart, formattedBranchName]);

  return {
    cartItems,
    customizingItem,
    setCustomizingItem,
    eatType,
    setEatType,
    selectedBranch,
    deliveryAddress,
    isEditingAddress,
    addressForm,
    setAddressForm,
    setIsEditingAddress,
    pickupDate,
    setPickupDate,
    pickupTime,
    setPickupTime,
    reserveDate,
    setReserveDate,
    reserveTime,
    setReserveTime,
    reserveMembers,
    setReserveMembers,
    reserveComment,
    setReserveComment,
    tableState,
    paymentMethod,
    setPaymentMethod,
    creditCard,
    setCreditCard,
    uploadedSlip,
    setUploadedSlip,
    uploadedSlipFile,
    setUploadedSlipFile,
    handleUpdateQty,
    handleRemove,
    handleUpdateNote,
    handleSaveAddress,
    handleSlipChange,
    handleSlipDrop,
    handleOrderSubmit,
    subTotal,
    tax,
    netTotal,
    isReserveBelowMinimum,
    isOneTwoUnlocked,
    isThreeSixUnlocked,
    isSevenTenUnlocked,
    formattedBranchName,
    isPolling,
    pollingStep,
    pollingMessages
  };
};
