import { useEffect, useState } from 'react'
import { Map as MapIcon } from 'lucide-react'
import locationBackground from '../assets/images/location/location-site-sunset.png'
import mobilityBackground from '../assets/images/location/location-city-coastline-day.jpeg'
import connectivityBackground from '../assets/images/location/location-connectivity.jpeg'
import infraBackground from '../assets/images/location/location-infra.jpeg'
import InteractiveMapView from '../components/location/InteractiveMapView'
import MobilityOverlay from '../components/location/MobilityOverlay'
import { glassContainerStyle, pillButtonStyle, standaloneGlassButtonStyle } from '../styles/glassOverlay'

const TABS = [
  { key: 'site', label: 'Site Location' },
  { key: 'neighbourhood', label: 'Mobility' },
  { key: 'transport', label: 'Connectivity' },
  { key: 'infra', label: 'Infra' },
]

export default function LocationPage() {
  const [activeTab, setActiveTab] = useState<string>('site')
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false)
  const [isMapHovered, setIsMapHovered] = useState<boolean>(false)
  const [isBackHovered, setIsBackHovered] = useState<boolean>(false)

  useEffect(() => {
    // Warm the HTTP cache for the 3D map's building model while the user is
    // still looking at the static image, so opening the map doesn't stall on it.
    fetch('/buildings/LNT.glb', { cache: 'force-cache' }).catch(() => {})
  }, [])

  if (isMapOpen) {
    return <InteractiveMapView onClose={() => setIsMapOpen(false)} />
  }

  const isMobilityTab = activeTab === 'neighbourhood'

  const backgroundsByTab: Record<string, string> = {
    site: locationBackground,
    neighbourhood: mobilityBackground,
    transport: connectivityBackground,
    infra: infraBackground,
  }
  const currentBackground = backgroundsByTab[activeTab] ?? locationBackground

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#0a0d12' }}>
      {isMobilityTab ? (
        /* The Mobility overlay anchors its markings to the photo, not the viewport:
           this box reproduces the photo's cover-crop (1376x768) so the overlay's
           percentage coordinates stay glued to landmarks at every viewport size
           and aspect ratio. */
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'max(100vw, 179.17vh)',
            height: 'max(100vh, 55.82vw)',
          }}
        >
          <img
            src={currentBackground}
            alt="Location aerial view"
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
          <MobilityOverlay />
        </div>
      ) : (
        <img
          src={currentBackground}
          alt="Location aerial view"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}

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
          zIndex: 10,
          ...glassContainerStyle,
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
              style={pillButtonStyle(isActive, isHovered, '11.5px', '32px', '16px')}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* MAP TOGGLE — bottom-right corner, opens the interactive 3D map */}
      <button
        onClick={() => setIsMapOpen(true)}
        onMouseEnter={() => setIsMapHovered(true)}
        onMouseLeave={() => setIsMapHovered(false)}
        aria-label="Open interactive map"
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '40px',
          gap: '8px',
          zIndex: 10,
          ...standaloneGlassButtonStyle(false, isMapHovered),
        }}
      >
        <MapIcon size={16} strokeWidth={2} />
        Map
      </button>

      {/* TOP LEFT — back to previous page */}
      <button
        onClick={() => window.history.go(-1)}
        onMouseEnter={() => setIsBackHovered(true)}
        onMouseLeave={() => setIsBackHovered(false)}
        style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          zIndex: 10,
          ...standaloneGlassButtonStyle(false, isBackHovered),
        }}
      >
        Back
      </button>
    </div>
  )
}
