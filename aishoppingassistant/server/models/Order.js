/**
 * Order Mongoose Model
 * Represents customer checkout orders stored in MongoDB.
 * Syllabus: MongoDB + Mongoose Schema, Nested Subdocuments, Validations
 */

import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    category: { type: String, default: 'General' },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    street: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    pincode: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      default: null,
      index: true,
    },
    userEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [
        (val) => Array.isArray(val) && val.length > 0,
        'Order must contain at least one item',
      ],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount must be non-negative'],
    },
    shippingAddress: {
      type: shippingAddressSchema,
      default: () => ({}),
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Card', 'Net Banking', 'Cash on Delivery'],
      default: 'UPI',
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'In Transit', 'Delivered', 'Cancelled'],
      default: 'Confirmed',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_document, result) {
        result.id = result.orderId;
        delete result._id;
        delete result.__v;
        return result;
      },
    },
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
