import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-purple-500/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Gaming Coins</h3>
            <p className="text-gray-400 text-sm">
              Your trusted source for instant in-game currency delivery.
              Safe, secure, and lightning fast.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-purple-400">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-purple-400">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-gray-400 hover:text-purple-400">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-purple-400">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-purple-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <span className="text-gray-400">Digital Goods Only</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Business Info</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Gaming Coins Store</li>
              <li>support@gamingcoins.com</li>
              <li>Mon - Sat: 24/7 Support</li>
              <li>GST: 123456789</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Gaming Coins Store. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            All game images and trademarks are property of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
