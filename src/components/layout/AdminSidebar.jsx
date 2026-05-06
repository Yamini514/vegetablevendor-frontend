import { NavLink, Link } from 'react-router-dom'
import {
  HomeIcon,
  ShoppingBagIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  StarIcon,
  ArchiveBoxIcon,
  EnvelopeIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { to: '/admin',                   label: 'Dashboard',        icon: HomeIcon,                  end: true },
  { to: '/admin/products',          label: 'Products',         icon: ShoppingBagIcon },
  { to: '/admin/categories',        label: 'Categories',       icon: TagIcon },
  { to: '/admin/inventory',         label: 'Inventory',        icon: ArchiveBoxIcon },
  { to: '/admin/orders',            label: 'Orders',           icon: ClipboardDocumentListIcon },
  { to: '/admin/reviews',           label: 'Reviews',          icon: StarIcon },
  { to: '/admin/contact-messages',  label: 'Contact Messages', icon: EnvelopeIcon },
]

export default function AdminSidebar() {
  const logout = useAuthStore((s) => s.logout)
  const user   = useAuthStore((s) => s.user)

  return (
    <aside className="w-60 min-h-screen bg-text flex flex-col shrink-0">
      <div className="p-5 border-b border-slate-700">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <div>
            <p className="font-heading font-bold text-white text-sm">VegFresh</p>
            <p className="text-slate-400 text-xs">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Admin user info */}
      {user && (
        <div className="px-4 py-3 border-t border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <UserCircleIcon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user.full_name}</p>
              <p className="text-slate-400 text-xs truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-slate-700">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-colors mb-1"
        >
          Back to Store
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
