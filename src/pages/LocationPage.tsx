import { useState } from 'react'
import locationBackground from '../assets/images/location/location-background.png'

const TABS = [
  { key: 'site', label: 'Site Location' },
  { key: 'neighbourhood', label: 'Neighbourhood' },
  { key: 'transport', label: 'Transport Infra' },
]

export default function LocationPage() {
  const [activeTab, setActiveTab] = useState<string>('site')
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <img
        src={locationBackground}
        alt="Location aerial view"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '5px',
          background: 'rgba(10, 10, 8, 0.55)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          border: '1.5px solid rgba(255, 239, 168, 0.25)',
          borderRadius: '999px',
          boxShadow:
            '0 0 0 1px rgba(0, 0, 0, 0.4), 0 0 24px rgba(255, 239, 168, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.12), 0 12px 32px rgba(0, 0, 0, 0.5)',
          zIndex: 10,
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key
          const isHovered = hoveredTab === tab.key

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              onMouseEnter={() => setHoveredTab(tab.key)}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                height: '38px',
                padding: '0 20px',
                background: isActive
                  ? 'rgba(255, 239, 168, 0.22)'
                  : isHovered
                    ? 'rgba(255, 239, 168, 0.08)'
                    : 'transparent',
                color: isActive ? '#FFEFA8' : 'rgba(232, 224, 200, 0.65)',
                border: isActive
                  ? '1px solid rgba(255, 239, 168, 0.6)'
                  : '1px solid transparent',
                borderRadius: '999px',
                cursor: 'pointer',
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: '12.5px',
                letterSpacing: '0.02em',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                textShadow: isActive ? '0 1px 3px rgba(0, 0, 0, 0.45)' : 'none',
                boxShadow: isActive
                  ? 'inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 4px 16px rgba(255, 239, 168, 0.3)'
                  : 'none',
                transition: 'background 0.25s ease, box-shadow 0.25s ease, color 0.25s ease, border-color 0.25s ease',
                outline: 'none',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
