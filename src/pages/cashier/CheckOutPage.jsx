import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OrderHeader from "../../component/cashier/OrderHeader";
import OrderItemList from "../../component/cashier/OrderItemList";
import BillingSummary from "../../component/cashier/BillingSummary";
import PaymentMethodSelector from "../../component/cashier/PaymentMethodSelector";
import CashCalculator from "../../component/cashier/CashCalculator";
import CheckoutButton from "../../component/cashier/CheckoutButton";
import Sidebar from "../../component/shared/SideBar";
import {
  CalendarDays,
  CheckCircle2,
  PlusCircle,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import { orderService } from "../../services/orderService";
import { paymentService } from "../../services/paymentService";
import { tableService } from "../../services/tableService";
import { useShop } from "../../context/ShopProvider";
import { getOrderNumber } from "../../utils/customerOrders";

const toCheckoutItem = (item) => {
  const qty = item.quantity || item.qty || 1;
  const unitPrice = item.price ?? item.price_at_purchase ?? 0;
  return {
    id: item.id || item._id || item.menu_id || item.menuId,
    menu_id: item.menu_id || item.menuId || item.id || item._id,
    name: item.name || "Menu item",
    qty,
    unitPrice,
    price: unitPrice * qty,
    image: item.image || item.img || "",
    note: item.note || "",
  };
};

const getTableType = (order) => {
  if (!order) return "DINE-IN / DELIVERY";
  if (!order._id && !order.tableId) return "DINE-IN / DELIVERY";

  const type = order?.type === "delivery" ? "DELIVERY" : "DINE-IN";
  const branch = order?.customer?.note
    ?.match(/Branch:\s*([^|]+)/i)?.[1]
    ?.trim();
  return branch ? `${type}: ${branch}` : type;
};

const getDraftTableType = (
  draft,
  fallbackType = "DINE-IN",
  fallbackTableId = "",
) => {
  const type = draft?.type || fallbackType || "DINE-IN";
  const table = draft?.tableId || fallbackTableId || "";
  if (type === "RESERVATION")
    return table ? `RESERVATION: ${table}` : "RESERVATION";
  if (type === "PICK-UP") return "PICK-UP";
  return table ? `DINE-IN: ${table}` : "DINE-IN";
};

const getOrderDate = (order) => {
  if (!order?.createdAt) return "";
  return new Date(order.createdAt).toLocaleString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, clearCart } = useShop();
  const orderId = location.state?.orderId;
  const tableId = location.state?.tableId || "";
  const orderType = location.state?.type || "DINE-IN";
  const orderDraft = location.state?.orderDraft || null;
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [setupModalType, setSetupModalType] = useState(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [discount, setDiscount] = useState(0);
  const [serviceChargeRate, setServiceChargeRate] = useState(0);
  const [vatRate] = useState(7);

  const [paymentType, setPaymentType] = useState("CASH");
  const [payAmount, setPayAmount] = useState("");
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);

  const activeType = orderDraft?.type || orderType;
  const activeTableId = orderDraft?.tableId || tableId;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSlipFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        if (cart.length === 0) {
          setOrder(null);
          setItems([]);
          setStatusMessage("No order selected.");
        } else {
          setOrder({
            type: "Onsite",
            tableId: activeTableId,
            createdAt: new Date().toISOString(),
            customer: {
              name: orderDraft?.customerName || "Walk-in Customer",
              contact: orderDraft?.customerPhone || "",
              note:
                activeType === "RESERVATION"
                  ? `reserve|${orderDraft?.bookingDate || ""} (${orderDraft?.bookingTime || ""})`
                  : activeTableId
                    ? `cashier|Table ${activeTableId}`
                    : "cashier|Walk-in",
            },
            bookingDate: orderDraft?.bookingDate || "",
            bookingTime: orderDraft?.bookingTime || "",
            reservationPax: orderDraft?.pax || "",
          });
          setItems(cart.map(toCheckoutItem));
          setStatusMessage("");
        }
        setLoading(false);
        return;
      }

      try {
        const data = await orderService.getOrder(orderId);
        setOrder(data);
        setItems((data.orderList || []).map(toCheckoutItem));
        setStatusMessage("");
      } catch (error) {
        console.error("Failed to load checkout order:", error);
        setOrder(null);
        setItems([]);
        setStatusMessage("Unable to load this order from the database.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [activeTableId, activeType, cart, orderDraft, orderId]);

  // 2. Calculations
  const rawSubtotal = items.reduce((sum, item) => sum + item.price, 0);
  let afterDiscount = Math.max(0, rawSubtotal - discount);
  let scAmount = afterDiscount * (serviceChargeRate / 100);
  let beforeTax = afterDiscount + scAmount;
  let taxAmount = beforeTax * (vatRate / 100);
  let finalTotal = beforeTax + taxAmount;

  // Handle auto-filling payAmount for non-cash methods
  useEffect(() => {
    if (paymentType !== "CASH") {
      setPayAmount(finalTotal);
    } else {
      setPayAmount("");
      setSlipFile(null);
      setSlipPreview(null);
    }
  }, [paymentType, finalTotal]);

  const changeAmount =
    paymentType === "CASH" ? Math.max(0, Number(payAmount) - finalTotal) : 0;

  // Disable checkout if no items, or if cash payment is less than total, or if slip is required but missing
  const isCheckoutDisabled =
    items.length === 0 ||
    (paymentType === "CASH" && Number(payAmount) < finalTotal) ||
    (paymentType !== "CASH" && !slipFile);
  // Actions
  const handleRemoveItem = (indexToRemove) => {
    if (window.confirm("ต้องการยกเลิกรายการนี้ใช่หรือไม่?")) {
      setItems(items.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleStartOrder = (type, draft) => {
    const nextDraft = {
      type,
      tableId: draft.tableId || "",
      customerName: draft.customerName || "Walk-in Customer",
      customerPhone: draft.customerPhone || "",
      bookingDate: draft.bookingDate || "",
      bookingTime: draft.bookingTime || "",
      pax: draft.pax || "",
      staffNote: draft.staffNote || "",
    };

    navigate("/cashier/menu", {
      state: {
        type,
        tableId: nextDraft.tableId,
        orderDraft: nextDraft,
      },
    });
  };

  const handleSelectOrderMode = (type) => {
    if (type === "DINE-IN" || type === "PICK-UP") {
      handleStartOrder(type, {
        tableId: "",
        customerName: "Walk-in Customer",
        customerPhone: "",
        staffNote: "",
      });
      return;
    }
    setSetupModalType(type);
  };

  const submitCheckout = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      let payableOrder = order;

      if (!payableOrder?._id) {
        if (items.length === 0) return;

        payableOrder = await orderService.createOrder({
          type: "Onsite",
          tableId: activeTableId,
          bookingDate: orderDraft?.bookingDate || undefined,
          bookingTime: orderDraft?.bookingTime || undefined,
          reservationPax: Number(orderDraft?.pax || 0) || undefined,
          note_global: [orderDraft?.staffNote, `Cashier POS ${activeType}`]
            .filter(Boolean)
            .join("\n"),
          customer: {
            name: orderDraft?.customerName || "Walk-in Customer",
            contact: orderDraft?.customerPhone || "",
            note:
              activeType === "RESERVATION"
                ? `reserve|${orderDraft?.bookingDate || ""} (${orderDraft?.bookingTime || ""})`
                : activeTableId
                  ? `cashier|Table ${activeTableId}`
                  : activeType === "PICK-UP"
                    ? "pickup|Cashier POS"
                    : "cashier|Walk-in",
          },
          orderList: items.map((item) => ({
            name: item.name,
            menu_id: item.menu_id || item.id,
            quantity: item.qty,
            price: item.unitPrice,
            price_at_purchase: item.unitPrice,
            image: item.image,
            note: item.note,
            status: "InKitchen",
          })),
        });
        setOrder(payableOrder);
      }

      const paymentData = {
        paymentMethod: paymentType.toLowerCase(),
        amount: finalTotal,
      };

      if (slipFile) {
        paymentData.slip = slipFile;
      }

      await paymentService.processPayment(payableOrder._id, paymentData);
      clearCart();
      alert(
        `Payment received via ${paymentType} for ${finalTotal.toFixed(2)} baht.`,
      );
      navigate("/cashier/orders");
    } catch (error) {
      console.error("Checkout failed:", error);
      alert(
        `Unable to process payment right now. ${error.message || ""}`.trim(),
      );
    } finally {
      setIsSubmitting(false);
      setSummaryOpen(false);
    }
  };

  const handleCheckout = () => {
    if (isCheckoutDisabled) return;
    setSummaryOpen(true);
  };

  const modeTabs = [
    { type: "DINE-IN", label: "DINE-IN", icon: Utensils },
    { type: "PICK-UP", label: "PICK-UP", icon: ShoppingBag },
    { type: "RESERVATION", label: "RESERVATION", icon: CalendarDays },
  ];

  return (
    <div className="flex bg-[#eeeeee] min-h-screen font-['IBM_Plex_Sans_Thai']">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen p-4 pt-24 md:ml-60 md:h-screen md:p-10">
        <OrderHeader
          orderNo={getOrderNumber(order)}
          tableType={
            order?._id
              ? getTableType(order)
              : getDraftTableType(orderDraft, orderType, tableId)
          }
          dateStr={getOrderDate(order)}
        />

        {/* 💡 1. เอากล่องสีเหลืองออก เปลี่ยนเป็น Flex ธรรมดา และจัดปุ่มใหม่ */}
        <div className="mb-4 flex flex-wrap justify-end gap-3">
          {modeTabs.map((tab) => {
            const isSelected = activeType === tab.type;
            // 💡 2. ล็อคปุ่ม PICK-UP และ RESERVATION ให้กดไม่ได้
            const isDisabled =
              tab.type === "PICK-UP" || tab.type === "RESERVATION";

            return (
              <button
                key={tab.type}
                type="button"
                disabled={isDisabled}
                onClick={() => !isDisabled && handleSelectOrderMode(tab.type)}
                className={`flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-full transition-all border-2
                  ${
                    isSelected
                      ? "bg-[#242424] text-white border-[#242424] shadow-md" // สีดำเมื่อถูกเลือก
                      : isDisabled
                        ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed" // สีเทากดไม่ได้
                        : "bg-white text-[#242424] border-gray-200 hover:border-[#242424]" // ขอบมนสีขาว
                  }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {statusMessage && (
          <div className="mb-4 rounded-xl border border-yellow-250 bg-yellow-50 px-4 py-3 text-sm font-bold text-yellow-700">
            {statusMessage}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border-2 border-dashed border-[#cccccc] bg-white/60 p-8 text-center font-bold text-[#888888]">
            Loading order...
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-6 overflow-visible min-h-0 xl:flex-row xl:overflow-hidden">
            {/* Left Side: Items */}
            <div className="flex-[1.2] flex flex-col min-w-0">
              <OrderItemList
                items={items}
                onRemoveItem={handleRemoveItem}
                discount={discount}
                setDiscount={setDiscount}
                serviceCharge={serviceChargeRate}
                setServiceCharge={setServiceChargeRate}
              />
            </div>

            {/* Right Side: Payment */}
            <div className="flex-1 flex flex-col gap-4 overflow-y-visible pr-0 pb-4 xl:overflow-y-auto xl:pr-2">
              <BillingSummary
                rawSubtotal={rawSubtotal}
                discountAmount={discount}
                scAmount={scAmount}
                taxAmount={taxAmount}
                finalTotal={finalTotal}
              />

              <PaymentMethodSelector
                selectedMethod={paymentType}
                onSelectMethod={setPaymentType}
              />

              {paymentType !== "CASH" && (
                <div className="border-2 border-[#242424] bg-white rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm uppercase tracking-wider">
                      Payment Slip (Required)
                    </span>
                    {slipFile && (
                      <span className="text-[10px] font-black text-green-600">
                        ✓ UPLOADED
                      </span>
                    )}
                  </div>

                  {!slipPreview ? (
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <div className="bg-[#242424] text-white p-2 rounded-lg mb-2">
                        <PlusCircle size={20} />
                      </div>
                      <span className="text-xs font-bold text-gray-500">
                        Click to upload slip
                      </span>
                    </label>
                  ) : (
                    <div className="relative aspect-4/5 w-full max-w-50 mx-auto group">
                      <img
                        src={slipPreview}
                        alt="Slip Preview"
                        className="w-full h-full object-cover rounded-lg border-2 border-[#242424]"
                      />
                      <button
                        onClick={() => {
                          setSlipFile(null);
                          setSlipPreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-md hover:bg-red-700 cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              )}

              <CashCalculator
                paymentType={paymentType}
                payAmount={payAmount}
                setPayAmount={setPayAmount}
                finalTotal={finalTotal}
                changeAmount={changeAmount}
              />

              <div className="mt-auto pt-2">
                <CheckoutButton
                  onCheckout={handleCheckout}
                  disabled={isCheckoutDisabled || isSubmitting}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <OrderSetupModal
        type={setupModalType}
        initialDraft={orderDraft}
        onClose={() => setSetupModalType(null)}
        onSubmit={(draft) => {
          setSetupModalType(null);
          handleStartOrder(setupModalType, draft);
        }}
      />

      <CheckoutSummaryModal
        isOpen={summaryOpen}
        orderType={activeType}
        tableId={activeTableId}
        draft={orderDraft}
        items={items}
        finalTotal={finalTotal}
        paymentType={paymentType}
        onClose={() => setSummaryOpen(false)}
        onConfirm={submitCheckout}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default CheckoutPage;

const OrderSetupModal = ({ type, initialDraft, onClose, onSubmit }) => {
  const [form, setForm] = useState(() => ({
    tableId: initialDraft?.tableId || "",
    customerName: initialDraft?.customerName || "Walk-in Customer",
    customerPhone: initialDraft?.customerPhone || "",
    bookingDate:
      initialDraft?.bookingDate || new Date().toISOString().split("T")[0],
    bookingTime: initialDraft?.bookingTime || "10:00-12:00",
    pax: initialDraft?.pax || 2,
    staffNote: initialDraft?.staffNote || "",
  }));
  const [availabilityByPax, setAvailabilityByPax] = useState({});
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const isReservation = type === "RESERVATION";
  const selectedAvailability = availabilityByPax[String(form.pax)];
  const isSelectedTableFull =
    isReservation && selectedAvailability?.available === false;
  const isSubmitDisabled =
    !form.tableId.trim() ||
    (isReservation &&
      (!form.bookingDate ||
        !form.bookingTime ||
        checkingAvailability ||
        isSelectedTableFull));

  useEffect(() => {
    if (!isReservation || !form.bookingDate || !form.bookingTime) return;

    let ignore = false;
    setCheckingAvailability(true);

    const checkAvailability = async () => {
      const results = await Promise.all(
        [2, 6, 10].map(async (pax) => {
          try {
            const availability = await tableService.getAvailability({
              date: form.bookingDate,
              timeSlot: form.bookingTime,
              pax,
            });
            return [
              String(pax),
              {
                available: Boolean(availability.available),
                tableId: availability.tableId || "",
              },
            ];
          } catch (error) {
            console.error(
              `Failed to check cashier reservation availability for ${pax} pax:`,
              error,
            );
            return [String(pax), { available: false, tableId: "" }];
          }
        }),
      );

      if (ignore) return;
      const nextAvailability = Object.fromEntries(results);
      setAvailabilityByPax(nextAvailability);
      const selected = nextAvailability[String(form.pax)];
      if (selected?.available && selected.tableId) {
        setForm((current) => ({ ...current, tableId: selected.tableId }));
      }
      setCheckingAvailability(false);
    };

    checkAvailability();
    return () => {
      ignore = true;
    };
  }, [isReservation, form.bookingDate, form.bookingTime, form.pax]);

  if (!type) return null;

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border-2 border-[#242424] bg-white shadow-2xl">
        <div className="border-b-4 border-[#e4002b] bg-[#242424] px-5 py-4 text-white">
          <h2 className="font-['Bebas_Neue'] text-3xl tracking-widest">
            {isReservation ? "RESERVATION SETUP" : "DINE-IN SETUP"}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-bold">
            Table
            <input
              value={form.tableId}
              onChange={(event) =>
                setForm({ ...form, tableId: event.target.value })
              }
              placeholder="T-01"
              className="rounded-lg border-2 border-gray-200 px-3 py-2 outline-none focus:border-[#242424]"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold">
            Customer Name
            <input
              value={form.customerName}
              onChange={(event) =>
                setForm({ ...form, customerName: event.target.value })
              }
              className="rounded-lg border-2 border-gray-200 px-3 py-2 outline-none focus:border-[#242424]"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold">
            Phone
            <input
              value={form.customerPhone}
              onChange={(event) =>
                setForm({ ...form, customerPhone: event.target.value })
              }
              className="rounded-lg border-2 border-gray-200 px-3 py-2 outline-none focus:border-[#242424]"
            />
          </label>
          {isReservation && (
            <>
              <label className="flex flex-col gap-1 text-sm font-bold">
                Booking Date
                <input
                  type="date"
                  value={form.bookingDate}
                  onChange={(event) =>
                    setForm({ ...form, bookingDate: event.target.value })
                  }
                  className="rounded-lg border-2 border-gray-200 px-3 py-2 outline-none focus:border-[#242424]"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-bold">
                Booking Time
                <select
                  value={form.bookingTime}
                  onChange={(event) =>
                    setForm({ ...form, bookingTime: event.target.value })
                  }
                  className="rounded-lg border-2 border-gray-200 px-3 py-2 outline-none focus:border-[#242424]"
                >
                  <option value="10:00-12:00">10:00-12:00</option>
                  <option value="13:00-15:00">13:00-15:00</option>
                  <option value="16:00-18:00">16:00-18:00</option>
                  <option value="19:00-21:00">19:00-21:00</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm font-bold">
                Number of People
                <select
                  value={form.pax}
                  onChange={(event) =>
                    setForm({ ...form, pax: event.target.value })
                  }
                  className="rounded-lg border-2 border-gray-200 px-3 py-2 outline-none focus:border-[#242424]"
                >
                  <option
                    value="2"
                    disabled={availabilityByPax["2"]?.available === false}
                  >
                    1-2 People{" "}
                    {availabilityByPax["2"]?.available === false
                      ? "(Table is full)"
                      : "(Requires >= THB 300)"}
                  </option>
                  <option
                    value="6"
                    disabled={availabilityByPax["6"]?.available === false}
                  >
                    3-6 People{" "}
                    {availabilityByPax["6"]?.available === false
                      ? "(Table is full)"
                      : "(Requires >= THB 600)"}
                  </option>
                  <option
                    value="10"
                    disabled={availabilityByPax["10"]?.available === false}
                  >
                    7-10 People{" "}
                    {availabilityByPax["10"]?.available === false
                      ? "(Table is full)"
                      : "(Requires >= THB 1000)"}
                  </option>
                </select>
                <span className="text-[11px] font-bold text-red-600">
                  11+ People: please contact staff.
                </span>
                {checkingAvailability && (
                  <span className="text-[11px] font-bold text-gray-500">
                    Checking table availability...
                  </span>
                )}
                {isSelectedTableFull && (
                  <span className="text-[11px] font-bold text-red-600">
                    Table is full for this date, time, and party size.
                  </span>
                )}
              </label>
            </>
          )}
          <label className="flex flex-col gap-1 text-sm font-bold sm:col-span-2">
            Staff Note
            <textarea
              value={form.staffNote}
              onChange={(event) =>
                setForm({ ...form, staffNote: event.target.value })
              }
              rows={3}
              className="resize-none rounded-lg border-2 border-gray-200 px-3 py-2 outline-none focus:border-[#242424]"
            />
          </label>
        </div>
        <div className="flex flex-col gap-2 border-t border-gray-200 p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border-2 border-gray-200 px-5 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50"
          >
            CANCEL
          </button>
          <button
            type="button"
            disabled={isSubmitDisabled}
            onClick={() => onSubmit(form)}
            className="rounded-xl bg-[#242424] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            CONTINUE TO MENU
          </button>
        </div>
      </div>
    </div>
  );
};

const CheckoutSummaryModal = ({
  isOpen,
  orderType,
  tableId,
  draft,
  items,
  finalTotal,
  paymentType,
  onClose,
  onConfirm,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border-2 border-[#242424] bg-white shadow-2xl">
        <div className="border-b-4 border-[#e4002b] bg-[#242424] px-5 py-4 text-white">
          <h2 className="font-['Bebas_Neue'] text-3xl tracking-widest">
            ORDER SUMMARY
          </h2>
        </div>
        <div className="max-h-[70dvh] overflow-y-auto p-5">
          <div className="mb-4 grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-4 text-sm sm:grid-cols-2">
            <p>
              <strong>Type:</strong> {orderType}
            </p>
            <p>
              <strong>Table:</strong> {tableId || "-"}
            </p>
            <p>
              <strong>Customer:</strong>{" "}
              {draft?.customerName || "Walk-in Customer"}
            </p>
            <p>
              <strong>Phone:</strong> {draft?.customerPhone || "-"}
            </p>
            {orderType === "RESERVATION" && (
              <>
                <p>
                  <strong>Date:</strong> {draft?.bookingDate || "-"}
                </p>
                <p>
                  <strong>Time:</strong> {draft?.bookingTime || "-"}
                </p>
                <p>
                  <strong>Pax:</strong> {draft?.pax || "-"} Persons
                </p>
              </>
            )}
            <p>
              <strong>Payment:</strong> {paymentType}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0"
              >
                <span className="font-bold">
                  {item.qty}x {item.name}
                </span>
                <span>฿{item.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right font-['Bebas_Neue'] text-4xl text-[#e4002b]">
            ฿
            {finalTotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-gray-200 p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border-2 border-gray-200 px-5 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50"
          >
            BACK
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#e4002b] px-5 py-3 text-sm font-bold text-white disabled:bg-gray-300"
          >
            <CheckCircle2 size={18} />
            CONFIRM ORDER
          </button>
        </div>
      </div>
    </div>
  );
};
