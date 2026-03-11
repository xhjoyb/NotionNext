import Comment from '@/components/Comment'
import { AdSlot } from '@/components/GoogleAdsense'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import { PWA as initialPWA } from '@/components/PWA'
import ShareBar from '@/components/ShareBar'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadWowJS } from '@/lib/plugins/wow'
import { isBrowser } from '@/lib/utils'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState, useRef } from 'react'
import Announcement from './components/Announcement'
import ArticleLock from './components/ArticleLock'
import BlogArchiveItem from './components/BlogArchiveItem'
import BlogPostCard from './components/BlogPostCard'
import Catalog from './components/Catalog'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import KawaiiBackToTop from './components/KawaiiBackToTop'
import KawaiiLoader from './components/KawaiiLoader'
import Live2DCubism3 from './components/Live2DCubism3'
import LyricsDisplay from './components/LyricsDisplay'
import MasonryGrid from './components/MasonryGrid'
import MusicPlayer from './components/MusicPlayer'
import MyhkPlayer from './components/MyhkPlayer'
import Pagination from './components/Pagination'
import SakuraEffect from './components/SakuraEffect'
import SearchInput from './components/SearchInput'
import SideRight from './components/SideRight'
import KawaiiArticleTimeline from './components/KawaiiArticleTimeline'
import KawaiiMagazineCarousel from './components/KawaiiMagazineCarousel'
import CONFIG, { getThemeConfig } from './config'
import { Style } from './style'
import CardConnectionLine from './components/CardConnectionLine'
import DanmakuComments from './components/DanmakuComments'
import KawaiiCursor from './components/KawaiiCursor'
import KawaiiAdBanner from './components/KawaiiAdBanner'
import AIExplanation from './components/AIExplanation'
import { useStickyPosition } from './hooks/useStickyPosition'
import DouyinParser from './components/DouyinParser'
import DouyinParserHero from './components/DouyinParserHero'

const ThemeGlobalAnime = createContext()
export const useAnimeGlobal = () => useContext(ThemeGlobalAnime)

