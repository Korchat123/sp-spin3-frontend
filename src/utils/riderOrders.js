export const ACTIVE_DELIVERY_STATUSES = new Set([
  "delivery",
  "shipping",
]);

export const HISTORY_DELIVERY_STATUSES = new Set(["delivered", "cancelled"]);

export const getOrderId = (order) => order?._id || order?.id || order?.orderId || "";
export const getDisplayOrderId = (order) => order?.orderId || order?.id || order?._id || "";

const CANCELLED_ITEM_STATUSES = new Set(["cancel", "cancelled"]);

export const isCancelledOrderItem = (item) =>
  CANCELLED_ITEM_STATUSES.has(String(item?.status || "").toLowerCase());

export const getOrderNo = (order) => {
  const id = getDisplayOrderId(order);
  return id ? String(id).toUpperCase() : "N/A";
};

export const getOrderItems = (order) =>
  Array.isArray(order?.orderList) ? order.orderList.filter((item) => !isCancelledOrderItem(item)) : [];

export const isDeliveryOrder = (order) =>
  String(order?.type || "").toLowerCase() === "delivery";

export const isActiveDeliveryOrder = (order) =>
  isDeliveryOrder(order) && ACTIVE_DELIVERY_STATUSES.has(order?.status);

export const isHistoryDeliveryOrder = (order) =>
  isDeliveryOrder(order) && HISTORY_DELIVERY_STATUSES.has(order?.status);

export const isReadyForPickup = (order) => order?.status === "delivery";

export const getOrderCreatedAt = (order) => {
  const value = order?.createdAt || order?.orderList?.[0]?.orderTime;
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
};

export const getCustomerName = (order) =>
  order?.customer?.name ||
  order?.customer?.username ||
  order?.customer?.contact ||
  `Order ${getOrderNo(order)}`;

export const getOrderTotal = (order) =>
  getOrderItems(order).reduce((sum, item) => {
    const price = Number(item.price ?? item.price_at_purchase ?? 0);
    const quantity = Math.max(1, Number(item.quantity ?? item.qty ?? 1));
    return sum + price * quantity;
  }, 0);

export const sortOrdersNewestFirst = (orders) =>
  [...orders].sort((a, b) => {
    const aTime = getOrderCreatedAt(a)?.getTime() || 0;
    const bTime = getOrderCreatedAt(b)?.getTime() || 0;
    return bTime - aTime;
  });

export const sortOrdersOldestFirst = (orders) =>
  [...orders].sort((a, b) => {
    const aTime = getOrderCreatedAt(a)?.getTime() || 0;
    const bTime = getOrderCreatedAt(b)?.getTime() || 0;
    return aTime - bTime;
  });
