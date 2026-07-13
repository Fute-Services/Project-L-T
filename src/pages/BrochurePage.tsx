import { useNavigate } from "react-router-dom";
import {
    Download,
    Loader2,
    Maximize,
    Minimize,
    ZoomIn,
    ZoomOut,
    RotateCcw
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
// @ts-ignore
import { PageFlip } from "page-flip";
import LeftNavbar from "../components/navigation/LeftNavbar";
// import backIcon from "../assets/back butten.png";
import pdfFile from "../assets/documents/L&T Lower Parel_PPT General_Lowres.pdf";
import bgImage from "../assets/images/shared/scene-city-skyline.png";

// Declare pdfjsLib and PageFlip module to satisfy TypeScript
declare global {
    interface Window {
        pdfjsLib: any;
    }
}

interface VirtualPage {
    id: string;
    pdfPageNumber: number;
    isDoubleWidth: boolean;
    half: 'left' | 'right' | 'full';
    width: number;
    height: number;
}

// Move PageRenderer OUTSIDE Brochure to prevent unmounting and remounting on every state update (fixes page blink/flicker)
const PageRenderer = ({
    page,
    activeIdx,
    pdfDoc,
    virtualPages
}: {
    page: VirtualPage;
    activeIdx: number;
    pdfDoc: any;
    virtualPages: VirtualPage[];
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [renderState, setRenderState] = useState<"loading" | "success" | "error">("loading");
    const renderTaskRef = useRef<any>(null);

    // Calculate if the page falls within lazy loading / preloading threshold (current page +/- 5 pages)
    const pageIndex = virtualPages.findIndex(p => p.id === page.id);
    const isNearActive = Math.abs(pageIndex - activeIdx) <= 5;

    useEffect(() => {
        let isRenderMounted = true;

        const render = async () => {
            if (!isNearActive || page.pdfPageNumber === -1 || !pdfDoc || !canvasRef.current) {
                setRenderState("success");
                return;
            }

            try {
                setRenderState("loading");
                const pdfPage = await pdfDoc.getPage(page.pdfPageNumber);
                if (!isRenderMounted || !canvasRef.current) return;

                const canvas = canvasRef.current;
                const context = canvas.getContext("2d");
                if (!context) return;

                const dpr = window.devicePixelRatio || 1;
                const viewport = pdfPage.getViewport({ scale: 1.5 }); // Base quality 1.5x

                if (page.half === 'left' || page.half === 'right') {
                    const widthScale = (viewport.width / 2) * dpr;
                    const heightScale = viewport.height * dpr;

                    canvas.width = widthScale;
                    canvas.height = heightScale;
                    canvas.style.width = "100%";
                    canvas.style.height = "100%";

                    context.scale(dpr, dpr);

                    if (page.half === 'right') {
                        context.translate(-(viewport.width / 2), 0);
                    }
                } else {
                    canvas.width = viewport.width * dpr;
                    canvas.height = viewport.height * dpr;
                    canvas.style.width = "100%";
                    canvas.style.height = "100%";

                    context.scale(dpr, dpr);
                }

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };

                if (renderTaskRef.current) {
                    renderTaskRef.current.cancel();
                }

                const renderTask = pdfPage.render(renderContext);
                renderTaskRef.current = renderTask;

                await renderTask.promise;

                if (isRenderMounted) {
                    setRenderState("success");
                }
            } catch (err: any) {
                if (err.name !== "RenderingCancelledException") {
                    console.error(`Error rendering page ${page.pdfPageNumber}:`, err);
                    if (isRenderMounted) {
                        setRenderState("error");
                    }
                }
            }
        };

        render();

        return () => {
            isRenderMounted = false;
            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
            }
        };
    }, [pdfDoc, page.id, isNearActive]);

    // Cleanup resources by clearing canvas sizing when page is not near active viewport
    useEffect(() => {
        if (!isNearActive && canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = 0;
            canvas.height = 0;
        }
    }, [isNearActive]);

    if (page.pdfPageNumber === -1) {
        return (
            <div className="w-full h-full bg-[#16191e] border border-[#22272e] flex flex-col items-center justify-center p-8 select-none text-center">
                <div className="w-16 h-16 mx-auto mb-4 border border-[#B9D2FF]/40 rounded-full flex items-center justify-center">
                    <span className="text-[#B9D2FF] font-serif text-2xl font-bold">L&T</span>
                </div>
                <h3 className="text-[#E6F0FF] font-serif text-lg tracking-widest uppercase mb-2">

                </h3>
                <div className="w-12 h-[1px] bg-[#B9D2FF]/50 mx-auto my-3" />
                <p className="text-[#E6F0FF]/60 text-[10px] tracking-widest uppercase font-sans">
                    Premium Office
                </p>
            </div>
        );
    }

    return (
        <div className={`w-full h-full bg-[#1b1c18] relative flex items-center ${page.half === 'left' ? 'justify-end' : page.half === 'right' ? 'justify-start' : 'justify-center'
            }`}>
            {renderState === "error" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1b1c18] text-center p-4 z-20">
                    <p className="text-red-400 text-xs font-sans">Failed to render page</p>
                </div>
            )}
            <canvas
                ref={canvasRef}
                className={`w-full h-full object-contain ${page.half === 'left' ? 'object-right' : page.half === 'right' ? 'object-left' : 'object-center'
                    }`}
            />
        </div>
    );
};

