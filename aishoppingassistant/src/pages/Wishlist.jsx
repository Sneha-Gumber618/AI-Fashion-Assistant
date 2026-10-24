import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import StarRating from '../components/common/StarRating';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function Wishlist() {
  const { wishlistItems, wishlistCount, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  if (wishlistCount === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-blush-100/80 text-blush-600 flex items-center justify-center mx-auto text-4xl shadow-inner">
          <Heart className="w-12 h-12" />
        </div>
        <div>
          <h2 className="font-serif text-3xl font-light text-mocha-950 tracking-tight">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs sm:text-sm text-mocha-600 mt-2 max-w-sm mx-auto font-sans leading-relaxed">
            Preserve pieces you adore by tapping the heart icon on any piece across our collection.
          </p>
        </div>
        <div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            <ShoppingBag className="w-4 h-4" /> Discover Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-mocha-200">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blush-700 font-bold block mb-1">
            Curated Favorites
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-mocha-950 tracking-tight">
            Saved Pieces ({wishlistCount} {wishlistCount === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <button
          onClick={clearWishlist}
          className="text-xs font-mono uppercase tracking-wider text-blush-700 hover:text-mocha-950 flex items-center gap-1.5 hover:underline"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Wishlist
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-3xl border border-mocha-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-blush-300 transition-all duration-500 flex flex-col group"
          >
            <div className="relative aspect-square w-full bg-[#F4ECE1] overflow-hidden">
              <Link to={`/product/${product.id}`} className="block w-full h-full">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
                />
              </Link>
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/90 text-blush-600 hover:bg-blush-50 shadow-sm"
                title="Remove from wishlist"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col flex-1 justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-blush-700">
                  {product.category}
                </span>
                <Link to={`/product/${product.id}`} className="block">
                  <h3 className="font-serif text-lg font-normal text-mocha-950 hover:text-blush-700 transition-colors line-clamp-1 mt-0.5">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-1">
                  <StarRating rating={product.rating} count={product.reviewsCount} size="xs" />
                </div>
              </div>

              <div className="pt-4 border-t border-mocha-100 mt-4 flex items-center justify-between">
                <span className="font-bold font-mono text-mocha-950 text-base">
                  {formatPrice(product.price)}
                </span>
                <button
                  onClick={() => handleMoveToCart(product)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider transition-colors shadow-2xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Move to Bag
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
