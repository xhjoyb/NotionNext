import AnimeLazyImage from './AnimeLazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import formatDate from '@/lib/utils/formatDate'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

const BlogPostCard = ({ post, showSummary = true }) => {
  const { locale } = useGlobal()
  const date = formatDate(post?.date?.start_date || post?.createdTime, siteConfig('LANG'))

  return (
    <SmartLink href={`/${post?.slug}`} className='block group cursor-pointer'>
      <article className='anime-glass anime-card overflow-hidden h-full flex flex-col'>
        <div className='relative overflow-hidden aspect-[16/10]'>
          <AnimeLazyImage
            src={post?.pageCoverThumbnail || post?.pageCover}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
            loaderSize='lg'
          />
          

          
          <div className='absolute top-3 left-3 right-3 flex justify-between items-start'>
            {post?.tags && post.tags.length > 0 && (
              <div className='flex flex-wrap gap-1.5'>
                {post.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className='anime-tag text-xs backdrop-blur-sm'>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {post?.category && (
              <span className='px-2.5 py-1 rounded-full bg-white/90 dark:bg-purple-900/80 text-xs font-semibold text-gray-700 dark:text-gray-200 backdrop-blur-sm shadow-sm'>
                {post.category}
              </span>
            )}
          </div>


        </div>

        <div className='p-5 flex flex-col'>
          <h2 className='text-lg font-bold text-gray-800 dark:text-white group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors duration-300 line-clamp-2 mb-3 leading-relaxed min-h-[3.5rem]'>
            {post?.title}
          </h2>

          {showSummary && post?.summary && (
            <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed'>
              {post?.summary}
            </p>
          )}

          <div className='flex items-center justify-between pt-3 border-t border-pink-100 dark:border-purple-800/50'>
            <div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
              <div className='w-7 h-7 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-purple-800 dark:to-pink-800 flex items-center justify-center'>
                <svg className='w-3.5 h-3.5 text-pink-500 dark:text-pink-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                </svg>
              </div>
              <span className='font-medium'>{date}</span>
            </div>
            
            <div className='flex items-center gap-1.5 text-xs text-pink-500 dark:text-pink-400 font-medium group-hover:gap-2 transition-all duration-300'>
              <span>查看详情</span>
              <svg className='w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </SmartLink>
  )
}

export default BlogPostCard
