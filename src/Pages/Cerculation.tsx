import LeftNavbar from "../Components/Navbar/LeftNavbar";

export default function Cerculation() {
    return (
        <div
            className="fixed inset-0 w-full h-full overflow-hidden flex flex-col justify-between"
            style={{
                background: "var(--projet-detiyals, linear-gradient(105deg, #000 -9.5%, #472700 100%))",
            }}
        >
            {/* 1. Header Section */}
            <div className="w-full text-center pt-8 z-10 select-none">
                <h1 className="text-white text-2xl lg:text-3xl font-extrabold tracking-widest uppercase font-sans">
                    Site Circulation
                </h1>
            </div>

            {/* 2. Main Layout Content (Center Video Player) */}
            <div className="flex-1 flex items-center justify-center z-10 px-[12%]">
                <div
                    className="w-[62vw] h-[75vh] rounded-[32px] lg:rounded-[40px] overflow-hidden shadow-2xl relative bg-black/45 border"
                    style={{
                        borderColor: "rgba(255, 255, 255, 0.08)",
                        // boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8), inset 0 0 30px rgba(0, 0, 0, 0.4)",
                    }}
                >
                    <iframe
                        src="https://player.vimeo.com/video/1206976915?h=5e8f3c6738&autoplay=1&loop=1&muted=1&playsinline=1"
                        className="w-full h-full rounded-[32px] lg:rounded-[40px]"
                        style={{ border: "none" }}
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title="Site Circulation Video"
                    />
                </div>
            </div>

            {/* 3. Left Navbar Container */}
            <div className="absolute top-[48%] lg:top-[55%] left-[6%] z-50 -translate-y-1/2 -translate-x-1/2">
                <LeftNavbar />
            </div>

            {/* Bottom spacer to match top padding */}
            <div className="h-10 shrink-0" />
        </div>
    );
}
