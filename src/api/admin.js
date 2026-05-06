import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from './axios'
import toast from 'react-hot-toast'

export const useDashboard = () =>
  useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/admin/dashboard').then((r) => r.data),
  })

export const useCreateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) =>
      api.post('/admin/products', { data }).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product created!')
    },
    onError: (err) => {
      toast.error(err.response?.data?.data || 'Failed to create product')
    },
  })
}

export const useUpdateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) =>
      api.put(`/admin/products/${id}`, { data }).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product updated!')
    },
    onError: (err) => {
      toast.error(err.response?.data?.data || 'Failed to update product')
    },
  })
}

export const useDeleteProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) =>
      api.delete(`/admin/products/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product deleted')
    },
    onError: (err) => {
      toast.error(err.response?.data?.data || 'Failed to delete product')
    },
  })
}

export const useCreateCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) =>
      api.post('/admin/categories', { data }).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] })
      qc.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category created!')
    },
    onError: (err) => {
      toast.error(err.response?.data?.data || 'Failed to create category')
    },
  })
}

export const useUpdateCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) =>
      api.put(`/admin/categories/${id}`, { data }).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] })
      qc.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category updated!')
    },
    onError: (err) => {
      toast.error(err.response?.data?.data || 'Failed to update category')
    },
  })
}

export const useDeleteCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) =>
      api.delete(`/admin/categories/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] })
      qc.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category deleted')
    },
    onError: (err) => {
      toast.error(err.response?.data?.data || 'Failed to delete category')
    },
  })
}

export const useContactMessages = (params = {}) =>
  useQuery({
    queryKey: ['contact-messages', params],
    queryFn: () => api.get('/admin/contact-messages', { params }).then((r) => r.data),
  })

export const useMarkContactMessageRead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.put(`/admin/contact-messages/${id}`, {}).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contact-messages'] }),
  })
}

export const useDeleteContactMessage = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/admin/contact-messages/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contact-messages'] })
      toast.success('Message deleted')
    },
    onError: (err) => {
      toast.error(err.response?.data?.data || 'Failed to delete message')
    },
  })
}
