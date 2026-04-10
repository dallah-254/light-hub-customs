import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductsBySection } from '../services/dynamodb'
import Carousel from '../components/Carousel'

const Section = () => {
  const { name } = useParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [name])

  const loadProducts = async () => {
    setLoading(true)
    const prods = await getProductsBySection(name)
    setProducts(prods)
    setLoading(false)
  }

  const getSectionTitle = () => {
    const titles = {
      'carousel': '🎯 Carousel Products',
      'new-arrival': '✨ New Arrivals',
      'deal': '🔥 Hot Deals',
      'accessory': '🛠️ Accessories',
      'best-seller': '⭐ Best Sellers'
    }
    return titles[name] || name
  }

  if (loading) {
    return <div className="category-page"><h2>Loading...</h2></div>
  }

  return (
    <div className="category-page">
      <h1>{getSectionTitle()}</h1>
      
      {products.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <Carousel products={products} />
        </div>
      )}

      <div className="products-grid">
        {products.length > 0 ? (
          products.map(product => (
            <div 
              key={product.productId} 
              className="product-item"
              onClick={() => navigate(`/product/${product.productId}`)}
            >
              <img src={product.imageUrl} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="product-price">KSh {(product.price / 100).toFixed(2)}</p>
              {product.discount && <span className="discount-tag">{product.discount}</span>}
            </div>
          ))
        ) : (
          <p>No products found in this section</p>
        )}
      </div>
    </div>
  )
}

export default Section
