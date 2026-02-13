const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  coins: {
    type: Number,
    required: true
  },
  priceINR: {
    type: Number,
    required: true
  },
  priceUSD: {
    type: Number,
    required: true
  },
  popular: {
    type: Boolean,
    default: false
  },
  badge: String,
  image: String,
  gameType: {
    type: String,
    enum: ['bgmi', 'freefire', 'valorant', 'cod'],
    default: 'bgmi'
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
