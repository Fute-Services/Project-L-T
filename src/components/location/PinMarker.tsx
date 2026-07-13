// Teardrop map pin — dark teal fill, white ring, white center dot — matching
// the reference connectivity map's marker style.
export default function PinMarker({ top, left }: { top: string; left: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        transform: 'translate(-50%, -100%)',
        zIndex: 9,
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))',
      }}
    >
      <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
        <path
          d="M11 0C4.9 0 0 4.9 0 11c0 8.25 11 17 11 17s11-8.75 11-17c0-6.1-4.9-11-11-11z"
          fill="#123449"
          stroke="#ffffff"
          strokeWidth="1.5"
        />
        <circle cx="11" cy="11" r="4" fill="#ffffff" />
      </svg>
    </div>
  )
}
