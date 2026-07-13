import type { CSSProperties } from 'react'

// Shared "liquid glass" overlay language used across the Location page and its
// interactive map view — a dark frosted capsule with a gold (#FFEFA8) accent,
// matching the Explore button's rim-light glass treatment on the Home page.

export const glassContainerStyle: CSSProperties = {
  background: 'rgba(10, 10, 8, 0.55)',
  backdropFilter: 'blur(20px) saturate(160%)',
  WebkitBackdropFilter: 'blur(20px) saturate(160%)',
  border: '1.5px solid rgba(255, 239, 168, 0.25)',
  borderRadius: '999px',
  boxShadow:
    '0 0 0 1px rgba(0, 0, 0, 0.4), 0 0 24px rgba(255, 239, 168, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.12), 0 12px 32px rgba(0, 0, 0, 0.5)',
}

export function pillButtonStyle(isActive: boolean, isHovered: boolean, fontSize = '12.5px', height = '38px', paddingX = '20px'): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    height,
    padding: `0 ${paddingX}`,
    background: isActive
      ? 'rgba(255, 239, 168, 0.22)'
      : isHovered
        ? 'rgba(255, 239, 168, 0.08)'
        : 'transparent',
    color: isActive ? '#FFEFA8' : 'rgba(232, 224, 200, 0.65)',
    border: isActive ? '1px solid rgba(255, 239, 168, 0.6)' : '1px solid transparent',
    borderRadius: '999px',
    cursor: 'pointer',
    fontFamily: '"Inter", sans-serif',
    fontWeight: 600,
    fontSize,
    letterSpacing: '0.02em',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    textShadow: isActive ? '0 1px 3px rgba(0, 0, 0, 0.45)' : 'none',
    boxShadow: isActive
      ? 'inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 4px 16px rgba(255, 239, 168, 0.3)'
      : 'none',
    transition: 'background 0.25s ease, box-shadow 0.25s ease, color 0.25s ease, border-color 0.25s ease',
    outline: 'none',
  }
}

// Standalone glass action button (Back, Reset, Circulation toggle) — same
// frosted capsule as the container, with an optional gold "active" state.
export function standaloneGlassButtonStyle(isActive: boolean, isHovered: boolean): CSSProperties {
  return {
    ...glassContainerStyle,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '34px',
    padding: '0 16px',
    background: isActive
      ? 'rgba(255, 239, 168, 0.22)'
      : isHovered
        ? 'rgba(255, 239, 168, 0.1)'
        : 'rgba(10, 10, 8, 0.55)',
    border: isActive ? '1.5px solid rgba(255, 239, 168, 0.55)' : '1.5px solid rgba(255, 239, 168, 0.25)',
    color: isActive ? '#FFEFA8' : 'rgba(232, 224, 200, 0.85)',
    cursor: 'pointer',
    fontFamily: '"Inter", sans-serif',
    fontWeight: 600,
    fontSize: '11.5px',
    letterSpacing: '0.02em',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.45)',
    boxShadow: isActive
      ? 'inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 4px 16px rgba(255, 239, 168, 0.3)'
      : glassContainerStyle.boxShadow,
    transition: 'background 0.25s ease, box-shadow 0.25s ease, color 0.25s ease, border-color 0.25s ease',
    outline: 'none',
  }
}
