import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './MarketingBar.css'

const MarketingBar = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [colorIndex, setColorIndex] = useState(0)
  const navigate = useNavigate()

  const colors = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444']

  useEffect(() => {
    if (products.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [products.length])

  useEffect(() => {
    const colorInterval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length)
    }, 1000)
    return () => clearInterval(colorInterval)
  }, [])

  if (!products || products.length === 0) return null

  const currentProduct = products[currentIndex]

  const handleClick = () => {
    navigate(`/product/${currentProduct.productId}`)
  }

  return (
    <div className="marketing-bar" onClick={handleClick}>
      <div className="marketing-image">
        <img src={currentProduct.imageUrl} alt={currentProduct.name} />
      </div>
      <div className="marketing-cta" style={{ background: colors[colorIndex] }}>
        📞 Call/WhatsApp: +254 712 345 678
      </div>
    </div>
  )
}

export default MarketingBar
