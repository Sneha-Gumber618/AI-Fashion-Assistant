import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductByIdFromAPI, fetchProductsFromAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from '../context/NotificationContext';
import { formatPrice, calculateDiscount } from '../utils/formatters';
import StarRating from '../components/common/StarRating';
import Badge from '../components/common/Badge';
import ProductCard from '../components/product/ProductCard';
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RefreshCw,
  Minus,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useNotification();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('features'); // 'features' | 'specs' | 'reviews'
  const [relatedProducts, setRelatedProducts] = useState([]);

  // New Review Form Controlled State
  const [newReview, setNewReview] = useState({
    user: '',
    rating: 5,
    comment: ''
  });
  const [reviewsList, setReviewsList] = useState([]);

  useEffect(() => {
    async function getProduct() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchProductByIdFromAPI(id);
        const item = response.data;
        setProduct(item);
        setSelectedImage(item.image);
        setReviewsList(item.reviews || []);

        const allRes = await fetchProductsFromAPI({ category: item.category });
        const related = (allRes.data || [])
          .filter((p) => p.id !== item.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (err) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    }

    getProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-mocha-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-6 bg-mocha-200 rounded w-1/4"></div>
            <div className="h-10 bg-mocha-200 rounded w-3/4"></div>
            <div className="h-5 bg-mocha-200 rounded w-1/3"></div>
            <div className="h-24 bg-mocha-200 rounded w-full"></div>
            <div className="h-12 bg-mocha-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-blush-100 text-blush-700 flex items-center justify-center mx-auto text-2xl font-bold font-serif">
          ✦
        </div>
        <h2 className="font-serif text-3xl font-light text-mocha-950">Piece Not Found</h2>
        <p className="text-xs text-mocha-600 font-sans">
          The curated item you are looking for has concluded its release or does not exist.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-mocha-900 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Collection
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const discountPercent = calculateDiscount(product.originalPrice, product.price);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.user.trim() || !newReview.comment.trim()) {
      showToast('Please provide your name and review note.', 'warning');
      return;
    }

    const reviewObj = {
      id: Date.now(),
      user: newReview.user,
      rating: newReview.rating,
      date: 'Just now',
      comment: newReview.comment
    };

    setReviewsList((prev) => [reviewObj, ...prev]);
    setNewReview({ user: '', rating: 5, comment: '' });
    showToast('Thank you! Your verified note has been published.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-mocha-500">
        <Link to="/" className="hover:text-blush-700">Atelier</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-blush-700">Catalog</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-blush-700">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-mocha-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-3xl bg-[#F4ECE1] overflow-hidden border border-mocha-200/90 shadow-sm">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
              }}
              className="w-full h-full object-cover object-center"
            />
            {product.badge && (
              <div className="absolute top-4 left-4">
                <Badge variant="accent">
                  {product.badge}
                </Badge>
              </div>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-sm ${
                isFavorited ? 'bg-blush-500 text-white shadow-blush-500/30' : 'bg-white/90 text-mocha-700 hover:text-blush-600'
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === imgUrl
                      ? 'border-blush-500 ring-2 ring-blush-300'
                      : 'border-mocha-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-blush-700 bg-blush-100 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <span className="text-xs font-medium text-emerald-800 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> In Stock ({product.stockCount || 20} available)
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-mocha-950 tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-2.5">
              <StarRating rating={product.rating} count={product.reviewsCount} size="md" />
              <span className="text-mocha-300">|</span>
              <span className="text-xs text-mocha-500 font-mono uppercase tracking-wider">Verified Atelier Standard</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-white rounded-3xl border border-mocha-200 flex items-baseline gap-3 shadow-2xs">
            <span className="text-3xl font-bold font-mono text-mocha-950">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-base text-mocha-400 line-through font-mono">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-bold font-mono text-blush-800 bg-blush-100 px-3 py-1 rounded-full uppercase tracking-wider">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          <p className="text-sm text-mocha-700 leading-relaxed font-sans">
            {product.description}
          </p>

          {/* Key Features Highlights */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-mocha-400 font-bold">
              Atelier Craftsmanship Highlights
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-mocha-800">
              {product.features?.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blush-600 font-serif font-bold">✦</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="pt-4 border-t border-mocha-200 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono uppercase tracking-wider text-mocha-600 font-bold">
                Quantity:
              </span>
              <div className="flex items-center border border-mocha-300 rounded-full overflow-hidden bg-[#FAF7F2]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-mocha-700 hover:bg-mocha-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold font-mono text-mocha-950">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-mocha-700 hover:bg-mocha-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-mocha-900 hover:bg-mocha-800 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-98 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Bag ({quantity})
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-blush-600 hover:bg-blush-700 text-white font-semibold text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-98 transition-all"
              >
                <Zap className="w-4 h-4" />
                Instant Checkout
              </button>
            </div>
          </div>

          {/* Delivery & Trust Perks */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-mocha-200 text-center">
            <div className="p-3.5 bg-white rounded-2xl border border-mocha-200 text-xs">
              <Truck className="w-5 h-5 text-mocha-700 mx-auto mb-1" />
              <span className="font-bold block text-mocha-900">Free Express</span>
              <span className="text-[10px] text-mocha-500 font-mono">Over ₹999</span>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-mocha-200 text-xs">
              <RefreshCw className="w-5 h-5 text-emerald-700 mx-auto mb-1" />
              <span className="font-bold block text-mocha-900">7-Day Returns</span>
              <span className="text-[10px] text-mocha-500 font-mono">Doorstep pickup</span>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-mocha-200 text-xs">
              <ShieldCheck className="w-5 h-5 text-blush-600 mx-auto mb-1" />
              <span className="font-bold block text-mocha-900">100% Original</span>
              <span className="text-[10px] text-mocha-500 font-mono">Quality assured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specs & Reviews */}
      <div className="pt-8 border-t border-mocha-200">
        <div className="flex border-b border-mocha-200 gap-8">
          <button
            onClick={() => setActiveTab('features')}
            className={`pb-3 text-xs font-mono uppercase tracking-[0.2em] font-bold transition-colors relative ${
              activeTab === 'features' ? 'text-mocha-950' : 'text-mocha-400 hover:text-mocha-800'
            }`}
          >
            Technical Specifications
            {activeTab === 'features' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mocha-950 rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-xs font-mono uppercase tracking-[0.2em] font-bold transition-colors relative ${
              activeTab === 'reviews' ? 'text-mocha-950' : 'text-mocha-400 hover:text-mocha-800'
            }`}
          >
            Verified Client Reviews ({reviewsList.length})
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mocha-950 rounded-full"></span>
            )}
          </button>
        </div>

        <div className="py-6">
          {activeTab === 'features' ? (
            <div className="max-w-2xl bg-white rounded-3xl border border-mocha-200 p-6 shadow-xs">
              <h3 className="font-serif text-lg text-mocha-950 mb-4">Craftsmanship & Details</h3>
              <dl className="divide-y divide-mocha-100 text-xs">
                {product.specs && Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="py-2.5 flex justify-between">
                    <dt className="text-mocha-500 font-mono uppercase tracking-wider">{key}</dt>
                    <dd className="text-mocha-900 font-bold text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Existing Reviews List */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-serif text-xl font-normal text-mocha-950">
                  Client Impressions
                </h3>

                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-5 bg-white rounded-3xl border border-mocha-200/80 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-mocha-900">{rev.user}</span>
                      <span className="text-[10px] font-mono text-mocha-400 uppercase">{rev.date}</span>
                    </div>
                    <StarRating rating={rev.rating} size="xs" />
                    <p className="text-xs text-mocha-700 leading-relaxed font-sans">{rev.comment}</p>
                  </div>
                ))}
              </div>

              {/* Add Review Controlled Form */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-mocha-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blush-600" />
                  <h3 className="font-serif text-lg text-mocha-950">Leave a Client Note</h3>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-1">
                      Your Rating
                    </label>
                    <StarRating
                      rating={newReview.rating}
                      interactive={true}
                      onRatingChange={(r) => setNewReview({ ...newReview, rating: r })}
                      size="md"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={newReview.user}
                      onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
                      placeholder="e.g. Priya Sharma"
                      className="w-full text-xs p-3 rounded-2xl border border-mocha-200 focus:outline-none focus:border-blush-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-mocha-600 mb-1">
                      Your Review Note
                    </label>
                    <textarea
                      rows="3"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Share your thoughts on the texture, performance, or styling..."
                      className="w-full text-xs p-3 rounded-2xl border border-mocha-200 focus:outline-none focus:border-blush-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider rounded-full transition-colors shadow-2xs"
                  >
                    Publish Note
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Showcase */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-mocha-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-light text-mocha-950">
              Harmonious Complements
            </h2>
            <Link to={`/products?category=${product.category}`} className="text-xs font-mono uppercase tracking-wider text-mocha-700 hover:text-blush-700">
              More in {product.category} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
