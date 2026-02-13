const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyPayment,
  handleWebhook,
  getOrder
} = require('../controllers/paymentController');

router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);
router.post('/webhook', handleWebhook);
router.get('/order/:orderId', getOrder);

module.exports = router;
