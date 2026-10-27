/**
 * Order Routes — Express Router
 * POST /api/orders           — Place an order (supports authenticated or guest users)
 * GET  /api/orders           — List orders (JWT protected; admin sees all, customer sees own)
 * GET  /api/orders/:id       — Order details
 * PUT  /api/orders/:id/status— Update order status (Admin only)
 *
 * Syllabus: MongoDB + Mongoose, Express Routing, JWT RBAC
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware.js';
import { isDatabaseConnected } from '../config/database.js';

const router = express.Router();

// Fallback in-memory store
let fallbackOrders = [
  {
    orderId: 'ORD-894210',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'In Transit',
    totalAmount: 2499,
    items: [
      {
        id: 4,
        name: 'AeroBeat Headphones',
        price: 2499,
        quantity: 1,
        category: 'Electronics',
        image: '/images/aerobeat.jpg',
      },
    ],
    shippingAddress: {
      fullName: 'Alex Johnson',
      phone: '9876543210',
      street: '42 Orchid Blossom Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560100',
    },
    paymentMethod: 'UPI',
  },
];

// Helper to optionally extract user from token without blocking guest checkout
function tryGetAuthenticatedUser(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return null;
    }
  }
  return null;
}

// ─── POST /api/orders ─────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item.',
      });
    }

    const calculatedTotal = Number(totalAmount) || items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const authUser = tryGetAuthenticatedUser(req);
    const orderData = {
      orderId,
      userId: authUser?.id || req.body.userId || null,
      userEmail: authUser?.email || req.body.userEmail || shippingAddress?.email || '',
      items,
      totalAmount: calculatedTotal,
      shippingAddress: shippingAddress || {},
      paymentMethod: paymentMethod || 'UPI',
      status: 'Confirmed',
    };

    if (isDatabaseConnected()) {
      const created = await Order.create(orderData);
      return res.status(201).json({
        success: true,
        message: 'Order placed successfully and recorded in MongoDB!',
        data: created,
      });
    }

    const fallbackRecord = {
      ...orderData,
      createdAt: new Date().toISOString(),
    };
    fallbackOrders.unshift(fallbackRecord);

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: fallbackRecord,
    });
  } catch (error) {
    console.error('[Orders] Create error:', error);
    return res.status(500).json({ success: false, message: 'Server error placing order.' });
  }
});

// ─── GET /api/orders ──────────────────────────────────────────────────────────
router.get('/', verifyToken, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const query = isAdmin ? {} : { $or: [{ userId: req.user.id }, { userEmail: req.user.email }] };

    if (isDatabaseConnected()) {
      const orders = await Order.find(query).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
      });
    }

    let orders = [...fallbackOrders];
    if (!isAdmin) {
      orders = orders.filter(
        (o) => o.userId === req.user.id || o.userEmail === req.user.email
      );
    }

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('[Orders] List error:', error);
    return res.status(500).json({ success: false, message: 'Could not retrieve orders.' });
  }
});

// ─── GET /api/orders/:id ──────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (isDatabaseConnected()) {
      const order = await Order.findOne({ orderId: id });
      if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
      return res.status(200).json({ success: true, data: order });
    }

    const order = fallbackOrders.find((o) => o.orderId === id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('[Orders] Get by ID error:', error);
    return res.status(500).json({ success: false, message: 'Could not retrieve order.' });
  }
});

// ─── PUT /api/orders/:id/status (Admin Only) ──────────────────────────────────
router.put('/:id/status', verifyToken, requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'In Transit', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    if (isDatabaseConnected()) {
      const updated = await Order.findOneAndUpdate(
        { orderId: id },
        { status },
        { new: true }
      );
      if (!updated) return res.status(404).json({ success: false, message: 'Order not found.' });
      return res.status(200).json({ success: true, message: 'Order status updated', data: updated });
    }

    const idx = fallbackOrders.findIndex((o) => o.orderId === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Order not found.' });

    fallbackOrders[idx].status = status;
    return res.status(200).json({ success: true, message: 'Order status updated', data: fallbackOrders[idx] });
  } catch (error) {
    console.error('[Orders] Update status error:', error);
    return res.status(500).json({ success: false, message: 'Could not update status.' });
  }
});

export default router;
