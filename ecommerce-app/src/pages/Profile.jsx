import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config/api-config'

const Profile = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  
  const userSession = localStorage.getItem('userSession')
  const user = userSession ? JSON.parse(userSession) : null

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    if (!user) return
    try {
      const userId = user.id || user.email || 'guest'
      const response = await fetch(`${API_URL}/api/orders/${userId}`)
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('userSession')
    navigate('/')
  }

  if (!user) {
    return null
  }

  const userName = user.name || user.email?.split('@')[0] || 'User'
  const userEmail = user.email || 'No email'

  const getOrderStats = () => {
    const total = orders.length
    const pending = orders.filter(o => o.status === 'pending').length
    const completed = orders.filter(o => o.status === 'completed').length
    const totalSpent = orders.reduce((sum, o) => sum + o.total, 0)
    return { total, pending, completed, totalSpent }
  }

  const stats = getOrderStats()
  const recentOrders = orders.slice(0, 5)

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-card">
            <div className="avatar-large">
              {userName.charAt(0).toUpperCase()}
            </div>
            <h2>{userName}</h2>
            <p className="user-email">{userEmail}</p>
            <p className="user-since">Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>

          <nav className="profile-nav">
            <button 
              className={activeTab === 'overview' ? 'active' : ''} 
              onClick={() => setActiveTab('overview')}
            >
              <span className="nav-icon">📊</span>
              Overview
            </button>
            <button 
              className={activeTab === 'orders' ? 'active' : ''} 
              onClick={() => setActiveTab('orders')}
            >
              <span className="nav-icon">📦</span>
              My Orders
            </button>
            <button 
              className={activeTab === 'account' ? 'active' : ''} 
              onClick={() => setActiveTab('account')}
            >
              <span className="nav-icon">⚙️</span>
              Account Settings
            </button>
            <button 
              className={activeTab === 'wishlist' ? 'active' : ''} 
              onClick={() => navigate('/wishlist')}
            >
              <span className="nav-icon">♥</span>
              Wishlist
            </button>
          </nav>

          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="profile-content">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content">
              <h1>Welcome back, {userName.split(' ')[0]}!</h1>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-info">
                    <p className="stat-label">Total Orders</p>
                    <p className="stat-value">{stats.total}</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <p className="stat-label">Pending</p>
                    <p className="stat-value">{stats.pending}</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <p className="stat-label">Completed</p>
                    <p className="stat-value">{stats.completed}</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <p className="stat-label">Total Spent</p>
                    <p className="stat-value">KSh {stats.totalSpent.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="section">
                <div className="section-header">
                  <h2>Recent Orders</h2>
                  <button className="link-btn" onClick={() => setActiveTab('orders')}>
                    View All →
                  </button>
                </div>
                
                {loading ? (
                  <p>Loading orders...</p>
                ) : recentOrders.length === 0 ? (
                  <div className="empty-state">
                    <p>No orders yet</p>
                    <button className="btn-primary" onClick={() => navigate('/shop')}>
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {recentOrders.map(order => (
                      <div key={order.id} className="order-card-compact">
                        <div className="order-header-compact">
                          <div>
                            <span className="order-id">Order #{order.id}</span>
                            <span className="order-date">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span className={`status-badge ${order.status}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="order-items-preview">
                          {order.items.slice(0, 3).map(item => (
                            <img key={item.productId} src={item.image} alt={item.name} />
                          ))}
                          {order.items.length > 3 && (
                            <div className="more-items">+{order.items.length - 3}</div>
                          )}
                        </div>
                        <div className="order-footer-compact">
                          <span className="order-total">KSh {order.total.toFixed(2)}</span>
                          <button className="btn-view" onClick={() => setActiveTab('orders')}>
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                  <button className="action-card" onClick={() => navigate('/shop')}>
                    <span className="action-icon">🛍️</span>
                    <span>Continue Shopping</span>
                  </button>
                  <button className="action-card" onClick={() => navigate('/wishlist')}>
                    <span className="action-icon">♥</span>
                    <span>View Wishlist</span>
                  </button>
                  <button className="action-card" onClick={() => navigate('/track')}>
                    <span className="action-icon">📍</span>
                    <span>Track Order</span>
                  </button>
                  <button className="action-card" onClick={() => navigate('/help')}>
                    <span className="action-icon">💬</span>
                    <span>Get Help</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="tab-content">
              <h1>My Orders</h1>
              
              {loading ? (
                <p>Loading orders...</p>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <h3>No orders yet</h3>
                  <p>Start shopping to see your orders here</p>
                  <button className="btn-primary" onClick={() => navigate('/shop')}>
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="orders-detailed">
                  {orders.map(order => (
                    <div key={order.id} className="order-card-detailed">
                      <div className="order-header-detailed">
                        <div className="order-info">
                          <h3>Order #{order.id}</h3>
                          <p className="order-date">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="order-header-actions">
                          <span className={`status-badge ${order.status}`}>
                            {order.status}
                          </span>
                          <button 
                            className="track-order-btn"
                            onClick={() => navigate(`/track?order=${order.id || order.orderId}`)}
                          >
                            📍 Track Order
                          </button>
                        </div>
                      </div>

                      <div className="order-items-detailed">
                        {order.items.map(item => (
                          <div key={item.productId} className="order-item-detailed">
                            <img src={item.image} alt={item.name} />
                            <div className="item-info">
                              <h4>{item.name}</h4>
                              <p>Quantity: {item.quantity}</p>
                              <p className="item-price">KSh {item.price.toFixed(2)} each</p>
                            </div>
                            <div className="item-total">
                              KSh {(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="order-summary-detailed">
                        <div className="summary-row">
                          <span>Subtotal:</span>
                          <span>KSh {order.subtotal?.toFixed(2) || order.total.toFixed(2)}</span>
                        </div>
                        {order.shipping && (
                          <div className="summary-row">
                            <span>Shipping:</span>
                            <span>KSh {order.shipping.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="summary-row total">
                          <span>Total:</span>
                          <span>KSh {order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {order.shippingInfo && (
                        <div className="shipping-info">
                          <h4>Shipping Address</h4>
                          <p>{order.shippingInfo.fullName}</p>
                          <p>{order.shippingInfo.address}</p>
                          {order.shippingInfo.apartment && <p>{order.shippingInfo.apartment}</p>}
                          <p>{order.shippingInfo.city}, {order.shippingInfo.county}</p>
                          <p>{order.shippingInfo.phone}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Account Settings Tab */}
          {activeTab === 'account' && (
            <div className="tab-content">
              <h1>Account Settings</h1>
              
              <div className="settings-section">
                <h2>Personal Information</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Full Name</label>
                    <p>{userName}</p>
                  </div>
                  <div className="info-item">
                    <label>Email Address</label>
                    <p>{userEmail}</p>
                  </div>
                  <div className="info-item">
                    <label>Phone Number</label>
                    <p>{user.phone || 'Not provided'}</p>
                  </div>
                  <div className="info-item">
                    <label>Member Since</label>
                    <p>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                </div>
                <button className="btn-secondary">Edit Profile</button>
              </div>

              <div className="settings-section">
                <h2>Security</h2>
                <div className="security-options">
                  <div className="security-item">
                    <div>
                      <h4>Password</h4>
                      <p>Last changed 30 days ago</p>
                    </div>
                    <button className="btn-secondary">Change Password</button>
                  </div>
                  <div className="security-item">
                    <div>
                      <h4>Two-Factor Authentication</h4>
                      <p>Add an extra layer of security</p>
                    </div>
                    <button className="btn-secondary">Enable</button>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h2>Preferences</h2>
                <div className="preferences">
                  <label className="checkbox-item">
                    <input type="checkbox" defaultChecked />
                    <span>Email notifications for order updates</span>
                  </label>
                  <label className="checkbox-item">
                    <input type="checkbox" defaultChecked />
                    <span>Promotional emails and offers</span>
                  </label>
                  <label className="checkbox-item">
                    <input type="checkbox" />
                    <span>SMS notifications</span>
                  </label>
                </div>
              </div>

              <div className="settings-section danger-zone">
                <h2>Danger Zone</h2>
                <div className="danger-actions">
                  <div>
                    <h4>Delete Account</h4>
                    <p>Permanently delete your account and all data</p>
                  </div>
                  <button className="btn-danger">Delete Account</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Profile
