import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategories, getProductsByCategory } from '../services/dynamodb'
import './Categories.css'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [categoryData, setCategoryData] = useState({})
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const cats = await getCategories()
    setCategories(cats)

    const data = {}
    for (const cat of cats) {
      const products = await getProductsByCategory(cat)
      data[cat] = {
        count: products.length,
        image: products[0]?.imageUrl || ''
      }
    }
    setCategoryData(data)
    setLoading(false)
  }

  if (loading) {
    return <div className="categories-page"><h2>Loading...</h2></div>
  }

  return (
    <div className="categories-page">
      <h1>All Categories</h1>
      <div className="categories-grid">
        {categories.map(category => (
          <div 
            key={category}
            className="category-card"
            onClick={() => navigate(`/category/${category}`)}
          >
            {categoryData[category]?.image && (
              <img src={categoryData[category].image} alt={category} />
            )}
            <div className="category-info">
              <h2>{category}</h2>
              <p>{categoryData[category]?.count || 0} Products</p>
              <button className="browse-btn">Browse →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categories
