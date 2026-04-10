import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'

const Wishlist = () => {
  const navigate = useNavigate()
  const { wishlist, wishlistCount, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleAddToCart = (item) => {
    addToCart(item)
    removeFromWishlist(item.productId)
  }

  if (wishlistCount === 0) {
    return (
      <div className="wishlist-page">
        <h1>My Wishlist</h1>
        <div className="wishlist-empty">
          <span className="empty-icon">♥</span>
          <p>Your wishlist is empty</p>
          <button className="shop-btn" onClick={() => navigate('/shop')}>Start Shopping</button>
        </div>
      </div>
    )
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist ({wishlistCount} items)</h1>
      </div>

      <div className="wishlist-grid">
        {wishlist.map(item => (
          <div key={item.productId} className="wishlist-item">
            <button 
              className="remove-btn" 
              onClick={() => removeFromWishlist(item.productId)}
            >
              ×
            </button>
            <img 
              src={item.image} 
              alt={item.name} 
              onClick={() => navigate(`/product/${item.productId}`)}
            />
            <div className="item-info">
              <h3 onClick={() => navigate(`/product/${item.productId}`)}>{item.name}</h3>
              <p className="price">KSh {item.price.toFixed(2)}</p>
              <button 
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(item)}
              >
                🛒 Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist
