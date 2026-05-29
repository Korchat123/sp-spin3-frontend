import React, { useState, useMemo } from 'react'
import { Search, Plus, Package } from 'lucide-react'
import { useStock } from '../hooks/useStock'
import { getStockStatus } from '../utils/getStockStatus'
import StockRow from '../components/stock/StockRow'

export default function Stock() {
  const { stock, isLoading } = useStock();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredStock = useMemo(() => {
    return stock.filter(lot => {
      const matchesSearch = lot.ingredientName.toLowerCase().includes(search.toLowerCase());
      const status = getStockStatus(lot.quantity, lot.reorderPoint, lot.expiryDate);
      const matchesStatus = statusFilter === 'All' || status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [stock, search, statusFilter]);

  const stats = useMemo(() => {
    const counts = { low: 0, expiring: 0, empty: 0 };
    stock.forEach(lot => {
      const status = getStockStatus(lot.quantity, lot.reorderPoint, lot.expiryDate);
      if (status === 'Low Stock') counts.low++;
      if (status === 'Exp Soon') counts.expiring++;
      if (status === 'Empty') counts.empty++;
    });
    return counts;
  }, [stock]);

  const filterOptions = ['All', 'Good', 'Low Stock', 'Exp Soon', 'Empty'];

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="pt-4 px-6 pb-[14px] bg-white border-b border-brand-border-outer flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <div className="text-[20px] font-bold text-brand-text-primary">Stock Inventory</div>
          <div className="text-[12px] text-brand-text-secondary mt-0.5">Track ingredient quantities, manage lots and monitor expiry dates</div>
        </div>

        <div className="flex items-center gap-6 hidden md:flex">
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Total Lots</span>
            <div className="text-[18px] font-bold text-brand-text-primary">{stock.length}</div>
          </div>
          <div className="w-[1px] h-8 bg-brand-border-inner"></div>
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Low Stock</span>
            <div className="text-[18px] font-bold text-brand-danger">{stats.low}</div>
          </div>
          <div className="w-[1px] h-8 bg-brand-border-inner"></div>
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Expiring Soon</span>
            <div className="text-[18px] font-bold text-brand-warning-text">{stats.expiring}</div>
          </div>
          <div className="w-[1px] h-8 bg-brand-border-inner"></div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-brand-text-dark text-white rounded-lg text-[13px] font-bold shadow-sm hover:bg-brand-text-dark/90 transition-colors">
            <Plus size={16} />
            Add New Lot
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-6 pb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 w-full md:w-auto">
          {filterOptions.map(opt => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-medium border transition-all whitespace-nowrap ${
                statusFilter === opt
                  ? 'bg-brand-text-dark border-brand-text-dark text-white shadow-md'
                  : 'bg-white border-brand-border-outer text-brand-text-secondary hover:bg-brand-hover-row'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-tertiary" />
          <input
            type="text"
            placeholder="Search ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-white border border-brand-border-outer rounded-lg text-[13px] text-brand-text-primary focus:border-brand-text-tertiary outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="px-6 flex-1 overflow-hidden pb-6">
        <div className="bg-white border border-brand-border-outer rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-subheader border-b border-brand-border-inner">
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Ingredient / Lot</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Quantity</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Cost / Unit</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Expiry</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider text-center">Status</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-brand-text-tertiary">
                        <div className="w-6 h-6 border-2 border-brand-text-tertiary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[13px]">Loading inventory...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredStock.length > 0 ? (
                  filteredStock.map(lot => (
                    <StockRow
                      key={lot.id}
                      lot={lot}
                      onEdit={(l) => console.log('Edit lot:', l)}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-32 text-center text-brand-text-tertiary">
                      <div className="flex flex-col items-center gap-3">
                        <Package size={40} className="opacity-20" />
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-brand-text-primary">No items found</span>
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
            <span>Showing {filteredStock.length} of {stock.length} total lots</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span>Lots per page:</span>
                <select className="bg-transparent border-none outline-none font-bold text-brand-text-primary cursor-pointer">
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
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
