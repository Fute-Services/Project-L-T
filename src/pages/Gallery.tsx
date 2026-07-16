import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from "framer-motion";


// Asset Imports
// import gallery2 from '../assets/images/gallery/2 Dusk main.webp';
// import gallery3 from '../assets/images/gallery/3.webp';
// import gallery4 from '../assets/images/gallery/4.webp';
// import gallery5 from '../assets/images/gallery/5.webp';
// import gallery7 from '../assets/images/gallery/7.webp';
// import gallery8 from '../assets/images/gallery/8.webp';
// import gallery9 from '../assets/images/gallery/9.webp';
// import gallery10 from '../assets/images/gallery/10.webp';

const gallery2 = 'https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/31d3c44c-9398-4aab-539c-b4a939cceb00/public';
const gallery3 = 'https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/e4fcf4de-c85c-40cf-53a7-01ca3576ff00/public';
const gallery4 = 'https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/a276137d-ec40-4ace-aa0f-15bb3747c900/public';
const gallery5 = 'https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/024bc39e-3ebc-408d-9adc-2e9009b75600/public';
const gallery7 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/d4bc0726-4748-4335-fd33-b7ecc2484b00/public";
const gallery8 = 'https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/c9be42b0-998c-48e6-d5d7-5639f34f3c00/public';

const gallery9 = 'https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/f17befd0-4f62-4c9d-8248-fd05a86b1500/public';
const gallery10 = 'https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/2453c472-e39b-4b8f-dc57-70698232fe00/public';

import logo2 from '../assets/logos/logo-outline-white.svg';
import LeftNavbar from '../components/navigation/LeftNavbar';
import RightNavbar from '../components/navigation/RightNavbar';

const GALLERY_DATA = [
    { id: 1, images: gallery2, title: "Samagam of innovation connectivity and grandeur" },
    { id: 2, images: gallery3, title: "Strategically positioned near Mumbai's landmark double-decker bridge" },
    { id: 3, images: gallery4, title: "At the Epicentre of Mumbai's Business Landscape" },
    { id: 4, images: gallery5, title: "A Signature Arrival Of Luxury And Legacy" },
    { id: 5, images: gallery7, title: "Unobstructed Views, For All 365 Days & Forever" },
    { id: 6, images: gallery8, title: "Elevated Workspaces , Extraordinary Perspectives" },
    { id: 7, images: gallery9, title: "A Landmark that defines the skyline" },
    { id: 8, images: gallery10, title: "Grand Arrival, Crafted For Privacy And Prestige" },
];

// Parent wrapper variant coordinates entry timing
const containerVariants = {
    enter: { transition: { staggerChildren: 0.4 } },
    center: { transition: { staggerChildren: 0.4 } },
    exit: { transition: { staggerChildren: 0.1, staggerDirection: -1 } }
};

// Title variant: Clean fade-in slide up
// const titleVariants = {
//     enter: { y: 30, opacity: 0 },
//     center: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
//     exit: { y: -20, opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }
// };



// Image variant: Smooth directional slide
const imageVariants:Variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: {
            x: { type: "spring", stiffness: 100, damping: 20 },
            opacity: { duration: 0.8 }
        }
    },
    exit: (direction: number) => ({
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
        transition: { duration: 0.6 }
    }),
};

// Image variant: 3D Depth Slide & Scale
// const imageVariants = {
//     enter: (direction: number) => ({
//         x: direction > 0 ? "100%" : "-100%",
//         scale: 1.1,
//         opacity: 0,
//     }),
//     center: {
//         x: 0,
//         scale: 1,
//         opacity: 1,
//         transition: {
//             x: { type: "spring", stiffness: 80, damping: 20 },
//             scale: { duration: 0.8, ease: "easeOut" },
//             opacity: { duration: 0.6 }
//         }
//     },
//     exit: (direction: number) => ({
//         x: direction < 0 ? "20%" : "-20%", // Slides out subtly
//         scale: 0.9,                         // Shrinks back
//         opacity: 0,
//         transition: {
//             duration: 0.8,
//             ease: "easeInOut"
//         }
//     }),
// };

