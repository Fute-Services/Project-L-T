import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

import homeIcon from '../../assets/icons/home-icon.svg';
import amenitiesIcon from '../../assets/icons/amenities-icon.svg';
import detailsIcon from '../../assets/icons/project-details-icon.png';
// import vrIcon from '../../assets/icons/vr-icon.svg';
import brochureIcon from '../../assets/icons/brochure-icon.png';

const navItems = [
  { path: '/home', label: 'Home', icon: homeIcon, isCustom: true, end: true },
  { path: '/location', label: 'Location', icon: MapPin, isCustom: false, end: false },
  { path: '/project-info', label: 'Project\nInfo', icon: amenitiesIcon, isCustom: true, end: false, iconSizeClass: 'w-6 h-6' },
  { path: '/project-details', label: 'Project\nDetails', icon: detailsIcon, isCustom: true, end: false, iconSizeClass: 'w-5 h-5' },
  // { path: '/vr', label: 'VR', icon: vrIcon, isCustom: true, end: false, iconSizeClass: 'w-5 h-5' },
  { path: '/brochure', label: 'Brochure', icon: brochureIcon, isCustom: true, end: false },
];

interface NavbarLinkProps {
  to: string;
  label: string;
  icon: any;
  isCustom: boolean;
  end?: boolean;
  heightClass?: string;
  iconWrapperClass?: string;
  inactiveBgClass?: string;
  disableFilter?: boolean;
  hasGradientText?: boolean;
  iconSizeClass?: string;
}

const NavbarLink = ({
  to,
  label,
  icon: IconComponent,
  isCustom,
  end = false,
  heightClass = ' h-[70px] lg:h-[76px]',
  iconWrapperClass = ' w-[40px] h-[40px] lg:w-[43px] lg:h-[50px]',
  inactiveBgClass = 'bg-white/5 border-white/5',
  disableFilter = false,
  hasGradientText = false,
  iconSizeClass = 'w-4.5 h-4.5'
}: NavbarLinkProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <NavLink
      to={to}
      end={end}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={label.replace('\n', ' ')}
      className={({ isActive }) => {
        const isThemeActive = isActive || isHovered;
        return `flex flex-col ${heightClass} items-center 
        justify-center gap-1 transition-all duration-300 w-full rounded-full p-1 
    ${isThemeActive
            ? ' shadow-lg shadow-[#B9D2FF]/10'
            : `${inactiveBgClass} border-white/10 border`}`;
      }}
      style={({ isActive }) => {
        const isThemeActive = isActive || isHovered;
        if (isThemeActive) {
          return {
            /* Bottom (0%): Deep Blue | Middle (50%): Faded Translucent Blue | Top (100%): Completely Transparent */
            background: 'linear-gradient(0deg, rgba(185, 210, 255, 0.35) 0%, rgba(185, 210, 255, 0.1) 40%, rgba(185, 210, 255, 0) 100%)',
          };
        }
        return undefined;
      }}
    >
      {({ isActive }) => {
        const isThemeActive = isActive || isHovered;
        return (
          <>
            {/* Icon Circle Wrapper */}
            <div
              className={`flex items-center justify-center ${iconWrapperClass}
               rounded-full border transition-all duration-300
              ${isActive
                  ? 'border-[#B9D2FF]'
                  : isHovered
                    ? 'bg-black/20  border-white/25 '
                    : 'bg-black/15 border-white/25'}`}
            >
              {isCustom ? (
                <img
                  src={IconComponent as string}
                  alt={label.replace('\n', ' ')}
                  className={`${iconSizeClass} transition-all duration-300 ${isThemeActive
                      ? 'filter-active-blue'
                      : disableFilter
                        ? ''
                        : 'filter-inactive-white'
                    }`}
                />
              ) : (
                <IconComponent
                  size={17}
                  className={`transition-all duration-300 ${isThemeActive ? 'text-[#B9D2FF]' : 'text-white'}`}
                />
              )}
            </div>

            {/* Label Text */}
            <span
              style={
                hasGradientText
                  ? {
                    background: 'linear-gradient(90deg, #FFF 0%, #A8DFFF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }
                  : undefined
              }
              className={`text-[5.5px] lg:text-[7.2px] font-medium text-center leading-tight whitespace-pre-line select-none transition-colors duration-300 ${hasGradientText ? '' : 'text-white'}`}
            >
              {label}
            </span>
          </>
        );
      }}
    </NavLink>
  );
};

const LeftNavbar = () => {
  const mainNavItems = navItems.slice(0, 4);
  const brochureItem = navItems[4];

  return (
    <motion.div
      initial={{ x: -220, opacity: 0, rotate: -12, scale: 0.9 }}
      animate={{ x: 0, opacity: 1, rotate: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.6 }}
      style={{ transformOrigin: 'top center' }}
      className="flex flex-col items-center w-[38px] lg:w-[60px] gap-2"
    >
      <nav
        className="font-sans py-2 px-1 rounded-[80px] w-full flex flex-col gap-2 items-center mb-2"
        style={{
          background: 'rgba(20, 22, 18, 0.45)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.12), 0 0 20px rgba(255, 255, 255, 0.06)',
        }}
      >
        {mainNavItems.map((item) => (
          <NavbarLink
            key={item.path}
            to={item.path}
            label={item.label}
            icon={item.icon}
            isCustom={item.isCustom}
            end={item.end}
            heightClass="h-[50px] lg:h-[80px]"
            iconWrapperClass="w-[24px] h-[24px] lg:w-[43px] lg:h-[44px]"
            iconSizeClass={item.iconSizeClass}
          />
        ))}
      </nav>

      {/* Brochure - Separate Pill */}
      <NavbarLink
        to={brochureItem.path}
        label={brochureItem.label}
        icon={brochureItem.icon}
        isCustom={brochureItem.isCustom}
        end={brochureItem.end}
        heightClass="h-[50px] lg:h-[80px]"
        iconWrapperClass="w-[24px] h-[28px] lg:w-[40px] lg:h-[48px]"
        inactiveBgClass="bg-[rgba(20,22,18,0.45)] border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.12),0_0_20px_rgba(255,255,255,0.06)] backdrop-blur-xl backdrop-saturate-150"
        disableFilter={false}
        hasGradientText={true}
        iconSizeClass="w-[11px] h-[15px] lg:w-[17px] lg:h-[23px]"
      />
    </motion.div>
  );
};

export default LeftNavbar;