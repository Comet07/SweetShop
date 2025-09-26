const express = require('express');
const router = express.Router();
const {
  getAllSweets,
  addSweet,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet // 1. Import the new restock function
} = require('../controllers/sweetController');

const { protect, authorize } = require('../middleware/authMiddleware');

// --- Public Routes ---
router.get('/', getAllSweets);
router.get('/search', searchSweets);
router.patch('/:id/purchase', purchaseSweet);

// --- Admin-Only Routes ---
router.post('/', protect, authorize('Admin'), addSweet);
router.put('/:id', protect, authorize('Admin'), updateSweet);
router.delete('/:id', protect, authorize('Admin'), deleteSweet);

// 2. Add the new admin-only PATCH route for restocking
router.patch('/:id/restock', protect, authorize('Admin'), restockSweet);

module.exports = router;