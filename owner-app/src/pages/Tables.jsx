import React, { useState, useMemo } from 'react'
import { Search, Grid, List as ListIcon, Filter, AlertTriangle, ShoppingBag } from 'lucide-react'
import { useTables } from '../hooks/useTables'
import { useOrders } from '../hooks/useOrders'
import { useUIStore } from '../context/UIContext'
import { TABLE_STATUS_STYLES } from '../utils/statusStyles'
import TableCard from '../components/tables/TableCard'
import TableDetailModal from '../components/tables/TableDetailModal'

export default function Tables() {
  const { tables, isLoading: tablesLoading } = useTables();
  const { orders, isLoading: ordersLoading } = useOrders();
  const { tableView, setTableView } = useUIStore();

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Tables');
  const [selectedTable, setSelectedTable] = useState(null);

  const filterOptions = ['All Tables', 'Available', 'Occupied', 'Window View', 'VIP Zone'];

  const filteredTables = useMemo(() => {
    return tables.filter(t => {
      const matchesSearch = t.number.toString().includes(search) || t.area.toLowerCase().includes(search.toLowerCase());

      let matchesFilter = true;
      if (activeFilter === 'Available') matchesFilter = t.status === 'Available';
      else if (activeFilter === 'Occupied') matchesFilter = t.status !== 'Available';
      else if (activeFilter !== 'All Tables') matchesFilter = t.area === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [tables, search, activeFilter]);

  const stats = useMemo(() => {
    const total = tables.length;
    const available = tables.filter(t => t.status === 'Available').length;
    const occupied = total - available;
    const warning = tables.filter(t => t.status === 'Payment').length;
    return { total, available, occupied, warning };
  }, [tables]);

  const getTableOrder = (tableId) => {
    return orders.find(o => o.tableId === tableId && (o.status !== 'Paid' && o.status !== 'Cancelled'));
  };

  const isLoading = tablesLoading || ordersLoading;

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="pt-4 px-6 pb-[14px] bg-white border-b border-brand-border-outer flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <div className="text-[20px] font-bold text-brand-text-primary">Floor Management</div>
          <div className="text-[12px] text-brand-text-secondary mt-0.5">Monitor table status and manage active guest orders</div>
        </div>

        <div className="flex items-center gap-6 hidden md:flex">
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Total Tables</span>
            <div className="text-[18px] font-bold text-brand-text-primary">{stats.total}</div>
          </div>
          <div className="w-[1px] h-8 bg-brand-border-inner"></div>
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Available</span>
            <div className="text-[18px] font-bold text-brand-success">{stats.available}</div>
          </div>
          <div className="w-[1px] h-8 bg-brand-border-inner"></div>
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Occupied</span>
            <div className="text-[18px] font-bold text-brand-warning-text">{stats.occupied}</div>
          </div>
          {stats.warning > 0 && (
            <>
              <div className="w-[1px] h-8 bg-brand-border-inner"></div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Attention</span>
                  <AlertTriangle size={10} className="text-brand-danger" />
                </div>
                <div className="text-[18px] font-bold text-brand-danger">{stats.warning}</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-6 pb-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 w-full md:w-auto">
            {filterOptions.map(opt => (
              <button
                key={opt}
                onClick={() => setActiveFilter(opt)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-medium border transition-all whitespace-nowrap ${
                  activeFilter === opt
                    ? 'bg-brand-text-dark border-brand-text-dark text-white shadow-md'
                    : 'bg-white border-brand-border-outer text-brand-text-secondary hover:bg-brand-hover-row'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-tertiary" />
              <input
                type="text"
                placeholder="Search table #"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-brand-border-outer rounded-lg text-[13px] text-brand-text-primary focus:border-brand-text-tertiary outline-none transition-all shadow-sm"
              />
            </div>

            <div className="hidden md:flex items-center bg-brand-sidebar p-1 rounded-lg border border-brand-border-inner shadow-inner">
              <button
                onClick={() => setTableView('grid')}
                className={`p-1.5 rounded-md transition-all ${tableView === 'grid' ? 'bg-white shadow-sm text-brand-text-dark' : 'text-brand-text-tertiary hover:text-brand-text-secondary'}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setTableView('list')}
                className={`p-1.5 rounded-md transition-all ${tableView === 'list' ? 'bg-white shadow-sm text-brand-text-dark' : 'text-brand-text-tertiary hover:text-brand-text-secondary'}`}
              >
                <ListIcon size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid / List Content */}
      <div className="p-6 pt-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-48 bg-white border border-brand-border-outer rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : tableView === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredTables.map(table => (
              <TableCard
                key={table.id}
                table={table}
                order={getTableOrder(table.id)}
                onClick={(t) => setSelectedTable(t)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-brand-border-outer rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-subheader border-b border-brand-border-inner">
                  <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Table #</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Area</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTables.map(table => (
                  <tr
                    key={table.id}
                    onClick={() => setSelectedTable(table)}
                    className="border-b border-brand-border-inner hover:bg-brand-hover-row cursor-pointer transition-colors last:border-0"
                  >
                    <td className="py-3 px-4 text-[14px] font-bold text-brand-text-primary">Table {table.number}</td>
                    <td className="py-3 px-4 text-[12px] text-brand-text-secondary">{table.area}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: TABLE_STATUS_STYLES[table.status].accent }}></div>
                        <span className="text-[12px] font-medium" style={{ color: TABLE_STATUS_STYLES[table.status].accent }}>{table.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-[11px] font-bold text-brand-text-dark-neutral hover:underline">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedTable && (
        <TableDetailModal
          table={selectedTable}
          order={getTableOrder(selectedTable.id)}
          onClose={() => setSelectedTable(null)}
        />
      )}
    </div>
  )
}
