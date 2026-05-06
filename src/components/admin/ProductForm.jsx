import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useCategories } from '../../api/categories'

export default function ProductForm({ isOpen, onClose, onSubmit, product, isLoading }) {
  const { data: categories } = useCategories()
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    price: '',
    unit: 'kg',
    stock: '',
    description: '',
    image_url: '',
    featured: false,
    active: true,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        category_id: product.category_id || '',
        price: product.price ? (product.price / 100).toFixed(2) : '',
        unit: product.unit || 'kg',
        stock: product.stock || '',
        description: product.description || '',
        image_url: product.image_url || '',
        featured: product.featured || false,
        active: product.active !== false,
      })
    } else {
      setForm({ name: '', category_id: '', price: '', unit: 'kg', stock: '', description: '', image_url: '', featured: false, active: true })
    }
    setErrors({})
  }, [product, isOpen])

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.category_id) e.category_id = 'Category is required'
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) e.price = 'Valid price required'
    if (!form.stock && form.stock !== 0) e.stock = 'Stock is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      price: Math.round(Number(form.price) * 100),
      stock: Number(form.stock),
      category_id: Number(form.category_id),
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Edit Product' : 'Add Product'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input label="Product Name *" value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} placeholder="e.g. Fresh Tomatoes" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Category *</label>
            <select
              value={form.category_id}
              onChange={(e) => set('category_id', e.target.value)}
              className={`input-field ${errors.category_id ? 'border-red-400' : ''}`}
            >
              <option value="">Select category</option>
              {(categories || []).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Unit *</label>
            <select value={form.unit} onChange={(e) => set('unit', e.target.value)} className="input-field">
              {['kg', 'g', 'piece', 'dozen', 'bunch', 'litre', 'pack'].map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <Input
            label="Price per unit (₹) *"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
            error={errors.price}
            placeholder="0.00"
          />

          <Input
            label="Stock *"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => set('stock', e.target.value)}
            error={errors.stock}
            placeholder="0"
          />

          <div className="col-span-2">
            <Input label="Image URL" value={form.image_url} onChange={(e) => set('image_url', e.target.value)} placeholder="https://..." />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium text-slate-700 block mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              className="input-field resize-none"
              placeholder="Product description..."
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="w-4 h-4 accent-primary" />
            <span className="text-sm text-slate-700">Featured product</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} className="w-4 h-4 accent-primary" />
            <span className="text-sm text-slate-700">Active (visible to customers)</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isLoading}>
            {product ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
