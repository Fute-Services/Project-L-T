import { useState } from 'react'
import { motion } from 'framer-motion'

export interface POICardData {
  key: string
  name: string
  subtitle?: string
  distance?: string
  image: string
  /** Card position as a percentage of the container, top-left anchored */
  top: string
  left: string
  delay?: number
  /** Card width; defaults to '108px' */
  width?: string
  /** Thumbnail image height; defaults to '62px' */
  imageHeight?: string
  /** When true, renders just the rounded photo with no name/subtitle/distance label */
  imageOnly?: boolean
}

// Small, premium floating card for a point of interest — white surface, rounded
// image on top, name + distance below. Matches the reference connectivity-map
// callout style (Apple Maps-like), not the earlier dark-glass treatment.
export default function POICard({ name, subtitle, distance, image, top, left, delay = 0, width = '108px', imageHeight = '62px', imageOnly = false }: Omit<POICardData, 'key'>) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="absolute pointer-events-auto"
      style={{ top, left, zIndex: 10 }}
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.06 : 1,
          y: isHovered ? -3 : 0,
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width,
          borderRadius: '14px',
          overflow: 'hidden',
          background: '#ffffff',
          boxShadow: isHovered
            ? '0 6px 14px rgba(0, 0, 0, 0.20)'
            : '0 3px 8px rgba(0, 0, 0, 0.15)',
          cursor: 'default',
        }}
      >
        <div style={{ width: '100%', height: imageHeight, overflow: 'hidden' }}>
          <img
            src={image}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
        {!imageOnly && (
          <div style={{ padding: '6px 8px 8px' }}>
            <div
              style={{
                color: '#111',
                fontFamily: '"Inter", sans-serif',
                fontWeight: 700,
                fontSize: '10px',
                lineHeight: 1.25,
              }}
            >
              {name}
            </div>
            {subtitle && (
              <div
                style={{
                  color: '#444',
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 400,
                  fontSize: '9.5px',
                  lineHeight: 1.2,
                }}
              >
                {subtitle}
              </div>
            )}
            {distance && (
              <div
                style={{
                  color: '#111',
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 700,
                  fontSize: '9.5px',
                  marginTop: '3px',
                }}
              >
                {distance}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
