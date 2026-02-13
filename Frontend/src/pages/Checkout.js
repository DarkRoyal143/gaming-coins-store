import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShieldCheckIcon, BoltIcon } from '@heroicons/react/24/solid';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};
  
  const [formData, setFormData] = useState({
    gameUID: '',
    email: '',
    currency: 'INR'
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!product) {
      navigate('/products');
    }
  }, [product, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!formData.gameUID || !formData.email) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        return;
      }

      // 2. Create order from backend
      const { data } = await axios.post(`${API_URL}/payments/create-order`, {
        productId: product._id,
        customerEmail: formData.email,
        gameUID: formData.gameUID,
        currency: formData.currency
      });

      // 3. Configure Razorpay options
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Gaming Coins Store',
        description: `${product.coins} Coins - ${product.name}`,
        image: '/logo.png',
        order_id: data.razorpayOrderId,
        handler: async (response) => {
          try {
            // 4. Verify payment on backend
            const verifyRes = await axios.post(`${API_URL}/payments/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: data.orderId
            });

            if (verifyRes.data.success) {
              toast.success('Payment successful!');
              navigate(`/order-success/${data.orderId}`);
            }
          } catch (error) {
            toast.error('Payment verification failed');
            console.error(error);
          }
        },
        prefill: {
          email: formData.email,
          contact: ''
        },
        notes: {
          gameUID: formData.gameUID,
          productId: product._id
        },
        theme: {
          color: '#7e22ce'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast('Payment cancelled', { icon: '⚠️' });
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create order');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-700">
              <span className="text-gray-400">Package</span>
              <span className="text-white font-semibold">{product.name}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Coins</span>
              <span className="text-purple-400 font-bold text-xl">
                {product.coins.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Price</span>
              <span className="text-white font-bold text-2xl">
                {formData.currency === 'INR' 
                  ? `₹${product.priceINR}` 
                  : `$${product.priceUSD}`}
              </span>
            </div>
            
            <div className="bg-purple-900/30 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2 text-purple-300">
                <BoltIcon className="h-5 w-5" />
                <span className="font-semibold">Instant Delivery</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Coins will be credited within 1-5 minutes after payment
              </p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Payment Details</h2>
          
          <form onSubmit={handlePayment} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Game UID *</label>
              <input
                type="text"
                required
                value={formData.gameUID}
                onChange={(e) => setFormData({...formData, gameUID: e.target.value})}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg 
                         text-white focus:outline-none focus:border-purple-500"
                placeholder="Enter your game ID"
              />
              <p className="text-xs text-gray-400 mt-1">
                Enter your in-game User ID carefully
              </p>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg 
                         text-white focus:outline-none focus:border-purple-500"
                placeholder="your@email.com"
              />
              <p className="text-xs text-gray-400 mt-1">
                Receipt and delivery status will be sent here
              </p>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Currency</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="INR"
                    checked={formData.currency === 'INR'}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                    className="text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-white">INR (₹)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="USD"
                    checked={formData.currency === 'USD'}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                    className="text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-white">USD ($)</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <ShieldCheckIcon className="h-5 w-5 text-green-400" />
              <span>Secure 256-bit SSL encrypted payment</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 
                       hover:from-purple-700 hover:to-blue-700 text-white font-bold 
                       rounded-lg transition-all transform hover:scale-[1.02] 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Pay ${formData.currency === 'INR' ? '₹' : '$'}
                ${formData.currency === 'INR' ? product.priceINR : product.priceUSD}`}
            </button>

            <p className="text-xs text-center text-gray-500">
              By completing this purchase, you agree to our{' '}
              <a href="/terms" className="text-purple-400 hover:underline">Terms</a>
              {' '}and{' '}
              <a href="/refund-policy" className="text-purple-400 hover:underline">Refund Policy</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
