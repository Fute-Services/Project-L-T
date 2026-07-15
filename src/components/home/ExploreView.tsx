import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
const homeBgDay = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/0f3a05a6-ecfd-4b4a-3f4b-8b4c5adf7800/public";
const homeBgNight = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/04e18dee-1e31-4b0e-bf58-9073b8630e00/public";
const homeLeftTransparent = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/20799cb8-8664-4229-4c2f-c04185864500/public";
import logo2 from "../../assets/logos/logo-outline-white.svg"
import logoBlack from "../../assets/logos/logo-black.png"
import LeftNavbar from "../navigation/LeftNavbar"
import RightNavbar from "../navigation/RightNavbar"
import { gradientHeadingStyle } from "../../styles/gradientHeadingText"

interface ExploreViewProps {
    explored: boolean;
}

const ExploreView = ({ explored }: ExploreViewProps) => {
    const navigate = useNavigate()
    const [showNavbars, setShowNavbars] = useState(false)
    const [isNight, setIsNight] = useState(true) // Night is default

    useEffect(() => {
        if (explored) {
            // Delay showing the navbars until after the headline's fade-in/hold/fade-out sequence completes (5.8s, includes an extra 3s so the headline has time to be read)
            const timer = setTimeout(() => {
                setShowNavbars(true)
            }, 5800)
            return () => clearTimeout(timer)
        } else {
            setShowNavbars(false)
        }
    }, [explored])

    return (
        <motion.div
            className="absolute inset-0 w-full h-full overflow-hidden z-30 bg-[#0a0d12]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
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
                    scale: { duration: 1.8, delay: 0.1, ease: [0.25, 1, 0.28, 1] },
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
                    scale: { duration: 1.8, delay: 0.1, ease: [0.25, 1, 0.28, 1] },
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

            {/* Left Side "LOCATION / LUXURY / LEGACY" Text — each word fades in one after another,
                all three hold together, then slide out in sync as the navbars arrive */}
            <div
                className="absolute z-20 left-32 top-[45%] -translate-y-1/2 flex flex-col gap-8 select-none pointer-events-none"
                style={{ fontFamily: '"Hind Kochi", sans-serif', fontWeight: 700 }}
            >
                <motion.h2
                    className="text-3xl lg:text-5xl text-transparent bg-clip-text"
                    initial={{ opacity: 0, x: "40px" }}
                    animate={{ opacity: [0, 1, 1, 0], x: ["40px", "0px", "0px", "-200px"] }}
                    transition={{ duration: 5.8, times: [0, 0.121, 0.828, 1], ease: [0.45, 0, 0.15, 1] }}
                    style={{ ...gradientHeadingStyle('0.12em'), fontFamily: '"Hind Kochi", sans-serif', fontWeight: 700 }}
                >
                    LOCATION
                </motion.h2>
                <motion.h2
                    className="text-3xl lg:text-5xl text-transparent bg-clip-text"
                    initial={{ opacity: 0, x: "40px" }}
                    animate={{ opacity: [0, 1, 1, 0], x: ["40px", "0px", "0px", "-200px"] }}
                    transition={{ duration: 5.4, delay: 0.4, times: [0, 0.13, 0.815, 1], ease: [0.45, 0, 0.15, 1] }}
                    style={{ ...gradientHeadingStyle('0.1em'), fontFamily: '"Hind Kochi", sans-serif', fontWeight: 700 }}
                >
                    LUXURY
                </motion.h2>
                <motion.h2
                    className="text-3xl lg:text-5xl text-transparent bg-clip-text"
                    initial={{ opacity: 0, x: "40px" }}
                    animate={{ opacity: [0, 1, 1, 0], x: ["40px", "0px", "0px", "-200px"] }}
                    transition={{ duration: 5.0, delay: 0.8, times: [0, 0.14, 0.8, 1], ease: [0.45, 0, 0.15, 1] }}
                    style={{ ...gradientHeadingStyle('0.1em'), fontFamily: '"Hind Kochi", sans-serif', fontWeight: 700 }}
                >
                    LEGACY
                </motion.h2>
            </div>

            {/* Right Side Transparent Outline Curve — mirrors the headline's fade-in/hold/fade-out */}
            <motion.div
                className="absolute z-10 right-0 top-0 h-full w-[50%] md:w-[40%] select-none pointer-events-none flex items-center justify-end"
                initial={{ opacity: 0, x: "40px" }}
                animate={{ opacity: [0, 0.35, 0.35, 0], x: ["40px", "0px", "0px", "200px"] }}
                transition={{ duration: 5.8, times: [0, 0.07, 0.88, 1], ease: [0.25, 1, 0.28, 1] }}
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

                        {/* Bottom Left Logo Link to Scene 1 */}
                        <div className="fixed left-5 lg:left-16 bottom-16 z-50 w-[38px] lg:w-[60px] flex justify-center">
                            <motion.button
                                onClick={() => navigate("/")}
                                className="w-9 h-9 lg:w-12 lg:h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 shadow-2xl backdrop-blur-md cursor-pointer transition-colors duration-300"
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 25 }}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.94 }}
                                transition={{
                                    y: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                                    opacity: { duration: 0.35, ease: "easeOut" },
                                    scale: { duration: 0.2, ease: "easeOut" }
                                }}
                                title="Back to Intro"
                            >
                                <img
                                    src={logo2}
                                    alt="Back to Intro"
                                    className="w-5 h-5 lg:w-7 lg:h-7 object-contain opacity-75 hover:opacity-100 transition-opacity"
                                />
                            </motion.button>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default ExploreView