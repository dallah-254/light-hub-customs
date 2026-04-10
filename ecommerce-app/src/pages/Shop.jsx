import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Carousel from '../components/Carousel'
import MarketingBar from '../components/MarketingBar'
import SectionBar from '../components/SectionBar'
import { getProductsBySection, getCategories, getProductsByCategory } from '../services/dynamodb'

const Shop = () => {
  const [searchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [categoryProducts, setCategoryProducts] = useState({})
  const [newArrivals, setNewArrivals] = useState([])
  const [deals, setDeals] = useState([])
  const [accessories, setAccessories] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    const query = searchParams.get('search')
    if (query) {
      setSearchQuery(query)
      filterProducts(query)
    } else {
      setSearchQuery('')
      setFilteredProducts([])
    }
  }, [searchParams, allProducts])

  const loadProducts = async () => {
    try {
      const cats = await getCategories()
      setCategories(cats)

      const newArr = await getProductsBySection('new-arrival')
      setNewArrivals(newArr)

      const dealsData = await getProductsBySection('deal')
      setDeals(dealsData)

      const acc = await getProductsBySection('accessory')
      setAccessories(acc)

      const carousel = await getProductsBySection('carousel')
      const bestSeller = await getProductsBySection('best-seller')

      const productsMap = {}
      const allProds = []
      for (const cat of cats) {
        const products = await getProductsByCategory(cat)
        productsMap[cat] = products.slice(0, 4)
        allProds.push(...products)
      }
      setCategoryProducts(productsMap)
      setAllProducts([...allProds, ...carousel, ...bestSeller])
    } catch (error) {
      console.error('Error loading products:', error)
    }
    setLoading(false)
  }

  const filterProducts = (query) => {
    const lowerQuery = query.toLowerCase()
    const filtered = allProducts.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description?.toLowerCase().includes(lowerQuery) ||
      product.category?.toLowerCase().includes(lowerQuery)
    )
    setFilteredProducts(filtered)
  }

  if (loading) {
    return <div className="shop-page"><h2>Loading...</h2></div>
  }

  if (searchQuery && filteredProducts.length >= 0) {
    return (
      <div className="shop-page">
        <div className="search-results">
          <h2>Search Results for "{searchQuery}"</h2>
          <p>{filteredProducts.length} products found</p>
          
          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <p>No products found matching your search.</p>
              <button onClick={() => navigate('/shop')}>View All Products</button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div 
                  key={product.productId} 
                  className="product-card"
                  onClick={() => navigate(`/product/${product.productId}`)}
                >
                  <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p className="price">KSh {product.price.toFixed(2)}</p>
                  <button className="add-to-cart-btn">View Details</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="shop-page">
      <div className="promo-banner">
        🎉 FREE SHIPPING ON ORDERS OVER KSH 5,000 | 24/7 SUPPORT | SAME DAY INSTALLATION
      </div>

      <SectionBar />

      <div className="shop-hero">
        {newArrivals.length > 0 && (
          <div className="shop-carousel">
            <Carousel products={newArrivals} />
          </div>
        )}
        <MarketingBar products={allProducts} />
      </div>

      <div className="flash-banner">
        ⚡ FLASH SALE - LIMITED TIME ONLY ⚡
      </div>

      {deals.length > 0 && (
        <div className="shop-section">
          <div className="section-header">
            <h2>🔥 Hot Deals</h2>
            <button className="view-btn" onClick={() => navigate('/section/deal')}>View All →</button>
          </div>
          <div className="products-container">
            {deals.map(product => (
              <div 
                key={product.productId} 
                className="shop-product-card"
                onClick={() => navigate(`/product/${product.productId}`)}
              >
                <img src={product.imageUrl} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="price">KSh {(product.price / 100).toFixed(2)}</p>
                {product.discount && <span className="badge">{product.discount}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mini-banner">
        ⭐ BEST SELLERS | TRUSTED BY 1000+ CUSTOMERS
      </div>

      <div className="advert-section">
        <MarketingBar products={deals.length > 0 ? deals : allProducts} />
        <MarketingBar products={accessories.length > 0 ? accessories : allProducts} />
        <MarketingBar products={newArrivals.length > 0 ? newArrivals : allProducts} />
      </div>

      <div className="mini-banner alt">
        🎯 UPGRADE YOUR RIDE TODAY
      </div>

      {accessories.length > 0 && (
        <div className="shop-section">
          <div className="section-header">
            <h2>🛠️ Accessories</h2>
            <button className="view-btn" onClick={() => navigate('/section/accessory')}>View All →</button>
          </div>
          <div className="products-container">
            {accessories.map(product => (
              <div 
                key={product.productId} 
                className="shop-product-card"
                onClick={() => navigate(`/product/${product.productId}`)}
              >
                <img src={product.imageUrl} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="price">KSh {(product.price / 100).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="info-banner">
        💎 PREMIUM QUALITY | ✅ WARRANTY INCLUDED | 🚚 FAST DELIVERY
      </div>

      {categories.map((category, index) => (
        categoryProducts[category]?.length > 0 && (
          <React.Fragment key={category}>
            <div className="shop-section">
              <div className="section-header">
                <h2>{category}</h2>
                <button className="view-btn" onClick={() => navigate(`/category/${category}`)}>View All →</button>
              </div>
              <div className="products-container">
                {categoryProducts[category].map(product => (
                  <div 
                    key={product.productId} 
                    className="shop-product-card"
                    onClick={() => navigate(`/product/${product.productId}`)}
                  >
                    <img src={product.imageUrl} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p className="price">KSh {(product.price / 100).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
            {index % 2 === 0 ? (
              <div className="mini-banner">
                💡 BRIGHTEN YOUR JOURNEY | SHOP WITH CONFIDENCE
              </div>
            ) : (
              newArrivals.length > 0 && index === 1 && (
                <div style={{ margin: '1rem 0' }}>
                  <Carousel products={newArrivals} />
                </div>
              )
            )}
          </React.Fragment>
        )
      ))}

      <div className="cta-banner">
        📞 NEED HELP? CALL/WHATSAPP: +254 712 345 678
      </div>
    </div>
  )
}

export default Shop
