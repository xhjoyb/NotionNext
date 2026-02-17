import AnimeLazyImage from './AnimeLazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import formatDate from '@/lib/utils/formatDate'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

const BlogArchiveItem = ({ archiveTitle, archivePosts }) => {
  const { locale } = useGlobal()

  return (
    <div className='mb-8'>
      <h2 className='text-2xl font-bold anime-gradient-text mb-4 flex items-center'>
        <i className='fas fa-calendar-alt text-pink-400 mr-3'></i>
        {archiveTitle}
        <span className='ml-2 text-sm font-normal text-gray-500'>
          ({archivePosts[archiveTitle]?.length || 0} 篇)
        </span>
      </h2>
      
      <div className='grid gap-4'>
        {archivePosts[archiveTitle]?.map((post, index) => (
          <SmartLink
            key={index}
            href={`/${post?.slug}`}
            className='block group cursor-pointer'>
            <article className='anime-glass anime-card p-4 flex items-center space-x-4'>
              <div className='w-20 h-16 rounded-lg overflow-hidden flex-shrink-0'>
                <AnimeLazyImage
                  src={post?.pageCoverThumbnail}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                  loaderSize='sm'
                />
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='font-medium text-gray-800 dark:text-white group-hover:text-pink-500 transition-colors duration-300 line-clamp-1'>
                  {post?.title}
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  {formatDate(post?.date?.start_date || post?.createdTime, siteConfig('LANG'))}
                </p>
              </div>
            </article>
          </SmartLink>
        ))}
      </div>
    </div>
  )
}

export default BlogArchiveItem
