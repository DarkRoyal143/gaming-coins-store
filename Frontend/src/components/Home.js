import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BoltIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  ClockIcon 
} from '@heroicons/react/24/solid';

const Home = () => {
  const featuredProducts = [
    { coins: 500, price: 499, popular: false },
    { coins: 1200, price: 999, popular: true },
    { coins: 2500, price: 1999, popular: false },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Instant Game Coins
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get your favorite in-game currency delivered instantly. 
              Safe, secure, and lightning fast!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 
                         text-white font-bold rounded-lg hover:scale-105 transition-transform"
              >
                Shop Now
              </Link>
              <button className="px-8 py-4 border-2 border-purple-500 text-white 
                               font-bold rounded-lg hover:bg-purple-500/20 transition-colors">
                How It Works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <BoltIcon className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold">Instant Delivery</h3>
              <p className="text-sm text-gray-400">Within 1-5 minutes</p>
            </div>
            <div className="text-center p-4">
              <ShieldCheckIcon className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold">Secure Payments</h3>
              <p className="text-sm text-gray-400">256-bit SSL</p>
            </div>
            <div className="text-center p-4">
              <CurrencyDollarIcon className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold">Best Prices</h3>
              <p className="text-sm text-gray-400">Cheapest rates</p>
            </div>
            <div className="text-center p-4">
              <ClockIcon className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold">24/7 Support</h3>
              <p className="text-sm text-gray-400">Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Popular Packages
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div key={index} 
                   className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl border 
                              ${product.popular ? 'border-purple-500' : 'border-gray-700'} 
                              p-6 hover:scale-105 transition-transform relative`}>
                {product.popular && (
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 
                                 bg-gradient-to-r from-purple-600 to-pink-600 
                                 text-white px-4 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </span>
                )}
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {product.coins.toLocaleString()}
                  </h3>
                  <p className="text-gray-400 mb-4">Game Coins</p>
                  <div className="text-2xl font-bold text-purple-400 mb-6">
                    ₹{product.price}
                  </div>
                  <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 
                                   text-white rounded-lg font-semibold transition-colors">
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-900/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {[
              {
                q: "How fast is the delivery?",
                a: "Coins are delivered within 1-5 minutes after successful payment."
              },
              {
                q: "Is it safe to buy coins?",
                a: "Yes, we use bank-grade encryption and have delivered millions of coins safely."
              },
              {
                q: "Do you offer refunds?",
                a: "Due to the digital nature of our products, we don't offer refunds after delivery."
              },
              {
                q: "What games do you support?",
                a: "We support BGMI, Free Fire, Valorant, Call of Duty, and many more."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-800/30 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
