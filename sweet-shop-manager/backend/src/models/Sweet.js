const mongoose = require('mongoose');

const SweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Sweet', SweetSchema);