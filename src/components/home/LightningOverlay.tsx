import { useEffect, useRef, useState } from "react"

interface BoltPoint {
    x: number
    y: number
}

interface FlashOrigin {
    xPct: number
    yPct: number
}

// Procedurally generates a jagged lightning-bolt path between two points using
// midpoint displacement, so each strike looks unique rather than a straight line.
const generateBoltPath = (startX: number, startY: number, endX: number, endY: number, segments: number): BoltPoint[] => {
    const path: BoltPoint[] = [{ x: startX, y: startY }]
    for (let i = 1; i < segments; i++) {
        const t = i / segments
        const baseX = startX + (endX - startX) * t
        const baseY = startY + (endY - startY) * t
        const jitter = (1 - Math.abs(t - 0.5) * 2) * 40 + 10
        path.push({ x: baseX + (Math.random() - 0.5) * jitter, y: baseY })
    }
    path.push({ x: endX, y: endY })
    return path
}

interface LightningOverlayProps {
    onStrike?: () => void
}

// Frequent lightning strikes + a cloud-glow flash for the hero scene, matching the
// storm-cloud mood of the background photo. Strikes are aimed at the dark cloud
// area in the upper-right of the frame, same region the reference photo's clouds
// occupy. The flash radiates from the strike point (like light diffusing through
// cloud cover) instead of washing the whole screen evenly, and the bolt itself is
// drawn as a soft blurred glow with a crisp bright core layered on top, so it reads
// as light glowing through the clouds rather than a flat line drawn over the photo.
const LightningOverlay = ({ onStrike }: LightningOverlayProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [flashOpacity, setFlashOpacity] = useState(0)
    const [flashOrigin, setFlashOrigin] = useState<FlashOrigin>({ xPct: 78, yPct: 20 })
    const onStrikeRef = useRef(onStrike)

    useEffect(() => {
        onStrikeRef.current = onStrike
    }, [onStrike])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (prefersReducedMotion) return

        const timeoutIds: ReturnType<typeof setTimeout>[] = []
        let scheduleId: ReturnType<typeof setTimeout>

        const resize = () => {
            const dpr = window.devicePixelRatio || 1
            canvas.width = canvas.clientWidth * dpr
            canvas.height = canvas.clientHeight * dpr
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        const drawBolt = (path: BoltPoint[], branch: BoltPoint[] | null) => {
            const width = canvas.clientWidth
            const height = canvas.clientHeight
            ctx.clearRect(0, 0, width, height)

            const drawPath = (segments: BoltPoint[], lineWidth: number, alpha: number) => {
                ctx.globalAlpha = alpha
                ctx.lineWidth = lineWidth
                ctx.beginPath()
                ctx.moveTo(segments[0].x, segments[0].y)
                for (let i = 1; i < segments.length; i++) ctx.lineTo(segments[i].x, segments[i].y)
                ctx.stroke()
            }

            ctx.save()
            ctx.lineJoin = "round"
            ctx.lineCap = "round"

            // Wide soft glow pass — heavily blurred, low opacity, mimics light diffusing through cloud
            ctx.strokeStyle = "#cfe3ff"
            ctx.filter = "blur(9px)"
            drawPath(path, 10, 0.5)
            if (branch) drawPath(branch, 7, 0.35)

            // Medium halo pass — softer blur, bridges the gap between the wide glow and the core
            ctx.filter = "blur(3px)"
            ctx.shadowColor = "#bcd8ff"
            ctx.shadowBlur = 14
            drawPath(path, 4, 0.55)
            if (branch) drawPath(branch, 2.6, 0.4)

            // Crisp bright core — thin, sharp, sits on top of the glow
            ctx.filter = "none"
            ctx.shadowBlur = 6
            ctx.strokeStyle = "#f5faff"
            drawPath(path, 1.4, 0.9)
            if (branch) drawPath(branch, 1, 0.65)

            ctx.restore()
        }

        const triggerStrike = () => {
            const width = canvas.clientWidth
            const height = canvas.clientHeight

            // Strike originates in the dark storm-cloud area, upper-right of the frame
            const startX = width * (0.62 + Math.random() * 0.28)
            const endX = startX + (Math.random() - 0.5) * width * 0.15
            const endY = height * (0.35 + Math.random() * 0.25)
            const path = generateBoltPath(startX, 0, endX, endY, 12)

            let branch: BoltPoint[] | null = null
            if (Math.random() > 0.4) {
                const forkPoint = path[Math.floor(path.length * (0.35 + Math.random() * 0.25))]
                branch = generateBoltPath(
                    forkPoint.x,
                    forkPoint.y,
                    forkPoint.x + (Math.random() - 0.5) * width * 0.12,
                    forkPoint.y + height * (0.15 + Math.random() * 0.15),
                    5
                )
            }

            drawBolt(path, branch)
            onStrikeRef.current?.()

            // The flash radiates from roughly the middle of the bolt, inside the cloud mass,
            // rather than from the top edge of the screen
            const midPoint = path[Math.floor(path.length / 2)]
            setFlashOrigin({ xPct: (midPoint.x / width) * 100, yPct: (midPoint.y / height) * 100 })

            // Quick double-flicker glow, then fade out, mimicking a real strike lighting up the clouds
            setFlashOpacity(0.55)
            timeoutIds.push(setTimeout(() => setFlashOpacity(0.15), 80))
            timeoutIds.push(setTimeout(() => setFlashOpacity(0.4), 150))
            timeoutIds.push(setTimeout(() => setFlashOpacity(0), 320))
            timeoutIds.push(setTimeout(() => ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight), 260))
        }

        const scheduleNext = () => {
            const delay = 3500 + Math.random() * 5000
            scheduleId = setTimeout(() => {
                triggerStrike()
                scheduleNext()
            }, delay)
        }

        resize()
        window.addEventListener("resize", resize)
        scheduleNext()

        return () => {
            window.removeEventListener("resize", resize)
            clearTimeout(scheduleId)
            timeoutIds.forEach(clearTimeout)
        }
    }, [])

    return (
        <>
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-150"
                style={{
                    opacity: flashOpacity,
                    background: `radial-gradient(circle at ${flashOrigin.xPct}% ${flashOrigin.yPct}%, rgba(225, 238, 255, 0.95) 0%, rgba(200, 222, 255, 0.5) 22%, rgba(180, 205, 255, 0.12) 50%, rgba(0, 0, 0, 0) 72%)`
                }}
                aria-hidden="true"
            />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />
        </>
    )
}

export default LightningOverlay
