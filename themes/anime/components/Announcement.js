import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

/**
 * 公告组件
 * 从 Notion 数据库中获取 type 为 Notice 的文章作为公告
 * @param {Object} props
 * @param {Object} props.post - 公告文章数据
 * @param {string} props.className - 额外的 CSS 类名
 * @returns {JSX.Element}
 */
const Announcement = ({ post, className = '' }) => {
  const { locale } = useGlobal()

  // 如果没有公告数据，不渲染
  if (!post || Object.keys(post).length === 0) {
    return null
  }

  return (
    <div className={`anime-glass rounded-2xl p-6 anime-card ${className}`}>
      {/* 标题区域 */}
      <div className='flex items-center space-x-3 mb-4'>
        <div className='w-10 h-10 rounded-full anime-gradient-bg flex items-center justify-center flex-shrink-0 animate-pulse'>
          <i className='fas fa-bullhorn text-white'></i>
        </div>
        <div>
          <h3 className='font-bold text-gray-800 dark:text-white'>
            {locale.COMMON.ANNOUNCEMENT || '公告'}
          </h3>
          {post.title && (
            <p className='text-xs text-gray-500 dark:text-gray-400'>{post.title}</p>
          )}
        </div>
      </div>

      {/* 公告内容 */}
      {post.blockMap && (
        <div id='announcement-content' className='prose dark:prose-invert max-w-none text-sm'>
          <NotionPage post={post} />
        </div>
      )}

      {/* 如果没有 blockMap，显示摘要 */}
      {!post.blockMap && post.summary && (
        <div className='text-sm text-gray-600 dark:text-gray-400'>
          {post.summary}
        </div>
      )}
    </div>
  )
}

export default Announcement
