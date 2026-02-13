const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { productId, customerEmail, gameUID, currency = 'INR' } = req.body;

    // Validate required fields
    if (!productId || !customerEmail || !gameUID) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Calculate amount based on currency
    const amount = currency === 'INR' ? product.priceINR : product.priceUSD;
    const amountInPaise = Math.round(amount * 100); // Razorpay expects in paise/cents

    // Create order in database first
    const orderId = `ORD_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    
    const newOrder = await Order.create({
      orderId,
      productId: product._id,
      productDetails: {
        name: product.name,
        coins: product.coins,
        priceINR: product.priceINR,
        priceUSD: product.priceUSD
      },
      customerEmail,
      gameUID,
      amountINR: currency === 'INR' ? amount : product.priceINR,
      amountUSD: currency === 'USD' ? amount : product.priceUSD,
      currency,
      status: 'pending'
    });

    // Create Razorpay order
    const options = {
      amount: amountInPaise,
      currency: currency,
      receipt: orderId,
      notes: {
        orderId: orderId,
        productId: product._id.toString(),
        gameUID: gameUID,
        customerEmail: customerEmail
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Update order with Razorpay order ID
    newOrder.razorpayOrderId = razorpayOrder.id;
    await newOrder.save();

    res.json({
      success: true,
      orderId: newOrder.orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      product: product,
      customerEmail,
      gameUID
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// @desc    Verify Payment Signature
// @route   POST /api/payments/verify
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    // Generate signature for verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // Verify signature
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Find and update order
      const order = await Order.findOne({ orderId: orderId });
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      order.razorpayPaymentId = razorpay_payment_id;
      order.razorpaySignature = razorpay_signature;
      order.status = 'paid';
      order.deliveryStatus = 'processing';
      await order.save();

      res.json({
        success: true,
        message: 'Payment verified successfully',
        order: {
          id: order.orderId,
          status: order.status,
          productName: order.productDetails.name,
          coins: order.productDetails.coins,
          gameUID: order.gameUID
        }
      });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
};

// @desc    Webhook handler for Razorpay
// @route   POST /api/payments/webhook
exports.handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const event = req.body;
    
    // Handle payment captured event
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      
      // Find and update order
      const order = await Order.findOne({ razorpayOrderId });
      
      if (order) {
        order.status = 'paid';
        order.deliveryStatus = 'processing';
        order.razorpayPaymentId = payment.id;
        order.paymentMethod = payment.method;
        order.webhookVerified = true;
        await order.save();

        // Here you can trigger automated delivery process
        console.log(`Order ${order.orderId} verified via webhook`);
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// @desc    Get order by ID
// @route   GET /api/payments/order/:orderId
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      order: {
        id: order.orderId,
        status: order.status,
        deliveryStatus: order.deliveryStatus,
        productName: order.productDetails.name,
        coins: order.productDetails.coins,
        amount: order.currency === 'INR' ? order.amountINR : order.amountUSD,
        currency: order.currency,
        gameUID: order.gameUID,
        customerEmail: order.customerEmail,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};
