// import { motion } from 'framer-motion';

// interface FloorRow {
//   id: string | number;
//   tableName: string;
//   // Add other properties if needed
// }

// interface TableDataProps {
//   floorData: FloorRow[];
//   selectedRow: number | null;
//   setSelectedRow: (index: number) => void;
//   hoveredFloor: any; // Added missing hoveredFloor prop
// }

// export default function TableData({ floorData, selectedRow, setSelectedRow, hoveredFloor }: TableDataProps) {
//   return (
//     <>
//       <motion.div
//         initial={{ x: -120, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{
//           duration: 1,
//           ease: [0.22, 1, 0.36, 1],
//         }}
//         /* FIX 3: Cleaned positioning classes, fixed max-h bracket */
//         className="w-[300px] lg:w-[270px] h-[58vh] max-h-[580px] rounded-t-[30px] rounded-b-[5px]"
//         style={{
//           background: "linear-gradient(180deg, rgba(70,65,62,.68) 0%, rgba(35,32,30,.62) 100%)",
//           backdropFilter: "blur(26px)",
//           WebkitBackdropFilter: "blur(26px)",
//           border: "1px solid rgba(255,255,255,.08)",
//           boxShadow: "0 35px 80px rgba(0,0,0,.45), inset 0 1px rgba(255,255,255,.06)",
//         }}
//       >
//         {/* Header */}
//         <div className="px-6 pt-3 pb-1">
//           <div className="flex items-center h-10 text-[10px] text-white/90 tracking-wide font-sans font-medium uppercase">
//             <div className="w-[40%] text-center">Floor</div>
//             <div className="w-px h-6 bg-white/15" />
//             <div className="flex-1 text-center">Tower</div>
//           </div>
//         </div>

//         {/* Table Area */}
//         <div className="px-2 pb-3 h-[calc(100%-60px)] text-[10px]">
//           <div className="border border-white/10 h-full rounded-[4px] overflow-hidden">
//             <div className="h-full overflow-y-auto custom-scrollbar">
//               {floorData.map((row, index) => {
//                 const active = hoveredFloor?.id === row.id || selectedRow === index;

//                 return (
//                   <div
//                     key={row.id || index}
//                     onClick={() => setSelectedRow(index)}
//                     /* FIX 4: Changed 'h-[8%]' to a stable static height like 'h-10' (40px) 
//                        to ensure scroll performance is predictable and clean */
//                     className="relative flex items-center h-10 border-b border-white/10 cursor-pointer group overflow-hidden last:border-b-0"
//                   >
//                     {/* Active Row Background */}
//                     {active && (
//                       <motion.div
//                         layoutId="activeFloor"
//                         className="absolute inset-0 bg-[#F7C46A]"
//                         transition={{
//                           type: "spring",
//                           stiffness: 420,
//                           damping: 36,
//                         }}
//                       />
//                     )}

//                     {/* Hover State Background */}
//                     {!active && (
//                       <div className="absolute inset-0 bg-transparent group-hover:bg-white/[0.03] transition-colors duration-300" />
//                     )}

//                     {/* Floor Column */}
//                     <div
//                       className={`relative font-sans z-10 w-[40%] flex items-center justify-center text-[10px] tracking-wide transition-colors ${
//                         active ? "text-[#3d2c16] font-semibold" : "text-white/80"
//                       }`}
//                     >
//                       {row.tableName}
//                     </div>

//                     {/* Column Divider */}
//                     {!active && (
//                       <div className="relative z-10 w-px self-stretch bg-white/10" />
//                     )}

//                     {/* Tower Area Metrics */}
//                     <div className="relative z-10 flex-1 flex h-full">
//                       {!active && (
//                         <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />
//                       )}

//                       {/* Carpet Space Metric */}
//                       <div
//                         className={`w-1/2 flex font-sans items-center justify-center text-[10px] transition-colors ${
//                           active ? "text-[#3d2c16] font-semibold" : "text-white/75"
//                         }`}
//                       >
//                         12000 sqft
//                       </div>

//                       {/* Saleable Space Metric */}
//                       <div
//                         className={`w-1/2 flex font-sans items-center justify-center text-[10px] transition-colors ${
//                           active ? "text-[#3d2c16] font-semibold" : "text-white/75"
//                         }`}
//                       >
//                         36000 sqft
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* Global styling for clean scrollbars */}
//         <style>{`
//           .custom-scrollbar::-webkit-scrollbar {
//             width: 4px;
//           }
//           .custom-scrollbar::-webkit-scrollbar-track {
//             background: transparent;
//           }
//           .custom-scrollbar::-webkit-scrollbar-thumb {
//             background: rgba(255,255,255,.08);
//             border-radius: 20px;
//           }
//           .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//             background: rgba(255,255,255,.18);
//           }
//         `}</style>
//       </motion.div>
//     </>
//   );
// }