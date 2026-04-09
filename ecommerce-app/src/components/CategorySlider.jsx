import React from 'react'
import { useNavigate } from 'react-router-dom'
import './CategorySlider.css'

const CategorySlider = ({ categories }) => {
  const navigate = useNavigate()

  if (!categories || categories.length === 0) return null

  return (
    <div className="category-slider">
      <div className="category-slider-track">
        {categories.map((category, index) => (
          <div
            key={index}
            className="category-slide"
            onClick={() => navigate(`/category/${category}`)}
          >
            {category}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategorySlider
