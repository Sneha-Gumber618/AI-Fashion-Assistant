import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
  Truck,
  X
} from 'lucide-react';

export default function Cart() {
  const {
    cartItems,
    cartCount,
    subtotal,
    shippingFee,
    isFreeShipping,
    freeShippingProgress,
    freeShippingRemaining,
    appliedCoupon,
    discountAmount,
    grandTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (applyCoupon(couponInput)) {
      setCouponInput('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-blush-100/80 text-blush-600 flex items-center justify-center mx-auto text-4xl shadow-inner">
          🛍️
        </div>
        <div>
          <h2 className="font-serif text-3xl font-light text-mocha-950 tracking-tight">
            Your Shopping Bag is Empty
          </h2>
          <p className="text-xs sm:text-sm text-mocha-600 mt-2 max-w-sm mx-auto font-sans leading-relaxed">
            Your atelier bag currently has no pieces. Browse our seasonal capsule or consult our AI stylist!
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            <ShoppingBag className="w-4 h-4" /> Explore Catalog
          </Link>
          <Link
            to="/assistant"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white border border-mocha-300 hover:border-blush-400 text-mocha-900 font-semibold text-xs uppercase tracking-wider shadow-2xs transition-all"
          >
            <Sparkles className="w-4 h-4 text-blush-500" /> Ask AI Stylist
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-mocha-200">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blush-700 font-bold block mb-1">
            Order Review
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-mocha-950 tracking-tight">
            Shopping Bag ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-mono uppercase tracking-wider text-blush-700 hover:text-mocha-950 flex items-center gap-1.5 hover:underline"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear All
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="bg-[#F4ECE1]/80 border border-mocha-200 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2 font-medium text-mocha-900">
            <Truck className="w-4 h-4 text-mocha-700" />
            {isFreeShipping ? (
              <span className="text-emerald-800 font-bold">✦ Complimentary express delivery unlocked!</span>
            ) : (
              <span>
                Add <strong className="text-blush-700 font-mono font-bold">{formatPrice(freeShippingRemaining)}</strong> more for <strong>Complimentary Express Delivery</strong>
              </span>
            )}
          </div>
          <span className="font-mono font-bold text-mocha-800">{freeShippingProgress}%</span>
        </div>
        <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-mocha-200">
          <div
            className={`h-full transition-all duration-500 ${
              isFreeShipping ? 'bg-emerald-600' : 'bg-gradient-to-r from-blush-400 via-blush-500 to-mocha-700'
            }`}
            style={{ width: `${freeShippingProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-mocha-200/80 p-5 shadow-xs flex flex-col sm:flex-row items-center gap-5 hover:border-blush-300 transition-colors"
            >
              <Link to={`/product/${item.id}`} className="w-24 h-24 rounded-2xl bg-[#F4ECE1] overflow-hidden shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                  }}
                  className="w-full h-full object-cover"
                />
              </Link>

              <div className="flex-1 w-full space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-blush-700">
                  {item.category}
                </span>
                <Link to={`/product/${item.id}`} className="block">
                  <h3 className="font-serif text-lg text-mocha-950 font-normal hover:text-blush-700 transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-0.5">
                  <span className="text-base font-bold font-mono text-mocha-950">
                    {formatPrice(item.price)}
                  </span>
                  {item.originalPrice && (
                    <span className="text-xs text-mocha-400 line-through font-mono">
                      {formatPrice(item.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-mocha-300 rounded-full overflow-hidden bg-[#FAF7F2]">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 text-mocha-700 hover:bg-mocha-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold font-mono text-mocha-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 text-mocha-700 hover:bg-mocha-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[75px]">
                  <span className="text-sm font-bold font-mono text-mocha-950 block">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-mocha-400 hover:text-blush-700 hover:bg-blush-50 rounded-full transition-colors"
                  title="Remove item"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/products"
              className="text-xs font-mono uppercase tracking-wider text-mocha-700 hover:text-blush-700 flex items-center gap-1.5"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary & Coupon Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-mocha-200 p-6 shadow-xs space-y-5">
            <h3 className="font-serif text-xl font-normal text-mocha-950 pb-3 border-b border-mocha-100">
              Order Breakdown
            </h3>

            {/* Coupon Code Input */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blush-600" /> Promotional Privilege
              </label>

              {appliedCoupon ? (
                <div className="p-3 bg-blush-50 border border-blush-200 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-blush-900 font-mono">
                      {appliedCoupon.code}
                    </span>
                    <p className="text-[11px] text-blush-700 mt-0.5">
                      {appliedCoupon.description}
                    </p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1 text-blush-700 hover:text-mocha-900"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="STYLE20 or FIRST50"
                    className="flex-1 text-xs uppercase font-mono px-3.5 py-2.5 rounded-full border border-mocha-300 focus:outline-none focus:border-blush-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider rounded-full transition-colors shadow-2xs"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Breakdown Costs */}
            <div className="space-y-2.5 text-xs text-mocha-700 pt-2 border-t border-mocha-100">
              <div className="flex justify-between">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-bold font-mono text-mocha-900">{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-blush-700 font-medium">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span className="font-mono">-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-bold font-mono">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 uppercase font-bold text-[11px]">Free</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-mocha-400 text-[11px]">
                <span>Taxes (Included)</span>
                <span>5% GST</span>
              </div>

              <div className="pt-3 border-t border-mocha-200 flex justify-between items-baseline text-mocha-950">
                <span className="text-sm font-serif font-bold">Total Amount</span>
                <span className="text-2xl font-bold font-mono text-mocha-950">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] font-semibold text-xs tracking-wider uppercase shadow-lg shadow-mocha-900/15 transition-all hover:scale-[1.01]"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-mocha-400 font-mono uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>256-Bit Encrypted Atelier Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
