import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById, getProductsByCategory } from '../services/dynamodb'
import AddToCartButton from '../components/AddToCartButton'
import { useWishlist } from '../context/WishlistContext'

const ProductDetails = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [inWishlist, setInWishlist] = useState(false)

  useEffect(() => {
    loadProduct()
  }, [productId])

  const loadProduct = async () => {
    const data = await getProductById(productId)
    setProduct(data)
    setSelectedImage(0)
    setInWishlist(isInWishlist(productId))
    
    if (data?.category) {
      const related = await getProductsByCategory(data.category)
      setRelatedProducts(related.filter(p => p.productId !== productId))
    }
    
    setLoading(false)
  }

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(productId)
      setInWishlist(false)
    } else {
      addToWishlist({
        productId: product.productId,
        name: product.name,
        price: product.price / 100,
        image: product.imageUrl
      })
      setInWishlist(true)
    }
  }

  if (loading) {
    return <div className="product-details"><h2>Loading...</h2></div>
  }

  if (!product) {
    return <div className="product-details"><h2>Product not found</h2></div>
  }

  // Create array of images (main image repeated for demo - in real app would be multiple images)
  const images = [product.imageUrl, product.imageUrl, product.imageUrl]

  return (
    <div className="product-details">
      <div className="product-container">
        <div className="product-image-section">
          <div className="main-image">
            <img src={images[selectedImage]} alt={product.name} />
          </div>
          <div className="image-thumbnails">
            {images.map((img, index) => (
              <div 
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={img} alt={`${product.name} ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="product-info-section">
          <h1>{product.name}</h1>
          <div className="product-price">KSh {(product.price / 100).toFixed(2)}</div>
          {product.discount && <div className="discount-badge">{product.discount}</div>}

          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">Brand:</span>
              <span className="meta-value">Light Hub Customs</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Category:</span>
              <span className="meta-value">{product.category}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Availability:</span>
              <span className="meta-value in-stock">✓ In Stock</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">SKU:</span>
              <span className="meta-value">{product.productId}</span>
            </div>
          </div>

          <div className="quantity-selector">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button>-</button>
              <input type="number" value="1" min="1" readOnly />
              <button>+</button>
            </div>
          </div>

          <div className="action-buttons">
            <AddToCartButton 
              product={{
                productId: product.productId,
                name: product.name,
                price: product.price / 100,
                image: product.imageUrl
              }}
              className="product-add-to-cart"
            />
            <button className="wishlist-btn" onClick={handleWishlistToggle}>
              {inWishlist ? '❤️ In Wishlist' : '♥ Add to Wishlist'}
            </button>
            <button className="compare-btn">⚖ Compare</button>
          </div>

          <div className="product-features">
            <div className="feature">
              <span className="feature-icon">🚚</span>
              <div>
                <strong>Free Delivery</strong>
                <p>On orders over KSh 5,000</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">↩️</span>
              <div>
                <strong>Easy Returns</strong>
                <p>30-day return policy</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">✓</span>
              <div>
                <strong>Warranty</strong>
                <p>1 year manufacturer warranty</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">🔒</span>
              <div>
                <strong>Secure Payment</strong>
                <p>100% secure transactions</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <div>
                <strong>Fast Processing</strong>
                <p>Same day dispatch available</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">💬</span>
              <div>
                <strong>24/7 Support</strong>
                <p>Expert customer service</p>
              </div>
            </div>
          </div>

          <div className="share-section">
            <span>Share:</span>
            <div className="share-buttons">
              <button 
                className="share-btn facebook"
                onClick={() => {
                  const url = window.location.href
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
              <button 
                className="share-btn twitter"
                onClick={() => {
                  const text = `Check out ${product.name} at Light Hub Customs!`
                  const url = window.location.href
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter
              </button>
              <button 
                className="share-btn whatsapp"
                onClick={() => {
                  const text = `🛒 *${product.name}*\n\n💰 Price: KSh ${(product.price / 100).toFixed(2)}\n\n📦 Available at Light Hub Customs\n\n🔗 ${window.location.href}\n\n${product.imageUrl}`
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </button>
              <button 
                className="share-btn email"
                onClick={() => {
                  const subject = `Check out ${product.name}`
                  const body = `Hi,\n\nI found this amazing product at Light Hub Customs:\n\n${product.name}\nPrice: KSh ${(product.price / 100).toFixed(2)}\n\nView it here: ${window.location.href}\n\nProduct Image: ${product.imageUrl}`
                  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Email
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="product-details-section">
        <div className="details-tabs">
          <button className="tab active">Description</button>
          <button className="tab">Specifications</button>
          <button className="tab">Reviews</button>
        </div>

        <div className="tab-content">
          <div className="info-block">
            <h3>Product Description</h3>
            <p>{product.description}</p>
          </div>

          {product.specifications && (
            <div className="info-block">
              <h3>Technical Specifications</h3>
              <p>{product.specifications}</p>
            </div>
          )}

          <div className="info-block">
            <h3>Key Features</h3>
            <ul className="features-list">
              <li>Premium quality materials</li>
              <li>Easy installation</li>
              <li>Compatible with most vehicles</li>
              <li>Long-lasting durability</li>
              <li>Professional grade performance</li>
              <li>Weather resistant design</li>
              <li>Energy efficient operation</li>
              <li>Certified quality standards</li>
            </ul>
          </div>

          <div className="info-block">
            <h3>What's in the Box</h3>
            <ul className="features-list">
              <li>1x {product.name}</li>
              <li>Installation hardware kit</li>
              <li>User manual and warranty card</li>
              <li>Quality inspection certificate</li>
            </ul>
          </div>

          <div className="info-block">
            <h3>Customer Reviews</h3>
            <div className="reviews-summary">
              <div className="rating-overview">
                <div className="rating-score">4.5</div>
                <div className="rating-stars">⭐⭐⭐⭐⭐</div>
                <p>Based on 127 reviews</p>
              </div>
              <div className="rating-bars">
                <div className="rating-bar">
                  <span>5 ⭐</span>
                  <div className="bar"><div className="fill" style={{width: '75%'}}></div></div>
                  <span>95</span>
                </div>
                <div className="rating-bar">
                  <span>4 ⭐</span>
                  <div className="bar"><div className="fill" style={{width: '15%'}}></div></div>
                  <span>19</span>
                </div>
                <div className="rating-bar">
                  <span>3 ⭐</span>
                  <div className="bar"><div className="fill" style={{width: '7%'}}></div></div>
                  <span>9</span>
                </div>
                <div className="rating-bar">
                  <span>2 ⭐</span>
                  <div className="bar"><div className="fill" style={{width: '2%'}}></div></div>
                  <span>3</span>
                </div>
                <div className="rating-bar">
                  <span>1 ⭐</span>
                  <div className="bar"><div className="fill" style={{width: '1%'}}></div></div>
                  <span>1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-section">
          <h2>More Like This</h2>
          <div className="related-grid">
            {relatedProducts.map(item => (
              <div 
                key={item.productId} 
                className="related-card"
                onClick={() => navigate(`/product/${item.productId}`)}
              >
                <img src={item.imageUrl} alt={item.name} />
                <h3>{item.name}</h3>
                <p className="related-price">KSh {(item.price / 100).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetails
