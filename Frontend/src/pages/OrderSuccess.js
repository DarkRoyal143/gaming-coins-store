import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/payments/order/${orderId}`);
        if (data.success) {
          setOrder(data.order);
        }
      } catch (error) {
        toast.error('Failed to fetch order details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircleIcon className="h-20 w-20 text-green-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          Payment Successful! 🎮
        </h1>
        
        <p className="text-gray-300 mb-8">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        <div className="bg-purple-900/30 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Delivery Status
          </h2>
          
          <div className="flex items-center justify-center gap-2 text-purple-300 mb-2">
            <ClockIcon className="h-5 w-5" />
            <span className="font-medium">Processing</span>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4 mt-4">
            <p className="text-lg text-purple-400 font-bold">
              ⚡ Coins will be credited within 1-5 minutes
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Please keep the game open and wait while we deliver your coins
            </p>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-6 mb-8 text-left">
          <h3 className="text-white font-semibold mb-4">Order Details</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Order ID:</span>
              <span className="text-white font-mono">{order?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Package:</span>
              <span className="text-white">{order?.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Coins:</span>
              <span className="text-purple-400 font-bold">
                {order?.coins.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Game UID:</span>
              <span className="text-white">{order?.gameUID}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Amount Paid:</span>
              <span className="text-white">
                {order?.currency === 'INR' ? '₹' : '$'}
                {order?.currency === 'INR' ? order?.amount : order?.amount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Email:</span>
              <span className="text-white">{order?.customerEmail}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/products"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg 
                     transition-colors font-medium"
          >
            Buy More Coins
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg 
                     transition-colors font-medium"
          >
            Contact Support
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-8">
          A confirmation email has been sent to {order?.customerEmail}
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;
