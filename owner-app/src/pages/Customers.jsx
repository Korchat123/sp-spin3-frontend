import React, { useState, useMemo } from 'react'
import { Search, UserPlus } from 'lucide-react'
import { useCustomers } from '../hooks/useCustomers'
import CustomerRow from '../components/customers/CustomerRow'
import CustomerDetailPanel from '../components/customers/CustomerDetailPanel'

export default function Customers() {
  const { customers, isLoading } = useCustomers();
  const [search, setSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const tiers = ['All', 'VIP', 'Gold', 'Silver', 'Basic'];

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                            c.phone.includes(search) ||
                            c.id.toLowerCase().includes(search.toLowerCase());
      const matchesTier = selectedTier === 'All' || c.tier === selectedTier;
      return matchesSearch && matchesTier;
    });
  }, [customers, search, selectedTier]);

  const vipCount = customers.filter(c => c.tier === 'VIP').length;

  return (
    <div className="flex flex-col min-h-full relative overflow-hidden">
      {/* Page Header */}
      <div className="pt-4 px-6 pb-[14px] bg-white border-b border-brand-border-outer flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <div className="text-[20px] font-bold text-brand-text-primary">Customer Management</div>
          <div className="text-[12px] text-brand-text-secondary mt-0.5">View member profiles, track spending, and manage loyalty points</div>
        </div>

        <div className="flex items-center gap-6 hidden md:flex">
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Total Members</span>
            <div className="text-[18px] font-bold text-brand-text-primary">{customers.length}</div>
          </div>
          <div className="w-[1px] h-8 bg-brand-border-inner"></div>
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">VIP Members</span>
            <div className="text-[18px] font-bold text-brand-success">{vipCount}</div>
          </div>
          <div className="w-[1px] h-8 bg-brand-border-inner"></div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-brand-text-dark text-white rounded-lg text-[13px] font-bold shadow-sm hover:bg-brand-text-dark/90 transition-colors">
            <UserPlus size={16} />
            Add New Member
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-6 pb-0 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-tertiary" />
          <input
            type="text"
            placeholder="Search by name, phone, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-brand-border-outer rounded-xl text-[14px] text-brand-text-primary focus:border-brand-text-tertiary outline-none transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {tiers.map(tier => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-4 py-2 rounded-full text-[12px] font-medium border transition-all whitespace-nowrap ${
                selectedTier === tier
                  ? 'bg-brand-text-dark border-brand-text-dark text-white shadow-md'
                  : 'bg-white border-brand-border-outer text-brand-text-secondary hover:bg-brand-hover-row'
              }`}
            >
              {tier === 'All' ? 'All Tiers' : `${tier} Tier`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="p-6 flex-1 overflow-hidden">
        <div className="bg-white border border-brand-border-outer rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-subheader border-b border-brand-border-inner">
                  <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Member</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Contact</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Tier</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Points</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Total Spent</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider text-right">Last Visit</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-brand-text-tertiary">Loading members...</td>
                  </tr>
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map(customer => (
                    <CustomerRow
                      key={customer.id}
                      customer={customer}
                      onClick={(c) => setSelectedCustomer(c)}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-brand-text-tertiary">No members found matching your criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-brand-border-inner bg-brand-hover-row flex items-center justify-between text-[11px] text-brand-text-secondary">
            <span>Showing {filteredCustomers.length} of {customers.length} total members</span>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 border border-brand-border-outer rounded bg-white hover:bg-brand-sidebar transition-colors">Previous</button>
              <button className="px-2 py-1 border border-brand-border-outer rounded bg-white hover:bg-brand-sidebar transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-in Detail Panel */}
      <div className={`fixed inset-0 z-[190] transition-opacity duration-300 ${selectedCustomer ? 'bg-[#1A2333]/20 opacity-100 visible' : 'bg-[#1A2333]/0 opacity-0 invisible'}`} onClick={() => setSelectedCustomer(null)}></div>
      <div className={`fixed inset-y-0 right-0 z-[200] transform transition-transform duration-300 ease-in-out ${selectedCustomer ? 'translate-x-0' : 'translate-x-full'}`}>
        <CustomerDetailPanel
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      </div>
    </div>
  )
}
