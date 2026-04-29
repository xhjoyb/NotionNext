import { useEffect, useState, useRef } from 'react'

/**
 * 洛克王国世界 - 异色代肝页面 Hero 组件
 * 引流导向设计：强调社区价值、专业度和信任感
 */
const LkwHero = () => {
  const [mounted, setMounted] = useState(false)
  const [activeStat, setActiveStat] = useState(0)
  const heroRef = useRef(null)

  // 统计数据
  const stats = [
    { value: '80次', label: '保底必出', desc: '噩梦枷锁机制' },
    { value: '1.8%', label: '基础出率', desc: '每次破盾概率' },
    { value: '24h', label: '在线服务', desc: '随时响应需求' },
    { value: '100%', label: '纯手工操作', desc: '纯手工操作' }
  ]

  // 服务亮点
  const highlights = [
    { icon: '⚡', title: '3×3速刷法', desc: '高效触发噩梦枷锁' },
    { icon: '🎯', title: '精准定位', desc: '指定精灵定向刷取' },
    { icon: '🛡️', title: '纯手工操作', desc: '纯手工操作' },
    { icon: '💎', title: '赛季限定', desc: '绝版异色不放过' }
  ]

  useEffect(() => {
    setMounted(true)
    
    // 自动轮播统计数据
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % stats.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const scrollToServices = () => {
    const servicesSection = document.getElementById('lkw-services')
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div ref={heroRef} className="relative overflow-hidden rounded-3xl mb-8">
      {/* 动态背景 - 适配日夜间 */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 transition-colors duration-500">
        {/* 网格纹理 */}
        <div 
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(100,100,150,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100,100,150,0.15) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* 浮动光球 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/25 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse transition-colors duration-500" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/15 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse transition-colors duration-500" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/15 dark:bg-cyan-500/10 rounded-full blur-3xl animate-pulse transition-colors duration-500" style={{ animationDelay: '2s' }} />
      </div>

      {/* 内容区域 */}
      <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* 左侧：主标题和CTA */}
            <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`}>
              {/* 标签 */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-sm border border-black/10 dark:border-white/20 mb-6 transition-colors duration-500">
                <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-gray-600 dark:text-white/80 transition-colors duration-500">专业代肝服务在线</span>
              </div>

              {/* 主标题 */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight transition-colors duration-500">
                洛克王国世界
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400">
                  异色精灵代肝
                </span>
              </h1>

              {/* 副标题 */}
              <p className="text-lg text-gray-600 dark:text-white/70 mb-8 max-w-lg leading-relaxed transition-colors duration-500">
                加入我们的代肝社区，获取专业的异色刷取攻略和代肝服务。
                利用3×3速刷法，80次保底必出异色精灵！
              </p>

              {/* CTA按钮组 - 引流导向 */}
              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={scrollToServices}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <span>了解服务详情</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <a
                  href="#lkw-contact"
                  className="px-8 py-4 bg-black/5 dark:bg-white/10 backdrop-blur-sm text-gray-800 dark:text-white rounded-full font-semibold hover:bg-black/10 dark:hover:bg-white/20 transition-all duration-300 border border-black/10 dark:border-white/20"
                >
                  联系咨询
                </a>
              </div>

              {/* 信任指标 */}
              <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-white/60 transition-colors duration-500">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>安全靠谱</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>口碑推荐</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-500 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>攻略分享</span>
                </div>
              </div>
            </div>

            {/* 右侧：统计卡片和亮点 */}
            <div className={`transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`}>
              {/* 主统计卡片 */}
              <div className="bg-white/60 dark:bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-black/10 dark:border-white/20 mb-6 transition-colors duration-500">
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-2">
                    {stats[activeStat].value}
                  </div>
                  <div className="text-gray-800 dark:text-white font-semibold transition-colors duration-500">{stats[activeStat].label}</div>
                  <div className="text-gray-500 dark:text-white/60 text-sm transition-colors duration-500">{stats[activeStat].desc}</div>
                </div>
                
                {/* 指示器 */}
                <div className="flex justify-center gap-2">
                  {stats.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveStat(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === activeStat ? 'w-8 bg-purple-500 dark:bg-purple-400' : 'w-2 bg-black/20 dark:bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* 服务亮点网格 */}
              <div className="grid grid-cols-2 gap-3">
                {highlights.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-black/5 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 hover:border-black/10 dark:hover:border-white/20 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                    <div className="text-gray-800 dark:text-white font-semibold text-sm transition-colors duration-500">{item.title}</div>
                    <div className="text-gray-500 dark:text-white/60 text-xs transition-colors duration-500">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部渐变过渡 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/20 dark:from-white/5 to-transparent transition-colors duration-500" />
    </div>
  )
}

export default LkwHero