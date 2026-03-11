/**
 * 抖音解析页面 Hero 区域
 * 设计系统：Video-First Hero + Glassmorphism
 * 特点：
 * - 沉浸式渐变背景
 * - 玻璃拟态卡片
 * - 动态粒子效果
 * - 清晰的视觉层次
 */
const DouyinParserHero = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center">
        
      {/* 内容区域 */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          
          {/* 标签徽章 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 dark:bg-pink-900/40 border border-pink-200 dark:border-pink-700">
            <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-pink-700 dark:text-pink-300">免费无水印下载</span>
          </div>
          
          {/* 主标题 */}
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 dark:text-white tracking-tight">
              抖音解析
            </h1>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl md:text-4xl font-bold anime-gradient-text">
                萌化工具箱
              </span>
              <svg className="w-8 h-8 text-pink-500 animate-star-roll" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          </div>
          
          {/* 副标题 */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            一键解析抖音视频和图文，获取无水印高清资源
            <br />
            <span className="text-pink-500">简单、快速、免费</span>
          </p>
          
          {/* 功能特性卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4">
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="视频下载"
              desc="高清无水印"
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              title="图文解析"
              desc="批量下载"
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              }
              title="音频提取"
              desc="MP3格式"
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              title="完全免费"
              desc="无需登录"
            />
          </div>
          
          {/* 向下滚动提示 */}
          <div className="pt-8 animate-bounce">
            <svg className="w-6 h-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* CSS 动画 */}
      <style jsx>{`
        @keyframes star-roll {
          0% {
            transform: translateX(0) rotate(0deg);
          }
          25% {
            transform: translateX(20px) rotate(90deg);
          }
          50% {
            transform: translateX(40px) rotate(180deg);
          }
          75% {
            transform: translateX(20px) rotate(270deg);
          }
          100% {
            transform: translateX(0) rotate(360deg);
          }
        }
        .animate-star-roll {
          animation: star-roll 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

/**
 * 功能特性卡片
 */
const FeatureCard = ({ icon, title, desc }) => {
  return (
    <div className="group p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
        </div>
      </div>
    </div>
  )
}

export default DouyinParserHero
