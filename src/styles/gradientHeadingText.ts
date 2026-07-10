import type { CSSProperties } from "react"

// Shared style for the large gold-gradient hero headings used on the
// Home and ExploreView scenes (e.g. "INNOVATION / CAMPUS", "SOAR THE / SKYLINE").
export const gradientHeadingStyle = (letterSpacing: string): CSSProperties => ({
  backgroundImage: "linear-gradient(100deg, #FFF 19.87%, #FFEFA8 109.17%)",
  fontFamily: '"Hind Kochi", sans-serif',
  fontWeight: 300,
  letterSpacing,
  lineHeight: "0.8",
  display: "inline-block",
  transform: "scaleX(0.7)",
  transformOrigin: "left",
})
