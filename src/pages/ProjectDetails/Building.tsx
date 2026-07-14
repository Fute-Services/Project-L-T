// import { useCallback } from "react";
// import homeBgNight from "../../assets/images/home/home-background-night.png";
// import { motion } from 'framer-motion';

// export default function Building({ floorData, hoveredFloor, setHoveredFloor }: any) {
//   return (
//     <div className="relative w-full h-screen overflow-hidden bg-gray-900 flex items-center justify-center">

//       {/* 1. Background Image */}
//       <motion.img
//         src={homeBgNight}
//         alt="Building Skyline"
//         className="absolute inset-0 w-full h-full object-cover"
//         initial={{ scale: 1.05, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 1.5, ease: "easeOut" }}
//       />

//       {/* 2. Interactive SVG layer */}
//       <svg
//         viewBox="0 0 1982 1024"
//         preserveAspectRatio="xMidYMid slice"
//         className="absolute inset-0 w-full h-full z-20 pointer-events-auto"
//         aria-hidden="true"
//       >
//         <defs>
//           {floorData.map((f: any) => (
//             <linearGradient
//               key={f.gradientId}
//               id={f.gradientId}
//               x1="0%"
//               y1="0%"
//               x2="100%"
//               y2="0%"
//             >
//               <stop offset="0%" stopColor="#fac870" stopOpacity="0.10" />
//               <stop offset="45%" stopColor="#fac870" stopOpacity="0.25" />
//               <stop offset="50%" stopColor="#fac870" stopOpacity="0.35" />
//               <stop offset="68%" stopColor="#E8941A" stopOpacity="0.45" />
//               <stop offset="60%" stopColor="#E8941A" stopOpacity="0.55" />
//               <stop offset="78%" stopColor="#E8941A" stopOpacity="0.60" />
//               <stop offset="100%" stopColor="#fac870" stopOpacity="0.65" />
//             </linearGradient>
//           ))}
//         </defs>

//         {floorData.map((floor: any) => {
//           const isActive = hoveredFloor?.id === floor.id;
//           return (
//             <polygon
//               key={floor.id}
//               points={floor.polygon}
//               fill={isActive ? `url(#${floor.gradientId})` : "transparent"}
//               strokeOpacity={isActive ? 0.6 : 0}
//               className="cursor-pointer transition-all duration-300 outline-none"
//               style={{
//                 filter: isActive
//                   ? "drop-shadow(0 0 6px rgba(245,166,35,0.35))"
//                   : "none",
//               }}
//               onMouseEnter={() => setHoveredFloor(floor)}
//               onMouseLeave={() => setHoveredFloor(null)}
//             />
//           );
//         })}

//         {/* ── Tooltip embedded directly in the SVG coordinates ── */}
//         {hoveredFloor && (
//           <foreignObject
//             x={hoveredFloor.tooltipX}
//             y={hoveredFloor.tooltipY}
//             // Give it enough bounding box width/height to overflow without clipping
//             width="350"
//             height="150"
//             className="pointer-events-none overflow-visible"
//             style={{
//               // Align vertically center with the designated Y point
//               transform: "translateY(-50%)",
//             }}
//           >
//             {/* Standard HTML inside SVG */}
//             <div className="flex items-center pointer-events-none">
              
//               {/* Left-pointing arrow */}
//               <ArrowPointer />

//               {/* Glassmorphism Card */}
//               <div
//                 style={{
//                   backdropFilter: "blur(12px)",
//                   WebkitBackdropFilter: "blur(12px)",
//                   borderRadius: "1px",
//                 }}
//                 className="text-white font-sans bg-gradient-to-r from-[#F5C369]/50
//                            via-transparent to-transparent flex flex-col justify-center 
//                            gap-0.5 py-[9px] px-2 min-w-[100px] sm:min-w-[120px]"
//               >
//                 <span className="text-[9px] sm:text-[11px] font-medium tracking-wide leading-tight opacity-90">
//                   {hoveredFloor.name}
//                 </span>
//                 <span className="font-light text-[10px] sm:text-[12px] tracking-wide leading-tight text-white">
//                   {hoveredFloor.title}
//                 </span>
//               </div>

//             </div>
//           </foreignObject>
//         )}
//       </svg>
//     </div>
//   );
// }

// function ArrowPointer() {
//   return (
//     <div className="relative w-[22px] h-[36px] -ml-[1px] sm:w-[28px] sm:h-[45px] flex-shrink-0 z-10 flex items-center justify-center pointer-events-none">
//       <svg
//         viewBox="0 0 30 51"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//         className="w-full h-full"
//       >
//         <defs>
//           <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//             <stop offset="0%" stopColor="#F5C369" stopOpacity="0.95" />
//             <stop offset="60%" stopColor="#F5C369" stopOpacity="0.55" />
//             <stop offset="100%" stopColor="#F5C369" stopOpacity="0.2" />
//           </linearGradient>

//           <linearGradient id="arrowBorderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//             <stop offset="0%" stopColor="#F5A623" stopOpacity="0.8" />
//             <stop offset="100%" stopColor="rgba(245, 166, 35, 0.3)" />
//           </linearGradient>
//         </defs>

//         <path
//           d="M 0 27 L 30 0 L 30 54 Z"
//           fill="url(#arrowGradient)"
//           stroke="url(#arrowBorderGradient)"
//           strokeWidth="1"
//           strokeLinejoin="round"
//         />
//       </svg>
//     </div>
//   );
// }