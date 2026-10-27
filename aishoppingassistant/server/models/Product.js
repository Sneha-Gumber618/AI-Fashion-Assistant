/**
 * Product Mongoose Model
 * Represents catalog items stored in MongoDB.
 * Syllabus: MongoDB + Mongoose Schema, Models, and Validations
 */

import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    id: { type: Number },
    user: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    date: { type: String, default: () => new Date().toLocaleDateString() },
    comment: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, 'Product ID is required'],
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be a positive number'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price must be positive'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    icon: {
      type: String,
      default: '🛍️',
    },
    badge: {
      type: String,
      default: '',
      trim: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockCount: {
      type: Number,
      default: 25,
      min: 0,
    },
    image: {
      type: String,
      required: [true, 'Product image URL is required'],
      trim: true,
    },
    gallery: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    specs: {
      type: Map,
      of: String,
      default: () => ({}),
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_document, result) {
        delete result._id;
        delete result.__v;
        return result;
      },
    },
  }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
