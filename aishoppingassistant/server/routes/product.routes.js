/**
 * Product Routes — Express Router
 * GET    /api/products      — List products with filtering, search, and sorting
 * GET    /api/products/:id  — Retrieve single product by ID
 * POST   /api/products      — Create a product (Admin only, JWT protected)
 * PUT    /api/products/:id  — Update a product (Admin only, JWT protected)
 * DELETE /api/products/:id  — Delete a product (Admin only, JWT protected)
 *
 * Syllabus: MongoDB + Mongoose query methods, Express Routing, JWT RBAC
 */

import express from 'express';
import Product from '../models/Product.js';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware.js';
import { validateProductInput } from '../middleware/validate.middleware.js';
import { isDatabaseConnected } from '../config/database.js';
import { INITIAL_PRODUCTS } from '../../src/data/products.js';

const router = express.Router();

// Fallback in-memory copy
let fallbackProducts = [...INITIAL_PRODUCTS];

// ─── GET /api/products ────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, inStockOnly } = req.query;

    if (isDatabaseConnected()) {
      // 1. Build MongoDB filter object
      const filter = {};

      if (category && category !== 'all') {
        filter.category = new RegExp(`^${category}$`, 'i');
      }

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      if (inStockOnly === 'true') {
        filter.inStock = true;
      }

      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { name: regex },
          { description: regex },
          { category: regex },
          { badge: regex },
        ];
      }

      // 2. Build MongoDB sort object
      let sortObj = { id: 1 };
      if (sort === 'price-low') sortObj = { price: 1 };
      else if (sort === 'price-high') sortObj = { price: -1 };
      else if (sort === 'rating') sortObj = { rating: -1 };
      else if (sort === 'newest') sortObj = { createdAt: -1, id: -1 };

      const products = await Product.find(filter).sort(sortObj);

      return res.status(200).json({
        success: true,
        count: products.length,
        source: 'mongodb',
        data: products,
      });
    }

    // 2. Resilient Fallback
    let items = [...fallbackProducts];

    if (category && category !== 'all') {
      items = items.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (minPrice) items = items.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) items = items.filter((p) => p.price <= Number(maxPrice));
    if (inStockOnly === 'true') items = items.filter((p) => p.inStock);

    if (sort === 'price-low') items.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') items.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') items.sort((a, b) => b.rating - a.rating);
    else if (sort === 'newest') items.sort((a, b) => b.id - a.id);

    return res.status(200).json({
      success: true,
      count: items.length,
      source: 'fallback_store',
      data: items,
    });
  } catch (error) {
    console.error('[Products] Fetch error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving products.' });
  }
});

// ─── GET /api/products/:id ────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isDatabaseConnected()) {
      const product = await Product.findOne({ id });
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }
      return res.status(200).json({ success: true, source: 'mongodb', data: product });
    }

    const product = fallbackProducts.find((p) => p.id === id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.status(200).json({ success: true, source: 'fallback_store', data: product });
  } catch (error) {
    console.error('[Products] Find by ID error:', error);
    return res.status(500).json({ success: false, message: 'Error retrieving product.' });
  }
});

// ─── POST /api/products (Admin Only) ──────────────────────────────────────────
router.post('/', verifyToken, requireAdmin, validateProductInput, async (req, res) => {
  try {
    const newId = Date.now();
    const productPayload = {
      id: newId,
      name: req.body.name.trim(),
      category: req.body.category.trim(),
      price: Number(req.body.price),
      originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : undefined,
      rating: req.body.rating ? Number(req.body.rating) : 4.5,
      reviewsCount: req.body.reviewsCount ? Number(req.body.reviewsCount) : 0,
      badge: req.body.badge || '',
      image: req.body.image || '/images/placeholder.jpg',
      gallery: req.body.gallery || [req.body.image || '/images/placeholder.jpg'],
      description: req.body.description || '',
      inStock: req.body.inStock ?? true,
      stockCount: req.body.stockCount ? Number(req.body.stockCount) : 25,
      specs: req.body.specs || {},
      features: req.body.features || [],
    };

    if (isDatabaseConnected()) {
      const created = await Product.create(productPayload);
      return res.status(201).json({
        success: true,
        message: 'Product registered successfully in MongoDB!',
        data: created,
      });
    }

    fallbackProducts.unshift(productPayload);
    return res.status(201).json({
      success: true,
      message: 'Product registered successfully in catalog!',
      data: productPayload,
    });
  } catch (error) {
    console.error('[Products] Create error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
});

// ─── PUT /api/products/:id (Admin Only) ───────────────────────────────────────
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isDatabaseConnected()) {
      const updated = await Product.findOneAndUpdate({ id }, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }
      return res.status(200).json({
        success: true,
        message: 'Product updated successfully in MongoDB!',
        data: updated,
      });
    }

    const index = fallbackProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    fallbackProducts[index] = { ...fallbackProducts[index], ...req.body, id };
    return res.status(200).json({
      success: true,
      message: 'Product updated successfully!',
      data: fallbackProducts[index],
    });
  } catch (error) {
    console.error('[Products] Update error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
});

// ─── DELETE /api/products/:id (Admin Only) ────────────────────────────────────
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isDatabaseConnected()) {
      const deleted = await Product.findOneAndDelete({ id });
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }
      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully from MongoDB!',
        data: deleted,
      });
    }

    const index = fallbackProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const removed = fallbackProducts.splice(index, 1);
    return res.status(200).json({
      success: true,
      message: 'Product removed from catalog.',
      data: removed[0],
    });
  } catch (error) {
    console.error('[Products] Delete error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
});

export default router;
