import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Header.css'
import { getCategories } from '../services/dynamodb'
import { signOut } from '../services/auth'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const Header = () => {
  const [categories, setCategories] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()

  useEffect(() => {
    fetchCategories()
    checkLoginStatus()
  }, [])

  const fetchCategories = async () => {
    const cats = await getCategories()
    setCategories(cats)
  }

  const checkLoginStatus = () => {
    const session = localStorage.getItem('userSession')
    if (session) {
      const userData = JSON.parse(session)
      setIsLoggedIn(true)
      setUserEmail(userData.email)
    }
  }

  const handleLogout = () => {
    signOut()
    setIsLoggedIn(false)
    setUserEmail('')
    setShowProfileMenu(false)
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="header">
      <div className="top-bar">
        <div className="top-bar-container">
          <div className="promo">🎉 Free Shipping on Orders Over $50 | 24/7 Support</div>
          <div className="top-links">
            <Link to="/track">Track Order</Link>
            <Link to="/help">Help</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>
      <div className="main-header">
        <div className="header-container">
          <div className="logo" onClick={() => navigate('/')}>
            <h1>LIGHT HUB CUSTOMS</h1>
            <span className="tagline">Premium Custom Products</span>
          </div>

          {/* Hamburger Menu Button */}
          <button 
            className="hamburger-btn" 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Desktop Navigation */}
          <nav className={`nav ${showMobileMenu ? 'mobile-open' : ''}`}>
            <Link to="/" onClick={() => setShowMobileMenu(false)}>Home</Link>
            <Link to="/shop" onClick={() => setShowMobileMenu(false)}>Shop</Link>
            <div className="dropdown">
              <Link to="/categories">Categories ▾</Link>
              <div className="dropdown-menu">
                {categories.map((cat, index) => (
                  <Link key={index} to={`/category/${cat}`} onClick={() => setShowMobileMenu(false)}>{cat}</Link>
                ))}
              </div>
            </div>
            <div className="dropdown">
              <Link to="/tools">Tools ▾</Link>
              <div className="dropdown-menu">
                <Link to="/tools/compare" onClick={() => setShowMobileMenu(false)}>Compare Products</Link>
                <Link to="/tools/compatibility" onClick={() => setShowMobileMenu(false)}>Compatibility Checker</Link>
                <Link to="/tools/bulb-finder" onClick={() => setShowMobileMenu(false)}>Bulb Size Finder</Link>
                <Link to="/tools/fitment" onClick={() => setShowMobileMenu(false)}>Fitment Guide</Link>
              </div>
            </div>
            <Link to="/about" onClick={() => setShowMobileMenu(false)}>About</Link>

            {/* Mobile Only Items */}
            <div className="mobile-only">
              {isLoggedIn ? (
                <>
                  <Link to="/profile" onClick={() => setShowMobileMenu(false)}>Profile</Link>
                  <Link to="/orders" onClick={() => setShowMobileMenu(false)}>Orders</Link>
                  <Link to="/wishlist" onClick={() => setShowMobileMenu(false)}>Wishlist</Link>
                  <button onClick={() => { handleLogout(); setShowMobileMenu(false); }} className="mobile-logout">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setShowMobileMenu(false)}>Login</Link>
                  <Link to="/register" onClick={() => setShowMobileMenu(false)}>Register</Link>
                </>
              )}
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="header-actions">
            <form className="search-box" onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">🔍</button>
            </form>
            
            {isLoggedIn ? (
              <div className="profile-dropdown">
                <button 
                  className="profile-btn" 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <span className="profile-icon">👤</span>
                  <span className="profile-email">{userEmail.split('@')[0]}</span>
                  <span className="arrow">▾</span>
                </button>
                {showProfileMenu && (
                  <div className="profile-menu">
                    <Link to="/profile" onClick={() => setShowProfileMenu(false)}>Profile</Link>
                    <Link to="/orders" onClick={() => setShowProfileMenu(false)}>Orders</Link>
                    <Link to="/wishlist" onClick={() => setShowProfileMenu(false)}>Wishlist</Link>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button className="auth-btn" onClick={() => navigate('/login')}>Login</button>
                <button className="auth-btn secondary" onClick={() => navigate('/register')}>Register</button>
              </>
            )}
            
            <button className="icon-btn wishlist-icon" onClick={() => navigate('/wishlist')}>
              <span className="icon">♥</span>
              {wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
            </button>
            <button className="cart-btn" onClick={() => navigate('/cart')}>
              <span className="cart-icon">🛒</span>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {showMobileMenu && (
        <div className="mobile-overlay" onClick={() => setShowMobileMenu(false)}></div>
      )}
    </header>
  )
}

export default Header
