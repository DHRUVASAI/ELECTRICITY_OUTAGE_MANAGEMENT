"use client"

import { useEffect, useRef } from "react"

export default function ElectricalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Power grid nodes
    const nodes: Array<{
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      pulsePhase: number
    }> = []

    // Create nodes
    const nodeCount = 30
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 3 + 2,
        pulsePhase: Math.random() * Math.PI * 2,
      })
    }

    // Lightning bolts
    const bolts: Array<{
      x: number
      y: number
      targetX: number
      targetY: number
      progress: number
      opacity: number
    }> = []

    // Create occasional lightning bolt
    const createBolt = () => {
      if (Math.random() > 0.98 && bolts.length < 3) {
        const startNode = nodes[Math.floor(Math.random() * nodes.length)]
        const endNode = nodes[Math.floor(Math.random() * nodes.length)]
        bolts.push({
          x: startNode.x,
          y: startNode.y,
          targetX: endNode.x,
          targetY: endNode.y,
          progress: 0,
          opacity: 1,
        })
      }
    }

    let animationFrame: number
    let time = 0

    const animate = () => {
      time += 0.02
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Move nodes
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Keep in bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x))
        node.y = Math.max(0, Math.min(canvas.height, node.y))

        // Pulsing effect
        const pulse = Math.sin(time + node.pulsePhase) * 0.5 + 0.5
        const glowSize = node.radius + pulse * 3

        // Draw glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize * 3)
        gradient.addColorStop(0, `rgba(59, 130, 246, ${0.6 * pulse})`)
        gradient.addColorStop(0.5, `rgba(59, 130, 246, ${0.2 * pulse})`)
        gradient.addColorStop(1, "rgba(59, 130, 246, 0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, glowSize * 3, 0, Math.PI * 2)
        ctx.fill()

        // Draw node
        ctx.fillStyle = `rgba(96, 165, 250, ${0.8 + pulse * 0.2})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fill()

        // Draw connections to nearby nodes
        nodes.forEach((otherNode, j) => {
          if (i >= j) return
          const dx = otherNode.x - node.x
          const dy = otherNode.y - node.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.3
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.stroke()

            // Animated energy flow
            const flowProgress = (time * 2 + i + j) % 1
            const flowX = node.x + dx * flowProgress
            const flowY = node.y + dy * flowProgress
            ctx.fillStyle = `rgba(147, 197, 253, ${opacity * 2})`
            ctx.beginPath()
            ctx.arc(flowX, flowY, 2, 0, Math.PI * 2)
            ctx.fill()
          }
        })
      })

      // Update and draw lightning bolts
      bolts.forEach((bolt, index) => {
        bolt.progress += 0.1
        bolt.opacity -= 0.05

        if (bolt.opacity <= 0 || bolt.progress >= 1) {
          bolts.splice(index, 1)
          return
        }

        const currentX = bolt.x + (bolt.targetX - bolt.x) * bolt.progress
        const currentY = bolt.y + (bolt.targetY - bolt.y) * bolt.progress

        // Draw lightning bolt with glow
        ctx.shadowBlur = 20
        ctx.shadowColor = "rgba(96, 165, 250, 0.8)"
        ctx.strokeStyle = `rgba(147, 197, 253, ${bolt.opacity})`
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(bolt.x, bolt.y)
        ctx.lineTo(currentX, currentY)
        ctx.stroke()
        ctx.shadowBlur = 0
      })

      createBolt()
      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ background: "linear-gradient(to bottom right, #0f172a, #1e293b)" }}
    />
  )
}
