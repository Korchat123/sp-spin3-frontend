import React, { useState, useMemo } from 'react'
import { Search, Plus, Filter, Trash2, Download } from 'lucide-react'
import { useWaste } from '../hooks/useWaste'
import WasteRow from '../components/waste/WasteRow'
import RecordWasteModal from '../components/waste/RecordWasteModal'
import { WasteFormProvider } from '../providers/WasteFormProvider'
import { formatTHB } from '../utils/format'

export default function WasteLog() {
  const { waste, isLoading } = useWaste();
  const [search, setSearch] = useState('');
  const [reasonFilter, setReasonFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reasons = ['All', 'Expired', 'Wrong Order', 'Accident/Spill', 'Quality Control'];

  const filteredWaste = useMemo(() => {
    return waste.filter(entry => {
      const matchesSearch = entry.itemName.toLowerCase().includes(search.toLowerCase());
      const matchesReason = reasonFilter === 'All' || entry.reason === reasonFilter;
      return matchesSearch && matchesReason;
    });
  }, [waste, search, reasonFilter]);

  const stats = useMemo(() => {
    const total = waste.reduce((sum, entry) => sum + entry.estimatedCost, 0);
    const expiredCount = waste.filter(e => e.reason === 'Expired').length;
    return { total, expiredCount };
  }, [waste]);

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="pt-4 px-6 pb-[14px] bg-white border-b border-brand-border-outer flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <div className="text-[20px] font-bold text-brand-text-primary">Waste Log</div>
          <div className="text-[12px] text-brand-text-secondary mt-0.5">Track operational losses and identify patterns in inventory waste</div>
        </div>

        <div className="flex items-center gap-6 hidden md:flex">
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Total Loss (Month)</span>
            <div className="text-[18px] font-bold text-brand-danger">-{formatTHB(stats.total)}</div>
          </div>
          <div className="w-[1px] h-8 bg-brand-border-inner"></div>
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Expired Items</span>
            <div className="text-[18px] font-bold text-brand-text-primary">{stats.expiredCount}</div>
          </div>
          <div className="w-[1px] h-8 bg-brand-border-inner"></div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-text-dark text-white rounded-lg text-[13px] font-bold shadow-sm hover:bg-brand-text-dark/90 transition-colors"
          >
            <Plus size={16} />
            Record Waste
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-6 pb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 w-full md:w-auto">
          {reasons.map(reason => (
            <button
              key={reason}
              onClick={() => setReasonFilter(reason)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-medium border transition-all whitespace-nowrap ${
                reasonFilter === reason
                  ? 'bg-brand-text-dark border-brand-text-dark text-white shadow-md'
                  : 'bg-white border-brand-border-outer text-brand-text-secondary hover:bg-brand-hover-row'
              }`}
            >
              {reason}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-tertiary" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-brand-border-outer rounded-lg text-[13px] text-brand-text-primary focus:border-brand-text-tertiary outline-none transition-all shadow-sm"
            />
          </div>
          <button className="p-2 border border-brand-border-outer rounded-lg text-brand-text-secondary hover:bg-brand-hover-row transition-colors">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="px-6 flex-1 overflow-hidden pb-6">
        <div className="bg-white border border-brand-border-outer rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-subheader border-b border-brand-border-inner">
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Item / Date</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Reason</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider text-center">Quantity</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider text-right">Est. Loss</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider text-right">Recorded By</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-brand-text-tertiary">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-brand-text-tertiary border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading logs...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredWaste.length > 0 ? (
                  filteredWaste.map(entry => (
                    <WasteRow key={entry.id} entry={entry} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-32 text-center text-brand-text-tertiary">
                      <div className="flex flex-col items-center gap-3">
                        <Trash2 size={40} className="opacity-20" />
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-brand-text-primary">No waste logs found</span>
                          <span className="text-[12px]">No operational losses recorded for this selection</span>
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

      {/* Modal with Provider */}
      {isModalOpen && (
        <WasteFormProvider>
          <RecordWasteModal onClose={() => setIsModalOpen(false)} />
        </WasteFormProvider>
      )}
    </div>
  )
}
