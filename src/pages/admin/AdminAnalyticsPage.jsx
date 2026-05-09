import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

const COLORS = ['#16A34A', '#F97316', '#3B82F6', '#8B5CF6', '#EF4444', '#14B8A6']

const revenueData = [
  { month: 'Jan', revenue: 42000, orders: 180, customers: 95 },
  { month: 'Feb', revenue: 38000, orders: 162, customers: 88 },
  { month: 'Mar', revenue: 55000, orders: 220, customers: 114 },
  { month: 'Apr', revenue: 48000, orders: 198, customers: 102 },
  { month: 'May', revenue: 63000, orders: 248, customers: 130 },
  { month: 'Jun', revenue: 71000, orders: 285, customers: 148 },
]

const weeklyOrders = [
  { day: 'Mon', online: 28, cod: 12 },
  { day: 'Tue', online: 22, cod: 9 },
  { day: 'Wed', online: 35, cod: 15 },
  { day: 'Thu', online: 30, cod: 11 },
  { day: 'Fri', online: 40, cod: 18 },
  { day: 'Sat', online: 52, cod: 24 },
  { day: 'Sun', online: 38, cod: 16 },
]

const topProducts = [
  { name: 'Tomatoes',  sales: 680, revenue: 3400 },
  { name: 'Onions',    sales: 560, revenue: 2240 },
  { name: 'Potatoes',  sales: 420, revenue: 1890 },
  { name: 'Carrots',   sales: 360, revenue: 2520 },
  { name: 'Spinach',   sales: 300, revenue: 1800 },
  { name: 'Brinjal',   sales: 240, revenue: 1440 },
]

const categoryData = [
  { name: 'Vegetables', value: 58 },
  { name: 'Leafy Greens', value: 20 },
  { name: 'Fruits', value: 14 },
  { name: 'Herbs', value: 8 },
]

const retentionData = [
  { month: 'Jan', new: 45, returning: 50 },
  { month: 'Feb', new: 38, returning: 50 },
  { month: 'Mar', new: 60, returning: 54 },
  { month: 'Apr', new: 48, returning: 54 },
  { month: 'May', new: 68, returning: 62 },
  { month: 'Jun', new: 78, returning: 70 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-card-lg px-3 py-2.5 text-xs">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {['revenue'].includes(p.name) ? `₹${p.value.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const PERIODS = ['7 days', '30 days', '3 months', '6 months', '1 year']

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState('30 days')

  const kpis = [
    { label: 'Total Revenue',    value: '₹3,17,000', trend: 14, icon: DollarSign, color: 'green' },
    { label: 'Total Orders',     value: '1,293',     trend: 9,  icon: ShoppingCart, color: 'blue' },
    { label: 'New Customers',    value: '337',       trend: 22, icon: Users, color: 'purple' },
    { label: 'Avg Order Value',  value: '₹245',      trend: -4, icon: Package, color: 'orange' },
  ]

  const colorMap = {
    green: 'bg-emerald-500 ring-emerald-100',
    blue: 'bg-blue-500 ring-blue-100',
    purple: 'bg-purple-500 ring-purple-100',
    orange: 'bg-orange-500 ring-orange-100',
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 max-w-screen-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Business performance overview</p>
        </div>
        <div className="card p-1 flex gap-1 flex-wrap">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`filter-tab text-xs ${period === p ? 'filter-tab-active' : 'filter-tab-inactive'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, trend, icon: Icon, color }) => {
          const [iconColor, ringColor] = colorMap[color].split(' ')
          return (
            <div key={label} className="stat-card">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-2xl ${iconColor} flex items-center justify-center ring-4 ${ringColor}`}>
                  <Icon size={20} className="text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                  trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                }`}>
                  {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(trend)}%
                </div>
              </div>
              <p className="text-2xl font-bold font-heading text-slate-800">{value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{label}</p>
            </div>
          )
        })}
      </div>

      {/* Revenue trend */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-heading font-semibold text-slate-800">Revenue Trend</h2>
            <p className="text-xs text-slate-400 mt-0.5">Monthly revenue and orders</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" name="revenue" stroke="#16A34A" strokeWidth={2.5} fill="url(#revGrad)" dot={{ r: 3, fill: '#16A34A', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Mid row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Weekly orders by payment */}
        <div className="card p-5">
          <h2 className="font-heading font-semibold text-slate-800 mb-1">Orders by Payment Type</h2>
          <p className="text-xs text-slate-400 mb-5">This week — online vs COD</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyOrders} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="online" name="online" fill="#16A34A" radius={[4, 4, 0, 0]} stackId="a" maxBarSize={32} />
              <Bar dataKey="cod"    name="cod"    fill="#F97316" radius={[4, 4, 0, 0]} stackId="a" maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Customer retention */}
        <div className="card p-5">
          <h2 className="font-heading font-semibold text-slate-800 mb-1">Customer Retention</h2>
          <p className="text-xs text-slate-400 mb-5">New vs returning customers</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={retentionData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="new"       name="New"       stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="returning" name="Returning"  stroke="#16A34A" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Top products */}
        <div className="lg:col-span-2 card p-5">
          <h2 className="font-heading font-semibold text-slate-800 mb-5">Top Performing Products</h2>
          <div className="space-y-3">
            {topProducts.map((p, i) => {
              const pct = Math.round((p.sales / topProducts[0].sales) * 100)
              return (
                <div key={p.name} className="flex items-center gap-4">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: COLORS[i] }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700">{p.name}</span>
                      <span className="text-slate-500">{p.sales} sold · <span className="text-primary font-semibold">₹{p.revenue.toLocaleString()}</span></span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: COLORS[i] }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="card p-5">
          <h2 className="font-heading font-semibold text-slate-800 mb-5">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} dataKey="value" paddingAngle={3}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {categoryData.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i] }} />
                  <span className="text-slate-600">{c.name}</span>
                </div>
                <span className="font-semibold text-slate-700">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
