const PAST_STATUSES = ["completed", "delivered", "picked_up", "cancelled", "finished"];

const normalize = (value) => String(value || "").trim().toLowerCase();
const CANCELLED_ITEM_STATUSES = new Set(["cancel", "cancelled"]);

export const isCancelledOrderItem = (item) =>
  CANCELLED_ITEM_STATUSES.has(normalize(item?.status));

export const isPastOrderStatus = (status, deliveredAt) => {
  const normalized = normalize(status) || "pending";
  if (normalized === "delivered" && deliveredAt) {
    const elapsed = Date.now() - new Date(deliveredAt).getTime();
    if (elapsed < 30000) {
      return false; // Not past yet (still ongoing)
    }
  }
  return PAST_STATUSES.includes(normalized);
};

export const isOrderForUser = (order, user) => {
  if (!user) return false;

  const customer = order?.customer || {};
  const userId = normalize(user.id || user._id);
  const customerUserId = normalize(customer.userId || order.userId || order.customerId);
  if (userId && customerUserId && userId === customerUserId) return true;

  const userEmail = normalize(user.email);
  const customerEmail = normalize(customer.email);
  if (userEmail && customerEmail && userEmail === customerEmail) return true;

  const userName = normalize(user.name || user.username);
  const customerName = normalize(customer.name);
  return Boolean(userName && customerName && userName === customerName);
};

export const filterOrdersForUser = (orders, user) =>
  (Array.isArray(orders) ? orders : []).filter((order) => isOrderForUser(order, user));

export const getOrderItems = (order) => order?.orderList || order?.List || [];

export const getActiveOrderItems = (order) =>
  getOrderItems(order).filter((item) => !isCancelledOrderItem(item));

export const getCancelledOrderItems = (order) =>
  getOrderItems(order).filter(isCancelledOrderItem);

const getItemLineTotal = (item) =>
  (item.price ?? item.price_at_purchase ?? 0) * (item.quantity || item.qty || 1);

export const getOrderTotal = (order) => {
  if (typeof order?.totalPrice === "number") return order.totalPrice;
  if (typeof order?.payment?.amount === "number") return order.payment.amount;
  return getActiveOrderItems(order).reduce((sum, item) => sum + getItemLineTotal(item), 0);
};

export const getCancelledRefundAmount = (order) => {
  const cancelledSubtotal = getCancelledOrderItems(order).reduce(
    (sum, item) => sum + getItemLineTotal(item),
    0,
  );

  return Math.round(cancelledSubtotal * 1.07 * 100) / 100;
};

export const getCustomerOrderMode = (order) => {
  const type = normalize(order?.type);
  if (type === "delivery") return "delivery";

  const noteMode = normalize(String(order?.customer?.note || "").split("|")[0]);
  if (noteMode === "reserve") return "reserve";
  if (noteMode === "pickup") return "pickup";

  return "pickup";
};

export const getCustomerOrderServiceText = (order) => {
  const note = String(order?.customer?.note || "");
  const [, detail] = note.split("|");
  if (detail) return detail;
  if (order?.bookingDate || order?.bookingTime) {
    return [order.bookingDate, order.bookingTime].filter(Boolean).join(" ");
  }
  return "As soon as possible";
};

export const getOrderNumber = (order) => {
  if (order?.orderId) {
    return String(order.orderId).startsWith("#")
      ? order.orderId
      : `#${order.orderId}`;
  }
  const id = order?.orderId || order?.orderId;
  return id ? `#${String(id).toUpperCase()}` : "N/A";
};

export const getOrderSummaryText = (order) => {
  const items = getActiveOrderItems(order);
  if (items.length === 0) return "No items";
  return items.map((item) => `${item.name || "Menu item"} (x${item.quantity || item.qty || 1})`).join(", ");
};

export const getTrackerStatus = (status) => {
  const normalized = normalize(status);
  if (normalized === "preparing" || normalized === "inkitchen" || normalized === "cook") return "cooking";
  if (normalized === "delivery" || normalized === "shipping") return "on_the_way";
  if (normalized === "completed" || normalized === "finished") return "ready";
  if (normalized === "delivered") return "delivered";
  if (normalized === "cancelled" || normalized === "cancel") return "cancelled";
  return normalized || "pending";
};
