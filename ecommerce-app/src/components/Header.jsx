import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

  const [showMobileSearch, setShowMobileSearch] = useState(false)

  return (
    <header className="modern-header">
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <span>🚚 Free Shipping on Orders Over $50</span>
          <span className="divider">|</span>
          <span>📞 24/7 Customer Support</span>
          <span className="divider">|</span>
          <span>⚡ Same Day Shipping Available</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="header-wrapper">
          {/* Logo */}
          <div className="brand-logo" onClick={() => navigate('/')}>
            <div className="logo-text">
              <h1>LIGHT HUB CUSTOMS</h1>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <form className="search-bar-main desktop-search" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search by product, vehicle, or part number..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </form>

          {/* Header Actions */}
          <div className="header-icons">
            {/* Mobile Search Icon */}
            <button className="header-icon mobile-search-icon" onClick={() => setShowMobileSearch(!showMobileSearch)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <button className="header-icon" onClick={() => navigate('/track')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Track</span>
            </button>

            {isLoggedIn ? (
              <div className="profile-dropdown">
                <button className="header-icon" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>Account</span>
                </button>
                {showProfileMenu && (
                  <div className="dropdown-panel">
                    <Link to="/profile" onClick={() => setShowProfileMenu(false)}>My Profile</Link>
                    <Link to="/orders" onClick={() => setShowProfileMenu(false)}>Orders</Link>
                    <Link to="/wishlist" onClick={() => setShowProfileMenu(false)}>Wishlist</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <button className="header-icon" onClick={() => navigate('/login')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Login</span>
              </button>
            )}

            <button className="header-icon" onClick={() => navigate('/wishlist')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
            </button>

            <button className="header-icon cart" onClick={() => navigate('/cart')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 2L7 6M17 2l2 4M3 6h18M5 6l2 14h10l2-14" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Cart</span>
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-toggle" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="mobile-search-bar">
            <form onSubmit={(e) => { handleSearch(e); setShowMobileSearch(false); }}>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <button type="button" className="close-search" onClick={() => setShowMobileSearch(false)}>✕</button>
            </form>
          </div>
        )}
      </div>

      {/* Navigation Bar */}
      <nav className={`nav-bar ${showMobileMenu ? 'mobile-active' : ''}`}>
        <div className="nav-wrapper">
          <Link to="/shop" className="nav-link" onClick={() => setShowMobileMenu(false)}>
            SHOP ALL
          </Link>
          
          <div className="nav-dropdown">
            <button className="nav-link">
              CATEGORIES
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 9L1 4h10z"/>
              </svg>
            </button>
            <div className="mega-menu">
              <div className="mega-menu-content">
                {categories.map((cat, index) => (
                  <Link key={index} to={`/category/${cat}`} onClick={() => setShowMobileMenu(false)}>
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="nav-dropdown">
            <button className="nav-link">
              TOOLS
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 9L1 4h10z"/>
              </svg>
            </button>
            <div className="mega-menu">
              <div className="mega-menu-content">
                <Link to="/tools/bulb-finder" onClick={() => setShowMobileMenu(false)}>Bulb Size Finder</Link>
                <Link to="/tools/compatibility" onClick={() => setShowMobileMenu(false)}>Compatibility Checker</Link>
                <Link to="/tools/compare" onClick={() => setShowMobileMenu(false)}>Compare Products</Link>
                <Link to="/tools/fitment" onClick={() => setShowMobileMenu(false)}>Fitment Guide</Link>
              </div>
            </div>
          </div>

          <Link to="/about" className="nav-link" onClick={() => setShowMobileMenu(false)}>
            ABOUT
          </Link>
          <Link to="/contact" className="nav-link" onClick={() => setShowMobileMenu(false)}>
            CONTACT
          </Link>
          <Link to="/help" className="nav-link" onClick={() => setShowMobileMenu(false)}>
            SUPPORT
          </Link>
        </div>
      </nav>

      {showMobileMenu && <div className="mobile-backdrop" onClick={() => setShowMobileMenu(false)}></div>}
    </header>
  )
}

export default Header
