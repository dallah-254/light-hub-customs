import React, { useState, useEffect } from 'react'
import { getProductsByCategory, getVehicleMakes, getVehicleModels } from '../services/dynamodb'

const CompatibilityChecker = () => {
  const [makes, setMakes] = useState([])
  const [models, setModels] = useState([])
  const [years, setYears] = useState([])
  const [vehicleInfo, setVehicleInfo] = useState({ make: '', model: '', year: '' })
  const [selectedCategory, setSelectedCategory] = useState('')
  const [results, setResults] = useState([])
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    loadMakes()
  }, [])

  const loadMakes = async () => {
    const vehicleMakes = await getVehicleMakes()
    setMakes(vehicleMakes)
  }

  const handleMakeChange = async (make) => {
    setVehicleInfo({ make, model: '', year: '' })
    setModels([])
    setYears([])
    const modelData = await getVehicleModels(make)
    setModels(modelData)
  }

  const handleModelChange = (model) => {
    setVehicleInfo({ ...vehicleInfo, model, year: '' })
    const selectedModel = models.find(m => m.model === model)
    setYears(selectedModel?.years || [])
  }

  const handleCheck = async () => {
    if (!vehicleInfo.make || !vehicleInfo.model || !vehicleInfo.year || !selectedCategory) {
      alert('Please fill all fields')
      return
    }
    const products = await getProductsByCategory(selectedCategory)
    setResults(products)
    setChecked(true)
  }

  const reset = () => {
    setVehicleInfo({ make: '', model: '', year: '' })
    setSelectedCategory('')
    setResults([])
    setChecked(false)
    setModels([])
    setYears([])
  }

  return (
    <div className="compatibility-page">
      <h1>✅ Compatibility Checker</h1>
      <p className="subtitle">Check if products fit your vehicle</p>

      <div className="checker-card">
        <h2>Enter Vehicle Information</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Make</label>
            <select value={vehicleInfo.make} onChange={(e) => handleMakeChange(e.target.value)}>
              <option value="">Select Make</option>
              {makes.map(make => <option key={make} value={make}>{make}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Model</label>
            <select 
              value={vehicleInfo.model}
              onChange={(e) => handleModelChange(e.target.value)}
              disabled={!vehicleInfo.make}
            >
              <option value="">Select Model</option>
              {models.map(m => <option key={m.model} value={m.model}>{m.model}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Year</label>
            <select 
              value={vehicleInfo.year} 
              onChange={(e) => setVehicleInfo({...vehicleInfo, year: e.target.value})}
              disabled={!vehicleInfo.model}
            >
              <option value="">Select Year</option>
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Product Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">Select Category</option>
              <option value="Headlight Projectors">Headlight Projectors</option>
              <option value="Fog Lights & Auxiliary Lighting">Fog Lights</option>
              <option value="Angel Eyes & Halo Rings">Angel Eyes</option>
              <option value="Interior Lighting">Interior Lighting</option>
            </select>
          </div>
        </div>

        <div className="button-group">
          <button onClick={handleCheck} className="check-btn">Check Compatibility</button>
          <button onClick={reset} className="reset-btn">Reset</button>
        </div>
      </div>

      {checked && (
        <div className="results-section">
          <div className="results-header">
            <h2>✅ Compatible Products for {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}</h2>
            <p>{results.length} products found</p>
          </div>

          <div className="results-grid">
            {results.map(product => (
              <div key={product.productId} className="result-card">
                <img src={product.imageUrl} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="result-price">KSh {(product.price / 100).toFixed(2)}</p>
                <div className="compatibility-badge">✅ Compatible</div>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => {
                    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
                    const existing = cart.find(item => item.productId === product.productId)
                    if (existing) {
                      existing.quantity += 1
                    } else {
                      cart.push({ ...product, quantity: 1 })
                    }
                    localStorage.setItem('cart', JSON.stringify(cart))
                    alert('Added to cart!')
                  }}
                >
                  🛒 Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="info-box">
        <h3>📞 Need Help?</h3>
        <p>Not sure about compatibility? Our experts can help!</p>
        <p className="contact-info">Call/WhatsApp: +254 712 345 678</p>
      </div>
    </div>
  )
}

export default CompatibilityChecker
