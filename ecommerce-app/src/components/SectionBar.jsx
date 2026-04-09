import React from 'react'
import { useNavigate } from 'react-router-dom'
import './SectionBar.css'

const SectionBar = () => {
  const navigate = useNavigate()
  
  const sections = [
    { name: 'Carousel', value: 'carousel', icon: '🎯' },
    { name: 'New Arrivals', value: 'new-arrival', icon: '✨' },
    { name: 'Hot Deals', value: 'deal', icon: '🔥' },
    { name: 'Accessories', value: 'accessory', icon: '🛠️' },
    { name: 'Best Sellers', value: 'best-seller', icon: '⭐' }
  ]

  return (
    <div className="section-bar">
      {sections.map((section, index) => (
        <div
          key={index}
          className="section-item"
          onClick={() => navigate(`/section/${section.value}`)}
        >
          <span className="section-icon">{section.icon}</span>
          <span className="section-name">{section.name}</span>
        </div>
      ))}
    </div>
  )
}

export default SectionBar
