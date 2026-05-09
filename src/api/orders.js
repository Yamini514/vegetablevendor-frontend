import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from './axios'
import toast from 'react-hot-toast'

export const useOrders = (params = {}) =>
  useQuery({
    queryKey: ['orders', params],
    queryFn: () => api.get('/orders', { params }).then((r) => r.data),
  })

export const useOrder = (id) =>
  useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get(`/orders/${id}`).then((r) => r.data.data),
    enabled: !!id,
  })

export const usePlaceOrder = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload) =>
      api.post('/orders', { data: payload }).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      qc.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Order placed successfully!')
    },
    onError: (err) => {
      toast.error(err.response?.data?.data || 'Failed to place order')
    },
  })
}

export const useAdminOrders = (params = {}) =>
  useQuery({
    queryKey: ['admin-orders', params],
    queryFn: () => api.get('/admin/orders', { params }).then((r) => r.data),
  })

export const useCancelOrder = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) =>
      api.put(`/orders/${id}/cancel`).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      qc.invalidateQueries({ queryKey: ['order'] })
      toast.success('Order cancelled successfully')
    },
    onError: (err) => {
      toast.error(err.response?.data?.data || 'Failed to cancel order')
    },
  })
}

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) =>
      api.put(`/admin/orders/${id}`, { data: { status } }).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] })
      toast.success('Order status updated')
    },
    onError: (err) => {
      toast.error(err.response?.data?.data || 'Failed to update status')
    },
  })
}
