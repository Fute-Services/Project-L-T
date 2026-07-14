import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

// Assets imports
import lntLogo from "../assets/logos/lnt-logo.png"
import scene2Bg from "../assets/images/shared/scene-city-skyline.webp"
import transparentLogo from "../assets/images/home/scene-outline-logo.png"
import logo2 from "../assets/logos/logo-outline-white.svg"
import homeBgDay from "../assets/images/home/home-background-day.webp"
import homeBgNight from "../assets/images/home/home-background-night.webp"
import ExploreView from "../components/home/ExploreView"
import RainOverlay from "../components/home/RainOverlay"
import LightningOverlay from "../components/home/LightningOverlay"
import { gradientHeadingStyle } from "../styles/gradientHeadingText"
import { useStormAudio } from "../hooks/useStormAudio"

interface HomePageProps {
    startScene?: 1 | 2 | 3;
}

const HomePage = ({ startScene = 1 }: HomePageProps) => {
    const navigate = useNavigate()
    // scene state determines whether we show Scene 1 (centered logo), Scene 2 (framed workspace), or Scene 3 (sunset explore view)
    const [scene, setScene] = useState<1 | 2 | 3>(startScene)
    const [isExploring, setIsExploring] = useState(false)
    const { playThunder } = useStormAudio()

    useEffect(() => {
        if (startScene !== 1) return;
        // Scene 1 plays a theater-curtain intro (curtain holds, splits open, then the
        // logo fades in) before transitioning to Scene 2 — see timing notes below.
        const timer = setTimeout(() => {
            setScene(2)
        }, 3500)

        return () => clearTimeout(timer)
    }, [startScene])

    useEffect(() => {
        setScene(startScene)
        setIsExploring(false)
    }, [startScene])

    useEffect(() => {
        // Warm the browser cache for the Explore view's backgrounds as soon as Scene 2
        // is on screen, so they're already loaded by the time the user clicks Explore.
        const preloadDay = new Image()
        preloadDay.src = homeBgDay
        const preloadNight = new Image()
        preloadNight.src = homeBgNight
    }, [])

    const handleExploreClick = () => {
        if (isExploring) return
        // Launch the logo-circle ease-off animation first, then swap to the next scene
        // once it has settled (see the explore button's circle below).
        setIsExploring(true)
        setTimeout(() => {
            setScene(3)
            navigate("/home")
        }, 1200)
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
                        exit={{ opacity: 0, transition: { duration: 1.0, ease: "easeInOut" } }}
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

                        {/* Logo: fades in after the curtain has fully parted, then zooms forward
                            toward the viewer and fades out on exit */}
                        <motion.img
                            src={lntLogo}
                            alt="L&T Realty Logo"
                            className="h-20 md:h-28 object-contain z-10"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1, transition: { duration: 1.0, delay: 1.5, ease: [0.25, 1, 0.3, 1] } }}
                            exit={{ opacity: 0, scale: 4, transition: { duration: 1.0, ease: [0.4, 0, 1, 1] } }}
                        />

                        {/* Theater curtain: black panels holding over the scene, top half slides up,
                            bottom half slides down, splitting from the middle to reveal the logo */}
                        <motion.div
                            className="absolute top-0 left-0 w-full h-1/2 z-20 pointer-events-none"
                            style={{
                                background: 'linear-gradient(to bottom, #1a1f27 0%, #0a0d12 100%)',
                                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)'
                            }}
                            initial={{ y: '0%' }}
                            animate={{ y: '-100%' }}
                            transition={{ duration: 1.0, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
                        />
                        <motion.div
                            className="absolute bottom-0 left-0 w-full h-1/2 z-20 pointer-events-none"
                            style={{
                                background: 'linear-gradient(to top, #1a1f27 0%, #0a0d12 100%)',
                                boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.7)'
                            }}
                            initial={{ y: '0%' }}
                            animate={{ y: '100%' }}
                            transition={{ duration: 1.0, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ========================================================= */}
            {/* ======================= SCENE 2 ========================= */}
            {/* ========================================================= */}
            <AnimatePresence>
            {scene < 3 && (
                <motion.div
                    className="w-full h-full overflow-hidden relative"
                    exit={{ opacity: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
                >
                    {/* Background image zoom-out and slide-to-center animation */}
                    <motion.img
                        src={scene2Bg}
                        alt="City Skyline"
                        className="absolute inset-0 w-full h-full object-cover object-top"
                        initial={{ scale: 1.5, x: "20%" }}
                        animate={{
                            scale: scene >= 2 ? 1.0 : 1.5,
                            x: scene >= 2 ? "0%" : "20%"
                        }}
                        transition={{ duration: 3.5, ease: [0.25, 1, 0.28, 1], delay: 0.2 }}
                    />

                    {/* Light drizzle overlay on top of the skyline background */}
                    <RainOverlay />

                    {/* Occasional lightning strikes in the storm clouds */}
                    <LightningOverlay onStrike={playThunder} />

                    {/* Top Left White Logo */}
                    <motion.div
                        className="absolute z-20 top-8 left-10 flex items-center gap-4 select-none pointer-events-none"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: scene === 2 ? 1 : 0, x: scene === 2 ? 0 : -30 }}
                        transition={{ duration: 2.2, delay: 0.6, ease: [0.25, 1, 0.5, 1] }}
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
                        transition={{ duration: 2.5, delay: 0.85, ease: [0.25, 1, 0.5, 1] }}
                    >
                        <img src={transparentLogo} alt="L&T Outline Logo" className="w-full h-auto object-contain" />
                    </motion.div>

                    {/* Left Side "INNOVATION CAMPUS" Text */}
                    <motion.div
                        className="absolute z-20 left-20 top-[28%] -translate-y-1/2 flex flex-col gap-2 select-none pointer-events-none"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: scene === 2 ? 1 : 0, x: scene === 2 ? 0 : -100 }}
                        transition={{ duration: 2.8, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
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
                        {/* Interactive Explore Button — circle is a sibling (not nested inside the
                            button's overflow-hidden) so it can detach and fly clear across the
                            screen on click, unclipped, before the next scene appears. */}
                        <div className="relative flex items-center" style={{ transform: 'translateZ(0)', isolation: 'isolate' }}>
                            <motion.button
                                type="button"
                                onClick={handleExploreClick}
                                disabled={isExploring}
                                className="relative flex items-center h-[60px] pl-14 pr-5 rounded-full select-none cursor-pointer overflow-hidden will-change-transform"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px) saturate(160%)',
                                    WebkitBackdropFilter: 'blur(10px) saturate(160%)',
                                    border: '1.5px solid rgba(255, 255, 255, 0.55)',
                                    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.12), 0 0 22px rgba(255, 255, 255, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.5), 0 8px 24px rgba(0, 0, 0, 0.3)',
                                }}
                                initial="rest"
                                animate={isExploring ? { opacity: 0, transition: { duration: 0.3 } } : "rest"}
                                whileHover={isExploring ? undefined : "hover"}
                                whileTap={isExploring ? undefined : "press"}
                                variants={{
                                    rest: { scale: 1, y: 0, opacity: 1 },
                                    hover: { scale: 1.03, y: -2 },
                                    press: { scale: 0.98, y: 0 }
                                }}
                                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <span
                                    className="relative z-10 font-sans text-sm font-bold text-[#FFEFA8] tracking-wider leading-none"
                                    style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.45)' }}
                                >
                                    Explore
                                </span>
                            </motion.button>

                            {/* Logo circle — overlaps the button's left edge at rest, then eases gently
                                to the right, staying near the button, when Explore is clicked */}
                            <motion.div
                                className="absolute left-1 top-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center pointer-events-none"
                                style={{
                                    background: 'radial-gradient(circle at 35% 30%, rgba(60, 66, 74, 0.55) 0%, rgba(18, 22, 26, 0.6) 70%)',
                                    border: '1px solid rgba(255, 255, 255, 0.4)',
                                }}
                                animate={
                                    isExploring
                                        ? { x: 140, y: '-50%', scale: 1.08, opacity: 0 }
                                        : { x: 0, y: '-50%', scale: 1, opacity: 1 }
                                }
                                transition={{ duration: 1.2, ease: [0.45, 0, 0.2, 1] }}
                            >
                                <img src={logo2} alt="" className="w-7 h-7 object-contain relative z-10" />
                            </motion.div>
                        </div>

                        {/* Spark visualizer bars to the right */}
                        <motion.div
                            className="flex items-end gap-[4px] h-6 ml-6"
                            animate={{ opacity: isExploring ? 0 : 0.7 }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className="w-[3px] h-[10px] bg-white rounded-full animate-pulse" />
                            <span className="w-[3px] h-[22px] bg-white rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                            <span className="w-[3px] h-[15px] bg-white rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>

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
