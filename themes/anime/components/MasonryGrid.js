import { useMemo } from 'react'
import BlogPostCard from './BlogPostCard'
import CONFIG from '../config'

/**
 * 瀑布流布局组件 (Masonry Layout)
 * 像 Pinterest 那样错落有致地展示文章卡片
 */
const MasonryGrid = ({ posts = [], showSummary = true }) => {
  // 获取配置
  const config = CONFIG.MASONRY || {}
  const isEnabled = config.ENABLE !== false
  const columns = config.COLUMNS || { mobile: 1, tablet: 2, desktop: 3, wide: 4 }
  const gap = config.GAP || 24

  // 如果禁用瀑布流，返回普通网格
  if (!isEnabled) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {posts.map(post => (
          <BlogPostCard key={post.id} post={post} showSummary={showSummary} />
        ))}
      </div>
    )
  }

  // 根据文章摘要长度和图片比例，为每篇文章分配一个高度类型
  const postsWithHeight = useMemo(() => {
    return posts.map((post, index) => {
      // 基于内容长度决定卡片高度类型
      const summaryLength = post.summary?.length || 0
      const hasImage = !!post.pageCoverThumbnail
      
      // 每第3个卡片使用 tall 类型，增加错落感
      const isTall = index % 3 === 0 && summaryLength > 100
      const isWide = index % 5 === 2 && !isTall
      
      return {
        ...post,
        heightType: isTall ? 'tall' : isWide ? 'wide' : 'normal'
      }
    })
  }, [posts])

  // 将文章分配到各列（瀑布流算法）
  const columnsPosts = useMemo(() => {
    const maxColumns = Math.max(
      columns.mobile,
      columns.tablet,
      columns.desktop,
      columns.wide
    )
    const cols = Array(maxColumns).fill(null).map(() => [])
    const colHeights = Array(maxColumns).fill(0)
    
    postsWithHeight.forEach((post, index) => {
      // 找到最短的列
      const shortestCol = colHeights.indexOf(Math.min(...colHeights))
      cols[shortestCol].push(post)
      
      // 估算高度（基于内容类型）
      let estimatedHeight = 400 // 基础高度
      if (post.heightType === 'tall') estimatedHeight = 550
      if (post.heightType === 'wide') estimatedHeight = 350
      if (!post.pageCoverThumbnail) estimatedHeight -= 150
      
      colHeights[shortestCol] += estimatedHeight + gap
    })
    
    return cols
  }, [postsWithHeight, gap, columns])

  // 根据屏幕尺寸获取当前应该显示的列数
  const getColumnCount = (width) => {
    if (width >= 1280) return columns.wide
    if (width >= 1024) return columns.desktop
    if (width >= 768) return columns.tablet
    return columns.mobile
  }

  // 渲染指定列数的瀑布流
  const renderMasonry = (columnCount, className) => {
    return (
      <div className={className} style={{ 
        display: 'grid',
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap: `${gap}px`
      }}>
        {Array(columnCount).fill(null).map((_, colIndex) => (
          <div key={colIndex} className='flex flex-col' style={{ gap: `${gap}px` }}>
            {columnsPosts[colIndex]?.map(post => (
              <div key={post.id} className={`masonry-card ${post.heightType}`}>
                <BlogPostCard post={post} showSummary={showSummary} imageHeight={post.heightType} />
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='masonry-container'>
      {/* 移动端 */}
      <div className='block md:hidden'>
        {renderMasonry(columns.mobile, '')}
      </div>

      {/* 平板 */}
      <div className='hidden md:block lg:hidden'>
        {renderMasonry(columns.tablet, '')}
      </div>

      {/* 桌面 */}
      <div className='hidden lg:block xl:hidden'>
        {renderMasonry(columns.desktop, '')}
      </div>

      {/* 宽屏 */}
      <div className='hidden xl:block'>
        {renderMasonry(columns.wide, '')}
      </div>
    </div>
  )
}

export default MasonryGrid
