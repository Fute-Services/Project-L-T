import { useState } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import logo2 from "../assets/logos/logo-outline-white.svg";
import vector from "../assets/projectDetails/Vector.png";
import LeftNavbar from "../components/navigation/LeftNavbar";
import Typical from '../assets/projectDetails/OfficeStack1.png'
import { useNavigate } from 'react-router-dom';
import back from '../assets/projectDetails/back.png'
// Define strict typing for your interior floor data sections
interface FloorAmenity {
    id: string;
    name: string;
    polygon: string; // Coordinate strings for SVG mapping
}
export default function UnitPlanPage({ startScene = 2 }: { startScene?: 1 | 2 | 3 }) {
    const [scene, 
        // setScene
    ] = useState<1 | 2 | 3>(startScene);
    const [hoveredAmenity, setHoveredAmenity] = useState<FloorAmenity | null>(null);
    const [selectedAmenity, setSelectedAmenity] = useState<string | null>(); // Defaults active highlight
    const [zoomScale, setZoomScale] = useState<number>(1);
    const [zoomStep, setZoomStep] = useState(0); // 0 is default baseline scale

    // Example architectural spatial layout configuration matching your image sections
    const amenityData: FloorAmenity[] = [
        // { id: "ground-rg", name: "Ground RG", polygon: "630,120 1060,140 1140,250 1280,310 1220,350 710,310" },
        { id: "lift", name: "Lift", polygon: "" },
        { id: "lobby", name: "Lobby", polygon: "" },
        { id: "reception", name: "Reception", polygon: "" },
        { id: "services", name: "Services", polygon: "" },
        { id: "ramp-to-bay", name: "Ramp to Bay", polygon: "" },
    ];

    const handleZoom = (direction: 'in' | 'out') => {
        if (direction === 'in') {
            if (zoomStep < 2) {
                setZoomStep(prev => prev + 1);
                setZoomScale(prev => prev + 0.16); // Step 1: 1.25, Step 2: 1.50
            }
        } else {
            if (zoomStep > -2) {
                setZoomStep(prev => prev - 1);
                setZoomScale(prev => prev - 0.16); // Step -1: 0.75, Step -2: 0.50
            }
        }
    };
    const navigate =
        useNavigate();
    return (
        <div
            className="relative w-full h-screen overflow-hidden flex items-center justify-center select-none"
            style={{
                /* Base background color using your darkest tone #1a1107 */
                backgroundColor: "#1a1107",
                /* Radial spotlight focused towards the right-center (80% X, 45% Y).
                  It smoothly transitions from a richer warm tone down to your ultra-dark #1a1107 at the edges.
                */
                backgroundImage: `
      radial-gradient(circle 75vw at 80% 45%, rgba(68, 41, 19, 0.65) 0%, rgba(44, 24, 1, 0.35) 45%, #241401 75%, #1a1107 100%)
    `,
            }}
        >

            {/* 1. Large Brand Identity Watermark Background Layer */}
            <motion.div
                // 1. Initial hardware-accelerated state (slightly shifted, scaled down, and rotated)
                initial={{
                    opacity: 0,
                    scale: 0.85,
                    y: 30,
                    rotate: -3
                }}
                // 2. High-end natural entrance using a custom damping spring
                animate={{
                    opacity: 0.80,
                    scale: 1,
                    y: 0,
                    rotate: 0
                }}
                transition={{
                    type: "spring",
                    stiffness: 45,    // Low stiffness for a soft, graceful movement
                    damping: 15,      // Prevents aggressive bouncing, creating a luxury "cushioned" settle
                    mass: 1.2,        // Adds a slight sense of weight to the asset
                    delay: 0.4,       // Keeps your original delay
                }}
                /* ── POSITIONING & MIX BLEND MODE ── */
                className="absolute -right-12 -top-5 pointer-events-none
     w-[50vh] h-[50vh] z-10 mix-blend-screen select-none"
            >
                {/* 3. Sub-animation: A separate slow-breathing float loop running in parallel */}
                <motion.div
                    className="w-full h-full"
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 1.5, 0]
                    }}
                    transition={{
                        duration: 8,       // Super slow 8-second cycle for ultimate elegance
                        ease: "easeInOut", // Perfectly symmetrical ease curve for seamless looping
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                >
                    <img
                        src={vector}
                        alt="Watermark"
                        className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    />
                </motion.div>
            </motion.div>
            {/* 2. Top Left Responsive Branding Header Block */}
            <motion.div
                className="absolute z-50 top-8 left-10 flex items-center gap-4 pointer-events-none"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: scene >= 2 ? 1 : 0, x: scene >= 2 ? 0 : -30 }}
                transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
            >
                <img src={logo2} alt="Logo" className="w-11 h-11 object-contain" />
                <div className="flex items-center text-white">
                    <h1 className="font-sans text-sm font-semibold tracking-wide italic 
                    leading-none text-white/90">L&T Realty</h1>
                    {/* <div className="w-[1px] h-7 bg-white/20 mx-4" /> */}
                    {/* <div className="flex flex-col justify-center">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/90 leading-none">Innovation Campus</h2>
            <p className="text-[7.5px] font-medium uppercase tracking-widest text-white/40 mt-[3px] leading-none">Lower Parel, Mumbai</p>
          </div> */}
                </div>
            </motion.div>

            {/* 3. Global Navigation Sidebar */}
            <div className="fixed left-12 top-1/2 -translate-y-1/2 z-50">
                <LeftNavbar />
            </div>

            <motion.div
                /* ── 1. PREMIUM ENTRY ANIMATION CONFIG ── */
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: zoomScale, y: 0 }}
                transition={{
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1], // Custom ultra-smooth easeOutExpo curve
                    delay: 0.5
                }}
                /* ── 2. FIXED CORNERS ──
                   Changed 'rounded-5xl' to 'rounded-2xl' so Tailwind compiles it properly.
                   Keep 'overflow-hidden' to clip everything cleanly.
                */
                className="relative w-[65vw] justify-center items-center top-12 z-50 h-[87vh] flex items-center
                 justify-center rounded-2xl overflow-hidden 
                  transition-transform
                   duration-300 ease-out"
            /* Removed scale from inline styles because Framer Motion handles the zoom dynamically above via 'scale: zoomScale' */
            >

                {/* Architectural Image Layout Asset */}
                <img
                    src={Typical}
                    alt="Ground Structural Layout Blueprint"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
                />

                {/* Interactive Vector Highlight Polygon System Overlays */}
                <svg
                    viewBox="0 0 1982 1024"
                    preserveAspectRatio="xMidYMid meet"
                    className="absolute inset-0 w-full h-full z-20 pointer-events-auto"
                >
                    {amenityData.map((item) => {
                        const isActive = hoveredAmenity?.id === item.id || selectedAmenity === item.id;

                        // Differentiates coloring specifically for green space areas like Ground RG
                        const highlightColor = item.id === 'ground-rg' ? 'rgba(134, 194, 131, 0.45)' : 'rgba(229, 180, 92, 0.25)';
                        const borderStroke = item.id === 'ground-rg' ? 'rgba(134, 194, 131, 0.8)' : 'rgba(229, 180, 92, 0.7)';

                        return (
                            <polygon
                                key={item.id}
                                points={item.polygon}
                                fill={isActive ? highlightColor : "transparent"}
                                stroke={isActive ? borderStroke : "transparent"}
                                strokeWidth={isActive ? "2" : "0"}
                                className="cursor-pointer transition-all duration-300 ease-in-out"
                                onMouseEnter={() => setHoveredAmenity(item)}
                                onMouseLeave={() => setHoveredAmenity(null)}
                                onClick={() => setSelectedAmenity(item.id)}
                            />
                        );
                    })}
                </svg>
            </motion.div>

            {/* 5. Right Sidebar Interactive Directory Control Legend */}
            <motion.div
                /* ── SIDEBAR RIGHT-TO-LEFT ENTRANCE ANIMATION ── */
                initial={{ opacity: 0, x: 45 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    duration: 1.1,
                    ease: [0.16, 1, 0.3, 1], // Luxury cubic-bezier curve
                    delay: 0.5
                }}
                className="absolute right-[8%] top-[30%] 
            -translate-y-1/2 z-50 w-[160px] flex flex-col gap-6 font-sans">



                {/* Directory List Container with Left Border Track Accent Line */}
                <div className="relative flex flex-col pl-4">
                    {/* The long elegant vertical gold tracking rule line from your image */}
                    {/* <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-amber-500/80 via-amber-600/30 to-transparent" /> */}





                    {/* ── EXACT MATCH TAPERED NEEDLE GLOW LINE ── */}
                    <div
                        className="absolute left-0 top-[-20px] 
                        bottom-[-40px] w-[1.5px] pointer-events-none"
                        style={{
                            background: `linear-gradient(to bottom, 
          rgba(212, 163, 115, 0) 0%, 
          rgba(212, 163, 115, 0.2) 15%, 
          rgba(245, 158, 11, 0.85) 45%, 
          rgba(245, 158, 11, 0.4) 65%, 
          rgba(212, 163, 115, 0) 100%)`,
                            boxShadow: '0px 0px 6px rgba(245, 158, 11, 0.2)'
                        }}
                    />
                    <LayoutGroup id="menuActiveIndicatorGroup">

                        {/* Floor Level Heading Tag Display - Matches Image Outline Frame */}
                        {/* <div className=""> */}
                        <div className="inline-flex pl-2 mb-6 items-center gap-2 
                             border border-amber-500/20 rounded-[2px]
                              bg-white/10 backdrop-blur-sm min-w-[130px]">
                            <span className="text-white font-bold text-[19px] tracking-wide">G</span>
                            <span className="text-white/80  mt-1
                                 tracking-widest text-[12px] 
                                font-medium ">Floor</span>
                        </div>
                        {/* </div> */}
                        {amenityData.map((menuItem) => {
                            const isItemActive = hoveredAmenity?.id === menuItem.id || selectedAmenity === menuItem.id;

                            return (
                                <div
                                    key={menuItem.id}
                                    onMouseEnter={() => setHoveredAmenity(menuItem)}
                                    onMouseLeave={() => setHoveredAmenity(null)}
                                    onClick={() => setSelectedAmenity(menuItem.id)}
                                    className="group relative py-2.5 cursor-pointer flex items-center transition-all duration-150 select-none"
                                >
                                    {/* Dynamic Sliding Bold Gold Vertical Active indicator segment */}
                                    {isItemActive && (
                                        <motion.div
                                            layoutId="verticalMenuIndicator"
                                            className="absolute left-[-16px] top-1 bottom-1 w-[2px] bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)] z-20"
                                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                                        />
                                    )}

                                    {/* Amenity Label Text */}
                                    <span className={`text-[13px] tracking-wide transition-all duration-200 z-10 ${isItemActive
                                        ? 'text-white font-medium pl-1'
                                        : 'text-white/70 group-hover:text-white pl-0'
                                        }`}>
                                        {menuItem.name}
                                    </span>
                                </div>
                            );
                        })}
                    </LayoutGroup>
                </div>
            </motion.div>

            {/* 6. Precision Canvas Dynamic Zoom Controls Widget */}
            <div className="absolute bottom-12 right-[8%] flex items-center gap-3 z-50">
                {/* Zoom Out Button */}
                <button
                    onClick={() => handleZoom('out')}
                    disabled={zoomStep === -2}
                    className={`w-9 h-9 rounded-full bg-[#160f0a]/80 border border-white/10 text-white/80 flex items-center justify-center transition-all active:scale-95 shadow-md ${zoomStep === -2 ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'hover:text-white hover:bg-[#22170f] hover:border-white/20'
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                    </svg>
                </button>

                {/* Zoom In Button */}
                <button
                    onClick={() => handleZoom('in')}
                    disabled={zoomStep === 2}
                    className={`w-9 h-9 rounded-full font-bold flex items-center justify-center transition-all active:scale-95 shadow-lg ${zoomStep === 2
                        ? 'bg-neutral-700 text-neutral-500 opacity-40 cursor-not-allowed pointer-events-none'
                        : 'bg-[#fcd34d] text-[#160f0a] hover:bg-[#fbbf24] shadow-amber-500/10'
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </button>
            </div>





            <motion.button
                /* ── 1. ENTRANCE ANIMATION ── */
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, backgroundColor: "#3c2d11" }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}

                onClick={() => navigate(-1)}
                /* ── 2. EXACT STYLE & BOUNDS MATCH (64px x 64px roughly matches 16w/16h) ── */
                className="absolute bottom-20 left-[3.5%] z-50 w-12 h-12 rounded-full flex
               items-center justify-center border border-white/10 bg-[#6d4c22]/20
               backdrop-blur-sm transition-all duration-300 ease-out cursor-pointer group"
                style={{
                    boxShadow: "inset 0 1px 2px rgba(179,116,40, 0.03), 0 4px 12px rgba(0,0,0,0.2)"
                }}
                aria-label="Go back"
            >
                {/* ── 3. EXACT VISUAL MATCH CURVED ARROW SVG ── */}
                <img src={back} alt="back" className="object-contain w-[30%] h-[30%]" />
            </motion.button>

        </div >
    );
}
