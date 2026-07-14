import { useCallback, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const homeBgNight = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/c4bab2ee-9d5c-481f-9fd3-bad2e4198c00/public";
import logo2 from "../assets/logos/logo-outline-white.svg";
import LeftNavbar from "../components/navigation/LeftNavbar";
import { useNavigate } from "react-router-dom";
interface FloorData {
  id: number;
  name: string;
  title: string;
  sqft: string;
  gradientId: string;
  polygon: string; // SVG polygon coordinates (e.g. "x1,y1 x2,y2 x3,y3...")
  tooltipX: number; // Tooltip X position (as %)
  tooltipY: number; // Tooltip Y position (as %)
  temp: string;
  tableName: string;
  Tooltip_name: string;
}
const ProjectDetailsPage = () => {
  const [selectedRow] = useState<number | null>(); // Highlight 6th row by default
  const [hoveredFloor, setHoveredFloor] = useState<FloorData | null>(null);
  // const [selectedRow, setSelectedRow] = useState<number | null>(5);

  const svgToPercent = useCallback(
    (svgX: number, svgY: number) => ({
      x: (svgX / 1982) * 100,
      y: (svgY / 1024) * 100,
    }),
    []
  );
  // Create mock floor schedule data
  const floorData = [
    {
      id: 1,temp:"21st Floor - Business Lounge ", tableName: "21st", name: "Floor 21", gradientId: "grad10", title: "Business Lounge",
      Tooltip_name: "21", tooltipX: 1470, sqft: "12000 sqft",
      tooltipY: 165,
      polygon: "1180,216,1367,130,1412,158,1441,175,1441,201,1365,161,1310,180,1256,207,1180,241",
    },
    {
      id: 2,temp:"20th Floor - Office Stack ", tableName: "20th", name: "Floor 20", gradientId: "grad10", title: "Office Stack",
      tooltipX: 1471, sqft: "12000 sqft",
      tooltipY: 186,
      Tooltip_name: "20", polygon: "1180,242,1318,178,1365,155,1442,197,1442,223,1361,183,1180,262",
    },
    {
      id: 3, temp:"19th Floor - Office Stack ",tableName: "19th", name: "Floor 19", gradientId: "grad10", title: "Office Stack",
      tooltipX: 1470, sqft: "12000 sqft",
      tooltipY: 210,
      Tooltip_name: "19", polygon: "1180,258,1360,181,1442,220,1442,246,1361,208,1250,253,1180,281",
    },
    {
      id: 4, temp:"18th Floor - Office Stack ",tableName: "18th", name: "Floor 18", gradientId: "grad10", title: "Office Stack",
      tooltipX: 1471, sqft: "12000 sqft",
      tooltipY: 225,
      Tooltip_name: "18", polygon: "1181,279,1365,199,1442,235,1442,261,1368,225,1347,232,1290,255,1180,301",
    },
    {
      id: 5,temp:"17th Floor - Office Stack ", tableName: "17th", name: "Floor 17", gradientId: "grad10", title: "Office Stack",
      tooltipX: 1472, sqft: "12000 sqft",
      tooltipY: 248,
      Tooltip_name: "17", polygon: "1183,294,1365,221,1442,257,1442,283,1368,247,1347,254,1288,275,1181,314",
    },
    {
      id: 6,temp:"16th Floor - Office Stack ", tableName: "16th", name: "Floor 16", gradientId: "grad10", title: "Office Stack",
      tooltipX: 1473, sqft: "12000 sqft",
      tooltipY: 265,
      Tooltip_name: "18", polygon: "1180,311,1365,239,1439,274,1439,300,1365,267,1326,279,1276,296,1180,333",
    },
    {
      id: 7,temp:"15th Floor - Office Stack ",tableName: "15th", name: "Floor 15", gradientId: "grad10", title: "Office Stack",
      tooltipX: 1474, sqft: "12000 sqft",
      tooltipY: 284,
      Tooltip_name: "15", polygon: "1183,329,1370,261,1442,292,1442,318,1368,289,1365,289,1272,321,1181,354",
    },
    {
      id: 8,temp:"14th Floor - Office Stack ", tableName: "14th", name: "Floor 14", gradientId: "grad10", title: "Office Stack",
      tooltipX: 1472, sqft: "12000 sqft",
      tooltipY: 305,
      Tooltip_name: "14", polygon: "1183,349,1370,281,1442,312,1442,338,1368,309,1365,309,1272,341,1181,374",
    },
    {
      id: 9,temp:"13th Floor - Office Stack ", tableName: "13th", name: "Floor 13", gradientId: "grad10", title: "Office Stack",
      tooltipX: 1473, sqft: "12000 sqft",
      tooltipY: 325, Tooltip_name: "13", polygon: "1183,367,1368,302,1442,330,1442,356,1368,327,1365,327,1272,359,1181,394",
    },
    {
      id: 10,temp:"12th Floor - Office Stack ", tableName: "12th", name: "Floor 12", gradientId: "grad10", title: "Office Stack",
      tooltipX: 1475, sqft: "12000 sqft",
      tooltipY: 355,
      Tooltip_name: "12", polygon: "1181,389,1368,326,1442,354,1442,380,1368,351,1365,351,1270,382,1181,412",
    },
    {
      id: 11,temp:"11th Floor - Office Stack ", tableName: "11th", name: "Floor 11", gradientId: "grad10", title: "Office Stack",
      tooltipX: 1475, sqft: "12000 sqft",
      tooltipY: 377,
      Tooltip_name: "11", polygon: "1181,407,1367,349,1442,380,1442,402,1367,373,1351,375,1270,400,1180,431",
    },
    {
      id: 12,temp:"10th Floor - Office Stack ", tableName: "10th", name: "Floor 10", gradientId: "grad10", title: "Office Stack",
      tooltipX: 1476, sqft: "12000 sqft",
      tooltipY: 395,
      Tooltip_name: "10", polygon: "1181,423,1365,368,1442,396,1442,418,1367,389,1351,391,1270,416,1181,443",
    },
    {
      id: 13,temp:"9th Floor - Office Stack ", tableName: "9th", name: "Floor 9", gradientId: "grad10", title: "Office Stack",
      tooltipX: 1475, sqft: "12000 sqft",
      tooltipY: 410,
      Tooltip_name: "9", polygon: "1181,439,1365,388,1442,412,1442,434,1365,412,1332,419,1267,434,1181,459 ",
    },
    {
      id: 14,temp:"8th Floor - Office Stack ", tableName: "8th", name: "Floor 8", gradientId: "grad10",
      tooltipX: 1474, sqft: "12000 sqft",
      tooltipY: 439,
      title: "Office Stack",
      Tooltip_name: "8", polygon: " 1181,454,1363,408,1440,432,1440,454,1363,432,1330,439,1265,454,1181,475",
    },
    {
      id: 15,temp:"7th Floor - Office Stack ", tableName: "7th", name: "Floor 7", gradientId: "grad10",
      tooltipX: 1475, sqft: "12000 sqft",
      tooltipY: 455,
      title: "Office Stack", Tooltip_name: "7", polygon: "1181,474,1363,428,1440,452,1440,474,1363,452,1330,459,1265,474,1181,495 ",
    },
    {
      id: 16, temp:"6th Floor - Office Stack ",tableName: "6th", name: "Floor 6", gradientId: "grad10",
      tooltipX: 1475, sqft: "12000 sqft",
      tooltipY: 485,
      title: "Office Stack", Tooltip_name: "6", polygon: "1181,498,1363,452,1440,476,1440,498,1363,476,1330,483,1265,498,1181,519 ",
    },
    {
      id: 17,temp:"5th Floor - Office Stack ", tableName: "5th", name: "Floor 5", gradientId: "grad10",
      tooltipX: 1475, sqft: "12000 sqft",
      tooltipY: 500,
      title: "Office Stack", Tooltip_name: "5", polygon: "1181,517,1363,471,1440,495,1440,517,1363,495,1330,502,1265,517,1181,538 ",
    },
    {
      id: 18,temp:"4th Floor - Office Stack ", tableName: "4th", name: "Floor 4", gradientId: "grad10", title: "Office Stack",
      tooltipX: 1475, sqft: "12000 sqft",
      tooltipY: 530,
      Tooltip_name: "4", polygon: "1185,529,1361,494,1438,518,1438,540,1361,518,1328,525,1262,534,1183,550 ",
    },
    {
      id: 19,temp:"3rd Floor - Office Stack ", tableName: "3rd", name: "Floor 3", gradientId: "grad10", title: "Office Stack",
      tooltipX: 1475, sqft: "12000 sqft",
      tooltipY: 550,
      Tooltip_name: "3", polygon: " 1185,547,1361,512,1438,536,1438,558,1361,536,1328,543,1262,552,1183,568",
    },
    {
      id: 20,temp:"2nd Floor - Office Stack ", tableName: "2nd", name: "Floor 2", gradientId: "grad10", title: "Office Stack",
      tooltipX: 1475, sqft: "12000 sqft",
      tooltipY: 573,
      Tooltip_name: "2", polygon: "1180,567,1362,533,1439,557,1439,579,1362,557,1329,564,1263,573,1180,587 ",
    },
    {
      id: 21,temp:"1st Floor - Lobby + Amenities", tableName: "1st", name: "Floor 1", gradientId: "grad10", title: "Lobby + Amenities",
      tooltipX: 1474, sqft: "12000 sqft",
      tooltipY: 600,
      Tooltip_name: "1", polygon: " 1183,591,1365,557,1442,581,1442,603,1365,581,1332,588,1266,597,1183,611",
    },
    {
      id: 22,temp:"Podium-6", tableName: "P6", name: "P6", 
      gradientId: "grad10", title: "Podium-6",
      tooltipX: 1473, sqft: "12000 sqft",
      tooltipY: 613,
      Tooltip_name: "P6", polygon: "1181,609,1365,579,1440,599,1440,621,1363,602,1330,606,1264,615,1181,629 ",
    },
    {
      id: 23, temp:"Podium-5",tableName: "P5", name: "P5", gradientId: "grad10", title: "Podium-5",
      tooltipX: 1472, sqft: "12000 sqft",
      tooltipY: 623,
      Tooltip_name: "P5", polygon: "1185,620,1354,604,1440,608,1440,630,1354,627,1319,629,1253,634,1185,640",
    },
    {
      id: 24,temp:"Podium-4", tableName: "P4", name: "P4", gradientId: "grad10", title: "Podium-4",
      tooltipX: 1472, sqft: "12000 sqft",
      tooltipY: 650,
      Tooltip_name: "P4", polygon: "1185,639,1354,623,1438,630,1438,653,1354,646,1319,648,1253,653,1185,659",
    },
    {
      id: 25,temp:"Podium-3", tableName: "P3", name: "P3", gradientId: "grad10", title: "Podium-3",
      tooltipX: 1472, sqft: "12000 sqft",
      tooltipY: 668,
      Tooltip_name: "P3", polygon: "1185,653,1354,639,1438,644,1438,667,1360,662,1319,662,1253,667,1185,673 ",
    },
    {
      id: 26,temp:"Podium-2", tableName: "P2", name: "P2", gradientId: "grad10", title: "Podium-2",
      tooltipX: 1472, sqft: "12000 sqft",
      tooltipY: 679,
      Tooltip_name: "P2", polygon: " 1183,671,1363,655,1440,660,1440,685,1363,679,1326,679,1267,683,1185,692",
    },
    {
      id: 27,temp:"Podium-1", tableName: "P1", name: "P1", gradientId: "grad10", title: "Podium-1",
      tooltipX: 1471, sqft: "12000 sqft",
      tooltipY: 706,
      Tooltip_name: "P1", polygon: "1183,684,1360,676,1440,681,1440,698,1356,695,1326,695,1267,696,1183,702 ",
    },
    {
      id: 28,temp:"Ground Floor", tableName: "G", name: "G", gradientId: "grad10", title: "Ground Floor",
      tooltipX: 1474, sqft: "12000 sqft",
      tooltipY: 765,
      Tooltip_name: "Ground", polygon: "1173,702,1365,695,1445,702,1445,737,1442,761,1442,781,1440,816,1435,819,1395,823,1309,825,1251,828,1208,825,1183,821,1181,793,1173,774,1178,757",
    },
    // {
    //   id: 29, name: "Basement 1", gradientId: "grad10", title: "Basement 1",
    //   tooltipX: 68, sqft: "12000 sqft",
    //   tooltipY: 26,
    //   Tooltip_name: "Basement 1", polygon: " ",
    // },
    // {
    //   id: 30, name: "Basement 2", gradientId: "grad10", title: "Basement 2",
    //   tooltipX: 68, sqft: "12000 sqft",
    //   tooltipY: 26,
    //   Tooltip_name: "Basement 2", polygon: " ",
    // },
    // {
    //   id: 31, name: "Basement 3", gradientId: "grad10", title: "Basement 3",
    //   tooltipX: 68, sqft: "12000 sqft",
    //   tooltipY: 26,
    //   Tooltip_name: "Basement 3", polygon: " ",
    // },
  ]

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!hoveredFloor) return;

    const row = rowRefs.current[hoveredFloor.id];
    const container = tableContainerRef.current;

    if (!row || !container) return;

    // getBoundingClientRect gives positions relative to the viewport.
    // Subtracting the container's top and adding scrollTop converts
    // that into a position relative to the scrollable content.
    const rowRect = row.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const rowTopRelative = rowRect.top - containerRect.top + container.scrollTop;
    const rowCenterRelative = rowTopRelative - container.clientHeight / 2 + rowRect.height / 2;

    // Only scroll if the row is outside the visible area
    const isAbove = rowRect.top < containerRect.top;
    const isBelow = rowRect.bottom > containerRect.bottom;

    if (isAbove || isBelow) {
      container.scrollTo({
        top: rowCenterRelative,
        behavior: "smooth",
      });
    }
  }, [hoveredFloor]);

