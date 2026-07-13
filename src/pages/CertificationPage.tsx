import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import certificateBg from "../assets/images/certificate/certificate-bg.png";
import wellIcon from "../assets/images/certificate/well-icon.png";
import leadIcon from "../assets/images/certificate/lead-icon.png";
import logo2 from "../assets/logos/logo-outline-white.svg";
import LeftNavbar from "../components/navigation/LeftNavbar";
import RightNavbar from "../components/navigation/RightNavbar";

const CertificationPage = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isNight, setIsNight] = useState(true);

  useEffect(() => {
    // After 1.0s, the background image starts its slow zoom-in, the overlay fades, and the icons split
    const zoomTimer = setTimeout(() => {
      setIsZoomed(true);
    }, 1000);

    return () => {
      clearTimeout(zoomTimer);
    };
  }, []);

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

      {/* 2. Black Overlay (Fades out when zoom transition happens) */}
      <motion.div
        className="absolute inset-0 bg-black/20 z-[5] pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: isZoomed ? 0 : 1 }}
        transition={{ duration: 4.5, ease: [0.25, 1, 0.3, 1] }}
      />

      {/* 3. Top Left Logo */}
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

      {/* 4. Header Section */}
      <div className="absolute top-0 left-0 w-full text-center pt-8 z-10 select-none">
        <h1 className="text-white text-2xl lg:text-3xl font-extrabold tracking-widest uppercase font-sans">
          Certifications
        </h1>
      </div>

      {/* 5. Left Navbar Container */}
      <div className="fixed left-5 lg:left-16 top-[55%] lg:top-1/2 -translate-y-1/2 z-50">
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
              x: isZoomed ? "22vw" : "0px"
            }}
            transition={{
              duration: 4.0,
              ease: [0.25, 1, 0.3, 1],
              opacity: { duration: 1.0 }
            }}
            className="absolute w-[110px] h-[110px] md:w-[160px] md:h-[160px] lg:w-[260px] lg:h-[260px] pointer-events-auto select-none rounded-full overflow-hidden flex items-center justify-center"
            style={{
              // boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
            }}
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
              x: isZoomed ? "-22vw" : "0px"
            }}
            transition={{
              duration: 4.0,
              ease: [0.25, 1, 0.3, 1],
              opacity: { duration: 1.0 }
            }}
            className="absolute w-[110px] h-[110px] md:w-[160px] md:h-[160px] lg:w-[240px] lg:h-[240px] pointer-events-auto select-none rounded-full overflow-hidden flex items-center justify-center"
            style={{
              // boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
            }}
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