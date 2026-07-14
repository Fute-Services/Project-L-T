import { useEffect, useRef, useState } from 'react'
import { Maximize } from 'lucide-react'
import locationBackground from '../assets/images/location/site-location-aerial.webp'
import mobilityBackground from '../assets/images/location/location-city-coastline-day.webp'
import connectivityBackground from '../assets/images/location/location-connectivity.webp'
import infraBackground from '../assets/images/location/location-infra.webp'
import group43Logo from '../assets/images/location/group-43-logo.png'
import InteractiveMapView from '../components/location/InteractiveMapView'
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
  const [isBackHovered, setIsBackHovered] = useState<boolean>(false)
  const [isFullscreenHovered, setIsFullscreenHovered] = useState<boolean>(false)
  const [isExitHovered, setIsExitHovered] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const videoCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Warm the HTTP cache for the 3D map's building model while the user is
    // still looking at the static image, so opening the map doesn't stall on it.
    fetch('/buildings/LNT.glb', { cache: 'force-cache' }).catch(() => {})
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  if (isMapOpen) {
    return <InteractiveMapView onClose={() => setIsMapOpen(false)} />
  }

  const videoSrcByTab: Record<string, string> = {
    neighbourhood: '/videos/map_1.mp4',
    transport: '/videos/map_3.mp4',
    infra: '/videos/map_2.mp4',
  }
  const videoSrc = videoSrcByTab[activeTab]

  const backgroundsByTab: Record<string, string> = {
    site: locationBackground,
    neighbourhood: mobilityBackground,
    transport: connectivityBackground,
    infra: infraBackground,
  }
  const currentBackground = backgroundsByTab[activeTab] ?? locationBackground

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: videoSrc ? undefined : '#0a0d12',
      }}
      className="flex items-center justify-center"
    >
      {videoSrc ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--projet-detiyals, linear-gradient(105deg, #000 -9.5%, #472700 100%))',
          }}
        />
      ) : null}
      {videoSrc ? (
        <div
          ref={videoCardRef}
          className="w-[62vw] h-[75vh] rounded-[32px] lg:rounded-[40px] overflow-hidden shadow-2xl relative bg-black/45 border"
          style={{ borderColor: 'rgba(255, 255, 255, 0.08)', zIndex: 1 }}
        >
          <video
            key={videoSrc}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full"
            style={{ objectFit: 'cover', filter: 'brightness(1.15) contrast(1.1)' }}
          />

          <button
            onClick={() => videoCardRef.current?.requestFullscreen()}
            onMouseEnter={() => setIsFullscreenHovered(true)}
            onMouseLeave={() => setIsFullscreenHovered(false)}
            aria-label="View fullscreen"
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              zIndex: 2,
              ...standaloneGlassButtonStyle(false, isFullscreenHovered),
            }}
          >
            <Maximize size={16} strokeWidth={2} />
          </button>

          {isFullscreen ? (
            <button
              onClick={() => document.exitFullscreen()}
              onMouseEnter={() => setIsExitHovered(true)}
              onMouseLeave={() => setIsExitHovered(false)}
              aria-label="Exit fullscreen"
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                zIndex: 2,
                ...standaloneGlassButtonStyle(false, isExitHovered),
              }}
            >
              Back
            </button>
          ) : null}
        </div>
      ) : (
        // Fixed-aspect box reproducing the photo's cover-crop (3075x2141) so the
        // POI markers stay glued to landmarks at every viewport size.
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -53%)',
            width: 'max(100vw, 143.59vh)',
            height: 'max(100vh, 69.64vw)',
          }}
        >
          <img
            src={currentBackground}
            alt="Location aerial view"
            style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
          />
        </div>
      )}

      {videoSrc ? (
        <img
          src={group43Logo}
          alt=""
          style={{
            position: 'absolute',
            top: '30px',
            right: '40px',
            height: '56px',
            width: 'auto',
            zIndex: 10,
          }}
        />
      ) : null}

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
