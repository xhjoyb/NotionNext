import React from 'react'

/**
 * 二次元萌化图片懒加载动画组件
 * 替代传统的骨架屏，使用可爱的加载动画
 */
const KawaiiImageLoader = ({ className = '', size = 'md' }) => {
  // 尺寸配置
  const sizes = {
    xs: { container: 'w-12 h-12', cat: 'w-8 h-8' },
    sm: { container: 'w-16 h-16', cat: 'w-10 h-10' },
    md: { container: 'w-24 h-24', cat: 'w-14 h-14' },
    lg: { container: 'w-32 h-32', cat: 'w-20 h-20' },
    xl: { container: 'w-40 h-40', cat: 'w-24 h-24' },
    full: { container: 'w-full h-full', cat: 'w-20 h-20' }
  }

  const { container, cat } = sizes[size] || sizes.md

  return (
    <div className={`${container} ${className} relative flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden`}>
      {/* 背景装饰圆点 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-2 left-3 w-2 h-2 bg-pink-300 rounded-full animate-pulse" />
        <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse delay-150" />
        <div className="absolute bottom-3 left-5 w-1 h-1 bg-yellow-300 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-5 right-3 w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-500" />
      </div>

      {/* 旋转的星星装饰 */}
      <div className="absolute inset-0 animate-spin-slow">
        <svg className="absolute top-1 left-1/2 w-3 h-3 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <svg className="absolute bottom-2 right-1/3 w-2 h-2 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>

      {/* 萌猫SVG动画 */}
      <div className={`${cat} relative animate-bounce-gentle`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* 猫身体 */}
          <ellipse cx="50" cy="60" rx="25" ry="20" fill="#F472B6" />
          
          {/* 猫头 */}
          <circle cx="50" cy="40" r="18" fill="#F472B6" />
          
          {/* 猫耳朵 */}
          <path d="M35 28 L30 15 L42 25 Z" fill="#F472B6" />
          <path d="M65 28 L70 15 L58 25 Z" fill="#F472B6" />
          <path d="M37 26 L33 18 L40 24 Z" fill="#FBCFE8" />
          <path d="M63 26 L67 18 L60 24 Z" fill="#FBCFE8" />
          
          {/* 眼睛 */}
          <ellipse cx="43" cy="38" rx="4" ry="5" fill="#1F2937">
            <animate attributeName="ry" values="5;0.5;5" dur="2s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="57" cy="38" rx="4" ry="5" fill="#1F2937">
            <animate attributeName="ry" values="5;0.5;5" dur="2s" repeatCount="indefinite" />
          </ellipse>
          
          {/* 眼睛高光 */}
          <circle cx="44" cy="36" r="1.5" fill="white" />
          <circle cx="58" cy="36" r="1.5" fill="white" />
          
          {/* 鼻子 */}
          <path d="M48 44 L52 44 L50 47 Z" fill="#F87171" />
          
          {/* 嘴巴 */}
          <path d="M45 48 Q50 52 55 48" stroke="#1F2937" strokeWidth="1.5" fill="none" />
          
          {/* 腮红 */}
          <ellipse cx="35" cy="42" rx="4" ry="2.5" fill="#FBCFE8" opacity="0.6" />
          <ellipse cx="65" cy="42" rx="4" ry="2.5" fill="#FBCFE8" opacity="0.6" />
          
          {/* 胡须 */}
          <line x1="25" y1="40" x2="32" y2="42" stroke="#1F2937" strokeWidth="0.8" />
          <line x1="25" y1="44" x2="32" y2="44" stroke="#1F2937" strokeWidth="0.8" />
          <line x1="75" y1="40" x2="68" y2="42" stroke="#1F2937" strokeWidth="0.8" />
          <line x1="75" y1="44" x2="68" y2="44" stroke="#1F2937" strokeWidth="0.8" />
          
          {/* 尾巴 - 摇摆动画 */}
          <path d="M75 60 Q85 50 80 40" stroke="#F472B6" strokeWidth="6" fill="none" strokeLinecap="round">
            <animate attributeName="d" values="M75 60 Q85 50 80 40;M75 60 Q95 55 90 45;M75 60 Q85 50 80 40" dur="1s" repeatCount="indefinite" />
          </path>
          
          {/* 爪子 */}
          <ellipse cx="35" cy="75" rx="5" ry="3" fill="#FBCFE8" />
          <ellipse cx="65" cy="75" rx="5" ry="3" fill="#FBCFE8" />
        </svg>
      </div>

      {/* 加载文字 */}
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <span className="text-xs text-pink-400 font-medium animate-pulse">加载中...</span>
      </div>

      {/* 进度条 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-100 dark:bg-gray-700">
        <div className="h-full bg-gradient-to-r from-pink-400 to-purple-400 animate-loading-bar" />
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 1.5s ease-in-out infinite;
        }
        @keyframes loading-bar {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 70%; margin-left: 0%; }
          100% { width: 0%; margin-left: 100%; }
        }
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default KawaiiImageLoader
