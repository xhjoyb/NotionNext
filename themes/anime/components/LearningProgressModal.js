import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { getThemeConfig } from '../config'
import SmartLink from '@/components/SmartLink'
import formatDate from '@/lib/utils/formatDate'

/**
 * 学习进度模态框 - 二次元萌系风格
 * 使用 Portal 渲染到 body，避免层叠上下文问题
 */
const LearningProgressModal = ({ isOpen, onClose, posts = [] }) => {
  const [mounted, setMounted] = useState(false)
  const [show, setShow] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const audioRef = useRef(null)

  // 处理关闭动画
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 500) // 等待关闭动画完成
  }

  // 配置
  const title = getThemeConfig('LEARNING_PROGRESS.TITLE', '学习进度')
  const subtitle = getThemeConfig('LEARNING_PROGRESS.SUBTITLE', '记录成长每一步')
  const tag = getThemeConfig('LEARNING_PROGRESS.TAG', '学习')
  const maxPosts = getThemeConfig('LEARNING_PROGRESS.MAX_POSTS', 20)
  const showDate = getThemeConfig('LEARNING_PROGRESS.SHOW_DATE', true)
  const showProgress = getThemeConfig('LEARNING_PROGRESS.SHOW_PROGRESS', true)
  const footerText = getThemeConfig('LEARNING_PROGRESS.FOOTER_TEXT', '最近学习计划进度')
  
  // 背景音乐配置
  const musicEnabled = getThemeConfig('LEARNING_PROGRESS.MUSIC.ENABLE', false)
  const musicUrl = getThemeConfig('LEARNING_PROGRESS.MUSIC.URL', '')
  const musicVolume = getThemeConfig('LEARNING_PROGRESS.MUSIC.VOLUME', 0.5)
  const musicLoop = getThemeConfig('LEARNING_PROGRESS.MUSIC.LOOP', true)

  // 获取文章状态优先级（用于排序）
  const getStatusPriority = (post) => {
    const tags = post?.tags?.map(t => t.toLowerCase()) || []
    if (tags.includes('学习中')) return 0  // 最高优先级
    if (tags.includes('待复习')) return 1  // 次高优先级
    return 2  // 已完成最低优先级
  }

  // 筛选文章并按优先级和时间排序
  const allLearningPosts = posts
    .filter(p => p?.tags?.some(t => t.toLowerCase() === tag.toLowerCase()))
    .sort((a, b) => {
      // 先按状态优先级排序
      const priorityA = getStatusPriority(a)
      const priorityB = getStatusPriority(b)
      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }
      // 同优先级按时间倒序
      return (b?.publishDate || 0) - (a?.publishDate || 0)
    })

  // 截取显示的文章
  const filteredPosts = allLearningPosts.slice(0, maxPosts)

  // 计算进度 - 基于显示的文章
  const total = filteredPosts.length
  const doing = filteredPosts.filter(p =>
    p?.tags?.some(t => t.toLowerCase() === '学习中')
  ).length
  const review = filteredPosts.filter(p =>
    p?.tags?.some(t => t.toLowerCase() === '待复习')
  ).length
  const done = total - doing - review
  // 进度计算：已完成=1，待复习=0.5，学习中=0
  const completedWeight = done * 1 + review * 0.5 + doing * 0
  const percent = total ? Math.round((completedWeight / total) * 100) : 0

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [isOpen])

  // 监听页面滚动，自动关闭模态框
  useEffect(() => {
    if (!isOpen) return

    let lastScrollY = window.scrollY
    const handleScrollClose = () => {
      const currentScrollY = window.scrollY
      // 当滚动距离超过 50px 时关闭模态框
      if (Math.abs(currentScrollY - lastScrollY) > 50) {
        handleClose()
      }
    }

    window.addEventListener('scroll', handleScrollClose, { passive: true })
    return () => window.removeEventListener('scroll', handleScrollClose)
  }, [isOpen])

  // 背景音乐播放控制
  useEffect(() => {
    if (!musicEnabled || !musicUrl) return

    if (isOpen) {
      // 打开模态框时播放音乐
      if (!audioRef.current) {
        audioRef.current = new Audio(musicUrl)
        audioRef.current.volume = musicVolume
        audioRef.current.loop = musicLoop
      }
      audioRef.current.play().catch(() => {
        // 自动播放被阻止，忽略错误
      })
    } else {
      // 关闭模态框时暂停音乐
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [isOpen, musicEnabled, musicUrl, musicVolume, musicLoop])

  const getStatus = (post) => {
    const tags = post?.tags?.map(t => t.toLowerCase()) || []
    if (tags.includes('学习中'))
      return { label: '学习中', class: 'status-doing' }
    if (tags.includes('待复习'))
      return { label: '待复习', class: 'status-review' }
    return { label: '已完成', class: 'status-done' }
  }

  if (!mounted) return null

  const modalContent = (
    <div className={`lp-modal ${show ? 'open' : ''} ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <style>{`
        .lp-modal {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0,0,0,0.6);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          pointer-events: none;
        }
        .lp-modal.open {
          pointer-events: auto;
        }
        .lp-modal.open {
          opacity: 1;
          visibility: visible;
        }
        .lp-box {
          width: 100%;
          max-width: 600px;
          max-height: calc(100vh - 40px);
          background: var(--anime-bg-primary, white);
          border-radius: 20px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
          transform: scale(0) rotate(-180deg);
          opacity: 0;
        }
        .dark .lp-box {
          background: var(--anime-glass-bg, rgba(30, 27, 46, 0.95));
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        /* 魔法阵展开动画 */
        .lp-modal.open .lp-box {
          animation: magicCircleExpand 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes magicCircleExpand {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
            border-radius: 50%;
            filter: blur(20px);
          }
          20% {
            transform: scale(0.3) rotate(-120deg);
            opacity: 0.3;
            border-radius: 45%;
            filter: blur(15px);
          }
          40% {
            transform: scale(0.6) rotate(-60deg);
            opacity: 0.6;
            border-radius: 35%;
            filter: blur(8px);
          }
          60% {
            transform: scale(0.9) rotate(-20deg);
            opacity: 0.9;
            border-radius: 28px;
            filter: blur(3px);
          }
          75% {
            transform: scale(1.05) rotate(5deg);
            opacity: 1;
            border-radius: 22px;
            filter: blur(0);
          }
          90% {
            transform: scale(0.98) rotate(-2deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
            border-radius: 20px;
            filter: blur(0);
          }
        }
        /* 关闭动画 */
        .lp-modal.closing .lp-box {
          animation: magicCircleCollapse 0.4s ease-in forwards;
        }
        @keyframes magicCircleCollapse {
          0% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
            border-radius: 20px;
          }
          50% {
            transform: scale(1.05) rotate(10deg);
          }
          100% {
            transform: scale(0) rotate(180deg);
            opacity: 0;
            border-radius: 50%;
            filter: blur(20px);
          }
        }
        /* 魔法阵背景装饰 */
        .lp-box::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200%;
          height: 200%;
          background: 
            radial-gradient(circle at 30% 30%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            conic-gradient(from 0deg, transparent 0deg, rgba(236, 72, 153, 0.05) 60deg, transparent 120deg, rgba(139, 92, 246, 0.05) 180deg, transparent 240deg, rgba(236, 72, 153, 0.05) 300deg, transparent 360deg);
          transform: translate(-50%, -50%) scale(0) rotate(0deg);
          pointer-events: none;
          z-index: 0;
          opacity: 0;
        }
        .lp-modal.open .lp-box::before {
          animation: magicCircleBg 1.2s ease-out 0.4s forwards;
        }
        @keyframes magicCircleBg {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1) rotate(360deg);
            opacity: 0;
          }
        }
        /* 光效扫过 */
        .lp-box::after {
          content: '';
          position: absolute;
          top: -100%;
          left: -100%;
          width: 50%;
          height: 300%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transform: rotate(45deg);
          pointer-events: none;
          z-index: 100;
        }
        .lp-modal.open .lp-box::after {
          animation: lightSweep 0.8s ease-out 0.8s forwards;
        }
        @keyframes lightSweep {
          0% {
            left: -100%;
          }
          100% {
            left: 200%;
          }
        }
        .lp-top {
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          padding: 24px;
          color: white;
          flex-shrink: 0;
          transform: translateY(-30px);
          opacity: 0;
        }
        .lp-modal.open .lp-top {
          animation: slideDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.7s forwards;
        }
        @keyframes slideDown {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .lp-top-header {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .lp-avatar {
          width: 48px;
          height: 48px;
          background: rgba(255,255,255,0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        .lp-info { flex: 1; }
        .lp-title {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }
        .lp-subtitle {
          font-size: 13px;
          opacity: 0.9;
          margin-top: 4px;
        }
        .lp-x {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1));
          border: 2px solid rgba(255,255,255,0.3);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .lp-x::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.3), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .lp-x:hover {
          background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.2));
          border-color: rgba(255,255,255,0.5);
          transform: scale(1.1) rotate(90deg);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .lp-x:hover::before {
          opacity: 1;
        }
        .lp-x:active {
          transform: scale(0.95) rotate(90deg);
        }
        .lp-x svg {
          width: 20px;
          height: 20px;
          stroke-width: 2.5;
          position: relative;
          z-index: 1;
        }
        .lp-progress-box {
          margin-top: 20px;
          padding: 16px;
          background: rgba(255,255,255,0.15);
          border-radius: 12px;
        }
        .lp-progress-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .lp-progress-label {
          font-size: 13px;
          opacity: 0.9;
        }
        .lp-progress-num {
          font-size: 28px;
          font-weight: 800;
        }
        .lp-bar {
          height: 10px;
          background: rgba(255,255,255,0.3);
          border-radius: 5px;
          overflow: hidden;
        }
        .lp-bar-fill {
          height: 100%;
          background: white;
          border-radius: 5px;
          transition: width 0.8s ease;
        }
        .lp-stats {
          display: flex;
          gap: 20px;
          margin-top: 10px;
          font-size: 12px;
          opacity: 0.9;
        }
        .lp-list {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          min-height: 0;
          background: var(--anime-bg-secondary, #fafafa);
        }
        .dark .lp-list {
          background: rgba(0, 0, 0, 0.2);
        }
        .lp-list::-webkit-scrollbar {
          width: 6px;
        }
        .lp-list::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 3px;
        }
        .lp-empty {
          text-align: center;
          padding: 60px 20px;
        }
        .lp-empty-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 16px;
          background: linear-gradient(135deg, #fce7f3, #f3e8ff);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
        }
        .lp-empty-title {
          color: var(--anime-text-secondary, #64748b);
          font-size: 15px;
          margin-bottom: 4px;
        }
        .lp-empty-desc {
          color: var(--anime-text-muted, #94a3b8);
          font-size: 13px;
        }
        .lp-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: var(--anime-bg-primary, white);
          border-radius: 12px;
          margin-bottom: 10px;
          border: 1px solid var(--anime-border-color, #e2e8f0);
          transition: all 0.2s;
          cursor: pointer;
          text-decoration: none;
          transform: translateX(-50px);
          opacity: 0;
        }
        /* 列表项交错入场动画 - 使用通用选择器支持任意数量 */
        .lp-modal.open .lp-item {
          animation: slideInRight 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .lp-modal.open .lp-item:nth-child(1) { animation-delay: 0.9s; }
        .lp-modal.open .lp-item:nth-child(2) { animation-delay: 1.0s; }
        .lp-modal.open .lp-item:nth-child(3) { animation-delay: 1.1s; }
        .lp-modal.open .lp-item:nth-child(4) { animation-delay: 1.2s; }
        .lp-modal.open .lp-item:nth-child(5) { animation-delay: 1.3s; }
        .lp-modal.open .lp-item:nth-child(6) { animation-delay: 1.4s; }
        .lp-modal.open .lp-item:nth-child(7) { animation-delay: 1.5s; }
        .lp-modal.open .lp-item:nth-child(8) { animation-delay: 1.6s; }
        .lp-modal.open .lp-item:nth-child(9) { animation-delay: 1.7s; }
        .lp-modal.open .lp-item:nth-child(10) { animation-delay: 1.8s; }
        @keyframes slideInRight {
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .dark .lp-item {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }
        .lp-item:hover {
          border-color: #ec4899;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.15);
          transform: translateX(4px);
        }
        .dark .lp-item:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(236, 72, 153, 0.5);
        }
        .lp-num {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }
        .lp-item.status-done .lp-num { background: #10b981; }
        .lp-item.status-doing .lp-num { background: #f59e0b; }
        .lp-item.status-review .lp-num { background: #8b5cf6; }
        .lp-item.status-todo .lp-num { background: #ec4899; }
        .lp-content {
          flex: 1;
          min-width: 0;
        }
        .lp-item-title {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0;
        }
        .dark .lp-item-title {
          color: #f1f5f9;
        }
        .lp-item:hover .lp-item-title {
          color: #ec4899;
        }
        .lp-date {
          font-size: 12px;
          color: var(--anime-text-muted, #94a3b8);
          margin-top: 2px;
        }
        .lp-badge {
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 500;
          flex-shrink: 0;
        }
        .lp-item.status-done .lp-badge {
          background: #d1fae5;
          color: #059669;
        }
        .lp-item.status-doing .lp-badge {
          background: #fef3c7;
          color: #d97706;
        }
        .lp-item.status-review .lp-badge {
          background: #ede9fe;
          color: #7c3aed;
        }
        .lp-item.status-todo .lp-badge {
          background: #fce7f3;
          color: #db2777;
        }
        .lp-arrow {
          width: 20px;
          height: 20px;
          color: #cbd5e1;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .lp-item:hover .lp-arrow {
          color: #ec4899;
          transform: translateX(4px);
        }
        .lp-bottom {
          padding: 16px 20px;
          background: var(--anime-bg-primary, white);
          border-top: 1px solid var(--anime-border-color, #e2e8f0);
          text-align: center;
          font-size: 13px;
          color: var(--anime-text-secondary, #64748b);
          flex-shrink: 0;
          transform: translateY(20px);
          opacity: 0;
        }
        .lp-modal.open .lp-bottom {
          animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 1.4s forwards;
        }
        @keyframes slideUp {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .dark .lp-bottom {
          background: var(--anime-glass-bg, rgba(30, 27, 46, 0.95));
        }
        .lp-bottom span {
          color: #ec4899;
          font-weight: 600;
        }
        @media (max-width: 640px) {
          .lp-modal { padding: 16px; }
          .lp-box { max-height: calc(100vh - 32px); border-radius: 16px; }
          .lp-top { padding: 20px; }
          .lp-list { padding: 16px; }
          .lp-item { padding: 12px 14px; }
        }
      `}</style>

      <div className="lp-box" onClick={e => e.stopPropagation()} style={{ position: 'relative', zIndex: 1 }}>
        {/* 头部 */}
        <div className="lp-top">
          <div className="lp-top-header">
            <div className="lp-avatar">📚</div>
            <div className="lp-info">
              <h2 className="lp-title">{title}</h2>
              <p className="lp-subtitle">{subtitle}</p>
            </div>
            <button className="lp-x" onClick={handleClose} aria-label="关闭">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 进度 */}
          {showProgress && total > 0 && (
            <div className="lp-progress-box">
              <div className="lp-progress-top">
                <span className="lp-progress-label">总体进度</span>
                <span className="lp-progress-num">{percent}%</span>
              </div>
              <div className="lp-bar">
                <div className="lp-bar-fill" style={{ width: `${percent}%` }} />
              </div>
              <div className="lp-stats">
                <span>✅ 已完成 {done} 篇</span>
                <span>� 学习中 {doing} 篇</span>
                <span>📝 待复习 {review} 篇</span>
              </div>
            </div>
          )}
        </div>

        {/* 列表 */}
        <div className="lp-list">
          {filteredPosts.length === 0 ? (
            <div className="lp-empty">
              <div className="lp-empty-icon">🌸</div>
              <p className="lp-empty-title">还没有学习记录哦~</p>
              <p className="lp-empty-desc">给文章添加「{tag}」标签开始记录吧</p>
            </div>
          ) : (
            filteredPosts.map((post, i) => {
              const status = getStatus(post)
              // 使用 post.id 和索引组合作为 key，确保唯一性
              const itemKey = post?.id ? `${post.id}-${i}` : `post-${i}`
              return (
                <SmartLink
                  key={itemKey}
                  href={`/${post.slug}`}
                  className={`lp-item ${status.class}`}
                  onClick={handleClose}
                >
                  <div className="lp-num">{i + 1}</div>
                  <div className="lp-content">
                    <p className="lp-item-title">{post.title}</p>
                    {showDate && post.publishDate && (
                      <p className="lp-date">{formatDate(post.publishDate)}</p>
                    )}
                  </div>
                  <span className="lp-badge">{status.label}</span>
                  <svg className="lp-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </SmartLink>
              )
            })
          )}
        </div>

        {/* 底部 */}
        <div className="lp-bottom">
          {footerText}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default LearningProgressModal
