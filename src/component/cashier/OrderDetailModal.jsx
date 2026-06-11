import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  CreditCard,
  Image as ImageIcon,
  Printer,
  User,
  Calendar,
  Phone,
  MapPin,
  Clock,
  FileText,
  Receipt,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const getFirstText = (...values) =>
  values.find((value) => String(value || "").trim())?.toString().trim() || "";

const parseServiceFromCustomerNote = (note = "") => {
  const detail = String(note || "").split("|")[1] || "";
  return {
    date: detail.match(/\d{4}-\d{2}-\d{2}/)?.[0] || "",
    time: detail.match(/\d{1,2}:\d{2}(?:\s*-\s*\d{1,2}:\d{2})?/)?.[0] || "",
  };
};

const formatDateText = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTimeText = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

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
  onAcceptOrder,
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
  const orderKind = order.normalizedType || order.type;
  const paymentSlipUrl =
    order.raw?.slipUrl || order.raw?.payment?.slipUrl || order.raw?.receiptUrl || "";
  const hasSlip = !!order.raw?.slipAttached || !!paymentSlipUrl;
  const deliveryEvidenceUrl = order.raw?.evidenceImage || "";
  const isDineIn = orderKind === "DINE-IN";
  const isCancelled = currentStatus === "CANCELLED";
  const serviceFromNote = parseServiceFromCustomerNote(order.raw?.customer?.note);
  const customerName = getFirstText(
    order.raw?.customer?.name,
    order.raw?.customerSnapshot?.name,
    order.customer,
    "Walk-in Customer",
  );
  const customerPhone = getFirstText(
    order.raw?.customer?.phone,
    order.raw?.customer?.contact,
    order.raw?.customerSnapshot?.phone,
  );
  const customerAddress = getFirstText(
    order.raw?.address,
    order.raw?.customer?.address,
    order.raw?.customerSnapshot?.address,
  );
  const serviceDate = getFirstText(order.raw?.bookingDate, serviceFromNote.date);
  const serviceTime = getFirstText(
    order.raw?.bookingTime,
    order.raw?.pickupTime,
    order.raw?.time,
    serviceFromNote.time,
  );
  const staffNote = getFirstText(order.raw?.noteForStaff, order.raw?.note_global);
  const cancellationReason = getFirstText(
    order.raw?.cancelReason,
    isCancelled ? staffNote : "",
  );
  const cancelledBy = order.raw?.cancelledBy;
  const rider = order.raw?.rider;

  let isReadyToComplete = false;
  let completeButtonText = "COMPLETE";

  if (orderKind === "DELIVERY") {
    completeButtonText = "DELIVERED";
    isReadyToComplete = currentStatus === "DELIVERED";
  } else if (orderKind === "PICK-UP") {
    completeButtonText = "PICKED UP";
    isReadyToComplete = currentStatus === "READY";
  } else if (orderKind === "DINE-IN") {
    completeButtonText = "SERVED";
    isReadyToComplete = currentStatus === "READY";
  } else if (orderKind === "RESERVATION") {
    completeButtonText = "CLEAR TABLE";
    isReadyToComplete = currentStatus === "RECEIVED"; // ปลดล็อกเฉพาะเมื่อได้รับอาหารเรียบร้อยแล้ว
  }

  // 💡 ขั้นตอนติดตามสำหรับ Reservation
  const getTrackerSteps = () => {
    switch (orderKind) {
      case "DELIVERY":
        return ["PENDING", "COOKING", "ON THE WAY", "DELIVERED"];
      case "PICK-UP":
        return ["PENDING", "COOKING", "READY", "PICKED UP"];
      case "DINE-IN":
        return ["PENDING", "COOKING", "READY", "SERVED"];
      case "RESERVATION":
        return ["RESERVED", "COOKING", "RECEIVED"];
      default:
        return ["PENDING", "COMPLETED"];
    }
  };

  const steps = getTrackerSteps();
  // แมป READY เข้ากับสเต็ป COOKING ในหน้า Stepper เพื่อความต่อเนื่อง
  const activeStatusForSteps =
    orderKind === "RESERVATION" && currentStatus === "READY"
      ? "COOKING"
      : currentStatus;
  const currentStepIndex = Math.max(0, steps.indexOf(activeStatusForSteps));

  const displayItems = order.items && order.items.length > 0 ? order.items : [];
  const orderCreatedAt = order.raw?.createdAt ? new Date(order.raw.createdAt) : null;
  const hasOrderDate = orderCreatedAt && !Number.isNaN(orderCreatedAt.getTime());
  const orderDateText = hasOrderDate
    ? formatDateText(orderCreatedAt)
    : "";
  const orderTimeText = hasOrderDate
    ? formatTimeText(orderCreatedAt)
    : "";

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
                    {customerName}
                  </span>
                </li>
                {orderDateText && (
                  <li className="flex items-start gap-3 text-gray-600">
                    <Calendar
                      size={16}
                      className="text-gray-400 mt-0.5 shrink-0"
                    />
                    <span>
                      Date:{" "}
                      <strong className="text-[#242424]">
                        {orderDateText}
                      </strong>
                    </span>
                  </li>
                )}
                {orderTimeText && (
                  <li className="flex items-start gap-3 text-gray-600">
                    <Clock
                      size={16}
                      className="text-gray-400 mt-0.5 shrink-0"
                    />
                    <span>
                      Time:{" "}
                      <strong className="text-[#242424]">
                        {orderTimeText}
                      </strong>
                    </span>
                  </li>
                )}
                {customerPhone && (
                  <li className="flex items-start gap-3 text-gray-600">
                    <Phone
                      size={16}
                      className="text-gray-400 mt-0.5 shrink-0"
                    />
                    <span>{customerPhone}</span>
                  </li>
                )}
                {orderKind === "DELIVERY" && customerAddress && (
                  <li className="flex items-start gap-3 text-gray-600">
                    <MapPin
                      size={16}
                      className="text-gray-400 mt-0.5 shrink-0"
                    />
                    <span className="leading-relaxed">{customerAddress}</span>
                  </li>
                )}
                {orderKind === "PICK-UP" && serviceTime && (
                  <li className="flex items-start gap-3 text-gray-600">
                    <Clock
                      size={16}
                      className="text-gray-400 mt-0.5 shrink-0"
                    />
                    <span>
                      Pickup at:{" "}
                      <strong className="text-[#e4002b]">
                        {serviceTime}
                      </strong>
                    </span>
                  </li>
                )}
                {orderKind === "RESERVATION" && (
                  <>
                    {serviceDate && (
                      <li className="flex items-start gap-3 text-gray-600">
                        <Calendar
                          size={16}
                          className="text-gray-400 mt-0.5 shrink-0"
                        />
                        <span>
                          Booking Date:{" "}
                          <strong className="text-[#e4002b]">
                            {formatDateText(serviceDate)}
                          </strong>
                        </span>
                      </li>
                    )}
                    <li className="flex items-start gap-3 text-gray-600">
                      <Clock
                        size={16}
                        className="text-gray-400 mt-0.5 shrink-0"
                      />
                      <span>
                        Time:{" "}
                        <strong className="text-[#e4002b]">
                          {serviceTime || "N/A"}
                        </strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-600">
                      <User
                        size={16}
                        className="text-gray-400 mt-0.5 shrink-0"
                      />
                      <span>
                        Pax: <strong>{order.raw?.pax || order.raw?.reservationPax} Persons</strong>
                      </span>
                    </li>
                  </>
                )}
                {orderKind === "DINE-IN" && order.table && (
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
                  {staffNote || "ไม่มีโน้ตเพิ่มเติมจากลูกค้า"}
                </span>
              </div>
            </div>
          </div>

          {(orderKind === "DELIVERY" || orderKind === "RESERVATION" || orderKind === "PICK-UP") && (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs border-b border-gray-100 pb-2 mb-3">
                Service Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {serviceDate && (
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                    <p className="text-[10px] font-black uppercase text-gray-400">Service Date</p>
                    <p className="mt-1 font-bold text-[#242424]">{formatDateText(serviceDate)}</p>
                  </div>
                )}
                {serviceTime && (
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                    <p className="text-[10px] font-black uppercase text-gray-400">Service Time</p>
                    <p className="mt-1 font-bold text-[#242424]">{serviceTime}</p>
                  </div>
                )}
                {orderKind === "DELIVERY" && customerAddress && (
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 md:col-span-2">
                    <p className="text-[10px] font-black uppercase text-gray-400">Delivery Address</p>
                    <p className="mt-1 font-bold text-[#242424]">{customerAddress}</p>
                  </div>
                )}
                {orderKind === "RESERVATION" && order.table && (
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                    <p className="text-[10px] font-black uppercase text-gray-400">Table</p>
                    <p className="mt-1 font-bold text-[#242424]">{order.table}</p>
                  </div>
                )}
                {orderKind === "RESERVATION" && (order.raw?.pax || order.raw?.reservationPax) && (
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                    <p className="text-[10px] font-black uppercase text-gray-400">Guests</p>
                    <p className="mt-1 font-bold text-[#242424]">{order.raw?.pax || order.raw?.reservationPax} Persons</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {(rider?.name || rider?.phone || rider?.vehicle || rider?.plate) && (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs border-b border-gray-100 pb-2 mb-3">
                Rider Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {rider.name && <p><strong>Rider:</strong> {rider.name}</p>}
                {rider.phone && <p><strong>Phone:</strong> {rider.phone}</p>}
                {rider.vehicle && <p><strong>Vehicle:</strong> {rider.vehicle}</p>}
                {rider.plate && <p><strong>Plate:</strong> {rider.plate}</p>}
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="bg-red-50 p-5 rounded-2xl border-2 border-red-200 shadow-sm">
              <h4 className="font-bold text-red-600 uppercase tracking-widest text-xs border-b border-red-200 pb-2 mb-3">
                Cancellation Details
              </h4>
              <div className="flex flex-col gap-2 text-sm text-red-900">
                <p>
                  <strong>Reason:</strong>{" "}
                  {cancellationReason || "ไม่มีการระบุสาเหตุ"}
                </p>
                {(cancelledBy?.name || cancelledBy?.role) && (
                  <p>
                    <strong>Cancelled By:</strong>{" "}
                    {[cancelledBy?.name, cancelledBy?.role && `(${cancelledBy.role})`]
                      .filter(Boolean)
                      .join(" ")}
                  </p>
                )}
                {rider?.name && (
                  <p>
                    <strong>Rider:</strong> {rider.name}
                    {rider.phone ? ` | ${rider.phone}` : ""}
                  </p>
                )}
              </div>
            </div>
          )}

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

          {(order.raw?.payment?.method || order.raw?.payment?.paidAt || order.raw?.payment?.transactionId) && (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs border-b border-gray-100 pb-2 mb-3 flex items-center gap-2">
                <CreditCard size={14} /> Payment Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                {order.raw?.payment?.method && (
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                    <p className="text-[10px] font-black uppercase text-gray-400">Method</p>
                    <p className="mt-1 font-bold text-[#242424]">{order.raw.payment.method}</p>
                  </div>
                )}
                {order.raw?.payment?.paidAt && (
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                    <p className="text-[10px] font-black uppercase text-gray-400">Paid At</p>
                    <p className="mt-1 font-bold text-[#242424]">
                      {formatDateText(order.raw.payment.paidAt)} {formatTimeText(order.raw.payment.paidAt)}
                    </p>
                  </div>
                )}
                {order.raw?.payment?.transactionId && (
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                    <p className="text-[10px] font-black uppercase text-gray-400">Transaction</p>
                    <p className="mt-1 font-bold text-[#242424] break-all">{order.raw.payment.transactionId}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {hasSlip && (
            <div className="bg-white p-5 rounded-2xl border-2 border-[#0284c7]">
              <h4 className="font-bold text-[#0284c7] mb-3 text-xs uppercase tracking-widest flex items-center gap-2">
                <Receipt size={14} /> PAYMENT SLIP
              </h4>
              {paymentSlipUrl ? (
                <a
                  href={paymentSlipUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-black/5 rounded-xl border-2 border-dashed border-[#bae6fd] h-56 overflow-hidden hover:bg-black/10 transition-colors relative group"
                >
                  <img
                    src={paymentSlipUrl}
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

          {deliveryEvidenceUrl && deliveryEvidenceUrl !== paymentSlipUrl && (
            <div className="bg-white p-5 rounded-2xl border-2 border-[#16a34a]">
              <h4 className="font-bold text-[#16a34a] mb-3 text-xs uppercase tracking-widest flex items-center gap-2">
                <ImageIcon size={14} /> DELIVERY EVIDENCE
              </h4>
              <a
                href={deliveryEvidenceUrl}
                target="_blank"
                rel="noreferrer"
                className="block bg-black/5 rounded-xl border-2 border-dashed border-green-200 h-56 overflow-hidden hover:bg-black/10 transition-colors relative group"
              >
                <img
                  src={deliveryEvidenceUrl}
                  alt="Delivery evidence"
                  className="w-full h-full object-contain bg-white"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/65 text-white px-3 py-2 text-xs font-bold">
                  Click to view full evidence
                </div>
              </a>
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
                {/* ⚡ ปุ่ม Accept สำหรับออเดอร์ใหม่ (PENDING) */}
                {currentStatus === "PENDING" && (
                  <button
                    onClick={() => {
                      onAcceptOrder(order.orderId);
                      onClose();
                    }}
                    className="flex-1 md:flex-none bg-[#e4002b] hover:bg-[#c40025] text-white px-8 py-3 font-bold text-sm uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer animate-pulse"
                  >
                    <CheckCircle2 size={18} /> ACCEPT ORDER
                  </button>
                )}

                {/* ⚡ ปุ่ม RECEIVED (ล็อก) ของออเดอร์ Reservation ที่ส่งครัวแล้ว แต่รออาหารเสร็จ */}
                {order.type === "RESERVATION" &&
                  (currentStatus === "COOKING" ||
                    currentStatus === "RESERVED" ||
                    currentStatus === "CHECKED-IN" ||
                    currentStatus === "PREPARING") && (
                    <button
                      disabled
                      className="flex-1 md:flex-none bg-gray-50 text-gray-300 border border-gray-200 px-6 py-3 font-bold text-sm uppercase rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={18} /> RECEIVED (WAITING COOK)
                    </button>
                  )}

                {/* ⚡ ปุ่ม RECEIVED (ปลดล็อก) เมื่อสถานะขยับเป็น READY */}
                {orderKind === "RESERVATION" && currentStatus === "READY" && (
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
                {(orderKind !== "RESERVATION" ||
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
