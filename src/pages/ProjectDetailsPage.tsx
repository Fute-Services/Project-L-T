import { useState } from "react";
import { motion } from "framer-motion";
import homeBgNight from "../assets/images/home/home-background-night.png";
import logo2 from "../assets/logos/logo-outline-white.svg";
import LeftNavbar from "../components/navigation/LeftNavbar";

interface FloorRecord {
  floor: number;
  carpetArea: string;
  saleableArea: string;
}

const ProjectDetailsPage = () => {
  const [selectedRow, setSelectedRow] = useState<number | null>(5); // Highlight 6th row by default

  // Create mock floor schedule data
  const floorData: FloorRecord[] = Array.from({ length: 20 }, (_, i) => ({
    floor: i + 1,
    carpetArea: "12000 sqft",
    saleableArea: "36000 sqft",
  }));

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#0a0d12]">
      {/* 1. Background Image */}
      <motion.img
        src={homeBgNight}
        alt="Night Skyline"
        className="absolute inset-0 w-full h-full object-fill z-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1.0, opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      />

      {/* 2. Top Left Logo */}
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

      {/* 3. Left Navbar Container */}
      <div className="fixed left-5 lg:left-16 top-[55%] lg:top-1/2 -translate-y-1/2 z-50">
        <LeftNavbar />
      </div>

      {/* 4. Translucent Data Box (Left Side Center) */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "tween", ease: [0.25, 1, 0.5, 1], duration: 1.2, delay: 0.4 }}
        className="fixed left-[75px] lg:left-[160px] top-[15%] lg:top-[15%] -translate-y-1/2 z-40 w-[320px] lg:w-[400px] h-[65vh] max-h-[550px] flex flex-col rounded-3xl overflow-hidden border border-white/10"
        style={{
          background: "linear-gradient(155deg, rgba(30, 20, 10, 0.45) 0%, rgba(10, 10, 10, 0.6) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Table Header Wrapper */}
        <div className="px-6 pt-6 pb-2 border-b border-white/10">
          <div className="flex text-white/50 text-[10px] lg:text-xs font-semibold tracking-widest uppercase">
            <div className="w-[30%] text-left pl-2">Floor</div>
            <div className="w-[70%] text-center">Tower</div>
          </div>
          {/* Subheaders underneath if needed, or spacing */}
          <div className="flex text-[8px] lg:text-[10px] text-white/40 mt-1 font-medium tracking-wide uppercase">
            <div className="w-[30%]"></div>
            <div className="w-[35%] text-center">Carpet Area</div>
            <div className="w-[35%] text-center">Saleable Area</div>
          </div>
        </div>

        {/* Table Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-2 py-3 custom-scrollbar">
          <div className="flex flex-col gap-0.5">
            {floorData.map((row, index) => {
              const isSelected = selectedRow === index;
              return (
                <div
                  key={row.floor}
                  onClick={() => setSelectedRow(index)}
                  className="group relative flex items-center py-2.5 px-4 rounded-xl cursor-pointer transition-all duration-300 select-none"
                >
                  {/* Selected/Hover Glow effect background */}
                  {isSelected && (
                    <motion.div
                      layoutId="activeRowGlow"
                      className="absolute inset-0 rounded-xl z-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(230, 185, 100, 0) 0%, rgba(230, 185, 100, 0.15) 20%, rgba(230, 185, 100, 0.2) 50%, rgba(230, 185, 100, 0.15) 80%, rgba(230, 185, 100, 0) 100%)",
                        boxShadow: "inset 0 0 12px rgba(230, 185, 100, 0.05)",
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Hover visual cue */}
                  <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/5 transition-colors duration-300 z-0 pointer-events-none" />

                  {/* Floor cell */}
                  <div className="w-[30%] text-left font-sans text-xs lg:text-sm font-semibold tracking-wider text-white/80 z-10 transition-colors group-hover:text-white pl-2">
                    {row.floor}
                  </div>

                  {/* Carpet Area cell */}
                  <div className="w-[35%] text-center font-sans text-xs lg:text-sm text-white/70 z-10 transition-colors group-hover:text-white/90">
                    {row.carpetArea}
                  </div>

                  {/* Saleable Area cell */}
                  <div className="w-[35%] text-center font-sans text-xs lg:text-sm text-white/70 z-10 transition-colors group-hover:text-white/90">
                    {row.saleableArea}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Styled scrollbar CSS inject */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </div>
  );
};

export default ProjectDetailsPage;
