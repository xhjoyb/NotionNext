import { useEffect, useState } from 'react'
import { getThemeConfig } from '../config'

/**
 * 动漫角色引用卡片组件
 * 显示配置的二次元台词，增加文化氛围
 */
const AnimeQuoteCard = () => {
  const [currentQuote, setCurrentQuote] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // 获取配置
  const enabled = getThemeConfig('ANIME_QUOTE.ENABLE', true)
  const autoRotate = getThemeConfig('ANIME_QUOTE.AUTO_ROTATE', true)
  const rotateInterval = getThemeConfig('ANIME_QUOTE.ROTATE_INTERVAL', 10000)
  const showCharacter = getThemeConfig('ANIME_QUOTE.SHOW_CHARACTER', true)
  const showAnime = getThemeConfig('ANIME_QUOTE.SHOW_ANIME', true)
  const quotes = getThemeConfig('ANIME_QUOTE.QUOTES', [])

  // 随机获取一条台词
  const getRandomQuote = () => {
    if (quotes.length === 0) return null
    const randomIndex = Math.floor(Math.random() * quotes.length)
    return quotes[randomIndex]
  }

  // 切换到下一条台词
  const nextQuote = () => {
    if (isAnimating || quotes.length <= 1) return

    setIsAnimating(true)

    // 淡出动画
    setTimeout(() => {
      let newQuote = getRandomQuote()
      // 确保不重复显示同一条
      while (currentQuote && newQuote && newQuote.text === currentQuote.text && quotes.length > 1) {
        newQuote = getRandomQuote()
      }
      setCurrentQuote(newQuote)

      // 淡入动画
      setTimeout(() => {
        setIsAnimating(false)
      }, 300)
    }, 300)
  }

  // 初始化
  useEffect(() => {
    if (!enabled || quotes.length === 0) return

    // 延迟显示，增加期待感
    const showTimer = setTimeout(() => {
      setCurrentQuote(getRandomQuote())
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(showTimer)
  }, [enabled, quotes.length])

  // 自动轮播
  useEffect(() => {
    if (!enabled || !autoRotate || !currentQuote || quotes.length <= 1) return

    const interval = setInterval(() => {
      nextQuote()
    }, rotateInterval)

    return () => clearInterval(interval)
  }, [enabled, autoRotate, rotateInterval, currentQuote, quotes.length])

  // 如果没有启用或没有配置台词，不显示
  if (!enabled || quotes.length === 0) return null

  return (
    <div
      className={`anime-glass rounded-2xl p-5 relative overflow-hidden transition-all duration-500 cursor-pointer group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      onClick={nextQuote}
      title={quotes.length > 1 ? "点击切换下一句" : ""}
    >
      {/* 装饰背景 */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 transition-all duration-500 group-hover:opacity-30"
        style={{ backgroundColor: currentQuote?.color || '#FF71CE' }}
      />
      <div
        className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl opacity-10 transition-all duration-500 group-hover:opacity-20"
        style={{ backgroundColor: currentQuote?.color || '#FF71CE' }}
      />

      {/* 引号装饰 */}
      <div className="absolute top-2 left-4 text-6xl font-serif text-pink-200 dark:text-pink-800 opacity-30 select-none">
        "
      </div>

      {/* 内容区域 */}
      <div className={`relative z-10 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        {/* 台词文本 */}
        <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed mb-4 font-medium pl-4">
          {currentQuote?.text}
        </p>

        {/* 角色和作品信息 */}
        {(showCharacter || showAnime) && currentQuote && (
          <div className="flex items-center justify-end gap-2 text-sm">
            {showCharacter && currentQuote.character && (
              <span
                className="font-semibold px-2 py-1 rounded-full text-white text-xs"
                style={{ backgroundColor: currentQuote.color || '#FF71CE' }}
              >
                {currentQuote.character}
              </span>
            )}
            {showAnime && showCharacter && currentQuote.anime && currentQuote.character && (
              <span className="text-gray-400">·</span>
            )}
            {showAnime && currentQuote.anime && (
              <span className="text-gray-500 dark:text-gray-400">
                《{currentQuote.anime}》
              </span>
            )}
          </div>
        )}
      </div>

      {/* 底部装饰线 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${currentQuote?.color || '#FF71CE'}, transparent)`,
          opacity: 0.6
        }}
      />

      {/* 切换提示 */}
      {quotes.length > 1 && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      )}

      {/* 自动轮播指示器 */}
      {autoRotate && quotes.length > 1 && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
          {quotes.map((_, index) => (
            <div
              key={index}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                currentQuote?.text === quotes[index].text
                  ? 'bg-pink-400 w-3'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default AnimeQuoteCard
