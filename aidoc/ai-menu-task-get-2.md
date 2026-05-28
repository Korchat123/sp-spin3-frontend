You are a senior developer. I need you to complete 5 tasks in my 
frontend owner app. Edit the actual files on disk one by one.

The goal is to give the owner app these features:
1. See all menu items loaded from real database
2. Create new menu item with a form modal
3. Delete a menu item with a confirm step
4. Toggle active / inactive on each menu card
5. See an activity log of all menu changes

The owner app is at:
/Users/aj/jsd12/sp-spin3-frontend/owner-app/

The current user comes from AuthContext and has these fields:
  user.name  — person's name
  user.role  — always 'owner' in this app

========================================================================
TASK 1 — Fix useMenu.js hook — add addItem and removeItem
========================================================================

File: /Users/aj/jsd12/sp-spin3-frontend/owner-app/src/hooks/useMenu.js

Replace the ENTIRE file content with this:

import { useState, useEffect, useCallback } from 'react'
import {
  getMenu,
  patchMenuItemAvailability,
  createMenu,
  deleteMenu,
} from '../api/menu'

export const useMenu = () => {
  const [menu, setMenu] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const fetchMenu = useCallback(async () => {
    try {
      setIsLoading(true)
      setIsError(false)
      const data = await getMenu()
      setMenu(data ?? [])
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchMenu() }, [fetchMenu])

  const toggleAvailability = async ({ id, available }) => {
    try {
      await patchMenuItemAvailability(id, available)
      await fetchMenu()
    } catch (err) {
      console.error('Toggle failed:', err.message)
    }
  }

  const addItem = async (data) => {
    try {
      await createMenu(data)
      await fetchMenu()
    } catch (err) {
      console.error('Create failed:', err.message)
      throw err
    }
  }

  const removeItem = async (id) => {
    try {
      await deleteMenu(id)
      await fetchMenu()
    } catch (err) {
      console.error('Delete failed:', err.message)
      throw err
    }
  }

  return { menu, isLoading, isError, toggleAvailability, addItem, removeItem }
}

========================================================================
TASK 2 — Create useMenuLogs.js hook
========================================================================

Create this NEW file:
/Users/aj/jsd12/sp-spin3-frontend/owner-app/src/hooks/useMenuLogs.js

File content:

import { useState, useEffect, useCallback } from 'react'
import { getMenuLogs } from '../api/menu'

export const useMenuLogs = () => {
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true)
      setIsError(false)
      const data = await getMenuLogs()
      setLogs(data ?? [])
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  return { logs, isLoading, isError, refetch: fetchLogs }
}

========================================================================
TASK 3 — Fix api/menu.js — add getMenuLogs
========================================================================

File: /Users/aj/jsd12/sp-spin3-frontend/owner-app/src/api/menu.js

Replace the ENTIRE file content with this:

import { api } from '../utils/api'

export const getMenu = () => api.get('/api/menus?all=true')

export const patchMenuItemAvailability = (id, available) =>
  api.patch(`/api/menus/${id}`, { available })

export const createMenu = (data) => api.post('/api/menus', data)

export const deleteMenu = (id) => api.delete(`/api/menus/${id}`)

export const getMenuLogs = () => api.get('/api/menus/logs/all')

========================================================================
TASK 4 — Fix MenuCard.jsx — fix field names + add delete button
========================================================================

File: /Users/aj/jsd12/sp-spin3-frontend/owner-app/src/components/menu/MenuCard.jsx

Replace the ENTIRE file content with this:

import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { formatTHB } from '../../utils/format'

