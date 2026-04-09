import React, { useState, useEffect } from 'react'
import Carousel from '../components/Carousel'
import MarketingBar from '../components/MarketingBar'
import CategorySlider from '../components/CategorySlider'
import SectionBar from '../components/SectionBar'
import { getProductsBySection, getCategories, getProductsByCategory } from '../services/dynamodb'
import { useNavigate } from 'react-router-dom'
import './homepage.css'

const Home = () => {
  const [carouselProducts, setCarouselProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryProducts, setCategoryProducts] = useState({})
  const [allProducts, setAllProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const carousel = await getProductsBySection('carousel')
      setCarouselProducts(carousel)

      const featured = await getProductsBySection('deal')
      setFeaturedProducts(featured)

      const cats = await getCategories()
      setCategories(cats)

      // Load products for each category
      const productsMap = {}
      const allProds = []
      for (const cat of cats) {
        const products = await getProductsByCategory(cat)
        productsMap[cat] = products.slice(0, 4) // Show only 4 products per category
        allProds.push(...products)
      }
      setCategoryProducts(productsMap)
      setAllProducts(allProds)
    } catch (error) {
      console.error('Error loading products:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="home"><h2>Loading...</h2></div>
  }

  return (
    <div className="home">
      <div className="hero-section">
        {carouselProducts.length > 0 && <Carousel products={carouselProducts} />}
        <MarketingBar products={allProducts} />
      </div>

      <SectionBar />

      {categories.map(category => (
        categoryProducts[category]?.length > 0 && (
          <section key={category} className="category-section">
            <div className="category-card">
              <div className="category-card-header">
                <h2>{category}</h2>
                <button className="view-all-btn" onClick={() => navigate(`/category/${category}`)}>
                  View All →
                </button>
              </div>
              <div className="product-grid">
                {categoryProducts[category].map(product => (
                  <div 
                    key={product.productId} 
                    className="product-card"
                    onClick={() => navigate(`/product/${product.productId}`)}
                  >
                    <img src={product.imageUrl} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p className="price">KSh {(product.price / 100).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      ))}

      {featuredProducts.length > 0 && (
        <div className="bottom-carousel-section">
          <h2 className="section-title">🔥 Flash Deals</h2>
          <Carousel products={featuredProducts} />
        </div>
      )}
    </div>
  )
}

export default Home
