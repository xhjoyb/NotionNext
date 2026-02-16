import { useEffect, useState, useRef } from 'react'
import { getThemeConfig } from '../config'

/**
 * 萌化音乐可视化组件
 *
 * 设计特点：
 * - 二次元风格的音波动画
 * - 粒子效果配合音乐节奏
 * - 几何图形变换
 * - 粉色/紫色渐变配色
 */
const KawaiiMusicVisualizer = ({ isPlaying = false, audioElement = null }) => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const dataArrayRef = useRef(null)
  const sourceRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  // 萌化配色
  const KAWAII_COLORS = {
    pink: '#FF6B9D',
    pinkLight: '#FFB8D0',
    purple: '#C084FC',
    purpleLight: '#E9D5FF',
    yellow: '#FCD34D',
    cyan: '#67E8F9',
  }

  useEffect(() => {
    setMounted(true)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // 初始化音频分析器 - 使用模拟数据，不干扰音频播放
  useEffect(() => {
    // 不创建 AudioContext，避免干扰音频播放
    // 使用模拟的可视化效果
  }, [audioElement, mounted])

  // 绘制可视化效果
  useEffect(() => {
    if (!mounted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const centerX = width / 2
    const centerY = height / 2

    // 粒子系统
    const particles = []
    const particleCount = 30

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: [KAWAII_COLORS.pink, KAWAII_COLORS.purple, KAWAII_COLORS.yellow, KAWAII_COLORS.cyan][Math.floor(Math.random() * 4)],
        alpha: Math.random() * 0.5 + 0.3,
        pulse: Math.random() * Math.PI * 2,
      })
    }

    // 波形条
    const bars = []
    const barCount = 20
    for (let i = 0; i < barCount; i++) {
      bars.push({
        x: (width / barCount) * i + (width / barCount) / 2,
        height: 0,
        targetHeight: 0,
        color: i % 2 === 0 ? KAWAII_COLORS.pink : KAWAII_COLORS.purple,
      })
    }

    let time = 0

    // 模拟音频数据生成器
    const generateMockAudioData = () => {
      const data = []
      for (let i = 0; i < 100; i++) {
        // 使用正弦波模拟音频数据
        const baseValue = isPlaying
          ? Math.sin(time * 0.1 + i * 0.2) * 0.5 + 0.5
          : 0.1
        const noise = Math.random() * 0.3
        data.push(Math.floor((baseValue + noise) * 255))
      }
      return data
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // 获取模拟音频数据（不干扰实际音频播放）
      const audioData = generateMockAudioData()

      // 绘制背景渐变
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) / 2)
      gradient.addColorStop(0, isPlaying ? 'rgba(255, 107, 157, 0.1)' : 'rgba(255, 107, 157, 0.05)')
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // 绘制中心几何图形
      const baseRadius = isPlaying ? 30 + (audioData[10] || 0) * 0.1 : 30
      const rotation = time * 0.02

      // 外圈星形
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation)
      ctx.beginPath()
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        const outerRadius = baseRadius + 15
        const innerRadius = baseRadius
        const x1 = Math.cos(angle) * outerRadius
        const y1 = Math.sin(angle) * outerRadius
        const x2 = Math.cos(angle + Math.PI / 8) * innerRadius
        const y2 = Math.sin(angle + Math.PI / 8) * innerRadius
        if (i === 0) {
          ctx.moveTo(x1, y1)
        } else {
          ctx.lineTo(x1, y1)
        }
        ctx.lineTo(x2, y2)
      }
      ctx.closePath()
      ctx.strokeStyle = KAWAII_COLORS.pink
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.fillStyle = `${KAWAII_COLORS.pink}20`
      ctx.fill()
      ctx.restore()

      // 内圈圆形
      ctx.beginPath()
      ctx.arc(centerX, centerY, baseRadius * 0.6, 0, Math.PI * 2)
      ctx.fillStyle = isPlaying ? KAWAII_COLORS.pink : KAWAII_COLORS.pinkLight
      ctx.fill()

      // 中心音符图标
      ctx.fillStyle = 'white'
      ctx.font = `${baseRadius * 0.5}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(isPlaying ? '♪' : '♫', centerX, centerY)

      // 绘制波形条 - 贴近底部
      bars.forEach((bar, index) => {
        const audioIndex = Math.floor((index / barCount) * (audioData.length || 100))
        const audioValue = audioData[audioIndex] || 0
        bar.targetHeight = isPlaying ? (audioValue / 255) * (height * 0.35) : 8
        bar.height += (bar.targetHeight - bar.height) * 0.1

        const barWidth = (width / barCount) * 0.7
        const x = bar.x - barWidth / 2
        const y = height - bar.height

        // 条形渐变
        const barGradient = ctx.createLinearGradient(0, height, 0, y)
        barGradient.addColorStop(0, bar.color)
        barGradient.addColorStop(1, KAWAII_COLORS.pinkLight)

        ctx.fillStyle = barGradient
        ctx.beginPath()
        ctx.roundRect(x, y, barWidth, bar.height, [4, 4, 0, 0])
        ctx.fill()

        // 顶部高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.fillRect(x, y, barWidth, 2)
      })

      // 绘制粒子
      particles.forEach((particle, index) => {
        // 更新位置
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.pulse += 0.05

        // 边界检查
        if (particle.x < 0) particle.x = width
        if (particle.x > width) particle.x = 0
        if (particle.y < 0) particle.y = height
        if (particle.y > height) particle.y = 0

        // 音频影响粒子大小
        const audioIndex = Math.floor((index / particleCount) * (audioData.length || 100))
        const audioValue = audioData[audioIndex] || 0
        const sizeMultiplier = isPlaying ? 1 + (audioValue / 255) * 0.5 : 1
        const currentSize = particle.size * sizeMultiplier * (0.8 + Math.sin(particle.pulse) * 0.2)

        // 绘制粒子
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2)
        ctx.fillStyle = particle.color + Math.floor(particle.alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()

        // 粒子光晕
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, currentSize * 2
        )
        glowGradient.addColorStop(0, particle.color + '40')
        glowGradient.addColorStop(1, 'transparent')
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, currentSize * 2, 0, Math.PI * 2)
        ctx.fill()
      })

      // 绘制连接线（当粒子靠近时）
      if (isPlaying) {
        ctx.strokeStyle = KAWAII_COLORS.pink + '30'
        ctx.lineWidth = 1
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < 80) {
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.stroke()
            }
          }
        }
      }

      time++
      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, mounted])

  if (!mounted) return null

  return (
    <div className="relative w-full h-40 rounded-t-2xl overflow-hidden bg-gradient-to-b from-pink-50/50 to-purple-50/50 dark:from-purple-900/30 dark:to-pink-900/30">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      {/* 顶部装饰角落 */}
      <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-pink-300/50 rounded-tl"></div>
      <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-pink-300/50 rounded-tr"></div>
    </div>
  )
}

export default KawaiiMusicVisualizer
