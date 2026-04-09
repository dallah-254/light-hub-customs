import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminLogin.css'

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Built-in admin credentials
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'LightHub2026!'
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (credentials.username === ADMIN_CREDENTIALS.username && 
        credentials.password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('adminAuth', JSON.stringify({ 
        username: credentials.username,
        loginTime: new Date().toISOString()
      }))
      navigate('/admin/dashboard')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <h1>🔐 Admin Portal</h1>
          <p>Light Hub Customs</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && <div className="error-alert">{error}</div>}
          
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              placeholder="Enter admin username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              placeholder="Enter admin password"
              required
            />
          </div>

          <button type="submit" className="admin-login-btn">
            Login to Dashboard
          </button>

          <div className="admin-credentials-hint">
            <p>Default Credentials:</p>
            <p>Username: <code>admin</code></p>
            <p>Password: <code>LightHub2026!</code></p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
