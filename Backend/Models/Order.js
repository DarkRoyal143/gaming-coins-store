const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayOrderId: {
    type: String,
    sparse: true
  },
  razorpayPaymentId: {
    type: String,
    sparse: true
  },
  razorpaySignature: {
    type: String,
    sparse: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productDetails: {
    name: String,
    coins: Number,
    priceINR: Number,
    priceUSD: Number
  },
  customerEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  gameUID: {
    type: String,
    required: true
  },
  amountINR: Number,
  amountUSD: Number,
  currency: {
    type: String,
    enum: ['INR', 'USD'],
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: String,
  deliveryStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  deliveredAt: Date,
  webhookVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
