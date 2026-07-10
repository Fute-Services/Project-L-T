import { useCallback, useEffect, useRef, useState } from "react"

interface WindowWithWebkitAudio extends Window {
    webkitAudioContext?: typeof AudioContext
}

// Procedurally synthesizes rain and thunder using the Web Audio API, so the storm
// sound effects need no external audio files.
//
// Rain is three layers: a high "hiss" wash and a lower muffled "body" wash (different
// loop lengths so their loop points never coincide, avoiding an audible repeating
// pattern), plus randomly-timed percussive droplet ticks — mostly small/high-pitched
// with occasional heavier/lower ones mixed in — for an organic pitter-patter texture.
//
// Thunder is a sharp broadband "crack" transient followed by several staggered,
// independently-swept low-passed rumble layers, giving it a rolling multi-echo boom
// instead of a single smooth noise swell.
//
// Browsers block audio playback until a user gesture, so everything starts muted —
// call `toggleSound` from a click handler to unlock.
export const useStormAudio = () => {
    const audioCtxRef = useRef<AudioContext | null>(null)
    const rainGainRef = useRef<GainNode | null>(null)
    const rainSourcesRef = useRef<AudioBufferSourceNode[]>([])
    const dropletTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const mutedRef = useRef(true)
    const [muted, setMuted] = useState(true)

    const createNoiseBuffer = useCallback((ctx: AudioContext, durationSeconds: number) => {
        const bufferSize = Math.floor(ctx.sampleRate * durationSeconds)
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1
        }
        return buffer
    }, [])

    // Two independently-looping wash layers (different lengths, different bands) summed into
    // one master gain, plus a slow LFO swell — like natural gusts in real rainfall
    const startRainWash = useCallback((ctx: AudioContext) => {
        const masterGain = ctx.createGain()
        masterGain.gain.value = 0

        const createWashLayer = (duration: number, hpFreq: number, lpFreq: number, level: number) => {
            const source = ctx.createBufferSource()
            source.buffer = createNoiseBuffer(ctx, duration)
            source.loop = true

            const highpass = ctx.createBiquadFilter()
            highpass.type = "highpass"
            highpass.frequency.value = hpFreq

            const lowpass = ctx.createBiquadFilter()
            lowpass.type = "lowpass"
            lowpass.frequency.value = lpFreq

            const layerGain = ctx.createGain()
            layerGain.gain.value = level

            source.connect(highpass)
            highpass.connect(lowpass)
            lowpass.connect(layerGain)
            layerGain.connect(masterGain)
            source.start()
            return source
        }

        const hissLayer = createWashLayer(4.3, 1400, 4800, 0.45) // close, high "hiss" texture — softened for a gentler, slower rain
        const bodyLayer = createWashLayer(6.1, 350, 1800, 0.4) // lower, muffled "body" layer

        const swellLfo = ctx.createOscillator()
        swellLfo.frequency.value = 0.1
        const swellDepth = ctx.createGain()
        swellDepth.gain.value = 0.03
        swellLfo.connect(swellDepth)
        swellDepth.connect(masterGain.gain)
        swellLfo.start()

        masterGain.connect(ctx.destination)

        rainSourcesRef.current = [hissLayer, bodyLayer]
        rainGainRef.current = masterGain
    }, [createNoiseBuffer])

    // Sparse, gentle droplet impulses: short, soft filtered ticks at unhurried, mostly
    // even intervals — matching a slow, light rain rather than a dense downpour.
    const startDroplets = useCallback((ctx: AudioContext) => {
        const spawnDroplet = () => {
            const now = ctx.currentTime
            const isHeavyDrop = Math.random() < 0.1

            const source = ctx.createBufferSource()
            source.buffer = createNoiseBuffer(ctx, 0.06)

            const bandpass = ctx.createBiquadFilter()
            bandpass.type = "bandpass"
            bandpass.frequency.value = isHeavyDrop
                ? 700 + Math.random() * 600
                : 2400 + Math.random() * 3000
            bandpass.Q.value = isHeavyDrop ? 6 : 10

            const dropletGain = ctx.createGain()
            const peak = ((isHeavyDrop ? 0.045 : 0.02) + Math.random() * 0.025)
            dropletGain.gain.setValueAtTime(0, now)
            dropletGain.gain.linearRampToValueAtTime(peak, now + 0.004)
            dropletGain.gain.exponentialRampToValueAtTime(0.0001, now + (isHeavyDrop ? 0.07 : 0.04))

            source.connect(bandpass)
            bandpass.connect(dropletGain)
            dropletGain.connect(ctx.destination)
            source.start(now)
            source.stop(now + 0.08)
        }

        const scheduleNext = () => {
            const delay = 90 + Math.random() * 160
            dropletTimeoutRef.current = setTimeout(() => {
                if (!mutedRef.current) spawnDroplet()
                scheduleNext()
            }, delay)
        }

        scheduleNext()
    }, [createNoiseBuffer])

    const toggleSound = useCallback(() => {
        const existingCtx = audioCtxRef.current

        if (existingCtx) {
            setMuted((previouslyMuted) => {
                const nextMuted = !previouslyMuted
                mutedRef.current = nextMuted
                rainGainRef.current?.gain.linearRampToValueAtTime(
                    nextMuted ? 0 : 0.11,
                    existingCtx.currentTime + 0.4
                )
                return nextMuted
            })
            return
        }

        const AudioContextClass = window.AudioContext ?? (window as WindowWithWebkitAudio).webkitAudioContext
        if (!AudioContextClass) return

        const ctx = new AudioContextClass()
        audioCtxRef.current = ctx
        startRainWash(ctx)
        startDroplets(ctx)
        rainGainRef.current?.gain.linearRampToValueAtTime(0.11, ctx.currentTime + 0.6)
        mutedRef.current = false
        setMuted(false)
    }, [startRainWash, startDroplets])

    // Sharp broadband "crack" transient, followed by several staggered low-passed rumble
    // layers with independently swept cutoffs — simulates a rolling, multi-echo thunder boom
    // rather than a single smooth filtered-noise swoosh.
    const playThunder = useCallback(() => {
        const ctx = audioCtxRef.current
        if (!ctx || mutedRef.current) return

        const now = ctx.currentTime

        const crackSource = ctx.createBufferSource()
        crackSource.buffer = createNoiseBuffer(ctx, 0.15)
        const crackFilter = ctx.createBiquadFilter()
        crackFilter.type = "highpass"
        crackFilter.frequency.value = 800
        const crackGain = ctx.createGain()
        crackGain.gain.setValueAtTime(0, now)
        crackGain.gain.linearRampToValueAtTime(0.6, now + 0.008)
        crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.13)
        crackSource.connect(crackFilter)
        crackFilter.connect(crackGain)
        crackGain.connect(ctx.destination)
        crackSource.start(now)
        crackSource.stop(now + 0.15)

        const rumbleLayers = 4
        for (let i = 0; i < rumbleLayers; i++) {
            const layerStart = now + 0.05 + i * (0.25 + Math.random() * 0.35)
            const layerDuration = 1.4 + Math.random() * 1.2

            const source = ctx.createBufferSource()
            source.buffer = createNoiseBuffer(ctx, layerDuration)

            const lowpass = ctx.createBiquadFilter()
            lowpass.type = "lowpass"
            const startFreq = 700 + Math.random() * 500
            lowpass.frequency.setValueAtTime(startFreq, layerStart)
            lowpass.frequency.exponentialRampToValueAtTime(80 + Math.random() * 60, layerStart + layerDuration)

            const gain = ctx.createGain()
            const peak = (0.25 + Math.random() * 0.15) / (i + 1)
            gain.gain.setValueAtTime(0, layerStart)
            gain.gain.linearRampToValueAtTime(peak, layerStart + 0.15)
            gain.gain.exponentialRampToValueAtTime(0.001, layerStart + layerDuration)

            source.connect(lowpass)
            lowpass.connect(gain)
            gain.connect(ctx.destination)
            source.start(layerStart)
            source.stop(layerStart + layerDuration)
        }
    }, [createNoiseBuffer])

    useEffect(() => {
        return () => {
            rainSourcesRef.current.forEach((source) => source.stop())
            if (dropletTimeoutRef.current) clearTimeout(dropletTimeoutRef.current)
            void audioCtxRef.current?.close()
        }
    }, [])

    return { muted, toggleSound, playThunder }
}
