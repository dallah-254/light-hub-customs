import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import API_URL from '../config/api-config'
import './Checkout.css'

const Checkout = () => {
  const navigate = useNavigate()
  const { cart, getTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  
  const userSession = localStorage.getItem('userSession')
  const user = userSession ? JSON.parse(userSession) : null
  
  const [formData, setFormData] = useState({
    // Contact Info
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    
    // Shipping Address
    address: '',
    apartment: '',
    city: '',
    county: '',
    postalCode: '',
    
    // Delivery
    deliveryMethod: 'standard',
    
    // Payment
    paymentMethod: 'mpesa',
    mpesaPhone: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: '',
    
    // Additional
    orderNotes: ''
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const validateStep = (currentStep) => {
    const newErrors = {}
    
    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    }
    
    if (currentStep === 2) {
      if (!formData.address.trim()) newErrors.address = 'Address is required'
      if (!formData.city.trim()) newErrors.city = 'City is required'
      if (!formData.county.trim()) newErrors.county = 'County is required'
    }
    
    if (currentStep === 4) {
      if (formData.paymentMethod === 'mpesa' && !formData.mpesaPhone.trim()) {
        newErrors.mpesaPhone = 'M-Pesa phone number is required'
      }
      if (formData.paymentMethod === 'card') {
        if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required'
        if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required'
        if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Expiry date is required'
        if (!formData.cardCVV.trim()) newErrors.cardCVV = 'CVV is required'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const getShippingCost = () => {
    if (formData.deliveryMethod === 'express') return 500
    if (formData.deliveryMethod === 'standard') return 200
    return 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep(4)) return
    
    setLoading(true)

    const order = {
      userId: user?.email || formData.email || 'guest',
      items: cart,
      subtotal: getTotal(),
      shipping: getShippingCost(),
      total: getTotal() + getShippingCost(),
      shippingInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        county: formData.county,
        postalCode: formData.postalCode
      },
      deliveryMethod: formData.deliveryMethod,
      paymentMethod: formData.paymentMethod,
      orderNotes: formData.orderNotes,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      })

      if (response.ok) {
        clearCart()
        navigate('/orders')
      } else {
        alert('Order failed. Please try again.')
      }
    } catch (error) {
      alert('Order failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart before checking out</p>
          <button onClick={() => navigate('/shop')}>Continue Shopping</button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Contact</span>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Shipping</span>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Delivery</span>
          </div>
          <div className={`step ${step >= 4 ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-label">Payment</span>
          </div>
        </div>
      </div>

      <div className="checkout-container">
        <div className="checkout-form-section">
          <form onSubmit={handleSubmit}>
            
            {/* Step 1: Contact Information */}
            {step === 1 && (
              <div className="form-step">
                <h2>Contact Information</h2>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-msg">{errors.email}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="0712345678"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-msg">{errors.phone}</span>}
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={() => navigate('/cart')} className="btn-secondary">
                    Back to Cart
                  </button>
                  <button type="button" onClick={nextStep} className="btn-primary">
                    Continue to Shipping
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Shipping Address */}
            {step === 2 && (
              <div className="form-step">
                <h2>Shipping Address</h2>
                
                <div className="form-group">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="House number and street name"
                    value={formData.address}
                    onChange={handleChange}
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && <span className="error-msg">{errors.address}</span>}
                </div>
                
                <div className="form-group">
                  <label>Apartment, suite, etc. (optional)</label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-msg">{errors.city}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>County *</label>
                    <select
                      name="county"
                      value={formData.county}
                      onChange={handleChange}
                      className={errors.county ? 'error' : ''}
                    >
                      <option value="">Select County</option>
                      <option value="Nairobi">Nairobi</option>
                      <option value="Mombasa">Mombasa</option>
                      <option value="Kisumu">Kisumu</option>
                      <option value="Nakuru">Nakuru</option>
                      <option value="Kiambu">Kiambu</option>
                      <option value="Machakos">Machakos</option>
                      <option value="Kajiado">Kajiado</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.county && <span className="error-msg">{errors.county}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Postal Code (optional)</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={prevStep} className="btn-secondary">
                    Back
                  </button>
                  <button type="button" onClick={nextStep} className="btn-primary">
                    Continue to Delivery
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Delivery Method */}
            {step === 3 && (
              <div className="form-step">
                <h2>Delivery Method</h2>
                
                <div className="delivery-options">
                  <label className={`delivery-option ${formData.deliveryMethod === 'standard' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="standard"
                      checked={formData.deliveryMethod === 'standard'}
                      onChange={handleChange}
                    />
                    <div className="option-content">
                      <div className="option-header">
                        <span className="option-title">Standard Delivery</span>
                        <span className="option-price">KSh 200.00</span>
                      </div>
                      <p className="option-desc">Delivery within 3-5 business days</p>
                    </div>
                  </label>
                  
                  <label className={`delivery-option ${formData.deliveryMethod === 'express' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="express"
                      checked={formData.deliveryMethod === 'express'}
                      onChange={handleChange}
                    />
                    <div className="option-content">
                      <div className="option-header">
                        <span className="option-title">Express Delivery</span>
                        <span className="option-price">KSh 500.00</span>
                      </div>
                      <p className="option-desc">Delivery within 1-2 business days</p>
                    </div>
                  </label>
                  
                  <label className={`delivery-option ${formData.deliveryMethod === 'pickup' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="pickup"
                      checked={formData.deliveryMethod === 'pickup'}
                      onChange={handleChange}
                    />
                    <div className="option-content">
                      <div className="option-header">
                        <span className="option-title">Store Pickup</span>
                        <span className="option-price">FREE</span>
                      </div>
                      <p className="option-desc">Pick up from our store within 24 hours</p>
                    </div>
                  </label>
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={prevStep} className="btn-secondary">
                    Back
                  </button>
                  <button type="button" onClick={nextStep} className="btn-primary">
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Payment Method */}
            {step === 4 && (
              <div className="form-step">
                <h2>Payment Method</h2>
                
                <div className="payment-options">
                  <label className={`payment-option ${formData.paymentMethod === 'mpesa' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mpesa"
                      checked={formData.paymentMethod === 'mpesa'}
                      onChange={handleChange}
                    />
                    <span className="payment-label">
                      <span className="payment-icon">📱</span>
                      M-Pesa
                    </span>
                  </label>
                  
                  <label className={`payment-option ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                    />
                    <span className="payment-label">
                      <span className="payment-icon">💳</span>
                      Credit/Debit Card
                    </span>
                  </label>
                  
                  <label className={`payment-option ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                    />
                    <span className="payment-label">
                      <span className="payment-icon">💵</span>
                      Cash on Delivery
                    </span>
                  </label>
                </div>
                
                {formData.paymentMethod === 'mpesa' && (
                  <div className="payment-details">
                    <div className="form-group">
                      <label>M-Pesa Phone Number *</label>
                      <input
                        type="tel"
                        name="mpesaPhone"
                        placeholder="0712345678"
                        value={formData.mpesaPhone}
                        onChange={handleChange}
                        className={errors.mpesaPhone ? 'error' : ''}
                      />
                      {errors.mpesaPhone && <span className="error-msg">{errors.mpesaPhone}</span>}
                      <small>You will receive an STK push to complete payment</small>
                    </div>
                  </div>
                )}
                
                {formData.paymentMethod === 'card' && (
                  <div className="payment-details">
                    <div className="form-group">
                      <label>Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className={errors.cardNumber ? 'error' : ''}
                      />
                      {errors.cardNumber && <span className="error-msg">{errors.cardNumber}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Cardholder Name *</label>
                      <input
                        type="text"
                        name="cardName"
                        placeholder="Name on card"
                        value={formData.cardName}
                        onChange={handleChange}
                        className={errors.cardName ? 'error' : ''}
                      />
                      {errors.cardName && <span className="error-msg">{errors.cardName}</span>}
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date *</label>
                        <input
                          type="text"
                          name="cardExpiry"
                          placeholder="MM/YY"
                          maxLength="5"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          className={errors.cardExpiry ? 'error' : ''}
                        />
                        {errors.cardExpiry && <span className="error-msg">{errors.cardExpiry}</span>}
                      </div>
                      
                      <div className="form-group">
                        <label>CVV *</label>
                        <input
                          type="text"
                          name="cardCVV"
                          placeholder="123"
                          maxLength="4"
                          value={formData.cardCVV}
                          onChange={handleChange}
                          className={errors.cardCVV ? 'error' : ''}
                        />
                        {errors.cardCVV && <span className="error-msg">{errors.cardCVV}</span>}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="form-group">
                  <label>Order Notes (optional)</label>
                  <textarea
                    name="orderNotes"
                    rows="3"
                    placeholder="Any special instructions for your order?"
                    value={formData.orderNotes}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={prevStep} className="btn-secondary">
                    Back
                  </button>
                  <button type="submit" disabled={loading} className="btn-primary btn-place-order">
                    {loading ? 'Processing...' : `Place Order - KSh ${(getTotal() + getShippingCost()).toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="order-summary-sidebar">
          <div className="order-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-items">
              {cart.map(item => (
                <div key={item.productId} className="summary-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <p className="item-name">{item.name}</p>
                    <p className="item-qty">Qty: {item.quantity}</p>
                  </div>
                  <p className="item-price">KSh {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>KSh {getTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {getShippingCost() === 0 ? 'FREE' : `KSh ${getShippingCost().toFixed(2)}`}
                </span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>KSh {(getTotal() + getShippingCost()).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="security-badges">
              <div className="badge">🔒 Secure Checkout</div>
              <div className="badge">✓ SSL Encrypted</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
