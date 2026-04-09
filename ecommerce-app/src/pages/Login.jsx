import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signIn, forgotPassword, confirmPassword } from '../services/auth'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetStep, setResetStep] = useState(1) // 1: email, 2: verify code, 3: new password
  const [resetEmail, setResetEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn(formData.email, formData.password)
      console.log('Login successful:', result)
      
      // Store session
      const session = {
        email: formData.email,
        accessToken: result.getAccessToken().getJwtToken(),
        idToken: result.getIdToken().getJwtToken(),
        refreshToken: result.getRefreshToken().getToken()
      }
      localStorage.setItem('userSession', JSON.stringify(session))
      
      // Redirect to home
      window.location.href = '/'
    } catch (err) {
      console.error('Login error:', err)
      if (err.name === 'UserNotConfirmedException') {
        setError('Please verify your email before logging in. Check your inbox for the verification code.')
      } else if (err.name === 'NotAuthorizedException') {
        setError('Incorrect email or password. Please try again.')
      } else if (err.name === 'UserNotFoundException') {
        setError('No account found with this email. Please register first.')
      } else {
        setError(err.message || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (resetStep === 1) {
        // Send verification code
        await forgotPassword(resetEmail)
        setCodeSent(true)
        setResetStep(2)
        setError('')
      } else if (resetStep === 2) {
        // Auto-verify when 6 digits entered (handled in onChange)
        return
      } else {
        // Reset password with code
        await confirmPassword(resetEmail, resetCode, newPassword)
        setShowForgotPassword(false)
        setSuccessMessage('Password reset successful!')
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
          setResetStep(1)
          setResetEmail('')
          setResetCode('')
          setNewPassword('')
          setCodeSent(false)
        }, 2000)
      }
    } catch (err) {
      console.error('Reset error:', err)
      setError(err.message || 'Password reset failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCodeChange = async (index, value, e) => {
    if (value.match(/^[0-9]$/)) {
      const newCode = resetCode.split('')
      newCode[index] = value
      const fullCode = newCode.join('')
      setResetCode(fullCode)
      
      // Auto-focus next input
      if (index < 5 && value) {
        const nextInput = e.target.nextElementSibling
        if (nextInput) nextInput.focus()
      }
      
      // Auto-verify when all 6 digits entered
      if (fullCode.length === 6) {
        setLoading(true)
        try {
          // Just move to next step, code will be verified when password is submitted
          setTimeout(() => {
            setResetStep(3)
            setLoading(false)
          }, 500)
        } catch (err) {
          setError('Invalid verification code')
          setLoading(false)
        }
      }
    }
  }

  return (
    <div className="login-page">
      {showSuccess && (
        <div className="success-notification">
          <div className="success-content">
            <div className="success-icon">✓</div>
            <h3>{successMessage}</h3>
            <p>You can now login with your new password</p>
          </div>
        </div>
      )}
      
      {showForgotPassword && (
        <div className="forgot-password-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => {
              setShowForgotPassword(false)
              setResetStep(1)
              setResetCode('')
              setCodeSent(false)
              setError('')
            }}>×</button>
            
            <h2>Reset Password</h2>
            
            {error && <div className="error-box">{error}</div>}
            
            <form onSubmit={handleForgotPassword}>
              {resetStep === 1 && (
                <>
                  <p className="hint">Enter your email to receive a verification code</p>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                  <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Code'}
                  </button>
                </>
              )}
              
              {resetStep === 2 && (
                <>
                  <p className="hint">Enter the 6-digit code sent to {resetEmail}</p>
                  <div className="code-inputs">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        className="code-box"
                        value={resetCode[index] || ''}
                        onChange={(e) => handleCodeChange(index, e.target.value, e)}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !resetCode[index] && index > 0) {
                            const prevInput = e.target.previousElementSibling
                            if (prevInput) prevInput.focus()
                          }
                        }}
                        disabled={loading}
                      />
                    ))}
                  </div>
                  {loading && <p className="processing-text">Verifying...</p>}
                </>
              )}
              
              {resetStep === 3 && (
                <>
                  <p className="hint">Create your new password</p>
                  <div className="password-field">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password (min 8 characters)"
                      required
                      minLength="8"
                    />
                    <button 
                      type="button" 
                      className="eye-btn" 
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
      
      <div className="login-card">
        <div className="brand-logo">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="28" fill="url(#gradient)" stroke="url(#gradient)" strokeWidth="2"/>
            <path d="M30 15L35 25H25L30 15Z" fill="white"/>
            <circle cx="30" cy="35" r="8" fill="white"/>
            <path d="M22 42L30 35L38 42" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4f46e5"/>
                <stop offset="100%" stopColor="#7c3aed"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <div className="logo">LIGHT HUB CUSTOMS</div>
        <h2>Welcome back</h2>
        <p className="subtitle">Log in with your email and password.</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>

          <div className="form-field">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <button 
            type="button" 
            className="forgot-password-link" 
            onClick={() => setShowForgotPassword(true)}
          >
            Forgot password?
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="social-login">
            <button type="button" className="social-btn facebook" onClick={() => window.location.href = 'https://www.facebook.com/v12.0/dialog/oauth?client_id=YOUR_FB_APP_ID&redirect_uri=' + encodeURIComponent(window.location.origin + '/auth/facebook')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877f2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>
            <button type="button" className="social-btn google" onClick={() => window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=' + encodeURIComponent(window.location.origin + '/auth/google') + '&response_type=code&scope=email profile'}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <p className="terms-text">
            By continuing you agree to Light Hub Customs' <Link to="/terms">Terms and Conditions</Link>
          </p>
        </form>

        <p className="register-link">
          Don't have an account? <Link to="/register">Create account</Link>
        </p>

        <div className="footer-help">
          <p>Need help? Visit our Help Center or contact us on +254711011011 / +254730868000</p>
          <p className="footer-brand">Light Hub Customs</p>
        </div>
      </div>
    </div>
  )
}

export default Login
