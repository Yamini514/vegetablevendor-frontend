import { motion } from 'framer-motion'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useDashboard } from '../../api/admin'
import MetricCard from '../../components/admin/MetricCard'
import { StatusBadge } from '../../components/ui/Badge'
import StarRating from '../../components/ui/StarRating'
import { formatPrice } from '../../utils/formatPrice'
import { formatDate } from '../../utils/formatDate'
import { PageLoader } from '../../components/ui/Spinner'

export default function AdminDashboardPage() {
  const { data: res, isLoading } = useDashboard()
  const data = res?.data

  if (isLoading) return <PageLoader />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-text">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back, Admin</p>
      </div>

      {/* Core metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Products" value={data?.total_products}             icon="🥦"  color="green" />
        <MetricCard label="Total Orders"   value={data?.total_orders}               icon="📦"  color="blue" />
        <MetricCard label="Revenue"        value={formatPrice(data?.total_revenue)} icon="💰"  color="yellow" subtitle="Delivered orders" />
        <MetricCard label="Pending Orders" value={data?.pending_orders}             icon="⏳"  color="red" />
      </div>

      {/* Inventory alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className={`card p-4 flex items-center gap-4 ${data?.out_of_stock > 0 ? 'border-red-200 bg-red-50' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0 text-xl">🚫</div>
          <div>
            <p className="font-heading font-bold text-2xl text-red-600">{data?.out_of_stock ?? 0}</p>
            <p className="text-sm text-slate-500">Products Out of Stock</p>
          </div>
        </div>
        <div className={`card p-4 flex items-center gap-4 ${data?.low_stock_count > 0 ? 'border-orange-200 bg-orange-50' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
            <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="font-heading font-bold text-2xl text-orange-500">{data?.low_stock_count ?? 0}</p>
            <p className="text-sm text-slate-500">Products Running Low</p>
          </div>
        </div>
      </div>

      {/* Low stock details */}
      {data?.low_stock_products?.length > 0 && (
        <div className="card p-5 mb-6 border-orange-100">
          <h2 className="font-heading font-semibold text-base mb-4 flex items-center gap-2">
            <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />
            Low Stock Alert — Reorder Soon
          </h2>
          <div className="space-y-2">
            {data.low_stock_products.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  {p.image_url
                    ? <img src={p.image_url} alt={p.name} className="w-9 h-9 rounded-lg object-cover" />
                    : <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center text-sm">🥦</div>}
                  <span className="font-medium text-sm text-text">{p.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-orange-600 font-bold">{p.stock} {p.unit} left</span>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    threshold: {p.threshold}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders by status */}
      {data?.orders_by_status && (
        <div className="card p-5 mb-6">
          <h2 className="font-heading font-semibold text-base mb-4">Orders by Status</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {data.orders_by_status.map(({ status, count }) => (
              <div key={status} className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="font-bold text-xl text-text mb-1">{count}</p>
                <StatusBadge status={status} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders table */}
        <div className="lg:col-span-2 card p-5">
          <h2 className="font-heading font-semibold text-base mb-4">Recent Orders</h2>
          {!data?.recent_orders?.length ? (
            <p className="text-slate-400 text-sm text-center py-4">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100">
                  <tr>
                    {['Order #', 'Date', 'Amount', 'Items', 'Status'].map((h) => (
                      <th key={h} className="pb-3 text-left text-xs text-slate-500 font-semibold uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.recent_orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="py-3 font-medium">#{order.id}</td>
                      <td className="py-3 text-slate-500">{formatDate(order.created_at)}</td>
                      <td className="py-3 text-primary font-semibold">{formatPrice(order.total_amount)}</td>
                      <td className="py-3 text-slate-500">{order.items?.length || 0}</td>
                      <td className="py-3"><StatusBadge status={order.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent reviews */}
        <div className="card p-5">
          <h2 className="font-heading font-semibold text-base mb-4">Recent Reviews</h2>
          {!data?.recent_reviews?.length ? (
            <p className="text-slate-400 text-sm text-center py-4">No reviews yet</p>
          ) : (
            <div className="space-y-3">
              {data.recent_reviews.map((r) => (
                <div key={r.id} className="p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-text truncate">{r.user_name || 'User'}</span>
                    <StarRating rating={r.rating} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500 truncate">{r.product_name}</p>
                  {r.comment && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
