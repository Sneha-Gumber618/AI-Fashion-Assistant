import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { formatPrice, calculateDiscount } from '../../utils/formatters';
import StarRating from '../common/StarRating';
import Badge from '../common/Badge';

export default function ProductCard({ product, layout = 'grid' }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isGuest, isAuthenticated } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const discountPercent = calculateDiscount(product.originalPrice, product.price);

  // Intercept click on product details for Guest users
  const handleViewDetails = (e) => {
    if (isGuest || !isAuthenticated) {
      e.preventDefault();
      showToast('Please sign in with a registered account to view complete piece specifications.', 'info');
      navigate('/login', { state: { from: `/product/${product.id}` } });
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Intercept Add to Cart for Guest users
    if (isGuest || !isAuthenticated) {
      showToast('Please sign in with a registered account to add pieces to your shopping bag.', 'info');
      navigate('/login', { state: { from: `/product/${product.id}` } });
      return;
    }

    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Intercept Wishlist for Guest users
    if (isGuest || !isAuthenticated) {
      showToast('Please sign in with a registered account to save items to your wishlist.', 'info');
      navigate('/login', { state: { from: `/product/${product.id}` } });
      return;
    }

    toggleWishlist(product);
  };

  if (layout === 'list') {
    return (
      <div className="group bg-white rounded-3xl border border-mocha-200/80 p-5 shadow-xs hover:shadow-xl hover:border-blush-300 transition-all duration-500 flex flex-col sm:flex-row gap-6 items-center">
        <Link
          to={`/product/${product.id}`}
          onClick={handleViewDetails}
          className="relative w-full sm:w-52 h-52 bg-[#F4ECE1] rounded-2xl overflow-hidden shrink-0 block"
        >
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
            }}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          />
          {product.badge && (
            <div className="absolute top-3 left-3">
              <Badge variant="accent">{product.badge}</Badge>
            </div>
          )}
        </Link>

        <div className="flex-1 w-full flex flex-col justify-between py-1">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blush-700 font-bold">
                {product.category}
              </span>
              <button
                onClick={handleToggleWishlist}
                className={`p-2 rounded-full transition-colors ${
                  isFavorited ? 'text-blush-600 bg-blush-100' : 'text-mocha-400 hover:text-blush-600 hover:bg-mocha-50'
                }`}
                aria-label="Add to wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-blush-500' : ''}`} />
              </button>
            </div>

            <Link
              to={`/product/${product.id}`}
              onClick={handleViewDetails}
              className="block"
            >
              <h3 className="font-serif text-xl text-mocha-950 font-normal hover:text-blush-700 transition-colors line-clamp-1 mb-1 tracking-tight">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs text-mocha-600 line-clamp-2 mb-3 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-4">
              <StarRating rating={product.rating} count={product.reviewsCount} />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-mocha-100">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-mocha-950">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-mocha-400 line-through font-mono">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-[10px] font-bold text-blush-700 bg-blush-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  -{discountPercent}%
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-xs ${
                justAdded
                  ? 'bg-emerald-700 text-white shadow-emerald-700/20'
                  : 'bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] shadow-mocha-900/10 hover:scale-[1.02]'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-3xl border border-mocha-200/80 overflow-hidden shadow-xs hover:shadow-2xl hover:border-blush-300 transition-all duration-500 flex flex-col h-full transform hover:-translate-y-1">
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full bg-[#F4ECE1] overflow-hidden">
        <Link
          to={`/product/${product.id}`}
          onClick={handleViewDetails}
          className="block w-full h-full"
        >
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
            }}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5">
          {product.badge && (
            <Badge variant="accent">{product.badge}</Badge>
          )}
          {discountPercent > 0 && (
            <span className="bg-blush-500/95 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider font-mono">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm ${
            isFavorited
              ? 'bg-blush-500 text-white scale-110 shadow-blush-500/30'
              : 'bg-[#FAF7F2]/90 text-mocha-700 hover:text-blush-600 hover:bg-white hover:scale-110'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="flex items-center justify-between text-xs text-mocha-500 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blush-700 font-bold">
              {product.category}
            </span>
            <StarRating rating={product.rating} count={product.reviewsCount} size="xs" />
          </div>

          <Link
            to={`/product/${product.id}`}
            onClick={handleViewDetails}
            className="block group-hover:text-blush-700 transition-colors"
          >
            <h3 className="font-serif text-lg font-normal text-mocha-950 line-clamp-1 mb-1 tracking-tight" title={product.name}>
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-mocha-600 line-clamp-2 mb-4 leading-relaxed font-sans">
            {product.description}
          </p>
        </div>

        {/* Price and Add button */}
        <div className="flex items-center justify-between pt-4 border-t border-mocha-100 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-mono text-mocha-950">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-mocha-400 line-through font-mono">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-xs ${
              justAdded
                ? 'bg-emerald-700 text-white shadow-emerald-700/20'
                : 'bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] shadow-mocha-900/10 hover:scale-[1.02]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
