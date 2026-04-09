import React, { useState } from 'react'
import './DeliveryInfo.css'

const DeliveryInfo = ({ showSeller = false }) => {
  const [selectedCounty, setSelectedCounty] = useState('Nairobi')
  const [selectedArea, setSelectedArea] = useState('CBD - UON/Globe/Koja/River Road')
  const [deliveryType, setDeliveryType] = useState('pickup')

  const counties = {
    'Nairobi': ['CBD - UON/Globe/Koja/River Road', 'Westlands', 'Kilimani', 'Karen', 'Eastleigh', 'South B/C', 'Embakasi', 'Kasarani', 'Ngong Road'],
    'Mombasa': ['Mombasa CBD', 'Nyali', 'Bamburi', 'Likoni', 'Changamwe'],
    'Kisumu': ['Kisumu CBD', 'Milimani', 'Mamboleo', 'Kondele'],
    'Nakuru': ['Nakuru CBD', 'Milimani', 'Section 58', 'Lanet'],
    'Eldoret': ['Eldoret CBD', 'Pioneer', 'Langas', 'West Indies']
  }

  const deliveryFees = {
    pickup: 70,
    door: 160
  }

  return (
    <div className="delivery-info-sidebar">
      <div className="info-section">
        <h3>Delivery & Returns</h3>
        <p className="express-tag">⚡ Express delivery in main cities</p>
      </div>

      <div className="info-section">
        <h4>Choose your location</h4>
        <select 
          className="location-select"
          value={selectedCounty}
          onChange={(e) => {
            setSelectedCounty(e.target.value)
            setSelectedArea(counties[e.target.value][0])
          }}
        >
          {Object.keys(counties).map(county => (
            <option key={county} value={county}>{county}</option>
          ))}
        </select>

        <select 
          className="area-select"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
        >
          {counties[selectedCounty].map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </div>

      <div className="info-section">
        <div 
          className={`delivery-option ${deliveryType === 'pickup' ? 'active' : ''}`}
          onClick={() => setDeliveryType('pickup')}
        >
          <div className="option-header">
            <input type="radio" checked={deliveryType === 'pickup'} readOnly />
            <div>
              <strong>Pickup Station</strong>
              <p className="fee">Delivery Fees KSh {deliveryFees.pickup}</p>
            </div>
          </div>
          <p className="delivery-time">Ready for pickup on 10 April if you place your order within the next 1hrs 46mins</p>
        </div>

        <div 
          className={`delivery-option ${deliveryType === 'door' ? 'active' : ''}`}
          onClick={() => setDeliveryType('door')}
        >
          <div className="option-header">
            <input type="radio" checked={deliveryType === 'door'} readOnly />
            <div>
              <strong>Door Delivery</strong>
              <p className="fee">Delivery Fees KSh {deliveryFees.door}</p>
            </div>
          </div>
          <p className="delivery-time">Ready for delivery on 10 April if you place your order within the next 1hrs 46mins</p>
        </div>
      </div>

      <div className="info-section">
        <h4>Return Policy</h4>
        <p>Easy Return, Quick Refund. <a href="/returns">Details</a></p>
      </div>

      {showSeller && (
        <>
          <div className="info-section seller-section">
            <h4>Seller Information</h4>
            <div className="seller-header">
              <strong>Light Hub Customs</strong>
              <button className="follow-btn">+ Follow</button>
            </div>
            <div className="seller-stats">
              <div className="stat">
                <span className="stat-value">98%</span>
                <span className="stat-label">Seller Score</span>
              </div>
              <div className="stat">
                <span className="stat-value">5.8K</span>
                <span className="stat-label">Followers</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h4>Seller Performance</h4>
            <div className="performance-item">
              <span>Shipping speed:</span>
              <span className="excellent">Excellent</span>
            </div>
            <div className="performance-item">
              <span>Quality Score:</span>
              <span className="excellent">Excellent</span>
            </div>
            <div className="performance-item">
              <span>Customer Rating:</span>
              <span className="good">Good</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DeliveryInfo