export default function MenuCard({ item, onToggleAvailability, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDeleteClick = () => {
    setConfirmDelete(true)
  }

  const handleConfirmDelete = () => {
    onDelete(item._id)
    setConfirmDelete(false)
  }

  return (
    <div className={`bg-white border border-brand-border-outer rounded-xl overflow-hidden shadow-sm flex flex-col transition-all duration-200 ${!item.available ? 'opacity-70 grayscale-[0.5]' : 'hover:shadow-md'}`}>
      
      <div className="aspect-[4/3] bg-brand-sidebar relative overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-text-tertiary">
            <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="bg-white/90 backdrop-blur-sm border border-brand-border-inner px-2 py-1 rounded-lg text-[10px] font-bold text-brand-text-primary shadow-sm">
            {item.category}
          </span>
        </div>
        <button
          onClick={handleDeleteClick}
          className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors"
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-[14px] font-bold text-brand-text-primary leading-tight">{item.name}</h3>
          <span className="text-[14px] font-bold text-brand-text-primary shrink-0">{formatTHB(item.price)}</span>
        </div>
        {item.description && (
          <p className="text-[11px] text-brand-text-secondary line-clamp-2 mt-1">{item.description}</p>
        )}
      </div>

      <div className="px-4 py-3 border-t border-brand-border-inner bg-brand-subheader flex items-center justify-between">
        <span className={`text-[11px] font-bold ${item.available ? 'text-brand-success' : 'text-brand-danger'}`}>
          {item.available ? 'Available' : 'Unavailable'}
        </span>
        <button
          onClick={() => onToggleAvailability(item._id, !item.available)}
          className={`w-9 h-5 rounded-full relative transition-colors duration-200 focus:outline-none ${item.available ? 'bg-brand-success' : 'bg-brand-text-tertiary'}`}
        >
          <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-transform duration-200 ${item.available ? 'translate-x-4.5' : 'translate-x-1'}`}></div>
        </button>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-[16px] font-bold text-brand-text-primary mb-2">Delete Menu Item?</h3>
            <p className="text-[13px] text-brand-text-secondary mb-6">
              Are you sure you want to delete <strong>{item.name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 px-4 py-2 border border-brand-border-outer rounded-lg text-[13px] font-medium text-brand-text-primary hover:bg-brand-sidebar transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[13px] font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

========================================================================
TASK 5 — Create MenuFormModal.jsx
========================================================================

Create this NEW file:
/Users/aj/jsd12/sp-spin3-frontend/owner-app/src/components/menu/MenuFormModal.jsx

File content:

import React, { useState } from 'react'
import { X } from 'lucide-react'

const CATEGORIES = ['chicken', 'burger', 'combo', 'drink', 'side', 'dessert']

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  image: '',
  category: 'chicken',
  cookingTime: 0,
}

export default function MenuFormModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setError('')
    if (!form.name.trim()) return setError('Name is required')
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) return setError('Please enter a valid price')
    if (!form.category) return setError('Category is required')

    try {
      setIsSubmitting(true)
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        image: form.image.trim(),
        category: form.category,
        cookingTime: Number(form.cookingTime) || 0,
      })
      setForm(EMPTY_FORM)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create menu item')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border-outer">
          <h2 className="text-[16px] font-bold text-brand-text-primary">Add New Menu Item</h2>
          <button onClick={onClose} className="text-brand-text-tertiary hover:text-brand-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4 flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-brand-text-secondary uppercase tracking-wider">Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Spicy Chicken Sandwich"
              className="w-full px-3 py-2 border border-brand-border-outer rounded-lg text-[13px] outline-none focus:border-brand-text-tertiary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-brand-text-secondary uppercase tracking-wider">Description</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Short description"
              className="w-full px-3 py-2 border border-brand-border-outer rounded-lg text-[13px] outline-none focus:border-brand-text-tertiary"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[12px] font-bold text-brand-text-secondary uppercase tracking-wider">Price (฿) *</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 border border-brand-border-outer rounded-lg text-[13px] outline-none focus:border-brand-text-tertiary"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[12px] font-bold text-brand-text-secondary uppercase tracking-wider">Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-brand-border-outer rounded-lg text-[13px] outline-none focus:border-brand-text-tertiary bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-brand-text-secondary uppercase tracking-wider">Image URL</label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://... (leave empty for now)"
              className="w-full px-3 py-2 border border-brand-border-outer rounded-lg text-[13px] outline-none focus:border-brand-text-tertiary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-brand-text-secondary uppercase tracking-wider">Cooking Time (seconds)</label>
            <input
              name="cookingTime"
              type="number"
              value={form.cookingTime}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-brand-border-outer rounded-lg text-[13px] outline-none focus:border-brand-text-tertiary"
            />
          </div>

          {error && (
            <p className="text-[12px] text-red-500 font-medium">{error}</p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-brand-border-outer flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-brand-border-outer rounded-lg text-[13px] font-medium text-brand-text-primary hover:bg-brand-sidebar transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-brand-text-dark text-white rounded-lg text-[13px] font-medium hover:bg-brand-text-dark/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  )
}

========================================================================
TASK 6 — Create MenuLogTable.jsx
========================================================================

Create this NEW file:
/Users/aj/jsd12/sp-spin3-frontend/owner-app/src/components/menu/MenuLogTable.jsx

File content:

import React from 'react'

const ACTION_STYLES = {
  created:     'bg-green-100 text-green-700',
  deleted:     'bg-red-100 text-red-700',
  activated:   'bg-blue-100 text-blue-700',
  deactivated: 'bg-gray-100 text-gray-600',
}

const formatDate = (timestamp) => {
  const d = new Date(timestamp)
  return d.toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function MenuLogTable({ logs, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-brand-text-tertiary text-[13px]">
        Loading logs...
      </div>
    )
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-brand-text-tertiary text-[13px]">
        No activity yet
      </div>
    )
  }

  return (
    <div className="bg-white border border-brand-border-outer rounded-xl overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-brand-subheader border-b border-brand-border-inner">
            <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Action</th>
            <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Item</th>
            <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Done By</th>
            <th className="py-3 px-4 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">Date & Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={log._id || i} className="border-b border-brand-border-inner hover:bg-brand-hover-row transition-colors">
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-[11px] font-bold capitalize ${ACTION_STYLES[log.action] || 'bg-gray-100 text-gray-600'}`}>
                  {log.action}
                </span>
              </td>
              <td className="py-3 px-4 text-[13px] font-medium text-brand-text-primary">{log.menuName}</td>
              <td className="py-3 px-4">
                <div className="text-[13px] text-brand-text-primary">{log.performedBy}</div>
                <div className="text-[11px] text-brand-text-tertiary capitalize">{log.performedByRole}</div>
              </td>
              <td className="py-3 px-4 text-[12px] text-brand-text-secondary">{formatDate(log.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

========================================================================
TASK 7 — Update pages/Menu.jsx to wire everything together
========================================================================

File: /Users/aj/jsd12/sp-spin3-frontend/owner-app/src/pages/Menu.jsx

Replace the ENTIRE file content with this:

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

========================================================================

After ALL 7 tasks are done:

1. Show me the final content of every file you created or changed
2. Run this command and show output:
   cd /Users/aj/jsd12/sp-spin3-frontend && npm run dev
3. Also run owner app:
   cd /Users/aj/jsd12/sp-spin3-frontend/owner-app && npm run dev
4. Confirm both start with no errors
5. List any errors and explain what caused them