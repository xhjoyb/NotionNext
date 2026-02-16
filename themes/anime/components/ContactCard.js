import FlipCard from '@/components/FlipCard'
import SmartLink from '@/components/SmartLink'
import { getThemeConfig } from '../config'

/**
 * 萌化联系卡片组件
 *
 * 设计特点：
 * - 信封翻转动画效果
 * - 粉色渐变配色，符合二次元萌系风格
 * - 可爱的猫咪/信封 SVG 图标
 * - 悬停时有弹跳动画
 */
const ContactCard = () => {
  // 使用 getThemeConfig 读取配置
  const enabled = getThemeConfig('CONTACT.ENABLE', true)
  const contactUrl = getThemeConfig('CONTACT.URL', 'https://github.com')
  const title1 = getThemeConfig('CONTACT.TITLE_1', '✨ 联系我')
  const title2 = getThemeConfig('CONTACT.TITLE_2', '一起交流吧~')
  const title3 = getThemeConfig('CONTACT.TITLE_3', '点击这里')

  if (!enabled) {
    return null
  }

  return (
    <div className='relative h-32'>
      <FlipCard
        className='cursor-pointer border rounded-2xl anime-glass border-pink-200/50 dark:border-purple-500/30 shadow-lg shadow-pink-200/30 dark:shadow-purple-500/20 overflow-hidden group'
        frontContent={
          <div className='h-full relative overflow-hidden p-6'>
            {/* 装饰背景 */}
            <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-pink-200/30 to-transparent rounded-bl-full'></div>
            <div className='absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-200/30 to-transparent rounded-tr-full'></div>

            {/* 萌化信封图标 */}
            <div className='absolute top-3 right-3 w-12 h-12 animate-contact-bounce'>
              <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-md">
                {/* 信封主体 */}
                <rect x="4" y="12" width="40" height="28" rx="4" fill="#FF6B9D" />
                {/* 信封翻盖 */}
                <path d="M4 16 L24 28 L44 16" stroke="#FF8FAB" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {/* 心形封口 */}
                <path d="M24 26 C24 26 20 22 20 19 C20 17 22 16 24 18 C26 16 28 17 28 19 C28 22 24 26 24 26 Z" fill="#FFF" />
                {/* 闪光效果 */}
                <circle cx="38" cy="18" r="2" fill="#FCD34D" className="animate-pulse" />
                <circle cx="10" cy="34" r="1.5" fill="#FCD34D" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
              </svg>
            </div>

            {/* 标题区域 */}
            <div className='relative z-10'>
              <h2 className='font-bold text-2xl text-gray-800 dark:text-white drop-shadow-sm'>
                {title1}
              </h2>
              <h3 className='pt-2 text-gray-600 dark:text-gray-300 text-sm flex items-center gap-1'>
                <span className="inline-block w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"></span>
                {title2}
              </h3>
            </div>

            {/* 底部装饰线 */}
            <div className='absolute bottom-4 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-pink-300/50 to-transparent'></div>
          </div>
        }
        backContent={
          <SmartLink href={contactUrl}>
            <div className='font-bold text-lg h-full flex flex-col items-center justify-center text-gray-800 dark:text-white hover:scale-105 transition-transform duration-300 relative overflow-hidden p-6'>
              {/* 背景装饰 */}
              <div className='absolute inset-0 bg-gradient-to-br from-pink-100/50 to-purple-100/50 dark:from-pink-900/30 dark:to-purple-900/30'></div>

              {/* 内容 */}
              <div className='relative z-10 flex items-center gap-2'>
                {/* 左樱花 */}
                <svg className="w-5 h-5 text-pink-400 animate-spin-slow" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.5 8.5L20 7L15 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9 12L4 7L10.5 8.5L12 2Z" />
                </svg>

                <span className='text-pink-600 dark:text-pink-300'>{title3}</span>

                {/* 右樱花 */}
                <svg className="w-5 h-5 text-pink-400 animate-spin-slow" viewBox="0 0 24 24" fill="currentColor" style={{ animationDelay: '0.5s' }}>
                  <path d="M12 2L13.5 8.5L20 7L15 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9 12L4 7L10.5 8.5L12 2Z" />
                </svg>
              </div>

              {/* 提示文字 */}
              <span className='relative z-10 text-xs text-gray-500 dark:text-gray-400 mt-2'>
                点击前往 →
              </span>

              {/* 底部装饰 */}
              <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1'>
                <span className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </SmartLink>
        }
      />
    </div>
  )
}

export default ContactCard
