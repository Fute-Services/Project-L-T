import airportMumbai from '../../assets/images/location/poi/airport-mumbai.png'
import worliSeaLink from '../../assets/images/location/poi/worli-sea-link.png'
import hangingGarden from '../../assets/images/location/poi/hanging-garden.png'

interface POI {
  key: string
  name: string
  image: string
  /** Marker's own top-left position, as a percentage of the container (photo) */
  top: number
  left: number
  size: number
}

// Positions matched against the site-location-aerial.png reference photo,
// box-by-box — same COORDINATE SPACE convention as MobilityOverlay: percentages
// are relative to the photo itself, since LocationPage mounts this overlay
// inside a fixed-aspect box reproducing the photo's cover-crop.
const POIS: POI[] = [
  { key: 'airport-mumbai', name: 'Airport Mumbai', image: airportMumbai, top: 17.7, left: 52.4, size: 78 },
  { key: 'worli-sea-link', name: 'Worli Sea Link', image: worliSeaLink, top: 35.0, left: 37.1, size: 78 },
  { key: 'hanging-garden', name: 'Hanging Garden', image: hangingGarden, top: 56.0, left: 32.7, size: 100 },
]

// Minimal, bare-image POI marker — no card, no background, no label, no animation.
function POIMarker({ name, image, top, left, size }: Omit<POI, 'key'>) {
  return (
    <div className="absolute" style={{ top: `${top}%`, left: `${left}%`, zIndex: 10 }}>
      <img
        src={image}
        alt={name}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: 'cover',
          borderRadius: '14px',
          display: 'block',
        }}
      />
    </div>
  )
}

export default function SiteLocationOverlay() {
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      {POIS.map((poi) => (
        <POIMarker key={poi.key} name={poi.name} image={poi.image} top={poi.top} left={poi.left} size={poi.size} />
      ))}
    </div>
  )
}
