import { useEffect, useState, useCallback, useRef } from 'react'
import { getThemeConfig } from '../config'

// 弹幕颜色配置
const DANMAKU_COLORS = [
  '#FF6B9D', // 粉色
  '#C084FC', // 紫色
  '#60A5FA', // 蓝色
  '#FCD34D', // 黄色
  '#34D399', // 绿色
  '#F97316', // 橙色
  '#EC4899', // 深粉
  '#8B5CF6', // 深紫
]

/**
 * 弹幕评论组件 (DanmakuComments)
 *
 * 设计特点：
 * - 类似 B站的弹幕效果，评论从右向左飘过
 * - 可以开关控制
 * - 支持自定义弹幕内容
 * - 多种颜色随机显示
 * - 可调节速度和密度
 *
 * UX 最佳实践：
 * - 使用 ease-out 缓动函数让动画更自然
 * - 尊重用户减少动画偏好
 * - 提供明显的开关控制
 * - 弹幕不遮挡主要内容
 */
const DanmakuComments = () => {
  const [isEnabled, setIsEnabled] = useState(true)
  const [comments, setComments] = useState([])
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef(null)
  const commentIdRef = useRef(0)

  // 获取配置
  let enabled = true
  let speed = 10
  let density = 2
  let maxComments = 6
  let commentsList = []

  try {
    enabled = getThemeConfig('DANMAKU.ENABLE', true)
    speed = getThemeConfig('DANMAKU.SPEED', 10)
    density = getThemeConfig('DANMAKU.DENSITY', 2)
    maxComments = getThemeConfig('DANMAKU.MAX_COMMENTS', 6)
    commentsList = getThemeConfig('DANMAKU.COMMENTS', [])
  } catch (e) {
    // 使用默认值
  }

  // 监听开关事件
  useEffect(() => {
    const handleToggle = (e) => {
      setIsEnabled(e.detail.enabled)
    }
    window.addEventListener('danmaku-toggle', handleToggle)

    // 从 localStorage 读取初始状态
    const savedState = localStorage.getItem('danmaku-enabled')
    if (savedState !== null) {
      setIsEnabled(savedState === 'true')
    }

    return () => window.removeEventListener('danmaku-toggle', handleToggle)
  }, [])

  // 生成随机弹幕
  const generateComment = useCallback(() => {
    // 如果没有配置弹幕，返回 null
    if (!commentsList || commentsList.length === 0) return null

    const comment = commentsList[Math.floor(Math.random() * commentsList.length)]
    const color = DANMAKU_COLORS[Math.floor(Math.random() * DANMAKU_COLORS.length)]
    // 分散弹幕位置，避免重叠：将屏幕分成 maxComments 个区域
    const sectionHeight = 60 / maxComments // 60% 的屏幕高度用于弹幕
    const sectionIndex = comments.length % maxComments
    const top = 10 + sectionIndex * sectionHeight + Math.random() * (sectionHeight * 0.6)
    const scale = 0.85 + Math.random() * 0.3 // 0.85 - 1.15 的缩放
    const duration = (speed + Math.random() * 3) * 1000 // 随机动画时长 10-13秒

    return {
      id: commentIdRef.current++,
      text: comment.text,
      author: comment.author,
      color,
      top,
      scale,
      duration,
    }
  }, [commentsList, speed, maxComments, comments.length])

  // 添加弹幕
  const addComment = useCallback(() => {
    if (!isEnabled || comments.length >= maxComments) return

    const newComment = generateComment()
    if (!newComment) return // 如果没有弹幕数据，不添加

    setComments(prev => [...prev, newComment])
  }, [isEnabled, comments.length, maxComments, generateComment])

  // 移除弹幕
  const removeComment = useCallback((id) => {
    setComments(prev => prev.filter(c => c.id !== id))
  }, [])

  // 组件挂载时设置 mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  // 定时添加弹幕
  useEffect(() => {
    if (!enabled || !isEnabled || !commentsList || commentsList.length === 0) {
      // 如果禁用，清空现有弹幕
      setComments([])
      return
    }

    // 降低添加频率，每 2 秒检查一次
    const interval = setInterval(() => {
      // 密度 2 表示 20% 概率添加弹幕
      if (Math.random() < density / 10) {
        addComment()
      }
    }, 2000)

    // 初始只添加 1-2 个弹幕，分散显示
    const initialCount = Math.min(2, maxComments)
    for (let i = 0; i < initialCount; i++) {
      setTimeout(() => addComment(), i * 1500)
    }

    return () => clearInterval(interval)
  }, [enabled, isEnabled, density, addComment, commentsList, maxComments])

  if (!enabled || !mounted) return null

  return (
    <>
      {/* 弹幕容器 */}
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
        style={{ top: '60px', height: 'calc(100vh - 60px)' }}
      >
        {comments.map(comment => (
          <DanmakuItem
            key={comment.id}
            comment={comment}
            onComplete={() => removeComment(comment.id)}
          />
        ))}
      </div>
    </>
  )
}

/**
 * 单个弹幕项
 */
const DanmakuItem = ({ comment, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 延迟显示以触发动画
    const timer = setTimeout(() => setIsVisible(true), 50)

    // 动画结束后移除
    const completeTimer = setTimeout(() => {
      onComplete()
    }, comment.duration)

    return () => {
      clearTimeout(timer)
      clearTimeout(completeTimer)
    }
  }, [comment.duration, onComplete])

  return (
    <div
      className={`
        absolute whitespace-nowrap
        text-sm font-medium
        px-3 py-1 rounded-full
        transition-opacity duration-300
        ${isVisible ? 'opacity-90' : 'opacity-0'}
      `}
      style={{
        top: `${comment.top}%`,
        left: '100%',
        color: comment.color,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(4px)',
        border: `1px solid ${comment.color}30`,
        transform: `scale(${comment.scale})`,
        animation: isVisible ? `danmaku-float ${comment.duration}ms linear forwards` : 'none',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      }}
    >
      <span className="opacity-80 mr-1">{comment.author}:</span>
      <span>{comment.text}</span>
    </div>
  )
}

export default DanmakuComments
