import React, { useState, useEffect } from 'react'
import API_URL from '../config/api-config'
import './Orders.css'

const Orders = () => {
  const userSession = localStorage.getItem('userSession')
  const user = userSession ? JSON.parse(userSession) : null
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    try {
      const userId = user?.id || 'guest'
      const response = await fetch(`${API_URL}/api/orders/${userId}`)
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="orders-page">Loading...</div>

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <h1>My Orders</h1>
        <div className="no-orders">
          <p>No orders yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <p className="order-id">Order #{order.id}</p>
                <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`status ${order.status}`}>{order.status}</span>
            </div>
            <div className="order-items">
              {order.items.map(item => (
                <div key={item.productId} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p>{item.name}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <p>KSh {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="order-footer">
              <p>Total: <strong>KSh {order.total.toFixed(2)}</strong></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
