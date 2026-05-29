import React, { useState, useMemo } from 'react'
import { Search, Plus } from 'lucide-react'
import { useStoreData } from '../context/StoreDataContext'
import { useMenuLogs } from '../hooks/useMenuLogs'
import MenuCard from '../components/menu/MenuCard'
import MenuFormModal from '../components/menu/MenuFormModal'
import MenuLogTable from '../components/menu/MenuLogTable'

export default function Menu() {
  const { menu: menuStore } = useStoreData()
  const { menu, isLoading, toggleAvailability, addItem, removeItem } = menuStore
  const { logs, isLoading: logsLoading, refetch: refetchLogs } = useMenuLogs()

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeTab, setActiveTab] = useState('menu')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const categories = ['All', 'chicken', 'burger', 'combo', 'drink', 'side', 'dessert']

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [menu, search, activeCategory])

  const stats = useMemo(() => ({
    total: menu.length,
    available: menu.filter(m => m.available).length,
    outOfStock: menu.filter(m => !m.available).length,
  }), [menu])

  const handleAddItem = async (data) => {
    await addItem(data)
    await refetchLogs()
  }

  const handleDelete = async (id) => {
    await removeItem(id)
    await refetchLogs()
  }

  const handleToggle = async (id, available) => {
    await toggleAvailability({ id, available })
    await refetchLogs()
  }

  return (
    <div className="flex flex-col min-h-full">

      <div className="pt-4 px-6 pb-[14px] bg-white border-b border-brand-border-outer flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <div className="text-[20px] font-bold text-brand-text-primary">Menu Management</div>
          <div className="text-[12px] text-brand-text-secondary mt-0.5">Organize your digital catalog</div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-center hidden md:flex">
            <div>
              <div className="text-[10px] uppercase font-semibold text-brand-text-secondary">Total</div>
              <div className="text-[18px] font-bold">{stats.total}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-brand-text-secondary">Active</div>
              <div className="text-[18px] font-bold text-brand-success">{stats.available}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-brand-text-secondary">Inactive</div>
              <div className="text-[18px] font-bold text-brand-danger">{stats.outOfStock}</div>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-text-dark text-white rounded-lg text-[13px] font-bold shadow-sm hover:bg-brand-text-dark/90 transition-colors"
          >
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      <div className="px-6 pt-4 flex gap-4 border-b border-brand-border-outer">
        <button
          onClick={() => setActiveTab('menu')}
          className={`pb-3 text-[13px] font-bold border-b-2 transition-colors ${activeTab === 'menu' ? 'border-brand-text-dark text-brand-text-primary' : 'border-transparent text-brand-text-tertiary'}`}
        >
          Menu Items
        </button>
        <button
          onClick={() => setActiveTab('log')}
          className={`pb-3 text-[13px] font-bold border-b-2 transition-colors ${activeTab === 'log' ? 'border-brand-text-dark text-brand-text-primary' : 'border-transparent text-brand-text-tertiary'}`}
        >
          Activity Log
        </button>
      </div>

      {activeTab === 'menu' && (
        <>
          <div className="p-6 pb-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-[12px] border capitalize whitespace-nowrap ${activeCategory === cat ? 'bg-brand-text-dark text-white' : 'bg-white text-brand-text-secondary'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-tertiary" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-[13px]"
              />
            </div>
          </div>

          <div className="p-6 pt-0 flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-20 text-brand-text-tertiary text-[13px]">
                Loading menu...
              </div>
            ) : filteredMenu.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-brand-text-tertiary text-[13px]">
                No items found
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMenu.map(item => (
                  <MenuCard
                    key={item._id}
                    item={item}
                    onToggleAvailability={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'log' && (
        <div className="p-6 flex-1 overflow-y-auto">
          <MenuLogTable logs={logs} isLoading={logsLoading} />
        </div>
      )}

      <MenuFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddItem}
      />
    </div>
  )
}
