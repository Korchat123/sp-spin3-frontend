import { useState, useRef } from 'react'
import { X, Upload, Image as ImageIcon } from 'lucide-react'

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
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async () => {
    setError('')
    if (!form.name.trim()) return setError('Name is required')
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) return setError('Please enter a valid price')
    if (!form.category) return setError('Category is required')

    try {
      setIsSubmitting(true)
      
      const formData = new FormData()
      formData.append('name', form.name.trim())
      formData.append('description', form.description.trim())
      formData.append('price', Number(form.price))
      formData.append('category', form.category)
      formData.append('cookingTime', Number(form.cookingTime) || 0)
      
      if (file) {
        formData.append('image', file)
      } else if (form.image) {
        formData.append('image', form.image.trim())
      }

      await onSubmit(formData)
      handleClose()
    } catch (err) {
      setError(err.message || 'Failed to create menu item')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setForm(EMPTY_FORM)
    setFile(null)
    setPreview('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl overflow-hidden">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border-outer">
          <h2 className="text-[16px] font-bold text-brand-text-primary">Add New Menu Item</h2>
          <button onClick={handleClose} className="text-brand-text-tertiary hover:text-brand-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-4 flex flex-col gap-4">

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-brand-text-secondary uppercase tracking-wider">Menu Image</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-full aspect-video border-2 border-dashed border-brand-border-outer rounded-xl overflow-hidden cursor-pointer hover:bg-brand-sidebar transition-colors flex flex-col items-center justify-center gap-2"
            >
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Upload className="text-white" size={24} />
                  </div>
                </>
              ) : (
                <>
                  <ImageIcon size={32} className="text-brand-text-tertiary" />
                  <div className="text-[12px] text-brand-text-secondary font-medium">Click to upload image</div>
                  <div className="text-[10px] text-brand-text-tertiary">PNG, JPG or WebP (Max 5MB)</div>
                </>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

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
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Short description"
              rows={2}
              className="w-full px-3 py-2 border border-brand-border-outer rounded-lg text-[13px] outline-none focus:border-brand-text-tertiary resize-none"
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
            onClick={handleClose}
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
