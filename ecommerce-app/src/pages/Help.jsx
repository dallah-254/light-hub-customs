import React, { useState } from 'react'
import './Help.css'

const Help = () => {
  const [activeCategory, setActiveCategory] = useState('orders')
  const [searchQuery, setSearchQuery] = useState('')
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const categories = [
    { id: 'orders', icon: '📦', label: 'Orders & Shipping' },
    { id: 'products', icon: '💡', label: 'Products' },
    { id: 'payment', icon: '💳', label: 'Payment' },
    { id: 'returns', icon: '↩️', label: 'Returns & Refunds' },
    { id: 'account', icon: '👤', label: 'Account' },
    { id: 'technical', icon: '🔧', label: 'Technical Support' }
  ]

  const faqs = {
    orders: [
      {
        q: 'How can I track my order?',
        a: 'You can track your order by visiting the Track Order page and entering your order ID. You will see real-time updates on your package location and delivery status.'
      },
      {
        q: 'What are the delivery times?',
        a: 'Standard delivery takes 3-5 business days, Express delivery takes 1-2 business days, and Store Pickup is available within 24 hours.'
      },
      {
        q: 'Do you deliver nationwide?',
        a: 'Yes, we deliver to all counties in Kenya. Delivery charges may vary based on location.'
      },
      {
        q: 'Can I change my delivery address?',
        a: 'You can change your delivery address within 2 hours of placing the order. Contact our support team immediately.'
      }
    ],
    products: [
      {
        q: 'Are all products compatible with my vehicle?',
        a: 'Use our Compatibility Checker tool to verify if a product fits your vehicle. Enter your vehicle details to get accurate results.'
      },
      {
        q: 'Do you offer installation services?',
        a: 'Yes, we partner with certified installers across Kenya. Installation can be arranged at checkout for an additional fee.'
      },
      {
        q: 'What warranty do products come with?',
        a: 'All products come with manufacturer warranty ranging from 6 months to 2 years depending on the product category.'
      },
      {
        q: 'Can I get bulk discounts?',
        a: 'Yes, we offer bulk discounts for orders of 10+ units. Contact our sales team for a custom quote.'
      }
    ],
    payment: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept M-Pesa, Credit/Debit Cards (Visa, Mastercard), and Cash on Delivery for eligible orders.'
      },
      {
        q: 'Is it safe to pay online?',
        a: 'Yes, all transactions are encrypted with SSL security. We never store your card details on our servers.'
      },
      {
        q: 'Can I pay in installments?',
        a: 'Yes, we offer installment payment options through our partner Lipa Later for orders above KSh 5,000.'
      },
      {
        q: 'What if my payment fails?',
        a: 'If your payment fails, please check your account balance and try again. Contact your bank if the issue persists.'
      }
    ],
    returns: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 14-day return policy for unused products in original packaging. Some restrictions apply to electrical items.'
      },
      {
        q: 'How do I initiate a return?',
        a: 'Go to your Orders page, select the order, and click "Request Return". Our team will guide you through the process.'
      },
      {
        q: 'When will I get my refund?',
        a: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item.'
      },
      {
        q: 'Who pays for return shipping?',
        a: 'If the return is due to our error or defective product, we cover shipping. Otherwise, return shipping is customer responsibility.'
      }
    ],
    account: [
      {
        q: 'How do I create an account?',
        a: 'Click on "Register" in the top menu, fill in your details, and verify your email address to activate your account.'
      },
      {
        q: 'I forgot my password. What should I do?',
        a: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions to reset your password.'
      },
      {
        q: 'How do I update my account information?',
        a: 'Go to Profile → Account Settings to update your personal information, address, and preferences.'
      },
      {
        q: 'Can I delete my account?',
        a: 'Yes, you can delete your account from Profile → Account Settings → Danger Zone. This action is permanent.'
      }
    ],
    technical: [
      {
        q: 'The website is not loading properly',
        a: 'Try clearing your browser cache, updating your browser, or using a different browser. Contact support if the issue persists.'
      },
      {
        q: 'I cannot add items to cart',
        a: 'Make sure you are logged in and have a stable internet connection. Try refreshing the page or clearing cookies.'
      },
      {
        q: 'Images are not displaying',
        a: 'This may be due to slow internet connection. Wait a moment for images to load or try refreshing the page.'
      },
      {
        q: 'How do I report a bug?',
        a: 'Use the contact form below to report any technical issues. Include screenshots and detailed description of the problem.'
      }
    ]
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    alert('Thank you for contacting us! We will respond within 24 hours.')
    setContactForm({ name: '', email: '', subject: '', message: '' })
  }

  const filteredFaqs = faqs[activeCategory].filter(faq =>
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="help-page">
      <div className="help-header">
        <h1>How can we help you?</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="help-container">
        <aside className="help-sidebar">
          <h3>Categories</h3>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={activeCategory === cat.id ? 'active' : ''}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="cat-icon">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </aside>

        <main className="help-content">
          <div className="faqs-section">
            <h2>{categories.find(c => c.id === activeCategory)?.label}</h2>
            
            {filteredFaqs.length === 0 ? (
              <div className="no-results">
                <p>No results found for "{searchQuery}"</p>
              </div>
            ) : (
              <div className="faqs-list">
                {filteredFaqs.map((faq, index) => (
                  <details key={index} className="faq-item">
                    <summary>{faq.q}</summary>
                    <p>{faq.a}</p>
                  </details>
                ))}
              </div>
            )}
          </div>

          <div className="quick-links">
            <h3>Quick Links</h3>
            <div className="links-grid">
              <a href="/track" className="quick-link-card">
                <span className="link-icon">📍</span>
                <span>Track Order</span>
              </a>
              <a href="/orders" className="quick-link-card">
                <span className="link-icon">📦</span>
                <span>My Orders</span>
              </a>
              <a href="/profile" className="quick-link-card">
                <span className="link-icon">👤</span>
                <span>My Account</span>
              </a>
              <a href="/contact" className="quick-link-card">
                <span className="link-icon">📧</span>
                <span>Contact Us</span>
              </a>
            </div>
          </div>

          <div className="contact-section">
            <h2>Still need help?</h2>
            <p>Can't find what you're looking for? Send us a message and we'll get back to you.</p>
            
            <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                required
              />
              <textarea
                placeholder="Your Message"
                rows="5"
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                required
              />
              <button type="submit">Send Message</button>
            </form>
          </div>

          <div className="contact-info">
            <h3>Other ways to reach us</h3>
            <div className="contact-methods">
              <div className="method">
                <span className="method-icon">📞</span>
                <div>
                  <strong>Phone</strong>
                  <p>+254 712 345 678</p>
                </div>
              </div>
              <div className="method">
                <span className="method-icon">📧</span>
                <div>
                  <strong>Email</strong>
                  <p>support@lighthubcustoms.com</p>
                </div>
              </div>
              <div className="method">
                <span className="method-icon">💬</span>
                <div>
                  <strong>WhatsApp</strong>
                  <p>+254 712 345 678</p>
                </div>
              </div>
              <div className="method">
                <span className="method-icon">🕐</span>
                <div>
                  <strong>Business Hours</strong>
                  <p>Mon-Fri: 8AM-6PM, Sat: 9AM-4PM</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Help
