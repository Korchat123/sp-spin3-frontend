const PAST_STATUSES = ["completed", "delivered", "picked_up", "cancelled", "finished"];

const normalize = (value) => String(value || "").trim().toLowerCase();

export const isPastOrderStatus = (status) =>
  PAST_STATUSES.includes(normalize(status) || "pending");

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

export const getOrderTotal = (order) => {
  if (typeof order?.totalPrice === "number") return order.totalPrice;
  return getOrderItems(order).reduce(
    (sum, item) =>
      sum + (item.price ?? item.price_at_purchase ?? 0) * (item.quantity || item.qty || 1),
    0,
  );
};

export const getOrderNumber = (order) => {
  const id = order?._id || order?.id;
  return id ? `#${String(id).slice(-6).toUpperCase()}` : "N/A";
};

export const getOrderSummaryText = (order) => {
  const items = getOrderItems(order);
  if (items.length === 0) return "No items";
  return items.map((item) => `${item.name || "Menu item"} (x${item.quantity || item.qty || 1})`).join(", ");
};

export const getTrackerStatus = (status) => {
  const normalized = normalize(status);
  if (normalized === "preparing" || normalized === "inkitchen" || normalized === "cook") return "cooking";
  if (normalized === "delivery") return "on_the_way";
  if (normalized === "completed" || normalized === "finished") return "ready";
  if (normalized === "delivered") return "delivered";
  if (normalized === "cancelled" || normalized === "cancel") return "cancelled";
  return normalized || "pending";
};
