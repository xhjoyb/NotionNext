import { siteConfig } from '@/lib/config'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import KawaiiImageLoader from './KawaiiImageLoader'

/**
 * 二次元主题图片懒加载组件
 * 使用可爱的萌猫加载动画替代传统骨架屏
 * @param {*} param0
 * @returns
 */
export default function AnimeLazyImage({
  priority,
  id,
  src,
  alt,
  className,
  width,
  height,
  title,
  onLoad,
  onClick,
  style,
  loaderSize = 'md'
}) {
  const maxWidth = siteConfig('IMAGE_COMPRESS_WIDTH')
  const imageRef = useRef(null)
  const [currentSrc, setCurrentSrc] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  /**
   * 原图加载完成
   */
  const handleImageLoaded = () => {
    setIsLoaded(true)
    if (typeof onLoad === 'function') {
      onLoad()
    }
  }

  /**
   * 图片加载失败回调
   */
  const handleImageError = () => {
    // 加载失败时使用默认占位图
    const defaultPlaceholder = siteConfig('IMG_LAZY_LOAD_PLACEHOLDER')
    if (currentSrc !== defaultPlaceholder) {
      setCurrentSrc(defaultPlaceholder)
    }
    setIsLoaded(true)
  }

  useEffect(() => {
    const adjustedImageSrc = adjustImgSize(src, maxWidth)
    if (!adjustedImageSrc) {
      setIsLoaded(true)
      return
    }

    // 如果是优先级图片，直接加载
    if (priority) {
      const img = new Image()
      img.src = adjustedImageSrc
      img.onload = () => {
        setCurrentSrc(adjustedImageSrc)
        handleImageLoaded()
      }
      img.onerror = handleImageError
      return
    }

    // 检查浏览器是否支持IntersectionObserver
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      // 降级处理：直接加载图片
      const img = new Image()
      img.src = adjustedImageSrc
      img.onload = () => {
        setCurrentSrc(adjustedImageSrc)
        handleImageLoaded()
      }
      img.onerror = handleImageError
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // 预加载图片
            const img = new Image()
            if ('decoding' in img) {
              img.decoding = 'async'
            }
            img.src = adjustedImageSrc
            img.onload = () => {
              setCurrentSrc(adjustedImageSrc)
              handleImageLoaded()
            }
            img.onerror = handleImageError

            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: siteConfig('LAZY_LOAD_THRESHOLD', '200px'),
        threshold: 0.1
      }
    )

    if (imageRef.current) {
      observer.observe(imageRef.current)
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current)
      }
    }
  }, [src, maxWidth, priority])

  if (!src) {
    return null
  }

  // 动态添加属性
  const imgProps = {
    ref: imageRef,
    src: currentSrc,
    'data-src': src,
    alt: alt || 'Anime style lazy loaded image',
    onLoad: handleImageLoaded,
    onError: handleImageError,
    className: `${className || ''} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`,
    style: {
      ...style,
      position: isLoaded ? 'relative' : 'absolute',
      top: 0,
      left: 0
    },
    width: width || 'auto',
    height: height || 'auto',
    onClick,
    loading: priority ? 'eager' : 'lazy',
    decoding: 'async'
  }

  if (id) imgProps.id = id
  if (title) imgProps.title = title

  return (
    <>
      <div className="relative w-full h-full">
        {/* 二次元加载动画 - 图片未加载时显示 */}
        {!isLoaded && (
          <KawaiiImageLoader 
            className="absolute inset-0 w-full h-full" 
            size={loaderSize}
          />
        )}
        
        {/* 实际图片 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img {...imgProps} />
      </div>

      {/* 预加载优先级图片 */}
      {priority && currentSrc && (
        <Head>
          <link rel='preload' as='image' href={currentSrc} />
        </Head>
      )}
    </>
  )
}

/**
 * 根据窗口尺寸决定压缩图片宽度
 * @param {*} src
 * @param {*} maxWidth
 * @returns
 */
const adjustImgSize = (src, maxWidth) => {
  if (!src) {
    return null
  }
  const screenWidth =
    (typeof window !== 'undefined' && window?.screen?.width) || maxWidth

  // 屏幕尺寸大于默认图片尺寸，没必要再压缩
  if (screenWidth > maxWidth) {
    return src
  }

  // 正则表达式，用于匹配 URL 中的 width 参数
  const widthRegex = /width=\d+/
  // 正则表达式，用于匹配 URL 中的 w 参数
  const wRegex = /w=\d+/

  // 使用正则表达式替换 width/w 参数
  if (widthRegex.test(src)) {
    return src.replace(widthRegex, `width=${screenWidth}`)
  } else if (wRegex.test(src)) {
    return src.replace(wRegex, `w=${screenWidth}`)
  }

  return src
}
