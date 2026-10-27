import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { formatPrice } from '../utils/formatters';
import {
  CreditCard,
  QrCode,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Code,
  Layers,
  Cpu
} from 'lucide-react';

export default function Checkout() {
  const { cartItems, grandTotal, subtotal, discountAmount, shippingFee, clearCart } = useCart();
  const { currentUser, isGuest, isAuthenticated, placeOrder } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  // Redirect guest or unauthenticated user to login
  useEffect(() => {
    if (isGuest || !isAuthenticated) {
      showToast('Please sign in with a registered account to complete your checkout.', 'info');
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [isGuest, isAuthenticated, navigate, showToast]);

  const [shippingData, setShippingData] = useState({
    fullName: currentUser?.name && currentUser.name !== 'Guest Explorer' ? currentUser.name : '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    street: currentUser?.address?.street || '',
    city: currentUser?.address?.city || '',
    state: currentUser?.address?.state || '',
    pincode: currentUser?.address?.pincode || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');

  const [orderSuccess, setOrderSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FAF0EE] text-blush-600 flex items-center justify-center mx-auto text-2xl font-serif">
          🛍️
        </div>
        <h2 className="font-serif text-2xl text-mocha-950 font-normal">Your bag is empty</h2>
        <p className="text-xs text-mocha-500 font-sans">Select items from our collection before checking out.</p>
        <Link to="/products" className="inline-block px-6 py-3 bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] rounded-full text-xs uppercase tracking-wider font-semibold transition-colors">
          Explore Pieces
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!shippingData.fullName.trim()) {
      showToast('Please provide your full recipient name.', 'warning');
      return;
    }

    if (!shippingData.phone.trim() || shippingData.phone.trim().length < 10) {
      showToast('Please provide a valid 10-digit mobile number.', 'warning');
      return;
    }

    if (!shippingData.street.trim() || !shippingData.city.trim() || !shippingData.state.trim() || !shippingData.pincode.trim()) {
      showToast('Please complete all street, city, state, and PIN code delivery details.', 'warning');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeOrder({
        items: cartItems,
        totalAmount: grandTotal,
        subtotal,
        discount: discountAmount,
        shippingFee,
        shippingAddress: shippingData,
        paymentMethod: paymentMethod.toUpperCase(),
        paymentDetails: paymentMethod === 'upi' ? { upiId } : paymentMethod === 'card' ? { cardHolder: cardData.cardHolder || shippingData.fullName } : { type: 'COD' }
      });

      clearCart();
      setOrderSuccess(order);
      setIsSubmitting(false);
      showToast('Order confirmed! Atelier dispatch scheduled 📦', 'success');
    }, 1000);
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-blush-100 text-blush-700 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold text-blush-700 uppercase tracking-[0.25em]">
            Atelier Order Confirmation
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-mocha-950 tracking-tight mt-1">
            Thank You for Your Patronage
          </h1>
          <p className="text-xs text-mocha-600 mt-2 font-sans">
            Your pieces have been reserved and prepared for expedited delivery.
          </p>
        </div>

        {/* Order Receipt Box */}
        <div className="bg-white rounded-3xl border border-mocha-200 p-6 text-left shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-mocha-100 gap-2">
            <div>
              <p className="text-[10px] font-mono text-mocha-400 font-bold uppercase tracking-wider">Order Reference</p>
              <p className="text-base font-bold text-mocha-900 font-mono">{orderSuccess.id}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-mocha-400 font-bold uppercase tracking-wider">Estimated Delivery</p>
              <p className="text-xs font-semibold text-emerald-800 font-mono">Within 3-4 Business Days</p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-mocha-400 font-bold uppercase tracking-wider">Amount Paid</p>
              <p className="text-base font-bold text-mocha-950 font-mono">{formatPrice(orderSuccess.totalAmount)}</p>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-mocha-500 mb-1.5 font-bold">Delivery Destination</h4>
            <p className="text-xs text-mocha-800 font-medium">
              {orderSuccess.shippingAddress.fullName} • {orderSuccess.shippingAddress.phone}
            </p>
            <p className="text-xs text-mocha-600">
              {orderSuccess.shippingAddress.street}, {orderSuccess.shippingAddress.city},{' '}
              {orderSuccess.shippingAddress.state} - {orderSuccess.shippingAddress.pincode}
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-mocha-500 mb-2 font-bold">Curated Pieces</h4>
            <div className="space-y-2">
              {orderSuccess.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover bg-mocha-50" />
                    <span className="font-medium text-mocha-900">{item.name} (x{item.quantity})</span>
                  </div>
                  <span className="font-bold font-mono text-mocha-950">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/orders"
            className="px-7 py-3.5 rounded-full bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider shadow-md transition-colors"
          >
            Track in My Orders →
          </Link>
          <Link
            to="/products"
            className="px-7 py-3.5 rounded-full bg-white border border-mocha-300 text-mocha-800 hover:border-blush-400 font-semibold text-xs uppercase tracking-wider transition-colors"
          >
            Continue Browsing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blush-700 font-bold block mb-1">
          Finalize Transaction
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-mocha-950 tracking-tight">
          Checkout & Atelier Dispatch
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Address & Payment Methods */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Step 1: Shipping Address Form */}
          <div className="bg-white rounded-3xl border border-mocha-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-mocha-100">
              <span className="w-7 h-7 rounded-full bg-mocha-900 text-[#FAF7F2] font-mono font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="font-serif text-lg text-mocha-950">
                Delivery Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-1">
                  Full Recipient Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={shippingData.fullName}
                  onChange={handleInputChange}
                  className="w-full text-xs p-3 rounded-2xl border border-mocha-200 focus:outline-none focus:border-blush-500 bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-1">
                  10-Digit Mobile Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="9876543210"
                  value={shippingData.phone}
                  onChange={handleInputChange}
                  className="w-full text-xs p-3 rounded-2xl border border-mocha-200 focus:outline-none focus:border-blush-500 bg-[#FAF7F2]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-1">
                  Street Address / Apartment / Suite *
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  placeholder="Flat 4B, Heritage Crest Boulevard"
                  value={shippingData.street}
                  onChange={handleInputChange}
                  className="w-full text-xs p-3 rounded-2xl border border-mocha-200 focus:outline-none focus:border-blush-500 bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="Bengaluru"
                  value={shippingData.city}
                  onChange={handleInputChange}
                  className="w-full text-xs p-3 rounded-2xl border border-mocha-200 focus:outline-none focus:border-blush-500 bg-[#FAF7F2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    placeholder="Karnataka"
                    value={shippingData.state}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 rounded-2xl border border-mocha-200 focus:outline-none focus:border-blush-500 bg-[#FAF7F2]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    placeholder="560100"
                    value={shippingData.pincode}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 rounded-2xl border border-mocha-200 focus:outline-none focus:border-blush-500 bg-[#FAF7F2]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white rounded-3xl border border-mocha-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-mocha-100">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-mocha-900 text-[#FAF7F2] font-mono font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="font-serif text-lg text-mocha-950">
                  Payment Method
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'card'
                    ? 'border-blush-400 bg-blush-50/70 shadow-2xs'
                    : 'border-mocha-200 hover:border-mocha-300'
                }`}
              >
                <CreditCard className={`w-5 h-5 mb-2 ${paymentMethod === 'card' ? 'text-blush-700' : 'text-mocha-500'}`} />
                <h4 className="text-xs font-bold text-mocha-900">Card Payment</h4>
                <p className="text-[10px] text-mocha-500 font-mono mt-0.5">Visa, MC, RuPay</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-blush-400 bg-blush-50/70 shadow-2xs'
                    : 'border-mocha-200 hover:border-mocha-300'
                }`}
              >
                <QrCode className={`w-5 h-5 mb-2 ${paymentMethod === 'upi' ? 'text-blush-700' : 'text-mocha-500'}`} />
                <h4 className="text-xs font-bold text-mocha-900">Instant UPI</h4>
                <p className="text-[10px] text-mocha-500 font-mono mt-0.5">GPay, PhonePe, QR</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-blush-400 bg-blush-50/70 shadow-2xs'
                    : 'border-mocha-200 hover:border-mocha-300'
                }`}
              >
                <Truck className={`w-5 h-5 mb-2 ${paymentMethod === 'cod' ? 'text-blush-700' : 'text-mocha-500'}`} />
                <h4 className="text-xs font-bold text-mocha-900">Cash on Delivery</h4>
                <p className="text-[10px] text-mocha-500 font-mono mt-0.5">Pay at doorstep</p>
              </button>
            </div>

            {/* Payment Sub-forms */}
            {paymentMethod === 'card' && (
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-mocha-200 text-xs space-y-3 animate-fade-in">
                <div className="flex justify-between items-center text-mocha-500 text-[11px] font-mono">
                  <span>Credit / Debit Card Details</span>
                  <span className="flex items-center gap-1 text-emerald-800 font-bold">
                    <Lock className="w-3 h-3" /> 256-Bit SSL Encrypted
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-mocha-600 mb-1">Name on Card</label>
                    <input
                      type="text"
                      placeholder="e.g. Eleanor Vance"
                      value={cardData.cardHolder}
                      onChange={(e) => setCardData(prev => ({ ...prev, cardHolder: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-white border border-mocha-200 font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-mocha-600 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8891"
                      value={cardData.cardNumber}
                      onChange={(e) => setCardData(prev => ({ ...prev, cardNumber: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-white border border-mocha-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-mocha-600 mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={cardData.expiry}
                      onChange={(e) => setCardData(prev => ({ ...prev, expiry: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-white border border-mocha-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-mocha-600 mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cardData.cvv}
                      onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-white border border-mocha-200 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-mocha-200 text-xs space-y-2 animate-fade-in">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-mocha-600">Enter UPI Virtual ID (VPA)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-mocha-200 font-mono"
                  placeholder="yourname@okhdfcbank"
                />
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-4 bg-blush-50/60 rounded-2xl border border-blush-200 text-xs text-mocha-800 space-y-1 animate-fade-in">
                <p className="font-bold">Pay via Cash / QR code upon delivery</p>
                <p className="text-[11px] text-mocha-600">
                  Please keep exact currency or UPI app ready when package arrives at your doorstep.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-mocha-200 p-6 shadow-xs space-y-5">
            <h3 className="font-serif text-xl text-mocha-950 pb-3 border-b border-mocha-100">
              Selected Pieces ({cartItems.length})
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-mocha-50 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-mocha-900 truncate">{item.name}</p>
                    <p className="text-mocha-400 font-mono text-[10px]">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold font-mono text-mocha-950">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-mocha-700 pt-3 border-t border-mocha-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold font-mono text-mocha-900">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-blush-700 font-medium">
                  <span>Privilege Savings</span>
                  <span className="font-mono">-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold font-mono">{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
              </div>
              <div className="pt-3 border-t border-mocha-200 flex justify-between items-baseline text-mocha-950">
                <span className="text-sm font-serif font-bold">Total Payable</span>
                <span className="text-2xl font-bold font-mono text-mocha-950">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-mocha-900 hover:bg-blush-600 disabled:opacity-50 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider shadow-lg shadow-mocha-900/15 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" /> Confirm & Place Order ({formatPrice(grandTotal)})
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
