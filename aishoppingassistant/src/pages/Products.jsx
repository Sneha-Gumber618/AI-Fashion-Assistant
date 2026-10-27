import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/product/ProductCard';
import ProductFilter from '../components/product/ProductFilter';
import SkeletonCard from '../components/common/SkeletonCard';
import { LayoutGrid, List, SlidersHorizontal, Search, X, Sparkles } from 'lucide-react';

export default function Products() {
  const {
    products,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    minRating,
    sortBy,
    setSortBy,
    resetFilters
  } = useProducts();

  const [layout, setLayout] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    priceRange < 20000 ||
    minRating > 0 ||
    Boolean(searchQuery.trim());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Title & Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-mocha-200">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blush-700 font-bold block mb-1">
            Complete Lookbook
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-mocha-950 tracking-tight">
            Explore Atelier Catalog
          </h1>
        </div>

        {/* View Switcher & Filter Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-mocha-200 text-xs font-bold text-mocha-800 shadow-2xs hover:border-blush-300 uppercase tracking-wider font-mono"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blush-600" />
            Refine {hasActiveFilters && '•'}
          </button>

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-mocha-200 text-xs font-mono uppercase tracking-wider text-mocha-800 px-4 py-2.5 rounded-full focus:outline-none focus:border-blush-400 cursor-pointer shadow-2xs"
          >
            <option value="featured">Featured / Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Arrivals</option>
          </select>

          {/* Grid / List View Toggle */}
          <div className="hidden sm:flex items-center bg-white border border-mocha-200 rounded-full p-1 shadow-2xs">
            <button
              onClick={() => setLayout('grid')}
              className={`p-1.5 rounded-full transition-colors ${
                layout === 'grid' ? 'bg-blush-100 text-mocha-900 font-bold' : 'text-mocha-400 hover:text-mocha-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`p-1.5 rounded-full transition-colors ${
                layout === 'list' ? 'bg-blush-100 text-mocha-900 font-bold' : 'text-mocha-400 hover:text-mocha-800'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* DEDICATED BIG LIVE SEARCH BAR — ONLY ON PRODUCTS PAGE */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-mocha-200 shadow-sm hover:shadow-md transition-shadow space-y-3.5">
        <div className="relative flex items-center">
          <Search className="w-6 h-6 text-mocha-400 absolute left-4.5 pointer-events-none" />
          <input
            id="catalog-live-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type words here to live search catalog (e.g., linen blazer, headphones, sunscreen, sneakers)..."
            className="w-full bg-[#FAF7F2] hover:bg-[#F4ECE1]/60 focus:bg-white text-sm sm:text-base text-mocha-950 placeholder-mocha-400 pl-14 pr-12 py-4 rounded-2xl border-2 border-mocha-200/90 focus:border-blush-400 focus:outline-none focus:ring-4 focus:ring-blush-200/40 transition-all font-sans shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 p-2 rounded-full hover:bg-mocha-200 text-mocha-500 hover:text-mocha-900 transition-colors"
              title="Clear search query"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Live Reflection & Quick Trending Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-mocha-600 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blush-500" />
              {searchQuery ? (
                <>Live Search: <span className="text-mocha-950 font-sans italic">"{searchQuery}"</span></>
              ) : (
                'Live Search Active'
              )}
            </span>
            <span className="text-blush-800 font-mono font-bold text-xs bg-blush-100 border border-blush-200/60 px-2.5 py-0.5 rounded-full">
              {products.length} {products.length === 1 ? 'piece matching' : 'pieces matching'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
            <span className="text-mocha-400 uppercase tracking-wider mr-1">Trending Tags:</span>
            {['Blazer', 'Headphones', 'SunShield', 'Keyboard', 'Sneakers', 'Serum'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] hover:bg-blush-100 hover:text-blush-800 text-mocha-700 border border-mocha-200 transition-colors cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-mocha-400 font-bold">Active Refinements:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blush-100 border border-blush-200 text-xs font-medium text-blush-900">
              Query: "{searchQuery}"
              <button onClick={() => setSearchQuery('')}><X className="w-3 h-3 hover:text-mocha-900" /></button>
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBDDCD] border border-mocha-300 text-xs font-medium text-mocha-900">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3 hover:text-mocha-900" /></button>
            </span>
          )}
          {priceRange < 20000 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0EE] border border-blush-200 text-xs font-medium text-mocha-900 font-mono">
              Under ₹{priceRange}
            </span>
          )}
          {minRating > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0EE] border border-blush-200 text-xs font-medium text-mocha-900 font-mono">
              {minRating}★ & above
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-xs font-mono uppercase tracking-wider text-blush-700 hover:underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid: Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <ProductFilter />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden col-span-1 mb-4">
            <ProductFilter />
          </div>
        )}

        {/* Products Listing Area */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-5 text-xs text-mocha-500 font-mono">
            <span>
              Exhibiting <strong className="text-mocha-950 font-bold">{products.length}</strong> curated pieces
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-blush-50 border border-blush-200 rounded-3xl">
              <p className="text-sm font-bold text-blush-800 mb-2">{error}</p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-mocha-900 text-[#FAF7F2] text-xs font-mono uppercase rounded-full"
              >
                Reset Refinements & Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-mocha-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#FAF0EE] text-blush-600 flex items-center justify-center mx-auto text-2xl font-serif">
                ✦
              </div>
              <h3 className="font-serif text-2xl text-mocha-950 font-normal">
                No matching pieces found
              </h3>
              <p className="text-xs text-mocha-500 font-sans leading-relaxed">
                We couldn't locate any items matching your search query "{searchQuery}". Try typing another word or resetting filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 rounded-full bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                Reset All Refinements
              </button>
            </div>
          ) : layout === 'list' ? (
            <div className="space-y-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} layout="list" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} layout="grid" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
