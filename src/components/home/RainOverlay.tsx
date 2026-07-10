import { useEffect, useRef } from "react"

interface Drop {
    x: number
    y: number
    length: number
    speed: number
    opacity: number
}

// Lightweight canvas rain overlay for the hero scene. Draws a moderate-heavy
// rainfall of translucent streaks falling at a right-to-left wind angle, matching
// the reference photo where the storm rolls in from the dark side on the right
// toward the lit side on the left — without adding any extra image/video assets.
const WIND_ANGLE = -0.22 // right-to-left drift per frame, in radians
const DROP_COUNT_PER_1000PX2 = 0.12 // density used to scale drop count to screen size

const RainOverlay = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (prefersReducedMotion) return

        let drops: Drop[] = []
        let animationFrameId: number

        const createDrops = (width: number, height: number) => {
            const count = Math.round(width * height * DROP_COUNT_PER_1000PX2 / 1000)
            drops = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                length: 16 + Math.random() * 22,
                speed: 7 + Math.random() * 6,
                opacity: 0.14 + Math.random() * 0.22,
            }))
        }

        const resize = () => {
            const { clientWidth, clientHeight } = canvas
            const dpr = window.devicePixelRatio || 1
            canvas.width = clientWidth * dpr
            canvas.height = clientHeight * dpr
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            createDrops(clientWidth, clientHeight)
        }

        const draw = () => {
            const width = canvas.clientWidth
            const height = canvas.clientHeight
            ctx.clearRect(0, 0, width, height)
            ctx.strokeStyle = "#dce8f5"
            ctx.lineCap = "round"

            for (const drop of drops) {
                ctx.globalAlpha = drop.opacity
                ctx.lineWidth = 1.3
                ctx.beginPath()
                ctx.moveTo(drop.x, drop.y)
                ctx.lineTo(
                    drop.x + Math.sin(WIND_ANGLE) * drop.length,
                    drop.y + Math.cos(WIND_ANGLE) * drop.length
                )
                ctx.stroke()

                drop.x += Math.sin(WIND_ANGLE) * drop.speed
                drop.y += Math.cos(WIND_ANGLE) * drop.speed

                if (drop.y > height) {
                    drop.y = -drop.length
                    drop.x = Math.random() * width
                }
            }

            animationFrameId = requestAnimationFrame(draw)
        }

        resize()
        window.addEventListener("resize", resize)
        animationFrameId = requestAnimationFrame(draw)

        return () => {
            window.removeEventListener("resize", resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
        />
    )
}

export default RainOverlay
