import { useEffect, useState, useRef } from 'react'

/**
 * 洛克王国世界 - 异色代肝页面 Hero 组件
 * 游戏工作室风格，深色主题配合霓虹效果
 */
const LkwHero = () => {
  const canvasRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []
    
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    
    resize()
    window.addEventListener('resize', resize)
    
    // 创建粒子
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.offsetWidth
        this.y = Math.random() * canvas.offsetHeight
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.opacity = Math.random() * 0.5 + 0.2
        this.hue = Math.random() > 0.5 ? 280 : 200 // 紫色或蓝色
      }
      
      update() {
        this.x += this.speedX
        this.y += this.speedY
        
        if (this.x < 0 || this.x > canvas.offsetWidth) this.speedX *= -1
        if (this.y < 0 || this.y > canvas.offsetHeight) this.speedY *= -1
      }
      
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${this.opacity})`
        ctx.fill()
      }
    }
    
    // 初始化粒子
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle())
    }
    
    // 连接线
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `hsla(260, 60%, 50%, ${0.15 * (1 - distance / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      
      particles.forEach(p => {
        p.update()
        p.draw()
      })
      
      drawConnections()
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20
    })
  }

  const stats = [
    { value: '80', unit: '次', label: '保底必出', color: 'from-purple-500 to-pink-500' },
    { value: '1.8', unit: '%', label: '基础出率', color: 'from-blue-500 to-cyan-500' },
    { value: '24', unit: 'h', label: '高效代肝', color: 'from-green-500 to-emerald-500' },
    { value: '100', unit: '%', label: '安全保障', color: 'from-orange-500 to-red-500' }
  ]

  return (
    <div 
      className="relative min-h-[600px] flex items-center justify-center overflow-hidden rounded-none"
      onMouseMove={handleMouseMove}
    >
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900"></div>
      
      {/* 粒子画布 */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.8 }}
      />
      
      {/* 光晕效果 */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          transition: 'transform 0.3s ease-out',
          top: '10%',
          left: '30%'
        }}
      />
      
      {/* 网格背景 */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* 内容 */}
      <div className="relative z-10 px-6 py-20 text-center max-w-5xl mx-auto">
        {/* 标签 */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-sm text-gray-300">专业代肝服务在线接单中</span>
        </div>
        
        {/* 主标题 */}
        <h1 
          className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #fff 0%, #c4b5fd 25%, #e879f9 50%, #fff 75%, #c4b5fd 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shine 3s linear infinite'
          }}
        >
          洛克王国世界
        </h1>
        
        {/* 副标题 */}
        <p className="text-2xl sm:text-3xl font-bold text-purple-300 mb-4">
          异色精灵代肝服务
        </p>
        
        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          利用3×3速刷法高效触发噩梦枷锁，80次保底必出异色精灵。
          <br className="hidden sm:block" />
          专业团队，安全可靠，让你轻松拥有稀有异色宠！
        </p>

        {/* CTA 按钮 */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <a 
            href="#services"
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:scale-105"
          >
            <span className="relative z-10">查看服务</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
          <a 
            href="#contact"
            className="px-8 py-4 rounded-full font-bold text-white border border-white/20 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            联系客服
          </a>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            >
              <div className={`text-3xl sm:text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
                <span className="text-xl">{stat.unit}</span>
              </div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              
              {/* 悬停光效 */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部渐变过渡 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>

      <style jsx>{`
        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }
      `}</style>
    </div>
  )
}

export default LkwHero