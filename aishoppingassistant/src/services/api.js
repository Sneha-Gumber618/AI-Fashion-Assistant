import axios from 'axios';
import { INITIAL_PRODUCTS } from '../data/products';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 6000,
  headers: { 'Content-Type': 'application/json' },
});

export const authApi = axios.create({
  baseURL: BASE_URL,
  timeout: 6000,
  headers: { 'Content-Type': 'application/json' },
});

const attachToken = (config) => {
  const adminToken = localStorage.getItem('shopai_admin_token');
  const userToken = localStorage.getItem('shopai_auth_token');
  const token = adminToken || userToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(attachToken, (error) => Promise.reject(error));
authApi.interceptors.request.use(attachToken, (error) => Promise.reject(error));

const handleUnauthorized = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('shopai_auth_token');
    localStorage.removeItem('shopai_user');
    window.dispatchEvent(new CustomEvent('shopai:unauthorized'));
  }
  return Promise.reject(error);
};

api.interceptors.response.use((res) => res, handleUnauthorized);
authApi.interceptors.response.use((res) => res, handleUnauthorized);

export async function registerUserAPI({ name, email, password }) {
  const response = await authApi.post('/auth/register', { name, email, password });
  return response.data;
}

export async function loginUserAPI({ email, password }) {
  const response = await authApi.post('/auth/login', { email, password });
  return response.data;
}

export async function getMeAPI() {
  const response = await authApi.get('/auth/me');
  return response.data;
}

export async function uploadProductImageAPI(file, onProgress) {
  const formData = new FormData();
  formData.append('productImage', file);

  const response = await authApi.post('/upload/product-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return response.data;
}

export async function listUploadedFilesAPI() {
  const response = await authApi.get('/upload/files');
  return response.data;
}

export async function fetchProductsFromAPI(params = {}) {
  try {
    const response = await api.get('/products', { params });
    return response.data;
  } catch (err) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let items = [...INITIAL_PRODUCTS];

    if (params.category && params.category !== 'all') {
      items = items.filter((p) => p.category.toLowerCase() === params.category.toLowerCase());
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

export async function fetchProductByIdFromAPI(id) {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (err) {
    const product = INITIAL_PRODUCTS.find((item) => item.id === Number(id) || item.id === id);
    if (!product) {
      return { success: false, message: 'Product not found' };
    }
    return { success: true, data: product, source: 'client_store' };
  }
}

export async function createProductAPI(productPayload) {
  const response = await api.post('/products', productPayload);
  return response.data;
}

export async function updateProductAPI(id, productPayload) {
  const response = await api.put(`/products/${id}`, productPayload);
  return response.data;
}

export async function deleteProductAPI(id) {
  const response = await api.delete(`/products/${id}`);
  return response.data;
}

export async function fetchOrdersFromAPI() {
  const response = await api.get('/orders');
  return response.data;
}

export async function createOrderAPI(orderPayload) {
  const response = await api.post('/orders', orderPayload);
  return response.data;
}
