import api from './axios'

export const loginUser = (data) =>
  api.post('/login', { data }).then((r) => r.data)

export const registerUser = (data) =>
  api.post('/register', { data }).then((r) => r.data)

export const getUserInfo = () =>
  api.get('/me/info').then((r) => r.data.data)
