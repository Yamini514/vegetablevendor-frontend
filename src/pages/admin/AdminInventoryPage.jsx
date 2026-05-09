import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, X, Package, AlertTriangle, CheckCircle, XCircle, TrendingDown } from 'lucide-react'
import { useAdminProducts } from '../../api/products'
import { useUpdateProduct } from '../../api/admin'
import toast from 'react-hot-toast'

function StockBar({ value, max }) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0
  const color = pct === 0 ? 'bg-red-500' : pct < 30 ? 'bg-orange-400' : 'bg-emerald-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-500 w-8 text-right">{pct}%</span>
    </div>
  )
}

function StockBadge({ product }) {
  if (product.is_out_of_stock || product.stock <= 0)
    return (
      <span className="badge bg-red-50 text-red-600">
        <XCircle size={11} />
        Out of Stock
      </span>
    )
  if (product.low_stock)
    return (
      <span className="badge bg-orange-50 text-orange-600">
        <TrendingDown size={11} />
        Low Stock
      </span>
    )
  return (
    <span className="badge bg-emerald-50 text-emerald-600">
      <CheckCircle size={11} />
      In Stock
    </span>
  )
}

function StockEditor({ product }) {
  const [editing, setEditing] = useState(false)
  const [stock, setStock] = useState(product.stock)
  const [threshold, setThreshold] = useState(product.low_stock_threshold || 10)
  const { mutate: update, isPending } = useUpdateProduct()

  const save = () => {
    const s = parseInt(stock, 10)
    const t = parseInt(threshold, 10)
    if (isNaN(s) || s < 0) { toast.error('Stock must be 0 or more'); return }
    if (isNaN(t) || t < 1) { toast.error('Threshold must be at least 1'); return }
    update(
      { id: product.id, stock: s, low_stock_threshold: t, is_out_of_stock: s <= 0 },
      { onSuccess: () => { toast.success(`${product.name} updated`); setEditing(false) } }
    )
  }

  if (!editing) {
    return (
      <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 group">
        <span className="font-semibold text-slate-700 group-hover:text-primary transition-colors">
          {product.stock}
        </span>
        <span className="text-slate-400 text-xs">{product.unit}</span>
        <span className="text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">(edit)</span>
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <input
        type="number" min="0" value={stock}
        onChange={(e) => setStock(e.target.value)}
        className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        placeholder="Stock"
      />
      <input
        type="number" min="1" value={threshold}
        onChange={(e) => setThreshold(e.target.value)}
        title="Low stock threshold"
        className="w-16 border border-orange-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-200"
        placeholder="Min"
      />
      <button
        onClick={save}
        disabled={isPending}
        className="bg-primary text-white text-xs px-2.5 py-1 rounded-lg font-medium disabled:opacity-50 hover:bg-primary-dark transition-colors"
      >
        {isPending ? '…' : 'Save'}
      </button>
      <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-slate-600 text-xs">
        <X size={14} />
      </button>
    </div>
  )
}

export default function AdminInventoryPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const { data, isLoading } = useAdminProducts({ page, search: search || undefined, page_size: 30 })
  const products   = data?.data || []
  const totalPages = data?.total_pages || 1
  const total      = data?.total || 0

  const filtered =
    filter === 'out' ? products.filter((p) => p.is_out_of_stock || p.stock <= 0)
    : filter === 'low' ? products.filter((p) => p.low_stock && !(p.is_out_of_stock || p.stock <= 0))
    : products

  const outCount = products.filter((p) => p.is_out_of_stock || p.stock <= 0).length
  const lowCount = products.filter((p) => p.low_stock && !(p.is_out_of_stock || p.stock <= 0)).length
  const okCount  = products.length - outCount - lowCount

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 max-w-screen-2xl">
      {/* Header */}
      <div>
        <h1 className="page-title">Inventory</h1>
        <p className="page-subtitle">{total} products — click any stock number to edit inline</p>
      </div>

      {/* Health summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`stat-card flex items-center gap-4 cursor-pointer border-2 transition-colors ${filter === 'all' ? 'border-slate-300' : 'border-transparent'}`} onClick={() => setFilter('all')}>
          <div className="w-11 h-11 rounded-2xl bg-slate-500 flex items-center justify-center shrink-0">
            <Package size={20} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold font-heading text-slate-800">{total}</p>
            <p className="text-sm text-slate-500">Total Products</p>
          </div>
        </div>
        <div className={`stat-card flex items-center gap-4 cursor-pointer border-2 transition-colors ${filter === 'low' ? 'border-orange-400' : 'border-transparent'}`} onClick={() => setFilter(filter === 'low' ? 'all' : 'low')}>
          <div className="w-11 h-11 rounded-2xl bg-orange-500 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold font-heading text-orange-500">{lowCount}</p>
            <p className="text-sm text-slate-500">Low Stock</p>
          </div>
        </div>
        <div className={`stat-card flex items-center gap-4 cursor-pointer border-2 transition-colors ${filter === 'out' ? 'border-red-400' : 'border-transparent'}`} onClick={() => setFilter(filter === 'out' ? 'all' : 'out')}>
          <div className="w-11 h-11 rounded-2xl bg-red-500 flex items-center justify-center shrink-0">
            <XCircle size={20} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold font-heading text-red-500">{outCount}</p>
            <p className="text-sm text-slate-500">Out of Stock</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="input-field pl-9"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field w-auto"
        >
          <option value="all">All Products</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton-box h-14 rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Package size={40} className="text-slate-200 mb-3" />
              <p className="text-slate-400 font-medium">No products found</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Stock Health</th>
                  <th>Min Threshold</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className={
                    p.is_out_of_stock || p.stock <= 0 ? '!bg-red-50/30' :
                    p.low_stock ? '!bg-orange-50/30' : ''
                  }>
                    <td>
                      <div className="flex items-center gap-3">
                        {p.image_url
                          ? <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                          : <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0">🥦</div>}
                        <div>
                          <p className="font-semibold text-slate-700">{p.name}</p>
                          <p className="text-xs text-slate-400">{p.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-slate-100 text-slate-600">{p.category_name || '—'}</span>
                    </td>
                    <td><StockEditor product={p} /></td>
                    <td className="w-36">
                      <StockBar value={p.stock} max={Math.max(p.stock, p.low_stock_threshold * 3, 1)} />
                    </td>
                    <td>
                      <span className="text-xs text-slate-500">{p.low_stock_threshold} {p.unit}</span>
                    </td>
                    <td>
                      <span className="font-semibold text-slate-700">
                        ₹{p.price_per_unit}/{p.unit}
                      </span>
                    </td>
                    <td><StockBadge product={p} /></td>
                    <td>
                      <span className="text-xs text-slate-400">{p.updated_at ? new Date(p.updated_at).toLocaleDateString() : '—'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-secondary btn-sm disabled:opacity-40">← Prev</button>
          <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="btn-secondary btn-sm disabled:opacity-40">Next →</button>
        </div>
      )}
    </motion.div>
  )
}
