const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/cart -> add/update item
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    const qty = Number(quantity) || 1;

    if (!productId) return res.status(400).json({ msg: 'productId is required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    if (product.stock < qty) return res.status(400).json({ msg: 'Insufficient stock' });

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity: qty }] });
    } else {
      const idx = cart.items.findIndex(i => i.productId.toString() === productId);
      if (idx > -1) {
        cart.items[idx].quantity += qty;
        // ensure quantity does not exceed stock
        if (cart.items[idx].quantity > product.stock) cart.items[idx].quantity = product.stock;
      } else {
        cart.items.push({ productId, quantity: qty });
      }
    }

    await cart.save();
    const populated = await cart.populate('items.productId');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /api/cart -> get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT /api/cart -> modify item quantity or remove if quantity=0
router.put('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId) return res.status(400).json({ msg: 'productId is required' });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });

    const idx = cart.items.findIndex(i => i.productId.toString() === productId);
    if (idx === -1) return res.status(404).json({ msg: 'Product not in cart' });

    if (Number(quantity) <= 0) {
      // remove item
      cart.items.splice(idx, 1);
    } else {
      // check stock and set new quantity
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ msg: 'Product not found' });
      cart.items[idx].quantity = Math.min(Number(quantity), product.stock);
    }

    await cart.save();
    res.json(await cart.populate('items.productId'));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