const navigate=useNavigate();

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#0a0d12]">
      {/* 1. Background Image */}
      <div className="relative w-full h-screen overflow-hidden bg-gray-900 flex items-center justify-center">

        {/* 1. Hình nền tòa nhà */}
        <motion.img
          src={homeBgNight}// Thay bằng đường dẫn ảnh của bạn
          alt="Building Skyline"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* 2. Lớp SVG vẽ vùng Highlight */}
        {/* ── Interactive SVG layer ── */}
        <svg
          viewBox={`0 0 1982 1024`}
          /* FIX 3: Changed from 'none' to 'xMidYMid slice'. 
            This forces the SVG vector layer to crop and scale exactly like the 'object-cover' image above,
            keeping coordinates seamlessly pinned together on mobile, tablets, and desktops.
          */
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full z-20 pointer-events-auto"
          aria-hidden="true"
        >
          <defs>
            {floorData.map((f) => (
              <linearGradient
                key={f.gradientId}
                id={f.gradientId}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#fac870" stopOpacity="0.10" />
                <stop offset="45%" stopColor="#fac870" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#fac870" stopOpacity="0.35" />
                <stop offset="68%" stopColor="#E8941A" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#E8941A" stopOpacity="0.55" />
                <stop offset="78%" stopColor="#E8941A" stopOpacity="0.60" />
                <stop offset="100%" stopColor="#fac870" stopOpacity="0.65" />
              </linearGradient>
            ))}
          </defs>

          {floorData.map((floor:any, index) => {
            const isActive = hoveredFloor?.id === floor.id || selectedRow === index;
            return (
              <polygon
                key={floor.id}
                points={floor.polygon}
                fill={isActive ? `url(#${floor.gradientId})` : "transparent"}
                strokeOpacity={isActive ? 0.6 : 0}
                className="cursor-pointer transition-all duration-300"
                style={{
                  filter: isActive
                    ? "drop-shadow(0 0 6px rgba(245,166,35,0.35))"
                    : "none",
                }}
                // onClick={() => navigate(`/unitplan/${floor.id}`)}
                onClick={()=>navigate("/unitplan")}
                onMouseEnter={() => setHoveredFloor(floor)}
                onMouseLeave={() => setHoveredFloor(null)}
              />
            );
          })}
        </svg>

        {/* ── Tooltip ── */}
        {hoveredFloor && (() => {
          const { x, y } = svgToPercent(hoveredFloor.tooltipX, hoveredFloor.tooltipY);
          return (
            <div
              className="absolute z-30 flex items-center pointer-events-none transition-all duration-150"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translateY(-50%)",
              }}
            >
              {/* Left-pointing arrow (now responsive too) */}
              <ArrowPointer />

              {/* Glassmorphism Card Container Template */}
              <div
                style={{
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderRadius: "1px",
                }}
                /* FIX 4: Added mobile padding boundaries and smaller base text sizes 
                  via Tailwind responsive variants so the tooltip isn't oversized sm:p-[7px_14px_8px] on mobile.
                */
                className="text-white font-sans bg-gradient-to-r from-[#F5C369]/50
                 via-transparent to-transparent backdrop-blur-sm flex flex-col justify-center 
                 gap-0.5 py-[9px] px-1.5 min-w-[90px]  sm:min-w-[110px]"
              >
                <span className="text-[9px] sm:text-[11px] font-medium tracking-wide
                 leading-tight opacity-80">
                  {hoveredFloor.name}
                </span>
                <span className="font-light text-[10px]  tracking-wide leading-tight text-white">
                  {/* {hoveredFloor.sqft} */} {hoveredFloor.title}
                </span>
              </div>
            </div>
          );
        })()}

      </div>

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

      <div className="absolute top-[45%] -translate-y-1/2 left-[15%] z-50">
        {/* <motion.div
          initial={{ x: -120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
         
          className="w-[300px] 
          lg:w-[270px] h-[56vh] max-h-[560px] rounded-t-[30px] rounded-b-[5px] flex flex-col"
          style={{
            background: "linear-gradient(180deg, rgba(70,65,62,.68) 0%, rgba(35,32,30,.62) 100%)",
            backdropFilter: "blur(26px)",
            WebkitBackdropFilter: "blur(26px)",
            border: "1px solid rgba(255,255,255,.08)",
            boxShadow: "0 35px 80px rgba(0,0,0,.45), inset 0 1px rgba(255,255,255,.06)",
          }}
        >
        
          <div className="px-10 pt-2 pb-0 flex-shrink-0">
            <div className="flex items-center h-10 text-[10px] text-white/90 tracking-wide">
              <div className="w-[32%] text-center">Floor</div>
              <div className="w-px h-8 ml-2 bg-white/15" />
              <div className="flex-1 text-center">Tower</div>
            </div>
          </div>

        
          <div className="px-2 pb-3 flex-1 overflow-hidden text-[10px]">
            <div className="border border-white/10 h-full rounded-[4px] overflow-hidden flex flex-col">

           
              <div
                ref={tableContainerRef}
                className="h-full  overflow-y-auto custom-scrollbar">
                {floorData.map((row: any, index: number) => {
                  const active = hoveredFloor?.id === row.id || selectedRow === index;

                  return (
                    <div
                      key={row.id || index}

                      ref={(el) => {
                        rowRefs.current[row.id] = el;
                      }}
                      onMouseEnter={() => setHoveredFloor(row)}
                      onMouseLeave={() => setHoveredFloor(null)}

                      // onClick={() => setSelectedRow(index)}
                     
                      className="relative flex items-center h-10 border-b border-white/10 cursor-pointer group overflow-hidden last:border-b-0 flex-shrink-0"
                    >
                     
                      {active && (
                        <motion.div
                          layoutId="activeFloor"
                          className="absolute inset-0 bg-[#F7C46A]"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 36,
                          }}
                        />
                      )}

                      
                      {!active && (
                        <div className="absolute inset-0 bg-transparent group-hover:bg-white/[0.03] transition-colors duration-300" />
                      )}

                    
                      <div
                        className={`relative 
                          font-sans z-10 w-[40%] flex 
                          items-center justify-center text-[10px]
                           tracking-wide transition-colors ${active ? "text-[#3d2c16] font-semibold" : "text-white/80"
                          }`}
                      >
                        {row.tableName} Floor
                      </div>

                    
                      {!active && (
                        <div className="relative z-10 w-px self-stretch bg-white/10" />
                      )}

                   
                      <div className="relative z-10 flex-1 flex h-full">
                        {!active && (
                          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />
                        )}

                      
                        <div
                          className={`w-1/2 flex font-sans items-center justify-center text-[10px] transition-colors ${active ? "text-[#3d2c16] font-semibold" : "text-white/75"
                            }`}
                        >
                          12000 sqft
                        </div>

                       
                        <div
                          className={`w-1/2 flex font-sans items-center justify-center text-[10px] transition-colors ${active ? "text-[#3d2c16] font-semibold" : "text-white/75"
                            }`}
                        >
                          36000 sqft
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          
          <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,.15);
            border-radius: 20px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,.3);
          }
        `}</style>
        </motion.div> */}





         <motion.div
          initial={{ x: -120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
         
          className="w-[300px] 
          lg:w-[220px] h-[56vh] max-h-[560px] rounded-t-[25px] rounded-b-[5px] flex flex-col"
          style={{
            background: "linear-gradient(180deg, rgba(70,65,62,.68) 0%, rgba(35,32,30,.62) 100%)",
            backdropFilter: "blur(26px)",
            WebkitBackdropFilter: "blur(26px)",
            border: "1px solid rgba(255,255,255,.08)",
            boxShadow: "0 35px 80px rgba(0,0,0,.45), inset 0 1px rgba(255,255,255,.06)",
          }}
        >
        
          <div className="px-6 pt-2 pb-0 flex-shrink-0">
            <div className="flex items-center h-10 text-[14px] text-white/90 tracking-wide">
              <div className="w-[32%] text-center">Floors</div>
              
              
            </div>
          </div>

        
          <div className="px-2 pb-3 flex-1 overflow-hidden text-[10px]">
            <div className="border border-white/10 h-full rounded-[4px] overflow-hidden flex flex-col">

           
              <div
                ref={tableContainerRef}
                className="h-full  overflow-y-auto custom-scrollbar">
                {floorData.map((row:any, index: number) => {
                  const active = hoveredFloor?.id === row.id || selectedRow === index;

                  return (
                    <div
                      key={row.id || index}
                      onClick={()=>navigate("/unitplan")}
                      ref={(el:any) => {
                        rowRefs.current[row.id] = el;
                      }}
                      onMouseEnter={() => setHoveredFloor(row)}
                      onMouseLeave={() => setHoveredFloor(null)}

                      // onClick={() => setSelectedRow(index)}
                      /* FIXED: Changed 'h-[8%]' to a stable static height 'h-10' (40px) 
                         so rows render identically and trigger overflow naturally */
                      className="relative flex items-center h-10 border-b border-white/10 cursor-pointer group overflow-hidden last:border-b-0 flex-shrink-0"
                    >
                     
                      {active && (
                        <motion.div
                          layoutId="activeFloor"
                          className="absolute inset-0 bg-[#F7C46A]"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 36,
                          }}
                        />
                      )}

                      
                      {!active && (
                        <div className="absolute inset-0 bg-transparent group-hover:bg-white/[0.03] transition-colors duration-300" />
                      )}

                    
                      <div
                        className={`relative 
                          font-sans z-10 w-full flex 
                          items-start px-5 justify-start text-[10px]
                           tracking-wide transition-colors ${active ? "text-[#3d2c16] font-semibold" : "text-white/80"
                          }`}
                      >
                        {row.temp} 
                      </div>

                    
                      {!active && (
                        <div className="relative z-10 w-px self-stretch bg-white/10" />
                      )}

                   
                      {/* <div className="relative z-10 flex-1 flex h-full">
                        {!active && (
                          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />
                        )}

                      
                        <div
                          className={`w-1/2 flex font-sans items-center justify-center text-[10px] transition-colors ${active ? "text-[#3d2c16] font-semibold" : "text-white/75"
                            }`}
                        >
                          12000 sqft
                        </div>

                       
                        <div
                          className={`w-1/2 flex font-sans items-center justify-center text-[10px] transition-colors ${active ? "text-[#3d2c16] font-semibold" : "text-white/75"
                            }`}
                        >
                          36000 sqft
                        </div>
                      </div> */}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Webkit Scrollbar Styling */}
          <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,.15);
            border-radius: 20px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,.3);
          }
        `}</style>
        </motion.div>
      </div>


    </div>
  );
};

export default ProjectDetailsPage;




function ArrowPointer() {
  return (
    /* FIX 5: Scale down the arrow wrapper dimensions on small mobile layouts 
       so it hooks perfectly into the card without overflowing. -ml-4 -mr-[2px]   sm:-ml-5 sm:-mr-[5px]
    */
    <div className="relative w-[22px] h-[36px] -ml-5 sm:w-[28px] sm:h-[45px] flex-shrink-0 z-10 flex items-center justify-center">
      <svg
        viewBox="0 0 30 51"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F5C369" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#F5C369" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#F5C369" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="arrowBorderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F5A623" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgba(245, 166, 35, 0.3)" />
          </linearGradient>
        </defs>

        <path
          // Adjusted the coordinates from 34 to 30 to match your 30px viewBox width
          d="M 0 27 L 30 0 L 30 54 Z"
          fill="url(#arrowGradient)"
          stroke="url(#arrowBorderGradient)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
