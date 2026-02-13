const mongoose = require('mongoose');
const Product = require('../models/Product');
const dotenv = require('dotenv');

dotenv.config();

const products = [
  {
    name: "Starter Pack",
    description: "Perfect for beginners",
    coins: 500,
    priceINR: 499,
    priceUSD: 5.99,
    popular: false,
    badge: "NEW",
    gameType: "bgmi"
  },
  {
    name: "Popular Pack",
    description: "Most bought package",
    coins: 1200,
    priceINR: 999,
    priceUSD: 11.99,
    popular: true,
    badge: "BEST SELLER",
    gameType: "bgmi"
  },
  {
    name: "Pro Pack",
    description: "For serious gamers",
    coins: 2500,
    priceINR: 1999,
    priceUSD: 23.99,
    popular: false,
    badge: "20% OFF",
    gameType: "bgmi"
  },
  {
    name: "Elite Pack",
    description: "Ultimate gaming experience",
    coins: 5000,
    priceINR: 3799,
    priceUSD: 44.99,
    popular: false,
    badge: "BEST VALUE",
    gameType: "bgmi"
  },
  {
    name: "Ultimate Pack",
    description: "Maximum coins",
    coins: 10000,
    priceINR: 6999,
    priceUSD: 84.99,
    popular: false,
    badge: "SAVE 15%",
    gameType: "bgmi"
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared products');

    await Product.insertMany(products);
    console.log('Products seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
