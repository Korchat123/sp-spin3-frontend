import { getOrderTotal, getOrderNumber } from "./customerOrders";

const normalize = (value) => String(value || "").trim().toLowerCase();

export const CASHIER_ACTIVE_STATUSES = new Set([
  "pending",
  "preparing",
  "finished",
  "delivery",
  "delivered",
  "reserved",
  "checked-in",
  "checked_in",
  "received",
]);

export const CASHIER_HISTORY_STATUSES = new Set([
  "completed",
  "cancelled",
  "delivered",
  "picked up",
  "picked-up",
  "picked_up",
  "served",
  "received",
]);

export const getCashierOrderId = (order) => getOrderNumber(order);

export const getCashierOrderType = (order) => {
  const noteMode = normalize(String(order?.customer?.note || "").split("|")[0]);
  if (noteMode === "reserve") return "RESERVATION";
  if (noteMode === "pickup") return "PICK-UP";

  const type = normalize(order?.type);
  if (type === "delivery") return "DELIVERY";
  if (type === "pick-up" || type === "pickup") return "PICK-UP";
  if (type === "reservation" || type === "reserve") return "RESERVATION";
  return "DINE-IN";
};

export const getCashierBranch = (order) =>
  order?.customer?.note?.match(/Branch:\s*([^|]+)/i)?.[1]?.trim() || "";

export const getCashierTableLabel = (order) =>
  order?.tableId || order?.table || getCashierBranch(order) || null;

export const getCashierStatus = (status) => {
  const normalized = normalize(status);
  if (!normalized) return "PENDING";
  if (normalized === "preparing") return "COOKING";
  if (normalized === "delivery") return "ON THE WAY";
  if (normalized === "finished") return "READY";
  if (normalized === "delivered") return "DELIVERED";
  if (normalized === "checked_in") return "CHECKED-IN";
  if (normalized === "pick-up" || normalized === "pickup") return "PENDING";
  if (normalized === "dine-in" || normalized === "reservation") return "PENDING";
  return normalized.toUpperCase();
};

export const getCashierOrderTotal = (order) =>
  order?.payment?.amount || order?.totalAmount || getOrderTotal(order);

export const getCashierOrderItems = (order) =>
  (order?.orderList || order?.items || []).map((item) => ({
    id: item._id || item.id,
    name: item.name || "Menu item",
    qty: item.quantity || item.qty || 1,
    price: item.price ?? item.price_at_purchase ?? 0,
    note: item.note,
  }));

export const toCashierOrder = (order) => {
  const type = getCashierOrderType(order);
  const slipUrl = order?.evidenceImage || order?.payment?.slipUrl || "";
  const hasSlip =
    !!order?.slipAttached ||
    !!slipUrl;
  const status = type === "RESERVATION" && normalize(order?.status) === "pending"
    ? "RESERVED"
    : getCashierStatus(order?.status);

  // Parse pickupTime/bookingTime from the customer.note field (format: "pickup|2026-06-05 (11:00 - 11:30)")
  const noteRaw = String(order?.customer?.note || "");
  const noteParts = noteRaw.split("|");
  const serviceTimeStr = noteParts[1]?.trim() || "";

  return {
    raw: {
      ...order,
      slipAttached: hasSlip,
      slipUrl,
      address: order?.address || order?.customer?.address,
      // note_global is the "Note for Staff" field from the customer's order form
      noteForStaff: String(order?.note_global || "").trim(),
      pickupTime: order?.bookingTime || serviceTimeStr || "",
      customer: {
        ...order?.customer,
        name:
          order?.customer?.name ||
          order?.customer?.username ||
          "Walk-in Customer",
        phone: order?.customer?.phone || order?.customer?.contact,
      },
    },
    orderId: getCashierOrderId(order),
    backendId: order?._id || order?.orderId,
    status,
    type,
    table: getCashierTableLabel(order),
    isFromReservation: !!order?.isFromReservation,
    totalAmount: getCashierOrderTotal(order),
    items: getCashierOrderItems(order),
  };
};

export const getLocalDateValue = (date = new Date()) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().split("T")[0];
};
