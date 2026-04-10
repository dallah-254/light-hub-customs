import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import DeliveryInfo from '../components/DeliveryInfo'

const Cart = () => {
  const navigate = useNavigate()
  const { cart, cartCount, removeFromCart, updateQuantity, getTotal, clearCart } = useCart()

  const handleCheckout = () => {
    const session = localStorage.getItem('userSession')
    if (!session) {
      alert('Please login to proceed to checkout')
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  if (cartCount === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <button className="shop-btn" onClick={() => navigate('/shop')}>
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart ({cartCount} items)</h1>
          <button className="clear-btn" onClick={clearCart}>Clear Cart</button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.productId} className="cart-item">
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">KSh {item.price.toFixed(2)}</p>
                </div>
                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                </div>
                <div className="item-total">
                  <p>KSh {(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.productId)}>×</button>
              </div>
            ))}
          </div>

          <div className="cart-sidebar">
            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>KSh {getTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{getTotal() > 5000 ? 'FREE' : 'KSh 200.00'}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>KSh {(getTotal() + (getTotal() > 5000 ? 0 : 200)).toFixed(2)}</span>
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
              <button className="continue-btn" onClick={() => navigate('/shop')}>
                Continue Shopping
              </button>
            </div>

            <DeliveryInfo />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
