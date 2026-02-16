import { useEffect, useState, useCallback } from 'react'
import SmartLink from '@/components/SmartLink'
import { getThemeConfig } from '../config'

/**
 * 二次元萌化标签云组件 (KawaiiTagCloud)
 * 设计特点：
 * - Claymorphism 黏土风格：柔和3D、圆润边缘、双层阴影
 * - Y2K 美学：霓虹粉、渐变、光泽感
 * - 弹性动画：悬停时弹跳效果
 * - 热度可视化：大小和颜色深浅表示标签热度
 */
const KawaiiTagCloud = ({ tags }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredTag, setHoveredTag] = useState(null)
  const [pressedTag, setPressedTag] = useState(null)

  // 获取配置
  const enabled = getThemeConfig('TAG_CLOUD.ENABLE', true)
  const maxTags = getThemeConfig('TAG_CLOUD.MAX_TAGS', 20)
  const enableBounce = getThemeConfig('TAG_CLOUD.ENABLE_BOUNCE', true)
  const enableSizeVariation = getThemeConfig('TAG_CLOUD.ENABLE_SIZE_VARIATION', true)

  // 二次元配色方案 - 霓虹糖果色
  const colorSchemes = [
    {
      name: 'sakura',
      bg: 'bg-gradient-to-br from-pink-300 via-pink-400 to-rose-400',
      border: 'border-pink-200',
      shadow: 'shadow-pink-300/50',
      text: 'text-white',
      glow: 'shadow-pink-400/60'
    },
    {
      name: 'sky',
      bg: 'bg-gradient-to-br from-sky-300 via-blue-400 to-indigo-400',
      border: 'border-sky-200',
      shadow: 'shadow-sky-300/50',
      text: 'text-white',
      glow: 'shadow-blue-400/60'
    },
    {
      name: 'mint',
      bg: 'bg-gradient-to-br from-emerald-300 via-teal-400 to-cyan-400',
      border: 'border-emerald-200',
      shadow: 'shadow-emerald-300/50',
      text: 'text-white',
      glow: 'shadow-teal-400/60'
    },
    {
      name: 'lavender',
      bg: 'bg-gradient-to-br from-violet-300 via-purple-400 to-fuchsia-400',
      border: 'border-violet-200',
      shadow: 'shadow-violet-300/50',
      text: 'text-white',
      glow: 'shadow-purple-400/60'
    },
    {
      name: 'peach',
      bg: 'bg-gradient-to-br from-orange-300 via-amber-400 to-yellow-400',
      border: 'border-orange-200',
      shadow: 'shadow-orange-300/50',
      text: 'text-white',
      glow: 'shadow-amber-400/60'
    },
    {
      name: 'coral',
      bg: 'bg-gradient-to-br from-rose-300 via-red-400 to-pink-400',
      border: 'border-rose-200',
      shadow: 'shadow-rose-300/50',
      text: 'text-white',
      glow: 'shadow-red-400/60'
    }
  ]

  // 计算标签热度
  const getTagHeat = useCallback((count) => {
    if (!enableSizeVariation) return 'medium'
    if (count >= 15) return 'hot'
    if (count >= 8) return 'warm'
    return 'cool'
  }, [enableSizeVariation])

  // 获取标签大小和样式
  const getTagStyle = useCallback((heat, index) => {
    const colorScheme = colorSchemes[index % colorSchemes.length]
    
    switch (heat) {
      case 'hot':
        return {
          sizeClass: 'text-sm px-4 py-2.5 scale-110',
          colorScheme,
          zIndex: 10
        }
      case 'warm':
        return {
          sizeClass: 'text-xs px-3 py-2',
          colorScheme,
          zIndex: 5
        }
      case 'cool':
      default:
        return {
          sizeClass: 'text-xs px-2.5 py-1.5',
          colorScheme,
          zIndex: 1
        }
    }
  }, [colorSchemes])

  // 延迟显示动画
  useEffect(() => {
    if (!enabled || !tags || tags.length === 0) return

    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 200)

    return () => clearTimeout(timer)
  }, [enabled, tags])

  if (!enabled || !tags || tags.length === 0) return null

  // 限制显示数量并排序（按文章数降序）
  const displayTags = [...tags]
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, maxTags)

  return (
    <div className="anime-glass rounded-3xl p-6 anime-card relative overflow-hidden">
      {/* 装饰背景 */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl" />
      
      {/* 标题区域 */}
      <div className="relative flex items-center gap-3 mb-5">
        <div className="relative">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-400/30">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          {/* 装饰小星星 */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 dark:text-white text-lg">
            标签云
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            发现更多有趣内容 ✨
          </p>
        </div>
      </div>

      {/* 标签云区域 */}
      <div className="relative flex flex-wrap gap-3 justify-center">
        {displayTags.map((tag, index) => {
          const heat = getTagHeat(tag.count || 0)
          const { sizeClass, colorScheme, zIndex } = getTagStyle(heat, index)
          const isHovered = hoveredTag === tag.name
          const isPressed = pressedTag === tag.name

          return (
            <SmartLink
              key={tag.name}
              href={`/tag/${encodeURIComponent(tag.name)}`}
              className={`
                relative inline-flex items-center gap-1.5
                rounded-2xl font-bold
                ${colorScheme.bg} ${colorScheme.text}
                border-2 ${colorScheme.border}
                ${sizeClass}
                cursor-pointer select-none
                transition-all duration-200 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                ${enableBounce && isHovered ? 'animate-kawaii-bounce' : ''}
                ${isPressed ? 'scale-95' : 'scale-100'}
                hover:shadow-xl ${colorScheme.glow}
                active:scale-95
              `}
              style={{
                transitionDelay: `${index * 40}ms`,
                zIndex: isHovered ? 20 : zIndex,
                // Claymorphism 双层阴影效果
                boxShadow: isPressed
                  ? `inset 2px 2px 6px rgba(0,0,0,0.2), inset -1px -1px 3px rgba(255,255,255,0.3)`
                  : isHovered
                    ? `0 8px 25px -5px ${colorScheme.shadow.replace('shadow-', '').replace('/50', '')}, 
                       inset -2px -2px 6px rgba(255,255,255,0.4), 
                       inset 2px 2px 6px rgba(0,0,0,0.1)`
                    : `0 4px 15px -3px ${colorScheme.shadow.replace('shadow-', '').replace('/50', '')}, 
                       inset -1px -1px 3px rgba(255,255,255,0.3), 
                       inset 1px 1px 3px rgba(0,0,0,0.1)`
              }}
              onMouseEnter={() => setHoveredTag(tag.name)}
              onMouseLeave={() => {
                setHoveredTag(null)
                setPressedTag(null)
              }}
              onMouseDown={() => setPressedTag(tag.name)}
              onMouseUp={() => setPressedTag(null)}
            >
              {/* 高光效果 - Claymorphism 特征 */}
              <span className="absolute top-1 left-2 right-2 h-1/3 bg-gradient-to-b from-white/40 to-transparent rounded-t-xl pointer-events-none" />
              
              {/* 标签文字 */}
              <span className="relative z-10 drop-shadow-sm">
                {tag.name}
              </span>

              {/* 文章数量徽章 */}
              <span 
                className={`
                  relative z-10 text-[10px] font-bold
                  bg-white/30 backdrop-blur-sm
                  px-1.5 py-0.5 rounded-full
                  border border-white/20
                  transition-all duration-200
                  ${isHovered ? 'bg-white/50 scale-110' : ''}
                `}
              >
                {tag.count || 0}
              </span>

              {/* 悬停时的装饰效果 */}
              {isHovered && (
                <>
                  {/* 闪光效果 */}
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
                  {/* 小星星 */}
                  <span className="absolute -top-2 -left-1 text-yellow-300 text-xs animate-bounce">
                    ✦
                  </span>
                </>
              )}
            </SmartLink>
          )
        })}
      </div>

      {/* 底部提示 */}
      {tags.length > maxTags && (
        <div className="relative mt-5 text-center">
          <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" />
            还有 {tags.length - maxTags} 个标签等你发现
          </span>
        </div>
      )}
    </div>
  )
}

export default KawaiiTagCloud
