import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import CONFIG from '../config'

const Hero = props => {
  const { siteInfo, latestPosts, allNavPages } = props
  const { locale } = useGlobal()
  const router = useRouter()

  const title1 = siteConfig('ANIME_HERO_TITLE_1', '你好，', CONFIG)
  const title2 = siteConfig('ANIME_HERO_TITLE_2', '欢迎来到我的博客', CONFIG)
  const title3 = siteConfig('ANIME_HERO_TITLE_3', '这里记录着我的日常与思考', CONFIG)

  const topPosts = getTopPosts({ latestPosts, allNavPages })

  return (
    <section className='relative overflow-hidden pt-24'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <FloatingShapes />
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          <div className='text-center lg:text-left space-y-8'>
            <div className='space-y-4'>
              <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-purple-900/40 backdrop-blur-sm border-2 border-pink-200 dark:border-purple-700 anime-bounce-in'>
                <span className='w-2 h-2 bg-pink-400 rounded-full animate-pulse'></span>
                <span className='text-sm font-medium text-gray-600 dark:text-gray-300'>探索二次元的奇妙世界</span>
              </div>
              
              <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight anime-slide-up'>
                <span className='anime-gradient-text'>{title1}</span>
                <br />
                <span className='text-gray-800 dark:text-white relative'>
                  {title2}
                  <svg className='absolute -bottom-2 left-0 w-full h-3 text-pink-300 dark:text-purple-500' viewBox='0 0 200 12' preserveAspectRatio='none'>
                    <path d='M0,8 Q50,0 100,8 T200,8' stroke='currentColor' strokeWidth='3' fill='none' strokeLinecap='round'/>
                  </svg>
                </span>
              </h1>
              
              <p className='text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0 anime-slide-up' style={{animationDelay: '0.1s'}}>
                {title3}
              </p>
            </div>

            <div className='flex flex-wrap justify-center lg:justify-start gap-4 anime-slide-up' style={{animationDelay: '0.2s'}}>
              <SmartLink
                href='/'
                className='anime-btn inline-flex items-center gap-2 cursor-pointer'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                </svg>
                <span>{locale.NAV.INDEX}</span>
              </SmartLink>
              <SmartLink
                href='/search'
                className='px-6 py-3 rounded-full border-3 border-pink-300 dark:border-purple-500 text-pink-500 dark:text-purple-300 font-semibold hover:bg-pink-50 dark:hover:bg-purple-900/30 transition-all duration-300 cursor-pointer inline-flex items-center gap-2 hover:shadow-lg hover:shadow-pink-200/50 dark:hover:shadow-purple-500/20'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
                {locale.NAV.SEARCH}
              </SmartLink>
            </div>

            <div className='flex justify-center lg:justify-start gap-8 pt-4 anime-slide-up' style={{animationDelay: '0.3s'}}>
              <StatCard 
                value={allNavPages?.length || 0} 
                label='篇文章' 
                icon={
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                  </svg>
                }
              />
              <StatCard 
                value={new Date().getFullYear() - (siteConfig('SINCE') || 2024) + 1} 
                label='年坚持' 
                icon={
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                }
              />
              <StatCard 
                value='∞' 
                label='份热爱' 
                icon={
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                  </svg>
                }
              />
            </div>
          </div>

          <div className='hidden lg:block relative anime-slide-up' style={{animationDelay: '0.2s'}}>
            <div className='absolute inset-0 anime-gradient-bg rounded-3xl blur-3xl opacity-20 animate-pulse'></div>
            <div className='relative anime-glass rounded-3xl p-6 overflow-hidden'>
              <div className='absolute top-4 right-4 flex gap-2'>
                <span className='w-3 h-3 rounded-full bg-pink-400'></span>
                <span className='w-3 h-3 rounded-full bg-yellow-400'></span>
                <span className='w-3 h-3 rounded-full bg-teal-400'></span>
              </div>
              
              <h3 className='font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2'>
                <svg className='w-5 h-5 text-pink-400' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
                推荐阅读
              </h3>
              
              <div className='grid grid-cols-2 gap-4'>
                {topPosts?.slice(0, 4).map((post, index) => (
                  <SmartLink
                    key={index}
                    href={`/${post?.slug}`}
                    className='group cursor-pointer'>
                    <div className='relative overflow-hidden rounded-2xl aspect-video anime-card'>
                      <LazyImage
                        src={post?.pageCoverThumbnail || siteInfo?.pageCover}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent'></div>
                      <div className='absolute bottom-3 left-3 right-3'>
                        <h4 className='text-white text-sm font-medium line-clamp-2 group-hover:text-pink-200 transition-colors'>
                          {post?.title}
                        </h4>
                      </div>
                      <div className='absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1'>
                        <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                        </svg>
                        HOT
                      </div>
                    </div>
                  </SmartLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

const StatCard = ({ value, label, icon }) => (
  <div className='text-center group cursor-default'>
    <div className='inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 dark:from-purple-800 dark:to-pink-800 mb-2'>
      <span className='text-pink-500 dark:text-pink-300'>{icon}</span>
    </div>
    <div className='text-2xl font-bold anime-gradient-text'>{value}</div>
    <div className='text-sm text-gray-500 dark:text-gray-400'>{label}</div>
  </div>
)

const FloatingShapes = () => (
  <>
    <div className='anime-shape anime-shape-circle w-4 h-4 top-20 left-[10%] anime-float' style={{animationDelay: '0s'}}></div>
    <div className='anime-shape anime-shape-circle w-6 h-6 top-40 right-[15%] anime-float' style={{animationDelay: '1s'}}></div>
    <div className='anime-shape anime-shape-circle w-3 h-3 bottom-20 left-[20%] anime-float' style={{animationDelay: '2s'}}></div>
    <div className='anime-shape anime-shape-diamond top-32 left-[30%] anime-float' style={{animationDelay: '0.5s'}}></div>
    <div className='anime-shape anime-shape-diamond bottom-32 right-[25%] anime-float' style={{animationDelay: '1.5s'}}></div>
    <div className='anime-shape anime-shape-triangle top-48 right-[10%] anime-float' style={{animationDelay: '2.5s'}}></div>
  </>
)

function getTopPosts({ latestPosts, allNavPages }) {
  const recommendTag = siteConfig('ANIME_RECOMMEND_POST_TAG', 'Recommend', CONFIG)
  
  if (!recommendTag || recommendTag === '') {
    return latestPosts?.slice(0, 6) || []
  }

  const sortPosts = [...(allNavPages || [])]
  const topPosts = []

  for (const post of sortPosts) {
    if (topPosts.length >= 6) break
    if (post?.tags?.includes(recommendTag)) {
      topPosts.push(post)
    }
  }

  return topPosts.length > 0 ? topPosts : latestPosts?.slice(0, 6) || []
}

export default Hero
