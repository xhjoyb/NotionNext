import { useEffect, useState } from 'react'

/**
 * 洛克王国世界 - 异色代肝页面 Hero 组件
 */
const LkwHero = () => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // 生成浮动粒子
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-3xl mb-8">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"></div>
      
      {/* 浮动粒子 */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white/20 animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}

      {/* 内容 */}
      <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
          <span className="text-4xl">🎮</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          洛克王国世界
        </h1>
        <p className="text-xl sm:text-2xl text-purple-200 mb-2">
          专业异色代肝服务
        </p>
        <p className="text-sm sm:text-base text-purple-300/80 max-w-2xl mx-auto mb-8">
          利用3×3速刷法高效触发噩梦枷锁，80次保底必出异色精灵。
          专业代肝，安全靠谱，让你轻松拥有稀有异色宠！
        </p>

        {/* 统计信息 */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 sm:px-6">
            <div className="text-2xl sm:text-3xl font-bold text-white">80次</div>
            <div className="text-xs sm:text-sm text-purple-300">保底必出</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 sm:px-6">
            <div className="text-2xl sm:text-3xl font-bold text-white">1.8%</div>
            <div className="text-xs sm:text-sm text-purple-300">基础出率</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 sm:px-6">
            <div className="text-2xl sm:text-3xl font-bold text-white">24h</div>
            <div className="text-xs sm:text-sm text-purple-300">高效代肝</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 sm:px-6">
            <div className="text-2xl sm:text-3xl font-bold text-white">100%</div>
            <div className="text-xs sm:text-sm text-purple-300">安全保障</div>
          </div>
        </div>

        {/* 滚动提示 */}
        <div className="mt-8 animate-bounce">
          <span className="text-white/60 text-sm">向下滚动查看服务详情</span>
          <div className="mt-2 text-white/60">↓</div>
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/5 to-transparent"></div>
    </div>
  )
}

export default LkwHero