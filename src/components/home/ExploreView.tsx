import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import homeBgDay from "../../assets/images/home/home-background-day.png"
import homeBgNight from "../../assets/images/home/home-background-night.png"
import homeLeftTransparent from "../../assets/images/home/home-left-overlay.png"
import logo2 from "../../assets/logos/logo-outline-white.svg"
import logoBlack from "../../assets/logos/logo-black.png"
import LeftNavbar from "../navigation/LeftNavbar"
import RightNavbar from "../navigation/RightNavbar"
import { gradientHeadingStyle } from "../../styles/gradientHeadingText"

interface ExploreViewProps {
    explored: boolean;
}

const ExploreView = ({ explored }: ExploreViewProps) => {
    const [showNavbars, setShowNavbars] = useState(false)
    const [isNight, setIsNight] = useState(true) // Night is default

    useEffect(() => {
        if (explored) {
            // Delay showing the navbars until after the slide-out animations complete (1.0s start delay + 1.8s fade duration = 2.8s)
            const timer = setTimeout(() => {
                setShowNavbars(true)
            }, 2800)
            return () => clearTimeout(timer)
        } else {
            setShowNavbars(false)
        }
    }, [explored])

    return (
        <motion.div
            className="absolute inset-0 w-full h-full overflow-hidden z-30 bg-[#0a0d12]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Day Background Image with scale animation */}
            <motion.img
                src={homeBgDay}
                alt="Day Skyline"
                className="absolute inset-0 w-full h-full object-fill z-0"
                initial={{ scale: 1.15, opacity: isNight ? 0 : 1 }}
                animate={{
                    scale: explored ? 1.0 : 1.15,
                    opacity: isNight ? 0 : 1
                }}
                transition={{
                    scale: { duration: 2.5, delay: 1.0, ease: [0.25, 1, 0.28, 1] },
                    opacity: { duration: 0.8, ease: "easeInOut" }
                }}
            />

            {/* Night Background Image with scale animation */}
            <motion.img
                src={homeBgNight}
                alt="Night Skyline"
                className="absolute inset-0 w-full h-full object-fill z-0"
                initial={{ scale: 1.15, opacity: isNight ? 1 : 0 }}
                animate={{
                    scale: explored ? 1.0 : 1.15,
                    opacity: isNight ? 1 : 0
                }}
                transition={{
                    scale: { duration: 2.5, delay: 1.0, ease: [0.25, 1, 0.28, 1] },
                    opacity: { duration: 0.8, ease: "easeInOut" }
                }}
            />

            {/* Top Left Logo (Swaps dynamically between Day/Night themes) */}
            <div className="absolute z-20 top-8 left-10 flex items-center gap-4 select-none pointer-events-none">
                <div className="relative w-12 h-12">
                    {/* White Logo (Night) */}
                    <img
                        src={logo2}
                        alt="Logo Night"
                        className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
                        style={{ opacity: isNight ? 1 : 0 }}
                    />
                    {/* Black Logo (Day) */}
                    <img
                        src={logoBlack}
                        alt="Logo Day"
                        className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
                        style={{ opacity: isNight ? 0 : 1 }}
                    />
                </div>
                <div className={`flex items-center transition-colors duration-300 ${isNight ? 'text-white' : 'text-black'}`}>
                    <h1 className="font-mahameru text-sm font-semibold tracking-wide italic leading-none">L&T Realty</h1>
                    {/* <div className="w-[1px] h-8 bg-white/30 mx-4" />
                    <div className="flex flex-col justify-center">
                        <h2 className="font-mahameru text-[11px] font-bold uppercase tracking-widest italic leading-none">INNOVATION CAMPUS</h2>
                        <p className="font-mahameru text-[8px] font-semibold uppercase tracking-widest text-white/60 mt-[4px] leading-none">LOWER PAREL, MUMBAI</p>
                    </div> */}
                </div>
            </div>

            {/* Left Side "SOAR THE SKYLINE" Text */}
            <motion.div
                className="absolute z-20 left-20 top-[40%] -translate-y-1/2 flex flex-col gap-2 select-none pointer-events-none"
                initial={{ opacity: 1, x: 0 }}
                animate={{ opacity: 0, x: "-200px" }}
                transition={{
                    opacity: { duration: 1.8, delay: 1.0, ease: "easeInOut" },
                    x: { duration: 2.0, delay: 1.0, ease: [0.25, 1, 0.28, 1] }
                }}
                style={{ fontFamily: '"Hind Kochi", sans-serif', fontWeight: 300 }}
            >
                <h2
                    className="text-5xl lg:text-[70px] text-transparent bg-clip-text"
                    style={gradientHeadingStyle('0.15em')}
                >
                    SOAR THE
                </h2>
                <h2
                    className="text-5xl lg:text-[70px] text-transparent bg-clip-text mt-2"
                    style={gradientHeadingStyle('0.13em')}
                >
                    SKYLINE
                </h2>
            </motion.div>

            {/* Right Side Transparent Outline Curve */}
            <motion.div
                className="absolute z-10 right-0 top-0 h-full w-[50%] md:w-[40%] select-none pointer-events-none flex items-center justify-end"
                initial={{ opacity: 0.35, x: 0 }}
                animate={{ opacity: 0, x: "200px" }}
                transition={{
                    opacity: { duration: 1.8, delay: 1.0, ease: "easeInOut" },
                    x: { duration: 2.0, delay: 1.0, ease: [0.25, 1, 0.28, 1] }
                }}
            >
                <img src={homeLeftTransparent} alt="L&T Transparent Curve" className="h-full object-contain" />
            </motion.div>

            {/* Bottom Right Spark Visualizer (Fades out when navbars appear) */}
            <AnimatePresence>
                {!showNavbars && (
                    <motion.div
                        className="absolute z-20 bottom-12 right-12 flex items-end gap-[4px] h-6 opacity-70 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="w-[3px] h-[10px] bg-white rounded-full animate-pulse" />
                        <span className="w-[3px] h-[22px] bg-white rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                        <span className="w-[3px] h-[15px] bg-white rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navbars - Rendered after the 2.8s sliding animations complete */}
            <AnimatePresence>
                {showNavbars && (
                    <>
                        {/* Left Navbar Container */}
                        <div className="fixed left-5 lg:left-16 top-[55%] lg:top-1/2 -translate-y-1/2 z-50">
                            <LeftNavbar />
                        </div>

                        {/* Right Navbar Container */}
                        <div className="fixed right-5 lg:right-10 top-[55%] lg:top-1/2 -translate-y-1/2 z-50">
                            <RightNavbar isNight={isNight} setIsNight={setIsNight} />
                        </div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default ExploreView