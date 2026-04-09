import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../../config/api-config'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [showProductModal, setShowProductModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productForm, setProductForm] = useState({
    productId: '',
    name: '',
    description: '',
    price: '',
    category: '',
    section: '',
    image: '',
    stock: '',
    specifications: ''
  })
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth')
    if (!adminAuth) {
      navigate('/admin')
      return
    }
    fetchOrders()
    fetchProducts()
    fetchCustomers()
  }, [navigate])

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/customers`)
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products/all`)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders/all`)
      const data = await response.json()
      setOrders(data)
      
      const totalRevenue = data.reduce((sum, order) => sum + order.total, 0)
      setStats({
        totalOrders: data.length,
        pendingOrders: data.filter(o => o.status === 'pending').length,
        completedOrders: data.filter(o => o.status === 'completed').length,
        totalRevenue
      })
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    navigate('/admin')
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error('Failed to update order:', error)
    }
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    
    const productData = {
      ...productForm,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock) || 0,
      specifications: productForm.specifications ? JSON.parse(productForm.specifications) : {}
    }

    try {
      const url = editingProduct 
        ? `${API_URL}/api/products/${editingProduct.productId}`
        : `${API_URL}/api/products'
      
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (response.ok) {
        fetchProducts()
        setShowProductModal(false)
        resetProductForm()
      }
    } catch (error) {
      console.error('Failed to save product:', error)
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setProductForm({
      productId: product.productId,
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      section: product.section || '',
      image: product.image,
      stock: product.stock?.toString() || '0',
      specifications: JSON.stringify(product.specifications || {})
    })
    setShowProductModal(true)
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  const resetProductForm = () => {
    setEditingProduct(null)
    setProductForm({
      productId: '',
      name: '',
      description: '',
      price: '',
      category: '',
      section: '',
      image: '',
      stock: '',
      specifications: ''
    })
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>🔐 Admin Panel</h2>
          <p>Light Hub Customs</p>
        </div>

        <nav className="admin-nav">
          <button 
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            📦 Orders
          </button>
          <button 
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            💡 Products
          </button>
          <button 
            className={activeTab === 'customers' ? 'active' : ''}
            onClick={() => setActiveTab('customers')}
          >
            👥 Customers
          </button>
          <button 
            className={activeTab === 'analytics' ? 'active' : ''}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      <main className="admin-content">
        <div className="admin-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
        </div>

        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <p className="stat-label">Total Orders</p>
                  <p className="stat-value">{stats.totalOrders}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <p className="stat-label">Pending Orders</p>
                  <p className="stat-value">{stats.pendingOrders}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <p className="stat-label">Completed</p>
                  <p className="stat-value">{stats.completedOrders}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <p className="stat-label">Total Revenue</p>
                  <p className="stat-value">KSh {stats.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="recent-orders">
              <h2>Recent Orders</h2>
              <div className="orders-table">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(order => (
                      <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>{order.shippingInfo?.fullName || order.userId}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>KSh {order.total.toFixed(2)}</td>
                        <td>
                          <span className={`status-badge ${order.status}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.orderId}>
                      <td>{order.orderId}</td>
                      <td>{order.shippingInfo?.fullName}</td>
                      <td>{order.shippingInfo?.email}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>{order.items?.length} items</td>
                      <td>KSh {order.total.toFixed(2)}</td>
                      <td>
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                          className={`status-select ${order.status}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <button 
                          className="btn-view"
                          onClick={() => handleViewOrder(order)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-section">
            <div className="section-header">
              <h2>Product Management</h2>
              <button 
                className="btn-primary" 
                onClick={() => {
                  resetProductForm()
                  setShowProductModal(true)
                }}
              >
                + Add Product
              </button>
            </div>

            <div className="products-table">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Section</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.productId}>
                      <td>
                        <img src={product.image} alt={product.name} className="product-thumb" />
                      </td>
                      <td>{product.productId}</td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.section || '-'}</td>
                      <td>KSh {product.price.toFixed(2)}</td>
                      <td>{product.stock || 0}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-edit"
                            onClick={() => handleEditProduct(product)}
                          >
                            ✏️
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeleteProduct(product.productId)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {showProductModal && (
              <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                    <button className="modal-close" onClick={() => setShowProductModal(false)}>×</button>
                  </div>

                  <form onSubmit={handleProductSubmit} className="product-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Product ID *</label>
                        <input
                          type="text"
                          value={productForm.productId}
                          onChange={(e) => setProductForm({...productForm, productId: e.target.value})}
                          placeholder="e.g., HL-LED-001"
                          required
                          disabled={editingProduct}
                        />
                      </div>

                      <div className="form-group">
                        <label>Product Name *</label>
                        <input
                          type="text"
                          value={productForm.name}
                          onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                          placeholder="Product name"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        placeholder="Product description"
                        rows="3"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Category *</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="Headlights">Headlights</option>
                          <option value="Fog Lights">Fog Lights</option>
                          <option value="Tail Lights">Tail Lights</option>
                          <option value="LED Strips">LED Strips</option>
                          <option value="Bulbs">Bulbs</option>
                          <option value="Accessories">Accessories</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Section</label>
                        <select
                          value={productForm.section}
                          onChange={(e) => setProductForm({...productForm, section: e.target.value})}
                        >
                          <option value="">Select Section</option>
                          <option value="new-arrival">New Arrival</option>
                          <option value="best-seller">Best Seller</option>
                          <option value="deal">Deal</option>
                          <option value="carousel">Carousel</option>
                          <option value="accessory">Accessory</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Price (KSh) *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                          placeholder="0.00"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Stock Quantity</label>
                        <input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Image URL *</label>
                      <input
                        type="url"
                        value={productForm.image}
                        onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                        placeholder="https://..."
                        required
                      />
                      {productForm.image && (
                        <img src={productForm.image} alt="Preview" className="image-preview" />
                      )}
                    </div>

                    <div className="form-group">
                      <label>Specifications (JSON)</label>
                      <textarea
                        value={productForm.specifications}
                        onChange={(e) => setProductForm({...productForm, specifications: e.target.value})}
                        placeholder='{"wattage": "55W", "voltage": "12V"}'
                        rows="3"
                      />
                      <small>Enter valid JSON format</small>
                    </div>

                    <div className="modal-actions">
                      <button type="button" className="btn-secondary" onClick={() => setShowProductModal(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary">
                        {editingProduct ? 'Update Product' : 'Add Product'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="customers-section">
            <div className="section-header">
              <h2>Customer Management</h2>
            </div>

            <div className="customers-table">
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Total Orders</th>
                    <th>Total Spent</th>
                    <th>Last Order</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(customer => (
                    <tr key={customer.email}>
                      <td>{customer.email}</td>
                      <td>{customer.name || '-'}</td>
                      <td>{customer.phone || '-'}</td>
                      <td>{customer.totalOrders}</td>
                      <td>KSh {customer.totalSpent.toFixed(2)}</td>
                      <td>
                        {customer.lastOrderDate 
                          ? new Date(customer.lastOrderDate).toLocaleDateString()
                          : '-'
                        }
                      </td>
                      <td>
                        <span className={`status-badge ${customer.status || 'active'}`}>
                          {customer.status || 'active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {customers.length === 0 && (
              <div className="empty-state">
                <p>No customers found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <div className="analytics-grid">
              {/* Revenue Chart */}
              <div className="analytics-card large">
                <h3>📊 Revenue Overview</h3>
                <div className="chart-container">
                  <div className="revenue-bars">
                    {orders.slice(0, 7).map((order, index) => {
                      const height = (order.total / Math.max(...orders.map(o => o.total))) * 100
                      return (
                        <div key={index} className="bar-wrapper">
                          <div className="bar" style={{ height: `${height}%` }}>
                            <span className="bar-value">KSh {order.total.toFixed(0)}</span>
                          </div>
                          <span className="bar-label">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Order Status Breakdown */}
              <div className="analytics-card">
                <h3>📦 Order Status</h3>
                <div className="status-breakdown">
                  <div className="status-item">
                    <div className="status-bar pending" style={{ width: `${(stats.pendingOrders / stats.totalOrders * 100) || 0}%` }}></div>
                    <span>Pending: {stats.pendingOrders}</span>
                  </div>
                  <div className="status-item">
                    <div className="status-bar completed" style={{ width: `${(stats.completedOrders / stats.totalOrders * 100) || 0}%` }}></div>
                    <span>Completed: {stats.completedOrders}</span>
                  </div>
                  <div className="status-item">
                    <div className="status-bar processing" style={{ width: `${(orders.filter(o => o.status === 'processing').length / stats.totalOrders * 100) || 0}%` }}></div>
                    <span>Processing: {orders.filter(o => o.status === 'processing').length}</span>
                  </div>
                  <div className="status-item">
                    <div className="status-bar shipped" style={{ width: `${(orders.filter(o => o.status === 'shipped').length / stats.totalOrders * 100) || 0}%` }}></div>
                    <span>Shipped: {orders.filter(o => o.status === 'shipped').length}</span>
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div className="analytics-card">
                <h3>🏆 Top Products</h3>
                <div className="top-products-list">
                  {(() => {
                    const productSales = {}
                    orders.forEach(order => {
                      order.items?.forEach(item => {
                        if (!productSales[item.productId]) {
                          productSales[item.productId] = {
                            name: item.name,
                            quantity: 0,
                            revenue: 0
                          }
                        }
                        productSales[item.productId].quantity += item.quantity
                        productSales[item.productId].revenue += item.price * item.quantity
                      })
                    })
                    
                    return Object.entries(productSales)
                      .sort((a, b) => b[1].revenue - a[1].revenue)
                      .slice(0, 5)
                      .map(([id, data], index) => (
                        <div key={id} className="top-product-item">
                          <span className="rank">#{index + 1}</span>
                          <div className="product-info">
                            <p className="product-name">{data.name}</p>
                            <p className="product-stats">{data.quantity} sold • KSh {data.revenue.toFixed(2)}</p>
                          </div>
                        </div>
                      ))
                  })()}
                </div>
              </div>

              {/* Customer Stats */}
              <div className="analytics-card">
                <h3>👥 Customer Insights</h3>
                <div className="customer-stats">
                  <div className="stat-row">
                    <span>Total Customers:</span>
                    <strong>{customers.length}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Avg Order Value:</span>
                    <strong>KSh {(stats.totalRevenue / stats.totalOrders || 0).toFixed(2)}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Top Customer:</span>
                    <strong>{customers.sort((a, b) => b.totalSpent - a.totalSpent)[0]?.name || 'N/A'}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Repeat Customers:</span>
                    <strong>{customers.filter(c => c.totalOrders > 1).length}</strong>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="analytics-card large">
                <h3>🕐 Recent Activity</h3>
                <div className="activity-list">
                  {orders.slice(0, 10).map(order => (
                    <div key={order.orderId} className="activity-item">
                      <span className="activity-icon">📦</span>
                      <div className="activity-details">
                        <p><strong>{order.shippingInfo?.fullName || 'Customer'}</strong> placed order #{order.orderId}</p>
                        <p className="activity-time">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <span className="activity-amount">KSh {order.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Options */}
              <div className="analytics-card">
                <h3>📥 Export Reports</h3>
                <div className="export-buttons">
                  <button className="export-btn" onClick={() => alert('CSV export coming soon')}>
                    📄 Export Orders CSV
                  </button>
                  <button className="export-btn" onClick={() => alert('PDF export coming soon')}>
                    📑 Export Sales Report
                  </button>
                  <button className="export-btn" onClick={() => alert('Customer export coming soon')}>
                    👥 Export Customers
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal-content order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details - #{selectedOrder.orderId}</h2>
              <button className="modal-close" onClick={() => setShowOrderModal(false)}>×</button>
            </div>

            <div className="order-details-content">
              <div className="order-details-grid">
                {/* Order Info */}
                <div className="detail-section">
                  <h3>📋 Order Information</h3>
                  <div className="detail-row">
                    <span className="label">Order ID:</span>
                    <span className="value">{selectedOrder.orderId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Date:</span>
                    <span className="value">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Status:</span>
                    <span className={`status-badge ${selectedOrder.status}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Payment Method:</span>
                    <span className="value">{selectedOrder.paymentMethod || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Delivery Method:</span>
                    <span className="value">{selectedOrder.deliveryMethod || 'N/A'}</span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="detail-section">
                  <h3>👤 Customer Information</h3>
                  <div className="detail-row">
                    <span className="label">Name:</span>
                    <span className="value">{selectedOrder.shippingInfo?.fullName || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value">{selectedOrder.shippingInfo?.email || selectedOrder.userId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Phone:</span>
                    <span className="value">{selectedOrder.shippingInfo?.phone || 'N/A'}</span>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="detail-section">
                  <h3>📍 Shipping Address</h3>
                  <div className="address-block">
                    <p>{selectedOrder.shippingInfo?.address}</p>
                    {selectedOrder.shippingInfo?.apartment && (
                      <p>{selectedOrder.shippingInfo.apartment}</p>
                    )}
                    <p>{selectedOrder.shippingInfo?.city}, {selectedOrder.shippingInfo?.county}</p>
                    {selectedOrder.shippingInfo?.postalCode && (
                      <p>Postal Code: {selectedOrder.shippingInfo.postalCode}</p>
                    )}
                  </div>
                </div>

                {/* Order Notes */}
                {selectedOrder.orderNotes && (
                  <div className="detail-section">
                    <h3>📝 Order Notes</h3>
                    <p className="notes-text">{selectedOrder.orderNotes}</p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="detail-section full-width">
                <h3>🛍️ Order Items</h3>
                <div className="order-items-list">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="order-item-row">
                      <img src={item.image} alt={item.name} />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>Product ID: {item.productId}</p>
                      </div>
                      <div className="item-quantity">
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <div className="item-price">
                        <span>KSh {item.price.toFixed(2)}</span>
                      </div>
                      <div className="item-total">
                        <strong>KSh {(item.price * item.quantity).toFixed(2)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="detail-section full-width">
                <h3>💰 Order Summary</h3>
                <div className="order-summary-rows">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>KSh {selectedOrder.subtotal?.toFixed(2) || selectedOrder.total.toFixed(2)}</span>
                  </div>
                  {selectedOrder.shipping && (
                    <div className="summary-row">
                      <span>Shipping:</span>
                      <span>KSh {selectedOrder.shipping.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-row total-row">
                    <span>Total:</span>
                    <strong>KSh {selectedOrder.total.toFixed(2)}</strong>
                  </div>
                </div>
              </div>

              {/* Update Status */}
              <div className="detail-section full-width">
                <h3>🔄 Update Order Status</h3>
                <div className="status-update-section">
                  <select 
                    value={selectedOrder.status}
                    onChange={(e) => {
                      updateOrderStatus(selectedOrder.orderId, e.target.value)
                      setSelectedOrder({...selectedOrder, status: e.target.value})
                    }}
                    className={`status-select ${selectedOrder.status}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button 
                    className="btn-primary"
                    onClick={() => setShowOrderModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
