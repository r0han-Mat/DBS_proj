import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Inject X-User-ID on every request if set
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('activeUserId');
  if (userId) {
    config.headers['X-User-ID'] = userId;
  }
  return config;
});

// ─── Products ────────────────────────────────────────────────
export const getProducts = () => api.get('/products').then((r) => r.data);

export const searchProducts = (keyword) =>
  api.get('/products/search', { params: { keyword } }).then((r) => r.data);

export const createProduct = (data) =>
  api.post('/products', data).then((r) => r.data);

export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data).then((r) => r.data);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`).then((r) => r.data);

// ─── Users ───────────────────────────────────────────────────
export const getUsers = () => api.get('/users').then((r) => r.data);

export const getUser = (id) => api.get(`/users/${id}`).then((r) => r.data);

export const createUser = (data) =>
  api.post('/users', data).then((r) => r.data);

export const updateUser = (id, data) =>
  api.put(`/users/${id}`, data).then((r) => r.data);

// ─── Cart ────────────────────────────────────────────────────
export const getCart = (userId) =>
  api.get('/cart', { headers: { 'X-User-ID': userId } }).then((r) => r.data);

export const addToCart = (userId, data) =>
  api.post('/cart', data, { headers: { 'X-User-ID': userId } });

export const removeFromCart = (userId, productId) =>
  api.delete(`/cart/items/${productId}`, {
    headers: { 'X-User-ID': userId },
  });

// ─── Orders ──────────────────────────────────────────────────
export const createOrder = (userId) =>
  api.post('/orders', null, { headers: { 'X-User-ID': userId } }).then((r) => r.data);
