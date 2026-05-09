import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tag, Plus, Search, X, Copy, ToggleLeft, ToggleRight, Trash2, Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'

const MOCK_COUPONS = [
  { id: 1, code: 'FRESH20',    type: 'percent',  value: 20, minOrder: 200,  uses: 48,  maxUses: 100, active: true,  expiry: '2025-06-30', desc: 'Welcome 20% off' },
  { id: 2, code: 'FLAT50',     type: 'flat',     value: 50, minOrder: 300,  uses: 23,  maxUses: 50,  active: true,  expiry: '2025-05-31', desc: 'Flat ₹50 off on orders ₹300+' },
  { id: 3, code: 'VIP10',      type: 'percent',  value: 10, minOrder: 500,  uses: 12,  maxUses: 200, active: true,  expiry: '2025-12-31', desc: 'VIP customer 10% off' },
  { id: 4, code: 'SUMMER25',   type: 'percent',  value: 25, minOrder: 400,  uses: 75,  maxUses: 75,  active: false, expiry: '2025-04-30', desc: 'Summer sale — expired' },
  { id: 5, code: 'NEWUSER',    type: 'flat',     value: 30, minOrder: 150,  uses: 5,   maxUses: 500, active: true,  expiry: '2025-12-31', desc: 'New user first order' },
  { id: 6, code: 'BULK100',    type: 'flat',     value: 100,minOrder: 800,  uses: 8,   maxUses: 30,  active: true,  expiry: '2025-07-31', desc: 'Bulk order ₹100 off' },
]

function CouponModal({ onClose, onSave }) {
  const [form, setForm] = useState({ code: '', type: 'percent', value: '', minOrder: '', maxUses: '', expiry: '', desc: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = () => {
    if (!form.code || !form.value || !form.minOrder) { toast.error('Fill required fields'); return }
    onSave(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-card-lg w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-heading font-semibold text-slate-800">Create Coupon</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 block">Coupon Code *</label>
            <input value={form.code} onChange={set('code')} placeholder="e.g. FRESH20" className="input-field uppercase" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 block">Type</label>
              <select value={form.type} onChange={set('type')} className="input-field">
                <option value="percent">Percentage (%)</option>
                <option value="flat">Flat (₹)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 block">Value *</label>
              <input type="number" value={form.value} onChange={set('value')} placeholder={form.type === 'percent' ? '20' : '50'} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 block">Min Order (₹) *</label>
              <input type="number" value={form.minOrder} onChange={set('minOrder')} placeholder="200" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 block">Max Uses</label>
              <input type="number" value={form.maxUses} onChange={set('maxUses')} placeholder="100" className="input-field" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 block">Expiry Date</label>
            <input type="date" value={form.expiry} onChange={set('expiry')} className="input-field" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 block">Description</label>
            <input value={form.desc} onChange={set('desc')} placeholder="Internal note" className="input-field" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={save} className="btn-primary">Create Coupon</button>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState(MOCK_COUPONS)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const toggle = (id) => setCoupons((cs) => cs.map((c) => c.id === id ? { ...c, active: !c.active } : c))
  const remove = (id) => { setCoupons((cs) => cs.filter((c) => c.id !== id)); toast.success('Coupon deleted') }
  const copy = (code) => { navigator.clipboard?.writeText(code); toast.success(`Copied: ${code}`) }
  const addCoupon = (form) => {
    setCoupons((cs) => [...cs, { ...form, id: Date.now(), uses: 0, active: true, value: +form.value, minOrder: +form.minOrder, maxUses: +form.maxUses || 999 }])
    toast.success('Coupon created!')
  }

  const filtered = coupons.filter((c) =>
    !search || c.code.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 max-w-screen-xl">
      {showModal && <CouponModal onClose={() => setShowModal(false)} onSave={addCoupon} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Coupons</h1>
          <p className="page-subtitle">{coupons.filter((c) => c.active).length} active coupons</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} />
          Create Coupon
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Coupons',  value: coupons.length },
          { label: 'Active',         value: coupons.filter((c) => c.active).length },
          { label: 'Inactive',       value: coupons.filter((c) => !c.active).length },
          { label: 'Total Redemptions', value: coupons.reduce((s, c) => s + c.uses, 0) },
        ].map(({ label, value }) => (
          <div key={label} className="stat-card text-center">
            <p className="text-2xl font-bold font-heading text-slate-800">{value}</p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search coupons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-9"
        />
        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><X size={14} /></button>}
      </div>

      {/* Coupon cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c) => {
          const usePct = Math.min(Math.round((c.uses / c.maxUses) * 100), 100)
          const expired = new Date(c.expiry) < new Date()

          return (
            <div key={c.id} className={`card-hover p-5 ${!c.active ? 'opacity-60' : ''}`}>
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-heading font-bold text-lg text-slate-800 tracking-wider">{c.code}</span>
                    <button onClick={() => copy(c.code)} className="p-1 rounded-lg text-slate-400 hover:text-primary hover:bg-primary-50 transition-colors" title="Copy code">
                      <Copy size={13} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">{c.desc}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggle(c.id)} className={`p-1.5 rounded-lg transition-colors ${c.active ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`}>
                    {c.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  </button>
                  <button onClick={() => remove(c.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Value badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`badge text-sm font-bold px-3 py-1 ${c.type === 'percent' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                  {c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                </span>
                <span className="text-xs text-slate-400">Min ₹{c.minOrder}</span>
                {expired && <span className="badge bg-red-50 text-red-500 ml-auto">Expired</span>}
                {!expired && c.active && <span className="badge bg-emerald-50 text-emerald-600 ml-auto">Active</span>}
              </div>

              {/* Usage bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Usage</span>
                  <span className="font-medium">{c.uses} / {c.maxUses}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${usePct >= 90 ? 'bg-red-400' : usePct >= 60 ? 'bg-orange-400' : 'bg-primary'}`}
                    style={{ width: `${usePct}%` }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 text-xs text-slate-400">
                <span>Expires {new Date(c.expiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className={`font-medium ${c.active ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {c.active ? '● Active' : '○ Inactive'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
