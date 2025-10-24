const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');


const router = express.Router();


// Create a product (protected -- in demo any authenticated user can create)
router.post('/', auth, async (req, res) => {
try {
const { name, description, price, stock } = req.body;
const p = new Product({ name, description, price, stock });
await p.save();
res.json(p);
} catch (err) {
console.error(err.message);
res.status(500).send('Server error');
}
});


// List products
router.get('/', async (req, res) => {
try {
const products = await Product.find();
res.json(products);
} catch (err) {
console.error(err.message);
res.status(500).send('Server error');
}
});


module.exports = router;