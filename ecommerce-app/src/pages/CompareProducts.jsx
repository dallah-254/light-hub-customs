import React, { useState, useEffect } from 'react'
import { getProductsByCategory, getCategories } from '../services/dynamodb'
import './CompareProducts.css'

const CompareProducts = () => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([null, null, null])

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const cats = await getCategories()
    setCategories(cats)
  }

  const handleCategoryChange = async (category) => {
    setSelectedCategory(category)
    const prods = await getProductsByCategory(category)
    setProducts(prods)
    setSelectedProducts([null, null, null])
  }

  const handleProductSelect = (index, productId) => {
    const product = products.find(p => p.productId === productId)
    const newSelected = [...selectedProducts]
    newSelected[index] = product
    setSelectedProducts(newSelected)
  }

  const clearComparison = () => {
    setSelectedProducts([null, null, null])
  }

  return (
    <div className="compare-page">
      <h1>⚖️ Compare Products</h1>
      <p className="subtitle">Select up to 3 products to compare side by side</p>

      <div className="compare-controls">
        <select 
          value={selectedCategory} 
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="category-select"
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button onClick={clearComparison} className="clear-btn">Clear All</button>
      </div>

      <div className="compare-grid">
        {[0, 1, 2].map(index => (
          <div key={index} className="compare-slot">
            <select
              value={selectedProducts[index]?.productId || ''}
              onChange={(e) => handleProductSelect(index, e.target.value)}
              className="product-select"
              disabled={!selectedCategory}
            >
              <option value="">Select Product {index + 1}</option>
              {products.map(product => (
                <option key={product.productId} value={product.productId}>
                  {product.name}
                </option>
              ))}
            </select>

            {selectedProducts[index] && (
              <div className="product-compare-card">
                <img src={selectedProducts[index].imageUrl} alt={selectedProducts[index].name} />
                <h3>{selectedProducts[index].name}</h3>
                <div className="compare-price">
                  KSh {(selectedProducts[index].price / 100).toFixed(2)}
                </div>
                {selectedProducts[index].discount && (
                  <span className="compare-badge">{selectedProducts[index].discount}</span>
                )}
                <div className="compare-details">
                  <div className="detail-row">
                    <strong>Category:</strong>
                    <span>{selectedProducts[index].category}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Description:</strong>
                    <span>{selectedProducts[index].description}</span>
                  </div>
                  {selectedProducts[index].specifications && (
                    <div className="detail-row">
                      <strong>Specifications:</strong>
                      <span>{selectedProducts[index].specifications}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompareProducts
