import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      setCart(parsedCart)
      setCartCount(parsedCart.reduce((sum, item) => sum + item.quantity, 0))
    }
  }, [])

  const saveCart = (newCart) => {
    setCart(newCart)
    setCartCount(newCart.reduce((sum, item) => sum + item.quantity, 0))
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.productId === product.productId)
    
    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.productId === product.productId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
      saveCart(updatedCart)
    } else {
      const newItem = {
        productId: product.productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      }
      saveCart([...cart, newItem])
    }
    return true
  }

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.productId !== productId)
    saveCart(updatedCart)
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    const updatedCart = cart.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    )
    saveCart(updatedCart)
  }

  const clearCart = () => {
    saveCart([])
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal
    }}>
      {children}
    </CartContext.Provider>
  )
}
