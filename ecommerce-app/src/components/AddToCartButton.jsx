import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import './AddToCartButton.css'

const AddToCartButton = ({ product, quantity = 1, className = '' }) => {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button 
      className={`add-to-cart-btn ${added ? 'added' : ''} ${className}`}
      onClick={handleAddToCart}
    >
      {added ? (
        <>
          <span className="check-icon">✓</span> Added to Cart
        </>
      ) : (
        <>
          <span className="cart-icon">🛒</span> Add to Cart
        </>
      )}
    </button>
  )
}

export default AddToCartButton
