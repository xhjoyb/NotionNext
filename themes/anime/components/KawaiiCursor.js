import { useEffect, useRef, useState } from 'react'

const KawaiiCursor = () => {
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [cursorVariant, setCursorVariant] = useState('default')
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // 检测是否为触摸设备
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    if (isTouchDevice) return

    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current
    if (!cursor || !cursorDot) return

    // 隐藏默认光标
    document.body.style.cursor = 'none'

    const handleMouseMove = (e) => {
      // 直接更新位置，无延迟
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    // 检测悬停元素
    const handleMouseOver = (e) => {
      const target = e.target
      const isClickable = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor="pointer"]')
      const isText = target.closest('input[type="text"], textarea, [contenteditable="true"]')

      if (isText) {
        setCursorVariant('text')
      } else if (isClickable) {
        setCursorVariant('pointer')
      } else {
        setCursorVariant('default')
      }
      setIsHovering(!!isClickable || !!isText)
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseover', handleMouseOver, { passive: true })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseover', handleMouseOver)
      document.body.style.cursor = ''
    }
  }, [])

  // 根据状态获取光标样式
  const getCursorContent = () => {
    if (cursorVariant === 'text') {
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full">
          {/* 文本输入光标 - 魔法笔 */}
          <defs>
            <linearGradient id="penGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF71CE" />
              <stop offset="100%" stopColor="#B967FF" />
            </linearGradient>
          </defs>
          <g className={`transition-transform duration-200 ${isClicking ? 'scale-90' : 'scale-100'}`}>
            {/* 笔身 */}
            <path
              d="M28 8L32 12L14 30L10 26L28 8Z"
              fill="url(#penGradient)"
              stroke="white"
              strokeWidth="1.5"
            />
            {/* 笔尖 */}
            <path
              d="M10 26L8 32L14 30L10 26Z"
              fill="#FF71CE"
              stroke="white"
              strokeWidth="1"
            />
            {/* 笔尾装饰 */}
            <circle cx="30" cy="10" r="3" fill="#FFB6C1" stroke="white" strokeWidth="1" />
            {/* 星星装饰 */}
            <circle cx="8" cy="8" r="1.5" fill="#FFD700" className="animate-pulse" />
            <circle cx="32" cy="28" r="1" fill="#FFD700" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
          </g>
        </svg>
      )
    }

    if (cursorVariant === 'pointer') {
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full">
          {/* 指针光标 - 可爱猫爪 */}
          <defs>
            <linearGradient id="pawGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF71CE" />
              <stop offset="100%" stopColor="#FF1493" />
            </linearGradient>
          </defs>
          <g className={`transition-transform duration-200 ${isClicking ? 'scale-90' : 'scale-100'}`}>
            {/* 主肉垫 */}
            <ellipse cx="20" cy="24" rx="10" ry="8" fill="url(#pawGradient)" stroke="white" strokeWidth="1.5" />
            {/* 上肉垫 */}
            <ellipse cx="20" cy="14" rx="6" ry="5" fill="#FFB6C1" stroke="white" strokeWidth="1" />
            {/* 左肉垫 */}
            <ellipse cx="10" cy="20" rx="4" ry="5" fill="#FFB6C1" stroke="white" strokeWidth="1" transform="rotate(-20 10 20)" />
            {/* 右肉垫 */}
            <ellipse cx="30" cy="20" rx="4" ry="5" fill="#FFB6C1" stroke="white" strokeWidth="1" transform="rotate(20 30 20)" />
            {/* 高光 */}
            <ellipse cx="18" cy="22" rx="3" ry="2" fill="rgba(255,255,255,0.6)" />
            {/* 点击时的爱心效果 */}
            {isClicking && (
              <>
                <path d="M20 6C20 6 16 2 12 6C8 10 20 18 20 18C20 18 32 10 28 6C24 2 20 6 20 6Z" fill="#FF1493" className="animate-ping" style={{ transformOrigin: 'center', opacity: 0.5 }} />
              </>
            )}
          </g>
        </svg>
      )
    }

    // 默认光标 - 魔法星星
    return (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <defs>
          <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FF71CE" />
            <stop offset="100%" stopColor="#B967FF" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g className={`transition-transform duration-200 ${isClicking ? 'scale-90 rotate-45' : 'scale-100 rotate-0'}`}>
          {/* 主星星 */}
          <path
            d="M20 4L23.5 14.5L35 15L26 22L29 33L20 27L11 33L14 22L5 15L16.5 14.5L20 4Z"
            fill="url(#starGradient)"
            stroke="white"
            strokeWidth="1.5"
            filter="url(#glow)"
          />
          {/* 小星星装饰 */}
          <circle cx="8" cy="8" r="1.5" fill="#FFD700" className="animate-pulse" />
          <circle cx="32" cy="10" r="1" fill="#FFD700" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
          <circle cx="10" cy="32" r="1" fill="#FFD700" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
          {/* 中心高光 */}
          <circle cx="20" cy="20" r="3" fill="rgba(255,255,255,0.4)" />
        </g>
      </svg>
    )
  }

  // 触摸设备不渲染
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      {/* 主光标 - 直接跟随鼠标，无延迟 */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-10 h-10 pointer-events-none z-[99999] transition-transform duration-100 ${
          isHovering ? 'scale-125' : 'scale-100'
        }`}
        style={{
          transform: `translate(${position.x - 20}px, ${position.y - 20}px)`,
          willChange: 'transform'
        }}
      >
        {getCursorContent()}
      </div>

      {/* 跟随点 - 直接跟随鼠标 */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[99999] ${
          cursorVariant === 'pointer'
            ? 'bg-pink-400 scale-0'
            : cursorVariant === 'text'
            ? 'bg-purple-400 scale-0'
            : 'bg-gradient-to-br from-yellow-300 to-pink-400'
        } ${isHovering ? 'opacity-0' : 'opacity-100'}`}
        style={{
          transform: `translate(${position.x - 4}px, ${position.y - 4}px)`,
          willChange: 'transform'
        }}
      />

      {/* 全局样式 - 隐藏默认光标 */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        
        /* 触摸设备恢复默认光标 */
        @media (pointer: coarse) {
          * {
            cursor: auto !important;
          }
        }

        /* 减少动画偏好 */
        @media (prefers-reduced-motion: reduce) {
          .kawaii-cursor {
            transition: none !important;
          }
        }
      `}</style>
    </>
  )
}

export default KawaiiCursor
