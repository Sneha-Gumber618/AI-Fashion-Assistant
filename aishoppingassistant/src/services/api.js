import axios from 'axios';
import { INITIAL_PRODUCTS } from '../data/products';

// Create Axios Instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request Interceptor: Log outgoing requests & simulate auth token headers
api.interceptors.request.use(
  (config) => {
    // console.log(`[Axios Request] ${config.method?.toUpperCase()} ${config.url}`);
    const token = localStorage.getItem('shopai_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('[Axios API Notice] Backend endpoint not reachable, switching seamlessly to local client dataset:', error.message);
    return Promise.reject(error);
  }
);

/**
 * Fetch all products with filtering, search and sorting
 */
export async function fetchProductsFromAPI(params = {}) {
  try {
    const response = await api.get('/products', { params });
    return response.data;
  } catch (err) {
    // Client-side fallback simulation with a realistic 300ms network delay
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

    if (params.minPrice) {
      items = items.filter((p) => p.price >= Number(params.minPrice));
    }

    if (params.maxPrice) {
      items = items.filter((p) => p.price <= Number(params.maxPrice));
    }

    if (params.minRating) {
      items = items.filter((p) => p.rating >= Number(params.minRating));
    }

    if (params.inStockOnly) {
      items = items.filter((p) => p.inStock);
    }

    // Sorting
    if (params.sort === 'price-low') {
      items.sort((a, b) => a.price - b.price);
    } else if (params.sort === 'price-high') {
      items.sort((a, b) => b.price - a.price);
    } else if (params.sort === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    } else if (params.sort === 'newest') {
      items.sort((a, b) => b.id - a.id);
    }

    return {
      success: true,
      count: items.length,
      data: items,
      source: 'client_store'
    };
  }
}

/**
 * Fetch a single product by ID
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
      } catch (e) {
        // ignore
      }
    }
    if (!product) {
      throw new Error('Product not found');
    }
    return {
      success: true,
      data: product,
      source: 'client_store'
    };
  }
}

export default api;
