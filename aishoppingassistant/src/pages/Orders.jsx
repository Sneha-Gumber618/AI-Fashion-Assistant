import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { formatPrice, formatDate } from '../utils/formatters';
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  ShoppingBag,
  RotateCcw
} from 'lucide-react';

export default function Orders() {
  const { orders } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useNotification();

  const handleReorder = (item) => {
    addToCart(item, 1);
    showToast(`Added "${item.name}" back to your shopping bag!`, 'success');
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-[#FAF0EE] text-blush-600 flex items-center justify-center mx-auto text-4xl shadow-inner">
          📦
        </div>
        <div>
          <h2 className="font-serif text-3xl font-light text-mocha-950 tracking-tight">
            No Order History Found
          </h2>
          <p className="text-xs sm:text-sm text-mocha-600 mt-2 max-w-sm mx-auto font-sans">
            You haven't placed an atelier order yet. Discover our latest seasonal drops!
          </p>
        </div>
        <div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            <ShoppingBag className="w-4 h-4" /> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div className="pb-4 border-b border-mocha-200">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blush-700 font-bold block mb-1">
          Purchase Archive
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-mocha-950 tracking-tight">
          My Order History & Live Tracking
        </h1>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-3xl border border-mocha-200 overflow-hidden shadow-xs hover:border-blush-300 transition-colors"
          >
            {/* Order Header */}
            <div className="bg-[#FAF7F2] px-6 py-4 border-b border-mocha-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-mocha-400 font-bold block text-[9px] uppercase tracking-wider font-mono">
                    Order Reference
                  </span>
                  <span className="font-mono font-bold text-mocha-950 text-sm">
                    {order.id}
                  </span>
                </div>
                <div>
                  <span className="text-mocha-400 font-bold block text-[9px] uppercase tracking-wider font-mono">
                    Date Placed
                  </span>
                  <span className="font-medium text-mocha-800">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="text-mocha-400 font-bold block text-[9px] uppercase tracking-wider font-mono">
                    Total Amount
                  </span>
                  <span className="font-bold text-mocha-950 font-mono text-sm">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-blush-100 border border-blush-200 text-blush-800 font-mono uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blush-600" />
                  {order.status || 'Confirmed'}
                </span>
              </div>
            </div>

            {/* Shipment Progress Visual Tracker */}
            <div className="px-6 py-5 border-b border-mocha-100 bg-white">
              <div className="max-w-xl mx-auto">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-2 font-medium">
                  <span className="text-emerald-800 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Placed
                  </span>
                  <span className="text-emerald-800 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Prepared
                  </span>
                  <span className="text-blush-700 flex items-center gap-1 font-bold">
                    <Truck className="w-3.5 h-3.5 animate-pulse text-blush-600" /> In Transit
                  </span>
                  <span className="text-mocha-400">Delivered</span>
                </div>

                <div className="w-full h-2 bg-mocha-100 rounded-full overflow-hidden flex">
                  <div className="w-3/4 h-full bg-gradient-to-r from-emerald-600 via-blush-500 to-mocha-800 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 space-y-4">
              <div className="divide-y divide-mocha-100">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                        }}
                        className="w-14 h-14 rounded-2xl object-cover bg-mocha-50 shrink-0"
                      />
                      <div>
                        <Link
                          to={`/product/${item.id}`}
                          className="font-serif font-bold text-mocha-950 text-base hover:text-blush-700 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-mocha-500 mt-0.5 font-mono text-[11px]">
                          Category: {item.category} • Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="font-bold font-mono text-mocha-950 text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      <button
                        onClick={() => handleReorder(item)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-mocha-300 text-mocha-800 hover:border-blush-400 hover:text-blush-700 font-semibold text-xs uppercase tracking-wider font-mono transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" /> Buy Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Destination */}
              {order.shippingAddress && (
                <div className="pt-3 border-t border-mocha-100 text-xs text-mocha-500 flex flex-wrap justify-between gap-2 font-sans">
                  <div>
                    <span className="font-bold text-mocha-800">Destination: </span>
                    <span>
                      {order.shippingAddress.fullName}, {order.shippingAddress.street},{' '}
                      {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                      {order.shippingAddress.pincode}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-mocha-800">Method: </span>
                    <span className="uppercase font-mono">{order.paymentMethod}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
