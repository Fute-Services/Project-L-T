import { useEffect, useRef, useState } from 'react'
import { Maximize } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
const locationBackground = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/17b41634-6695-49c9-61a2-8f9d29916400/public";
const mobilityBackground = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/dc10b7fa-face-4664-3e64-7730e1fc3900/public";
const connectivityBackground = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/516be76d-66fe-41a5-6c08-756b0e7f9b00/public";
const infraBackground = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/31d45c69-edae-427e-5929-694fb0757000/public";
const group43Logo = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/abe60fc8-d31a-482c-276d-74b273dcc700/public";
import InteractiveMapView from '../components/location/InteractiveMapView'
import { glassContainerStyle, pillButtonStyle, standaloneGlassButtonStyle } from '../styles/glassOverlay'
import logoOutline from '../assets/logos/logo-outline-white.svg'
import LeftNavbar from '../components/navigation/LeftNavbar'
import RightNavbar from '../components/navigation/RightNavbar'

// Import POI landmark preview images
import atalSetuImg from '../assets/images/location/atal setu.png';
const airportImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/21c606ba-bc5f-4e6b-54bb-b8d8d2f10200/public";
const gatewayImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/2d6d2e06-6b90-439b-da0d-bd4f76af4900/public";
const hangingImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/6b184508-4f2a-4108-4321-63508007d100/public";
const worliImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/c2d60073-f025-4b37-04ef-59dfbce98500/public";

const POI_MARKERS = [
  {
    name: "WORLI SEA LINK",
    distance: "3 KM",
    left: "35%",
    top: "38%",
    image: worliImg,
    layout: "image-right",
  },
  {
    name: "AIRPORT MUMBAI",
    distance: "13 KM",
    left: "50.5%",
    top: "21%",
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
    distance: "7.9 KM",
    left: "32.5%",
    top: "55.5%",
    image: hangingImg,
    layout: "image-right",
    bgColor: "#9BB6E3",
  },
  {
    name: "GATEWAY OF INDIA",
    distance: "16.2 KM",
    left: "45.5%",
    top: "68.5%",
    image: gatewayImg,
    layout: "image-top",
    bgColor: "#9BB6E3",
  },
  {
    name: "ATAL SETU",
    distance: "36.5 KM",
    left: "80%",
    top: "28%",
    image: atalSetuImg,
    layout: "image-right",
    // bgColor: "#9BB6E3",
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
  const [isFullscreenHovered, setIsFullscreenHovered] = useState<boolean>(false)
  const [isExitHovered, setIsExitHovered] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [isNight, setIsNight] = useState<boolean>(true)
  const [showIntro, setShowIntro] = useState<boolean>(true)
  const [isInitialLoadDone, setIsInitialLoadDone] = useState<boolean>(false)
  const videoCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Warm the HTTP cache for the 3D map's building model while the user is
    // still looking at the static image, so opening the map doesn't stall on it.
    fetch('/buildings/LNT.glb', { cache: 'force-cache' }).catch(() => { })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false)
    }, 2000)
    const loadTimer = setTimeout(() => {
      setIsInitialLoadDone(true)
    }, 6000)
    return () => {
      clearTimeout(timer)
      clearTimeout(loadTimer)
    }
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
    <motion.div
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
        <motion.div
          animate={{ filter: showIntro ? "blur(24px)" : "blur(0px)" }}
          transition={
            isInitialLoadDone
              ? { duration: 0.3, delay: 0, ease: "easeInOut" }
              : { duration: 1.5, delay: showIntro ? 0 : 1.5, ease: "easeInOut" }
          }
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
                      animate={!showIntro ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={
                        isInitialLoadDone
                          ? { duration: 0.3, delay: 0, ease: "easeOut" }
                          : { duration: 1.5, delay: showIntro ? 0 : (index * 0.35 + 3.5), ease: [0.16, 1, 0.3, 1] }
                      }
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
                    animate={!showIntro ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={
                      isInitialLoadDone
                        ? { duration: 0.3, delay: 0, ease: "easeOut" }
                        : { duration: 1.5, delay: showIntro ? 0 : (index * 0.35 + 3.5), ease: [0.16, 1, 0.3, 1] }
                    }
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
                        className="text-[8.5px] lg:text-[10px] font-extrabold text-white tracking-widest uppercase mt-1.5 transition-all duration-300 group-hover:text-[#ffcb6e] whitespace-nowrap block text-center"
                        style={{
                          textShadow: "0 2px 4px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.6)"
                        }}
                      >
                        {poi.name}
                      </span>

                      {/* Distance (Optional second line) */}
                      {poi.distance && (
                        <span
                          className="text-[8.5px] lg:text-[10px] font-sans font-bold text-white tracking-widest uppercase mt-0.5 transition-all duration-300 whitespace-nowrap block text-center"
                          style={{
                            textShadow: "0 2px 4px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.6)"
                          }}
                        >
                          {poi.distance}
                        </span>
                      )}
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
        </motion.div>
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

      <motion.div
        initial={{ opacity: 0, y: 20, x: '-50%' }}
        animate={!showIntro ? { opacity: 1, y: 0, x: '-50%' } : { opacity: 0, y: 20, x: '-50%' }}
        transition={{ duration: 0.8, delay: showIntro ? 0 : 2.2 }}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
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
              onClick={() => {
                setActiveTab(tab.key)
                setIsInitialLoadDone(true)
              }}
              onMouseEnter={() => setHoveredTab(tab.key)}
              onMouseLeave={() => setHoveredTab(null)}
              style={pillButtonStyle(isActive, isHovered, '11.5px', '32px', '16px')}
            >
              {tab.label}
            </button>
          )
        })}
      </motion.div>


      {/* Intro Animation Overlay */}
      <AnimatePresence>
        {showIntro && (
          <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
            <motion.div
              initial={{ y: "-50vh", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-50vh", opacity: 0 }}
              transition={{ duration: 2, ease: [0.25, 1, 0.5, 1] }}
              className="flex flex-col items-center justify-center text-center z-40 px-4"
            >
              <h1 className="text-white text-3xl md:text-5xl lg:text-[54px] xl:text-[64px] font-light tracking-[0.12em] drop-shadow-2xl leading-none uppercase font-sans font-100">
                Lower Parel, Mumbai
              </h1>
              <p className="text-white/80 text-xs md:text-sm lg:text-lg mt-3 md:mt-4 font-medium tracking-[0.05em] drop-shadow-lg font-sans">
                The epicenter of India’s financial capital.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Top Left Logo */}
      <AnimatePresence>
        {!showIntro && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, delay: 2.2, ease: "easeOut" }}
            className="absolute z-20 top-8 left-10 flex items-center gap-4 select-none pointer-events-none"
          >
            <div className="relative w-12 h-12">
              <img
                src={logoOutline}
                alt="L&T Logo"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
            <div className="flex items-center text-white">
              <h1 className="font-mahameru text-sm font-semibold tracking-wide italic leading-none">
                L&T Realty
              </h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Navbar Container */}
      <AnimatePresence>
        {!showIntro && (
          <div className="fixed left-5 lg:left-16 top-[55%] lg:top-1/2 -translate-y-1/2 z-50">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 2.2, ease: "easeOut" }}
            >
              <LeftNavbar />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Right Navbar Container */}
      <AnimatePresence>
        {!showIntro && (
          <div className="fixed right-5 lg:right-10 top-[55%] lg:top-1/2 -translate-y-1/2 z-50">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 2.2, ease: "easeOut" }}
            >
              <RightNavbar isNight={isNight} setIsNight={setIsNight} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
