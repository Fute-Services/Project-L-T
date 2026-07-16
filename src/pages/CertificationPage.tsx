import { useState, useEffect } from "react";
import { motion } from "framer-motion";
const certificateBg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/03d6e841-c126-4feb-306a-2be0866ee600/public";
const wellIcon = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/448c4daa-c063-4a12-b792-cc5d52bb4700/public";
const leadIcon = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/3caab12e-6b86-4e61-4a40-856aa65efe00/public";
const newLogo = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/abe60fc8-d31a-482c-276d-74b273dcc700/public";
import LeftNavbar from "../components/navigation/LeftNavbar";
import RightNavbar from "../components/navigation/RightNavbar";

const CertificationPage = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isNight, setIsNight] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // After 1.0s, the background image starts its slow zoom-in, the overlay fades, and the icons split
    const zoomTimer = setTimeout(() => {
      setIsZoomed(true);
    }, 1000);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(zoomTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Determine translation x based on screen width
  const getXTranslation = (direction: "left" | "right") => {
    if (!isZoomed) return "0px";
    
    let offset = "8vw"; // Default for large desktop
    if (windowWidth < 640) {
      offset = "15vw"; // Mobile L / portrait mobile
    } else if (windowWidth < 1024) {
      offset = "13vw"; // Tablet / Portrait view
    }
    
    return direction === "left" ? `-${offset}` : offset;
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#0a0d12]">
      {/* 1. Background Image */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <motion.img
          src={certificateBg}
          alt="Certification Background"
          className="absolute inset-0 w-full h-full object-fill"
          style={{ transformOrigin: "center 4%" }}
          initial={{ scale: 1.0 }}
          animate={{ scale: isZoomed ? 1.85 : 1.0 }}
          transition={{ duration: 4.5, ease: [0.25, 1, 0.3, 1] }}
        />
      </div>

      {/* 2. Black Overlay (Stays permanently) */}
      <div className="absolute inset-0 bg-black/20 z-[5] pointer-events-none" />

      {/* 3. Top Left Logo */}
      <div className="absolute z-20 top-4 left-4 sm:top-8 sm:left-10 select-none pointer-events-none">
        <img
          src={newLogo}
          alt="Logo"
          className="h-8 sm:h-14 w-auto object-contain"
        />
      </div>

      {/* 4. Header Section */}
      <div className="absolute top-0 left-0 w-full text-center pt-16 sm:pt-8 z-10 select-none">
        <h1 className="text-white text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-widest uppercase font-sans">
          Certifications
        </h1>
      </div>

      {/* 5. Left Navbar Container */}
      <div className="fixed left-5 sm:left-10 md:left-12 lg:left-16 top-[55%] lg:top-1/2 -translate-y-1/2 z-50">
        <LeftNavbar />
      </div>

      {/* 6. Right Navbar Container */}
      <div className="fixed right-5 lg:right-10 top-[55%] lg:top-1/2 -translate-y-1/2 z-50">
        <RightNavbar isNight={isNight} setIsNight={setIsNight} />
      </div>

      {/* 7. Center Certification Icons (WELL and LEED with split animation) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* LEED Certification Icon (Rendered first, sits UNDERNEATH) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: "0px" }}
            animate={{
              opacity: 1,
              scale: 1.0,
              x: getXTranslation("right")
            }}
            transition={{
              duration: 4.0,
              ease: [0.25, 1, 0.3, 1],
              opacity: { duration: 1.0 }
            }}
            className="absolute w-[90px] h-[90px] sm:w-[130px] sm:h-[130px] md:w-[140px] md:h-[140px] lg:w-[200px] lg:h-[200px] pointer-events-auto select-none rounded-full overflow-hidden flex items-center justify-center"
          >
            <img
              src={leadIcon}
              alt="LEED Certification"
              className="w-full h-full object-contain"
            />
          </motion.div>

          {/* WELL Certification Icon (Rendered second, sits ON TOP) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: "0px" }}
            animate={{
              opacity: 1,
              scale: 1.0,
              x: getXTranslation("left")
            }}
            transition={{
              duration: 4.0,
              ease: [0.25, 1, 0.3, 1],
              opacity: { duration: 1.0 }
            }}
            className="absolute w-[90px] h-[90px] sm:w-[130px] sm:h-[130px] md:w-[140px] md:h-[140px] lg:w-[180px] lg:h-[180px] pointer-events-auto select-none rounded-full overflow-hidden flex items-center justify-center"
          >
            <img
              src={wellIcon}
              alt="WELL Certification"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CertificationPage;