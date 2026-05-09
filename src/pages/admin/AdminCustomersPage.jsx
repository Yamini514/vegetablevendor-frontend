import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Users, X, ShoppingBag, TrendingUp, Star, Phone, Mail, MapPin } from 'lucide-react'

const MOCK_CUSTOMERS = [
  { id: 1, name: 'Priya Sharma',   email: 'priya@gmail.com',   phone: '9876543210', city: 'Hyderabad', orders: 14, spent: 3820, rating: 4.8, lastOrder: '2025-05-05', status: 'active' },
  { id: 2, name: 'Rahul Kumar',    email: 'rahul@gmail.com',   phone: '9123456789', city: 'Mumbai',    orders: 8,  spent: 1560, rating: 4.2, lastOrder: '2025-05-04', status: 'active' },
  { id: 3, name: 'Anita Reddy',    email: 'anita@gmail.com',   phone: '9988776655', city: 'Hyderabad', orders: 22, spent: 5940, rating: 4.9, lastOrder: '2025-05-06', status: 'active' },
  { id: 4, name: 'Suresh Babu',    email: 'suresh@gmail.com',  phone: '9444332211', city: 'Bangalore', orders: 3,  spent: 640,  rating: 3.5, lastOrder: '2025-04-20', status: 'inactive' },
  { id: 5, name: 'Lakshmi Devi',   email: 'lakshmi@gmail.com', phone: '9876001122', city: 'Chennai',   orders: 18, spent: 4200, rating: 4.6, lastOrder: '2025-05-03', status: 'active' },
  { id: 6, name: 'Mohan Rao',      email: 'mohan@gmail.com',   phone: '9900112233', city: 'Hyderabad', orders: 6,  spent: 1100, rating: 4.0, lastOrder: '2025-04-28', status: 'active' },
  { id: 7, name: 'Kavitha Singh',  email: 'kavitha@gmail.com', phone: '9123001122', city: 'Delhi',     orders: 11, spent: 2700, rating: 4.5, lastOrder: '2025-05-02', status: 'active' },
  { id: 8, name: 'Vijay Menon',    email: 'vijay@gmail.com',   phone: '9912345678', city: 'Hyderabad', orders: 1,  spent: 210,  rating: 3.8, lastOrder: '2025-03-15', status: 'inactive' },
]

function CustomerRow({ c }) {
  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {c.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-700">{c.name}</p>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Mail size={10} />
              {c.email}
            </div>
          </div>
        </div>
      </td>
      <td>
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <Phone size={12} className="text-slate-300" />
          {c.phone}
        </div>
      </td>
      <td>
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <MapPin size={12} className="text-slate-300" />
          {c.city}
        </div>
      </td>
      <td>
        <span className="font-semibold text-slate-700">{c.orders}</span>
        <span className="text-slate-400 text-xs ml-1">orders</span>
      </td>
      <td>
        <span className="font-semibold text-primary">₹{c.spent.toLocaleString()}</span>
      </td>
      <td>
        <div className="flex items-center gap-1 text-xs">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="font-medium text-slate-700">{c.rating}</span>
        </div>
      </td>
      <td>
        <span className="text-xs text-slate-400">{new Date(c.lastOrder).toLocaleDateString()}</span>
      </td>
      <td>
        <span className={`badge ${c.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
          {c.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      </td>
    </tr>
  )
}

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = MOCK_CUSTOMERS.filter((c) => {
    const matchSearch = !search || `${c.name} ${c.email} ${c.phone} ${c.city}`.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || c.status === filter || (filter === 'high_value' && c.spent >= 3000)
    return matchSearch && matchFilter
  })

  const activeCount = MOCK_CUSTOMERS.filter((c) => c.status === 'active').length
  const totalSpent  = MOCK_CUSTOMERS.reduce((s, c) => s + c.spent, 0)
  const avgOrders   = (MOCK_CUSTOMERS.reduce((s, c) => s + c.orders, 0) / MOCK_CUSTOMERS.length).toFixed(1)

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 max-w-screen-2xl">
      <div>
        <h1 className="page-title">Customers</h1>
        <p className="page-subtitle">{MOCK_CUSTOMERS.length} registered customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: MOCK_CUSTOMERS.length, icon: Users, color: 'bg-blue-500', ring: 'ring-blue-100' },
          { label: 'Active Customers', value: activeCount, icon: TrendingUp, color: 'bg-emerald-500', ring: 'ring-emerald-100' },
          { label: 'Total Revenue', value: `₹${totalSpent.toLocaleString()}`, icon: ShoppingBag, color: 'bg-primary', ring: 'ring-primary-100' },
          { label: 'Avg Orders / Customer', value: avgOrders, icon: Star, color: 'bg-yellow-500', ring: 'ring-yellow-100' },
        ].map(({ label, value, icon: Icon, color, ring }) => (
          <div key={label} className="stat-card flex items-center gap-4">
            <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center shrink-0 ring-4 ${ring}`}>
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xl font-bold font-heading text-slate-800">{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="card p-1 flex gap-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'active', label: 'Active' },
            { key: 'inactive', label: 'Inactive' },
            { key: 'high_value', label: 'High Value' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`filter-tab ${filter === key ? 'filter-tab-active' : 'filter-tab-inactive'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>City</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Rating</th>
                <th>Last Order</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Users size={36} className="text-slate-200 mx-auto mb-2" />
                    <p className="text-slate-400">No customers found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => <CustomerRow key={c.id} c={c} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
