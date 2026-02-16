import { useEffect, useState, useCallback } from 'react'
import { getThemeConfig } from '../config'

// 萌化配色
const KAWAII_COLORS = {
  pink: '#FF6B9D',
  purple: '#C084FC',
  blue: '#60A5FA',
  yellow: '#FCD34D',
  white: '#FFFFFF',
  shadow: 'rgba(255, 107, 157, 0.3)'
}

/**
 * 萌化返回顶部按钮组件 (KawaiiBackToTop)
 *
 * 设计特点：
 * - 可爱的火箭/猫咪形象，带有萌化表情
 * - 点击时有弹跳动画和粒子效果
 * - 滚动到指定位置才显示
 * - 平滑滚动到顶部
 * - 支持多种萌化形象切换
 *
 * UX 最佳实践：
 * - 使用 scroll-behavior: smooth 实现平滑滚动
 * - 滚动阈值可配置，避免过早显示
 * - 悬停和点击有明确的视觉反馈
 * - 尊重用户减少动画偏好
 */
const KawaiiBackToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 获取配置
  let enabled = true
  let showThreshold = 300
  let buttonType = 'rocket'
  let showParticles = true

  try {
    enabled = getThemeConfig('BACK_TO_TOP.ENABLE', true)
    showThreshold = getThemeConfig('BACK_TO_TOP.SHOW_THRESHOLD', 300)
    buttonType = getThemeConfig('BACK_TO_TOP.BUTTON_TYPE', 'rocket')
    showParticles = getThemeConfig('BACK_TO_TOP.SHOW_PARTICLES', true)
  } catch (e) {
    // 使用默认值
  }

  // 监听滚动事件
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY || document.documentElement.scrollTop
    setIsVisible(scrollY > showThreshold)
  }, [showThreshold])

  useEffect(() => {
    setMounted(true)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 初始检查

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // 返回顶部
  const scrollToTop = () => {
    setIsClicked(true)

    // 平滑滚动到顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

    // 重置点击状态
    setTimeout(() => setIsClicked(false), 600)
  }

  if (!enabled || !mounted) return null

  // 萌化火箭 SVG
  const RocketSVG = () => (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      {/* 火箭主体 */}
      <ellipse cx="24" cy="20" rx="10" ry="16" fill={KAWAII_COLORS.pink} />
      {/* 火箭头部 */}
      <path d="M14 20 Q24 0 34 20" fill={KAWAII_COLORS.pink} />
      {/* 火箭窗口 */}
      <circle cx="24" cy="16" r="5" fill={KAWAII_COLORS.white} />
      <circle cx="24" cy="16" r="3" fill={KAWAII_COLORS.blue} />
      {/* 眼睛 */}
      <ellipse cx="20" cy="22" rx="1.5" ry="2" fill={KAWAII_COLORS.white} />
      <ellipse cx="28" cy="22" rx="1.5" ry="2" fill={KAWAII_COLORS.white} />
      <circle cx="20" cy="22" r="0.8" fill={KAWAII_COLORS.purple} />
      <circle cx="28" cy="22" r="0.8" fill={KAWAII_COLORS.purple} />
      {/* 腮红 */}
      <circle cx="17" cy="25" r="2" fill={KAWAII_COLORS.pink} opacity="0.5" />
      <circle cx="31" cy="25" r="2" fill={KAWAII_COLORS.pink} opacity="0.5" />
      {/* 嘴巴 */}
      <path d="M22 26 Q24 28 26 26" stroke={KAWAII_COLORS.purple} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* 火箭翅膀 */}
      <ellipse cx="10" cy="30" rx="4" ry="8" fill={KAWAII_COLORS.purple} transform="rotate(-20 10 30)" />
      <ellipse cx="38" cy="30" rx="4" ry="8" fill={KAWAII_COLORS.purple} transform="rotate(20 38 30)" />
      {/* 火箭火焰 */}
      <path d="M18 36 Q24 48 30 36" fill={KAWAII_COLORS.yellow} />
      <path d="M20 36 Q24 44 28 36" fill={KAWAII_COLORS.pink} />
    </svg>
  )

  // 萌化猫咪 SVG
  const CatSVG = () => (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      {/* 猫耳朵 */}
      <path d="M12 16 L8 4 L20 12 Z" fill={KAWAII_COLORS.pink} />
      <path d="M36 16 L40 4 L28 12 Z" fill={KAWAII_COLORS.pink} />
      {/* 猫脸 */}
      <ellipse cx="24" cy="26" rx="16" ry="14" fill={KAWAII_COLORS.pink} />
      {/* 眼睛 */}
      <ellipse cx="18" cy="24" rx="3" ry="4" fill={KAWAII_COLORS.white} />
      <ellipse cx="30" cy="24" rx="3" ry="4" fill={KAWAII_COLORS.white} />
      <circle cx="18" cy="24" r="1.5" fill={KAWAII_COLORS.purple} />
      <circle cx="30" cy="24" r="1.5" fill={KAWAII_COLORS.purple} />
      {/* 腮红 */}
      <circle cx="14" cy="28" r="2.5" fill={KAWAII_COLORS.pink} opacity="0.6" />
      <circle cx="34" cy="28" r="2.5" fill={KAWAII_COLORS.pink} opacity="0.6" />
      {/* 鼻子 */}
      <path d="M22 28 L26 28 L24 30 Z" fill={KAWAII_COLORS.purple} />
      {/* 嘴巴 */}
      <path d="M24 30 Q20 34 18 32" stroke={KAWAII_COLORS.purple} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M24 30 Q28 34 30 32" stroke={KAWAII_COLORS.purple} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* 胡须 */}
      <line x1="8" y1="26" x2="14" y2="27" stroke={KAWAII_COLORS.purple} strokeWidth="1" />
      <line x1="8" y1="30" x2="14" y2="29" stroke={KAWAII_COLORS.purple} strokeWidth="1" />
      <line x1="40" y1="26" x2="34" y2="27" stroke={KAWAII_COLORS.purple} strokeWidth="1" />
      <line x1="40" y1="30" x2="34" y2="29" stroke={KAWAII_COLORS.purple} strokeWidth="1" />
      {/* 向上箭头 */}
      <path d="M24 8 L20 14 L28 14 Z" fill={KAWAII_COLORS.white} />
      <rect x="22" y="14" width="4" height="6" fill={KAWAII_COLORS.white} />
    </svg>
  )

  // 萌化星星 SVG
  const StarSVG = () => (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      {/* 星星主体 */}
      <path
        d="M24 4 L28 18 L42 18 L31 26 L35 40 L24 32 L13 40 L17 26 L6 18 L20 18 Z"
        fill={KAWAII_COLORS.yellow}
      />
      {/* 眼睛 */}
      <ellipse cx="19" cy="22" rx="2" ry="2.5" fill={KAWAII_COLORS.white} />
      <ellipse cx="29" cy="22" rx="2" ry="2.5" fill={KAWAII_COLORS.white} />
      <circle cx="19" cy="22" r="1" fill={KAWAII_COLORS.purple} />
      <circle cx="29" cy="22" r="1" fill={KAWAII_COLORS.purple} />
      {/* 腮红 */}
      <circle cx="16" cy="26" r="2" fill={KAWAII_COLORS.pink} opacity="0.5" />
      <circle cx="32" cy="26" r="2" fill={KAWAII_COLORS.pink} opacity="0.5" />
      {/* 微笑 */}
      <path d="M20 28 Q24 31 28 28" stroke={KAWAII_COLORS.purple} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )

  // 根据类型选择 SVG
  const renderIcon = () => {
    switch (buttonType) {
      case 'cat':
        return <CatSVG />
      case 'star':
        return <StarSVG />
      case 'rocket':
      default:
        return <RocketSVG />
    }
  }

  return (
    <>
      {/* 粒子效果 */}
      {showParticles && isClicked && (
        <div className="fixed bottom-24 right-6 pointer-events-none z-50">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-particle"
              style={{
                backgroundColor: [KAWAII_COLORS.pink, KAWAII_COLORS.yellow, KAWAII_COLORS.purple, KAWAII_COLORS.blue][i % 4],
                left: `${Math.cos((i * 60 * Math.PI) / 180) * 20}px`,
                top: `${Math.sin((i * 60 * Math.PI) / 180) * 20}px`,
                animationDelay: `${i * 0.1}s`,
                animation: 'particle-burst 0.6s ease-out forwards'
              }}
            />
          ))}
        </div>
      )}

      {/* 返回顶部按钮 */}
      <button
        onClick={scrollToTop}
        className={`
          fixed bottom-6 right-6 z-40
          w-14 h-14 rounded-full
          bg-white dark:bg-gray-800
          shadow-lg hover:shadow-xl
          transition-all duration-300 ease-out
          cursor-pointer
          flex items-center justify-center
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
          ${isClicked ? 'animate-bounce-click' : 'hover:scale-110'}
          border-2 border-pink-200 dark:border-purple-400
        `}
        aria-label="返回顶部"
        title="返回顶部"
      >
        <div className="w-10 h-10">
          {renderIcon()}
        </div>
      </button>
    </>
  )
}

export default KawaiiBackToTop