export default function BrochurePage() {
    const navigate = useNavigate();
    const [pdfDoc, setPdfDoc] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [virtualPages, setVirtualPages] = useState<VirtualPage[]>([]);
    const [activePageIndex, setActivePageIndex] = useState<number>(0);
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');

    // Zoom & Pan states
    const [zoomScale, setZoomScale] = useState<number>(1.0);
    const [panX, setPanX] = useState<number>(0);
    const [panY, setPanY] = useState<number>(0);
    const [isDraggingPan, setIsDraggingPan] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Page Indicator Navigation states
    const [isEditingPage, setIsEditingPage] = useState<boolean>(false);
    const [pageInputVal, setPageInputVal] = useState<string>("");

    const bookRef = useRef<HTMLDivElement>(null);
    const pageFlipRef = useRef<PageFlip | null>(null);
    const lastFlipTimeRef = useRef<number>(0);
    const accumulativeDeltaXRef = useRef<number>(0);

    // Dynamic loading of PDF.js from CDN
    useEffect(() => {
        let isMounted = true;

        const loadPdf = async () => {
            try {
                if (!window.pdfjsLib) {
                    const script = document.createElement("script");
                    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
                    script.async = true;

                    const scriptPromise = new Promise((resolve, reject) => {
                        script.onload = resolve;
                        script.onerror = reject;
                    });

                    document.head.appendChild(script);
                    await scriptPromise;
                }

                // Configure worker
                window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

                // Load PDF document
                const loadingTask = window.pdfjsLib.getDocument(pdfFile);
                const pdf = await loadingTask.promise;

                // Query page dimensions in parallel to construct layout
                const dims: { pageNumber: number; width: number; height: number }[] = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 1.0 });
                    dims.push({
                        pageNumber: i,
                        width: viewport.width,
                        height: viewport.height
                    });
                }

                // Generate virtual pages list
                const pagesList: VirtualPage[] = [];
                for (let i = 0; i < dims.length; i++) {
                    const { pageNumber, width, height } = dims[i];
                    const isDouble = width > height * 1.5;

                    if (isDouble) {
                        // Left half of spread must start on an odd virtual index (1, 3, 5...) to display on the left side
                        if (pagesList.length % 2 === 0) {
                            pagesList.push({
                                id: `filler-${pageNumber}`,
                                pdfPageNumber: -1, // -1 means filler
                                isDoubleWidth: false,
                                half: 'full',
                                width: height, // Square filler page
                                height: height
                            });
                        }

                        pagesList.push({
                            id: `pdf-p${pageNumber}-left`,
                            pdfPageNumber: pageNumber,
                            isDoubleWidth: true,
                            half: 'left',
                            width: width / 2,
                            height: height
                        });

                        pagesList.push({
                            id: `pdf-p${pageNumber}-right`,
                            pdfPageNumber: pageNumber,
                            isDoubleWidth: true,
                            half: 'right',
                            width: width / 2,
                            height: height
                        });
                    } else {
                        pagesList.push({
                            id: `pdf-p${pageNumber}-full`,
                            pdfPageNumber: pageNumber,
                            isDoubleWidth: false,
                            half: 'full',
                            width: width,
                            height: height
                        });
                    }
                }

                if (isMounted) {
                    setPdfDoc(pdf);
                    setVirtualPages(pagesList);
                    setLoading(false);
                }
            } catch (err: any) {
                console.error("Error loading PDF:", err);
                if (isMounted) {
                    setError("Failed to load brochure PDF. Please use the download link.");
                    setLoading(false);
                }
            }
        };

        loadPdf();

        return () => {
            isMounted = false;
        };
    }, []);

    // Initialize PageFlip
    useEffect(() => {
        if (!bookRef.current || virtualPages.length === 0) return;

        const pageFlip = new PageFlip(bookRef.current, {
            width: 864,
            height: 864,
            size: "stretch",
            minWidth: 320,
            maxWidth: 1200,
            minHeight: 320,
            maxHeight: 1200,
            drawShadow: true,
            showCover: true,
            usePortrait: true,
            flippingTime: 600,
            swipeDistance: 30,
            showPageCorners: true,
            disableFlipByClick: false
        });

        const pageElements = bookRef.current.querySelectorAll(".page-item");
        if (pageElements.length > 0) {
            pageFlip.loadFromHTML(pageElements as any);
        }

        pageFlipRef.current = pageFlip;

        pageFlip.on("flip", (e: any) => {
            setActivePageIndex(e.data);
        });

        pageFlip.on("onChangeOrientation", (e: any) => {
            setOrientation(e.data);
        });

        setOrientation(pageFlip.getOrientation());

        return () => {
            if (pageFlipRef.current) {
                pageFlipRef.current.destroy();
                pageFlipRef.current = null;
            }
        };
    }, [virtualPages]);

    // Keyboard navigation listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!pageFlipRef.current) return;
            if (e.key === "ArrowLeft") {
                pageFlipRef.current.flipPrev();
            } else if (e.key === "ArrowRight") {
                pageFlipRef.current.flipNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Fullscreen state listener
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    // Cooldown reset for trackpad swipes
    useEffect(() => {
        const timer = setInterval(() => {
            accumulativeDeltaXRef.current = 0;
        }, 300);
        return () => clearInterval(timer);
    }, []);

    // Wheel accumulation for trackpad page flipping
    const handleWheelAccumulation = (e: React.WheelEvent<HTMLDivElement>) => {
        if (zoomScale > 1.0) return;
        if (e.ctrlKey) return; // Ignore pinch trackpad

        const now = Date.now();
        if (now - lastFlipTimeRef.current < 1000) return;

        accumulativeDeltaXRef.current += e.deltaX;

        if (Math.abs(accumulativeDeltaXRef.current) > 150) {
            if (accumulativeDeltaXRef.current > 0) {
                pageFlipRef.current?.flipNext();
            } else {
                pageFlipRef.current?.flipPrev();
            }
            accumulativeDeltaXRef.current = 0;
            lastFlipTimeRef.current = now;
        }
    };

    // Unified Zoom & Trackpad navigation wheel handler
    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        // Zoom handling (either pinch with e.ctrlKey, or normal scroll when zoomed or holding shift)
        if (e.ctrlKey || zoomScale > 1.0 || e.shiftKey) {
            e.preventDefault();
            const zoomFactor = e.ctrlKey ? 0.05 : 0.1;
            const direction = e.deltaY < 0 ? 1 : -1;
            const nextScale = Math.min(Math.max(zoomScale + direction * zoomFactor * zoomScale, 1.0), 4.0);

            if (nextScale !== zoomScale) {
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = e.clientX - rect.left - rect.width / 2;
                const mouseY = e.clientY - rect.top - rect.height / 2;
                const ratio = nextScale / zoomScale;
                setPanX(prev => mouseX - (mouseX - prev) * ratio);
                setPanY(prev => mouseY - (mouseY - prev) * ratio);
                setZoomScale(nextScale);
            }
            return;
        }

        // Direct wheel scroll zooms in/out as well since page-scroll is disabled
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            const nextScale = Math.min(Math.max(zoomScale + (e.deltaY < 0 ? 1 : -1) * 0.1 * zoomScale, 1.0), 4.0);
            if (nextScale !== zoomScale) {
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = e.clientX - rect.left - rect.width / 2;
                const mouseY = e.clientY - rect.top - rect.height / 2;
                const ratio = nextScale / zoomScale;
                setPanX(prev => mouseX - (mouseX - prev) * ratio);
                setPanY(prev => mouseY - (mouseY - prev) * ratio);
                setZoomScale(nextScale);
            }
            return;
        }

        // Trackpad swipe turns pages
        if (Math.abs(e.deltaX) > 10) {
            handleWheelAccumulation(e);
        }
    };

    // Panning drag handlers (Mouse)
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (zoomScale > 1.0) {
            e.preventDefault();
            e.stopPropagation();
            setIsDraggingPan(true);
            setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (zoomScale > 1.0 && isDraggingPan) {
            e.preventDefault();
            e.stopPropagation();
            setPanX(e.clientX - dragStart.x);
            setPanY(e.clientY - dragStart.y);
        }
    };

    const handleMouseUp = () => {
        setIsDraggingPan(false);
    };

    // Touch Panning & Pinch-to-zoom state
    const touchStartRef = useRef<{
        distance: number;
        scale: number;
        center: { x: number; y: number };
        pan: { x: number; y: number };
        isPinching: boolean;
        isPanning: boolean;
        lastTouch: { x: number; y: number };
    }>({
        distance: 0,
        scale: 1.0,
        center: { x: 0, y: 0 },
        pan: { x: 0, y: 0 },
        isPinching: false,
        isPanning: false,
        lastTouch: { x: 0, y: 0 }
    });

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const dx = t1.clientX - t2.clientX;
            const dy = t1.clientY - t2.clientY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const rect = e.currentTarget.getBoundingClientRect();
            const cx = (t1.clientX + t2.clientX) / 2 - rect.left - rect.width / 2;
            const cy = (t1.clientY + t2.clientY) / 2 - rect.top - rect.height / 2;

            touchStartRef.current = {
                distance: dist,
                scale: zoomScale,
                center: { x: cx, y: cy },
                pan: { x: panX, y: panY },
                isPinching: true,
                isPanning: false,
                lastTouch: { x: 0, y: 0 }
            };
        } else if (e.touches.length === 1 && zoomScale > 1.0) {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartRef.current = {
                distance: 0,
                scale: zoomScale,
                center: { x: 0, y: 0 },
                pan: { x: panX, y: panY },
                isPinching: false,
                isPanning: true,
                lastTouch: { x: touch.clientX, y: touch.clientY }
            };
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const state = touchStartRef.current;
        if (e.touches.length === 2 && state.isPinching) {
            e.preventDefault();
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const dx = t1.clientX - t2.clientX;
            const dy = t1.clientY - t2.clientY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const nextScale = Math.min(Math.max(state.scale * (dist / state.distance), 1.0), 4.0);

            if (nextScale !== zoomScale) {
                const ratio = nextScale / state.scale;
                const newPanX = state.center.x - (state.center.x - state.pan.x) * ratio;
                const newPanY = state.center.y - (state.center.y - state.pan.y) * ratio;
                setZoomScale(nextScale);
                setPanX(newPanX);
                setPanY(newPanY);
            }
        } else if (e.touches.length === 1 && state.isPanning && zoomScale > 1.0) {
            e.preventDefault();
            const touch = e.touches[0];
            const dx = touch.clientX - state.lastTouch.x;
            const dy = touch.clientY - state.lastTouch.y;

            setPanX(prev => prev + dx);
            setPanY(prev => prev + dy);

            state.lastTouch = { x: touch.clientX, y: touch.clientY };
        }
    };

    const handleTouchEnd = () => {
        touchStartRef.current.isPinching = false;
        touchStartRef.current.isPanning = false;
    };

    // Double Click Zoom toggler
    const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (zoomScale > 1.0) {
            resetZoom();
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left - rect.width / 2;
            const mouseY = e.clientY - rect.top - rect.height / 2;
            setPanX(mouseX - mouseX * 2);
            setPanY(mouseY - mouseY * 2);
            setZoomScale(2.0);
        }
    };

    const resetZoom = () => {
        setZoomScale(1.0);
        setPanX(0);
        setPanY(0);
    };

    // Fullscreen toggler
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch(err => {
                console.error("Fullscreen error:", err);
            });
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            });
        }
    };

    // Construct label for current pages
    const getPageIndicatorText = () => {
        if (virtualPages.length === 0 || !pdfDoc) return "";
        const leftPage = virtualPages[activePageIndex];
        const isPortrait = orientation === 'portrait';

        if (isPortrait || activePageIndex === 0 || activePageIndex === virtualPages.length - 1) {
            if (!leftPage) return "";
            if (leftPage.pdfPageNumber === -1) return "Brochure Welcome";
            return `Page ${leftPage.pdfPageNumber} / ${pdfDoc.numPages}`;
        }

        const rightPage = virtualPages[activePageIndex + 1];
        if (!leftPage) return "";

        const leftNum = leftPage.pdfPageNumber;
        const rightNum = rightPage ? rightPage.pdfPageNumber : -1;

        if (leftNum === -1 && rightNum === -1) {
            return "Brochure Welcome";
        } else if (leftNum === -1) {
            return `Page ${rightNum} / ${pdfDoc.numPages}`;
        } else if (rightNum === -1) {
            return `Page ${leftNum} / ${pdfDoc.numPages}`;
        } else if (leftNum === rightNum) {
            return `Page ${leftNum} / ${pdfDoc.numPages}`;
        } else {
            return `Pages ${leftNum}-${rightNum} / ${pdfDoc.numPages}`;
        }
    };

    const handlePageSubmit = () => {
        setIsEditingPage(false);
        const pageNum = parseInt(pageInputVal, 10);
        if (!isNaN(pageNum) && pdfDoc && pageNum >= 1 && pageNum <= pdfDoc.numPages) {
            const targetIndex = virtualPages.findIndex(p => p.pdfPageNumber === pageNum);
            if (targetIndex !== -1 && pageFlipRef.current) {
                pageFlipRef.current.turnToPage(targetIndex);
            }
        }
    };



    return (
        <div className="relative w-screen h-screen overflow-hidden bg-[#12140e] flex">
            {/* Blurred background map */}
            <div
                className="absolute inset-0 bg-cover bg-center filter blur-xl scale-105 opacity-20 z-0"
                style={{ backgroundImage: `url(${bgImage})` }}
            />
            <div className="absolute inset-0 bg-[#0e100a]/85 z-[1]" />

            {/* Navigation Bars - Left Navbar Container */}
            <div className="absolute top-[48%] lg:top-[55%] left-[6%] z-[999] -translate-y-1/2 -translate-x-1/2">
                <LeftNavbar />
            </div>

            {/* Standard sidebar back button */}
            {/* <button
                onClick={() => navigate(-1)}
                className="absolute bottom-10 left-[6%] z-[999] -translate-x-1/2 w-11 h-11 flex items-center justify-center hover:scale-105 transition-all duration-300 cursor-pointer"
                title="Go Back"
            >
                <img src={backIcon} alt="Back" className="w-full h-full object-contain" />
            </button> */}

            {/* Main PDF Book Viewer Container */}
            <div className="w-full h-full z-10 pl-[12%] py-6 pr-6 flex items-center justify-center relative">
                <div
                    className="w-full h-full rounded-[24px] overflow-hidden border shadow-2xl flex flex-col transition-all duration-500"
                    style={{
                        backgroundColor: "rgba(22, 25, 30, 0.95)",
                        border: "1.5px solid rgba(185, 210, 255, 0.35)",
                        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(185, 210, 255, 0.08)"
                    }}
                >
                    {/* Custom Premium Blue Header Bar */}
                    <div
                        className="h-14 px-6 flex items-center justify-between shrink-0"
                        style={{
                            background: "linear-gradient(90deg, rgba(34, 38, 46, 0.98) 0%, rgba(22, 25, 30, 0.99) 100%)",
                            borderBottom: "1.5px solid rgba(185, 210, 255, 0.35)"
                        }}
                    >
                        {/* Title & Back Button */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="px-3 py-1.5 rounded-full border border-[#B9D2FF]/40 hover:bg-[#B9D2FF]/10 text-[#E6F0FF] font-bold text-[10px] tracking-wider uppercase flex items-center gap-1.5 transition-all duration-300"
                            >
                                ← Back
                            </button>
                            <div className="hidden md:flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#B9D2FF] animate-pulse" />
                                <h2 className="text-[#E6F0FF] font-bold text-xs tracking-wider uppercase font-sans">
                                    L&T - Brochure
                                </h2>
                            </div>
                        </div>

                        {/* Premium Controls */}
                        <div className="flex items-center gap-2.5">
                            {/* Zoom indicators/controls */}
                            <div className="flex items-center gap-1 border border-[#B9D2FF]/20 rounded-full px-2 py-0.5 bg-black/30">
                                <button
                                    onClick={() => setZoomScale(prev => Math.max(prev - 0.25, 1.0))}
                                    disabled={zoomScale <= 1.0}
                                    className="p-1 hover:text-[#E6F0FF] text-white/60 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                    title="Zoom Out"
                                >
                                    <ZoomOut size={13} />
                                </button>
                                <span className="text-[10px] font-sans font-semibold text-[#E6F0FF] min-w-[32px] text-center">
                                    {Math.round(zoomScale * 100)}%
                                </span>
                                <button
                                    onClick={() => setZoomScale(prev => Math.min(prev + 0.25, 4.0))}
                                    disabled={zoomScale >= 4.0}
                                    className="p-1 hover:text-[#E6F0FF] text-white/60 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                    title="Zoom In"
                                >
                                    <ZoomIn size={13} />
                                </button>
                                {zoomScale > 1.0 && (
                                    <button
                                        onClick={resetZoom}
                                        className="p-1 hover:text-[#E6F0FF] text-white/60 transition-colors ml-0.5 border-l border-[#B9D2FF]/20"
                                        title="Reset Zoom"
                                    >
                                        <RotateCcw size={11} />
                                    </button>
                                )}
                            </div>

                            {/* Fullscreen Button */}
                            <button
                                onClick={toggleFullscreen}
                                className="p-2 rounded-full border border-[#B9D2FF]/30 hover:bg-[#B9D2FF]/10 text-[#E6F0FF] transition-all duration-300"
                                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                            >
                                {isFullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
                            </button>

                            {/* Download Button */}
                            <a
                                href={pdfFile}
                                download="Hiranandani_Sands_Brochure.pdf"
                                className="px-4 py-1.5 rounded-full bg-[#4785FF] hover:bg-[#B9D2FF] text-white hover:text-slate-950 font-bold text-[10px] tracking-wider uppercase flex items-center gap-1.5 transition-all duration-300 shadow-md shadow-[#4785FF]/20 cursor-pointer pointer-events-auto"
                            >
                                <Download size={13} />
                                <span className="hidden sm:inline">Download</span>
                            </a>
                        </div>
                    </div>

                    {/* PDF Viewer Canvas area */}
                    <div
                        className="flex-1 w-full h-full bg-[#16171a] overflow-hidden relative select-none"
                        onWheel={handleWheel}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {loading && (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                                <Loader2 className="w-10 h-10 animate-spin text-[#B9D2FF]" />
                                <p className="text-[#E6F0FF] font-sans text-xs tracking-widest uppercase animate-pulse">
                                    Loading Brochure...
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="w-full h-full flex flex-col items-center justify-center text-center px-4">
                                <p className="text-red-400 font-sans text-sm mb-4">{error}</p>
                                <a
                                    href={pdfFile}
                                    download="Hiranandani_Sands_Brochure.pdf"
                                    className="px-6 py-2 rounded-full bg-[#4785FF] text-white hover:bg-[#B9D2FF] hover:text-slate-950 font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-md"
                                >
                                    Download to View
                                </a>
                            </div>
                        )}

                        {!loading && !error && virtualPages.length > 0 && (
                            <div className="w-full h-full flex items-center justify-center relative">
                                {/* 3D Book aspect-ratio wrapper */}
                                <div
                                    className={`flex items-center justify-center cursor-grab active:cursor-grabbing`}
                                    style={{
                                        transform: `scale(${zoomScale}) translate(${panX}px, ${panY}px)`,
                                        transformOrigin: "center center",
                                        transition: isDraggingPan ? "none" : "transform 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)",
                                        width: "100%",
                                        height: "100%",
                                        maxWidth: orientation === 'portrait' ? '82vh' : '164vh',
                                        maxHeight: orientation === 'portrait' ? '82vw' : '82vh',
                                        aspectRatio: orientation === 'portrait' ? '1' : '2',
                                    }}
                                    onDoubleClick={handleDoubleClick}
                                >
                                    <div
                                        ref={bookRef}
                                        className="w-full h-full shadow-2xl rounded-lg overflow-hidden border border-[#2a2d1e]"
                                    >
                                        {virtualPages.map((page, index) => (
                                            <div
                                                key={page.id}
                                                className="page-item"
                                                data-density={index === 0 || index === virtualPages.length - 1 ? "hard" : "soft"}
                                            >
                                                <PageRenderer page={page} activeIdx={activePageIndex} pdfDoc={pdfDoc} virtualPages={virtualPages} />
                                            </div>
                                        ))}
                                    </div>
                                </div>



                                {/* Panning Overlay instructions when zoomed */}
                                {zoomScale > 1.0 && (
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/60 border border-[#B9D2FF]/30 backdrop-blur-sm text-[#E6F0FF] text-[10px] tracking-wider uppercase font-sans z-30 pointer-events-none">
                                        Drag to Pan | Double Click to Zoom Out
                                    </div>
                                )}

                                {/* Page Indicator */}
                                {isEditingPage ? (
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-black/85 border border-[#B9D2FF] backdrop-blur-md text-[#E6F0FF] text-[11px] tracking-widest font-sans font-bold shadow-lg z-30 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#B9D2FF] animate-pulse" />
                                        <span className="text-white/60">Go to Page:</span>
                                        <input
                                            type="number"
                                            value={pageInputVal}
                                            onChange={(e) => setPageInputVal(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handlePageSubmit();
                                                } else if (e.key === "Escape") {
                                                    setIsEditingPage(false);
                                                }
                                            }}
                                            onBlur={handlePageSubmit}
                                            autoFocus
                                            min={1}
                                            max={pdfDoc?.numPages || 39}
                                            className="w-11 bg-black/45 border border-[#B9D2FF]/50 rounded-md py-0.5 text-[#E6F0FF] focus:outline-none focus:border-[#B9D2FF] text-center font-bold text-[11px]"
                                        />
                                        <span className="text-[#E6F0FF]/60">/ {pdfDoc?.numPages}</span>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => {
                                            setIsEditingPage(true);
                                            const leftPage = virtualPages[activePageIndex];
                                            if (leftPage && leftPage.pdfPageNumber !== -1) {
                                                setPageInputVal(leftPage.pdfPageNumber.toString());
                                            } else {
                                                setPageInputVal("");
                                            }
                                        }}
                                        className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-black/65 hover:bg-black/85 hover:border-[#B9D2FF] border border-[#B9D2FF]/30 backdrop-blur-md text-[#E6F0FF] text-[11px] tracking-widest font-sans font-bold shadow-lg z-30 flex items-center gap-2 cursor-pointer transition-all duration-300"
                                        title="Click to enter page number"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#B9D2FF] animate-pulse" />
                                        {getPageIndicatorText()}
                                        <span className="text-[9px] text-[#E6F0FF]/40 font-normal ml-1 lowercase">(click to go)</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Global CSS Styles for page-flip container */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .stPageFlip {
          position: relative;
          display: block;
        }
        .page-item {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          box-shadow: inset 0 0 100px rgba(0,0,0,0.1), 0 0 20px rgba(0,0,0,0.4);
          overflow: hidden;
        }
        .page-item[data-density="hard"] {
          background-color: #12140e;
        }
        /* Hide HTML5 spin-buttons */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}} />
        </div>
    );
}