import { useState, useEffect, useContext, useCallback, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { OrdersContext } from "../../../context/ordersContext/OrdersContext";
import { UserContext } from "../../../context/userContext/UserContext";
import { useShop } from "../../../context/ShopProvider";
import { orderService } from "../../../services/orderService";
import { paymentService } from "../../../services/paymentService";
import { accountService } from "../../../services/accountService";
import { tableService } from "../../../services/tableService";

const getAddressId = (address) => address?._id || address?.id || "";
const getOrderItemId = (item) => item?.id || item?._id || item?.menu_id || item?.menuId || "";
const isSameOrderItem = (item, itemId) => String(getOrderItemId(item)) === String(itemId);

const normalizeCheckoutAddress = (address, userInfo) => ({
  _id: getAddressId(address),
  addressName: address?.addressName || address?.name || address?.tag || address?.type || "Home",
  tag: address?.tag || address?.type || "Home",
  firstname: address?.firstname || userInfo?.name || "",
  lastname: address?.lastname || userInfo?.surname || "",
  username: address?.username || userInfo?.username || "",
  phone: address?.phone || userInfo?.phone || "",
  address: address?.address || address?.detail || "",
  isDefault: address?.isDefault === true,
});

const getReservationPax = (reserveMembers) => {
  if (reserveMembers === "3-6P") return 6;
  if (reserveMembers === "7-10P") return 10;
  return 2;
};

const getFallbackAddress = (userInfo) => ({
  addressName: "Home",
  tag: "Home",
  firstname: userInfo?.name || "",
  lastname: userInfo?.surname || "",
  username: userInfo?.username || "",
  phone: userInfo?.phone || "",
  address: userInfo?.address || "",
  isDefault: true,
});

const getTodayDateValue = () => new Date().toISOString().split("T")[0];

const isFutureDateValue = (dateValue) => Boolean(dateValue) && dateValue > getTodayDateValue();

const getSoldOutCheckoutMessage = (items) => {
  if (!items.length) return "";
  const soldOutNames = items.map((item) => item.name).join(", ");
  return `This order cannot be placed because ${soldOutNames} ${items.length === 1 ? "is" : "are"} already sold out.`;
};

const getMenuMaxOrderableQuantity = (menu) => {
  const recipeIngredients = Array.isArray(menu?.recipeIngredients) ? menu.recipeIngredients : [];
  if (!recipeIngredients.length) return 0;

  return recipeIngredients.reduce((currentMax, entry) => {
    const requiredQuantity = Number(entry.requiredQuantity || 0);
    const availableQuantity = Number(entry.availableQuantity || 0);
    if (!entry.active || requiredQuantity <= 0) return 0;
    return Math.min(currentMax, Math.floor(availableQuantity / requiredQuantity));
  }, Number.POSITIVE_INFINITY);
};

const getSoldOutNotice = (items) => ({
  title: "Sold Out Items",
  message: getSoldOutCheckoutMessage(items),
  orderedItems: items.map((item) => ({
    name: item.name,
    quantity: Number(item.quantity || item.qty || 1),
  })),
  conflicts: [],
});

const getAffectedOrderedItems = (conflicts) => {
  const affectedItems = new Map();

  conflicts.forEach((conflict) => {
    (conflict.affectedItems || []).forEach((item) => {
      const name = item.name || "Menu item";
      const current = affectedItems.get(name) || { name, quantity: 0 };
      current.quantity = Math.max(current.quantity, Number(item.quantity || 1));
      affectedItems.set(name, current);
    });
  });

  return [...affectedItems.values()];
};

const getAggregateStockNotice = (items) => {
  const ingredientUsage = new Map();

  items.forEach((item) => {
    const itemQuantity = Number(item.quantity || item.qty || 1);
    const recipeIngredients = Array.isArray(item.recipeIngredients) ? item.recipeIngredients : [];

    recipeIngredients.forEach((entry) => {
      const requiredPerItem = Number(entry.requiredQuantity || 0);
      if (!entry.active || requiredPerItem <= 0) return;

      const ingredientId = String(entry.id || entry.name || "");
      if (!ingredientId) return;

      const current = ingredientUsage.get(ingredientId) || {
        id: ingredientId,
        name: entry.name || "Ingredient",
        availableQuantity: Number(entry.availableQuantity || 0),
        unit: entry.unit || "",
        requiredQuantity: 0,
        affectedItems: [],
        requiredPerItemValues: [],
      };

      current.requiredQuantity += requiredPerItem * itemQuantity;
      current.affectedItems.push({
        name: item.name,
        quantity: itemQuantity,
        requiredQuantity: requiredPerItem * itemQuantity,
        requiredPerItem,
      });
      current.requiredPerItemValues.push(requiredPerItem);
      ingredientUsage.set(ingredientId, current);
    });
  });

  const conflicts = [...ingredientUsage.values()]
    .filter((entry) => entry.availableQuantity < entry.requiredQuantity)
    .map((entry) => {
      const uniqueRequiredPerItem = [...new Set(entry.requiredPerItemValues)];
      return {
        ...entry,
        shortageQuantity: entry.requiredQuantity - entry.availableQuantity,
        possibleItemCount:
          uniqueRequiredPerItem.length === 1
            ? Math.floor(entry.availableQuantity / uniqueRequiredPerItem[0])
            : null,
      };
    });

  if (conflicts.length === 0) return null;

  return {
    title: "Not Enough Stock",
    message: "Some ingredients cannot cover every item in this order.",
    orderedItems: getAffectedOrderedItems(conflicts),
    conflicts,
  };
};

const getOverLimitStockNotice = (items) => ({
  title: "Not Enough Stock",
  message: "Some menu quantities are higher than current stock can make.",
  orderedItems: items.map((item) => ({
    name: item.name,
    quantity: Number(item.quantity || item.qty || 1),
  })),
  conflicts: items.map((item) => ({
    id: getOrderItemId(item),
    name: item.name,
    availableQuantity: Number(item.maxOrderableQuantity || 0),
    requiredQuantity: Number(item.quantity || item.qty || 1),
    unit: "item",
    possibleItemCount: Number(item.maxOrderableQuantity || 0),
    affectedItems: [{ name: item.name, quantity: Number(item.quantity || item.qty || 1) }],
  })),
});

const getStockErrorNotice = (message) => {
  if (!message) return null;
  return {
    title: "Order Cannot Be Made",
    message,
    orderedItems: [],
    conflicts: [],
  };
};

const getDefaultAddress = (addresses, userInfo) => {
  const normalized = Array.isArray(addresses)
    ? addresses.map((address) => normalizeCheckoutAddress(address, userInfo)).filter((address) => address.address)
    : [];

  return normalized.find((address) => address.isDefault) || normalized[0] || getFallbackAddress(userInfo);
};

export const useOrderPageState = () => {
  const { orderList, setOrderList } = useContext(OrdersContext);
  const { myUserInfo, setMyUserInfo } = useContext(UserContext);
  const {
    setCart,
    updateCartQty,
    selectedBranch,
    selectBranch,
    selectedOrderType,
    setSelectedOrderType,
    menus,
    menusLoading,
  } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = myUserInfo?.id;

  const [customizingItem, setCustomizingItem] = useState(null);
  const eatType = selectedOrderType;
  const setEatType = setSelectedOrderType;

  // Keep eatType synchronized with URL search params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let type = params.get("type");
    if (
      (type === "pickup" || type === "delivery" || type === "reserve") &&
      type !== selectedOrderType
    ) {
      setSelectedOrderType(type);
    }
  }, [location.search, selectedOrderType, setSelectedOrderType]);

  // Persist eatType changes to localStorage so that navigating away (e.g. to /menu) preserves it
  useEffect(() => {
    if (eatType === "pickup" || eatType === "delivery" || eatType === "reserve") {
      localStorage.setItem("crispyEatType", eatType);
    }
  }, [eatType]);

  const [savedAddresses, setSavedAddresses] = useState(() =>
    Array.isArray(myUserInfo?.addresses)
      ? myUserInfo.addresses.map((address) => normalizeCheckoutAddress(address, myUserInfo))
      : []
  );
  const [deliveryAddress, setDeliveryAddress] = useState(() =>
    getDefaultAddress(myUserInfo?.addresses, myUserInfo)
  );
  const [selectedAddressId, setSelectedAddressId] = useState(() => getAddressId(deliveryAddress));
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({ ...deliveryAddress });

  useEffect(() => {
    if (myUserInfo) {
      const nextAddresses = Array.isArray(myUserInfo.addresses)
        ? myUserInfo.addresses.map((address) => normalizeCheckoutAddress(address, myUserInfo))
        : [];
      const nextDefault = getDefaultAddress(nextAddresses, myUserInfo);

      setSavedAddresses(nextAddresses);
      setDeliveryAddress(nextDefault);
      setSelectedAddressId(getAddressId(nextDefault));
    }
  }, [myUserInfo]);

  useEffect(() => {
    if (!userId) return;

    let ignore = false;
    const loadProfileAddresses = async () => {
      try {
        const profile = await accountService.getProfile();
        if (ignore) return;
        setMyUserInfo((current) => ({ ...current, ...profile, token: current?.token }));
      } catch (error) {
        console.error("Failed to load saved addresses:", error);
      }
    };

    loadProfileAddresses();
    return () => {
      ignore = true;
    };
  }, [userId, setMyUserInfo]);

  useEffect(() => {
    setAddressForm({ ...deliveryAddress });
  }, [deliveryAddress]);

  const [pickupDate, setPickupDate] = useState(() => getTodayDateValue());
  const [pickupTime, setPickupTime] = useState(() => {
    const timeSlots = ["10:00 - 10:30", "11:00 - 11:30", "12:00 - 12:30", "13:00 - 13:30", "14:00 - 14:30", "15:00 - 15:30"];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const available = timeSlots.find(slot => {
      const [startHour, startMinute] = slot.split(" - ")[0].split(":").map(Number);
      if (currentHour < startHour) return true;
      if (currentHour === startHour && currentMinute < startMinute) return true;
      return false;
    });

    return available || timeSlots[timeSlots.length - 1];
  });

  const [reserveDate, setReserveDate] = useState(() => getTodayDateValue());
  const [reserveTime, setReserveTime] = useState(() => {
    const timeSlots = [
      { label: "10:00 - 12:00", value: "10:00-12:00" },
      { label: "13:00 - 15:00", value: "13:00-15:00" },
      { label: "16:00 - 18:00", value: "16:00-18:00" },
      { label: "19:00 - 21:00", value: "19:00-21:00" }
    ];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const available = timeSlots.find(slot => {
      const [startHour, startMinute] = slot.value.split("-")[0].split(":").map(Number);
      if (currentHour < startHour) return true;
      if (currentHour === startHour && currentMinute < startMinute) return true;
      return false;
    });

    return available ? available.value : timeSlots[timeSlots.length - 1].value;
  });
  const [reserveMembers, setReserveMembers] = useState("1-2P");
  const [noteGlobal, setNoteGlobal] = useState("");
  const [tableState, setTableState] = useState("checking");
  const [availableReservationTableId, setAvailableReservationTableId] = useState("");

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
  const [checkoutError, setCheckoutError] = useState("");
  const [stockNotice, setStockNotice] = useState(null);
  const submitLockedRef = useRef(false);
  const createRequestSentRef = useRef(false);
  const pollingMessages = [
    "Establishing secure connection...",
    "Sending transaction payload... ⏳",
    "Verifying payment slip details...",
    "Order verified! Preparing receipt..."
  ];

  const menuAvailabilityById = useMemo(() => {
    return new Map(
      menus.map((menu) => [
        String(menu.id || menu._id),
        {
          soldOut: menu.soldOut === true || menu.hasRecipe === false,
          name: menu.name,
          maxOrderableQuantity: getMenuMaxOrderableQuantity(menu),
          recipeIngredients: menu.recipeIngredients,
        },
      ]),
    );
  }, [menus]);

  const cartItems = useMemo(() => {
    const items = orderList && orderList[0] ? orderList[0].orderList || orderList[0].List || [] : [];
    const shouldIgnoreCurrentStock = eatType === "reserve" && isFutureDateValue(reserveDate);
    const shouldIgnoreQuantityLimit = eatType === "reserve" && isFutureDateValue(reserveDate);
    return items.map((item) => {
      const itemId = String(getOrderItemId(item));
      const menuStatus = menuAvailabilityById.get(itemId);
      const isSoldOut = !shouldIgnoreCurrentStock && !menusLoading && (!menuStatus || menuStatus.soldOut);
      const maxOrderableQuantity = shouldIgnoreQuantityLimit ? null : menuStatus?.maxOrderableQuantity ?? 0;
      const quantity = item.quantity || item.qty || 1;
      return {
        ...item,
        quantity,
        recipeIngredients: menuStatus?.recipeIngredients || [],
        isSoldOut,
        maxOrderableQuantity,
        exceedsMaxOrderableQuantity:
          !isSoldOut &&
          maxOrderableQuantity !== null &&
          Number(quantity) > Number(maxOrderableQuantity),
      };
    });
  }, [orderList, menuAvailabilityById, menusLoading, eatType, reserveDate]);

  const soldOutCartItems = useMemo(
    () => cartItems.filter((item) => item.isSoldOut),
    [cartItems],
  );

  const overLimitCartItems = useMemo(
    () => cartItems.filter((item) => item.exceedsMaxOrderableQuantity),
    [cartItems],
  );

  const stockNoticeFromCart = useMemo(() => {
    if (eatType === "reserve" && isFutureDateValue(reserveDate)) return null;
    return getAggregateStockNotice(cartItems);
  }, [cartItems, eatType, reserveDate]);

  useEffect(() => {
    if (soldOutCartItems.length === 0) setCheckoutError("");
  }, [soldOutCartItems]);

  useEffect(() => {
    if (!isPolling || soldOutCartItems.length === 0) return;

    setStockNotice(getSoldOutNotice(soldOutCartItems));
    submitLockedRef.current = false;
    createRequestSentRef.current = false;
    setIsPolling(false);
  }, [isPolling, soldOutCartItems]);

  useEffect(() => {
    if ((eatType === "delivery" || eatType === "pickup") && pickupDate !== getTodayDateValue()) {
      setPickupDate(getTodayDateValue());
    }
  }, [eatType, pickupDate]);

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
  const payableTotal = useMemo(() => Math.round(netTotal * 100) / 100, [netTotal]);

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

  const isFutureReservation = eatType === "reserve" && isFutureDateValue(reserveDate);

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
      setAvailableReservationTableId("");
      return;
    }

    let ignore = false;
    setTableState("checking");

    const checkTableAvailability = async () => {
      try {
        const pax = getReservationPax(reserveMembers);
        const availability = await tableService.getAvailability({
          date: reserveDate,
          timeSlot: reserveTime,
          pax,
        });
        if (ignore) return;

        setAvailableReservationTableId(availability.tableId || "");
        setTableState(availability.available ? "free" : "reserve");
      } catch (error) {
        console.error("Failed to check table availability:", error);
        if (!ignore) {
          setAvailableReservationTableId("");
          setTableState("reserve");
        }
      }
    };

    checkTableAvailability();
    return () => {
      ignore = true;
    };
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
      if (isSameOrderItem(item, itemId)) {
        return { ...item, note: newNote };
      }
      return item;
    }));
    setOrderList(prev => {
      if (!Array.isArray(prev)) return prev;

      return prev.map(order => {
        const itemsKey = Array.isArray(order?.orderList) ? "orderList" : Array.isArray(order?.List) ? "List" : null;
        if (!itemsKey) return order;

        return {
          ...order,
          [itemsKey]: order[itemsKey].map(item => {
            return isSameOrderItem(item, itemId) ? { ...item, note: newNote } : item;
          }),
        };
      });
    });
  }, [setCart, setOrderList]);

  const handleSelectAddress = async (addressId) => {
    if (addressId === "__new__") {
      handleAddNewAddress();
      return;
    }

    const selected = savedAddresses.find((address) => getAddressId(address) === addressId);
    if (!selected) return;

    const nextAddresses = savedAddresses.map((address) => ({
      ...address,
      isDefault: getAddressId(address) === addressId,
    }));

    setSavedAddresses(nextAddresses);
    setDeliveryAddress({ ...selected, isDefault: true });
    setSelectedAddressId(addressId);

    if (!myUserInfo) return;

    try {
      const updated = await accountService.updateProfile({ addresses: nextAddresses });
      setMyUserInfo((current) => ({ ...current, ...updated, token: current?.token }));
    } catch (error) {
      console.error("Failed to update default address:", error);
      alert(error.message || "Unable to update default address.");
    }
  };

  const handleAddNewAddress = () => {
    setAddressForm({
      addressName: "",
      tag: "Home",
      firstname: myUserInfo?.name || deliveryAddress.firstname || "",
      lastname: myUserInfo?.surname || deliveryAddress.lastname || "",
      username: myUserInfo?.username || deliveryAddress.username || "",
      phone: myUserInfo?.phone || deliveryAddress.phone || "",
      address: "",
      isDefault: true,
    });
    setIsEditingAddress(true);
  };

  const handleSaveAddress = async () => {
    if (!addressForm.addressName || !addressForm.username || !addressForm.firstname || !addressForm.lastname || !addressForm.address || !addressForm.phone) {
      alert("กรุณากรอกข้อมูลที่อยู่และเบอร์โทรศัพท์ให้ครบถ้วน");
      return;
    }
    const formId = getAddressId(addressForm);
    const nextAddress = {
      ...addressForm,
      addressName: addressForm.addressName || addressForm.tag || "Home",
      tag: addressForm.tag || "Home",
      isDefault: true,
    };
    const addressExists = formId && savedAddresses.some((address) => getAddressId(address) === formId);
    const nextAddresses = addressExists
      ? savedAddresses.map((address) =>
          getAddressId(address) === formId
            ? nextAddress
            : { ...address, isDefault: false }
        )
      : [
          ...savedAddresses.map((address) => ({ ...address, isDefault: false })),
          nextAddress,
        ];

    setDeliveryAddress(nextAddress);
    setSavedAddresses(nextAddresses);
    setSelectedAddressId(formId);
    setIsEditingAddress(false);

    if (!myUserInfo) return;

    try {
      const updated = await accountService.updateProfile({ addresses: nextAddresses });
      const persistedAddresses = Array.isArray(updated.addresses)
        ? updated.addresses.map((address) => normalizeCheckoutAddress(address, updated))
        : nextAddresses;
      const persistedDefault = getDefaultAddress(persistedAddresses, updated);

      setSavedAddresses(persistedAddresses);
      setDeliveryAddress(persistedDefault);
      setSelectedAddressId(getAddressId(persistedDefault));
      setMyUserInfo((current) => ({ ...current, ...updated, token: current?.token }));
    } catch (error) {
      console.error("Failed to save address:", error);
      alert(error.message || "Unable to save address.");
    }
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
    if (isPolling || submitLockedRef.current) return;
    setCheckoutError("");
    setStockNotice(null);

    if (cartItems.length === 0) {
      alert("กรุณาเลือกรายการอาหารก่อน");
      return;
    }
    if (soldOutCartItems.length > 0) {
      const notice = getSoldOutNotice(soldOutCartItems);
      setCheckoutError("");
      setStockNotice(notice);
      return;
    }
    if (stockNoticeFromCart) {
      setCheckoutError("");
      setStockNotice(stockNoticeFromCart);
      return;
    }
    if (overLimitCartItems.length > 0) {
      const notice = getOverLimitStockNotice(overLimitCartItems);
      setCheckoutError("");
      setStockNotice(notice);
      return;
    }
    if ((eatType === "delivery" || eatType === "pickup") && pickupDate !== getTodayDateValue()) {
      setCheckoutError("Delivery and pick-up orders are only available for today. Please choose reservation for another date.");
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
    if (eatType === "reserve" && !isFutureReservation && (tableState !== "free" || !availableReservationTableId)) {
      alert("🙏 ขออภัย ขณะนี้โต๊ะถูกจองเต็มแล้ว\nกรุณาเลือกบริการรูปแบบอื่น หรือเลือกช่วงเวลาใหม่อีกครั้ง 🍗");
      return;
    }

    submitLockedRef.current = true;
    createRequestSentRef.current = false;
    setIsPolling(true);
    setPollingStep(0);
  };

  useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(() => {
      setPollingStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          setTimeout(async () => {
            if (createRequestSentRef.current) return;
            createRequestSentRef.current = true;

            const namesList = cartItems.map(item => `${item.name} x${item.quantity}${item.note ? ` (Note: ${item.note})` : ''}`);
            const serviceTime =
              eatType === "delivery"
                ? "As soon as possible (~30 mins)"
                : eatType === "pickup"
                  ? `${pickupDate} (${pickupTime})`
                  : `${reserveDate} (${reserveTime})`;
            const orderPayload = {
              type: eatType === "delivery" ? "delivery" : "Onsite",
              note_global: noteGlobal.trim(),
              customer: {
                name: deliveryAddress.username || myUserInfo?.name || "",
                email: myUserInfo?.email || "",
                username: deliveryAddress.username || myUserInfo?.username || "",
                contact: deliveryAddress.phone || myUserInfo?.phone || "081-234-5678",
                address:
                  eatType === "delivery"
                    ? deliveryAddress.address
                    : formattedBranchName,
                note: `${eatType}|${serviceTime}`,
              },
              bookingDate: eatType === "reserve" ? reserveDate : pickupDate,
              bookingTime: eatType === "reserve" ? reserveTime : pickupTime,
              reservationPax:
                eatType === "reserve" ? getReservationPax(reserveMembers) : undefined,
              tableId:
                eatType === "reserve" && availableReservationTableId ? availableReservationTableId : undefined,
              orderList: cartItems.map((item) => ({
                name: item.name,
                menu_id: item.menu_id || item.menuId || item.id,
                quantity: item.quantity || item.qty || 1,
                price: item.price || item.price_at_purchase || 0,
                price_at_purchase: item.price || item.price_at_purchase || 0,
                image: item.image || item.img || "",
                note: item.note || "",
                cookingTime: item.cookingTime,
                status: "InKitchen",
              })),
            };

            try {
              const createdOrder = await orderService.createOrder(orderPayload);
              await paymentService.processPayment(createdOrder._id, {
                paymentMethod,
                amount: payableTotal,
                ...(paymentMethod === "promptpay" && uploadedSlipFile
                  ? { slip: uploadedSlipFile }
                  : {}),
              });
              const paidOrder = await orderService.getOrder(createdOrder._id);
              setCart([]);
              localStorage.removeItem("crispyCart");
              localStorage.removeItem("crispyEatType");
              window.dispatchEvent(new Event("cartUpdated"));

              navigate("/order-tracking", {
                state: {
                  orderId: paidOrder._id,
                  order: paidOrder,
                  menuList: namesList,
                  totalPrice: payableTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                },
              });
            } catch (error) {
              console.error("Create order failed:", error);
              setStockNotice(
                getStockErrorNotice(error.message || "Unable to save your order. Please try again."),
              );
              submitLockedRef.current = false;
              createRequestSentRef.current = false;
              setIsPolling(false);
            }
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPolling, eatType, cartItems, soldOutCartItems, overLimitCartItems, payableTotal, selectedBranch, pickupDate, pickupTime, reserveDate, reserveTime, reserveMembers, noteGlobal, deliveryAddress, myUserInfo, paymentMethod, uploadedSlipFile, navigate, setCart, formattedBranchName, availableReservationTableId, isFutureReservation, stockNoticeFromCart]);

  return {
    cartItems,
    soldOutCartItems,
    checkoutError,
    stockNotice,
    setStockNotice,
    customizingItem,
    setCustomizingItem,
    eatType,
    setEatType,
    selectedBranch,
    savedAddresses,
    selectedAddressId,
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
    isFutureReservation,
    noteGlobal,
    setNoteGlobal,
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
    handleSelectAddress,
    handleAddNewAddress,
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
