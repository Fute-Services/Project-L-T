import { useEffect, useRef, useState } from 'react'
import { Map as MapIcon, Maximize } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import locationBackground from '../assets/images/location/site-location-aerial.png'
import mobilityBackground from '../assets/images/location/location-city-coastline-day.jpeg'
import connectivityBackground from '../assets/images/location/location-connectivity.jpeg'
import infraBackground from '../assets/images/location/location-infra.jpeg'
import group43Logo from '../assets/images/location/group-43-logo.png'
import InteractiveMapView from '../components/location/InteractiveMapView'
import { glassContainerStyle, pillButtonStyle, standaloneGlassButtonStyle } from '../styles/glassOverlay'
import logoOutline from '../assets/logos/logo-outline-white.svg'

// Import POI landmark preview images
import airportImg from '../assets/images/location/Airport mumbai.png'
import gatewayImg from '../assets/images/location/Gateway of india.png'
import hangingImg from '../assets/images/location/Hanging garden.png'
import worliImg from '../assets/images/location/Worli sea link.png'

const POI_MARKERS = [
  {
    name: "WORLI SEA LINK",
    left: "35%",
    top: "38%",
    image: worliImg,
    layout: "image-right",
  },
  {
    name: "AIRPORT MUMBAI",
    left: "50.5%",
    top: "20%",
    image: airportImg,
    layout: "image-left",
  },
  {
    name: "L&T Realty",
    left: "41.5%",
    top: "50.5%",
    image: logoOutline,
    layout: "logo",
  },
  {
    name: "HANGING GARDEN",
    left: "32.5%",
    top: "55.5%",
    image: hangingImg,
    layout: "image-right",
    bgColor: "#9BB6E3",
  },
  {
    name: "GATEWAY OF INDIA",
    left: "45.5%",
    top: "68.5%",
    image: gatewayImg,
    layout: "image-top",
    bgColor: "#9BB6E3",
  },
];

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
  const [isFullscreenHovered, setIsFullscreenHovered] = useState<boolean>(false)
  const [isExitHovered, setIsExitHovered] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const videoCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Warm the HTTP cache for the 3D map's building model while the user is
    // still looking at the static image, so opening the map doesn't stall on it.
    fetch('/buildings/LNT.glb', { cache: 'force-cache' }).catch(() => { })
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
            style={{ objectFit: 'cover' }}
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

          {/* 1.5. Site Location Markers Overlay (Only in 'site' tab) */}
          {activeTab === 'site' && (
            <div className="absolute inset-0 w-full h-full z-20 pointer-events-none">
              {/* Landmark POI & Site Markers */}
              {POI_MARKERS.map((poi, index) => {
                if (poi.layout === 'logo') {
                  return (
                    <motion.div
                      key={poi.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.0, delay: index * 0.15 + 0.3 }}
                      className="absolute pointer-events-auto flex flex-col items-center group cursor-pointer"
                      style={{
                        left: poi.left,
                        top: poi.top,
                        transform: "translate(-50%, calc(-100% + 16px))",
                      }}
                    >
                      {/* Popup Label (Only visible on hover) */}
                      <div className="flex flex-col items-center transition-all duration-300 ease-out transform opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-hover:-translate-y-2 origin-bottom pointer-events-none mb-1">
                        <div
                          className="px-3.5 py-1.5 rounded-full border border-sky-400/30 font-sans text-[8.5px] lg:text-[10px] font-bold tracking-widest uppercase shadow-lg bg-[#0c1c38] text-white"
                          style={{
                            textShadow: "0 2px 4px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.6)"
                          }}
                        >
                          {poi.name}
                        </div>
                        {/* Triangle */}
                        <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#0c1c38] -mt-[1px]" />
                      </div>

                      {/* Site Logo Container */}
                      <div className="relative w-11 h-11 flex items-center justify-center rounded-full bg-[#0f2d59] border border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.4)] p-1.5 transition-transform duration-300 group-hover:scale-110">
                        <img src={poi.image} className="w-7 h-7 object-contain" alt="L&T Site" />
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={poi.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 1.0, delay: index * 0.15 + 0.3 }}
                    className="absolute flex flex-col items-center pointer-events-auto group cursor-pointer pb-2"
                    style={{
                      left: poi.left,
                      top: poi.top,
                      transform: "translate(-50%, calc(-100% + 16px))",
                    }}
                  >
                    {/* The Popup Container (rises and scales slightly on hover) */}
                    <div className="flex flex-col items-center transition-all duration-300 ease-out transform group-hover:-translate-y-2 group-hover:scale-105 origin-bottom">
                      {/* The Image (no pill background) */}
                      <img
                        src={poi.image}
                        className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl object-cover border-2 border-white/20 shadow-2xl transition-all duration-300 group-hover:border-[#ffcb6e]"
                        alt={poi.name}
                        style={{ backgroundColor: poi.bgColor }}
                      />

                      {/* The Name (no pill background, styled with text shadow) */}
                      <span
                        className="text-[8.5px] lg:text-[10px] font-extrabold text-white tracking-widest uppercase mt-1.5 transition-all duration-300 group-hover:text-[#ffcb6e] whitespace-nowrap"
                        style={{
                          textShadow: "0 2px 4px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.6)"
                        }}
                      >
                        {poi.name}
                      </span>
                    </div>

                    {/* Pulsing Dot */}
                    <div className="relative w-4 h-4 flex items-center justify-center mt-1.5 z-10">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffcb6e]/50 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ffcb6e] shadow-[0_0_10px_#ffcb6e]"></span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
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