const LayoutBase = props => {
  const { children, post, tagOptions, categories, latestPosts, allNavPages, siteInfo, customNav, customMenu } = props
  const { onLoading, fullWidth } = useGlobal()
  const router = useRouter()

  // 使用自定义 hook 管理 sticky 定位（优化滚动性能）
  const { stickyTop, isHeaderVisible } = useStickyPosition({
    visibleOffset: 96,  // top-24
    hiddenOffset: 16,   // top-4
    enabled: true
  })

  useEffect(() => {
    loadWowJS()
  }, [])

  const showHero = router.route === '/' && siteConfig('ANIME_HOME_BANNER_ENABLE', true, CONFIG)

  // 背景图配置
  const bgEnabled = getThemeConfig('BACKGROUND.ENABLE', true)
  const bgImageUrl = getThemeConfig('BACKGROUND.IMAGE_URL', '')
  const bgOpacity = getThemeConfig('BACKGROUND.OPACITY', 0.6)
  const bgDarkOpacity = getThemeConfig('BACKGROUND.DARK_OPACITY', 0.4)

  // 侧边栏配置
  const getSidebarPosition = () => {
    const route = router.route
    
    // 文章详情页
    if (route === '/[slug]' || route.startsWith('/article/')) {
      return getThemeConfig('SIDEBAR.POST_POSITION', 'right')
    }
    // 首页
    if (route === '/') {
      return getThemeConfig('SIDEBAR.INDEX_POSITION', 'right')
    }
    // 归档页
    if (route === '/archive' || route.startsWith('/archive/')) {
      return getThemeConfig('SIDEBAR.ARCHIVE_POSITION', 'right')
    }
    // 分类页
    if (route === '/category' || route.startsWith('/category/')) {
      return getThemeConfig('SIDEBAR.CATEGORY_POSITION', 'right')
    }
    // 标签页
    if (route === '/tag' || route.startsWith('/tag/')) {
      return getThemeConfig('SIDEBAR.TAG_POSITION', 'right')
    }
    // 搜索页
    if (route === '/search' || route.startsWith('/search/')) {
      return getThemeConfig('SIDEBAR.SEARCH_POSITION', 'right')
    }
    // 默认
    return getThemeConfig('SIDEBAR.DEFAULT_POSITION', 'right')
  }
  
  const sidebarPosition = getSidebarPosition()
  const sidebarReverse = sidebarPosition === 'left'

  return (
    <ThemeGlobalAnime.Provider value={{ isHeaderVisible, stickyTop }}>
      <div
        id='theme-anime'
        className={`${siteConfig('FONT_STYLE')} min-h-screen scroll-smooth`}>
        <Style />
        
        {/* 动态背景图样式 */}
        {bgEnabled && bgImageUrl && (
          <style jsx global>{`
            body::before {
              content: '';
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-image: url('${bgImageUrl}');
              background-repeat: repeat;
              background-size: auto;
              background-position: center top;
              pointer-events: none;
              z-index: 0;
              opacity: ${bgOpacity};
            }
            .dark body::before {
              opacity: ${bgDarkOpacity};
            }
          `}</style>
        )}
        
        <Header {...props} />

        {/* 萌化加载动画 - 全屏遮罩 */}
        <div className={`transition-opacity duration-300 ${onLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          {onLoading && <KawaiiLoader fullscreen text="正在加载魔法世界..." />}
        </div>

        <main className={`relative transition-opacity duration-300 ${onLoading ? 'opacity-0' : 'opacity-100'}`}>
          {showHero && <Hero {...props} />}

          <div className={`anime-content-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${showHero ? '' : 'pt-24'}`}>
            <div className={`flex ${fullWidth ? '' : 'lg:gap-8'} ${sidebarReverse ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-1 min-w-0 ${fullWidth ? '' : 'max-w-4xl'}`}>
                {children}
              </div>

              {!fullWidth && router.route !== '/404' && (
                <SideRight
                  post={post}
                  tags={tagOptions}
                  categories={categories}
                  latestPosts={latestPosts}
                  siteInfo={siteInfo}
                />
              )}
            </div>

            {/* 萌化文章时间轴 - 文章列表和侧边栏整体下方 */}
            {!fullWidth && router.route !== '/404' && allNavPages && allNavPages.length > 0 && (
              <div className='mt-8'>
                <KawaiiArticleTimeline posts={allNavPages} isIndex={router.route === '/'} />
              </div>
            )}

            {/* 萌化杂志轮播 - 时间轴下方 */}
            {!fullWidth && router.route !== '/404' && allNavPages && allNavPages.length > 0 && (
              <div className='mt-12'>
                <KawaiiMagazineCarousel posts={allNavPages} isIndex={router.route === '/'} />
              </div>
            )}
          </div>
        </main>

        <Footer {...props} />

        {/* 明月浩空音乐播放器 */}
        <MyhkPlayer />

        {/* Live2D Cubism 3 看板娘 */}
        <Live2DCubism3 />

        {/* 萌化返回顶部按钮 */}
        <KawaiiBackToTop />

        {/* 弹幕评论 */}
        <DanmakuComments />

        {/* 二次元萌化光标 */}
        {siteConfig('ANIME_KAWAII_CURSOR', getThemeConfig('EFFECTS.KAWAII_CURSOR', true), CONFIG) && <KawaiiCursor />}

        {siteConfig('ANIME_SAKURA_EFFECT', getThemeConfig('EFFECTS.SAKURA', true), CONFIG) && <SakuraEffect />}
      </div>
    </ThemeGlobalAnime.Provider>
  )
}

const LayoutIndex = props => {
  const { notice } = props

  // 是否启用公告
  const enableAnnouncement = getThemeConfig('ANNOUNCEMENT.ENABLE', true)

  return (
    <div className='anime-slide-up space-y-6'>
      {/* 公告区域 */}
      {enableAnnouncement && notice && <Announcement post={notice} />}

      <LayoutPostList {...props} />
    </div>
  )
}

const LayoutPostList = props => {
  const { posts, postCount, page } = props
  const containerRef = useRef(null)
  const { NOTION_CONFIG } = useGlobal()

  // 是否启用卡片火车动画
  const enableTrainAnimation = siteConfig('ANIME_POST_CARD_TRAIN_ANIMATION', true, CONFIG)

  // 是否启用瀑布流布局
  const enableMasonry = getThemeConfig('MASONRY.ENABLE', true)

  // 计算分页
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', 12, NOTION_CONFIG)
  const totalPage = Math.ceil(postCount / POSTS_PER_PAGE) || 1
  const showPagination = postCount >= POSTS_PER_PAGE
  const currentPage = parseInt(page) || 1

  return (
    <div ref={containerRef} className='relative'>
      {/* 卡片网格火车动画 */}
      {enableTrainAnimation && !enableMasonry && <CardConnectionLine containerRef={containerRef} />}

      {/* 瀑布流布局 */}
      {enableMasonry ? (
        <div className='relative z-10'>
          <MasonryGrid posts={posts} />
        </div>
      ) : (
        /* 传统网格布局 */
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10'>
          {posts?.map((post, index) => (
            <div
              key={index}
              data-card
              className='anime-slide-up'
              style={{ animationDelay: `${index * 0.1}s` }}>
              <BlogPostCard post={post} />
            </div>
          ))}
        </div>
      )}

      {showPagination && <Pagination page={currentPage} totalPage={totalPage} />}
    </div>
  )
}

const LayoutSearch = props => {
  const { posts, keyword } = props
  const { locale } = useGlobal()

  useEffect(() => {
    if (isBrowser && keyword) {
      replaceSearchResult({
        doms: document.getElementById('posts-wrapper'),
        search: keyword,
        target: {
          element: 'span',
          className: 'text-pink-500 border-b-2 border-pink-400'
        }
      })
    }
  }, [keyword])

  return (
    <div className='anime-slide-up'>
      <div className='anime-glass rounded-3xl p-8 mb-8 text-center'>
        <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 dark:from-purple-800 dark:to-pink-800 mb-4'>
          <svg className='w-8 h-8 text-pink-500 dark:text-pink-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
          </svg>
        </div>
        <h1 className='text-2xl font-bold anime-gradient-text mb-2'>
          搜索结果
        </h1>
        <p className='text-gray-600 dark:text-gray-400 mb-6'>
          关键词: <span className='font-semibold text-pink-500'>{keyword}</span>
        </p>
        <SearchInput className='max-w-md mx-auto' />
      </div>

      <div id='posts-wrapper' className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {posts?.map((post, index) => (
          <div 
            key={index} 
            className='anime-slide-up'
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <BlogPostCard post={post} />
          </div>
        ))}
      </div>

      {(!posts || posts.length === 0) && (
        <div className='text-center py-16 anime-slide-up'>
          <div className='w-24 h-24 mx-auto mb-6 rounded-full anime-gradient-bg flex items-center justify-center anime-float'>
            <svg className='w-12 h-12 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
          </div>
          <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-2'>没有找到相关文章</h3>
          <p className='text-gray-500 dark:text-gray-400'>试试其他关键词吧~</p>
        </div>
      )}
    </div>
  )
}

const LayoutArchive = props => {
  const { archivePosts } = props
  const { locale } = useGlobal()

  return (
    <div className='min-h-screen anime-slide-up'>
      <div className='anime-glass rounded-3xl p-8 mb-8 text-center'>
        <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 dark:from-purple-800 dark:to-pink-800 mb-4'>
          <svg className='w-8 h-8 text-pink-500 dark:text-pink-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' />
          </svg>
        </div>
        <h1 className='text-2xl font-bold anime-gradient-text'>
          {locale.NAV.ARCHIVE}
        </h1>
        <p className='text-gray-600 dark:text-gray-400 mt-2'>时光荏苒，记录点滴</p>
      </div>

      {Object.keys(archivePosts).map((archiveTitle, index) => (
        <div 
          key={archiveTitle}
          className='anime-slide-up'
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <BlogArchiveItem
            archiveTitle={archiveTitle}
            archivePosts={archivePosts}
          />
        </div>
      ))}
    </div>
  )
}

const LayoutSlug = props => {
  const { post, recommendPosts, lock, validPassword, tagOptions, categories, latestPosts, siteInfo } = props
  const { locale } = useGlobal()
  const router = useRouter()

  useEffect(() => {
    if (post) {
      initialPWA(post, siteInfo)
    }
  }, [post])

  if (lock) {
    return <ArticleLock validPassword={validPassword} />
  }

  // 检测是否为音乐页面（slug 为 music 或页面类型为 Music）
  const isMusicPage = post?.slug === 'music' || post?.type === 'Music'

  // 如果是音乐页面，使用音乐布局
  if (isMusicPage) {
    return <LayoutMusic {...props} />
  }

  return (
    <div className='min-h-screen anime-slide-up'>
      <article className='anime-glass rounded-3xl overflow-hidden anime-card article-detail'>
        {post?.pageCover && (
          <div className='relative h-72 md:h-96 overflow-hidden'>
            <img
              src={post.pageCover}
              alt={post.title}
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent'></div>
            <div className='absolute bottom-8 left-8 right-8'>
              <h1 className='text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg'>
                {post?.title}
              </h1>
              <div className='flex flex-wrap items-center gap-4 text-white/90 text-sm'>
                <div className='flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                  </svg>
                  <span>{post?.date?.start_date}</span>
                </div>
                {post?.category && (
                  <div className='flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' />
                    </svg>
                    <span>{post.category}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className='p-6 md:p-10'>
          {!post?.pageCover && (
            <h1 className='text-3xl md:text-4xl font-bold anime-gradient-text mb-6'>
              {post?.title}
            </h1>
          )}

          {post?.tags && post.tags.length > 0 && (
            <div className='flex flex-wrap gap-2 mb-8'>
              {post.tags.map((tag, index) => (
                <SmartLink key={index} href={`/tag/${encodeURIComponent(tag)}`}>
                  <span className='anime-tag cursor-pointer'>#{tag}</span>
                </SmartLink>
              ))}
            </div>
          )}

          <div className='prose dark:prose-invert max-w-none'>
            <NotionPage post={post} />
          </div>

          <div className='anime-divider my-10'></div>

          <ShareBar post={post} />

          <AdSlot />

          {/* 二次元萌化广告横幅 */}
          {siteConfig('ANIME_AD_BANNER_ENABLE', getThemeConfig('AD_BANNER.ENABLE', true), CONFIG) && <KawaiiAdBanner />}

          <Comment frontMatter={post} />
        </div>
      </article>

      {/* AI解释功能组件 - 仅在文章详情页显示 */}
      <AIExplanation />

      {recommendPosts && recommendPosts.length > 0 && (
        <div className='mt-10 anime-slide-up'>
          <h2 className='text-xl font-bold anime-gradient-text mb-6 flex items-center gap-2'>
            <svg className='w-6 h-6 text-pink-400' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z' clipRule='evenodd' />
            </svg>
            相关推荐
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {recommendPosts.slice(0, 3).map((post, index) => (
              <div 
                key={index}
                className='anime-slide-up'
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BlogPostCard post={post} showSummary={false} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const Layout404 = props => {
  const router = useRouter()
  const { locale } = useGlobal()

  useEffect(() => {
    setTimeout(() => {
      const article = isBrowser && document.getElementById('article-wrapper')
      if (!article) {
        router.push('/')
      }
    }, 3000)
  }, [])

  return (
    <div className='min-h-screen flex items-center justify-center anime-slide-up'>
      <div className='text-center'>
        <div className='relative inline-block mb-8'>
          <div className='w-40 h-40 rounded-full anime-gradient-bg flex items-center justify-center anime-float'>
            <span className='text-7xl'>🌸</span>
          </div>
          <div className='absolute -top-2 -right-2 w-8 h-8 rounded-full bg-pink-400 animate-ping'></div>
          <div className='absolute -bottom-1 -left-3 w-6 h-6 rounded-full bg-purple-400 animate-pulse'></div>
        </div>
        <h1 className='text-6xl font-bold anime-gradient-text mb-4'>404</h1>
        <p className='text-xl text-gray-600 dark:text-gray-400 mb-2'>迷失在二次元的世界里了~</p>
        <p className='text-gray-500 dark:text-gray-500 mb-8'>
          {locale.NAV.PAGE_NOT_FOUND_REDIRECT}
        </p>
        <SmartLink href='/'>
          <button className='anime-btn cursor-pointer inline-flex items-center gap-2'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
            </svg>
            返回首页
          </button>
        </SmartLink>
      </div>
    </div>
  )
}

const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  const { locale } = useGlobal()
  const router = useRouter()

  return (
    <div className='min-h-screen anime-slide-up'>
      <div className='anime-glass rounded-3xl p-8 mb-8 text-center'>
        <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 dark:from-purple-800 dark:to-pink-800 mb-4'>
          <svg className='w-8 h-8 text-pink-500 dark:text-pink-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' />
          </svg>
        </div>
        <h1 className='text-2xl font-bold anime-gradient-text'>
          {locale.NAV.CATEGORY}
        </h1>
        <p className='text-gray-600 dark:text-gray-400 mt-2'>探索不同领域的内容</p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
        {categoryOptions?.map((category, index) => (
          <SmartLink
            key={index}
            href={`/category/${category.name}`}
            className={`block p-5 rounded-2xl transition-all duration-300 cursor-pointer anime-card
              ${router.asPath === `/category/${category.name}`
                ? 'anime-gradient-bg text-white shadow-lg'
                : 'anime-glass hover:shadow-lg text-gray-800 dark:text-gray-100'
              }`}>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  router.asPath === `/category/${category.name}`
                    ? 'bg-white/20'
                    : 'bg-gradient-to-br from-pink-100 to-purple-100 dark:from-purple-800 dark:to-pink-800'
                }`}>
                  <svg className={`w-5 h-5 ${
                    router.asPath === `/category/${category.name}`
                      ? 'text-white'
                      : 'text-pink-500 dark:text-pink-300'
                  }`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' />
                  </svg>
                </div>
                <span className='font-semibold'>{category.name}</span>
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                router.asPath === `/category/${category.name}`
                  ? 'bg-white/20 text-white'
                  : 'bg-pink-100 dark:bg-purple-800 text-pink-600 dark:text-pink-300'
              }`}>
                {category.count}
              </span>
            </div>
          </SmartLink>
        ))}
      </div>
    </div>
  )
}

const LayoutTagIndex = props => {
  const { tagOptions } = props
  const { locale } = useGlobal()

  return (
    <div className='min-h-screen anime-slide-up'>
      <div className='anime-glass rounded-3xl p-8 mb-8 text-center'>
        <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 dark:from-purple-800 dark:to-pink-800 mb-4'>
          <svg className='w-8 h-8 text-pink-500 dark:text-pink-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' />
          </svg>
        </div>
        <h1 className='text-2xl font-bold anime-gradient-text'>
          {locale.NAV.TAGS}
        </h1>
        <p className='text-gray-600 dark:text-gray-400 mt-2'>发现更多有趣的内容</p>
      </div>

      <div className='flex flex-wrap gap-3 justify-center'>
        {tagOptions?.map((tag, index) => (
          <SmartLink
            key={index}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            className='anime-tag cursor-pointer text-sm'>
            #{tag.name}
            <span className='ml-1 px-1.5 py-0.5 rounded-full bg-white/50 dark:bg-black/20 text-xs'>
              {tag.count}
            </span>
          </SmartLink>
        ))}
      </div>
    </div>
  )
}

/**
 * 音乐页面布局
 * 用于展示音乐列表和播放器，左侧悬浮显示歌词
 */
const LayoutMusic = props => {
  const { post, siteInfo } = props
  const { locale } = useGlobal()

  // 从主题配置获取音乐列表
  const audioList = getThemeConfig('MUSIC.LIST', [])
  const showLyrics = getThemeConfig('MUSIC.SHOW_LYRICS', true)
  const lyricsBackground = getThemeConfig('MUSIC.LYRICS_BACKGROUND', true)

  // 播放状态管理
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)

  const currentSong = audioList[currentSongIndex] || {}

  return (
    <>
      {/* 左侧悬浮歌词 - 固定在视口左侧 */}
      {showLyrics && (
        <div 
          className='fixed hidden xl:flex items-center justify-center z-50 pointer-events-none'
          style={{
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '160px',
            height: '60vh'
          }}
        >
          <LyricsDisplay
            lrcUrl={currentSong.lrc}
            currentTime={currentTime}
            isPlaying={isPlaying}
            showBackground={lyricsBackground}
          />
        </div>
      )}
      
      <div className='min-h-screen anime-slide-up'>

      {/* 页面标题区域 */}
      <div className='anime-glass rounded-3xl p-8 mb-8 text-center relative overflow-hidden'>
        {/* 背景装饰 */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-0 left-0 w-32 h-32 bg-pink-400 rounded-full blur-3xl'></div>
          <div className='absolute bottom-0 right-0 w-40 h-40 bg-purple-400 rounded-full blur-3xl'></div>
        </div>

        <div className='relative z-10'>
          <div className='inline-flex items-center justify-center w-20 h-20 rounded-2xl anime-gradient-bg mb-6 shadow-lg shadow-pink-500/30'>
            <svg className='w-10 h-10 text-white' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' />
            </svg>
          </div>
          <h1 className='text-3xl font-bold anime-gradient-text mb-3'>
            {post?.title || locale.NAV.MUSIC || '音乐'}
          </h1>
          <p className='text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
            {post?.summary || '在这里聆听美妙的音乐，放松心情'}
          </p>
        </div>
      </div>

      {/* 主内容区域：音乐播放器 */}
      <div className='max-w-4xl mx-auto relative z-20'>
        <MusicPlayer
          audioList={audioList}
          onSongChange={setCurrentSongIndex}
          onTimeUpdate={setCurrentTime}
          onPlayStateChange={setIsPlaying}
          onDurationChange={setDuration}
        />
      </div>

    </div>
    </>
  )
}

/**
 * 抖音解析页面布局
 * 二次元萌化风格的视频/图文解析工具页面
 * 注意：此布局不使用侧边栏
 */
const LayoutDouyin = props => {
  return (
    <div className='min-h-screen anime-slide-up' id="douyin-page">
      {/* 隐藏侧边栏的样式 */}
      <style jsx global>{`
        #douyin-page ~ aside,
        #douyin-page ~ [class*="side"],
        #douyin-page ~ [class*="Side"],
        main:has(#douyin-page) .lg\\:block,
        main:has(#douyin-page) aside {
          display: none !important;
        }
        main:has(#douyin-page) .max-w-4xl {
          max-width: none !important;
        }
      `}</style>
      
      {/* Hero 区域 */}
      <DouyinParserHero />

      {/* 解析工具主体 */}
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16'>
        <DouyinParser />
      </div>
    </div>
  )
}



export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutDouyin,
  LayoutIndex,
  LayoutMusic,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
