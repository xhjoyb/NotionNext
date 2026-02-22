import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import LazyImage from '@/components/LazyImage'
import { getThemeConfig } from '../config'

export default function AnimeGalleryModal({ isOpen, onClose, isDarkMode = true }) {
  const [mounted, setMounted] = useState(false)
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  // 从配置文件获取相册配置
  const galleryConfig = getThemeConfig('GALLERY', {})
  const images = galleryConfig.IMAGES || []
  const galleryTitle = galleryConfig.TITLE || 'ANIME GALLERY'
  const gallerySubtitle = galleryConfig.SUBTITLE || 'アニメギャラリー'

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setIndex(0)
      setIsClosing(false)
      setTimeout(() => setIsLoaded(true), 100)
    } else {
      document.body.style.overflow = ''
      setIsLoaded(false)
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 600)
  }, [onClose])

  const navigate = useCallback((dir) => {
    setDirection(dir)
    setIndex((i) => {
      if (dir === 1) return i >= images.length - 1 ? 0 : i + 1
      return i <= 0 ? images.length - 1 : i - 1
    })
  }, [images.length])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') navigate(1)
      if (e.key === 'ArrowLeft') navigate(-1)
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, navigate, handleClose])

  const current = images[index] || {}

  const accentColor = isDarkMode ? '#ec4899' : '#db2777'
  const bgColor = isDarkMode ? '#0f0a14' : '#fdf2f8'
  const textColor = isDarkMode ? '#ffffff' : '#1f2937'
  const subTextColor = isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'
  const borderColor = isDarkMode ? 'rgba(236,72,153,0.3)' : 'rgba(219,39,119,0.3)'
  const glowColor = isDarkMode ? 'rgba(236,72,153,0.4)' : 'rgba(219,39,119,0.2)'

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.85,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (dir) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.85,
      transition: {
        duration: 0.4,
        ease: [0.55, 0.085, 0.68, 0.53],
      },
    }),
  }

  if (!mounted || images.length === 0) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden"
          style={{ backgroundColor: isDarkMode ? 'rgba(15, 10, 20, 0.75)' : 'rgba(253, 242, 248, 0.75)' }}
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.4 }}
        >
          {/* 背景装饰 - 樱花飘落 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}40 0%, transparent 100%)`,
                  left: `${Math.random() * 100}%`,
                  top: `-10%`,
                }}
                animate={{
                  y: ['0vh', '110vh'],
                  x: [0, Math.random() * 100 - 50, 0],
                  rotate: [0, 360],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 8 + Math.random() * 6,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: 'linear',
                }}
              />
            ))}
          </div>

          {/* 主内容区 */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* 顶部栏 */}
            <motion.div
              className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-6 z-30"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: isLoaded && !isClosing ? 0 : -50, opacity: isLoaded && !isClosing ? 1 : 0 }}
              transition={{ delay: 0.6, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3">
                <span 
                  className="text-4xl font-black"
                  style={{ color: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div 
                  className="h-px w-12"
                  style={{ background: `linear-gradient(to right, ${accentColor}, transparent)` }}
                />
                <span style={{ color: subTextColor, fontSize: '0.75rem', letterSpacing: '0.2em' }}>
                  / {String(images.length).padStart(2, '0')}
                </span>
              </div>

              <motion.button
                onClick={handleClose}
                className="relative w-12 h-12 flex items-center justify-center overflow-hidden group"
                style={{ 
                  border: `1px solid ${borderColor}`,
                  borderRadius: '50%',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{ backgroundColor: accentColor, opacity: 0.1 }}
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </motion.button>
            </motion.div>

            {/* 图片区域 */}
            <div className="relative h-full flex items-center justify-center px-4 lg:px-16 pt-20 pb-32">
              <div className="relative w-full max-w-5xl aspect-[16/9]">
                {/* 图片框幕布效果 - 入场和退场 */}
                <div className="absolute inset-0 flex pointer-events-none z-50 rounded-2xl overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 origin-top"
                      style={{ backgroundColor: bgColor }}
                      initial={{ scaleY: 1 }}
                      animate={{ scaleY: isLoaded && !isClosing ? 0 : isClosing ? 1 : 1 }}
                      transition={{
                        duration: isClosing ? 0.5 : 0.6,
                        delay: isClosing ? (5 - i) * 0.04 : i * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  ))}
                </div>

                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={index}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 z-0"
                  >
                    {/* 图片 */}
                    <div 
                      className="relative w-full h-full rounded-2xl overflow-hidden"
                      style={{ border: `2px solid ${borderColor}` }}
                    >
                      <LazyImage
                        src={current.src}
                        alt={current.title}
                        className="w-full h-full object-cover"
                      />

                      {/* 渐变遮罩 */}
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: isDarkMode 
                            ? 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)'
                            : 'linear-gradient(to top, rgba(255,255,255,0.6) 0%, transparent 50%)',
                        }}
                      />

                      {/* 信息面板 */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 p-6 lg:p-10"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <h2 
                          className="text-3xl lg:text-5xl font-bold mb-2"
                          style={{ 
                            color: textColor,
                            fontFamily: 'serif',
                            textShadow: isDarkMode ? `0 0 30px ${accentColor}50` : 'none',
                          }}
                        >
                          {current.title}
                        </h2>
                        <p 
                          className="text-sm tracking-[0.3em] uppercase"
                          style={{ color: accentColor }}
                        >
                          {current.subtitle}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* 固定的边框装饰层 - 在照片之上 */}
                <div className="absolute inset-0 pointer-events-none z-10">
                  {/* 发光边框 */}
                  <motion.div
                    className="absolute -inset-1 rounded-2xl"
                    style={{
                      boxShadow: `
                        0 0 30px ${glowColor},
                        0 0 60px ${glowColor},
                        inset 0 0 30px ${glowColor}
                      `,
                    }}
                    animate={{
                      boxShadow: [
                        `0 0 20px ${glowColor}, 0 0 40px ${glowColor}`,
                        `0 0 40px ${glowColor}, 0 0 80px ${glowColor}`,
                        `0 0 20px ${glowColor}, 0 0 40px ${glowColor}`,
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  {/* 角落装饰 */}
                  <div className="absolute -top-3 -left-3 w-6 h-6 border-l-2 border-t-2" style={{ borderColor: accentColor }} />
                  <div className="absolute -top-3 -right-3 w-6 h-6 border-r-2 border-t-2" style={{ borderColor: accentColor }} />
                  <div className="absolute -bottom-3 -left-3 w-6 h-6 border-l-2 border-b-2" style={{ borderColor: accentColor }} />
                  <div className="absolute -bottom-3 -right-3 w-6 h-6 border-r-2 border-b-2" style={{ borderColor: accentColor }} />
                </div>
              </div>
            </div>

            {/* 底部导航 */}
            <motion.div
              className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-6 z-30"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: isLoaded && !isClosing ? 0 : 50, opacity: isLoaded && !isClosing ? 1 : 0 }}
              transition={{ delay: 0.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.button
                onClick={() => navigate(-1)}
                className="w-12 h-12 flex items-center justify-center transition-colors flex-shrink-0"
                style={{ border: `1px solid ${borderColor}`, borderRadius: '50%', color: subTextColor }}
                whileHover={{ scale: 1.1, borderColor: accentColor, color: accentColor }}
                whileTap={{ scale: 0.9 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </motion.button>

              <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)' }}>
                {images.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i) }}
                    className="relative h-1.5 rounded-full overflow-hidden flex-shrink-0"
                    style={{ 
                      width: i === index ? 28 : 6,
                      backgroundColor: i === index ? 'transparent' : isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    }}
                    whileHover={{ scale: 1.2 }}
                  >
                    {i === index && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: accentColor }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              <motion.button
                onClick={() => navigate(1)}
                className="w-12 h-12 flex items-center justify-center transition-colors flex-shrink-0"
                style={{ border: `1px solid ${borderColor}`, borderRadius: '50%', color: subTextColor }}
                whileHover={{ scale: 1.1, borderColor: accentColor, color: accentColor }}
                whileTap={{ scale: 0.9 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </motion.button>
            </motion.div>

            {/* 侧边装饰文字 */}
            <motion.div
              className="absolute left-6 top-1/2 -translate-y-1/2 text-xs tracking-[0.4em]"
              style={{ writingMode: 'vertical-rl', color: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isLoaded && !isClosing ? 1 : 0, x: isLoaded && !isClosing ? 0 : -20 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              {galleryTitle}
            </motion.div>

            <motion.div
              className="absolute right-6 top-1/2 -translate-y-1/2 text-xs tracking-[0.4em]"
              style={{ writingMode: 'vertical-rl', color: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)' }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isLoaded && !isClosing ? 1 : 0, x: isLoaded && !isClosing ? 0 : 20 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              {gallerySubtitle}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
