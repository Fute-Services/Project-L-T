import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeftNavbar from "../components/navigation/LeftNavbar";
import RightNavbar from "../components/navigation/RightNavbar";
import cerculationBg from "../assets/images/cerculation/cerculation-bg.png";
import backButtonImg from "../assets/images/cerculation/back butten.png";
const newLogo = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/abe60fc8-d31a-482c-276d-74b273dcc700/public";

export default function CirculationPage() {
    const [isNight, setIsNight] = useState(true);
    const [explored, setExplored] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(true);

    useEffect(() => {
        const checkWidth = () => setIsLargeScreen(window.innerWidth >= 1024);
        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    // X, Y coordinates (left, top percentages) for the location markers.
    // Feel free to adjust these percentages to match perfectly with the background image map.
    const markers = [
        { name: "Elphinstone Flyover", left: "35%", top: "75%" },
        { name: "Elphinstone station", left: "70%", top: "80%" },
        { name: "Left from\nSenapati bapat road", left: "30%", top: "43%" },
    ];

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#0a0d12]">
            {/* Top Left Logo */}
            <div className="absolute z-20 top-8 left-10 select-none pointer-events-none">
                <img
                    src={newLogo}
                    alt="Logo"
                    style={{
                        height: '56px',
                        width: 'auto',
                        objectFit: 'contain'
                    }}
                />
            </div>

            {/* 1. Background Layer */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                {/* Explored Gradient BG (Always in DOM) */}
                <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                        background: "var(--projet-detiyals, linear-gradient(105deg, #000 -9.5%, #472700 100%))",
                    }}
                />

                {/* Aspect ratio container for the 1982x1024 image */}
                <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                        width: isLargeScreen ? "max(100vw, 193.55vh)" : "min(100vw, 193.55vh)",
                        height: isLargeScreen ? "max(100vh, 51.67vw)" : "min(100vh, 51.67vw)",
                    }}
                >
                    {/* Unexplored BG Image (Fades out when explored) */}
                    <motion.img
                        src={cerculationBg}
                        alt="Circulation Background"
                        className="w-full h-full object-cover"
                        animate={{
                            opacity: explored ? 0 : 1,
                            scale: explored ? 1.05 : 1.0,
                        }}
                        transition={{ duration: 1.0, ease: "easeInOut" }}
                        style={{ pointerEvents: explored ? "none" : "auto" }}
                    />

                    {/* 1.5. Location Markers (Only visible in unexplored state on the bg map) */}
                    <AnimatePresence>
                        {!explored && (
                            <div className="absolute inset-0 w-full h-full z-20 pointer-events-none">
                                {markers.map((marker, index) => (
                                    <motion.div
                                        key={marker.name}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 1.0, delay: index * 0.15 + 0.3 }}
                                        className="absolute flex items-center justify-center group cursor-pointer"
                                        style={{
                                            left: marker.left,
                                            top: marker.top,
                                            transform: "translate(-50%, -50%)",
                                            width: "16px",
                                            height: "16px"
                                        }}
                                    >
                                        {/* Glowing Pulsing Dot */}
                                        <div className="relative w-4 h-4 flex items-center justify-center z-10">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFEFA8]/50 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFEFA8] shadow-[0_0_10px_#FFEFA8]"></span>
                                        </div>

                                        {/* The Popup Container (rises and scales slightly on hover) */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center pointer-events-auto">
                                            <div className="flex flex-col items-center transition-all duration-300 ease-out transform group-hover:-translate-y-2 group-hover:scale-105 origin-bottom">
                                                {/* The Pill Label */}
                                                <div
                                                    className={`px-3.5 py-1 lg:py-1.5 border border-white/10 font-sans text-[8.5px] lg:text-[10px] font-bold tracking-wider uppercase transition-all duration-300 text-center whitespace-pre-line shadow-lg bg-black/75 text-white group-hover:bg-[#ffcb6e] group-hover:text-[#0c1523] group-hover:border-[#ffcb6e] ${marker.name.includes('\n') ? 'rounded-[12px] py-1.5' : 'rounded-full'
                                                        }`}
                                                >
                                                    {marker.name}
                                                </div>
                                                {/* The Down Triangle */}
                                                <div
                                                    className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black/75 group-hover:border-t-[#ffcb6e] transition-all duration-300 -mt-[1px]"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* 2. Content Layer (Always positioned relative or absolute on top) */}
            <div className="absolute inset-0 flex flex-col justify-between z-10 w-full h-full pointer-events-none">

                {/* Header (Only when explored) */}
                <div className="w-full text-center pt-8 select-none pointer-events-none">
                    <AnimatePresence>
                        {explored && (
                            <motion.h1
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.0, ease: "easeOut" }}
                                className="text-white text-2xl lg:text-3xl font-extrabold tracking-widest uppercase font-sans pointer-events-auto"
                            >
                                Site Circulation
                            </motion.h1>
                        )}
                    </AnimatePresence>
                </div>

                {/* Main Video Content (Only when explored) */}
                <div className="flex-1 flex items-center justify-center px-[12%] pointer-events-none">
                    <AnimatePresence>
                        {explored && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="w-[62vw] h-[75vh] rounded-[32px] lg:rounded-[40px] overflow-hidden shadow-2xl relative bg-black/45 border"
                                style={{
                                    borderColor: "rgba(255, 255, 255, 0.08)",
                                }}
                            >
                                <iframe
                                    src="https://player.vimeo.com/video/1206976915?h=5e8f3c6738&autoplay=1&loop=1&muted=1&playsinline=1"
                                    className="w-full h-full rounded-[32px] lg:rounded-[40px]"
                                    style={{ border: "none" }}
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowFullScreen
                                    title="Site Circulation Video"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Explore Button (Only when NOT explored) */}
                <div className="absolute bottom-10 right-8 lg:right-16 z-50 pointer-events-auto">
                    <AnimatePresence>
                        {!explored && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <motion.button
                                    type="button"
                                    onClick={() => setExplored(true)}
                                    className="relative flex items-center justify-center h-[55px] px-10 rounded-full select-none cursor-pointer overflow-hidden font-sans text-sm font-bold text-[#FFEFA8] tracking-wider leading-none shadow-lg"
                                    style={{
                                        background: 'rgba(10, 13, 18, 0.34)',
                                        backdropFilter: 'blur(10px) saturate(160%)',
                                        WebkitBackdropFilter: 'blur(10px) saturate(160%)',
                                        border: '1.5px solid rgba(255, 255, 255, 0.15)',
                                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.16), inset 0 1px 1px rgba(255, 255, 255, 0.08)',
                                    }}
                                    whileHover={{
                                        scale: 1.05,
                                        y: -2,
                                        borderColor: 'rgba(255, 255, 255, 0.35)',
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Explore
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Left Navbar */}
                <div className="absolute top-[48%] lg:top-[55%] left-[6%] sm:left-[9%] md:left-[9.5%] lg:left-[6%] z-50 -translate-y-1/2 -translate-x-1/2 pointer-events-auto">
                    <LeftNavbar />
                </div>

                {/* Back Button (Only when explored, positioned separately below Left Navbar) */}
                <AnimatePresence>
                    {explored && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="absolute top-[calc(48%+160px)] lg:top-[calc(90%)] left-[70px] z-50 -translate-x-1/2 pointer-events-auto"
                        >
                            <motion.button
                                type="button"
                                onClick={() => setExplored(false)}
                                className="w-[30px] h-[30px] lg:w-[48px] lg:h-[48px] cursor-pointer flex items-center justify-center select-none"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <img
                                    src={backButtonImg}
                                    alt="Back Button"
                                    className="w-full h-full object-contain"
                                />
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Right Navbar */}
                <div className="fixed right-5 lg:right-10 top-[55%] lg:top-1/2 -translate-y-1/2 z-50 pointer-events-auto">
                    <RightNavbar isNight={isNight} setIsNight={setIsNight} />
                </div>

                {/* Bottom spacer */}
                <div className="h-10 shrink-0" />
            </div>
        </div>
    );
}