import React from 'react'
import { useNavigate } from 'react-router-dom'

const Tools = () => {
  const navigate = useNavigate()

  const tools = [
    {
      name: 'Compare Products',
      icon: '⚖️',
      description: 'Compare specifications and features side by side',
      path: '/tools/compare'
    },
    {
      name: 'Compatibility Checker',
      icon: '✅',
      description: 'Check if products fit your vehicle',
      path: '/tools/compatibility'
    },
    {
      name: 'Bulb Size Finder',
      icon: '💡',
      description: 'Find the right bulb size for your car',
      path: '/tools/bulb-finder'
    },
    {
      name: 'Fitment Guide',
      icon: '🔧',
      description: 'Installation guides and fitment information',
      path: '/tools/fitment'
    }
  ]

  return (
    <div className="tools-page">
      <div className="tools-header">
        <h1>🛠️ Tools & Resources</h1>
        <p>Find the perfect products for your vehicle</p>
      </div>

      <div className="tools-grid">
        {tools.map((tool, index) => (
          <div 
            key={index}
            className="tool-card"
            onClick={() => navigate(tool.path)}
          >
            <div className="tool-icon">{tool.icon}</div>
            <h2>{tool.name}</h2>
            <p>{tool.description}</p>
            <button className="tool-btn">Use Tool →</button>
          </div>
        ))}
      </div>

      <div className="tools-info">
        <div className="info-card">
          <h3>📞 Need Help?</h3>
          <p>Our experts are here to assist you</p>
          <p className="contact">Call/WhatsApp: +254 712 345 678</p>
        </div>
        <div className="info-card">
          <h3>💡 Not Sure?</h3>
          <p>Use our tools to find the perfect fit</p>
          <p className="highlight">100% Compatibility Guaranteed</p>
        </div>
        <div className="info-card">
          <h3>🚚 Fast Delivery</h3>
          <p>Same day installation available</p>
          <p className="highlight">Free Shipping Over KSh 5,000</p>
        </div>
      </div>
    </div>
  )
}

export default Tools
