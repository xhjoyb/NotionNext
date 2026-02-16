import { isBrowser } from '@/lib/utils'
import mediumZoom from '@fisch0920/medium-zoom'
import { useState, useEffect, useRef } from 'react'

/**
 * 相册瀑布流组件
 * 支持懒加载、悬停效果、响应式布局
 * 灯箱功能使用 MediumZoom
 */
const Gallery = ({ images = [], columns = 3 }) => {
  const [loadedImages, setLoadedImages] = useState(new Set())
  const [windowWidth, setWindowWidth] = useState(1024)
  const galleryRef = useRef(null)
  const zoomRef = useRef(null)

  // 监听窗口大小变化 - 使用节流
  useEffect(() => {
    let resizeTimer = null
    
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        setWindowWidth(window.innerWidth)
      }, 250) // 节流 250ms
    }

    // 初始化
    setWindowWidth(window.innerWidth)

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimer) clearTimeout(resizeTimer)
    }
  }, [])

  // 初始化 MediumZoom - 只初始化一次
  useEffect(() => {
    if (!isBrowser || !galleryRef.current || zoomRef.current) return

    // 创建 zoom 实例
    const zoom = mediumZoom({
      background: 'rgba(0, 0, 0, 0.9)',
      margin: windowWidth < 500 ? 8 : windowWidth < 800 ? 16 : 24
    })

    zoomRef.current = zoom

    // 延迟 attach，确保图片已渲染
    const timer = setTimeout(() => {
      if (galleryRef.current && zoomRef.current) {
        const imgList = galleryRef.current.querySelectorAll('img[data-zoom-src]')
        imgList.forEach((img) => {
          if (!img.classList.contains('medium-zoom-image')) {
            zoomRef.current.attach(img)
          }
        })
      }
    }, 500)

    return () => {
      clearTimeout(timer)
      if (zoomRef.current) {
        zoomRef.current.detach()
        zoomRef.current = null
      }
    }
  }, []) // 只在组件挂载时初始化一次

  // 根据屏幕宽度计算列数
  const getColumnCount = () => {
    if (windowWidth < 640) return 1 // 移动端：1列
    if (windowWidth < 1024) return 2 // 平板：2列
    return columns // 桌面：传入的列数
  }

  // 处理图片加载完成
  const handleImageLoad = (index) => {
    setLoadedImages((prev) => {
      if (prev.has(index)) return prev
      return new Set(prev).add(index)
    })

    // 图片加载完成后，attach 到 zoom（避免重复 attach）
    if (zoomRef.current && galleryRef.current) {
      const img = galleryRef.current.querySelector(`img[data-index="${index}"]`)
      if (img && !img.classList.contains('medium-zoom-image')) {
        zoomRef.current.attach(img)
      }
    }
  }

  if (!images || images.length === 0) {
    return (
      <div className='text-center py-12 md:py-16 px-4'>
        <div className='w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-full anime-gradient-bg flex items-center justify-center anime-float'>
          <svg
            className='w-10 h-10 md:w-12 md:h-12 text-white'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
        </div>
        <h3 className='text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-2'>
          暂无图片
        </h3>
        <p className='text-sm md:text-base text-gray-500 dark:text-gray-400'>
          相册中还没有添加图片~
        </p>
      </div>
    )
  }

  const columnCount = getColumnCount()

  return (
    <>
      {/* 瀑布流网格 */}
      <div
        ref={galleryRef}
        className='gallery-masonry'
        style={{
          columnCount: columnCount,
          columnGap: windowWidth < 640 ? '0.75rem' : '1rem'
        }}>
        {images.map((image, index) => (
          <div
            key={index}
            className='gallery-item break-inside-avoid mb-3 md:mb-4 group anime-slide-up'
            style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}>
            <div className='relative overflow-hidden rounded-xl md:rounded-2xl anime-glass anime-card cursor-zoom-in'>
              {/* 图片 - 使用原生 img 标签，支持 data-zoom-src */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt || `图片 ${index + 1}`}
                data-index={index}
                data-zoom-src={image.src}
                className='w-full h-auto transition-transform duration-500 group-hover:scale-105'
                onLoad={() => handleImageLoad(index)}
              />

              {/* 悬停遮罩 - 桌面端显示，移动端隐藏 */}
              <div className='hidden md:flex absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-end justify-between p-4 pointer-events-none'>
                <div className='text-white'>
                  {image.title && (
                    <h4 className='font-semibold text-sm mb-1'>{image.title}</h4>
                  )}
                  {image.description && (
                    <p className='text-xs text-white/80 line-clamp-2'>
                      {image.description}
                    </p>
                  )}
                </div>
                <div className='w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7'
                    />
                  </svg>
                </div>
              </div>

              {/* 移动端图片标题 - 在图片下方显示 */}
              <div className='md:hidden p-3 bg-white/50 dark:bg-black/20'>
                {image.title && (
                  <h4 className='font-medium text-sm text-gray-800 dark:text-white truncate'>
                    {image.title}
                  </h4>
                )}
                {image.description && (
                  <p className='text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mt-1'>
                    {image.description}
                  </p>
                )}
              </div>

              {/* 加载占位 */}
              {!loadedImages.has(index) && (
                <div className='absolute inset-0 bg-gradient-to-br from-pink-100/50 to-purple-100/50 dark:from-purple-900/30 dark:to-pink-900/30 animate-pulse' />
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .gallery-masonry {
          column-count: 1;
        }
        @media (min-width: 640px) {
          .gallery-masonry {
            column-count: 2;
          }
        }
        @media (min-width: 1024px) {
          .gallery-masonry {
            column-count: ${columns};
          }
        }
        .gallery-item {
          break-inside: avoid;
          page-break-inside: avoid;
        }
      `}</style>
    </>
  )
}

export default Gallery
