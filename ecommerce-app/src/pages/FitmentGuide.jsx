import React, { useState } from 'react'
import './FitmentGuide.css'

const FitmentGuide = () => {
  const [selectedCategory, setSelectedCategory] = useState('')

  const guides = {
    'Headlight Projectors': {
      icon: '🔦',
      difficulty: 'Medium',
      time: '2-3 hours',
      tools: ['Screwdriver set', 'Socket wrench', 'Wire strippers', 'Electrical tape', 'Heat gun'],
      steps: [
        'Disconnect battery negative terminal',
        'Remove front bumper or access headlight assembly',
        'Remove existing headlight assembly',
        'Install projector housing into headlight',
        'Connect wiring harness',
        'Seal and reassemble headlight',
        'Reinstall headlight assembly',
        'Test and adjust beam alignment'
      ],
      tips: ['Wear gloves to avoid fingerprints on bulbs', 'Use proper sealant to prevent moisture', 'Adjust beam pattern after installation']
    },
    'Fog Lights': {
      icon: '🌫️',
      difficulty: 'Easy',
      time: '1-2 hours',
      tools: ['Screwdriver', 'Wire connectors', 'Drill (if needed)', 'Mounting brackets'],
      steps: [
        'Locate fog light mounting position',
        'Install mounting brackets',
        'Connect wiring to battery/switch',
        'Mount fog lights',
        'Route and secure wiring',
        'Test functionality',
        'Adjust beam angle'
      ],
      tips: ['Aim fog lights low to avoid glare', 'Use relay for proper power distribution', 'Waterproof all connections']
    },
    'Angel Eyes': {
      icon: '👁️',
      difficulty: 'Medium',
      time: '2-3 hours',
      tools: ['Screwdriver set', 'Wire strippers', 'Soldering iron', 'Heat shrink tubing'],
      steps: [
        'Remove headlight assembly',
        'Open headlight housing (heat gun method)',
        'Install angel eye rings',
        'Connect to power source',
        'Seal headlight housing',
        'Reinstall and test',
        'Adjust brightness if needed'
      ],
      tips: ['Use proper voltage controller', 'Ensure even light distribution', 'Seal properly to prevent condensation']
    },
    'Interior Lighting': {
      icon: '💡',
      difficulty: 'Easy',
      time: '30 minutes - 1 hour',
      tools: ['Plastic pry tools', 'Wire taps', 'Zip ties'],
      steps: [
        'Remove interior panels carefully',
        'Plan LED strip placement',
        'Clean mounting surface',
        'Install LED strips',
        'Connect to power source',
        'Route and hide wiring',
        'Test all lights',
        'Secure and reassemble panels'
      ],
      tips: ['Use 3M adhesive for secure mounting', 'Connect to door trigger for auto on/off', 'Avoid blocking airbags']
    }
  }

  return (
    <div className="fitment-page">
      <h1>🔧 Fitment Guide</h1>
      <p className="subtitle">Installation guides and fitment information</p>

      <div className="category-selector">
        <h2>Select Product Category</h2>
        <div className="category-grid">
          {Object.keys(guides).map(category => (
            <div 
              key={category}
              className={`category-card ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              <div className="category-icon">{guides[category].icon}</div>
              <h3>{category}</h3>
            </div>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <div className="guide-content">
          <div className="guide-header">
            <h2>{guides[selectedCategory].icon} {selectedCategory} Installation</h2>
            <div className="guide-meta">
              <span className="difficulty">Difficulty: <strong>{guides[selectedCategory].difficulty}</strong></span>
              <span className="time">Time: <strong>{guides[selectedCategory].time}</strong></span>
            </div>
          </div>

          <div className="guide-section">
            <h3>🛠️ Required Tools</h3>
            <ul className="tools-list">
              {guides[selectedCategory].tools.map((tool, i) => (
                <li key={i}>{tool}</li>
              ))}
            </ul>
          </div>

          <div className="guide-section">
            <h3>📋 Installation Steps</h3>
            <ol className="steps-list">
              {guides[selectedCategory].steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="guide-section tips-section">
            <h3>💡 Pro Tips</h3>
            <ul className="tips-list">
              {guides[selectedCategory].tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="help-box">
        <h3>📞 Need Professional Installation?</h3>
        <p>We offer professional installation services</p>
        <p className="contact">Call/WhatsApp: +254 712 345 678</p>
      </div>
    </div>
  )
}

export default FitmentGuide
