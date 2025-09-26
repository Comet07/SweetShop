const express = require('express');
const router = express.Router();
const { getAllSweets,
    addSweet,
    searchSweets,
    updateSweet,
    deleteSweet } = require('../controllers/sweetController');

const { protect, authorize } = require('../middleware/authMiddleware')

// ---Public Routes ---
router.get('/', getAllSweets);
router.get('/search', searchSweets);


// ---Admin-Only---

// POST a new sweet
router.post('/',protect, authorize('Admin') ,addSweet);
//PUT a sweet by ID
router.put('/:id',protect, authorize('Admin') ,updateSweet);

//Delete a sweet by id
router.delete('/:id',protect, authorize('Admin') ,deleteSweet);
module.exports = router;