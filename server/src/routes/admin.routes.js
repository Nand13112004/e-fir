const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Complaint = require('../models/Complaint');

const router = express.Router();

router.get('/stats', auth(['ADMIN']), async (req, res, next) => {
  try {
    const [totalComplaints, closedComplaints, judges, police] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'CLOSED' }),
      User.countDocuments({ role: 'JUDGE' }),
      User.countDocuments({ role: 'POLICE' })
    ]);
    res.json({ totalComplaints, closedComplaints, judges, police });
  } catch (e) {
    next(e);
  }
});

router.get('/users', auth(['ADMIN']), async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (e) {
    next(e);
  }
});

router.post('/users', auth(['ADMIN']), async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const user = await User.create({
      fullName,
      email,
      role,
      passwordHash: User.hashPassword(password)
    });
    res.status(201).json({ id: user._id, email: user.email, role: user.role });
  } catch (e) {
    next(e);
  }
});

module.exports = router;


