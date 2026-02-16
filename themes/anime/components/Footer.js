import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useState } from 'react'
import SocialButton from './SocialButton'
import CONFIG from '../config'

const Footer = props => {
  const { siteInfo } = props
  const { locale } = useGlobal()
  const [iconError, setIconError] = useState(false)
  const since = siteConfig('SINCE')
  const currentYear = new Date().getFullYear()
  const copyrightDate = since === currentYear ? currentYear : `${since} - ${currentYear}`

  return (
    <footer className='mt-12 relative'>
      {/* 顶部阴影分隔线 */}
      <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-300 dark:via-purple-500 to-transparent'></div>
      
      {/* 背景与主体区分 */}
      <div className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-pink-200/50 dark:border-purple-700/50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)]'>
        <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0'>
          <div className='flex items-center space-x-4'>
            <div className='w-12 h-12 rounded-full overflow-hidden anime-glow ring-2 ring-pink-200 dark:ring-purple-600 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-purple-800 dark:to-pink-800 flex items-center justify-center'>
              {siteInfo?.icon && !iconError ? (
                <img
                  src={siteInfo.icon}
                  alt={siteInfo?.title}
                  className='w-full h-full object-cover'
                  onError={() => setIconError(true)}
                />
              ) : (
                <span className='text-2xl'>🌸</span>
              )}
            </div>
            <div>
              <h3 className='font-bold anime-gradient-text'>{siteInfo?.title}</h3>
              <p className='text-sm text-gray-500 dark:text-gray-400'>{siteInfo?.description}</p>
            </div>
          </div>

          <SocialButton className='justify-center' />
        </div>

        <div className='anime-divider my-6'></div>

        <div className='flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 text-sm text-gray-500 dark:text-gray-400'>
          <div className='flex items-center space-x-2'>
            <i className='fas fa-heart text-pink-400 animate-pulse'></i>
            <span>
              {locale.COMMON.COPYRIGHT} &copy; {copyrightDate} {siteConfig('AUTHOR')}
            </span>
          </div>
          
          <div className='flex items-center space-x-4'>
            <span className='flex items-center space-x-1'>
              <i className='fas fa-code text-purple-400'></i>
              <span>Powered by NotionNext</span>
            </span>
            {siteConfig('BEI_AN') && (
              <a
                href={siteConfig('BEI_AN_LINK')}
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-pink-500 transition-colors duration-300 cursor-pointer'>
                {siteConfig('BEI_AN')}
              </a>
            )}
          </div>
        </div>
      </div>
      </div>
    </footer>
  )
}

export default Footer
