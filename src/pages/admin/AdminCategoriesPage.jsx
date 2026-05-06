import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useAdminCategories } from '../../api/categories'
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../api/admin'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

function CategoryForm({ isOpen, onClose, onSubmit, category, isLoading }) {
  const [form, setForm] = useState(category
    ? { name: category.name, description: category.description || '', image_url: category.image_url || '', active: category.active }
    : { name: '', description: '', image_url: '', active: true }
  )
  const [error, setError] = useState('')

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Name is required'); return }
    onSubmit(form)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={category ? 'Edit Category' : 'Add Category'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Category Name *" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Vegetables" />
        <Input label="Image URL" value={form.image_url} onChange={(e) => set('image_url', e.target.value)} placeholder="https://..." />
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className="input-field resize-none" placeholder="Brief description..." />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} className="w-4 h-4 accent-primary" />
          <span className="text-sm text-slate-700">Active</span>
        </label>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isLoading}>{category ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </Modal>
  )
}

export default function AdminCategoriesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const { data, isLoading } = useAdminCategories()
  const { mutate: create, isPending: creating } = useCreateCategory()
  const { mutate: update, isPending: updating } = useUpdateCategory()
  const { mutate: deleteCategory } = useDeleteCategory()

  const categories = data?.data || []

  const openCreate = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (c) => { setEditing(c); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const handleSubmit = (formData) => {
    if (editing) {
      update({ id: editing.id, ...formData }, { onSuccess: closeModal })
    } else {
      create(formData, { onSuccess: closeModal })
    }
  }

  const handleDelete = (c) => {
    if (window.confirm(`Delete category "${c.name}"?`)) deleteCategory(c.id)
  }

  const columns = [
    {
      key: 'image', label: 'Image',
      render: (c) => c.image_url
        ? <img src={c.image_url} alt={c.name} className="w-10 h-10 rounded-lg object-cover" />
        : <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-lg">🏷️</div>,
    },
    { key: 'name', label: 'Name', render: (c) => <p className="font-medium text-text">{c.name}</p> },
    { key: 'product_count', label: 'Products' },
    { key: 'active', label: 'Status', render: (c) => (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
        {c.active ? 'Active' : 'Hidden'}
      </span>
    )},
    { key: 'actions', label: 'Actions', render: (c) => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500">
          <PencilSquareIcon className="w-4 h-4" />
        </button>
        <button onClick={() => handleDelete(c)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400">
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    )},
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-text">Categories</h1>
          <p className="text-slate-500 text-sm mt-0.5">{categories.length} categories</p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4" /> Add Category
        </Button>
      </div>

      <DataTable columns={columns} data={categories} isLoading={isLoading} emptyMessage="No categories yet" />

      <CategoryForm
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        category={editing}
        isLoading={creating || updating}
        key={editing?.id || 'new'}
      />
    </motion.div>
  )
}
