import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signUp, confirmSignUp } from '../services/auth'
import './Register.css'

const Register = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    name: '',
    phoneNumber: '',
    address: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleNext = async () => {
    setError('')
    setLoading(true)

    try {
      if (step === 1) {
        if (!formData.email) {
          setError('Email is required')
          setLoading(false)
          return
        }
        setStep(2)
      } else if (step === 2) {
        if (!formData.name) {
          setError('Name is required')
          setLoading(false)
          return
        }
        setStep(3)
      } else if (step === 3) {
        if (!formData.phoneNumber) {
          setError('Phone number is required')
          setLoading(false)
          return
        }
        // Normalize phone number to E.164 format
        let phone = formData.phoneNumber.replace(/\D/g, '')
        if (!phone.startsWith('254') && phone.startsWith('0')) {
          phone = '254' + phone.substring(1)
        }
        if (!phone.startsWith('+')) {
          phone = '+' + phone
        }
        setFormData({ ...formData, phoneNumber: phone })
        setStep(4)
      } else if (step === 4) {
        if (!formData.address) {
          setError('Address is required')
          setLoading(false)
          return
        }
        setStep(5)
      } else if (step === 5) {
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters')
          setLoading(false)
          return
        }
        // Sign up with all data
        await signUp(formData.email, formData.password, formData.name, formData.phoneNumber, formData.address)
        setStep(6)
      } else if (step === 6) {
        if (!formData.code) {
          setError('Verification code is required')
          setLoading(false)
          return
        }
        // Verify email
        await confirmSignUp(formData.email, formData.code)
        
        // Save to DynamoDB
        const { saveUserToDynamoDB } = await import('../services/dynamodb')
        await saveUserToDynamoDB({
          email: formData.email,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          address: formData.address
        })
        
        setShowSuccess(true)
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  return (
    <div className="register-page-multi">
      {showSuccess && (
        <div className="success-notification">
          <div className="success-content">
            <div className="success-icon">✓</div>
            <h3>Registration Successful!</h3>
            <p>Redirecting to login...</p>
          </div>
        </div>
      )}
      
      <div className="register-card">
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
        <h2>Welcome to Light Hub Customs</h2>
        <p className="subtitle">Type your e-mail or phone number to log in or create a Jumia account.</p>

        <div className="progress-bar">
          <div className="progress" style={{ width: `${(step / 6) * 100}%` }}></div>
        </div>

        {error && <div className="error-box">{error}</div>}

        {step === 1 && (
          <div className="step-content">
            <h2>What's your email?</h2>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              autoFocus
            />
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h2>What's your name?</h2>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              autoFocus
            />
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h2>Your phone number</h2>
            <p className="hint">Any format accepted (e.g., 0712345678 or +254712345678)</p>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="0712345678"
              autoFocus
            />
          </div>
        )}

        {step === 4 && (
          <div className="step-content">
            <h2>Where do you live?</h2>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street, City, Country"
              rows="4"
              autoFocus
            />
          </div>
        )}

        {step === 5 && (
          <div className="step-content">
            <h2>Create a password</h2>
            <p className="hint">At least 8 characters</p>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoFocus
              />
              <button 
                type="button" 
                className="eye-btn" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="step-content">
            <h2>Enter verification code</h2>
            <p className="hint">Check your email: {formData.email}</p>
            <div className="code-inputs">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="code-box"
                  value={formData.code[index] || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value.match(/^[0-9]$/)) {
                      const newCode = formData.code.split('')
                      newCode[index] = value
                      setFormData({ ...formData, code: newCode.join('') })
                      // Auto-focus next input
                      if (index < 5 && value) {
                        const nextInput = e.target.nextElementSibling
                        if (nextInput) nextInput.focus()
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !formData.code[index] && index > 0) {
                      const prevInput = e.target.previousElementSibling
                      if (prevInput) prevInput.focus()
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <button onClick={handleNext} className="next-btn" disabled={loading}>
          {loading ? 'Processing...' : step === 6 ? 'Complete' : 'Next'}
        </button>

        {step === 1 && (
          <>
            <div className="divider">
              <span>OR</span>
            </div>
            <div className="social-login">
              <button className="social-btn facebook" onClick={() => window.location.href = 'https://www.facebook.com/v12.0/dialog/oauth?client_id=YOUR_FB_APP_ID&redirect_uri=' + encodeURIComponent(window.location.origin + '/auth/facebook')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877f2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>
              <button className="social-btn google" onClick={() => window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=' + encodeURIComponent(window.location.origin + '/auth/google') + '&response_type=code&scope=email profile'}>
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
              By continuing you agree to Light Hub Customs' <a href="/terms">Terms and Conditions</a>
            </p>
          </>
        )}

        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="back-btn">
            Back
          </button>
        )}

        <p className="login-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>

        <div className="footer-help">
          <p>Need help? Visit our Help Center or contact us on +254711011011 / +254730868000</p>
          <p className="footer-brand">Light Hub Customs</p>
        </div>
      </div>
    </div>
  )
}

export default Register