// Image Variant: Vertical Split Wipe
// const imageVariants = {
//     enter: (direction: number) => ({
//         clipPath: direction > 0 ? "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)" : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
//         scale: 1.1,
//         opacity: 0,
//     }),
//     center: {
//         clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
//         scale: 1,
//         opacity: 1,
//         transition: {
//             clipPath: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }, // Ultra-smooth dramatic curve
//             scale: { duration: 1.5, ease: "easeOut" },
//             opacity: { duration: 0.4 }
//         }
//     },
//     exit: {
//         opacity: 0,
//         scale: 0.95,
//         transition: { duration: 0.6 }
//     }
// };

// Title Variant: Center Flash to Bottom Track
// Title Variant: Center to Permanent Bottom Track
// Title Variant: Left Entrance -> Center Pass -> Permanent Right Anchor
const titleVariants :Variants= {
    enter: {
        letterSpacing: "0.20em",
        opacity: 0,
        scale: 0.95,
        x: "-30vw" // Starts off-center toward the left
    },
    center: {
        letterSpacing: "0.05em",
        opacity: 1,
        scale: 1,
        // Keyframes: Starts left (-30vw), glides through center (0), settles on the right (e.g., 250px)
        x: ["-30vw", "0vw", "25vw"],
        transition: {
            duration: 1.6,
            ease: "easeOut",
            delay: 0.5,
            // Custom timing mapping for the keyframe array steps
            x: {
                times: [0, 0.35, 1], // 0% time (left), 35% time (center), 100% time (right)
                // duration: 1.6,
                duration:0.5,
                ease: [0.16, 1, 0.3, 1] // Cinematic ease-out
            }
        }
    }
};
const Gallery = () => {
    const [showIntro, setShowIntro] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isNight, setIsNight] = useState(true);

    // State to control title disappearance after appearance
    const [, setIsTitleVisible] = useState(false);

    // Initial Intro Timer
    useEffect(() => {
        const timer = setTimeout(() => setShowIntro(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    // Logic to show title on every slide change and hide it after 4 seconds
    useEffect(() => {
        if (!showIntro) {
            setIsTitleVisible(true);
            // const hideTimer = setTimeout(() => {
            //     setIsTitleVisible(false);
            // }, 4000); // 4 Seconds visibility
            // return () => clearTimeout(hideTimer);
        }
    }, [currentIndex, showIntro]);

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % GALLERY_DATA.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => prev === 0 ? GALLERY_DATA.length - 1 : prev - 1);
    };

    const currentItem = GALLERY_DATA[currentIndex];
    const currentSrc = typeof currentItem.images === 'string'
        ? currentItem.images
        : (Object.values(currentItem.images)[0] as string);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-neutral-900 font-sans">

            {/* =========================================
               BACKGROUND GALLERY & TITLE WRAPPER
            ========================================= */}
            <motion.div
                className="absolute inset-0 z-0"
                animate={{ filter: showIntro ? "blur(24px)" : "blur(0px)" }}
                transition={{ duration: 1.5, delay: showIntro ? 0 : 1.5, ease: "easeInOut" }}
            >
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={containerVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0 w-full h-full flex items-center justify-center"
                    >
                        {/* THE IMAGE: Slides in and stays */}
                        <motion.img
                            src={currentSrc}
                            custom={direction}
                            variants={imageVariants}
                            alt={`Gallery ${currentIndex + 1}`}
                            className="absolute inset-0 w-full h-full object-cover z-0"
                        />

                        {/* VIGNETTE OVERLAY */}
                        <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />


                        {/* THE TITLE WRAPPER: Placed directly in the background container, anchored permanently to the bottom-right */}
                        {/* THE TITLE WRAPPER: Anchored permanently at the bottom-right */}
                        <div className="absolute bottom-12 md:bottom-14 right-6 md:right-[27%] z-20 
    pointer-events-none text-right select-none max-w-2xl ">

                            <motion.h2
                                key={`title-${currentIndex}`} // Triggers the sweep animation on slide change
                                variants={titleVariants}
                                initial="enter"
                                animate="center"
                                className="inline-block text-white text-xl
                                 uppercase font-light tracking-wide 
    drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] leading-tight 
    pl-12 pr-14 py-4 /* Extra padding on the right for the capsule turn */"

                                /* Direct styling to override color physics and shape precisely */
                                style={{
                                    background: 'linear-gradient(90deg, rgba(161, 134, 78, 0.10) 0%, rgba(161, 134, 78, 0.4) 40%, rgba(161, 134, 78, 0.85) 85%, rgba(161, 134, 78, 0.95) 100%)',
                                    // background: 'linear-gradient(90deg, rgba(205, 191, 164, 0.1) 0%, rgba(247, 208, 118, 0.4) 40%, rgba(223, 177, 96, 0.85) 85%, rgba(212, 166, 81, 0.95) 100%)',
                                    // This creates a perfect smooth capsule edge specifically on the right side
                                    borderTopRightRadius: '9999px',
                                    borderBottomRightRadius: '9999px',
                                    borderTopLeftRadius: '40px',
                                    borderBottomLeftRadius: '40px',
                                }}
                            >
                                {currentItem.title}
                            </motion.h2>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* =========================================
               INTRO OVERLAY (Initial Screen)
            ========================================= */}
            <AnimatePresence>
                {showIntro && (
                    <div className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center">
                        <motion.h1
                            initial={{ y: "-50vh", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "-50vh", opacity: 0 }}
                            transition={{ duration: 2, ease: [0.25, 1, 0.5, 1] }}
                            className="text-white text-6xl md:text-8xl lg:text-[100px] tracking-[0.15em] font-light"
                        >
                            PROJECT OVERVIEW
                        </motion.h1>
                    </div>
                )}
            </AnimatePresence>

            {/* =========================================
               TOP LOGO & NAVBARS
            ========================================= */}
            <div className="absolute z-50 top-8 left-10 flex items-center gap-4 select-none pointer-events-none">
                <img src={logo2} alt="Logo" className="w-12 h-12 object-contain" />
                <h1 className="text-white text-sm font-semibold tracking-wide italic italic">L&T Realty</h1>
            </div>

            <AnimatePresence>
                {!showIntro && (
                    <>
                        <div className="fixed left-5 lg:left-16 top-1/2 -translate-y-1/2 z-[70]">
                            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 1.5 }}>
                                <LeftNavbar />
                            </motion.div>
                        </div>

                        <div className="fixed right-5 lg:right-10 top-1/2 -translate-y-1/2 z-[70]">
                            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 1.5 }}>
                                <RightNavbar isNight={isNight} setIsNight={setIsNight} />
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>

            {/* =========================================
               NAVIGATION CONTROLS (Arrows)
            ========================================= */}
            <AnimatePresence>
                {!showIntro && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: -25 }}
                        transition={{ duration: 1, delay: 1.5 }}
                        className="absolute bottom-6 left-[43%] -translate-x-1/2 z-[80]"
                    >
                        <div className="flex items-center gap-5">
                            <button onClick={handlePrev} className="w-12 h-12 md:w-[50px] md:h-[50px] flex items-center justify-center rounded-full bg-black/50 border border-white/30 text-white hover:bg-white/20 transition-all cursor-pointer">
                                <svg width="14" height="20" viewBox="0 0 15 21" fill="none"><path d="M13.1328 1L2.36728 7.98875C0.582323 9.14751 0.537838 11.7447 2.28206 12.9639L11.6328 19.5" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
                            </button>
                            <button onClick={handleNext} className="w-12 h-12 md:w-[50px] md:h-[50px] flex items-center justify-center rounded-full bg-black/50 border border-white/30 text-white hover:bg-white/20 transition-all cursor-pointer">
                                <svg width="12" height="20" viewBox="0 0 15 21" fill="none"><path d="M1 19.5L11.7655 12.5112C13.5505 11.3525 13.595 8.75531 11.8507 7.53611L2.5 1" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Gallery;