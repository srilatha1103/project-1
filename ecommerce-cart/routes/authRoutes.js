const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const router = express.Router();


// Register
router.post('/register', async (req, res) => {
try {
const { name, email, password } = req.body;
if (!name || !email || !password) return res.status(400).json({ msg: 'Please provide name, email and password' });


let user = await User.findOne({ email });
if (user) return res.status(400).json({ msg: 'User already exists' });


user = new User({ name, email, password });
await user.save();


const payload = { user: { id: user._id } };
const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
res.json({ token });
} catch (err) {
console.error(err.message);
res.status(500).send('Server error');
}
});


// Login
router.post('/login', async (req, res) => {
try {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ msg: 'Please provide email and password' });


const user = await User.findOne({ email });
if (!user) return res.status(400).json({ msg: 'Invalid credentials' });


const isMatch = await user.comparePassword(password);
if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });


const payload = { user: { id: user._id } };
const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
res.json({ token });
} catch (err) {
console.error(err.message);
res.status(500).send('Server error');
}
});


module.exports = router;