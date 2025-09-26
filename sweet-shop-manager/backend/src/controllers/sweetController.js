// C:/Users/prita/PycharmProjects/SweetShop/sweet-shop-manager/backend/src/controllers/sweetController.js
const Sweet = require('../models/Sweet');

// @desc    Get all sweets
// @route   GET /api/sweets
// @access  Public (for now)
exports.getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.status(200).json(sweets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add a new sweet
// @route   POST /api/sweets
// @access  Protected (will be Admin only later)
exports.addSweet = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    const newSweet = new Sweet({ name, category, price, quantity });
    const sweet = await newSweet.save();

    res.status(201).json(sweet);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ msg: messages.join(', ') });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Search for sweets
// @route   GET /api/sweets/search
// @access  Public (for now)
exports.searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice);
      }
    }
    const sweets = await Sweet.find(query);
    res.status(200).json(sweets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a sweet
// @route   PUT /api/sweets/:id
// @access  Protected (will be Admin only later)
exports.updateSweet = async (req, res) => {
  try {
    const updatedSweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedSweet) {
      return res.status(404).json({ msg: 'Sweet not found' });
    }

    res.status(200).json(updatedSweet);
  } catch (err) {
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid ID format' });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ msg: messages.join(', ') });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a sweet
// @route   DELETE /api/sweets/:id
// @access  Private/Admin
exports.deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ msg: 'Sweet not found' });
    }

    // Mongoose v6+ uses deleteOne() on the document instance
    await sweet.deleteOne();

    res.status(200).json({ msg: 'Sweet removed' });
  } catch (err) {
    // Handle invalid ID format
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid ID format' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


