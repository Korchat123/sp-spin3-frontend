import React, { useState, useMemo } from 'react'
import { Search, Plus, Zap, Target } from 'lucide-react'
import { usePromotions } from '../hooks/usePromotions'
import { getPromoStatus } from '../utils/getPromoStatus'
import PromotionRow from '../components/promotions/PromotionRow'
import { formatTHB } from '../utils/format'

export default function Promotions() {
  const { promotions, isLoading, updatePromotion } = usePromotions();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredPromotions = useMemo(() => {
    return promotions.filter(promo => {
      const matchesSearch = promo.name.toLowerCase().includes(search.toLowerCase()) ||
                            promo.code.toLowerCase().includes(search.toLowerCase());
      const status = getPromoStatus(promo.startDate, promo.endDate);
      const matchesStatus = statusFilter === 'All' || status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [promotions, search, statusFilter]);

  const stats = useMemo(() => {
    const active = promotions.filter(p => getPromoStatus(p.startDate, p.endDate) === 'Active' && p.active).length;
    const totalSavings = promotions.reduce((sum, p) => sum + p.totalAmountSaved, 0);
    return { active, totalSavings };
  }, [promotions]);

  const filterOptions = ['All', 'Active', 'ExpSoon', 'Scheduled', 'Expired'];

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="pt-4 px-6 pb-[14px] bg-white border-b border-brand-border-outer flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <div className="text-[20px] font-bold text-brand-text-primary">Marketing & Promotions</div>
          <div className="text-[12px] text-brand-text-secondary mt-0.5">Manage discounts, seasonal offers and track campaign performance</div>
        </div>

        <div className="flex items-center gap-6 hidden md:flex">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Active Campaigns</span>
              <Zap size={10} className="text-brand-success" />
            </div>
            <div className="text-[18px] font-bold text-brand-text-primary">{stats.active}</div>
          </div>
          <div className="w-[1px] h-8 bg-brand-border-inner"></div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Customer Savings</span>
              <Target size={10} className="text-brand-success" />
            </div>
            <div className="text-[18px] font-bold text-brand-success">{formatTHB(stats.totalSavings)}</div>
          </div>
          <div className="w-[1px] h-8 bg-brand-border-inner"></div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-brand-text-dark text-white rounded-lg text-[13px] font-bold shadow-sm hover:bg-brand-text-dark/90 transition-colors">
            <Plus size={16} />
            Create Campaign
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
            placeholder="Search code or name..."
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
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Campaign Name / Code</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Status</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Duration</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider text-center">Engagement</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider text-right">Impact</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-brand-text-tertiary">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-brand-text-tertiary border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading campaigns...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredPromotions.length > 0 ? (
                  filteredPromotions.map(promo => (
                    <PromotionRow
                      key={promo.id}
                      promo={promo}
                      onToggle={(id, active) => updatePromotion({ id, updates: { active } })}
                      onEdit={(p) => console.log('Edit promo:', p)}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-32 text-center text-brand-text-tertiary">
                      <div className="flex flex-col items-center gap-3">
                        <Zap size={40} className="opacity-20" />
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-brand-text-primary">No campaigns found</span>
                          <span className="text-[12px]">Try adjusting your search or filters</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
