import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
const bgImage = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/42f430b2-5126-4f70-c275-c805a8234e00/public";
const buildingImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/19045808-fdfc-4c55-b5cf-72e2b0627000/public";
const transLogo = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/a78f6c68-fcf5-4d49-e5be-2fafd2d42800/public";
const newLogo = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/abe60fc8-d31a-482c-276d-74b273dcc700/public";
import LeftNavbar from "../components/navigation/LeftNavbar";
import RightNavbar from "../components/navigation/RightNavbar";

const ProjectInfoPage = () => {
  const [isZoomed, setIsZoomed] = useState(true);
  const [showOverlays, setShowOverlays] = useState(false);
  const [isNight, setIsNight] = useState(true);

  useEffect(() => {
    // Zoom transition lasts for 2.5s, start showing details at 1.2s
    const zoomTimer = setTimeout(() => {
      setIsZoomed(false);
    }, 1200);

    const overlayTimer = setTimeout(() => {
      setShowOverlays(true);
    }, 3700);

    return () => {
      clearTimeout(zoomTimer);
      clearTimeout(overlayTimer);
    };
  }, []);

  const specData = [
    {
      title: "Building Structure",
      value: "3 B + G + 6P + 21 Office Floors"
    },
    {
      title: "Elevators/ Tower",
      value: "Passengers - 12 Service - 1 Fire - 1"
    },
    {
      title: "Building Efficiency",
      value: "60%"
    },
    {
      title: "Column Grid",
      value: "~11m x 11m"
    },
    {
      title: "Car Parking",
      value: "450+"
    }
  ];

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#0a0d12]">
      {/* 1. Background Image Layer */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <motion.img
          src={bgImage}
          alt="Project Specification Background"
          className="absolute inset-0 w-full h-full object-fill"
          style={{ transformOrigin: "33% top" }}
          initial={{ scale: 1.95 }}
          animate={{ scale: isZoomed ? 1.95 : 1.0 }}
          transition={{ duration: 2.5, ease: [0.25, 1, 0.28, 1] }}
        />
      </div>

      {/* 2. Transparent Logo Overlay in the Sky */}
      <motion.img
        src={transLogo}
        alt="L&T Transparent Logo"
        className="absolute pointer-events-none z-10"
        style={{
          width: "50%",
          maxWidth: "550px",
          height: "auto",
          top: "50%",
          left: "50%",
          transformOrigin: "center center"
        }}
        initial={{
          opacity: 0.5,
          scale: 1.95,
          x: "15%",
          y: "-50%",
        }}
        animate={{
          opacity: isZoomed ? 0.5 : 0.85,
          scale: isZoomed ? 1.95 : 1.0,
          x: isZoomed ? "15%" : "22vw",
          y: "-50%",
        }}
        transition={{
          duration: 2.5,
          ease: [0.25, 1, 0.28, 1]
        }}
      />

      {/* 3. Top Left Logo */}
      <AnimatePresence>
        {showOverlays && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="absolute z-20 top-8 left-10 select-none pointer-events-none"
          >
            <img
              src={newLogo}
              alt="Logo"
              style={{
                height: '56px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Left Navbar Container */}
      <AnimatePresence>
        {showOverlays && (
          <div className="fixed left-5 sm:left-10 md:left-12 lg:left-16 top-[55%] lg:top-1/2 -translate-y-1/2 z-50">
            <LeftNavbar />
          </div>
        )}
      </AnimatePresence>

      {/* Right Navbar Container */}
      <AnimatePresence>
        {showOverlays && (
          <div className="fixed right-5 lg:right-10 top-[55%] lg:top-1/2 -translate-y-1/2 z-50">
            <RightNavbar isNight={isNight} setIsNight={setIsNight} />
          </div>
        )}
      </AnimatePresence>

      {/* Foreground Skyscraper Overlay - Positioned above list but below navbar */}
      <img
        src={buildingImg}
        alt="Skyscraper Building"
        className="absolute left-[20%] bottom-[14%] h-[70%] lg:h-[84%] w-[220px] lg:w-[285px] z-[75] pointer-events-none transition-opacity duration-1000 ease-out"
        style={{ opacity: showOverlays ? 1 : 0 }}
      />

      {/* 5. Center Specifications List */}
      <AnimatePresence>
        {showOverlays && (
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 1.5, ease: [0.25, 1, 0.28, 1], delay: 0. }}
            className="fixed left-[75px] sm:left-[105px] md:left-[105px] lg:left-[576px] top-[30%] lg:top-[15%] -translate-y-1/2 z-40 w-[300px] lg:w-[480px] flex flex-col gap-4 lg:gap-5"
          >
            {specData.map((item) => (
              <div
                key={item.title}
                className="flex flex-col select-none"
              >
                {/* 1. Title bar with gold background */}
                <div
                  className="h-[28px] lg:h-[34px] pl-4 pr-10 flex items-center rounded-r-md"
                  style={{
                    background: "linear-gradient(90deg, rgba(255, 216, 125, 0.81) 0%, rgba(255, 202, 106, 0.00) 100%)",
                    backdropFilter: "blur(0px)",
                    WebkitBackdropFilter: "blur(0px)",
                  }}
                >
                  <span className="text-white text-xs lg:text-[16px]  tracking-wider font-sans">
                    {item.title}
                  </span>
                </div>

                {/* 2. Value bar with dark translucent background */}
                <div
                  className="h-[28px] lg:h-[34px] pl-4 pr-10 flex items-center rounded-r-md mt-[8px] lg:mt-[10px]"
                  style={{
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  <span className="text-white text-[10px] lg:text-[16px] font-sans font-medium tracking-wide">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Right Side Badges Pill */}

    </div>
  );
};

export default ProjectInfoPage;