import React from 'react';
import { useProducts } from '../../context/ProductContext';
import { CATEGORIES } from '../../data/products';
import { formatPrice } from '../../utils/formatters';
import { Filter, RotateCcw, Star, Check } from 'lucide-react';

export default function ProductFilter({ className = '' }) {
  const {
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    inStockOnly,
    setInStockOnly,
    resetFilters
  } = useProducts();

  return (
    <aside className={`bg-white rounded-3xl border border-mocha-200/90 p-6 shadow-xs space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-mocha-100">
        <div className="flex items-center gap-2 text-mocha-950 font-bold text-sm uppercase tracking-wider font-mono">
          <Filter className="w-4 h-4 text-blush-600" />
          <span>Refine</span>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs text-blush-700 hover:text-mocha-950 font-semibold flex items-center gap-1 hover:underline uppercase tracking-wider font-mono"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-mocha-400 mb-3">
          Atelier Collections
        </h4>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-blush-100 text-blush-800 font-bold border border-blush-200/80 shadow-2xs'
                    : 'text-mocha-700 hover:bg-[#FAF7F2] hover:text-mocha-950'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{cat.icon}</span>
                  <span className="font-sans">{cat.name}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-blush-700" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="pt-3 border-t border-mocha-100">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-mocha-400">
            Price Ceiling
          </h4>
          <span className="text-sm font-bold font-mono text-mocha-950">
            {formatPrice(priceRange)}
          </span>
        </div>
        <input
          type="range"
          min="200"
          max="20000"
          step="200"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full accent-[#2C1D13] cursor-pointer h-2 bg-mocha-200 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[10px] font-mono text-mocha-400 mt-1.5">
          <span>₹200</span>
          <span>₹10,000</span>
          <span>₹20,000</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="pt-3 border-t border-mocha-100">
        <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-mocha-400 mb-2.5">
          Curated Rating
        </h4>
        <div className="flex flex-col gap-1.5">
          {[4, 4.5, 4.8].map((rating) => {
            const isSelected = minRating === rating;
            return (
              <button
                key={rating}
                onClick={() => setMinRating(isSelected ? 0 : rating)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-mocha-100 text-mocha-900 font-bold border border-mocha-300'
                    : 'text-mocha-600 hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{rating} Stars & Up</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-mocha-900" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* In Stock Toggle */}
      <div className="pt-3 border-t border-mocha-100">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded border-mocha-300 text-mocha-900 focus:ring-blush-400 accent-mocha-900"
          />
          <span className="text-xs font-semibold text-mocha-800">
            Available In Stock Only
          </span>
        </label>
      </div>
    </aside>
  );
}
