import { useState, useEffect, useRef } from 'react'
import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

/**
 * 萌化杂志单行轮播组件 (KawaiiMagazineCarousel)
 * 漫画风格单行横向自动轮播
 * - 单行卡片横向滚动
 * - 自动轮播，悬停暂停
 * - 简约漫画风格粗边框
 */

const KawaiiMagazineCarousel = ({ posts = [], isIndex = false }) => {
  const config = CONFIG.MAGAZINE_CAROUSEL || {}
  const isEnabled = config.ENABLE !== false
  const maxPosts = config.MAX_POSTS || 6
  const autoPlay = config.AUTO_PLAY !== false
  const scrollSpeed = config.SCROLL_SPEED || 0.8
  const cardWidth = config.CARD_WIDTH || 260
  const cardGap = config.CARD_GAP || 20
  const onlyOnIndex = config.ONLY_ON_INDEX !== false
  const tagFilter = config.TAG || ''
  const quote = config.QUOTE || ''

  if (!isEnabled) return null
  if (onlyOnIndex && !isIndex) return null
  if (!posts || posts.length === 0) return null

  // 根据标签筛选文章
  const filteredPosts = tagFilter
    ? posts.filter(post => {
        const postTags = post?.tags || []
        return postTags.some(tag => tag.toLowerCase() === tagFilter.toLowerCase())
      })
    : posts

  if (filteredPosts.length === 0) return null

  const displayPosts = filteredPosts.slice(0, maxPosts)
  const [isPaused, setIsPaused] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef(null)
  const animationRef = useRef(null)

  // 自动滚动动画
  useEffect(() => {
    if (!autoPlay || isPaused) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    let lastTime = performance.now()

    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      setScrollPosition((prev) => {
        const container = containerRef.current
        if (!container) return prev

        const maxScroll = container.scrollWidth / 2
        const newPosition = prev + scrollSpeed * deltaTime * 0.06

        // 循环滚动
        if (newPosition >= maxScroll) {
          return 0
        }
        return newPosition
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [autoPlay, isPaused, scrollSpeed])

  // 同步滚动位置到DOM
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollPosition
    }
  }, [scrollPosition])

  return (
    <div
      className="w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 整体漫画风格边框容器 */}
      <div className="relative p-3 md:p-4 bg-white dark:bg-gray-900/80 dark:backdrop-blur-sm rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)] border-3 border-black dark:border-white">
        {/* 角落装饰 */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-3 border-l-3 border-black dark:border-white -mt-1.5 -ml-1.5" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-3 border-r-3 border-black dark:border-white -mt-1.5 -mr-1.5" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-3 border-l-3 border-black dark:border-white -mb-1.5 -ml-1.5" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-3 border-r-3 border-black dark:border-white -mb-1.5 -mr-1.5" />

        {/* 标题栏 */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-pink-400 rotate-45" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              {tagFilter ? tagFilter : '精选推荐'}
            </h2>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-300">
            <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" />
            <span>{quote ? quote : '自动轮播中'}</span>
          </div>
        </div>

        {/* 虚线分隔带 + 萌化生物行走 */}
        <div className="relative mb-4">
          {/* 虚线 */}
          <div className="border-t-2 border-dashed border-gray-300 dark:border-white/50" />
          {/* 行走的小猫 - 使用fixed定位在整个组件宽度内行走 */}
          <div className="absolute -top-9 left-0 right-0 h-10 overflow-hidden pointer-events-none">
            <div className="animate-walk-full">
              <svg width="64" height="44" viewBox="0 0 32 24" className="text-pink-400 drop-shadow-sm">
                {/* 可爱小猫身体 */}
                <ellipse cx="16" cy="14" rx="8" ry="6" fill="currentColor" />
                {/* 头 */}
                <circle cx="16" cy="8" r="5" fill="currentColor" />
                {/* 耳朵 */}
                <path d="M12 5 L10 2 L14 4 Z" fill="currentColor" />
                <path d="M20 5 L22 2 L18 4 Z" fill="currentColor" />
                {/* 眼睛 */}
                <circle cx="14" cy="8" r="1" fill="white" />
                <circle cx="18" cy="8" r="1" fill="white" />
                {/* 腿 - 动画效果 */}
                <rect x="12" y="18" width="2" height="4" fill="currentColor">
                  <animateTransform attributeName="transform" type="rotate" values="-10 12 18;10 12 18;-10 12 18" dur="0.3s" repeatCount="indefinite" />
                </rect>
                <rect x="18" y="18" width="2" height="4" fill="currentColor">
                  <animateTransform attributeName="transform" type="rotate" values="10 18 18;-10 18 18;10 18 18" dur="0.3s" repeatCount="indefinite" />
                </rect>
                {/* 尾巴 */}
                <path d="M8 14 Q4 12 4 8" stroke="currentColor" strokeWidth="2" fill="none">
                  <animate attributeName="d" values="M8 14 Q4 12 4 8;M8 14 Q4 16 4 12;M8 14 Q4 12 4 8" dur="0.6s" repeatCount="indefinite" />
                </path>
              </svg>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes walk-full {
            0% { transform: translateX(-50px); }
            100% { transform: translateX(calc(100vw - 100px)); }
          }
          .animate-walk-full {
            animation: walk-full 18s linear infinite;
          }
        `}</style>

        {/* 单行轮播容器 */}
        <div
          ref={containerRef}
          className="flex overflow-x-hidden"
          style={{ gap: `${cardGap}px` }}
        >
          {/* 复制一份实现无缝循环 */}
          {[...displayPosts, ...displayPosts].map((post, index) => (
            <MagazineCard
              key={index}
              post={post}
              width={cardWidth}
              isPaused={isPaused}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// 杂志卡片组件 - 漫画风格粗边框
const MagazineCard = ({ post, width, isPaused }) => {
  return (
    <SmartLink
      href={`/${post?.slug}`}
      className="group flex-shrink-0"
      style={{ width: `${width}px` }}
    >
      {/* 外层粗边框容器 */}
        <div className="relative p-1.5 bg-white dark:bg-gray-800/70 rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] border-2 border-black dark:border-white hover:shadow-[6px_6px_0px_0px_rgba(236,72,153,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(236,72,153,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-300">
        {/* 内层细边框 */}
        <div className="relative border border-gray-200 dark:border-gray-600 overflow-hidden">
          {/* 图片容器 */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-900">
            {post?.pageCoverThumbnail ? (
              <LazyImage
                src={post.pageCoverThumbnail}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isPaused ? 'scale-105' : 'scale-100'
                }`}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-800/40 dark:to-purple-800/40 flex items-center justify-center">
                <svg className="w-12 h-12 text-pink-300 dark:text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>
            )}

            {/* 漫画风格角落标记 */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-black dark:border-white -mt-1 -ml-1" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-black dark:border-white -mt-1 -mr-1" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-black dark:border-white -mb-1 -ml-1" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-black dark:border-white -mb-1 -mr-1" />
          </div>

          {/* 底部信息栏 */}
          <div className="p-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
            {/* 分类标签 */}
            {post?.category && (
              <div className="inline-block px-1.5 py-0.5 mb-1 bg-pink-400 text-white text-[10px] font-bold uppercase tracking-wider border border-black dark:border-white">
                {post.category}
              </div>
            )}

            {/* 标题 */}
            <h3 className="text-gray-900 dark:text-white text-sm font-bold line-clamp-1 leading-tight group-hover:text-pink-400 transition-colors duration-300">
              {post?.title}
            </h3>

            {/* 日期 */}
            <p className="text-gray-500 dark:text-gray-300 text-[10px] mt-0.5">
              {post?.publishDay}
            </p>
          </div>
        </div>

        {/* 装饰性胶带效果 */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-12 h-3 bg-pink-300/90 dark:bg-pink-500/90 rotate-1 shadow-sm" />
      </div>
    </SmartLink>
  )
}

export default KawaiiMagazineCarousel
