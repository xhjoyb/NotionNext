import { useMemo } from 'react'
import AnimeLazyImage from './AnimeLazyImage'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

/**
 * 萌化文章时间轴组件 (KawaiiArticleTimeline)
 * 二次元动漫时间轴风格
 * - 按指定标签筛选文章
 * - 垂直时间轴布局，左右交替
 * - 邮票风格卡片设计
 */

const KawaiiArticleTimeline = ({ posts = [], isIndex = false }) => {
  // 获取配置
  const config = CONFIG.ARTICLE_TIMELINE || {}
  const isEnabled = config.ENABLE !== false
  const tagFilter = config.TAG || 'Recommend'
  const maxPosts = config.MAX_POSTS || 6
  const showCategory = config.SHOW_CATEGORY !== false
  const alternateSummary = config.ALTERNATE_SUMMARY !== false
  const onlyOnIndex = config.ONLY_ON_INDEX !== false

  // 如果禁用了，不渲染
  if (!isEnabled) {
    return null
  }

  // 如果配置只在首页显示，且当前不是首页，不渲染
  if (onlyOnIndex && !isIndex) {
    return null
  }

  // 按标签筛选文章
  const filteredPosts = useMemo(() => {
    if (!posts || posts.length === 0) return []
    
    const filtered = posts.filter(post => {
      if (!post.tags || !Array.isArray(post.tags)) return false
      return post.tags.some(tag => 
        tag.toLowerCase() === tagFilter.toLowerCase()
      )
    })
    
    return filtered.slice(0, maxPosts)
  }, [posts, tagFilter, maxPosts])

  // 如果没有符合条件的文章，不渲染
  if (filteredPosts.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      {/* 标题区域 - 使用标签样式 */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 rounded-full shadow-lg dark:shadow-pink-900/30">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
          </svg>
          <span className="text-white font-bold text-base">
            {tagFilter}
          </span>
        </div>
      </div>

      {/* 时间轴容器 */}
      <div className="relative">
        {/* 中央时间线 */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-300 via-purple-300 to-pink-300 rounded-full transform -translate-x-1/2" />
        
        {/* 时间线顶部装饰 */}
        <div className="absolute left-1/2 top-0 w-4 h-4 bg-pink-500 rounded-full border-4 border-white dark:border-gray-900 transform -translate-x-1/2 -translate-y-1/2 z-10" />
        
        {/* 时间线底部装饰 */}
        <div className="absolute left-1/2 bottom-0 w-4 h-4 bg-purple-500 rounded-full border-4 border-white dark:border-gray-900 transform -translate-x-1/2 translate-y-1/2 z-10" />

        {/* 文章列表 */}
        <div className="relative py-8">
          {filteredPosts.map((post, index) => {
            const isLeft = index % 2 === 0
            
            return (
              <div key={index} className="relative grid grid-cols-[1fr_auto_1fr] gap-8 mb-16 last:mb-0">
                {/* 左侧区域 */}
                <div className="pr-8">
                  {isLeft ? (
                    // 左侧是图片卡片
                    alternateSummary ? (
                      <ImageCard post={post} />
                    ) : (
                      <ArticleCard post={post} showCategory={showCategory} />
                    )
                  ) : alternateSummary ? (
                    // 左侧是信息卡片（标题+摘要）
                    <InfoCard post={post} align="left" showCategory={showCategory} isSticky={true} />
                  ) : null}
                </div>

                {/* 中央节点 */}
                <div className="flex flex-col items-center pt-0">
                  {/* 序号圆圈 */}
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg z-10 flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  {/* 日期标签 */}
                  <div className="mt-2 flex-shrink-0">
                    <span className="px-3 py-1 bg-white dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400 rounded-full shadow">
                      {post?.publishDay}
                    </span>
                  </div>
                </div>

                {/* 右侧区域 */}
                <div className="pl-8">
                  {!isLeft ? (
                    // 右侧是图片卡片
                    alternateSummary ? (
                      <ImageCard post={post} />
                    ) : (
                      <ArticleCard post={post} showCategory={showCategory} />
                    )
                  ) : alternateSummary ? (
                    // 右侧是信息卡片（标题+摘要）
                    <InfoCard post={post} align="right" showCategory={showCategory} isSticky={true} />
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

// 图片卡片组件（仅封面图，无链接）
const ImageCard = ({ post }) => {
  return (
    <div className="group block">
      {/* 邮票风格卡片 */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-pink-200/50 dark:group-hover:shadow-pink-900/30 group-hover:-translate-y-1">
        {/* 邮票齿孔效果 - 顶部 */}
        <div className="absolute top-0 left-0 right-0 h-3 flex justify-between px-2 z-10">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-gray-100 dark:bg-gray-900 rounded-full -mt-1" />
          ))}
        </div>
        
        {/* 封面图 */}
        <div className="aspect-[16/10] overflow-hidden">
          {post?.pageCoverThumbnail ? (
            <AnimeLazyImage
              src={post.pageCoverThumbnail}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loaderSize='lg'
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 flex items-center justify-center">
              <svg className="w-12 h-12 text-pink-300 dark:text-pink-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </div>
          )}
        </div>

        {/* 邮票齿孔效果 - 底部 */}
        <div className="absolute bottom-0 left-0 right-0 h-3 flex justify-between px-2 z-10">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-gray-100 dark:bg-gray-900 rounded-full -mb-1" />
          ))}
        </div>
      </div>
    </div>
  )
}

// 文章卡片组件（完整卡片，可跳转）
const ArticleCard = ({ post, showCategory, showTitle = true, showSummary = true }) => {
  return (
    <SmartLink href={`/${post?.slug}`} className="group block">
      {/* 邮票风格卡片 */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-pink-200/50 dark:group-hover:shadow-pink-900/30 group-hover:-translate-y-1">
        {/* 邮票齿孔效果 - 顶部 */}
        <div className="absolute top-0 left-0 right-0 h-3 flex justify-between px-2 z-10">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-gray-100 dark:bg-gray-900 rounded-full -mt-1" />
          ))}
        </div>
        
        {/* 封面图 */}
        <div className="aspect-[16/10] overflow-hidden">
          {post?.pageCoverThumbnail ? (
            <AnimeLazyImage
              src={post.pageCoverThumbnail}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loaderSize='lg'
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 flex items-center justify-center">
              <svg className="w-12 h-12 text-pink-300 dark:text-pink-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </div>
          )}
        </div>

        {/* 内容 */}
        {(showTitle || showSummary || showCategory) && (
          <div className="p-4">
            {showTitle && (
              <h4 className="font-bold text-gray-800 dark:text-white text-base mb-2 line-clamp-2 group-hover:text-pink-500 transition-colors">
                {post?.title}
              </h4>
            )}
            {showSummary && (
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                {post?.summary || '点击查看更多精彩内容...'}
              </p>
            )}
            {showCategory && post?.category && (
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
                </svg>
                {post.category}
              </div>
            )}
          </div>
        )}

        {/* 邮票齿孔效果 - 底部 */}
        <div className="absolute bottom-0 left-0 right-0 h-3 flex justify-between px-2 z-10">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-gray-100 dark:bg-gray-900 rounded-full -mb-1" />
          ))}
        </div>
      </div>
    </SmartLink>
  )
}

