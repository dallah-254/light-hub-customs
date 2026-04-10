import React from 'react'

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>About Light Hub Customs</h1>
        <p>Your trusted partner for premium automotive lighting solutions in Kenya</p>
      </div>

      <div className="about-container">
        <section className="about-section">
          <h2>Who We Are</h2>
          <p>
            Light Hub Customs is Kenya's leading provider of high-quality automotive lighting products. 
            We specialize in headlights, fog lights, tail lights, and custom lighting solutions for all 
            vehicle makes and models.
          </p>
          <p>
            Since our establishment, we've been committed to bringing the latest lighting technology 
            to Kenyan drivers, ensuring safety, style, and superior visibility on the road.
          </p>
        </section>

        <section className="about-section">
          <h2>What We Offer</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">💡</span>
              <h3>Premium Products</h3>
              <p>High-quality LED, HID, and Halogen lighting from trusted manufacturers</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔧</span>
              <h3>Expert Installation</h3>
              <p>Professional installation services by certified technicians</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">✅</span>
              <h3>Quality Guarantee</h3>
              <p>All products come with manufacturer warranty and quality assurance</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🚚</span>
              <h3>Fast Delivery</h3>
              <p>Nationwide delivery with express options available</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Why Choose Us</h2>
          <ul className="benefits-list">
            <li>✓ Largest selection of automotive lighting in Kenya</li>
            <li>✓ Competitive prices with regular promotions</li>
            <li>✓ Expert advice and compatibility checking</li>
            <li>✓ Secure payment options including M-Pesa</li>
            <li>✓ Easy returns and refunds policy</li>
            <li>✓ Responsive customer support</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Our Location</h2>
          <div className="location-info">
            <div className="location-details">
              <h3>📍 Visit Our Showroom</h3>
              <p>Light Hub Customs Warehouse</p>
              <p>Industrial Area, Nairobi</p>
              <p>Mombasa Road, Building 12</p>
              <p>Nairobi, Kenya</p>
            </div>
            <div className="location-details">
              <h3>🕐 Business Hours</h3>
              <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
              <p>Saturday: 9:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
            <div className="location-details">
              <h3>📞 Contact Us</h3>
              <p>Phone: +254 712 345 678</p>
              <p>Email: info@lighthubcustoms.com</p>
              <p>WhatsApp: +254 712 345 678</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to Upgrade Your Vehicle?</h2>
          <p>Browse our extensive collection of automotive lighting products</p>
          <a href="/shop" className="cta-button">Shop Now</a>
        </section>
      </div>
    </div>
  )
}

export default About
