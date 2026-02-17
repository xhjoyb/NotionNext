import AnimeLazyImage from './AnimeLazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import SmartLink from '@/components/SmartLink'
import ContactCard from './ContactCard'
import Catalog from './Catalog'
import AnimeQuoteCard from './AnimeQuoteCard'
import KawaiiTagCloud from './KawaiiTagCloud'
import CONFIG, { getThemeConfig } from '../config'

const SideRight = props => {
  const { post, tags, categories, latestPosts, siteInfo } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const defaultLogo = getThemeConfig('NAV.DEFAULT_LOGO', '')

  const isArticlePage = post && router.route !== '/404'

  return (
    <aside className='hidden lg:block w-80 space-y-6'>
      {/* 个人资料卡片 - 始终显示，不跟随滚动 */}
      <div className='anime-glass rounded-2xl p-6 anime-card'>
        <div className='flex flex-col items-center text-center'>
          <div className='w-20 h-20 rounded-full overflow-hidden anime-glow mb-4 ring-2 ring-pink-200 dark:ring-purple-600'>
            <AnimeLazyImage
              src={defaultLogo || siteInfo?.icon}
              className='w-full h-full object-cover'
              loaderSize='sm'
            />
          </div>
          <h3 className='font-bold text-lg anime-gradient-text mb-2'>
            {siteInfo?.author || siteConfig('AUTHOR')}
          </h3>
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
            {siteInfo?.description || siteConfig('BIO')}
          </p>
        </div>
      </div>

      {/* 动漫角色引用卡片 */}
      <AnimeQuoteCard />

      {isArticlePage ? (
        /* 文章页面：粘性区域包含目录和最新文章 */
        <div className='sticky top-20 space-y-6'>
          {post?.toc && post.toc.length > 0 && (
            <Catalog toc={post.toc} />
          )}

          {latestPosts && latestPosts.length > 0 && (
            <div className='anime-glass rounded-2xl p-6 anime-card'>
              <h3 className='font-bold text-gray-800 dark:text-white mb-4 flex items-center'>
                <i className='fas fa-fire text-orange-400 mr-2'></i>
                最新文章
              </h3>
              <div className='space-y-3'>
                {latestPosts.slice(0, 5).map((latestPost, index) => (
                  <SmartLink
                    key={index}
                    href={`/${latestPost?.slug}`}
                    className='block group cursor-pointer'>
                    <div className='flex items-start space-x-3 p-2 rounded-lg hover:bg-pink-50 dark:hover:bg-purple-900/30 transition-colors duration-300'>
                      <div className='w-12 h-12 rounded-lg overflow-hidden flex-shrink-0'>
                        <AnimeLazyImage
                          src={latestPost?.pageCoverThumbnail}
                          className='w-full h-full object-cover'
                          loaderSize='xs'
                        />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h4 className='text-sm font-medium text-gray-800 dark:text-white group-hover:text-pink-500 transition-colors duration-300 line-clamp-2'>
                          {latestPost?.title}
                        </h4>
                      </div>
                    </div>
                  </SmartLink>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 非文章页面：粘性区域包含联系卡片、分类、标签、最新文章 */
        <div className='sticky top-20 space-y-6'>
          <ContactCard />

          {categories && categories.length > 0 && (
            <div className='anime-glass rounded-2xl p-6 anime-card'>
              <h3 className='font-bold text-gray-800 dark:text-white mb-4 flex items-center'>
                <i className='fas fa-folder text-purple-400 mr-2'></i>
                {locale.COMMON.CATEGORY}
              </h3>
              <div className='flex flex-wrap gap-2'>
                {categories.slice(0, 10).map((category, index) => (
                  <SmartLink
                    key={index}
                    href={`/category/${category.name}`}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-300 cursor-pointer
                      ${router.asPath === `/category/${category.name}`
                        ? 'anime-gradient-bg text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-pink-100 dark:hover:bg-purple-900'
                      }`}>
                    {category.name} ({category.count})
                  </SmartLink>
                ))}
              </div>
            </div>
          )}

          {/* 萌化标签云 */}
          {tags && tags.length > 0 && <KawaiiTagCloud tags={tags} />}

          {latestPosts && latestPosts.length > 0 && (
            <div className='anime-glass rounded-2xl p-6 anime-card'>
              <h3 className='font-bold text-gray-800 dark:text-white mb-4 flex items-center'>
                <i className='fas fa-fire text-orange-400 mr-2'></i>
                最新文章
              </h3>
              <div className='space-y-3'>
                {latestPosts.slice(0, 5).map((latestPost, index) => (
                  <SmartLink
                    key={index}
                    href={`/${latestPost?.slug}`}
                    className='block group cursor-pointer'>
                    <div className='flex items-start space-x-3 p-2 rounded-lg hover:bg-pink-50 dark:hover:bg-purple-900/30 transition-colors duration-300'>
                      <div className='w-12 h-12 rounded-lg overflow-hidden flex-shrink-0'>
                        <AnimeLazyImage
                          src={latestPost?.pageCoverThumbnail}
                          className='w-full h-full object-cover'
                          loaderSize='xs'
                        />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h4 className='text-sm font-medium text-gray-800 dark:text-white group-hover:text-pink-500 transition-colors duration-300 line-clamp-2'>
                          {latestPost?.title}
                        </h4>
                      </div>
                    </div>
                  </SmartLink>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  )
}

export default SideRight
