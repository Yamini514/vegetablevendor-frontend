import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useAdminProducts } from '../../api/products'
import { useUpdateProduct } from '../../api/admin'
import { PageLoader } from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

function StockEditor({ product }) {
  const [editing, setEditing]   = useState(false)
  const [stock, setStock]       = useState(product.stock)
  const [threshold, setThreshold] = useState(product.low_stock_threshold || 10)
  const { mutate: update, isPending } = useUpdateProduct()

  const save = () => {
    const s = parseInt(stock, 10)
    const t = parseInt(threshold, 10)
    if (isNaN(s) || s < 0) { toast.error('Stock must be a non-negative number'); return }
    if (isNaN(t) || t < 1) { toast.error('Threshold must be at least 1'); return }
    update(
      { id: product.id, stock: s, low_stock_threshold: t, is_out_of_stock: s <= 0 },
      {
        onSuccess: () => {
          toast.success(`${product.name} stock updated`)
          setEditing(false)
        },
      }
    )
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-xs text-primary hover:underline font-medium"
      >
        {product.stock} {product.unit}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        min="0"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <input
        type="number"
        min="1"
        value={threshold}
        onChange={(e) => setThreshold(e.target.value)}
        title="Low stock threshold"
        className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-orange-400"
      />
      <button
        onClick={save}
        disabled={isPending}
        className="text-xs bg-primary text-white px-2 py-1 rounded-lg disabled:opacity-50"
      >
        {isPending ? '...' : 'Save'}
      </button>
      <button onClick={() => setEditing(false)} className="text-xs text-slate-400 hover:text-slate-600">✕</button>
    </div>
  )
}

function StatusChip({ product }) {
  if (product.is_out_of_stock || product.stock <= 0)
    return <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">🚫 Out of Stock</span>
  if (product.low_stock)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
        <ExclamationTriangleIcon className="w-3 h-3" /> Low Stock
      </span>
    )
  return <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full"><CheckCircleIcon className="w-3 h-3" /> In Stock</span>
}

export default function AdminInventoryPage() {
  const [page, setPage]     = useState(1)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const { data, isLoading } = useAdminProducts({ page, search: search || undefined, page_size: 30 })
  const products    = data?.data || []
  const totalPages  = data?.total_pages || 1
  const total       = data?.total || 0

  const filtered = filter === 'all' ? products
    : filter === 'out'  ? products.filter((p) => p.is_out_of_stock || p.stock <= 0)
    : filter === 'low'  ? products.filter((p) => p.low_stock && !p.is_out_of_stock)
    : products

  const outCount  = products.filter((p) => p.is_out_of_stock || p.stock <= 0).length
  const lowCount  = products.filter((p) => p.low_stock && !p.is_out_of_stock).length

  if (isLoading) return <PageLoader />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-text">Inventory</h1>
        <p className="text-slate-500 text-sm mt-0.5">{total} products — click a stock number to edit</p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3 mb-5">
        {outCount > 0 && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
            <span className="text-xl">🚫</span>
            <div>
              <p className="font-bold text-red-600 text-lg leading-none">{outCount}</p>
              <p className="text-xs text-slate-500">Out of stock</p>
            </div>
          </div>
        )}
        {lowCount > 0 && (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2">
            <ExclamationTriangleIcon className="w-6 h-6 text-orange-500" />
            <div>
              <p className="font-bold text-orange-500 text-lg leading-none">{lowCount}</p>
              <p className="text-xs text-slate-500">Running low</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="input-field max-w-xs"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field w-auto"
        >
          <option value="all">All products</option>
          <option value="out">Out of stock</option>
          <option value="low">Low stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-gray-100">
              <tr>
                {['Product', 'Category', 'Stock (click to edit)', 'Threshold', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-400 text-sm">No products found</td>
                </tr>
              ) : filtered.map((p) => (
                <tr
                  key={p.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    p.is_out_of_stock || p.stock <= 0 ? 'bg-red-50/40' :
                    p.low_stock ? 'bg-orange-50/40' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.image_url
                        ? <img src={p.image_url} alt={p.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                        : <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center text-base shrink-0">🥦</div>}
                      <span className="font-medium text-text">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{p.category_name}</td>
                  <td className="px-4 py-3"><StockEditor product={p} /></td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{p.low_stock_threshold} {p.unit}</td>
                  <td className="px-4 py-3"><StatusChip product={p} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-secondary disabled:opacity-40">← Prev</button>
          <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="btn-secondary disabled:opacity-40">Next →</button>
        </div>
      )}

      <p className="text-xs text-slate-400 mt-4">
        Tip: Click any stock number to edit it inline. The &quot;Threshold&quot; column is the low-stock alert level.
      </p>
    </motion.div>
  )
}
