import React, { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext()

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([])
  const [wishlistCount, setWishlistCount] = useState(0)

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      const parsedWishlist = JSON.parse(savedWishlist)
      setWishlist(parsedWishlist)
      setWishlistCount(parsedWishlist.length)
    }
  }, [])

  const saveWishlist = (newWishlist) => {
    setWishlist(newWishlist)
    setWishlistCount(newWishlist.length)
    localStorage.setItem('wishlist', JSON.stringify(newWishlist))
  }

  const addToWishlist = (product) => {
    const exists = wishlist.find(item => item.productId === product.productId)
    if (!exists) {
      saveWishlist([...wishlist, product])
      return true
    }
    return false
  }

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter(item => item.productId !== productId)
    saveWishlist(updatedWishlist)
  }

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.productId === productId)
  }

  const clearWishlist = () => {
    saveWishlist([])
  }

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistCount,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  )
}