// 信息卡片组件（标题+摘要，显示在另一侧）
const InfoCard = ({ post, align, showCategory, isSticky = false }) => {
  const cardContent = (
    <SmartLink href={`/${post?.slug}`} className="group block">
      <div className="relative bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg p-6 flex flex-col justify-center transition-all duration-500 group-hover:shadow-lg group-hover:shadow-pink-200/30 dark:group-hover:shadow-pink-900/20 border-2 border-dashed border-pink-200 dark:border-pink-800/50">
        {/* 装饰引号 */}
        <div className={`absolute top-2 ${align === 'left' ? 'right-2' : 'left-2'} text-4xl text-pink-200 dark:text-pink-800 font-serif opacity-50`}>"</div>
        
        {/* 标题 */}
        <h4 className={`font-bold text-gray-800 dark:text-white text-lg mb-3 line-clamp-2 group-hover:text-pink-500 transition-colors ${align === 'left' ? 'text-right' : 'text-left'}`}>
          {post?.title}
        </h4>
        
        {/* 摘要内容 */}
        <p className={`text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-4 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors ${align === 'left' ? 'text-right' : 'text-left'}`}>
          {post?.summary || '点击查看更多精彩内容...'}
        </p>
        
        {/* 分类 */}
        {showCategory && post?.category && (
          <div className={`mt-4 flex items-center gap-2 text-xs text-gray-500 ${align === 'left' ? 'justify-end' : 'justify-start'}`}>
            <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
            </svg>
            {post.category}
          </div>
        )}
        
        {/* 阅读更多提示 */}
        <div className={`mt-4 flex items-center gap-1 text-xs text-pink-500 ${align === 'left' ? 'justify-end' : 'justify-start'}`}>
          <span>阅读全文</span>
          <svg className={`w-4 h-4 transition-transform ${align === 'left' ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1 rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </SmartLink>
  )

  if (isSticky) {
    return (
      <div className="sticky top-24">
        {cardContent}
      </div>
    )
  }

  return cardContent
}

export default KawaiiArticleTimeline
