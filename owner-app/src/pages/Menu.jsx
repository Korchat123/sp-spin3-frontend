import React, { useState, useMemo } from 'react'
import { Search, Plus, LayoutGrid, List } from 'lucide-react'
import { useStoreData } from '../context/StoreDataContext'
import MenuCard from '../components/menu/MenuCard'
import { formatTHB } from '../utils/format'

export default function Menu() {
  const { menu: menuStore } = useStoreData();
  const { menu, isLoading, toggleAvailability } = menuStore;
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewType, setViewType] = useState('grid');

  const categories = ['All', 'chicken', 'burger', 'combo', 'drink', 'side', 'dessert'];

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [menu, search, activeCategory]);

  const stats = useMemo(() => {
    return {
      total: menu.length,
      available: menu.filter(m => m.available).length,
      outOfStock: menu.filter(m => !m.available).length,
    };
  }, [menu]);

  return (
    <div className="flex flex-col min-h-full">
      <div className="pt-4 px-6 pb-[14px] bg-white border-b border-brand-border-outer flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <div className="text-[20px] font-bold text-brand-text-primary">Menu Management</div>
          <div className="text-[12px] text-brand-text-secondary mt-0.5">Organize your digital catalog</div>
        </div>
        <div className="flex items-center gap-6 hidden md:flex">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold">Total</span>
            <div className="text-[18px] font-bold">{stats.total}</div>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-brand-text-dark text-white rounded-lg text-[13px] font-bold shadow-sm">
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      <div className="p-6 pb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full text-[12px] border ${activeCategory === cat ? 'bg-brand-text-dark text-white' : 'bg-white text-brand-text-secondary'}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-tertiary" />
          <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-[13px]" />
        </div>
      </div>

      <div className="p-6 pt-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMenu.map(item => (
              <MenuCard key={item.id} item={item} onToggleAvailability={(id, avail) => toggleAvailability({ id, available: avail })} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
