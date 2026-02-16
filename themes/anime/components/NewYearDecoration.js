/**
 * TODO: [春节装饰] 2026马年春节临时装饰组件，年后移除
 * 添加时间: 2026-02-16 (除夕)
 * 移除时间: 2026-03-05 (元宵节后)
 *
 * 移除方法:
 * 1. 删除本文件: ./NewYearDecoration.js
 * 2. 删除 Header.js 中的 import 和组件使用
 * 3. 删除 config.js 中的 NEW_YEAR 配置
 * 4. 删除 style.js 中的 swing 动画
 */

import { useEffect, useState } from 'react'
import { getThemeConfig } from '../config'

// 春节配色
const CNY_COLORS = {
  red: '#DC2626',
  gold: '#FBBF24',
  lightRed: '#FEF2F2',
  darkRed: '#7F1D1D',
  orange: '#F97316'
}

/**
 * 除夕马年萌化导航栏装饰组件
 * 设计特点：
 * - 萌化小马图标，带有弹跳动画
 * - 春节红色金色配色
 * - 飘落的梅花/红包装饰
 * - 除夕倒计时或祝福语
 */
const NewYearDecoration = () => {
  const [mounted, setMounted] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    // 延迟显示祝福语动画
    const timer = setTimeout(() => setShowGreeting(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // 获取配置
  let enabled = true
  let showHorse = true
  let showLantern = true
  let greetingText = '除夕快乐'
  
  try {
    enabled = getThemeConfig('NEW_YEAR.ENABLE', true)
    showHorse = getThemeConfig('NEW_YEAR.SHOW_HORSE', true)
    showLantern = getThemeConfig('NEW_YEAR.SHOW_LANTERN', true)
    greetingText = getThemeConfig('NEW_YEAR.GREETING', '除夕快乐')
  } catch (e) {
    // 使用默认值
  }
  
  if (!enabled) return null

  return (
    <div className="flex items-center gap-2">
      {/* 萌化小马 */}
      {showHorse && (
        <div 
          className={`relative group cursor-pointer transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
          title="马年大吉"
        >
          <div className="relative w-10 h-10">
            {/* 小马 SVG */}
            <svg 
              viewBox="0 0 48 48" 
              className="w-full h-full animate-kawaii-bounce"
              style={{ animationDuration: '2s', animationIterationCount: 'infinite' }}
            >
              {/* 马身体 */}
              <ellipse cx="24" cy="30" rx="14" ry="10" fill={CNY_COLORS.red} />
              {/* 马脖子 */}
              <ellipse cx="32" cy="22" rx="6" ry="10" fill={CNY_COLORS.red} transform="rotate(-20 32 22)" />
              {/* 马头 */}
              <ellipse cx="36" cy="14" rx="7" ry="8" fill={CNY_COLORS.red} />
              {/* 马耳朵 */}
              <ellipse cx="33" cy="8" rx="2" ry="4" fill={CNY_COLORS.red} />
              <ellipse cx="39" cy="8" rx="2" ry="4" fill={CNY_COLORS.red} />
              {/* 马鬃毛 */}
              <path d="M32 10 Q28 8 26 12 Q28 14 32 12" fill={CNY_COLORS.gold} />
              <path d="M34 8 Q30 6 28 10 Q30 12 34 10" fill={CNY_COLORS.gold} />
              {/* 眼睛 */}
              <circle cx="34" cy="13" r="1.5" fill="white" />
              <circle cx="34" cy="13" r="0.8" fill={CNY_COLORS.darkRed} />
              <circle cx="38" cy="13" r="1.5" fill="white" />
              <circle cx="38" cy="13" r="0.8" fill={CNY_COLORS.darkRed} />
              {/* 腮红 */}
              <circle cx="32" cy="16" r="2" fill={CNY_COLORS.gold} opacity="0.6" />
              {/* 马腿 */}
              <rect x="14" y="36" width="4" height="8" rx="2" fill={CNY_COLORS.red} />
              <rect x="20" y="36" width="4" height="8" rx="2" fill={CNY_COLORS.red} />
              <rect x="26" y="36" width="4" height="8" rx="2" fill={CNY_COLORS.red} />
              <rect x="32" y="36" width="4" height="8" rx="2" fill={CNY_COLORS.red} />
              {/* 马蹄 */}
              <ellipse cx="16" cy="44" rx="3" ry="2" fill={CNY_COLORS.gold} />
              <ellipse cx="22" cy="44" rx="3" ry="2" fill={CNY_COLORS.gold} />
              <ellipse cx="28" cy="44" rx="3" ry="2" fill={CNY_COLORS.gold} />
              <ellipse cx="34" cy="44" rx="3" ry="2" fill={CNY_COLORS.gold} />
              {/* 尾巴 */}
              <path d="M10 28 Q6 30 8 34 Q10 32 12 30" fill={CNY_COLORS.gold} />
              {/* 马鞍 */}
              <ellipse cx="24" cy="28" rx="8" ry="4" fill={CNY_COLORS.gold} opacity="0.8" />
            </svg>
            
            {/* 悬停时显示的祝福语 */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-yellow-100 dark:bg-red-900/50 px-2 py-1 rounded-full border border-red-200">
                马年大吉
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 春节灯笼 */}
      {showLantern && (
        <div 
          className={`relative transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
        >
          <div className="relative w-8 h-10 animate-swing">
            <svg viewBox="0 0 32 40" className="w-full h-full">
              {/* 灯笼提手 */}
              <line x1="16" y1="0" x2="16" y2="6" stroke={CNY_COLORS.gold} strokeWidth="2" />
              {/* 灯笼主体 */}
              <ellipse cx="16" cy="20" rx="12" ry="14" fill={CNY_COLORS.red} />
              {/* 灯笼顶部 */}
              <rect x="10" y="6" width="12" height="4" rx="1" fill={CNY_COLORS.gold} />
              {/* 灯笼底部 */}
              <rect x="10" y="30" width="12" height="4" rx="1" fill={CNY_COLORS.gold} />
              {/* 灯笼穗子 */}
              <line x1="16" y1="34" x2="16" y2="40" stroke={CNY_COLORS.gold} strokeWidth="2" />
              <line x1="13" y1="36" x2="13" y2="40" stroke={CNY_COLORS.gold} strokeWidth="1.5" />
              <line x1="19" y1="36" x2="19" y2="40" stroke={CNY_COLORS.gold} strokeWidth="1.5" />
              {/* 福字 */}
              <text x="16" y="24" textAnchor="middle" fill={CNY_COLORS.gold} fontSize="10" fontWeight="bold">福</text>
            </svg>
          </div>
        </div>
      )}

      {/* 祝福语 */}
      <div 
        className={`hidden sm:flex items-center gap-1 transition-all duration-700 ${showGreeting ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
      >
        <span className="text-sm font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
          {greetingText}
        </span>
        <span className="text-lg animate-bounce">🧧</span>
      </div>
    </div>
  )
}

export default NewYearDecoration
