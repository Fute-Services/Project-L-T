import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import galleryIcon from '../../assets/icons/gallery-icon.svg'
import circulationIcon from '../../assets/icons/circulation-icon.svg'
import certificateIcon from '../../assets/icons/certificate-icon.png'
import dayIcon from '../../assets/icons/day-icon.png'
import nightIcon from '../../assets/icons/night-icon.png'

const navItems = [
  { path: '/circulation', label: 'Circulation', icon: circulationIcon },
  { path: '/certification', label: 'Certification', icon: certificateIcon },
  { path: '/gallery', label: 'Project Overview', icon: galleryIcon },
]

interface RightNavbarProps {
  isNight: boolean;
  setIsNight: (isNight: boolean) => void;
}

const NavbarLink = ({ to, label, icon }: { to: string; label: string; icon: any }) => {
  const [isHovered, setIsHovered] = useState(false)
  const activeCircle = 'w-[30px] lg:w-[48px] h-[30px] lg:h-[48px] rounded-full flex items-center justify-center bg-[#B9D2FF] transition-all duration-300'
  const darkCircle = 'w-[30px] lg:w-[48px] h-[30px] lg:h-[48px] rounded-full flex items-center justify-center bg-[#1e2018]/80 hover:bg-[#B9D2FF]/30 transition-all duration-300'

  return (
    <NavLink 
      to={to} 
      className="flex flex-col items-center py-[2px] lg:py-[5px] w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {({ isActive }) => {
        return (
          <>
            <div className={isActive ? activeCircle : darkCircle}>
              <img 
                src={icon} 
                alt={label} 
                className={`w-[14px] h-[14px] lg:w-[22px] lg:h-[22px] transition-all duration-300 ${
                  isActive 
                    ? 'filter-active-black' 
                    : isHovered 
                      ? 'filter-active-blue' 
                      : 'filter-inactive-white'
                }`} 
              />
            </div>
            <span 
              className="text-[6.5px] lg:text-[9px] mt-[3px] text-center whitespace-pre-line leading-[1.3] select-none text-white"
            >
              {label}
            </span>
          </>
        )
      }}
    </NavLink>
  )
}

const RightNavbar = ({ isNight, setIsNight }: RightNavbarProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  return (
    <>
      <div className="fixed right-5 lg:right-8 top-[55%] lg:top-1/2 font-sans -translate-y-1/2 z-50 flex flex-col items-center w-[38px] lg:w-[60px]">
        <motion.div
          initial={{ x: 220, opacity: 0, rotate: 12, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.5 }}
          style={{ transformOrigin: 'top center' }}
          className="flex flex-col items-center w-full"
        >
          <nav
            className="font-sans z-50 flex flex-col items-center rounded-[80px] w-full py-2 px-1 gap-2"
            style={{
              background: 'rgba(20, 22, 18, 0.45)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.12), 0 0 20px rgba(255, 255, 255, 0.06)',
            }}
          >
            {/* ── Nav Links ── */}
            {navItems.map((item) => (
              <NavbarLink key={item.path} to={item.path} label={item.label} icon={item.icon} />
            ))}

            {/* Day / Night Toggle Container (Only visible on Home pages) */}
            {isHomePage && (
              <div className="flex flex-col items-center gap-[6px] bg-black/40 border border-white/10 rounded-full p-[3px] mt-2">
                <button
                  onClick={() => setIsNight(false)}
                  className={`w-6 lg:w-9 h-6 lg:h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${!isNight ? 'bg-[#004C87]' : 'bg-[#043C6745] hover:bg-[#043C6770]'}`}
                >
                  <img
                    src={dayIcon}
                    alt="Day"
                    style={{ filter: 'brightness(0) invert(1)' }}
                    className="w-[12px] lg:w-[18px] h-[12px] lg:h-[18px]"
                  />
                </button>
                <button
                  onClick={() => setIsNight(true)}
                  className={`w-6 lg:w-9 h-6 lg:h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${isNight ? 'bg-[#004C87]' : 'bg-[#043C6745] hover:bg-[#043C6770]'}`}
                >
                  <img
                    src={nightIcon}
                    alt="Night"
                    style={{ filter: 'brightness(0) invert(1)' }}
                    className="w-[12px] lg:w-[18px] h-[12px] lg:h-[18px]"
                  />
                </button>
              </div>
            )}
          </nav>
        </motion.div>
      </div>
    </>
  );
}

export default RightNavbar