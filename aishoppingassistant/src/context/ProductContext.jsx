import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_PRODUCTS } from '../data/products';
import { useNotification } from './NotificationContext';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const { triggerMobilePush, showToast } = useNotification();

  // Master product list combining initial dataset and custom registered products from localStorage
  const [masterProducts, setMasterProducts] = useState(() => {
    try {
      const custom = localStorage.getItem('shopai_custom_products');
      if (custom) {
        const parsed = JSON.parse(custom);
        // Merge without duplicates
        const initialIds = new Set(parsed.map(p => p.id));
        const nonDuplicateInitial = INITIAL_PRODUCTS.filter(p => !initialIds.has(p.id));
        return [...parsed, ...nonDuplicateInitial];
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [products, setProducts] = useState(masterProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(20000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Sync master products to localStorage
  useEffect(() => {
    const customOnly = masterProducts.filter(p => p.isCustomProduct || p.id > 12);
    localStorage.setItem('shopai_custom_products', JSON.stringify(customOnly));
  }, [masterProducts]);

  // Filter & Search Logic
  const filterAndSortProducts = useCallback(() => {
    setLoading(true);
    let items = [...masterProducts];

    if (selectedCategory && selectedCategory !== 'all') {
      items = items.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (priceRange) {
      items = items.filter((p) => p.price <= Number(priceRange));
    }

    if (minRating > 0) {
      items = items.filter((p) => p.rating >= Number(minRating));
    }

    if (inStockOnly) {
      items = items.filter((p) => p.inStock);
    }

    // Sorting
    if (sortBy === 'price-low') {
      items.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      items.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      items.sort((a, b) => b.id - a.id);
    }

    setProducts(items);
    setLoading(false);
  }, [masterProducts, selectedCategory, searchQuery, priceRange, minRating, sortBy, inStockOnly]);

  useEffect(() => {
    filterAndSortProducts();
  }, [filterAndSortProducts]);

  // Admin function: Register / Add New Product
  const registerProduct = (productData) => {
    const newId = Date.now();
    const newProduct = {
      id: newId,
      name: productData.name,
      category: productData.category || 'Fashion',
      price: Number(productData.price) || 999,
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : Number(productData.price) * 1.3,
      rating: 4.8,
      reviewsCount: 1,
      badge: productData.badge || 'New Arrival',
      inStock: true,
      stockCount: Number(productData.stockCount) || 25,
      image: productData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      gallery: [
        productData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
      ],
      description: productData.description || 'Newly added exclusive atelier piece.',
      features: productData.features || ['Handcrafted quality', 'Verified materials', 'Atelier warranty'],
      specs: productData.specs || { 'Origin': 'Atelier Studio', 'Condition': 'Brand New' },
      reviews: [
        { id: Date.now() + 1, user: 'Atelier Curators', rating: 5, date: 'Today', comment: 'Newly verified seller addition to our catalog.' }
      ],
      isCustomProduct: true
    };

    setMasterProducts((prev) => [newProduct, ...prev]);

    // Trigger Swiggy/Zomato/Amazon Style Phone Push Notification
    triggerMobilePush({
      title: `✨ New Piece: ${newProduct.name}`,
      message: `Now live in ${newProduct.category}! Check price at ₹${newProduct.price}. Customers can now buy it!`,
      type: 'product',
      link: `/product/${newProduct.id}`,
      badgeText: 'Seller Drop'
    });

    showToast(`Piece "${newProduct.name}" registered and live in store! 🚀`, 'success');
    return newProduct;
  };

  // Admin function: Update existing product
  const updateProduct = (id, updatedFields) => {
    setMasterProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    showToast('Product details updated in catalog.', 'success');
  };

  // Admin function: Delete product
  const deleteProduct = (id) => {
    setMasterProducts((prev) => prev.filter((item) => item.id !== id));
    showToast('Product removed from catalog.', 'info');
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange(20000);
    setMinRating(0);
    setSortBy('featured');
    setInStockOnly(false);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        masterProducts,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        priceRange,
        setPriceRange,
        minRating,
        setMinRating,
        sortBy,
        setSortBy,
        inStockOnly,
        setInStockOnly,
        resetFilters,
        registerProduct,
        updateProduct,
        deleteProduct,
        reloadProducts: filterAndSortProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
