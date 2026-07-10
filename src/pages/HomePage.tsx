import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

// Assets imports
import lntLogo from "../assets/logos/lnt-logo.png"
import scene2Bg from "../assets/images/shared/scene-city-skyline.png"
import transparentLogo from "../assets/images/home/scene-outline-logo.png"
import logo2 from "../assets/logos/logo-outline-white.svg"
import exploreIcon from "../assets/icons/explore-icon.svg"
import ExploreView from "../components/home/ExploreView"
import { gradientHeadingStyle } from "../styles/gradientHeadingText"

interface HomePageProps {
    startScene?: 1 | 2 | 3;
}

const HomePage = ({ startScene = 1 }: HomePageProps) => {
    const navigate = useNavigate()
    // scene state determines whether we show Scene 1 (centered logo), Scene 2 (framed workspace), or Scene 3 (sunset explore view)
    const [scene, setScene] = useState<1 | 2 | 3>(startScene)

    useEffect(() => {
        if (startScene !== 1) return;
        // Scene 1 lasts for 1.5 seconds, then transitions
        const timer = setTimeout(() => {
            setScene(2)
        }, 1500)

        return () => clearTimeout(timer)
    }, [startScene])

    const handleExploreClick = () => {
        console.log("Explore button clicked")
        setScene(3)
        navigate("/home")
    }

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#0a0d12]">
            {/* ========================================================= */}
            {/* ======================= SCENE 1 ========================= */}
            {/* ========================================================= */}
            <AnimatePresence>
                {scene === 1 && (
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-[#e4eef8] via-[#d4e3f4] to-[#b6cff2] overflow-hidden"
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.0, ease: "easeInOut" }}
                    >
                        {/* Top Right Light Blue Glow */}
                        <div
                            className="absolute top-0 right-0 w-[60vw] h-[60vh] max-w-[700px] max-h-[700px] pointer-events-none"
                            style={{
                                background: 'radial-gradient(circle at 100% 0%, rgba(165, 203, 255, 0.6) 0%, rgba(165, 203, 255, 0) 70%)'
                            }}
                        />

                        {/* Bottom Left Light Blue Glow */}
                        <div
                            className="absolute bottom-0 left-0 w-[60vw] h-[60vh] max-w-[700px] max-h-[700px] pointer-events-none"
                            style={{
                                background: 'radial-gradient(circle at 0% 100%, rgba(165, 203, 255, 0.6) 0%, rgba(165, 203, 255, 0) 70%)'
                            }}
                        />

                        <motion.img
                            src={lntLogo}
                            alt="L&T Realty Logo"
                            className="h-20 md:h-28 object-contain z-10"
                            exit={{ y: "-100vh" }}
                            transition={{ duration: 1.2, ease: [0.25, 1, 0.3, 1] }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ========================================================= */}
            {/* ======================= SCENE 2 ========================= */}
            {/* ========================================================= */}
            {scene < 3 && (
                <div className="w-full h-full overflow-hidden relative">
                    {/* Background image zoom-out and slide-to-center animation */}
                    <motion.img
                        src={scene2Bg}
                        alt="City Skyline"
                        className="absolute inset-0 w-full h-full object-cover"
                        initial={{ scale: 1.5, x: "20%" }}
                        animate={{
                            scale: scene >= 2 ? 1.0 : 1.5,
                            x: scene >= 2 ? "0%" : "20%"
                        }}
                        transition={{ duration: 3.5, ease: [0.25, 1, 0.28, 1], delay: 0.2 }}
                    />

                    {/* Top Left White Logo */}
                    <motion.div
                        className="absolute z-20 top-8 left-10 flex items-center gap-4 select-none pointer-events-none"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: scene === 2 ? 1 : 0, x: scene === 2 ? 0 : -30 }}
                        transition={{ duration: 2.2, delay: 1.6, ease: [0.25, 1, 0.5, 1] }}
                    >
                        <img src={logo2} alt="Logo" className="w-12 h-12 object-contain" />
                        <div className="flex items-center text-white">
                            <h1 className="font-mahameru text-sm font-semibold tracking-wide italic leading-none">L&T Realty</h1>
                            <div className="w-[1px] h-8 bg-white/30 mx-4" />
                            <div className="flex flex-col justify-center">
                                <h2 className="font-mahameru text-[11px] font-bold uppercase tracking-widest italic leading-none">INNOVATION CAMPUS</h2>
                                <p className="font-mahameru text-[8px] font-semibold uppercase tracking-widest text-white/60 mt-[4px] leading-none">LOWER PAREL, MUMBAI</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Top Right Transparent Outline Logo */}
                    <motion.div
                        className="absolute z-10 top-0 right-0 w-[25%] md:w-[15%] select-none pointer-events-none"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: scene === 2 ? 0.25 : 0, x: scene === 2 ? 0 : 50 }}
                        transition={{ duration: 2.5, delay: 1.4, ease: [0.25, 1, 0.5, 1] }}
                    >
                        <img src={transparentLogo} alt="L&T Outline Logo" className="w-full h-auto object-contain" />
                    </motion.div>

                    {/* Left Side "INNOVATION CAMPUS" Text */}
                    <motion.div
                        className="absolute z-20 left-20 top-[28%] -translate-y-1/2 flex flex-col gap-2 select-none pointer-events-none"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: scene === 2 ? 1 : 0, x: scene === 2 ? 0 : -100 }}
                        transition={{ duration: 2.8, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                        style={{ fontFamily: '"Hind Kochi", sans-serif', fontWeight: 300 }}
                    >
                        <h2
                            className="text-5xl lg:text-[70px] text-transparent bg-clip-text"
                            style={gradientHeadingStyle('0.10em')}
                        >
                            INNOVATION
                        </h2>
                        <h2
                            className="text-5xl lg:text-[70px] text-transparent bg-clip-text mt-2"
                            style={gradientHeadingStyle('0.10em')}
                        >
                            CAMPUS
                        </h2>
                    </motion.div>

                    {/* Right Side Transparent Outline Curve */}
                    <motion.div
                        className="absolute z-10 right-0 top-0 h-full w-[50%] md:w-[35%] select-none pointer-events-none flex items-center justify-end"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: scene === 2 ? 0.35 : 0, x: scene === 2 ? 0 : 100 }}
                        transition={{ duration: 2.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <img src={transparentLogo} alt="L&T Transparent Curve" className="h-full object-contain opacity-0 pointer-events-none" />
                    </motion.div>

                    {/* Bottom Right Explore Button & Spark Visualizer */}
                    <motion.div
                        className="absolute z-20 bottom-10 right-10 flex items-center"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: scene === 2 ? 1 : 0, y: scene === 2 ? 0 : 50 }}
                        transition={{ duration: 2.5, delay: 2.0, ease: [0.25, 1, 0.5, 1] }}
                    >
                        {/* Interactive Explore Button */}
                        <motion.div
                            className="p-1 bg-[#1a222b]/95 backdrop-blur-md rounded-full border border-white/10 shadow-xl flex items-center gap-[6px] select-none cursor-pointer relative"
                            whileHover="hover"
                            onClick={handleExploreClick}
                        >
                            {/* Logo circle on the left (foreground, z-20) */}
                            <motion.div
                                className="w-12 h-12 rounded-full bg-[#12161a] border border-white/20 flex items-center justify-center z-20 shadow-md"
                                variants={{
                                    hover: { scale: 1.05, borderColor: "rgba(255,255,255,0.3)" }
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <img src={logo2} alt="L&T Logo" className="w-7 h-7 object-contain" />
                            </motion.div>

                            {/* Yellow cream pill nested inside (z-10) */}
                            <motion.div
                                className="px-6 py-3 rounded-full bg-[#FFF6D4] text-black font-semibold text-sm flex items-center gap-2 pr-8 pl-10 -ml-8 z-10 shadow-inner"
                                variants={{
                                    hover: { backgroundColor: "#FFEFA8", paddingRight: "36px" }
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.img
                                    src={exploreIcon}
                                    alt="Explore"
                                    className="w-4 h-4 object-contain"
                                    variants={{
                                        hover: { rotate: 15, scale: 1.2 }
                                    }}
                                    transition={{ duration: 0.3 }}
                                />
                                <span className="font-sans text-sm font-bold text-[#272000] tracking-wider leading-none">
                                    explore
                                </span>
                            </motion.div>
                        </motion.div>

                        {/* Spark visualizer bars to the right */}
                        <div className="flex items-end gap-[4px] h-6 ml-6 opacity-70">
                            <span className="w-[3px] h-[10px] bg-white rounded-full animate-pulse" />
                            <span className="w-[3px] h-[22px] bg-white rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                            <span className="w-[3px] h-[15px] bg-white rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Explore View Overlay */}
            <AnimatePresence>
                {scene === 3 && (
                    <ExploreView explored={true} />
                )}
            </AnimatePresence>
        </div>
    )
}

export default HomePage
