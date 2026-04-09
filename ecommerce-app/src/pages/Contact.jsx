import React, { useState } from 'react'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In production, send to backend/email service
    console.log('Contact form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Get in Touch</h1>
        <p>We're here to help with any questions or concerns</p>
      </div>

      <div className="contact-container">
        <div className="contact-info-section">
          <h2>Contact Information</h2>
          
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Visit Us</h3>
              <p>Light Hub Customs Warehouse</p>
              <p>Industrial Area, Nairobi</p>
              <p>Mombasa Road, Building 12</p>
              <p>Nairobi, Kenya</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Call Us</h3>
              <p>Phone: +254 712 345 678</p>
              <p>Toll Free: 0800 123 456</p>
              <p>Mon-Fri: 8AM - 6PM</p>
              <p>Sat: 9AM - 4PM</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3>Email Us</h3>
              <p>General: info@lighthubcustoms.com</p>
              <p>Support: support@lighthubcustoms.com</p>
              <p>Sales: sales@lighthubcustoms.com</p>
              <p>Response within 24 hours</p>
            </div>

            <div className="info-card">
              <div className="info-icon">💬</div>
              <h3>Social Media</h3>
              <p>WhatsApp: +254 712 345 678</p>
              <p>Facebook: @LightHubCustoms</p>
              <p>Instagram: @lighthubcustoms</p>
              <p>Twitter: @lighthubke</p>
            </div>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send Us a Message</h2>
          <p>Fill out the form below and we'll get back to you as soon as possible</p>

          {submitted && (
            <div className="success-message">
              ✓ Thank you! Your message has been sent successfully. We'll respond within 24 hours.
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="0712345678"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Subject *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="product-inquiry">Product Inquiry</option>
                  <option value="order-status">Order Status</option>
                  <option value="technical-support">Technical Support</option>
                  <option value="installation">Installation Services</option>
                  <option value="returns">Returns & Refunds</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help you..."
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>

        <div className="map-section">
          <h2>Find Us on the Map</h2>
          <div className="map-placeholder">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8176449037!2d36.8219!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTcnMzEuNiJTIDM2wrA0OScxOC44IkU!5e0!3m2!1sen!2ske!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen=""
              loading="lazy"
              title="Light Hub Customs Location"
            />
          </div>
        </div>

        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>What are your business hours?</h3>
              <p>We're open Monday-Friday 8AM-6PM and Saturday 9AM-4PM. Closed on Sundays and public holidays.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer installation services?</h3>
              <p>Yes! We have certified technicians and partner installers across Kenya. Installation can be arranged at checkout.</p>
            </div>
            <div className="faq-item">
              <h3>How long does delivery take?</h3>
              <p>Standard delivery takes 3-5 business days. Express delivery (1-2 days) is available for urgent orders.</p>
            </div>
            <div className="faq-item">
              <h3>What payment methods do you accept?</h3>
              <p>We accept M-Pesa, Credit/Debit Cards (Visa, Mastercard), and Cash on Delivery for eligible orders.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
