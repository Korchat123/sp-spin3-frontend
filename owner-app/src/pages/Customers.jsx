import React, { useState, useMemo } from 'react'
import { Search, Users, UserX, UserCheck } from 'lucide-react'
import { useCustomers } from '../hooks/useCustomers'
import { formatTHB } from '../utils/format'

export default function Customers() {
  const { customers, isLoading, toggleLock } = useCustomers();
  const [search, setSearch] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const fullName = `${customer.name} ${customer.surname}`.toLowerCase();
      const email = (customer.email || '').toLowerCase();
      const searchTerm = search.toLowerCase();
      return fullName.includes(searchTerm) || email.includes(searchTerm);
    });
  }, [customers, search]);

  const stats = useMemo(() => ({
    total: customers.length,
    active: customers.filter(c => c.active_status).length,
    locked: customers.filter(c => !c.active_status).length,
  }), [customers]);

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="pt-4 px-6 pb-[14px] bg-white border-b border-brand-border-outer flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <div className="text-[20px] font-bold text-brand-text-primary">Customer Management</div>
          <div className="text-[12px] text-brand-text-secondary mt-0.5">View customer history, spending and manage account status</div>
        </div>

        <div className="flex items-center gap-6 hidden md:flex">
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Total Customers</span>
            <div className="text-[18px] font-bold text-brand-text-primary">{stats.total}</div>
          </div>
          <div className="w-[1px] h-8 bg-brand-border-inner"></div>
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Active</span>
            <div className="text-[18px] font-bold text-brand-success">{stats.active}</div>
          </div>
          <div className="w-[1px] h-8 bg-brand-border-inner"></div>
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Locked</span>
            <div className="text-[18px] font-bold text-brand-danger">{stats.locked}</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-6 pb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-tertiary" />
          <input
            type="text"
            placeholder="Search by name or email..."
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
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Customer</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Phone</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Total Orders</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Total Spent</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Last Order</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider text-center">Status</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-brand-text-tertiary">
                        <div className="w-6 h-6 border-2 border-brand-text-tertiary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[13px]">Loading customers...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map(customer => (
                    <tr key={customer._id} className="border-b border-brand-border-inner last:border-none hover:bg-brand-sidebar/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-brand-text-primary">{customer.name} {customer.surname}</span>
                          <span className="text-[11px] text-brand-text-tertiary">{customer.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[13px] text-brand-text-secondary">
                        {customer.phone || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-[13px] text-brand-text-secondary">
                        {customer.totalOrders || 0}
                      </td>
                      <td className="py-4 px-6 text-[13px] font-bold text-brand-text-primary">
                        {formatTHB(customer.totalSpent || 0)}
                      </td>
                      <td className="py-4 px-6 text-[13px] text-brand-text-secondary">
                        {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString('th-TH') : 'Never'}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {customer.active_status ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-brand-success border border-green-100">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-brand-danger border border-red-100">
                            Locked
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => toggleLock({ id: customer._id, currentStatus: customer.active_status })}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                            customer.active_status 
                              ? 'text-brand-danger hover:bg-red-50' 
                              : 'text-brand-success hover:bg-green-50'
                          }`}
                        >
                          {customer.active_status ? (
                            <>
                              <UserX size={14} /> Lock
                            </>
                          ) : (
                            <>
                              <UserCheck size={14} /> Unlock
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-32 text-center text-brand-text-tertiary">
                      <div className="flex flex-col items-center gap-3">
                        <Users size={40} className="opacity-20" />
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-brand-text-primary">No customers found</span>
                          <span className="text-[12px]">Try adjusting your search terms</span>
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
