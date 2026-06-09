import React from "react";
import { CheckCircle2, FileImage, UserCheck, CreditCard } from "lucide-react";

const OrderCard = ({
  order,
  onClick,
  onPrintBill,
  onMarkAsCompleted,
  onCheckIn,
  onAcceptOrder,
  onPayReservation,
  onReceiveReservation,
}) => {
  const currentStatus = order.status?.toUpperCase() || "PENDING";
  const hasSlip = !!order.raw?.slipAttached;
  const isDineIn = order.type === "DINE-IN";

  let isReadyToComplete = false;
  let completeButtonText = "COMPLETE";

  let showReservationAction = false;
  let reservationActionText = "";
  let reservationActionHandler = null;
  let isReservationActionDisabled = false;

  if (currentStatus === "PENDING") {
    showReservationAction = true;
    reservationActionText = "ACCEPT";
    reservationActionHandler = () => onAcceptOrder && onAcceptOrder(order.orderId);
  } else if (order.type === "DELIVERY") {
    completeButtonText = "DELIVERED";
    isReadyToComplete = currentStatus === "DELIVERED";
  } else if (order.type === "PICK-UP") {
    completeButtonText = "PICKED UP";
    isReadyToComplete = currentStatus === "READY";
  } else if (order.type === "DINE-IN") {
    completeButtonText = "SERVED";
    isReadyToComplete = currentStatus === "READY";
  } else if (order.type === "RESERVATION") {
    // 💡 ลำดับขั้นตอนปุ่มกดตามกติกาโฟลว์จองโต๊ะตัวใหม่
    if (currentStatus === "RESERVED") {
      showReservationAction = true;
      reservationActionText = "CHECK IN";
      reservationActionHandler = () => onCheckIn(order.orderId);
    } else if (currentStatus === "CHECKED-IN") {
      showReservationAction = true;
      // 💡 เช็คว่ามีการจ่ายเงินมัดจำ/แนบสลิปมาแล้วหรือยัง
      const isPaid =
        order.isPaid ||
        order.paymentStatus === "PAID" ||
        order.paymentMethod === "QR" ||
        hasSlip;
      reservationActionText = isPaid
        ? "SEND TO KITCHEN"
        : "PAY & SEND TO KITCHEN";
      reservationActionHandler = () => onPayReservation(order.orderId);
    } else if (currentStatus === "COOKING") {
      showReservationAction = true;
      reservationActionText = "RECEIVED";
      isReservationActionDisabled = true; // ล็อกปุ่มไว้เพื่อรออาหารเสร็จ
    } else if (currentStatus === "READY") {
      showReservationAction = true;
      reservationActionText = "RECEIVED";
      reservationActionHandler = () => onReceiveReservation(order.orderId); // ปลดล็อกให้กดรับเมื่ออาหารเสร็จ
    } else if (currentStatus === "RECEIVED") {
      completeButtonText = "CLEAR TABLE";
      isReadyToComplete = true; // ได้รับอาหารแล้วพร้อมเคลียร์โต๊ะลงประวัติ
    }
  }

  const getContextInfo = () => {
    const labelStyle = "font-bold text-[#242424] w-14 shrink-0 text-[0.75rem]";
    const valueStyle = "text-gray-600 text-[0.75rem] leading-tight";

    if (order.type === "DELIVERY") {
      return (
        <ul className="flex flex-col gap-1.5">
          <li className="flex items-start gap-1">
            <span className={labelStyle}>Name:</span>
            <span className={`${valueStyle} truncate`}>
              {order.raw?.customer?.name || "-"}
            </span>
          </li>
          <li className="flex items-start gap-1">
            <span className={labelStyle}>Contact:</span>
            <span className={`${valueStyle} truncate`}>
              {order.raw?.customer?.phone || "-"}
            </span>
          </li>
          <li className="flex items-start gap-1">
            <span className={labelStyle}>Address:</span>
            <span className={`${valueStyle} line-clamp-2`}>
              {order.raw?.address || "-"}
            </span>
          </li>
        </ul>
      );
    }

    if (order.type === "RESERVATION") {
      return (
        <ul className="flex flex-col gap-1.5">
          <li className="flex items-start gap-1">
            <span className={labelStyle}>Name:</span>
            <span className={`${valueStyle} truncate`}>
              {order.raw?.customer?.name || "-"}
            </span>
          </li>
          <li className="flex items-start gap-1">
            <span className={labelStyle}>Time:</span>
            <span className={valueStyle}>{order.raw?.time || "-"}</span>
          </li>
          <li className="flex items-start gap-1">
            <span className={labelStyle}>Pax:</span>
            <span className={valueStyle}>{order.raw?.pax || "-"} Persons</span>
          </li>
        </ul>
      );
    }

    if (order.type === "PICK-UP") {
      return (
        <ul className="flex flex-col gap-1.5">
          <li className="flex items-start gap-1">
            <span className={labelStyle}>Name:</span>
            <span className={`${valueStyle} truncate`}>
              {order.raw?.customer?.name || "-"}
            </span>
          </li>
          <li className="flex items-start gap-1">
            <span className={labelStyle}>Pickup:</span>
            <span className={valueStyle}>
              {order.raw?.pickupTime || "ASAP"}
            </span>
          </li>
        </ul>
      );
    }

    return (
      <div className="flex items-center gap-1">
        <span className={labelStyle}>Table:</span>
        <span className={valueStyle}>
          {order.table || "Walk-in"}
          {order.isFromReservation && (
            <span className="text-[#e4002b] font-bold ml-1.5">(Reserved)</span>
          )}
        </span>
      </div>
    );
  };

  return (
    <div
      onClick={() => onClick && onClick(order)}
      className="bg-white border-2 border-gray-200 rounded-xl p-4 flex flex-col gap-3 cursor-pointer transition-all hover:border-[#242424] hover:shadow-[4px_4px_0_#242424] group h-full relative"
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[0.6rem] font-black text-gray-400 uppercase tracking-[0.15em] mb-1 block">
            Order No.
          </span>
          <h3 className="font-['Bebas_Neue'] text-3xl leading-none text-[#242424] mb-1">
            {order.orderId}
          </h3>
          <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest">
            {order.isFromReservation ? "DINE-IN (RESERVED)" : order.type}
          </p>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="font-['Bebas_Neue'] text-2xl text-[#242424]">
            ฿{order.totalAmount?.toLocaleString()}
          </span>
          {hasSlip && (
            <span className="mt-1 flex items-center gap-1 text-[0.6rem] font-bold text-[#0284c7] bg-[#e0f2fe] px-1.5 py-0.5 rounded border border-[#bae6fd]">
              <FileImage size={10} /> PAID (SLIP)
            </span>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex-1">
        <div className="text-sm flex items-center gap-2 mb-2.5 border-b border-gray-200 pb-2">
          <span className="font-bold text-[#242424]">Status:</span>
          <span className="text-[#e4002b] font-black uppercase tracking-wider">
            {currentStatus}
          </span>
        </div>
        {getContextInfo()}
      </div>

      <div className="flex flex-col gap-2 mt-auto pt-1">
        <div className="flex items-center justify-end gap-2">
          {!hasSlip && isDineIn && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrintBill(order.backendId || order.orderId);
              }}
              className="flex items-center gap-1.5 text-[#242424] border-2 border-[#242424] bg-white text-xs font-bold uppercase px-4 py-2 rounded-lg hover:bg-[#242424] hover:text-white transition-colors cursor-pointer"
            >
              CHECKOUT
            </button>
          )}
        </div>

        {/* ⚡ ปุ่มกดสำหรับ Reservation */}
        {showReservationAction ? (
          <button
            disabled={isReservationActionDisabled}
            onClick={(e) => {
              e.stopPropagation();
              reservationActionHandler && reservationActionHandler();
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase transition-all shadow-sm w-full
              ${
                isReservationActionDisabled
                  ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
                  : "bg-[#242424] hover:bg-[#333] text-white active:scale-95 cursor-pointer"
              }
            `}
          >
            {reservationActionText === "CHECK IN" ? (
              <UserCheck size={14} />
            ) : reservationActionText === "PAY & SEND TO KITCHEN" ||
              reservationActionText === "SEND TO KITCHEN" ? (
              <CreditCard size={14} />
            ) : (
              <CheckCircle2 size={14} />
            )}
            {reservationActionText}
          </button>
        ) : (
          <button
            disabled={!isReadyToComplete}
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsCompleted(order.orderId);
            }}
            className={`flex items-center justify-center gap-2 text-xs font-black uppercase py-2.5 rounded-lg transition-all w-full border-2
              ${
                isReadyToComplete
                  ? "bg-[#28a745] text-white border-[#28a745] hover:bg-[#218838] shadow-sm cursor-pointer"
                  : "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
              }
            `}
          >
            <CheckCircle2 size={16} /> {completeButtonText} (TO HISTORY)
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
