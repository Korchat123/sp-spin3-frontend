import React, { useState, useMemo } from 'react'
import { Search, Plus, Filter, ArrowUpDown, ChevronDown } from 'lucide-react'
import { useStoreData } from '../context/StoreDataContext'
import OrderRow from '../components/orders/OrderRow'

export default function Orders() {
  const { orders: ordersStore } = useStoreData();
  const { orders, isLoading, updateStatus } = ordersStore;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setOrderTypeFilter] = useState('All');

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.id.includes(search);
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      const matchesType = typeFilter === 'All' || order.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [orders, search, statusFilter, typeFilter]);

  const statuses = ['All', 'New', 'Cooking', 'Ready', 'Paid', 'Delivered', 'Cancelled'];
  const types = ['All', 'In-Restaurant', 'Take Away', 'Delivery'];

  const stats = useMemo(() => {
    return {
      new: orders.filter(o => o.status === 'New').length,
      cooking: orders.filter(o => o.status === 'Cooking').length,
      ready: orders.filter(o => o.status === 'Ready').length,
    };
  }, [orders]);

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
          <button className="flex items-center gap-1.5 px-4 py-2 bg-brand-text-dark text-white rounded-lg text-[13px] font-bold shadow-sm hover:bg-brand-text-dark/90 transition-colors">
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
    </div>
  )
}
