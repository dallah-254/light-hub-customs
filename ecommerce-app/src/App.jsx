import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import './styles/index.css'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Categories from './pages/Categories.jsx'
import Category from './pages/Category.jsx'
import Section from './pages/Section.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Cart from './pages/Cart.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Checkout from './pages/Checkout.jsx'
import Orders from './pages/Orders.jsx'
import Profile from './pages/Profile.jsx'
import Tools from './pages/Tools.jsx'
import CompareProducts from './pages/CompareProducts.jsx'
import CompatibilityChecker from './pages/CompatibilityChecker.jsx'
import BulbFinder from './pages/BulbFinder.jsx'
import FitmentGuide from './pages/FitmentGuide.jsx'
import About from './pages/About.jsx'
import TrackOrder from './pages/TrackOrder.jsx'
import Help from './pages/Help.jsx'
import Contact from './pages/Contact.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={
              <>
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/category/:name" element={<Category />} />
                    <Route path="/section/:name" element={<Section />} />
                    <Route path="/product/:productId" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/tools" element={<Tools />} />
                    <Route path="/tools/compare" element={<CompareProducts />} />
                    <Route path="/tools/compatibility" element={<CompatibilityChecker />} />
                    <Route path="/tools/bulb-finder" element={<BulbFinder />} />
                    <Route path="/tools/fitment" element={<FitmentGuide />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/track" element={<TrackOrder />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
        </Router>
      </WishlistProvider>
    </CartProvider>
    </AuthProvider>
  )
}

export default App
