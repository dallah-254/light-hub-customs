import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Carousel.css'

const Carousel = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [products.length])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const handleSeeMore = () => {
    navigate(`/product/${products[currentIndex].productId}`)
  }

  const handleInfo = () => {
    navigate(`/product/${products[currentIndex].productId}`)
  }

  if (!products || products.length === 0) return null

  return (
    <div className="carousel">
      <button className="carousel-btn prev" onClick={goToPrevious}>‹</button>
      <div className="carousel-content">
        <img src={products[currentIndex].imageUrl} alt={products[currentIndex].name} />
        <div className="carousel-info">
          <h2>{products[currentIndex].name}</h2>
          <p>{products[currentIndex].description}</p>
          <div className="carousel-price">KSh {(products[currentIndex].price / 100).toFixed(2)}</div>
          <div className="carousel-buttons">
            <button className="see-more-btn" onClick={handleSeeMore}>See More</button>
            <button className="info-btn" onClick={handleInfo}>Info</button>
          </div>
        </div>
      </div>
      <button className="carousel-btn next" onClick={goToNext}>›</button>
      <div className="carousel-dots">
        {products.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel
