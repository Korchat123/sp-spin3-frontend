import { useState, useMemo } from 'react'
import { Search, Plus, Filter, Save, Trash2, X, User, Phone, MapPin, Calendar, Package } from 'lucide-react'
import { useStoreData } from '../context/StoreDataContext'
import OrderRow from '../components/orders/OrderRow'
import DeliveryPanel from '../components/orders/DeliveryPanel'
import { formatOrderId } from '../utils/format'

const ITEM_STATUSES = ['InKitchen', 'Cook', 'finished', 'cancel', 'pending', 'preparing', 'completed', 'cancelled'];
const ORDER_TYPES = ['In-Restaurant', 'Delivery'];
const getOrderStatuses = (type) => [
  'New',
  'Cooking',
  'Ready',
  ...(type === 'Delivery' ? ['Delivery', 'Delivered'] : []),
  'Finished',
  'Cancelled',
];

// eslint-disable-next-line no-unused-vars
function OrderItemsModal({ order, onClose, onSave, onDelete }) {
  const [type, setType] = useState(order.type === 'Delivery' ? 'Delivery' : 'In-Restaurant');
  const [status, setStatus] = useState(order.status);
  const [items, setItems] = useState(() =>
    order.items.map(item => ({
      id: item.id,
      name: item.name || '',
      quantity: item.quantity || 1,
      price: item.price || 0,
      status: item.status || 'InKitchen',
    }))
  );
  const [isSaving, setIsSaving] = useState(false);
  const orderStatuses = getOrderStatuses(type);
  const safeStatus = orderStatuses.includes(status) ? status : type === 'Delivery' ? 'Delivery' : 'Finished';

  const updateItem = (index, updates) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, ...updates } : item));
  };

  const addItem = () => {
    setItems(prev => [...prev, { name: '', quantity: 1, price: 0, status: 'InKitchen' }]);
  };

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const adjustQuantity = (index, delta) => {
    setItems(prev => prev.map((item, i) => {
      if (i !== index) return item;
      return { ...item, quantity: Math.max(1, Number(item.quantity || 1) + delta) };
    }));
  };

  const total = items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0), 0);

  const handleSave = async () => {
    const cleanedItems = items
      .map(item => ({
        id: item.id,
        name: item.name.trim(),
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
        status: item.status || 'InKitchen',
      }))
      .filter(item => item.name);

    if (cleanedItems.length === 0) {
      window.alert('Order must have at least one item.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(order, { type, status: safeStatus, items: cleanedItems, total });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1A2333]/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-brand-border-inner flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-[16px] font-bold text-brand-text-primary">Manage Order {formatOrderId(order)}</h2>
            <p className="text-[11px] text-brand-text-secondary">Add, edit, or remove items from this order</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-sidebar rounded-lg text-brand-text-secondary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-brand-text-tertiary uppercase tracking-widest">Order Type</label>
              <select
                value={type}
                onChange={(e) => {
                  const nextType = e.target.value;
                  setType(nextType);
                  if (!getOrderStatuses(nextType).includes(status)) {
                    setStatus(nextType === 'Delivery' ? 'Delivery' : 'Finished');
                  }
                }}
                className="w-full bg-brand-page border border-transparent focus:border-brand-border-active focus:bg-white rounded-lg px-3 py-2 text-[13px] outline-none transition-all cursor-pointer"
              >
                {ORDER_TYPES.map(orderType => (
                  <option key={orderType} value={orderType}>{orderType}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-brand-text-tertiary uppercase tracking-widest">Order Status</label>
              <select
                value={safeStatus}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-brand-page border border-transparent focus:border-brand-border-active focus:bg-white rounded-lg px-3 py-2 text-[13px] outline-none transition-all cursor-pointer"
              >
                {orderStatuses.map(orderStatus => (
                  <option key={orderStatus} value={orderStatus}>{orderStatus}</option>
                ))}
              </select>
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-bold text-brand-text-tertiary uppercase tracking-widest border-b border-brand-border-inner">
                <th className="pb-3 pr-4">Item</th>
                <th className="pb-3 px-4 w-24">Qty</th>
                <th className="pb-3 px-4 w-32">Price</th>
                <th className="pb-3 px-4 w-40">Status</th>
                <th className="pb-3 pl-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id || index} className="border-b border-brand-border-inner last:border-0">
                  <td className="py-3 pr-4">
                    <input
                      value={item.name}
                      onChange={(e) => updateItem(index, { name: e.target.value })}
                      placeholder="Menu item"
                      className="w-full bg-brand-page border border-transparent focus:border-brand-border-active focus:bg-white rounded-lg px-3 py-2 text-[13px] outline-none transition-all"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, { quantity: e.target.value })}
                      className="w-full bg-brand-page border border-transparent focus:border-brand-border-active focus:bg-white rounded-lg px-3 py-2 text-[13px] outline-none transition-all"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min="0"
                      value={item.price}
                      onChange={(e) => updateItem(index, { price: e.target.value })}
                      className="w-full bg-brand-page border border-transparent focus:border-brand-border-active focus:bg-white rounded-lg px-3 py-2 text-[13px] outline-none transition-all"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={item.status}
                      onChange={(e) => updateItem(index, { status: e.target.value })}
                      className="w-full bg-brand-page border border-transparent focus:border-brand-border-active focus:bg-white rounded-lg px-2 py-2 text-[13px] outline-none transition-all cursor-pointer"
                    >
                      {ITEM_STATUSES.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pl-4">
                    <button
                      onClick={() => removeItem(index)}
                      className="p-2 text-brand-text-tertiary hover:text-brand-danger transition-colors rounded-lg hover:bg-brand-danger-bg"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={addItem}
            className="mt-4 flex items-center gap-2 text-[13px] font-bold text-brand-text-dark-neutral hover:text-brand-text-primary transition-colors px-2 py-1 rounded-lg hover:bg-brand-sidebar"
          >
            <Plus size={16} /> Add item
          </button>
        </div>

        <div className="px-6 py-5 border-t border-brand-border-inner bg-brand-subheader flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-tertiary uppercase tracking-widest font-bold">Order Total</span>
            <span className="text-[18px] font-bold text-brand-text-primary">฿{total.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-3">
          <button
            onClick={() => onDelete(order)}
            className="px-5 py-2.5 rounded-xl border border-brand-danger bg-white text-brand-danger text-[14px] font-bold shadow-sm transition-all hover:bg-[#ff4d6d] hover:text-white hover:shadow-md"
          >
            Delete Order
          </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-brand-border-outer bg-white text-brand-text-secondary text-[14px] font-bold hover:bg-brand-hover-row transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-brand-text-dark text-white text-[14px] font-bold shadow-lg hover:bg-brand-text-dark/90 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderDetailModal({ order, onClose, onSave, onDelete }) {
  const [type, setType] = useState(order.type === 'Delivery' ? 'Delivery' : 'In-Restaurant');
  const [status, setStatus] = useState(order.status);
  const [customer, setCustomer] = useState({
    name: order.customer?.name || '',
    contact: order.customer?.contact || '',
    address: order.customer?.address || '',
    note: order.customer?.note || '',
  });
  const [items, setItems] = useState(() =>
    order.items.map(item => ({
      id: item.id,
      name: item.name || '',
      quantity: item.quantity || 1,
      price: item.price || 0,
      status: item.status || 'InKitchen',
      ingredients: item.ingredients || [],
      menu: item.menu,
    }))
  );
  const [isSaving, setIsSaving] = useState(false);
  const orderStatuses = getOrderStatuses(type);
  const safeStatus = orderStatuses.includes(status) ? status : type === 'Delivery' ? 'Delivery' : 'Finished';
  const total = items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0), 0);

  const updateItem = (index, updates) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, ...updates } : item));
  };

  const addItem = () => {
    setItems(prev => [...prev, { name: '', quantity: 1, price: 0, status: 'InKitchen', ingredients: [] }]);
  };

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const cleanedItems = items
      .map(item => ({
        ...item,
        name: item.name.trim(),
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
      }))
      .filter(item => item.name);

    if (!customer.name.trim()) {
      window.alert('Customer name is required.');
      return;
    }
    if (cleanedItems.length === 0) {
      window.alert('Order must have at least one item.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(order, {
        type,
        status: safeStatus,
        customer,
        items: cleanedItems,
        total,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1A2333]/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-[1280px] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-2rem)]">
        <div className="px-6 py-4 border-b border-brand-border-inner flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-[16px] font-bold text-brand-text-primary">Order {formatOrderId(order)}</h2>
            <p className="text-[11px] text-brand-text-secondary">{order.type} • {order.status}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-sidebar rounded-lg text-brand-text-secondary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-5 flex flex-col gap-4" style={{ scrollbarGutter: 'stable' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-brand-text-tertiary uppercase tracking-widest">Order Type</label>
              <select
                value={type}
                onChange={(e) => {
                  const nextType = e.target.value;
                  setType(nextType);
                  if (!getOrderStatuses(nextType).includes(status)) {
                    setStatus(nextType === 'Delivery' ? 'Delivery' : 'Finished');
                  }
                }}
                className="w-full bg-brand-page border border-transparent focus:border-brand-border-active focus:bg-white rounded-lg px-3 py-2 text-[13px] outline-none transition-all cursor-pointer"
              >
                {ORDER_TYPES.map(orderType => (
                  <option key={orderType} value={orderType}>{orderType}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-brand-text-tertiary uppercase tracking-widest">Order Status</label>
              <select
                value={safeStatus}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-brand-page border border-transparent focus:border-brand-border-active focus:bg-white rounded-lg px-3 py-2 text-[13px] outline-none transition-all cursor-pointer"
              >
                {orderStatuses.map(orderStatus => (
                  <option key={orderStatus} value={orderStatus}>{orderStatus}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white border border-brand-border-outer rounded-2xl flex flex-col order-1 flex-[0_0_50%] min-h-[320px]">
            <div className="px-4 py-3 border-b border-brand-border-inner  bg-brand-subheader flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-brand-text-primary">What Customer Bought ({items.length})</span>
                <span className="text-[11px] text-brand-text-secondary">Full menu list for this order. Scroll this list to see every item, ingredient, source lot, and line total.</span>
              </div>
              <button
                onClick={addItem}
                className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border border-[#1A2333] bg-white text-[#1A2333] text-[12px] font-bold hover:bg-[#1A2333] hover:text-white transition-colors"
              >
                <Plus size={15} /> Add Item
              </button>
            </div>
            <div className="flex-1 min-h-0 max-h-[190px] overflow-y-scroll overflow-x-auto" style={{ scrollbarGutter: 'stable' }}>
              <table className="w-full min-w-[980px] text-left">
              <thead>
                <tr className="bg-brand-subheader border-b border-brand-border-inner">
                  <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider min-w-[250px] whitespace-nowrap">Menu / Item Status</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider min-w-[150px] whitespace-nowrap">Quantity</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider min-w-[130px] whitespace-nowrap">Unit Price</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider min-w-[310px] whitespace-nowrap">Ingredients / Source Lot</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider text-right min-w-[140px] whitespace-nowrap">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id || index} className="border-b border-brand-border-inner last:border-0 align-top">
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <input
                          value={item.name}
                          onChange={(e) => updateItem(index, { name: e.target.value })}
                          placeholder="Menu item"
                          className="w-full bg-white border border-brand-border-outer focus:border-brand-border-active rounded-lg px-3 py-2 text-[13px] font-bold text-brand-text-primary outline-none"
                        />
                        <select
                          value={item.status}
                          onChange={(e) => updateItem(index, { status: e.target.value })}
                          className="w-full bg-white border border-brand-border-outer focus:border-brand-border-active rounded-lg px-2 py-1.5 text-[11px] text-brand-text-secondary outline-none cursor-pointer"
                        >
                          {ITEM_STATUSES.map(itemStatus => (
                            <option key={itemStatus} value={itemStatus}>{itemStatus}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => adjustQuantity(index, -1)}
                            className="w-8 h-8 rounded-lg border border-brand-border-outer bg-white text-brand-text-primary font-bold hover:bg-[#1A2333] hover:text-white transition-colors cursor-pointer"
                            title="Decrease quantity"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, { quantity: e.target.value })}
                            className="w-16 bg-white border border-brand-border-outer focus:border-brand-border-active rounded-lg px-3 py-2 text-[13px] outline-none text-center font-bold"
                          />
                          <button
                            onClick={() => adjustQuantity(index, 1)}
                            className="w-8 h-8 rounded-lg border border-brand-border-outer bg-white text-brand-text-primary font-bold hover:bg-[#1A2333] hover:text-white transition-colors cursor-pointer"
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                    </td>
                    <td className="py-4 px-4">
                      <input
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={(e) => updateItem(index, { price: e.target.value })}
                        className="w-28 bg-white border border-brand-border-outer focus:border-brand-border-active rounded-lg px-3 py-2 text-[13px] outline-none text-right font-medium"
                      />
                    </td>
                    <td className="py-4 px-4">
                      {item.ingredients.length > 0 ? (
                        <div className="max-h-40 overflow-y-auto pr-2 flex flex-col gap-2" style={{ scrollbarGutter: 'stable' }}>
                          {item.ingredients.map(ingredient => (
                            <div key={ingredient.id || ingredient.name} className="rounded-lg border border-brand-border-inner bg-brand-page px-3 py-2 text-[12px]">
                              <div className="flex items-start justify-between gap-3">
                                <span className="text-brand-text-primary font-medium leading-tight">{ingredient.name}</span>
                                <span className="text-brand-text-secondary text-right leading-tight">
                                  {Number(ingredient.quantityPerItem || 0) * Number(item.quantity || 0)} {ingredient.unit} required
                                </span>
                              </div>
                              <div className="mt-1 flex items-center justify-between gap-3 text-[10px] uppercase tracking-wider text-brand-text-tertiary">
                                <span>Stock: {ingredient.availableQuantity} {ingredient.unit}</span>
                                <span>Lot: {ingredient.lotId || 'N/A'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="max-h-40 overflow-y-auto pr-2" style={{ scrollbarGutter: 'stable' }}>
                          <span className="text-[12px] text-brand-text-tertiary">No menu ingredient link found</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right text-[13px] font-bold text-brand-text-primary">
                      <div className="flex flex-col items-end gap-2">
                        <span>฿{Number(item.price * item.quantity || 0).toLocaleString()}</span>
                        <button
                          onClick={() => removeItem(index)}
                          className="p-2 border border-brand-danger bg-white text-brand-danger hover:bg-brand-danger hover:text-white transition-colors rounded-lg"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>

          <div className={`grid grid-cols-1 gap-4 order-2 ${type === 'Delivery' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
            <div className="bg-brand-page border border-brand-border-inner rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[12px] font-bold text-brand-text-tertiary uppercase tracking-widest">
                <User size={14} /> Customer
              </div>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest">Customer Name</span>
                <input
                  value={customer.name}
                  onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Customer name"
                  className="w-full bg-white border border-brand-border-outer focus:border-brand-border-active rounded-lg px-3 py-2 text-[13px] outline-none"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest">
                  <Phone size={12} /> Contact
                </span>
                <input
                  value={customer.contact}
                  onChange={(e) => setCustomer(prev => ({ ...prev, contact: e.target.value }))}
                  placeholder="Contact"
                  className="w-full bg-white border border-brand-border-outer focus:border-brand-border-active rounded-lg px-3 py-2 text-[12px] outline-none"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest">
                  <MapPin size={12} /> Address
                </span>
                <textarea
                  value={customer.address}
                  onChange={(e) => setCustomer(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Address"
                  rows={2}
                  className="w-full bg-white border border-brand-border-outer focus:border-brand-border-active rounded-lg px-3 py-2 text-[12px] outline-none resize-none"
                />
              </label>
            </div>

            {type === 'Delivery' && (
              <DeliveryPanel 
                order={order} 
                onUpdate={async () => setDetailOrder(await getOrderDetail(order.id))} 
              />
            )}

            <div className="bg-brand-page border border-brand-border-inner rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[12px] font-bold text-brand-text-tertiary uppercase tracking-widest">
                <Calendar size={14} /> Timing
              </div>
              <div className="grid grid-cols-1 gap-2 text-[12px]">
                <div className="bg-white border border-brand-border-outer rounded-lg px-3 py-2">
                  <div className="text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest">Created</div>
                  <div className="text-brand-text-primary">{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div className="bg-white border border-brand-border-outer rounded-lg px-3 py-2">
                  <div className="text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest">Booking</div>
                  <div className="text-brand-text-primary">{order.bookingDate || 'N/A'} {order.bookingTime || ''}</div>
                </div>
              </div>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest">Customer Note</span>
                <textarea
                  value={customer.note}
                  onChange={(e) => setCustomer(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Customer note"
                  rows={2}
                  className="w-full bg-white border border-brand-border-outer focus:border-brand-border-active rounded-lg px-3 py-2 text-[12px] outline-none resize-none"
                />
              </label>
            </div>

            <div className="bg-brand-page border border-brand-border-inner rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[12px] font-bold text-brand-text-tertiary uppercase tracking-widest">
                <Package size={14} /> Payment
              </div>
              <div className="bg-white border border-brand-border-outer rounded-lg px-3 py-2">
                <div className="text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest">Order Total</div>
                <div className="text-[18px] font-bold text-brand-text-primary">฿{Number(total || 0).toLocaleString()}</div>
              </div>
              <div className="bg-white border border-brand-border-outer rounded-lg px-3 py-2 text-[12px]">
                <div className="text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest">Payment Method</div>
                <div className="text-brand-text-primary">{order.payment?.method || 'N/A'}</div>
              </div>
              <div className="bg-white border border-brand-border-outer rounded-lg px-3 py-2 text-[12px]">
                <div className="text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest">Transaction</div>
                <div className="text-brand-text-primary break-all">{order.payment?.transactionId || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-brand-border-inner bg-brand-subheader flex items-center justify-end gap-3">
          <button
            onClick={() => onDelete(order)}
            className="px-5 py-2.5 rounded-xl border border-brand-danger bg-white text-brand-danger text-[14px] font-bold shadow-sm transition-all hover:bg-[#ff4d6d] hover:text-white hover:shadow-md"
          >
            Delete Order
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#1A2333] text-white text-[14px] font-bold shadow-lg hover:bg-[#3D4A5C] hover:text-white transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteOrderModal({ order, onCancel, onConfirm, isDeleting }) {
  return (
    <div className="fixed inset-0 z-[350] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1A2333]/60 backdrop-blur-sm" onClick={onCancel}></div>
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-brand-border-outer bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-brand-border-inner bg-brand-subheader px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-danger-bg text-brand-danger">
            <Trash2 size={18} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[16px] font-bold text-brand-text-primary">Delete order {formatOrderId(order)}</h3>
            <p className="text-[11px] text-brand-text-secondary">This action cannot be undone.</p>
          </div>
        </div>
        <div className="px-5 py-5">
          <p className="text-[13px] leading-6 text-brand-text-primary">
            Remove this order from the list permanently?
          </p>
          <div className="mt-5 flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              className="rounded-xl border border-brand-border-outer bg-white px-4 py-2 text-[13px] font-bold text-brand-text-secondary transition-colors hover:bg-brand-hover-row"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="rounded-xl border border-brand-danger bg-white px-4 py-2 text-[13px] font-bold text-brand-danger shadow-sm transition-all hover:bg-[#ff4d6d] hover:text-white hover:shadow-md disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Orders() {
  const { orders: ordersStore } = useStoreData();
  const { orders, isLoading, updateStatus, updateOrder, createOrder, deleteOrder, getOrderDetail } = ordersStore;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setOrderTypeFilter] = useState('All');
  const [detailOrder, setDetailOrder] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const formattedId = formatOrderId(order).toLowerCase();
      const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase()) || formattedId.includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      const matchesType = typeFilter === 'All' || order.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [orders, search, statusFilter, typeFilter]);

  const statuses = ['All', 'New', 'Cooking', 'Ready', 'Delivery', 'Finished', 'Delivered', 'Cancelled'];
  const types = ['All', ...ORDER_TYPES];

  const stats = useMemo(() => {
    return {
      new: orders.filter(o => o.status === 'New').length,
      cooking: orders.filter(o => o.status === 'Cooking').length,
      ready: orders.filter(o => o.status === 'Ready').length,
    };
  }, [orders]);

  const parseItemsInput = (value) => value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => {
      const [name, quantity = '1', price = '0', status = 'InKitchen'] = item.split(':').map(part => part.trim());
      return { name, quantity: Number(quantity) || 1, price: Number(price) || 0, status };
    });

  const handleCreateOrder = async () => {
    const type = window.prompt('Order type: In-Restaurant or Delivery', 'In-Restaurant');
    if (!type) return;
    const customerName = window.prompt('Customer name', type === 'Delivery' ? 'Delivery Customer' : 'Walk-in Customer');
    if (!customerName) return;
    const itemsText = window.prompt('Items as name:qty:price:status, comma separated', 'Chicken:1:99:InKitchen');
    if (!itemsText) return;
    const items = parseItemsInput(itemsText);
    await createOrder({
      type,
      status: 'New',
      customer: { name: customerName },
      items,
    });
  };

  const handleSaveOrderItems = async (order, updates) => {
    await updateOrder({
      id: order.id,
      updates,
    });
  };

  const handleDeleteOrder = async (order) => {
    setIsDeleting(true);
    try {
      await deleteOrder(order.id);
      if (detailOrder?.id === order.id) {
        setDetailOrder(null);
      }
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const requestDeleteOrder = (order) => {
    setDeleteTarget(order);
  };

  const handleViewOrder = async (order) => {
    setDetailOrder(await getOrderDetail(order.id));
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="pt-4 px-6 pb-[14px] bg-white border-b border-brand-border-outer flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <div className="text-[20px] font-bold text-brand-text-primary">Order Management</div>
          <div className="text-[12px] text-brand-text-secondary mt-0.5">Track real-time orders, manage kitchen flow and delivery status</div>
        </div>

        <div className="flex items-center gap-6 hidden md:flex">
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">New Orders</span>
            <div className="text-[18px] font-bold text-brand-danger">{stats.new}</div>
          </div>
          <div className="w-[1px] h-8 bg-brand-border-inner"></div>
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">In Kitchen</span>
            <div className="text-[18px] font-bold text-brand-warning-text">{stats.cooking}</div>
          </div>
          <div className="w-[1px] h-8 bg-brand-border-inner"></div>
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Ready to Serve</span>
            <div className="text-[18px] font-bold text-brand-success">{stats.ready}</div>
          </div>
          <div className="w-[1px] h-8 bg-brand-border-inner"></div>
          <button
            onClick={handleCreateOrder}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-text-dark text-white rounded-lg text-[13px] font-bold shadow-sm hover:bg-brand-text-dark/90 transition-colors"
          >
            <Plus size={16} />
            Create New Order
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-6 pb-4 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-tertiary" />
              <input
                type="text"
                placeholder="Search Order ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-white border border-brand-border-outer rounded-lg text-[13px] text-brand-text-primary focus:border-brand-text-tertiary outline-none transition-all shadow-sm w-48"
              />
            </div>

            <div className="h-8 w-[1px] bg-brand-border-inner mx-1 hidden sm:block"></div>

            <div className="flex items-center gap-2 bg-brand-sidebar p-1 rounded-lg border border-brand-border-inner">
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => setOrderTypeFilter(t)}
                  className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                    typeFilter === t
                      ? 'bg-white shadow-sm text-brand-text-primary'
                      : 'text-brand-text-secondary hover:text-brand-text-primary'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 w-full lg:w-auto">
            <span className="text-[11px] font-bold text-brand-text-tertiary uppercase tracking-widest mr-1">Status:</span>
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-all whitespace-nowrap ${
                  statusFilter === s
                    ? 'bg-brand-text-dark border-brand-text-dark text-white shadow-md'
                    : 'bg-white border-brand-border-outer text-brand-text-secondary hover:bg-brand-hover-row'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="px-6 flex-1 overflow-hidden pb-6">
        <div className="bg-white border border-brand-border-outer rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-subheader border-b border-brand-border-inner">
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Order ID</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Type</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Items</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider text-right">Total</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider text-center">Status</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-brand-text-tertiary">
                        <div className="w-6 h-6 border-2 border-brand-text-tertiary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[13px]">Loading orders...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <OrderRow
                      key={order.id}
                      order={order}
                      onUpdateStatus={(id, status) => updateStatus({ id, status })}
                      onDelete={requestDeleteOrder}
                      onView={handleViewOrder}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-32 text-center text-brand-text-tertiary">
                      <div className="flex flex-col items-center gap-3">
                        <Filter size={40} className="opacity-20" />
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-brand-text-primary">No orders found</span>
                          <span className="text-[12px]">Try adjusting your search or filters</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-auto px-6 py-3 border-t border-brand-border-inner bg-brand-hover-row flex items-center justify-between text-[11px] text-brand-text-secondary">
            <span>Showing {filteredOrders.length} of {orders.length} total orders</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span>Lines per page:</span>
                <select className="bg-transparent border-none outline-none font-bold text-brand-text-primary cursor-pointer">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 border border-brand-border-outer rounded bg-white hover:bg-brand-sidebar transition-colors disabled:opacity-50" disabled>Previous</button>
                <button className="px-2 py-1 border border-brand-border-outer rounded bg-white hover:bg-brand-sidebar transition-colors disabled:opacity-50" disabled>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {detailOrder && (
        <OrderDetailModal
          order={detailOrder}
          onClose={() => setDetailOrder(null)}
          onSave={handleSaveOrderItems}
          onDelete={requestDeleteOrder}
        />
      )}
      {deleteTarget && (
        <DeleteOrderModal
          order={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => handleDeleteOrder(deleteTarget)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  )
}
