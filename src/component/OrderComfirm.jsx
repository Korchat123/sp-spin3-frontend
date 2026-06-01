const ORDER_TYPE = {
  DELIVERY: "delivery",
  PICKUP: "pickup",
};

const PAST_STATUSES = ["completed", "delivered", "picked_up", "cancelled"];

const TYPE_CONFIG = {
  [ORDER_TYPE.DELIVERY]: {
    title: "Delivery Confirmation",
    receiptTitle: "Delivery Receipt",
    typeLabel: "Delivery",
    timeLabel: "Estimated Delivery Time",
    locationLabel: "Delivery Address",
    emptyLocation: "No delivery address",
    notice: "Your rider is on the way. Please keep your phone available.",
  },
  [ORDER_TYPE.PICKUP]: {
    title: "Pick-up Confirmation",
    receiptTitle: "Pick-up Receipt",
    typeLabel: "Pick-up",
    timeLabel: "Pick-up Time",
    locationLabel: "Pick-up Branch",
    emptyLocation: "SFC Asok (HQ)",
    notice: "Please pick up your order within 30 minutes of the selected time.",
  },
};

const normalizeOrderType = (type) => {
  const normalizedType = String(type || "").trim().toLowerCase();

  if (normalizedType === ORDER_TYPE.DELIVERY) {
    return ORDER_TYPE.DELIVERY;
  }

  return ORDER_TYPE.PICKUP;
};

const isPastOrder = (status) =>
  PAST_STATUSES.includes(String(status || "").toLowerCase());

const formatOrderNo = (order, orderNo) => {
  if (orderNo) return orderNo;

  const id = order?._id || order?.id;
  if (!id) return "N/A";

  return `#${String(id).slice(-6).toUpperCase()}`;
};

const formatMoney = (value) => {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return value || "0.00";
  }

  return numberValue.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getItemPrice = (item) => item.price ?? item.price_at_purchase ?? 0;

const getTotalPrice = (order, totalPrice) => {
  if (totalPrice !== undefined && totalPrice !== null && totalPrice !== "") {
    return totalPrice;
  }

  if (order?.totalPrice !== undefined && order?.totalPrice !== null) {
    return order.totalPrice;
  }

  return (order?.orderList || []).reduce(
    (sum, item) => sum + getItemPrice(item) * (item.quantity || 1),
    0,
  );
};

const getMenuList = (order, menuList) => {
  if (menuList.length > 0) return menuList;

  return (order?.orderList || []).map((item) => ({
    name: item.name || "Menu item",
    quantity: item.quantity || 1,
  }));
};

const getMenuText = (item) => {
  if (typeof item === "string") return item;

  const quantity = item.quantity || item.qty || 1;
  return `${item.name || "Menu item"} x${quantity}`;
};

const getLocationText = ({ order, orderType, address }) => {
  if (address) return address;

  if (orderType === ORDER_TYPE.DELIVERY) {
    return order?.customer?.address || TYPE_CONFIG[orderType].emptyLocation;
  }

  return order?.branch || order?.customer?.address || TYPE_CONFIG[orderType].emptyLocation;
};

const DetailRow = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[#888888] text-sm uppercase font-bold">
      - {label} :
    </span>
    <div className="pl-4 text-white">{children}</div>
  </div>
);

const MenuItems = ({ items }) => {
  if (items.length === 0) {
    return <span className="text-sm">No items</span>;
  }

  return (
    <ul className="list-disc list-inside text-sm">
      {items.map((item, index) => (
        <li key={`${getMenuText(item)}-${index}`}>{getMenuText(item)}</li>
      ))}
    </ul>
  );
};

const OrderComfirm = ({
  isOpen,
  onClose,
  order,
  orderType,
  status = "pending",
  orderNo = "",
  menuList = [],
  totalPrice,
  deliveryTime = "",
  address = "",
  comment = "",
  contact = "",
}) => {
  if (!isOpen) return null;

  const confirmedOrderType = normalizeOrderType(orderType || order?.type);
  const config = TYPE_CONFIG[confirmedOrderType];
  const currentStatus = order?.status || status;
  const isReceipt = isPastOrder(currentStatus);
  const items = getMenuList(order, menuList);
  const price = getTotalPrice(order, totalPrice);
  const note = comment || order?.customer?.note || "";
  const customerContact = contact || order?.customer?.contact || "";
  const locationText = getLocationText({
    order,
    orderType: confirmedOrderType,
    address,
  });

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-1000 px-4"
      onClick={onClose}
    >
      <div
        className={`bg-[#242424] w-full max-w-md p-8 md:p-10 rounded-lg text-white border-t-10 ${
          isReceipt ? "border-[#444444]" : "border-[#e4002b]"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="font-['Bebas_Neue'] text-4xl mb-6 text-center uppercase tracking-wider">
          {isReceipt ? config.receiptTitle : config.title}
        </h2>

        <div className="space-y-4 mb-8">
          <DetailRow label="Order no">
            <span className="font-mono">{formatOrderNo(order, orderNo)}</span>
          </DetailRow>

          <DetailRow label="Order type">
            <span className="font-bold">{config.typeLabel}</span>
          </DetailRow>

          <DetailRow label="Order status">
            <span
              className={`font-bold uppercase ${
                String(currentStatus).toLowerCase() === "cancelled"
                  ? "text-red-500"
                  : "text-green-400"
              }`}
            >
              {currentStatus || "pending"}
            </span>
          </DetailRow>

          <DetailRow label="List Menu">
            <MenuItems items={items} />
          </DetailRow>

          <DetailRow label="Total Price">
            <span className="text-lg font-bold">฿{formatMoney(price)}</span>
          </DetailRow>

          <DetailRow label={config.timeLabel}>
            {deliveryTime || order?.bookingTime || "ASAP"}
          </DetailRow>

          <DetailRow label={config.locationLabel}>
            <span className="text-sm">{locationText}</span>
          </DetailRow>

          {customerContact && (
            <DetailRow label="Contact">
              <span className="text-sm">{customerContact}</span>
            </DetailRow>
          )}

          {note && (
            <DetailRow label="Comment">
              <p className="text-sm italic">{note}</p>
            </DetailRow>
          )}
        </div>

        {!isReceipt && (
          <p className="text-[#e4002b] text-[15px] text-center mb-6 leading-relaxed">
            {config.notice}
          </p>
        )}

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-10 py-3 border-2 border-[#555] text-[#888] font-bold text-sm uppercase rounded hover:bg-[#333] hover:text-white transition-colors cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderComfirm;
