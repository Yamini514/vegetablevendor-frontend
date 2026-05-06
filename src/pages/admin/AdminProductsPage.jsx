import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useAdminProducts } from '../../api/products'
import { useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../api/admin'
import DataTable from '../../components/admin/DataTable'
import ProductForm from '../../components/admin/ProductForm'
import Button from '../../components/ui/Button'
import { formatPrice } from '../../utils/formatPrice'

function StockBadge({ product }) {
  if (product.is_out_of_stock || product.stock <= 0)
    return <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Out of Stock</span>
  if (product.low_stock)
    return (
      <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
        Low — {product.stock} {product.unit}
      </span>
    )
  return <span className="text-xs text-text">{product.stock} {product.unit}</span>
}

export default function AdminProductsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const { data, isLoading } = useAdminProducts({ page, search: search || undefined, page_size: 20 })
  const { mutate: create, isPending: creating } = useCreateProduct()
  const { mutate: update, isPending: updating } = useUpdateProduct()
  const { mutate: deleteProduct } = useDeleteProduct()

  const products    = data?.data || []
  const totalPages  = data?.total_pages || 1

  const openCreate = () => { setEditing(null); setModalOpen(true) }
  const openEdit   = (p) => { setEditing(p); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const handleSubmit = (formData) => {
    if (editing) {
      update({ id: editing.id, ...formData }, { onSuccess: closeModal })
    } else {
      create(formData, { onSuccess: closeModal })
    }
  }

  const handleDelete = (p) => {
    if (window.confirm(`Delete "${p.name}"?`)) deleteProduct(p.id)
  }

  const columns = [
    {
      key: 'image_url', label: 'Image',
      render: (p) => p.image_url
        ? <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
        : <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-lg">🥦</div>,
    },
    {
      key: 'name', label: 'Product',
      render: (p) => (
        <div>
          <p className="font-medium text-text">{p.name}</p>
          <p className="text-xs text-slate-400">{p.category_name}</p>
        </div>
      ),
    },
    { key: 'price', label: 'Price', render: (p) => `${formatPrice(p.price)}/${p.unit}` },
    {
      key: 'stock', label: 'Stock',
      render: (p) => <StockBadge product={p} />,
    },
    {
      key: 'active', label: 'Status',
      render: (p) => (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          {p.active ? 'Active' : 'Hidden'}
        </span>
      ),
    },
    {
      key: 'actions', label: '',
      render: (p) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
            <PencilSquareIcon className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(p)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-text">Products</h1>
          <p className="text-slate-500 text-sm mt-0.5">{data?.total || 0} total</p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4" /> Add Product
        </Button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="input-field max-w-sm"
        />
      </div>

      <DataTable columns={columns} data={products} isLoading={isLoading} emptyMessage="No products found" />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn-secondary disabled:opacity-40">← Prev</button>
          <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary disabled:opacity-40">Next →</button>
        </div>
      )}

      <ProductForm
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        product={editing}
        isLoading={creating || updating}
      />
    </motion.div>
  )
}
