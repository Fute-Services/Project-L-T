import POICard from './POICard'
import PinMarker from './PinMarker'

const coastalRoad = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/a6792b67-4b93-4046-1fee-c918066a4700/public";
const siddhivinayak = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/9b6ef112-9a95-4ae7-5e55-a2ae79933500/public";
const parelStation = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/d2f3aa23-6db5-47a2-0b29-cf3b2f27c800/public";
const prabhadevi = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/571306ab-ec2a-47e9-a2d8-504ffc25b500/public";
const easternExpress = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/54d43054-693c-4c0a-741d-e75f6c501200/public";
const bkc = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/2cdb2175-8953-443d-6876-7c4c7f84ca00/public";
const mumbaiAirport = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/0efad307-c97e-4c86-c3aa-6408c00be100/public";
const easternFreeway = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/757d249f-ec48-4a25-2af8-5c8111e95e00/public";

interface POI {
  key: string
  name: string
  subtitle?: string
  distance: string
  image: string
  /** Exact pin point on the map, as a percentage of the container */
  anchor: { top: number; left: number }
  /** Card offset from the anchor, so the card floats beside its pin rather than on top of it */
  cardOffset: { top: number; left: number }
  delay: number
}

// Positions visually matched against the reference connectivity-map composite
// (same coastline background photo), pin-by-pin.
//
// COORDINATE SPACE: percentages are relative to the PHOTO itself — LocationPage
// mounts this overlay inside a fixed-aspect box reproducing the photo's
// cover-crop, so anchors stay glued to landmarks at every viewport size.
const POIS: POI[] = [
  { key: 'coastal-road', name: 'Coastal Road', distance: '4 Km', image: coastalRoad, anchor: { top: 55, left: 15.2 }, cardOffset: { top: -24, left: -2.7 }, delay: 0.05 },
  { key: 'siddhivinayak', name: 'Siddhivinayak', subtitle: 'Metro Station', distance: '1 Km', image: siddhivinayak, anchor: { top: 46, left: 32.1 }, cardOffset: { top: -24, left: -1.8 }, delay: 0.1 },
  { key: 'parel-station', name: 'Parel Railway', subtitle: 'Station', distance: '500 M', image: parelStation, anchor: { top: 52, left: 48.2 }, cardOffset: { top: -24, left: -1.8 }, delay: 0.15 },
  { key: 'prabhadevi', name: 'Prabhadevi', subtitle: 'Railway Station', distance: '240 M', image: prabhadevi, anchor: { top: 74, left: 42.9 }, cardOffset: { top: -24, left: -3.6 }, delay: 0.2 },
  { key: 'eastern-express', name: 'Eastern Express', subtitle: 'Highway', distance: '0.8 KM', image: easternExpress, anchor: { top: 68, left: 50 }, cardOffset: { top: -24, left: 1.8 }, delay: 0.25 },
  { key: 'bkc', name: 'Bandra Kurla', subtitle: 'Complex (BKC)', distance: '8 Km', image: bkc, anchor: { top: 36, left: 76.8 }, cardOffset: { top: -24, left: -10.7 }, delay: 0.3 },
  { key: 'mumbai-airport', name: 'Mumbai Airport', subtitle: '(CSMIA)', distance: '10 Km', image: mumbaiAirport, anchor: { top: 22, left: 80.4 }, cardOffset: { top: 6, left: 1.8 }, delay: 0.35 },
  { key: 'eastern-freeway', name: 'Eastern Freeway', subtitle: '(EEH)', distance: '4 Km', image: easternFreeway, anchor: { top: 84, left: 73.2 }, cardOffset: { top: -24, left: 1.8 }, delay: 0.4 },
]

const MAIN_ROUTE = ['coastal-road', 'siddhivinayak', 'parel-station', 'eastern-express', 'eastern-freeway']
const BRANCH_ROUTE = ['parel-station', 'bkc', 'mumbai-airport']
const SPUR_ROUTE = ['eastern-express', 'prabhadevi']

function pointsFor(keys: string[]) {
  return keys
    .map((k) => POIS.find((p) => p.key === k))
    .filter((p): p is POI => !!p)
    .map((p) => `${p.anchor.left},${p.anchor.top}`)
    .join(' ')
}

function RouteLine({ keys }: { keys: string[] }) {
  return (
    <>
      <polyline points={pointsFor(keys)} fill="none" stroke="#ffffff" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.55} />
      <polyline points={pointsFor(keys)} fill="none" stroke="#FFD400" strokeWidth={0.35} strokeLinecap="round" strokeLinejoin="round" />
    </>
  )
}

export default function MobilityOverlay() {
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <RouteLine keys={MAIN_ROUTE} />
        <RouteLine keys={BRANCH_ROUTE} />
        <RouteLine keys={SPUR_ROUTE} />
      </svg>

      {POIS.map((poi) => (
        <div key={poi.key}>
          <PinMarker top={`${poi.anchor.top}%`} left={`${poi.anchor.left}%`} />

          <POICard
            name={poi.name}
            subtitle={poi.subtitle}
            distance={poi.distance}
            image={poi.image}
            top={`${poi.anchor.top + poi.cardOffset.top}%`}
            left={`${poi.anchor.left + poi.cardOffset.left}%`}
            delay={poi.delay}
          />
        </div>
      ))}
    </div>
  )
}
