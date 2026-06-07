import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  CreditCard,
  Image as ImageIcon,
  Printer,
  User,
  Phone,
  MapPin,
  Clock,
  FileText,
  Receipt,
  ChevronDown,
  ChevronUp,
  UserCheck,
} from "lucide-react";

const OrderDetailModal = ({
  isOpen,
  onClose,
  order,
  onPrintBill,
  onMarkAsCompleted,
  isHistoryMode = false,
  isFromBell = false,
  onConfirmPayment,
  isSlipVerified = false,
  onCheckIn,
  onPayReservation,
  onReceiveReservation,
}) => {
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    if (isOpen && order && order.subOrders && order.subOrders.length > 0) {
      const firstKey = order.subOrders[0].roundName || "Order 1";
      setExpandedOrders({ [firstKey]: true });
    }
  }, [isOpen, order]);

  const toggleExpand = (roundKey) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [roundKey]: !prev[roundKey],
    }));
  };

  if (!isOpen || !order) return null;

  const currentStatus = order.status?.toUpperCase() || "PENDING";
  const hasSlip = !!order.raw?.slipAttached;
  const slipUrl = order.raw?.slipUrl || order.raw?.evidenceImage || "";
  const isDineIn = order.type === "DINE-IN";
  const isCancelled = currentStatus === "CANCELLED";

  let isReadyToComplete = false;
  let completeButtonText = "COMPLETE";

  if (order.type === "DELIVERY") {
    completeButtonText = "DELIVERED";
    isReadyToComplete = currentStatus === "DELIVERED";
  } else if (order.type === "PICK-UP") {
    completeButtonText = "PICKED UP";
    isReadyToComplete = currentStatus === "READY";
  } else if (order.type === "DINE-IN") {
    completeButtonText = "SERVED";
    isReadyToComplete = currentStatus === "READY";
  } else if (order.type === "RESERVATION") {
    completeButtonText = "CLEAR TABLE";
    isReadyToComplete = currentStatus === "RECEIVED"; // ปลดล็อกเฉพาะเมื่อได้รับอาหารเรียบร้อยแล้ว
  }

  // 💡 ขั้นตอนติดตามสำหรับ Reservation
  const getTrackerSteps = () => {
    switch (order.type) {
      case "DELIVERY":
        return ["PENDING", "COOKING", "ON THE WAY", "DELIVERED"];
      case "PICK-UP":
        return ["PENDING", "COOKING", "READY", "PICKED UP"];
      case "DINE-IN":
        return ["PENDING", "COOKING", "READY", "SERVED"];
      case "RESERVATION":
        return ["RESERVED", "CHECKED-IN", "COOKING", "RECEIVED"];
      default:
        return ["PENDING", "COMPLETED"];
    }
  };

  const steps = getTrackerSteps();
  // แมป READY เข้ากับสเต็ป COOKING ในหน้า Stepper เพื่อความต่อเนื่อง
  const activeStatusForSteps =
    order.type === "RESERVATION" && currentStatus === "READY"
      ? "COOKING"
      : currentStatus;
  const currentStepIndex = Math.max(0, steps.indexOf(activeStatusForSteps));

  const displayItems = order.items && order.items.length > 0 ? order.items : [];

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-1000 p-4 font-['IBM_Plex_Sans_Thai']"
      onClick={onClose}
    >
      <div
        className="relative bg-[#f8f9fa] w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden border-2 border-[#242424]"
        onClick={(e) => e.stopPropagation()}
      >
        {isCancelled && (
          <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
            <span className="text-6xl md:text-8xl font-['Bebas_Neue'] text-red-500/10 -rotate-45 tracking-widest border-8 border-red-500/10 p-6 rounded-3xl select-none">
              CANCELLED
            </span>
          </div>
        )}

        {/* --- HEADER --- */}
        <div className="bg-[#242424] px-6 py-4 flex justify-between items-center text-white shrink-0 relative z-10">
          <div>
            <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest block opacity-80">
              Order No.
            </span>
            <div className="flex items-center gap-3">
              <h2 className="font-['Bebas_Neue'] text-4xl tracking-widest leading-none mt-1">
                {order.orderId}
              </h2>
              <span className="bg-[#e4002b] text-white px-2 py-0.5 text-[0.65rem] font-bold uppercase rounded tracking-wider">
                {order.isFromReservation ? "DINE-IN (RESERVED)" : order.type}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* --- BODY --- */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 relative z-10 custom-scrollbar">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-[#242424] text-sm flex items-center gap-2">
                <Clock size={16} className="text-[#e4002b]" /> ORDER STATUS
              </h4>
              <span className="text-[#e4002b] font-black uppercase text-sm tracking-wider">
                {currentStatus}
              </span>
            </div>
            <div className="relative mt-4 mb-2 px-2">
              <div className="absolute top-2.5 left-0 w-full h-1 bg-gray-100 rounded-full z-0"></div>
              <div
                className="absolute top-2.5 left-0 h-1 bg-[#e4002b] rounded-full z-0 transition-all duration-500"
                style={{
                  width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                }}
              ></div>
              <div className="flex justify-between relative z-10">
                {steps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  return (
                    <div
                      key={step}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-[3px] flex items-center justify-center transition-all bg-white ${isCurrent ? "border-[#e4002b] scale-125" : isCompleted ? "border-[#242424]" : "border-gray-200"}`}
                      >
                        {isCompleted && !isCurrent && (
                          <div className="w-2 h-2 bg-[#242424] rounded-full"></div>
                        )}
                      </div>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider text-center ${isCompleted ? "text-[#242424]" : "text-gray-400"}`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs border-b border-gray-100 pb-2 mb-3">
                Customer Details
              </h4>
              <ul className="flex flex-col gap-2.5 text-sm">
                <li className="flex items-start gap-3 text-gray-600">
                  <User size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <span className="font-bold text-[#242424]">
                    {order.raw?.customer?.name || "Walk-in Customer"}
                  </span>
                </li>
                {order.raw?.customer?.phone && (
                  <li className="flex items-start gap-3 text-gray-600">
                    <Phone
                      size={16}
                      className="text-gray-400 mt-0.5 shrink-0"
                    />
                    <span>{order.raw.customer.phone}</span>
                  </li>
                )}
                {order.type === "DELIVERY" && order.raw?.address && (
                  <li className="flex items-start gap-3 text-gray-600">
                    <MapPin
                      size={16}
                      className="text-gray-400 mt-0.5 shrink-0"
                    />
                    <span className="leading-relaxed">{order.raw.address}</span>
                  </li>
                )}
                {order.type === "PICK-UP" && order.raw?.pickupTime && (
                  <li className="flex items-start gap-3 text-gray-600">
                    <Clock
                      size={16}
                      className="text-gray-400 mt-0.5 shrink-0"
                    />
                    <span>
                      Pickup at:{" "}
                      <strong className="text-[#e4002b]">
                        {order.raw.pickupTime}
                      </strong>
                    </span>
                  </li>
                )}
                {order.type === "RESERVATION" && (
                  <>
                    <li className="flex items-start gap-3 text-gray-600">
                      <Clock
                        size={16}
                        className="text-gray-400 mt-0.5 shrink-0"
                      />
                      <span>
                        Time:{" "}
                        <strong className="text-[#e4002b]">
                          {order.raw?.time}
                        </strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-600">
                      <User
                        size={16}
                        className="text-gray-400 mt-0.5 shrink-0"
                      />
                      <span>
                        Pax: <strong>{order.raw?.pax} Persons</strong>
                      </span>
                    </li>
                  </>
                )}
                {order.type === "DINE-IN" && order.table && (
                  <li className="flex items-start gap-3 text-gray-600">
                    <MapPin
                      size={16}
                      className="text-gray-400 mt-0.5 shrink-0"
                    />
                    <span>
                      Table:{" "}
                      <strong className="text-[#e4002b]">
                        {order.table} {order.isFromReservation && "(Reserved)"}
                      </strong>
                    </span>
                  </li>
                )}
              </ul>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
              <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs border-b border-gray-100 pb-2 mb-3">
                Order Notes
              </h4>
              <div className="text-sm text-yellow-800 bg-yellow-50 p-3 rounded-xl border border-yellow-100 flex-1 flex items-start gap-2">
                <FileText
                  size={16}
                  className="text-yellow-600 shrink-0 mt-0.5"
                />
                <span className="font-medium italic leading-relaxed">
                  {order.raw?.customer?.note ||
                    order.raw?.note ||
                    "ไม่มีโน้ตเพิ่มเติมจากลูกค้า"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs border-b border-gray-100 pb-2 mb-4">
              Order Items
            </h4>

            {order.subOrders && order.subOrders.length > 0 ? (
              <div className="flex flex-col gap-3">
                {order.subOrders.map((sub, index) => {
                  const roundKey = sub.roundName || `Order ${index + 1}`;
                  const isOpen = !!expandedOrders[roundKey];

                  return (
                    <div
                      key={roundKey}
                      className="border border-gray-255 rounded-xl overflow-hidden shadow-sm"
                    >
                      <button
                        onClick={() => toggleExpand(roundKey)}
                        className="w-full bg-gray-50 px-4 py-3 flex justify-between items-center font-bold text-xs text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Receipt size={14} className="text-[#e4002b]" />
                          <span>{roundKey}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[#e4002b]">
                            ฿{sub.total?.toLocaleString()}
                          </span>
                          {isOpen ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="p-4 bg-white flex flex-col gap-3.5 divide-y divide-gray-100">
                          {sub.items.map((item, itemIdx) => (
                            <div
                              key={itemIdx}
                              className="flex justify-between items-start pt-3 first:pt-0"
                            >
                              <div className="flex gap-4">
                                <span className="font-black w-4 text-sm text-[#e4002b]">
                                  {item.qty}x
                                </span>
                                <div>
                                  <p className="font-bold text-xs text-[#242424]">
                                    {item.name}
                                  </p>
                                  {item.note && (
                                    <p className="text-[10px] text-gray-500 mt-0.5 bg-gray-100 px-2 py-0.5 rounded w-fit">
                                      Note: {item.note}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className="font-bold text-xs text-[#242424]">
                                ฿{(item.price * item.qty).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {displayItems.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex justify-between items-start"
                  >
                    <div className="flex gap-4">
                      <span
                        className={`font-black w-4 text-lg leading-none mt-0.5 ${isCancelled ? "text-gray-400" : "text-[#e4002b]"}`}
                      >
                        {item.qty}x
                      </span>
                      <div>
                        <p
                          className={`font-bold text-sm leading-tight ${isCancelled ? "text-gray-500" : "text-[#242424]"}`}
                        >
                          {item.name}
                        </p>
                        {item.note && (
                          <p className="text-xs text-gray-500 mt-1 bg-gray-100 px-2 py-1 rounded w-fit">
                            Note: {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`font-bold tracking-wide text-sm ${isCancelled ? "text-gray-400" : "text-[#242424]"}`}
                    >
                      ฿{(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!isHistoryMode && hasSlip && (
            <div className="bg-white p-5 rounded-2xl border-2 border-[#0284c7]">
              <h4 className="font-bold text-[#0284c7] mb-3 text-xs uppercase tracking-widest flex items-center gap-2">
                <Receipt size={14} /> PAYMENT SLIP
              </h4>
              {slipUrl ? (
                <a
                  href={slipUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-black/5 rounded-xl border-2 border-dashed border-[#bae6fd] h-56 overflow-hidden hover:bg-black/10 transition-colors relative group"
                >
                  <img
                    src={slipUrl}
                    alt="Payment slip"
                    className="w-full h-full object-contain bg-white"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/65 text-white px-3 py-2 text-xs font-bold flex justify-between gap-3">
                    <span>Click to view full slip</span>
                    <span>฿{order.totalAmount?.toLocaleString()}</span>
                  </div>
                </a>
              ) : (
                <div className="bg-black/5 rounded-xl border-2 border-dashed border-[#bae6fd] h-40 flex flex-col items-center justify-center text-[#0284c7] gap-2 overflow-hidden relative">
                  <ImageIcon size={32} className="opacity-50" />
                  <span className="font-bold text-sm">Slip attached, image unavailable</span>
                  <span className="text-xs opacity-70">
                    ยอดโอน: ฿{order.totalAmount?.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- FOOTER --- */}
        <div className="bg-white p-6 border-t-2 border-gray-200 flex flex-col md:flex-row items-center justify-between shrink-0 z-10 gap-4 md:gap-0">
          <div className="flex flex-col text-center md:text-left w-full md:w-auto">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Total Amount
            </span>
            <span
              className={`font-['Bebas_Neue'] text-5xl leading-none mt-1 ${isCancelled ? "text-gray-400 line-through" : "text-[#e4002b]"}`}
            >
              ฿{order.totalAmount?.toLocaleString() || "0"}
            </span>
          </div>

          <div className="flex flex-wrap md:flex-nowrap justify-end gap-2 w-full md:w-auto">
            {isFromBell ? (
              hasSlip && !isSlipVerified ? (
                <button
                  onClick={() => {
                    onConfirmPayment(order.orderId);
                    onClose();
                  }}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 text-sm font-black uppercase px-8 py-3 rounded-xl transition-all bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-md cursor-pointer"
                >
                  <CheckCircle2 size={18} /> CONFIRM PAYMENT
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="flex-1 md:flex-none bg-[#242424] text-white px-8 py-3 font-bold text-sm uppercase rounded-xl hover:bg-[#333333] transition-all cursor-pointer"
                >
                  CLOSE
                </button>
              )
            ) : isHistoryMode ? (
              !isCancelled && (
                <button
                  onClick={() => alert("Printing Bill...")}
                  className="flex-1 md:flex-none bg-white border-2 border-[#242424] text-[#242424] px-6 py-3 font-bold text-sm uppercase rounded-xl hover:bg-[#242424] hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Printer size={18} /> Reprint Bill
                </button>
              )
            ) : (
              <>
                {/* ⚡ ปุ่มเช็คอิน Reservation */}
                {order.type === "RESERVATION" &&
                  currentStatus === "RESERVED" && (
                    <button
                      onClick={() => {
                        onCheckIn(order.orderId);
                        onClose();
                      }}
                      className="flex-1 md:flex-none bg-[#242424] hover:bg-[#333] text-white px-6 py-3 font-bold text-sm uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer animate-pulse"
                    >
                      <UserCheck size={18} /> CHECK IN
                    </button>
                  )}

                {/* ⚡ ปุ่มชำระเงินและเปิด Dine-In ของ Reservation */}
                {order.type === "RESERVATION" &&
                  currentStatus === "CHECKED-IN" && (
                    <button
                      onClick={() => {
                        onPayReservation(order.orderId);
                        onClose();
                      }}
                      className="flex-1 md:flex-none bg-[#242424] hover:bg-[#333] text-white px-6 py-3 font-bold text-sm uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer animate-pulse"
                    >
                      <CreditCard size={18} />
                      {/* 💡 แสดงคำอธิบายปุ่มตามสถานะการชำระเงินจริง */}
                      {order.isPaid ||
                      order.paymentStatus === "PAID" ||
                      order.paymentMethod === "QR" ||
                      hasSlip
                        ? "SEND TO KITCHEN"
                        : "PAY & SEND TO KITCHEN"}
                    </button>
                  )}

                {/* ⚡ ปุ่ม RECEIVED (ล็อก) ของออเดอร์ Reservation ที่ส่งครัวแล้ว แต่รออาหารเสร็จ */}
                {order.type === "RESERVATION" &&
                  currentStatus === "COOKING" && (
                    <button
                      disabled
                      className="flex-1 md:flex-none bg-gray-50 text-gray-300 border border-gray-200 px-6 py-3 font-bold text-sm uppercase rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={18} /> RECEIVED (WAITING COOK)
                    </button>
                  )}

                {/* ⚡ ปุ่ม RECEIVED (ปลดล็อก) เมื่อสถานะขยับเป็น READY */}
                {order.type === "RESERVATION" && currentStatus === "READY" && (
                  <button
                    onClick={() => {
                      onReceiveReservation(order.orderId);
                      onClose();
                    }}
                    className="flex-1 md:flex-none bg-[#242424] hover:bg-[#333] text-white px-6 py-3 font-bold text-sm uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer animate-pulse"
                  >
                    <CheckCircle2 size={18} /> RECEIVED
                  </button>
                )}

                {/* ปุ่ม Checkout ของ Dine-in ปกติ */}
                {!hasSlip && isDineIn && !isReadyToComplete && (
                  <button
                    onClick={() => {
                      onClose();
                      if (onPrintBill)
                        onPrintBill(order.backendId || order.orderId);
                    }}
                    className="flex-1 md:flex-none bg-[#242424] text-white px-6 py-3 font-bold text-sm uppercase rounded-xl hover:bg-[#444444] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <CreditCard size={18} /> CHECKOUT
                  </button>
                )}

                {/* ปุ่ม Complete สำหรับส่งออเดอร์ไปหน้าประวัติ */}
                {(order.type !== "RESERVATION" ||
                  currentStatus === "RECEIVED") && (
                  <button
                    disabled={!isReadyToComplete}
                    onClick={() => {
                      onClose();
                      if (onMarkAsCompleted) onMarkAsCompleted(order.orderId);
                    }}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 text-sm font-black uppercase px-6 py-3 rounded-xl transition-all border-2 ${isReadyToComplete ? "bg-[#28a745] text-white border-[#28a745] hover:bg-[#218838] shadow-md cursor-pointer" : "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"}`}
                  >
                    <CheckCircle2 size={18} /> {completeButtonText} (TO HISTORY)
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
