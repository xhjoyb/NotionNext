import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef, useCallback } from 'react'
import CONFIG, { getThemeConfig } from '../config'
import { useScrollListener } from '../hooks/useStickyPosition'
// TODO: [春节装饰] 2026马年春节临时装饰组件，年后移除
// 添加时间: 2026-02-16 (除夕)
// 移除时间: 2026-03-05 (元宵节后)
// 组件位置: ./NewYearDecoration.js
// 相关配置: config.js 中的 NEW_YEAR 配置项
import NewYearDecoration from './NewYearDecoration'
import DanmakuToggle from './DanmakuToggle'
import LearningProgressModal from './LearningProgressModal'

const Header = props => {
  const { siteInfo, customNav, customMenu, allNavPages } = props
  const { locale, isDarkMode, toggleDarkMode } = useGlobal()
  const router = useRouter()

  // 随机跳转到一篇文章
  const handleRandomPost = () => {
    if (allNavPages && allNavPages.length > 0) {
      const randomIndex = Math.floor(Math.random() * allNavPages.length)
      const randomPost = allNavPages[randomIndex]
      if (randomPost?.slug) {
        router.push(`/${randomPost.slug}`)
      }
    }
  }

  // 学习进度模态框状态
  const [showLearningProgress, setShowLearningProgress] = useState(false)

  // 是否启用学习进度功能
  const enableLearningProgress = getThemeConfig('LEARNING_PROGRESS.ENABLE', true)

  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [openSubMenu, setOpenSubMenu] = useState(null)
  const [iconError, setIconError] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const lastScrollY = useRef(0)
  const headerRef = useRef(null)

  // 获取默认 Logo 配置
  const defaultLogo = getThemeConfig('NAV.DEFAULT_LOGO', '')

  // 获取导航栏自动隐藏配置
  const autoHideOnScroll = getThemeConfig('NAV.AUTO_HIDE_ON_SCROLL', true)

  // 使用优化的滚动监听 hook
  const handleScroll = useCallback((currentScrollY) => {
    // 如果禁用了自动隐藏，始终显示导航栏
    if (!autoHideOnScroll) {
      setIsHeaderVisible(true)
      return
    }

    // 在顶部时始终显示
    if (currentScrollY < 100) {
      setIsHeaderVisible(true)
    } else {
      // 向下滚动隐藏，向上滚动显示
      const shouldShow = currentScrollY < lastScrollY.current
      setIsHeaderVisible(shouldShow)

      // 导航栏隐藏时关闭子菜单
      if (!shouldShow) {
        setOpenSubMenu(null)
      }
    }

    lastScrollY.current = currentScrollY
  }, [autoHideOnScroll])

  useScrollListener(handleScroll, true)

  // 点击外部关闭子菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpenSubMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 路由变化时关闭子菜单
  useEffect(() => {
    setOpenSubMenu(null)
  }, [router.pathname])

  // 使用 Notion 中的自定义菜单（Menu 类型页面）
  const notionMenuLinks = customMenu?.map(menu => ({
    name: menu.name,
    to: menu.href || menu.slug,
    show: true,
    subMenus: menu.subMenus?.map(sub => ({
      name: sub.name,
      to: sub.href || sub.slug,
      show: true
    }))
  })) || []

  // 使用 Notion 中的自定义导航（Page 类型页面）
  const notionNavLinks = customNav?.map(nav => ({
    name: nav.title,
    to: nav.slug,
    show: true
  })) || []

  const defaultLinks = [
    { name: locale.NAV.INDEX, to: '/', icon: 'fa-home', show: siteConfig('ANIME_MENU_INDEX', true, CONFIG) },
    { name: locale.NAV.TAGS, to: '/tag', icon: 'fa-tags', show: siteConfig('ANIME_MENU_TAG', true, CONFIG) },
    { name: locale.NAV.CATEGORY, to: '/category', icon: 'fa-folder', show: siteConfig('ANIME_MENU_CATEGORY', true, CONFIG) },
    { name: locale.NAV.ARCHIVE, to: '/archive', icon: 'fa-archive', show: siteConfig('ANIME_MENU_ARCHIVE', true, CONFIG) },
    { name: locale.NAV.SEARCH, to: '/search', icon: 'fa-search', show: siteConfig('ANIME_MENU_SEARCH', true, CONFIG) }
  ]

  // 优先级：Notion Menu > Notion Nav > 默认链接
  const links = notionMenuLinks.length > 0 
    ? notionMenuLinks 
    : (notionNavLinks.length > 0 ? notionNavLinks : defaultLinks.filter(link => link.show !== false))

  return (
    <header
      ref={headerRef}
      id='header'
      className={`fixed top-4 left-0 right-0 z-50 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-[calc(100%+2rem)]'}`}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='anime-glass rounded-2xl px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-12'>
            <SmartLink
              href='/'
              className='flex items-center space-x-3 group cursor-pointer'>
              <div className='relative'>
                <div className='w-8 h-8 rounded-full overflow-hidden anime-glow bg-gradient-to-br from-pink-100 to-purple-100 dark:from-purple-800 dark:to-pink-800 flex items-center justify-center'>
                  {defaultLogo ? (
                    <img
                      src={defaultLogo}
                      alt={siteInfo?.title}
                      className='w-full h-full object-cover'
                    />
                  ) : siteInfo?.icon && !iconError ? (
                    <img
                      src={siteInfo.icon}
                      alt={siteInfo?.title}
                      className='w-full h-full object-cover'
                      onError={() => setIconError(true)}
                    />
                  ) : (
                    <span className='text-lg'>🌸</span>
                  )}
                </div>
                {/* 二次元猫耳朵装饰 */}
                <div className='absolute -top-1.5 left-0.5 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-pink-400 dark:border-b-pink-300 transform -rotate-12 animate-ear-left'></div>
                <div className='absolute -top-1.5 right-0.5 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-pink-400 dark:border-b-pink-300 transform rotate-12 animate-ear-right'></div>
                {/* 耳朵内部 */}
                <div className='absolute -top-1 left-1.5 w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent border-b-pink-200 dark:border-b-pink-200 transform -rotate-12'></div>
                <div className='absolute -top-1 right-1.5 w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent border-b-pink-200 dark:border-b-pink-200 transform rotate-12'></div>
              </div>
              <span className='text-base font-bold anime-gradient-text hidden sm:block'>
                {siteInfo?.title}
              </span>
            </SmartLink>

            <nav className='hidden lg:flex items-center space-x-1'>
              {links.map((link, index) => (
                <div key={index} className='relative'>
                  {link.subMenus && link.subMenus.length > 0 ? (
                    <>
                      <button
                        onClick={() => setOpenSubMenu(openSubMenu === index ? null : index)}
                        className={`px-2 lg:px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 cursor-pointer flex items-center gap-1 whitespace-nowrap
                          ${router.pathname === link.to || link.subMenus.some(sub => router.pathname === sub.to)
                            ? 'anime-gradient-bg text-white shadow-lg'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-purple-900/30'
                          }`}>
                        {link.name}
                        <svg className={`w-3 h-3 transition-transform duration-200 ${openSubMenu === index ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                        </svg>
                      </button>
                      
                      {/* 子菜单下拉 */}
                      <div className={`absolute top-full left-0 mt-2 py-2 px-2 anime-glass rounded-xl min-w-[160px] transition-all duration-200 ${openSubMenu === index ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                        {link.subMenus.map((sub, subIndex) => (
                          <SmartLink
                            key={subIndex}
                            href={sub.to}
                            className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200
                              ${router.pathname === sub.to
                                ? 'anime-gradient-bg text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-purple-900/30'
                              }`}>
                            {sub.name}
                          </SmartLink>
                        ))}
                      </div>
                    </>
                  ) : (
                    <SmartLink
                      href={link.to}
                      className={`px-2 lg:px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 cursor-pointer block whitespace-nowrap
                        ${router.pathname === link.to
                          ? 'anime-gradient-bg text-white shadow-lg'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-purple-900/30'
                        }`}>
                      {link.name}
                    </SmartLink>
                  )}
                </div>
              ))}
            </nav>

            <div className='flex items-center space-x-2'>
              {/* TODO: [春节装饰] 2026马年春节临时装饰，年后移除 */}
              {/* 移除方法: 删除下面这行 <NewYearDecoration /> 和对应的 import */}
              <NewYearDecoration />

              {/* 学习进度按钮 */}
              {enableLearningProgress && (
                <button
                  onClick={() => setShowLearningProgress(true)}
                  className='hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg shadow-pink-200/50 dark:shadow-purple-900/30 hover:shadow-xl hover:shadow-pink-300/50 dark:hover:shadow-purple-800/40 transition-all duration-300 cursor-pointer hover:scale-105'
                  title='学习进度'
                  aria-label='学习进度'>
                  <i className='fas fa-book-open'></i>
                  <span>{getThemeConfig('LEARNING_PROGRESS.BUTTON_TEXT', '学习进度')}</span>
                </button>
              )}

              {/* 随机文章 */}
              <button
                onClick={handleRandomPost}
                className='hidden sm:flex p-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-110 hover:bg-pink-50 dark:hover:bg-purple-900/30'
                title='随机文章'
                aria-label='随机文章'>
                <i className='fas fa-dice text-pink-400'></i>
              </button>

              {/* 弹幕开关 */}
              <DanmakuToggle />

              <button
                onClick={toggleDarkMode}
                className='p-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-110 animate-breathe'
                aria-label='Toggle dark mode'>
                <i className={`fas ${isDarkMode ? 'fa-sun text-yellow-400' : 'fa-moon text-purple-400'}`}></i>
              </button>

              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className='lg:hidden p-2 rounded-full hover:bg-pink-50 dark:hover:bg-purple-900/30 transition-all duration-300 cursor-pointer'>
                <i className={`fas ${showMobileMenu ? 'fa-times' : 'fa-bars'} text-pink-500`}></i>
              </button>
            </div>
          </div>

          {showMobileMenu && (
            <div className='lg:hidden py-3 border-t border-pink-100 dark:border-purple-800'>
              <nav className='flex flex-col space-y-1'>
                {links.map((link, index) => (
                  <div key={index}>
                    {link.subMenus && link.subMenus.length > 0 ? (
                      <>
                        <button
                          onClick={() => setOpenSubMenu(openSubMenu === index ? null : index)}
                          className={`w-full px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-between
                            ${router.pathname === link.to
                              ? 'anime-gradient-bg text-white'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-purple-900/30'
                            }`}>
                          {link.name}
                          <svg className={`w-3 h-3 transition-transform duration-200 ${openSubMenu === index ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                          </svg>
                        </button>
                        {openSubMenu === index && (
                          <div className='pl-4 mt-1 space-y-1'>
                            {link.subMenus.map((sub, subIndex) => (
                              <SmartLink
                                key={subIndex}
                                href={sub.to}
                                onClick={() => setShowMobileMenu(false)}
                                className={`block px-3 py-1.5 rounded-full text-sm transition-all duration-300
                                  ${router.pathname === sub.to
                                    ? 'anime-gradient-bg text-white'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-purple-900/30'
                                  }`}>
                                {sub.name}
                              </SmartLink>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <SmartLink
                        href={link.to}
                        onClick={() => setShowMobileMenu(false)}
                        className={`block px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300
                          ${router.pathname === link.to
                            ? 'anime-gradient-bg text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-purple-900/30'
                          }`}>
                        {link.name}
                      </SmartLink>
                    )}
                  </div>
                ))}
                
                {/* 移动端学习进度 */}
                {enableLearningProgress && (
                  <button
                    onClick={() => {
                      setShowLearningProgress(true)
                      setShowMobileMenu(false)
                    }}
                    className='w-full px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-purple-900/30'>
                    <i className='fas fa-book-open text-pink-400'></i>
                    {getThemeConfig('LEARNING_PROGRESS.BUTTON_TEXT', '学习进度')}
                  </button>
                )}

                {/* 移动端随机文章 */}
                <button
                  onClick={() => {
                    handleRandomPost()
                    setShowMobileMenu(false)
                  }}
                  className='w-full px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-purple-900/30'>
                  <i className='fas fa-dice text-pink-400'></i>
                  随机文章
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* 学习进度模态框 */}
      <LearningProgressModal
        isOpen={showLearningProgress}
        onClose={() => setShowLearningProgress(false)}
        posts={allNavPages || []}
      />
    </header>
  )
}

export default Header
