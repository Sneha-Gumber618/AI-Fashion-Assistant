import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { formatPrice, formatDate } from '../utils/formatters';
import { uploadProductImageAPI, listUploadedFilesAPI } from '../services/api';
import {
  PackagePlus,
  Boxes,
  TrendingUp,
  DollarSign,
  Truck,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Eye,
  Plus,
  Minus,
  Upload,
  ImagePlus,
  FileImage,
  X,
  CloudUpload,
  Copy
} from 'lucide-react';

export default function Admin() {
  const { products, masterProducts, registerProduct, updateProduct, deleteProduct } = useProducts();
  const { orders, updateOrderStatus, viewRole, toggleViewRole } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  // Controlled New Product Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Fashion',
    price: '',
    originalPrice: '',
    stockCount: '30',
    badge: 'New Arrival',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
    description: '',
    featuresText: 'Premium craftsmanship, Modern minimalist silhouette, High-durability materials'
  });

  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'inventory' | 'orders' | 'upload'

  // ── Multer Upload State ───────────────────────────────────────────────────
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle'|'uploading'|'success'|'error'
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;
    // Client-side regex validation — mirrors server multer.config.js
    const allowedMime = /^image\/(jpeg|jpg|png|webp|gif)$/;
    if (!allowedMime.test(file.type)) {
      showToast('Only JPEG, PNG, WebP, or GIF images are allowed.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('File too large. Maximum size is 5MB.', 'error');
      return;
    }
    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
    setUploadStatus('idle');
    setUploadResult(null);
    setUploadProgress(0);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  }, []);

  const handleUpload = async () => {
    if (!uploadFile) {
      showToast('Please select an image first.', 'warning');
      return;
    }
    setUploadStatus('uploading');
    setUploadProgress(0);
    try {
      const data = await uploadProductImageAPI(uploadFile, (pct) => setUploadProgress(pct));
      if (data.success) {
        setUploadStatus('success');
        setUploadResult(data.data);
        setUploadedFiles(prev => [data.data, ...prev]);
        showToast('Product image uploaded successfully! ✨', 'success');
      }
    } catch (err) {
      setUploadStatus('error');
      const msg = err.response?.data?.message || 'Upload failed. Make sure the server is running.';
      showToast(msg, 'error');
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(`http://localhost:5000${url}`);
    showToast('Image URL copied to clipboard!', 'success');
  };

  const clearUpload = () => {
    setUploadFile(null);
    setUploadPreview(null);
    setUploadStatus('idle');
    setUploadResult(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Calculations for Admin Analytics Dashboard
  const totalRevenue = orders.reduce((acc, ord) => acc + ord.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = masterProducts.length;
  const customProductsCount = masterProducts.filter(p => p.isCustomProduct || p.id > 12).length;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePresetImage = (url) => {
    setFormData(prev => ({ ...prev, image: url }));
    showToast('Sample high-res image loaded into form!', 'info');
  };

  const handleRegisterProduct = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price || !formData.description.trim()) {
      showToast('Please fill in product title, price and description.', 'warning');
      return;
    }

    const featuresArray = formData.featuresText
      .split(',')
      .map(f => f.trim())
      .filter(Boolean);

    const created = registerProduct({
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price) * 1.3,
      stockCount: Number(formData.stockCount) || 20,
      badge: formData.badge,
      image: formData.image,
      description: formData.description,
      features: featuresArray.length > 0 ? featuresArray : ['Handcrafted craftsmanship', 'Atelier warranty']
    });

    // Reset Form
    setFormData({
      name: '',
      category: 'Fashion',
      price: '',
      originalPrice: '',
      stockCount: '30',
      badge: 'New Arrival',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
      description: '',
      featuresText: 'Premium craftsmanship, Modern minimalist silhouette, High-durability materials'
    });

    setActiveTab('inventory');
  };

  const PRESET_IMAGES = [
    { label: '🧥 Fashion Jacket', url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80' },
    { label: '🧴 Skincare Serum', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80' },
    { label: '👟 Minimalist Sneakers', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80' },
    { label: '🎧 Audio Wireless', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' },
    { label: '☕ Espresso Set', url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Top Banner & Mode Switcher */}
      <div className="bg-[#2C1D13] text-[#FAF7F2] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-mocha-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blush-500/20 text-blush-300 text-[10px] font-mono uppercase tracking-[0.2em] font-bold">
            <Sparkles className="w-3 h-3" />
            Seller & Administrator Portal
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-white">
            Atelier Merchant Management
          </h1>
          <p className="text-xs text-mocha-300 font-sans max-w-xl">
            Register new products for sale, update catalog stock, manage customer order fulfillment, and push real-time alerts.
          </p>
        </div>

        {/* View Mode Toggle Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button
            onClick={toggleViewRole}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#FAF7F2] text-mocha-950 hover:bg-blush-200 font-semibold text-xs uppercase tracking-wider transition-all shadow-md font-mono"
          >
            <span>Switch to {viewRole === 'admin' ? 'Customer Storefront' : 'Admin View'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-5 border border-mocha-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-mocha-400 font-bold block">Gross Sales</span>
            <span className="font-mono text-2xl font-bold text-mocha-950">{formatPrice(totalRevenue)}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-mocha-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blush-100 text-blush-700 flex items-center justify-center font-bold">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-mocha-400 font-bold block">Orders Placed</span>
            <span className="font-mono text-2xl font-bold text-mocha-950">{totalOrdersCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-mocha-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-mocha-100 text-mocha-800 flex items-center justify-center font-bold">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-mocha-400 font-bold block">Live Pieces</span>
            <span className="font-mono text-2xl font-bold text-mocha-950">{totalProductsCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-mocha-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F5DCD9] text-[#7F3E49] flex items-center justify-center font-bold">
            <PackagePlus className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-mocha-400 font-bold block">Seller Registered</span>
            <span className="font-mono text-2xl font-bold text-mocha-950">{customProductsCount} newly added</span>
          </div>
        </div>
      </div>

      {/* Tabs: Register Product vs. Inventory vs. Orders vs. Upload */}
      <div className="border-b border-mocha-200 flex flex-wrap gap-6 text-xs font-mono uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('register')}
          className={`pb-3.5 font-bold transition-all relative ${
            activeTab === 'register' ? 'text-mocha-950' : 'text-mocha-400 hover:text-mocha-700'
          }`}
        >
          ✦ Register & Sell New Product
          {activeTab === 'register' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mocha-950 rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3.5 font-bold transition-all relative ${
            activeTab === 'inventory' ? 'text-mocha-950' : 'text-mocha-400 hover:text-mocha-700'
          }`}
        >
          📦 Store Inventory ({masterProducts.length})
          {activeTab === 'inventory' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mocha-950 rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3.5 font-bold transition-all relative ${
            activeTab === 'orders' ? 'text-mocha-950' : 'text-mocha-400 hover:text-mocha-700'
          }`}
        >
          🛵 Order Fulfillment ({orders.length})
          {activeTab === 'orders' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mocha-950 rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`pb-3.5 font-bold transition-all relative ${
            activeTab === 'upload' ? 'text-mocha-950' : 'text-mocha-400 hover:text-mocha-700'
          }`}
        >
          🖼️ Image Upload (Multer)
          {activeTab === 'upload' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mocha-950 rounded-full"></span>
          )}
        </button>
      </div>

      {/* TAB 1: Register Product Form */}
      {activeTab === 'register' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form
            onSubmit={handleRegisterProduct}
            className="lg:col-span-8 bg-white rounded-3xl border border-mocha-200 p-6 sm:p-8 shadow-xs space-y-6"
          >
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blush-700 font-bold block mb-1">
                New Product Registration
              </span>
              <h2 className="font-serif text-2xl font-normal text-mocha-950">
                Publish a Product for Customers to Buy
              </h2>
              <p className="text-xs text-mocha-500 font-sans mt-0.5">
                Once submitted, this piece will immediately go live in the catalog and trigger a Zomato/Amazon style push alert.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-mono uppercase tracking-wider text-mocha-600 mb-1 font-bold">
                  Product Name / Title *
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Minimalist Cashmere Overshirt"
                  className="w-full p-3 rounded-2xl border border-mocha-200 focus:outline-none focus:border-blush-500 bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="block font-mono uppercase tracking-wider text-mocha-600 mb-1 font-bold">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-2xl border border-mocha-200 focus:outline-none focus:border-blush-500 bg-[#FAF7F2] font-mono"
                >
                  <option value="Fashion">Fashion & Lifestyle</option>
                  <option value="Skincare">Skincare & Beauty</option>
                  <option value="Electronics">Electronics & Tech</option>
                  <option value="Home">Home & Living</option>
                </select>
              </div>

              <div>
                <label className="block font-mono uppercase tracking-wider text-mocha-600 mb-1 font-bold">
                  Highlight Badge
                </label>
                <select
                  name="badge"
                  value={formData.badge}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-2xl border border-mocha-200 focus:outline-none focus:border-blush-500 bg-[#FAF7F2] font-mono"
                >
                  <option value="New Arrival">New Arrival</option>
                  <option value="Bestseller">Bestseller</option>
                  <option value="Exclusive Drop">Exclusive Drop</option>
                  <option value="Limited Edition">Limited Edition</option>
                  <option value="Staff Pick">Staff Pick</option>
                </select>
              </div>

              <div>
                <label className="block font-mono uppercase tracking-wider text-mocha-600 mb-1 font-bold">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g. 1499"
                  className="w-full p-3 rounded-2xl border border-mocha-200 focus:outline-none focus:border-blush-500 bg-[#FAF7F2] font-mono"
                />
              </div>

              <div>
                <label className="block font-mono uppercase tracking-wider text-mocha-600 mb-1 font-bold">
                  Original / Strikethrough Price (₹)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  placeholder="e.g. 2199"
                  className="w-full p-3 rounded-2xl border border-mocha-200 focus:outline-none focus:border-blush-500 bg-[#FAF7F2] font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-mono uppercase tracking-wider text-mocha-600 mb-1 font-bold">
                  Stock Units Available to Sell *
                </label>
                <input
                  type="number"
                  required
                  name="stockCount"
                  value={formData.stockCount}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-2xl border border-mocha-200 focus:outline-none focus:border-blush-500 bg-[#FAF7F2] font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-mono uppercase tracking-wider text-mocha-600 mb-1 font-bold">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full p-3 rounded-2xl border border-mocha-200 focus:outline-none focus:border-blush-500 bg-[#FAF7F2] font-mono text-xs"
                />

                {/* Preset image buttons */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-mocha-400">Quick Samples:</span>
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetImage(preset.url)}
                      className="px-2.5 py-1 rounded-full bg-mocha-100 hover:bg-blush-100 text-mocha-800 text-[10px] font-mono uppercase tracking-wider transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-mono uppercase tracking-wider text-mocha-600 mb-1 font-bold">
                  Product Description *
                </label>
                <textarea
                  rows="3"
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe fabric, finish, features, and styling advice..."
                  className="w-full p-3 rounded-2xl border border-mocha-200 focus:outline-none focus:border-blush-500 bg-[#FAF7F2]"
                ></textarea>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-mono uppercase tracking-wider text-mocha-600 mb-1 font-bold">
                  Key Feature Bullets (Separated by commas)
                </label>
                <input
                  type="text"
                  name="featuresText"
                  value={formData.featuresText}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-2xl border border-mocha-200 focus:outline-none focus:border-blush-500 bg-[#FAF7F2]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
            >
              <PackagePlus className="w-4 h-4 text-blush-200" />
              Register & Publish Product to Store
            </button>
          </form>

          {/* Live Preview Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-mocha-200 p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg text-mocha-950 pb-2 border-b border-mocha-100">
              Customer View Preview
            </h3>

            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-mocha-50 border border-mocha-200">
              <img
                src={formData.image}
                alt="Preview"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
                }}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-blush-100 text-blush-800 border border-blush-200">
                {formData.badge}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blush-700">
                {formData.category}
              </span>
              <h4 className="font-serif text-lg font-normal text-mocha-950">
                {formData.name || 'Sample Product Title'}
              </h4>
              <p className="text-xs text-mocha-600 line-clamp-2 mt-1">
                {formData.description || 'Product description will appear here as customers browse.'}
              </p>

              <div className="flex items-baseline gap-2 pt-3 mt-3 border-t border-mocha-100">
                <span className="font-bold font-mono text-base text-mocha-950">
                  {formatPrice(Number(formData.price) || 999)}
                </span>
                {formData.originalPrice && (
                  <span className="text-xs font-mono text-mocha-400 line-through">
                    {formatPrice(Number(formData.originalPrice))}
                  </span>
                )}
                <span className="text-[10px] font-mono text-emerald-700 font-bold ml-auto">
                  {formData.stockCount} in stock
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Manage Store Inventory */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-mocha-200 overflow-hidden shadow-xs">
          <div className="p-6 border-b border-mocha-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl text-mocha-950">
                Active Atelier Inventory ({masterProducts.length} Pieces)
              </h3>
              <p className="text-xs text-mocha-500 font-sans">
                Adjust stock quantities or delete obsolete items in real-time.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('register')}
              className="px-5 py-2.5 rounded-full bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Another Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-mocha-700">
              <thead className="bg-[#FAF7F2] text-[10px] font-mono uppercase tracking-wider text-mocha-500 border-b border-mocha-200">
                <tr>
                  <th className="p-4">Piece</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mocha-100">
                {masterProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-mocha-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                          }}
                          className="w-12 h-12 rounded-xl object-cover bg-mocha-100 shrink-0"
                        />
                        <div>
                          <p className="font-serif font-bold text-sm text-mocha-950">{p.name}</p>
                          <span className="text-[10px] font-mono text-blush-700 uppercase">{p.badge}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono">{p.category}</td>
                    <td className="p-4 font-mono font-bold text-mocha-950">{formatPrice(p.price)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateProduct(p.id, { stockCount: Math.max(0, (p.stockCount || 10) - 1) })}
                          className="p-1 rounded-lg border border-mocha-300 hover:bg-mocha-100"
                          title="Decrease stock"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold text-xs">{p.stockCount || 20}</span>
                        <button
                          onClick={() => updateProduct(p.id, { stockCount: (p.stockCount || 10) + 1 })}
                          className="p-1 rounded-lg border border-mocha-300 hover:bg-mocha-100"
                          title="Increase stock"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        to={`/product/${p.id}`}
                        className="inline-flex p-2 rounded-xl text-mocha-600 hover:text-blush-700 hover:bg-mocha-100"
                        title="View on storefront"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-2 rounded-xl text-mocha-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Manage Customer Order Fulfillment */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-mocha-200 overflow-hidden shadow-xs space-y-4">
          <div className="p-6 border-b border-mocha-100">
            <h3 className="font-serif text-2xl text-mocha-950">
              Customer Order Fulfillment & Live Tracking Updates
            </h3>
            <p className="text-xs text-mocha-500 font-sans mt-0.5">
              Change shipment status to notify customers with a Zomato/Swiggy smartphone push notification!
            </p>
          </div>

          <div className="p-6 space-y-6">
            {orders.length === 0 ? (
              <p className="text-xs text-mocha-400 text-center py-8">No customer orders placed yet.</p>
            ) : (
              orders.map((ord) => (
                <div key={ord.id} className="p-5 rounded-2xl border border-mocha-200 bg-[#FAF7F2] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-mocha-400 uppercase font-bold">Order ID</span>
                      <p className="font-mono font-bold text-sm text-mocha-950">{ord.id}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-mocha-400 uppercase font-bold">Placed At</span>
                      <p className="text-mocha-700">{formatDate(ord.createdAt)}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-mocha-400 uppercase font-bold">Customer</span>
                      <p className="text-mocha-900 font-bold">{ord.shippingAddress?.fullName || 'Client'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-mocha-400 uppercase font-bold">Amount</span>
                      <p className="font-mono font-bold text-mocha-950 text-sm">{formatPrice(ord.totalAmount)}</p>
                    </div>
                  </div>

                  {/* Shipment Milestone Buttons */}
                  <div className="pt-3 border-t border-mocha-200 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-mocha-600 font-bold">
                      Current Milestone: <strong className="text-blush-700">{ord.status || 'Confirmed'}</strong>
                    </span>

                    <div className="flex flex-wrap gap-1.5 text-xs font-mono uppercase tracking-wider">
                      {['Confirmed', 'Packed', 'In Transit', 'Out for Delivery', 'Delivered'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateOrderStatus(ord.id, status)}
                          className={`px-3 py-1 rounded-full transition-colors ${
                            ord.status === status
                              ? 'bg-mocha-900 text-[#FAF7F2] font-bold shadow-2xs'
                              : 'bg-white border border-mocha-300 text-mocha-700 hover:bg-blush-100 hover:text-blush-800'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Multer Product Image Upload */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Panel */}
          <div className="bg-white rounded-3xl border border-mocha-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blush-700 font-bold block mb-1">
                Multer File Upload
              </span>
              <h2 className="font-serif text-2xl font-normal text-mocha-950">
                Upload Product Image
              </h2>
              <p className="text-xs text-mocha-500 font-sans mt-0.5">
                Upload is handled by <strong>Multer</strong> on the Express server. Files are saved to <code className="bg-mocha-100 px-1 rounded text-[10px]">public/uploads/</code>. JWT auth is required.
              </p>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                isDragOver
                  ? 'border-blush-500 bg-blush-50'
                  : uploadFile
                  ? 'border-emerald-400 bg-emerald-50'
                  : 'border-mocha-300 hover:border-blush-400 hover:bg-blush-50/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />

              {uploadPreview ? (
                <>
                  <img
                    src={uploadPreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-xl shadow-md"
                  />
                  <div className="text-center">
                    <p className="text-xs font-mono font-bold text-mocha-800">{uploadFile?.name}</p>
                    <p className="text-[10px] text-mocha-400 font-mono">
                      {(uploadFile?.size / 1024).toFixed(1)} KB · {uploadFile?.type}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-mocha-100 flex items-center justify-center">
                    <CloudUpload className="w-8 h-8 text-mocha-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-mono font-bold text-mocha-700">Drag & drop or click to select</p>
                    <p className="text-[10px] text-mocha-400 font-mono mt-1">
                      JPEG · PNG · WebP · GIF · Max 5MB
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Progress Bar */}
            {uploadStatus === 'uploading' && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-mocha-500">
                  <span>Uploading to server...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-mocha-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 bg-gradient-to-r from-blush-500 to-mocha-700 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Success Result */}
            {uploadStatus === 'success' && uploadResult && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <p className="text-xs font-mono font-bold text-emerald-700">Upload Successful!</p>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-xl p-2 border border-emerald-200">
                  <code className="text-[10px] text-mocha-700 flex-1 truncate font-mono">
                    http://localhost:5000{uploadResult.url}
                  </code>
                  <button
                    onClick={() => handleCopyUrl(uploadResult.url)}
                    className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors"
                    title="Copy URL"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-mocha-400 font-mono">
                  Size: {(uploadResult.size / 1024).toFixed(1)} KB · Uploaded by: {uploadResult.uploadedBy}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleUpload}
                disabled={!uploadFile || uploadStatus === 'uploading'}
                className="flex-1 py-3.5 rounded-full bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadStatus === 'uploading' ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
                ) : (
                  <><Upload className="w-4 h-4" /> Upload to Server</>
                )}
              </button>
              {uploadFile && (
                <button
                  onClick={clearUpload}
                  className="px-4 py-3.5 rounded-full border border-mocha-300 hover:bg-mocha-100 text-mocha-600 transition-colors"
                  title="Clear"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Uploaded Files Gallery */}
          <div className="bg-white rounded-3xl border border-mocha-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blush-700 font-bold block mb-1">
                  Uploaded This Session
                </span>
                <h3 className="font-serif text-xl font-normal text-mocha-950">Image Gallery</h3>
              </div>
              <span className="text-[10px] font-mono bg-mocha-100 text-mocha-600 px-3 py-1 rounded-full uppercase font-bold">
                {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''}
              </span>
            </div>

            {uploadedFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-mocha-300">
                <FileImage className="w-12 h-12" />
                <p className="text-xs font-mono text-center">
                  No images uploaded yet.<br />Use the panel on the left to upload.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="rounded-2xl overflow-hidden border border-mocha-200 group relative">
                    <img
                      src={`http://localhost:5000${file.url}`}
                      alt={file.originalName}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-2 bg-white">
                      <p className="text-[10px] font-mono text-mocha-700 truncate font-bold">{file.originalName}</p>
                      <p className="text-[9px] font-mono text-mocha-400">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      onClick={() => handleCopyUrl(file.url)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/80 backdrop-blur-sm text-mocha-700 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                      title="Copy URL"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Tech explanation */}
            <div className="bg-mocha-50 rounded-2xl p-4 space-y-2 border border-mocha-100">
              <p className="text-[10px] font-mono uppercase tracking-wider text-mocha-500 font-bold">How Multer Works Here</p>
              <div className="space-y-1 text-[10px] font-mono text-mocha-600">
                <p>① React sends <code className="bg-mocha-200 px-1 rounded">multipart/form-data</code> via axios</p>
                <p>② JWT Bearer token auto-attached by Axios interceptor</p>
                <p>③ Express <code className="bg-mocha-200 px-1 rounded">verifyToken</code> middleware validates JWT</p>
                <p>④ Multer validates MIME type via <code className="bg-mocha-200 px-1 rounded">/^image\/(jpeg|png|webp)$/</code></p>
                <p>⑤ File saved to <code className="bg-mocha-200 px-1 rounded">public/uploads/</code> with unique timestamp name</p>
                <p>⑥ Server returns public URL for use in product listings</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
