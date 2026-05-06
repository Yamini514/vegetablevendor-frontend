import { motion } from 'framer-motion'
import { useOrders } from '../api/orders'
import OrderCard from '../components/orders/OrderCard'
import { OrderCardSkeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'

export default function OrdersPage() {
  const { data, isLoading } = useOrders()
  const orders = data?.data || []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 py-8"
    >
      <h1 className="font-heading font-bold text-2xl text-text mb-6">My Orders</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <OrderCardSkeleton key={i} />)}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon="📦"
          message="No orders yet"
          subMessage="Place your first order and track it here."
          action={{ to: '/shop', label: 'Start Shopping' }}
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </motion.div>
  )
}
