import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
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
    const navigate = useNavigate()
    const [showNavbars, setShowNavbars] = useState(false)
    const [isNight, setIsNight] = useState(true) // Night is default
    const [sunTransition, setSunTransition] = useState<null | { toNight: boolean; key: number }>(null)
    const hasMounted = useRef(false)
    const transitionCounter = useRef(0)

    // Trigger the sunrise/sunset transition effect only on actual toggles, not on first mount
    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true
            return
        }
        transitionCounter.current += 1
        setSunTransition({ toNight: isNight, key: transitionCounter.current })
        const clearTimer = setTimeout(() => setSunTransition(null), 2400)
        return () => clearTimeout(clearTimer)
    }, [isNight])

    useEffect(() => {
        if (explored) {
            // Delay showing the navbars until after the headline's fade-in/hold/fade-out sequence completes (3.2s)
            const timer = setTimeout(() => {
                setShowNavbars(true)
            }, 3200)
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
            {/* Background Image — same photo always; "day" is a color-grade over it, not a swap */}
            <motion.img
                src={homeBgNight}
                alt="Skyline"
                className="absolute inset-0 w-full h-full object-fill z-0"
                initial={{
                    scale: 1.15,
                    filter: isNight ? "brightness(1) saturate(1)" : "brightness(1.45) contrast(1.05) saturate(1.15)"
                }}
                animate={{
                    scale: explored ? 1.0 : 1.15,
                    filter: isNight ? "brightness(1) saturate(1)" : "brightness(1.45) contrast(1.05) saturate(1.15)"
                }}
                transition={{
                    scale: { duration: 3.2, delay: 0.2, ease: [0.25, 1, 0.28, 1] },
                    filter: { duration: 2.2, ease: "easeInOut" }
                }}
            />

            {/* Day-mode sky wash — clear blue sky up top, warm tone only near the horizon */}
            <motion.div
                className="absolute inset-0 z-[1] pointer-events-none mix-blend-overlay"
                style={{
                    background: "linear-gradient(180deg, rgba(120,180,255,0.65) 0%, rgba(150,195,255,0.35) 35%, rgba(255,210,160,0.15) 70%, rgba(255,170,100,0.1) 100%)"
                }}
                initial={{ opacity: isNight ? 0 : 1 }}
                animate={{ opacity: isNight ? 0 : 1 }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{
                    background: "linear-gradient(180deg, rgba(255,225,190,0) 0%, rgba(255,225,190,0) 55%, rgba(255,225,190,1) 100%)",
                    mixBlendMode: "soft-light"
                }}
                initial={{ opacity: isNight ? 0 : 0.45 }}
                animate={{ opacity: isNight ? 0 : 0.45 }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
            />

            {/* Sunrise / Sunset Transition Effect — plays once per toggle */}
            <AnimatePresence>
                {sunTransition && (
                    <motion.div
                        key={sunTransition.key}
                        className="absolute inset-0 z-[5] overflow-hidden pointer-events-none"
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    >
                        {/* Sky color wash — warm gold rising, cool blue setting (top-left) */}
                        <motion.div
                            className="absolute inset-0"
                            style={{
                                background: sunTransition.toNight
                                    ? "radial-gradient(circle at 12% 12%, rgba(120,150,255,0.4), transparent 55%)"
                                    : "radial-gradient(circle at 12% 12%, rgba(255,180,90,0.5), transparent 55%)"
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 2.4, times: [0, 0.45, 1], ease: "easeInOut" }}
                        />

                        {/* Rising / setting sun glow */}
                        <motion.div
                            className="absolute rounded-full"
                            style={{
                                left: "10%",
                                width: 280,
                                height: 280,
                                marginLeft: -140,
                                background: sunTransition.toNight
                                    ? "radial-gradient(circle, rgba(190,210,255,0.9) 0%, rgba(190,210,255,0) 70%)"
                                    : "radial-gradient(circle, rgba(255,220,150,0.95) 0%, rgba(255,180,90,0) 70%)",
                                filter: "blur(4px)"
                            }}
                            initial={{
                                top: sunTransition.toNight ? "10%" : "-16%",
                                opacity: 0,
                                scale: 0.6
                            }}
                            animate={{
                                top: sunTransition.toNight
                                    ? ["10%", "-4%", "-20%"]
                                    : ["-16%", "6%", "14%"],
                                opacity: [0, 1, sunTransition.toNight ? 0 : 1],
                                scale: [0.6, 1.1, sunTransition.toNight ? 0.85 : 1]
                            }}
                            transition={{ duration: 2.4, times: [0, 0.5, 1], ease: [0.25, 0.8, 0.35, 1] }}
                        />

                        {/* Lens flare pulse at the core of the sun */}
                        <motion.div
                            className="absolute rounded-full bg-white"
                            style={{ left: "10%", width: 36, height: 36, marginLeft: -18, filter: "blur(2px)" }}
                            initial={{
                                top: sunTransition.toNight ? "10%" : "-16%",
                                opacity: 0,
                                scale: 0.5
                            }}
                            animate={{
                                top: sunTransition.toNight ? ["10%", "-4%"] : ["-16%", "6%"],
                                opacity: [0, 0.9, sunTransition.toNight ? 0 : 0.9],
                                scale: [0.5, 1.8, 0.9]
                            }}
                            transition={{ duration: 1.3, delay: 0.5, ease: "easeOut" }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sun stays resting in the day sky once the transition settles */}
            <motion.div
                className="absolute rounded-full pointer-events-none z-[2]"
                style={{
                    left: "10%",
                    top: "6%",
                    width: 240,
                    height: 240,
                    marginLeft: -120,
                    background: "radial-gradient(circle, rgba(255,235,190,0.85) 0%, rgba(255,200,120,0) 70%)",
                    filter: "blur(4px)"
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isNight ? 0 : 1 }}
                transition={{ duration: 1.2, delay: isNight ? 0 : 1.2, ease: "easeInOut" }}
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

            {/* Left Side "SOAR THE SKYLINE" Text — fades in, holds, then slides out as the navbars arrive */}
            <motion.div
                className="absolute z-20 left-20 top-[40%] -translate-y-1/2 flex flex-col gap-2 select-none pointer-events-none"
                initial={{ opacity: 0, x: "40px" }}
                animate={{ opacity: [0, 1, 1, 0], x: ["40px", "0px", "0px", "-200px"] }}
                transition={{ duration: 3.2, times: [0, 0.25, 0.55, 1], ease: [0.25, 1, 0.28, 1] }}
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

            {/* Right Side Transparent Outline Curve — mirrors the headline's fade-in/hold/fade-out */}
            <motion.div
                className="absolute z-10 right-0 top-0 h-full w-[50%] md:w-[40%] select-none pointer-events-none flex items-center justify-end"
                initial={{ opacity: 0, x: "40px" }}
                animate={{ opacity: [0, 0.35, 0.35, 0], x: ["40px", "0px", "0px", "200px"] }}
                transition={{ duration: 3.2, times: [0, 0.25, 0.55, 1], ease: [0.25, 1, 0.28, 1] }}
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
                                    y: { duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
                                    opacity: { duration: 0.7, delay: 0.4, ease: "easeOut" },
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