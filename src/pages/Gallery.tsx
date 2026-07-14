import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const gallery2 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/31d3c44c-9398-4aab-539c-b4a939cceb00/public";
const gallery3 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/d4bc0726-4748-4335-fd33-b7ecc2484b00/public";
const gallery4 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/2453c472-e39b-4b8f-dc57-70698232fe00/public";
const gallery5 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/c9be42b0-998c-48e6-d5d7-5639f34f3c00/public";
const gallery6 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/51d7bd38-fc5d-4d81-e664-6a0783e5cd00/public";
const gallery7 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/e4fcf4de-c85c-40cf-53a7-01ca3576ff00/public";
const gallery8 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/a276137d-ec40-4ace-aa0f-15bb3747c900/public";
const gallery9 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/024bc39e-3ebc-408d-9adc-2e9009b75600/public";
const gallery10 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/f17befd0-4f62-4c9d-8248-fd05a86b1500/public";
// const gallery11 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/e1f2838a-d090-4d90-4e1e-cdd7eae27500/public";

import logo2 from '../assets/logos/logo-outline-white.svg';
import LeftNavbar from '../components/navigation/LeftNavbar';
import RightNavbar from '../components/navigation/RightNavbar';

// Gallery data mapping Vite asset paths
const GALLERY_DATA = [

    gallery2,
    gallery3,
    gallery4,
    gallery5,
    gallery6,
    gallery7,
    gallery8,
    gallery9,
    gallery10,
    // gallery11,
];

// Framer motion variants for the sliding gallery images
const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
        zIndex: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
        zIndex: 10,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
        zIndex: 0,
    }),
};

const Gallery = () => {
    // Intro animation state
    const [showIntro, setShowIntro] = useState(true);

    // Gallery state
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0); // Tracks direction for slide animation
    const [isNight, setIsNight] = useState(true);

    useEffect(() => {
        // 2 seconds to slow down the entire intro experience
        const timer = setTimeout(() => {
            setShowIntro(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // Handlers for gallery navigation
    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % GALLERY_DATA.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) =>
            prev === 0 ? GALLERY_DATA.length - 1 : prev - 1
        );
    };

    // Safely extract the string path for the current active image
    const currentItem = GALLERY_DATA[currentIndex];
    const currentSrc = typeof currentItem === 'string' ? currentItem : (Object.values(currentItem)[0] as string);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-neutral-900 font-sans">

            {/* =========================================
          BACKGROUND GALLERY IMAGES (Sliding setup)
          ========================================= */}
            <motion.div
                className="absolute inset-0 z-0"
                // Blur is present from the start. When showIntro becomes false, wait 2 seconds (for text to exit) before removing blur.
                animate={{ filter: showIntro ? "blur(24px)" : "blur(0px)" }}
                transition={{ duration: 1.5, delay: showIntro ? 0 : 1.5, ease: "easeInOut" }}
            >
                <AnimatePresence initial={false} custom={direction}>
                    <motion.img
                        key={currentIndex} // Force re-render on index change
                        src={currentSrc}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 250, damping: 30 },
                            opacity: { duration: 0.5 }
                        }}
                        alt={`Gallery ${currentIndex + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </AnimatePresence>
            </motion.div>

            {/* =========================================
          INTRO ANIMATION OVERLAYS (Text)
          ========================================= */}
            <AnimatePresence>
                {showIntro && (
                    <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
                        {/* "GALLERY" Text - Slowed down */}
                        <motion.h1
                            initial={{ y: "-50vh", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "-50vh", opacity: 0 }}
                            transition={{ duration: 2, ease: [0.25, 1, 0.5, 1] }}
                            className="absolute z-40 text-white text-6xl md:text-8xl lg:text-[140px] font-100 tracking-[0.15em] drop-shadow-2xl font-light"
                        >
                            GALLERY
                        </motion.h1>
                    </div>
                )}
            </AnimatePresence>

            {/* =========================================
          TOP LEFT LOGO
          ========================================= */}
            <div className="absolute z-20 top-8 left-10 flex items-center gap-4 select-none pointer-events-none">
                <div className="relative w-12 h-12">
                    <img
                        src={logo2}
                        alt="L&T Logo"
                        className="absolute inset-0 w-full h-full object-contain"
                    />
                </div>
                <div className="flex items-center text-white">
                    <h1 className="font-mahameru text-sm font-semibold tracking-wide italic leading-none">
                        L&T Realty
                    </h1>
                </div>
            </div>

            {/* =========================================
          NAVIGATION NAVBARS
          ========================================= */}
            <AnimatePresence>
                {!showIntro && (
                    <>
                        {/* Left Navbar Container */}
                        <div className="fixed left-5 lg:left-16 top-[55%] lg:top-1/2 -translate-y-1/2 z-[70]">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
                            >
                                <LeftNavbar />
                            </motion.div>
                        </div>

                        {/* Right Navbar Container */}
                        <div className="fixed right-5 lg:right-10 top-[55%] lg:top-1/2 -translate-y-1/2 z-[70]">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
                            >
                                <RightNavbar isNight={isNight} setIsNight={setIsNight} />
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>

            {/* =========================================
          MAIN INTERACTIVE UI (Sub-Navbar)
          ========================================= */}
            <AnimatePresence>
                {!showIntro && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: -25 }}
                        // Delayed to perfectly match the moment the blur starts fading away
                        transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
                        className="absolute inset-0 z-[60] pointer-events-none"
                    >
                        <div className="absolute bottom-6 lg:bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-auto">
                            {/* Outer Wrapper: Flex with a gap, no background or borders here */}
                            <div className="flex items-center gap-3 md:gap-5">
                                {/* 1. Left Arrow Bubble */}
                                <button
                                    onClick={handlePrev}
                                    className="w-12 h-12 md:w-[55px] md:h-[55px] flex items-center justify-center rounded-full bg-black/50 border border-white/30 shadow-2xl hover:bg-white/20 text-white transition-colors duration-200 cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="21" viewBox="0 0 15 21" fill="none">
                                        <path d="M13.1328 1L2.36728 7.98875C0.582323 9.14751 0.537838 11.7447 2.28206 12.9639L11.6328 19.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>

                                {/* 3. Right Arrow Bubble */}
                                <button
                                    onClick={handleNext}
                                    className="w-12 h-12 md:w-[55px] md:h-[55px] flex items-center justify-center rounded-full bg-black/50 border border-white/30 shadow-2xl hover:bg-white/20 text-white transition-colors duration-200 cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="21" viewBox="0 0 15 21" fill="none">
                                        <path d="M1 19.5L11.7655 12.5112C13.5505 11.3525 13.595 8.75531 11.8507 7.53611L2.5 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Gallery;
