const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { fullName, email, password, role, court, department } = req.body;
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    if (role === 'JUDGE' && !court) {
      return res.status(400).json({ message: 'Court is required for judge registration' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const user = await User.create({
      fullName,
      email,
      role,
      department: court || department,
      passwordHash: User.hashPassword(password)
    });
    res.status(201).json({ id: user._id, email: user.email });
  } catch (e) {
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, department: user.department },
      process.env.JWT_SECRET || 'devsecret',
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role, name: user.fullName, department: user.department }
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;


