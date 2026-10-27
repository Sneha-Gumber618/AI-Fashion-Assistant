/**
 * API Service — Axios Instance
 * Handles all HTTP requests to the ShopAI Express backend.
 *
 * Features:
 * - JWT auto-attach on every request via request interceptor
 * - 401 Unauthorized auto-logout via response interceptor
 * - Graceful fallback to local data when server is unreachable
 */

import axios from 'axios';
import { INITIAL_PRODUCTS } from '../data/products';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// ─── Main API Instance (Products, Orders, etc.) ────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 6000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Auth API Instance (Register, Login, /me) ──────────────────────────────────
export const authApi = axios.create({
  baseURL: BASE_URL,
  timeout: 6000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor: Attach JWT Bearer Token ──────────────────────────────
const attachToken = (config) => {
  const token = localStorage.getItem('shopai_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(attachToken, (error) => Promise.reject(error));
authApi.interceptors.request.use(attachToken, (error) => Promise.reject(error));

// ─── Response Interceptor: Handle 401 Unauthorized ────────────────────────────
const handleUnauthorized = (error) => {
  if (error.response?.status === 401) {
    // Token expired or invalid — clear auth state and redirect to login
    localStorage.removeItem('shopai_auth_token');
    localStorage.removeItem('shopai_user');
    // Dispatch a custom event so AuthContext can react
    window.dispatchEvent(new CustomEvent('shopai:unauthorized'));
  }
  return Promise.reject(error);
};

api.interceptors.response.use((res) => res, handleUnauthorized);
authApi.interceptors.response.use((res) => res, handleUnauthorized);

// ─── Auth API Functions ────────────────────────────────────────────────────────

/**
 * Register a new user via Express API (bcrypt + JWT)
 */
export async function registerUserAPI({ name, email, password }) {
  const response = await authApi.post('/auth/register', { name, email, password });
  return response.data; // { success, token, user, message }
}

/**
 * Login via Express API (bcrypt compare + JWT)
 */
export async function loginUserAPI({ email, password }) {
  const response = await authApi.post('/auth/login', { email, password });
  return response.data; // { success, token, user, message }
}

/**
 * Get currently authenticated user profile from server
 * Requires: Bearer token in Authorization header (auto-attached by interceptor)
 */
export async function getMeAPI() {
  const response = await authApi.get('/auth/me');
  return response.data; // { success, user }
}

// ─── Upload API Function ───────────────────────────────────────────────────────

/**
 * Upload a product image via Multer endpoint
 * @param {File} file — The image File object from an <input type="file">
 * @param {Function} onProgress — Optional upload progress callback (0–100)
 */
export async function uploadProductImageAPI(file, onProgress) {
  const formData = new FormData();
  formData.append('productImage', file); // Must match Multer field name

  const response = await authApi.post('/upload/product-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return response.data; // { success, data: { filename, url, size, ... } }
}

/**
 * List all uploaded product images
 */
export async function listUploadedFilesAPI() {
  const response = await authApi.get('/upload/files');
  return response.data;
}

// ─── Products API Functions ────────────────────────────────────────────────────

/**
 * Fetch all products with filtering, search and sorting.
 * Falls back to local data if server is unreachable.
 */
export async function fetchProductsFromAPI(params = {}) {
  try {
    const response = await api.get('/products', { params });
    return response.data;
  } catch (err) {
    // Client-side fallback with a realistic 300ms network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    let items = [...INITIAL_PRODUCTS];

    if (params.category && params.category !== 'all') {
      items = items.filter(
        (p) => p.category.toLowerCase() === params.category.toLowerCase()
      );
    }
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (params.minPrice) items = items.filter((p) => p.price >= Number(params.minPrice));
    if (params.maxPrice) items = items.filter((p) => p.price <= Number(params.maxPrice));
    if (params.minRating) items = items.filter((p) => p.rating >= Number(params.minRating));
    if (params.inStockOnly) items = items.filter((p) => p.inStock);

    if (params.sort === 'price-low') items.sort((a, b) => a.price - b.price);
    else if (params.sort === 'price-high') items.sort((a, b) => b.price - a.price);
    else if (params.sort === 'rating') items.sort((a, b) => b.rating - a.rating);
    else if (params.sort === 'newest') items.sort((a, b) => b.id - a.id);

    return { success: true, count: items.length, data: items, source: 'client_store' };
  }
}

/**
 * Fetch a single product by ID.
 */
export async function fetchProductByIdFromAPI(id) {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (err) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    let product = INITIAL_PRODUCTS.find((p) => p.id === Number(id));
    if (!product) {
      try {
        const custom = JSON.parse(localStorage.getItem('shopai_custom_products') || '[]');
        product = custom.find((p) => p.id === Number(id));
      } catch (e) { /* ignore */ }
    }
    if (!product) throw new Error('Product not found');
    return { success: true, data: product, source: 'client_store' };
  }
}

export default api;
