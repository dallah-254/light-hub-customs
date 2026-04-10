import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductsByCategory } from '../services/dynamodb'
import Carousel from '../components/Carousel'
import MarketingBar from '../components/MarketingBar'

const Category = () => {
  const { name } = useParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [name])

  const loadProducts = async () => {
    setLoading(true)
    const prods = await getProductsByCategory(name)
    setProducts(prods)
    setLoading(false)
  }

  if (loading) {
    return <div className="category-page"><h2>Loading...</h2></div>
  }

  return (
    <div className="category-page">
      <div className="category-banner">
        🎯 {name.toUpperCase()} | PREMIUM QUALITY PRODUCTS
      </div>

      {products.length > 0 && (
        <div className="category-hero">
          <Carousel products={products.slice(0, 3)} />
          <MarketingBar products={products} />
        </div>
      )}

      <div className="promo-strip">
        ✨ FREE SHIPPING | 💎 WARRANTY INCLUDED | 📞 24/7 SUPPORT
      </div>

      <h1>{name}</h1>
      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product, index) => (
            <React.Fragment key={product.productId}>
              <div 
                className="product-item"
                onClick={() => navigate(`/product/${product.productId}`)}
              >
                <img src={product.imageUrl} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="product-price">KSh {(product.price / 100).toFixed(2)}</p>
                {product.discount && <span className="discount-tag">{product.discount}</span>}
              </div>
              {(index + 1) % 8 === 0 && (
                <div className="inline-banner">
                  🔥 SHOP MORE, SAVE MORE!
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <p>No products found in this category</p>
        )}
      </div>

      <div className="bottom-adverts">
        <MarketingBar products={products.slice(0, Math.ceil(products.length / 3))} />
        <MarketingBar products={products.slice(Math.ceil(products.length / 3))} />
      </div>

      <div className="cta-strip">
        📞 NEED HELP CHOOSING? CALL/WHATSAPP: +254 712 345 678
      </div>
    </div>
  )
}

export default Category
