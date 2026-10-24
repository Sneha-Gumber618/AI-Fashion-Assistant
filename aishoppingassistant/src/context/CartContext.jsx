import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotification } from './NotificationContext';
import { validateCoupon } from '../data/coupons';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { showToast } = useNotification();
  
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('shopai_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('shopai_applied_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Local storage synchronization
  useEffect(() => {
    localStorage.setItem('shopai_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('shopai_applied_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('shopai_applied_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty
        };
        return updated;
      } else {
        return [...prev, { ...product, quantity: qty }];
      }
    });

    showToast(`Added ${qty}x "${product.name}" to your cart! 🛍️`, 'success');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    const item = cartItems.find(i => i.id === productId);
    setCartItems(prev => prev.filter(i => i.id !== productId));
    if (item) {
      showToast(`Removed "${item.name}" from cart`, 'info');
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Free shipping threshold: ₹999
  const FREE_SHIPPING_THRESHOLD = 999;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || (appliedCoupon && appliedCoupon.freeShipping);
  const shippingFee = cartItems.length === 0 ? 0 : (isFreeShipping ? 0 : 99);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // Recalculate coupon discount against dynamic subtotal
  let discountAmount = 0;
  if (appliedCoupon) {
    const check = validateCoupon(appliedCoupon.code, subtotal);
    if (check.valid) {
      discountAmount = check.discount;
    } else {
      // Order dropped below min requirement
      setAppliedCoupon(null);
      showToast(`Coupon removed: ${check.message}`, 'warning');
    }
  }

  // Estimated Taxes (included or standard 5%)
  const estimatedTax = Math.round((subtotal - discountAmount) * 0.05);
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const applyCoupon = (code) => {
    if (!code || !code.trim()) {
      showToast('Please enter a coupon code', 'warning');
      return false;
    }

    const result = validateCoupon(code, subtotal);
    if (result.valid) {
      setAppliedCoupon({
        code: result.coupon.code,
        discount: result.discount,
        freeShipping: result.freeShipping,
        description: result.coupon.description
      });
      showToast(result.message, 'success');
      return true;
    } else {
      showToast(result.message, 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon code removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        shippingFee,
        isFreeShipping,
        freeShippingProgress,
        freeShippingRemaining,
        appliedCoupon,
        discountAmount,
        estimatedTax,
        grandTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
