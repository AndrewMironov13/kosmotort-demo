import { useEffect, useRef } from 'react'

const DEFAULT_COLOR = [253, 251, 247]

export default function InkReveal({
  className = '',
  color = DEFAULT_COLOR,
  opacity = 0.18,
  brushSize = 105,
  lifetime = 850,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const stamps = []
    let frame = 0
    let last = null
    let width = 0
    let height = 0
    let dpr = 1
    let running = false

    const paintVeil = () => {
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = `rgba(${color.join(',')},${opacity})`
      ctx.fillRect(0, 0, width, height)
    }

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      paintVeil()
    }

    const addStamp = (x, y) => {
      if (stamps.length > 90) stamps.shift()
      stamps.push({
        x,
        y,
        born: performance.now(),
        radius: brushSize * (0.72 + Math.random() * 0.28),
      })
    }

    const render = () => {
      paintVeil()
      const now = performance.now()
      ctx.globalCompositeOperation = 'destination-out'

      for (let index = stamps.length - 1; index >= 0; index -= 1) {
        const stamp = stamps[index]
        const progress = (now - stamp.born) / lifetime
        if (progress >= 1) {
          stamps.splice(index, 1)
          continue
        }
        const eased = 1 - (1 - progress) ** 3
        const radius = 12 + (stamp.radius - 12) * eased
        const gradient = ctx.createRadialGradient(
          stamp.x,
          stamp.y,
          radius * 0.08,
          stamp.x,
          stamp.y,
          radius,
        )
        gradient.addColorStop(0, `rgba(0,0,0,${0.98 - progress * 0.35})`)
        gradient.addColorStop(0.58, `rgba(0,0,0,${0.8 - progress * 0.5})`)
        gradient.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(stamp.x, stamp.y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      if (stamps.length) {
        frame = requestAnimationFrame(render)
      } else {
        running = false
        paintVeil()
      }
    }

    const start = () => {
      if (!running) {
        running = true
        frame = requestAnimationFrame(render)
      }
    }

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect()
      const point = { x: event.clientX - rect.left, y: event.clientY - rect.top }
      if (!last) {
        addStamp(point.x, point.y)
      } else {
        const distance = Math.hypot(point.x - last.x, point.y - last.y)
        const steps = Math.max(1, Math.ceil(distance / 16))
        for (let index = 1; index <= steps; index += 1) {
          addStamp(
            last.x + ((point.x - last.x) * index) / steps,
            last.y + ((point.y - last.y) * index) / steps,
          )
        }
      }
      last = point
      start()
    }
    const onPointerLeave = () => { last = null }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(parent)
    canvas.addEventListener('pointermove', onPointerMove, { passive: true })
    canvas.addEventListener('pointerleave', onPointerLeave)
    resize()

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [brushSize, color, lifetime, opacity])

  return <canvas ref={canvasRef} className={`ink-reveal ${className}`} aria-hidden="true" />
}
