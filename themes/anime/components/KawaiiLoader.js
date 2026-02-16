import { useEffect, useState } from 'react'
import { getThemeConfig } from '../config'

// Memphis Design 配色 - 移到组件外部避免重复创建
const MEMPHIS_COLORS = {
  pink: '#FF71CE',
  yellow: '#FFCE5C',
  teal: '#86CCCA',
  purple: '#6A7BB4',
  white: '#FFFFFF'
}

// 尺寸配置 - 移到组件外部
const SIZE_CONFIG = {
  sm: { container: 'w-16 h-16', icon: 'w-6 h-6' },
  md: { container: 'w-24 h-24', icon: 'w-10 h-10' },
  lg: { container: 'w-32 h-32', icon: 'w-14 h-14' }
}

/**
 * 萌化加载动画组件 (KawaiiLoader)
 * 设计特点：
 * - Memphis Design 风格：几何形状、鲜艳色彩、80年代后现代美学
 * - 多种加载动画：旋转星星、跳动爱心、几何组合
 * - 页面切换或数据加载时显示
 */
const KawaiiLoader = ({ 
  type = 'default',
  text = '加载中...',
  show = true,
  fullscreen = false,
  size = 'md'
}) => {
  const [mounted, setMounted] = useState(false)
  
  // 所有 Hooks 必须在任何条件逻辑之前调用
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // 获取配置 - 使用 try-catch 避免潜在错误
  let enabled = true
  let defaultType = 'star'
  let enableText = true
  
  try {
    enabled = getThemeConfig('LOADER.ENABLE', true)
    defaultType = getThemeConfig('LOADER.DEFAULT_TYPE', 'star')
    enableText = getThemeConfig('LOADER.ENABLE_TEXT', true)
  } catch (e) {
    // 如果配置获取失败，使用默认值
  }
  
  // 实际使用的类型
  const loaderType = type === 'default' ? defaultType : type
  
  // 在 Hooks 之后进行条件返回
  if (!enabled || !show) return null
  
  const { container, icon } = SIZE_CONFIG[size] || SIZE_CONFIG.md
  
  // 旋转星星加载器
  const StarLoader = () => (
    <div className={`${container} relative`}>
      {/* 中心星星 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg 
          className={`${icon} animate-spin`}
          style={{ animationDuration: '2s' }}
          viewBox="0 0 24 24" 
          fill={MEMPHIS_COLORS.pink}
        >
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>
      {/* 环绕的小几何形状 */}
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}>
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
          style={{ backgroundColor: MEMPHIS_COLORS.yellow }}
        />
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2"
          style={{ backgroundColor: MEMPHIS_COLORS.teal, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
        />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5"
          style={{ backgroundColor: MEMPHIS_COLORS.purple, transform: 'translateY(-50%) rotate(45deg)' }}
        />
        <div 
          className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
          style={{ backgroundColor: MEMPHIS_COLORS.pink }}
        />
      </div>
    </div>
  )
  
  // 跳动爱心加载器
  const HeartLoader = () => (
    <div className={`${container} relative flex items-center justify-center`}>
      {/* 背景圆圈 */}
      <div 
        className="absolute inset-0 rounded-full opacity-20 animate-ping"
        style={{ backgroundColor: MEMPHIS_COLORS.pink }}
      />
      {/* 主爱心 */}
      <svg 
        className={`${icon} animate-kawaii-heartbeat`}
        viewBox="0 0 24 24" 
        fill={MEMPHIS_COLORS.pink}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      {/* 装饰小点 */}
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
        {[0, 90, 180, 270].map((deg, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: [MEMPHIS_COLORS.yellow, MEMPHIS_COLORS.teal, MEMPHIS_COLORS.purple, MEMPHIS_COLORS.pink][i],
              top: '50%',
              left: '50%',
              transform: `rotate(${deg}deg) translateX(28px) translateY(-50%)`,
              transformOrigin: '0 0'
            }}
          />
        ))}
      </div>
    </div>
  )
  
  // 几何组合加载器
  const GeoLoader = () => (
    <div className={`${container} relative`}>
      {/* 旋转的三角形 */}
      <div 
        className="absolute inset-0 flex items-center justify-center animate-spin"
        style={{ animationDuration: '2s' }}
      >
        <div 
          className="w-0 h-0"
          style={{
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderBottom: `20px solid ${MEMPHIS_COLORS.teal}`
          }}
        />
      </div>
      {/* 反向旋转的圆形 */}
      <div 
        className="absolute inset-0 flex items-center justify-center animate-spin"
        style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
      >
        <div 
          className="w-3 h-3 rounded-full border-2"
          style={{ borderColor: MEMPHIS_COLORS.pink, borderTopColor: 'transparent' }}
        />
      </div>
      {/* 脉冲的正方形 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-2 h-2 animate-pulse"
          style={{ 
            backgroundColor: MEMPHIS_COLORS.yellow,
            transform: 'rotate(45deg)'
          }}
        />
      </div>
      {/* 外围装饰 */}
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s' }}>
        {[0, 120, 240].map((deg, i) => (
          <div
            key={i}
            className="absolute w-1 h-3"
            style={{
              backgroundColor: [MEMPHIS_COLORS.purple, MEMPHIS_COLORS.pink, MEMPHIS_COLORS.teal][i],
              top: '50%',
              left: '50%',
              transform: `rotate(${deg}deg) translateX(22px)`,
              transformOrigin: '0 50%'
            }}
          />
        ))}
      </div>
    </div>
  )
  
  // 动漫头像加载器（简化版）
  const AvatarLoader = () => (
    <div className={`${container} relative flex items-center justify-center`}>
      {/* 外圈旋转 */}
      <div 
        className="absolute inset-0 rounded-full border-2 border-dashed animate-spin"
        style={{ 
          borderColor: `${MEMPHIS_COLORS.pink} ${MEMPHIS_COLORS.yellow} ${MEMPHIS_COLORS.teal} ${MEMPHIS_COLORS.purple}`,
          animationDuration: '3s'
        }}
      />
      {/* 内圈 */}
      <div 
        className="absolute inset-2 rounded-full border-2 animate-spin"
        style={{ 
          borderColor: 'transparent transparent transparent ' + MEMPHIS_COLORS.teal,
          animationDuration: '2s',
          animationDirection: 'reverse'
        }}
      />
      {/* 中心笑脸 */}
      <div className="relative">
        <svg 
          className={icon}
          viewBox="0 0 24 24" 
          fill="none"
        >
          {/* 脸 */}
          <circle cx="12" cy="12" r="10" fill={MEMPHIS_COLORS.yellow} />
          {/* 眼睛 */}
          <circle cx="8" cy="10" r="1.5" fill={MEMPHIS_COLORS.purple} />
          <circle cx="16" cy="10" r="1.5" fill={MEMPHIS_COLORS.purple} />
          {/* 腮红 */}
          <circle cx="6" cy="13" r="1.5" fill={MEMPHIS_COLORS.pink} opacity="0.6" />
          <circle cx="18" cy="13" r="1.5" fill={MEMPHIS_COLORS.pink} opacity="0.6" />
          {/* 嘴巴 */}
          <path 
            d="M8 15 Q12 18 16 15" 
            stroke={MEMPHIS_COLORS.purple} 
            strokeWidth="1.5" 
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        {/* 眨眼动画 */}
        <div 
          className="absolute top-3 left-2 w-1.5 h-1.5 bg-purple-600 rounded-full animate-pulse"
          style={{ animationDuration: '1.5s' }}
        />
        <div 
          className="absolute top-3 right-2 w-1.5 h-1.5 bg-purple-600 rounded-full animate-pulse"
          style={{ animationDuration: '1.5s', animationDelay: '0.1s' }}
        />
      </div>
    </div>
  )
  
  // 根据类型选择加载器
  const renderLoader = () => {
    switch (loaderType) {
      case 'star':
        return <StarLoader />
      case 'heart':
        return <HeartLoader />
      case 'geo':
        return <GeoLoader />
      case 'avatar':
        return <AvatarLoader />
      default:
        return <StarLoader />
    }
  }
  
  const loaderContent = (
    <div className={`flex flex-col items-center gap-6 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} transition-all duration-300`}>
      {/* 加载动画 */}
      {renderLoader()}
      
      {/* 加载文字 */}
      {enableText && text && (
        <div className="flex flex-col items-center gap-3 mt-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {text}
          </span>
          {/*  Memphis 风格装饰点 */}
          <div className="flex gap-1">
            {[MEMPHIS_COLORS.pink, MEMPHIS_COLORS.yellow, MEMPHIS_COLORS.teal].map((color, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{ 
                  backgroundColor: color,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.8s'
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
  
  // 全屏模式
  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        {loaderContent}
      </div>
    )
  }
  
  // 内联模式
  return (
    <div className="flex items-center justify-center p-8">
      {loaderContent}
    </div>
  )
}

export default KawaiiLoader
