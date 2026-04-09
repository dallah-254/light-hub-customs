import React, { useState, useEffect } from 'react'
import { getVehicleMakes, getVehicleModels, getBulbSizes } from '../services/dynamodb'
import './BulbFinder.css'

const BulbFinder = () => {
  const [makes, setMakes] = useState([])
  const [models, setModels] = useState([])
  const [years, setYears] = useState([])
  const [vehicleInfo, setVehicleInfo] = useState({ make: '', model: '', year: '' })
  const [results, setResults] = useState(null)

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
    setResults(null)
    const modelData = await getVehicleModels(make)
    setModels(modelData)
  }

  const handleModelChange = (model) => {
    setVehicleInfo({ ...vehicleInfo, model, year: '' })
    setResults(null)
    const selectedModel = models.find(m => m.model === model)
    setYears(selectedModel?.years || [])
  }

  const handleFind = async () => {
    if (!vehicleInfo.make || !vehicleInfo.model || !vehicleInfo.year) {
      alert('Please select all fields')
      return
    }
    console.log('Fetching bulb data for:', vehicleInfo.make, vehicleInfo.model)
    const bulbData = await getBulbSizes(vehicleInfo.make, vehicleInfo.model)
    console.log('Received bulb data:', bulbData)
    setResults(bulbData)
  }

  const reset = () => {
    setVehicleInfo({ make: '', model: '', year: '' })
    setResults(null)
    setModels([])
    setYears([])
  }

  return (
    <div className="bulb-finder-page">
      <h1>💡 Bulb Size Finder</h1>
      <p className="subtitle">Find the right bulb size for your car</p>

      <div className="finder-card">
        <h2>Select Your Vehicle</h2>
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
        </div>

        <div className="button-group">
          <button onClick={handleFind} className="find-btn">Find Bulb Sizes</button>
          <button onClick={reset} className="reset-btn">Reset</button>
        </div>
      </div>

      {results && (
        <div className="results-section">
          <h2>💡 Bulb Sizes for {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}</h2>
          
          <div className="bulb-grid">
            <div className="bulb-card">
              <div className="bulb-icon">🔦</div>
              <h3>Headlight</h3>
              <div className="bulb-info">
                <span>Low Beam: <strong>{results.headlightLow}</strong></span>
                <span>High Beam: <strong>{results.headlightHigh}</strong></span>
              </div>
            </div>

            <div className="bulb-card">
              <div className="bulb-icon">🌫️</div>
              <h3>Fog Light</h3>
              <div className="bulb-info">
                <span><strong>{results.fogLight}</strong></span>
              </div>
            </div>

            <div className="bulb-card">
              <div className="bulb-icon">➡️</div>
              <h3>Turn Signal</h3>
              <div className="bulb-info">
                <span>Front: <strong>{results.turnSignalFront}</strong></span>
                <span>Rear: <strong>{results.turnSignalRear}</strong></span>
              </div>
            </div>

            <div className="bulb-card">
              <div className="bulb-icon">🅿️</div>
              <h3>Parking Light</h3>
              <div className="bulb-info">
                <span><strong>{results.parkingLight}</strong></span>
              </div>
            </div>

            <div className="bulb-card">
              <div className="bulb-icon">🔴</div>
              <h3>Tail Light</h3>
              <div className="bulb-info">
                <span><strong>{results.tailLight}</strong></span>
              </div>
            </div>

            <div className="bulb-card">
              <div className="bulb-icon">🛑</div>
              <h3>Brake Light</h3>
              <div className="bulb-info">
                <span><strong>{results.brakeLight}</strong></span>
              </div>
            </div>

            <div className="bulb-card">
              <div className="bulb-icon">⬅️</div>
              <h3>Reverse Light</h3>
              <div className="bulb-info">
                <span><strong>{results.reverseLight}</strong></span>
              </div>
            </div>

            <div className="bulb-card">
              <div className="bulb-icon">🔢</div>
              <h3>License Plate</h3>
              <div className="bulb-info">
                <span><strong>{results.licensePlate}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="info-box">
        <h3>📞 Need Help?</h3>
        <p>Not sure which bulb to choose? Contact us!</p>
        <p className="contact-info">Call/WhatsApp: +254 712 345 678</p>
      </div>
    </div>
  )
}

export default BulbFinder
