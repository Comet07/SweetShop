const express = require('express');
const router = express.Router();
const { getAllSweets, addSweet, searchSweets, updateSweet} = require('../controllers/sweetController');

// GET all sweets
router.get('/', getAllSweets);

// GET /api/sweets/search - This route handles searching for sweets
router.get('/search', searchSweets);

// POST a new sweet
router.post('/', addSweet);

//PUT a sweet by ID
router.put('/:id', updateSweet);

module.exports = router;