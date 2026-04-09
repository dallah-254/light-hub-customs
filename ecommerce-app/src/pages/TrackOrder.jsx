import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import API_URL from '../config/api-config'
import './TrackOrder.css'

const TrackOrder = () => {
  const [searchParams] = useSearchParams()
  const [orderId, setOrderId] = useState(searchParams.get('order') || '')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const orderParam = searchParams.get('order')
    if (orderParam) {
      setOrderId(orderParam)
      handleTrack(orderParam)
    }
  }, [searchParams])

  const trackingSteps = [
    { status: 'pending', label: 'Order Placed', icon: '📝', description: 'Your order has been received' },
    { status: 'processing', label: 'Processing', icon: '⚙️', description: 'We are preparing your order' },
    { status: 'shipped', label: 'Shipped', icon: '🚚', description: 'Your order is on the way' },
    { status: 'delivered', label: 'Delivered', icon: '✅', description: 'Order delivered successfully' }
  ]

  const handleTrack = async (id = orderId) => {
    if (!id.trim()) {
      setError('Please enter an order ID')
      return
    }

    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const response = await fetch(`${API_URL}/api/orders/track/${id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else {
        setError('Order not found. Please check your order ID.')
      }
    } catch (err) {
      setError('Failed to track order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStepIndex = (status) => {
    const statusMap = { pending: 0, processing: 1, shipped: 2, delivered: 3, completed: 3 }
    return statusMap[status] || 0
  }

  const currentStep = order ? getStepIndex(order.status) : -1

  return (
    <div className="track-order-page">
      <div className="track-container">
        <h1>Track Your Order</h1>
        <p className="subtitle">Enter your order ID to track your package</p>

        <div className="track-input-section">
          <input
            type="text"
            placeholder="Enter Order ID (e.g., ORD-1234567890)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
          />
          <button onClick={handleTrack} disabled={loading}>
            {loading ? 'Tracking...' : 'Track Order'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {order && (
          <div className="tracking-results">
            <div className="order-info-card">
              <div className="order-header">
                <div>
                  <h2>Order #{order.orderId}</h2>
                  <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`status-badge ${order.status}`}>{order.status}</span>
              </div>

              <div className="delivery-info">
                <div className="info-section">
                  <h3>📍 Pickup Location</h3>
                  <p className="location-name">Light Hub Customs Warehouse</p>
                  <p>Industrial Area, Nairobi</p>
                  <p>Mombasa Road, Building 12</p>
                </div>

                <div className="info-section">
                  <h3>🏠 Delivery Address</h3>
                  <p className="location-name">{order.shippingInfo?.fullName}</p>
                  <p>{order.shippingInfo?.address}</p>
                  {order.shippingInfo?.apartment && <p>{order.shippingInfo.apartment}</p>}
                  <p>{order.shippingInfo?.city}, {order.shippingInfo?.county}</p>
                  <p>📞 {order.shippingInfo?.phone}</p>
                </div>
              </div>

              <div className="delivery-method-info">
                <div className="method-badge">
                  {order.deliveryMethod === 'express' && '⚡ Express Delivery (1-2 days)'}
                  {order.deliveryMethod === 'standard' && '📦 Standard Delivery (3-5 days)'}
                  {order.deliveryMethod === 'pickup' && '🏪 Store Pickup'}
                </div>
              </div>
            </div>

            <div className="tracking-timeline">
              <h3>Order Progress</h3>
              <div className="timeline">
                {trackingSteps.map((step, index) => (
                  <div
                    key={step.status}
                    className={`timeline-step ${index <= currentStep ? 'completed' : ''} ${index === currentStep ? 'current' : ''}`}
                  >
                    <div className="step-icon">{step.icon}</div>
                    <div className="step-content">
                      <h4>{step.label}</h4>
                      <p>{step.description}</p>
                      {index === currentStep && (
                        <span className="current-badge">Current Status</span>
                      )}
                    </div>
                    {index < trackingSteps.length - 1 && (
                      <div className={`step-line ${index < currentStep ? 'completed' : ''}`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="order-items-section">
              <h3>Order Items</h3>
              <div className="items-list">
                {order.items?.map((item, index) => (
                  <div key={index} className="item-card">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      KSh {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <span>Total:</span>
                <span>KSh {order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackOrder
