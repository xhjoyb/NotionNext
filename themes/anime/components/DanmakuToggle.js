import { useState, useEffect } from 'react'
import { getThemeConfig } from '../config'

// 萌化配色
const KAWAII_COLORS = {
  pink: '#FF6B9D',
  purple: '#C084FC',
  yellow: '#FCD34D',
}

/**
 * 萌化弹幕开关组件
 *
 * 设计特点：
 * - 可爱的猫咪/爪印造型
 * - 开启时猫咪眨眼动画
 * * - 关闭时猫咪睡觉表情
 * - 粉色渐变配色，符合二次元萌系风格
 */
const DanmakuToggle = () => {
  const [isEnabled, setIsEnabled] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // 获取配置
  let showToggle = true
  try {
    showToggle = getThemeConfig('DANMAKU.SHOW_TOGGLE', true)
  } catch (e) {
    // 使用默认值
  }

  useEffect(() => {
    setMounted(true)
    // 从 localStorage 读取状态
    const savedState = localStorage.getItem('danmaku-enabled')
    if (savedState !== null) {
      setIsEnabled(savedState === 'true')
    }
  }, [])

  const toggleDanmaku = () => {
    setIsAnimating(true)
    const newState = !isEnabled
    setIsEnabled(newState)
    // 保存到 localStorage
    localStorage.setItem('danmaku-enabled', newState.toString())
    // 触发自定义事件，通知 DanmakuComments 组件
    window.dispatchEvent(new CustomEvent('danmaku-toggle', { detail: { enabled: newState } }))

    // 重置动画状态
    setTimeout(() => setIsAnimating(false), 300)
  }

  if (!showToggle || !mounted) return null

  return (
    <button
      onClick={toggleDanmaku}
      className={`
        relative w-10 h-10 rounded-full
        transition-all duration-300 ease-out
        cursor-pointer
        flex items-center justify-center
        hover:scale-110
        ${isEnabled
          ? 'bg-gradient-to-br from-pink-400 to-pink-500 shadow-pink-300/50'
          : 'bg-gradient-to-br from-gray-300 to-gray-400 shadow-gray-300/50'
        }
        shadow-lg
        border-2 border-white/30
      `}
      title={isEnabled ? '关闭弹幕' : '开启弹幕'}
      aria-label={isEnabled ? '关闭弹幕' : '开启弹幕'}
    >
      {/* 萌化猫咪 SVG */}
      <svg
        viewBox="0 0 40 40"
        className={`w-7 h-7 transition-transform duration-300 ${isAnimating ? 'scale-90' : 'scale-100'}`}
      >
        {isEnabled ? (
          // 开启状态 - 醒着的猫咪
          <>
            {/* 猫耳朵 */}
            <path
              d="M8 12 L5 4 L14 10 Z"
              fill={KAWAII_COLORS.yellow}
            />
            <path
              d="M32 12 L35 4 L26 10 Z"
              fill={KAWAII_COLORS.yellow}
            />
            {/* 猫脸 */}
            <ellipse
              cx="20"
              cy="22"
              rx="12"
              ry="10"
              fill="white"
            />
            {/* 眼睛 - 眨眼动画 */}
            <ellipse
              cx="15"
              cy="20"
              rx="2"
              ry="3"
              fill={KAWAII_COLORS.purple}
              className="animate-blink"
            />
            <ellipse
              cx="25"
              cy="20"
              rx="2"
              ry="3"
              fill={KAWAII_COLORS.purple}
              className="animate-blink"
            />
            {/* 腮红 */}
            <circle
              cx="11"
              cy="24"
              r="2"
              fill={KAWAII_COLORS.pink}
              opacity="0.6"
            />
            <circle
              cx="29"
              cy="24"
              r="2"
              fill={KAWAII_COLORS.pink}
              opacity="0.6"
            />
            {/* 嘴巴 - 微笑 */}
            <path
              d="M18 26 Q20 28 22 26"
              stroke={KAWAII_COLORS.purple}
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* 弹幕气泡 */}
            <circle
              cx="32"
              cy="8"
              r="3"
              fill={KAWAII_COLORS.yellow}
              className="animate-pulse"
            />
            <circle
              cx="28"
              cy="6"
              r="2"
              fill={KAWAII_COLORS.pink}
              className="animate-pulse"
              style={{ animationDelay: '0.2s' }}
            />
          </>
        ) : (
          // 关闭状态 - 睡觉的猫咪
          <>
            {/* 猫耳朵 */}
            <path
              d="M8 12 L5 4 L14 10 Z"
              fill="#9CA3AF"
            />
            <path
              d="M32 12 L35 4 L26 10 Z"
              fill="#9CA3AF"
            />
            {/* 猫脸 */}
            <ellipse
              cx="20"
              cy="22"
              rx="12"
              ry="10"
              fill="#E5E7EB"
            />
            {/* 闭着的眼睛 */}
            <path
              d="M12 20 Q15 22 18 20"
              stroke="#6B7280"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M22 20 Q25 22 28 20"
              stroke="#6B7280"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* 腮红 */}
            <circle
              cx="11"
              cy="24"
              r="2"
              fill="#F9A8D4"
              opacity="0.4"
            />
            <circle
              cx="29"
              cy="24"
              r="2"
              fill="#F9A8D4"
              opacity="0.4"
            />
            {/* 嘴巴 */}
            <ellipse
              cx="20"
              cy="26"
              rx="2"
              ry="1.5"
              fill="#6B7280"
            />
            {/* Zzz 睡觉符号 */}
            <text
              x="30"
              y="10"
              fill="#9CA3AF"
              fontSize="8"
              fontWeight="bold"
              className="animate-float"
            >
              Z
            </text>
            <text
              x="34"
              y="6"
              fill="#9CA3AF"
              fontSize="6"
              fontWeight="bold"
              className="animate-float"
              style={{ animationDelay: '0.3s' }}
            >
              z
            </text>
          </>
        )}
      </svg>
    </button>
  )
}

export default DanmakuToggle
