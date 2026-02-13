import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Contact from './pages/Contact';
import RefundPolicy from './pages/RefundPolicy';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Navbar />
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#1f1f1f',
              color: '#fff',
              border: '1px solid #6b21a8'
            }
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
