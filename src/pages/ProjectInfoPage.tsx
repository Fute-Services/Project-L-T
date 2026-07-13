import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bgImage from "../assets/images/project-specification/background.png";
import buildingImg from "../assets/images/project-specification/building.png";
import transLogo from "../assets/images/project-specification/transparent-logo.png";
import logo2 from "../assets/logos/logo-outline-white.svg";
import LeftNavbar from "../components/navigation/LeftNavbar";
import img1 from "../assets/images/project-specification/well-certification-badge.png";
import img2 from "../assets/images/project-specification/leed-platinum-badge.png";

const ProjectInfoPage = () => {
  const [isZoomed, setIsZoomed] = useState(true);
  const [showOverlays, setShowOverlays] = useState(false);

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
            className="absolute z-20 top-8 left-10 flex items-center gap-4 select-none pointer-events-none"
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Left Navbar Container */}
      <AnimatePresence>
        {showOverlays && (
          <div className="fixed left-5 lg:left-16 top-[55%] lg:top-1/2 -translate-y-1/2 z-50">
            <LeftNavbar />
          </div>
        )}
      </AnimatePresence>

      {/* Foreground Skyscraper Overlay - Positioned above list but below navbar */}
      <img
        src={buildingImg}
        alt="Skyscraper Building"
        className="absolute left-[15%] bottom-10 h-[70%] lg:h-[92%] w-[220px] lg:w-[260px] z-[45] pointer-events-none transition-opacity duration-1000 ease-out"
        style={{ opacity: showOverlays ? 1 : 0 }}
      />

      {/* 5. Center Specifications List */}
      <AnimatePresence>
        {showOverlays && (
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 1.5, ease: [0.25, 1, 0.28, 1], delay: 0.3 }}
            className="fixed left-[75px] lg:left-[485px] top-[30%] lg:top-[15%] -translate-y-1/2 z-40 w-[300px] lg:w-[480px] flex flex-col gap-4 lg:gap-5"
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
      <AnimatePresence>
        {showOverlays && (
          <motion.div
            initial={{ opacity: 0, x: 50, y: "-50%" }}
            animate={{ opacity: 1, x: 0, y: "-50%" }}
            exit={{ opacity: 0, x: 50, y: "-50%" }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
            className="fixed right-10 lg:right-24 top-1/2 z-40 w-[80px] lg:w-[100px] flex flex-col items-center gap-3 lg:gap-4 py-4 lg:py-5 px-1.5 rounded-full border"
            style={{
              background: "linear-gradient(180deg, rgba(165, 130, 85, 0.25) 0%, rgba(135, 105, 65, 0.25) 50%, rgba(105, 80, 50, 0.25) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "5px solid rgba(30, 25, 20, 0.15)",

            }}
          >
            {/* WELL Certification Badge */}
            <div className="group cursor-pointer">
              <img
                src={img1}
                alt="WELL Certification"
                className="w-13 h-13 lg:w-[82px] lg:h-[82px] object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Divider */}
            <div className="w-[70%] h-[1px] bg-white/20" />

            {/* LEED Platinum Badge */}
            <div className="group cursor-pointer">
              <img
                src={img2}
                alt="LEED Platinum Certification"
                className="w-13 h-13 lg:w-[82px] lg:h-[82px] object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Divider */}
            <div className="w-[70%] h-[1px] bg-white/20" />

            {/* High OPEX Savings Text */}
            <div className="px-1 w-full text-center">
              <p className="text-[7px] lg:text-[8px] font-sans font-semibold tracking-tight text-white leading-none whitespace-nowrap">
                High OPEX Savings
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectInfoPage;
