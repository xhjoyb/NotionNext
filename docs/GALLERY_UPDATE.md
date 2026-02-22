# 相册功能更新记录

> 更新日期: 2026-02-22
> 
> 更新内容: 将原有的独立相册页面替换为模态框式相册组件

---

## 变更概述

本次更新将主题中的相册功能从**独立页面**形式改为**模态框**形式。用户点击导航栏的相册按钮后，会弹出一个全屏模态框展示照片，而不是跳转到新的页面。

---

## 新增文件

### 1. `themes/anime/components/AnimeGalleryModal.js`
新的模态框相册组件，包含以下特性：
- 全屏模态框展示
- 照片框幕布动画效果（入场和退场）
- 横向切换照片
- 键盘导航支持（左右箭头、ESC关闭）
- 樱花飘落背景装饰
- 发光边框效果
- 响应式设计
- 支持日间/夜间模式

---

## 修改的文件

### 1. `themes/anime/config.js`
**新增配置项:**
```javascript
// 相册配置
GALLERY: {
  // 是否启用相册
  ENABLE: true,
  // 相册标题
  TITLE: 'ANIME GALLERY',
  // 相册副标题（日文）
  SUBTITLE: 'アニメギャラリー',
  // 照片列表
  IMAGES: [
    {
      src: '图片URL',
      title: '日文标题',
      subtitle: '英文副标题'
    },
    // ... 更多照片
  ],
},
```

### 2. `themes/anime/components/Header.js`
**新增内容:**
- 导入 `AnimeGalleryModal` 组件
- 添加 `showGallery` 状态控制模态框显示
- 在导航栏（桌面端和移动端）添加相册按钮
- 点击按钮打开模态框

### 3. `themes/anime/index.js`
**移除内容:**
- 移除 `import Gallery from './components/Gallery'`
- 移除 `LayoutGallery` 组件定义
- 移除 `isGalleryPage` 检测逻辑
- 从 export 中移除 `LayoutGallery`

---

## 删除的文件

### 1. `themes/anime/components/Gallery.js`
旧的瀑布流相册组件，已完全移除。

---

## 回滚步骤

如需恢复到旧的相册页面形式，请按以下步骤操作：

### 步骤 1: 恢复 Gallery.js 文件
创建 `themes/anime/components/Gallery.js` 文件，内容如下：

```javascript
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
      }, 250)
    }

    setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimer) clearTimeout(resizeTimer)
    }
  }, [])

  // 初始化 MediumZoom
  useEffect(() => {
    if (!isBrowser || !galleryRef.current || zoomRef.current) return

    const zoom = mediumZoom({
      background: 'rgba(0, 0, 0, 0.9)',
      margin: windowWidth < 500 ? 8 : windowWidth < 800 ? 16 : 24
    })

    zoomRef.current = zoom

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
  }, [])

  const getColumnCount = () => {
    if (windowWidth < 640) return 1
    if (windowWidth < 1024) return 2
    return columns
  }

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => {
      if (prev.has(index)) return prev
      return new Set(prev).add(index)
    })

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
          <svg className='w-10 h-10 md:w-12 md:h-12 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
          </svg>
        </div>
        <h3 className='text-xl font-bold anime-text mb-2'>暂无图片</h3>
        <p className='text-gray-500 dark:text-gray-400'>相册中还没有添加图片哦~</p>
      </div>
    )
  }

  const columnCount = getColumnCount()
  const columns = Array.from({ length: columnCount }, () => [])
  
  images.forEach((image, index) => {
    columns[index % columnCount].push({ ...image, index })
  })

  return (
    <div ref={galleryRef} className='anime-gallery'>
      <div className='flex gap-3 md:gap-4'>
        {columns.map((column, colIndex) => (
          <div key={colIndex} className='flex-1 flex flex-col gap-3 md:gap-4'>
            {column.map((image) => (
              <div
                key={image.index}
                className='group relative overflow-hidden rounded-xl md:rounded-2xl bg-gray-100 dark:bg-gray-800 anime-card'
                style={{
                  opacity: loadedImages.has(image.index) ? 1 : 0,
                  transform: loadedImages.has(image.index) ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease'
                }}
              >
                <div className='relative overflow-hidden'>
                  <img
                    src={image.src}
                    alt={image.alt}
                    data-index={image.index}
                    data-zoom-src={image.src}
                    className='w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110 cursor-zoom-in'
                    loading='lazy'
                    onLoad={() => handleImageLoad(image.index)}
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                </div>
                
                {(image.title || image.description) && (
                  <div className='p-3 md:p-4 bg-white dark:bg-gray-800'>
                    {image.title && (
                      <h4 className='font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm md:text-base'>
                        {image.title}
                      </h4>
                    )}
                    {image.description && (
                      <p className='text-gray-600 dark:text-gray-400 text-xs md:text-sm line-clamp-2'>
                        {image.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Gallery
```

### 步骤 2: 修改 `themes/anime/index.js`

**添加导入:**
```javascript
import Gallery from './components/Gallery'
```

**在 LayoutSlug 组件中添加相册页面检测:**
```javascript
// 检测是否为相册页面（slug 为 gallery）
const isGalleryPage = post?.slug === 'gallery'

// 如果是相册页面，使用相册布局
if (isGalleryPage) {
  return <LayoutGallery {...props} />
}
```

**添加 LayoutGallery 组件:**
```javascript
/**
 * 相册/图库页面布局
 * 用于展示图片瀑布流，支持灯箱查看
 */
const LayoutGallery = props => {
  const { post } = props
  const { locale } = useGlobal()

  const extractImages = () => {
    const images = []
    const blockMap = post?.blockMap?.block || {}

    Object.values(blockMap).forEach(block => {
      const value = block?.value
      if (value?.type === 'image') {
        const src = value.properties?.source?.[0]?.[0] || value.format?.display_source
        const caption = value.properties?.caption?.[0]?.[0]
        if (src) {
          images.push({
            src,
            alt: caption || '相册图片',
            title: caption,
            description: caption
          })
        }
      }
    })

    return images
  }

  const images = extractImages()

  return (
    <div className='min-h-screen anime-slide-up'>
      <div className='anime-glass rounded-3xl p-8 mb-8 text-center relative overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-0 left-0 w-32 h-32 bg-pink-400 rounded-full blur-3xl'></div>
          <div className='absolute bottom-0 right-0 w-40 h-40 bg-purple-400 rounded-full blur-3xl'></div>
        </div>

        <div className='relative z-10'>
          <div className='inline-flex items-center justify-center w-20 h-20 rounded-2xl anime-gradient-bg mb-6 shadow-lg shadow-pink-500/30'>
            <svg className='w-10 h-10 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
            </svg>
          </div>
          <h1 className='text-3xl font-bold anime-gradient-text mb-3'>
            {post?.title || '相册'}
          </h1>
          {post?.summary && (
            <p className='text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
              {post.summary}
            </p>
          )}
          <div className='mt-4 text-sm text-gray-500 dark:text-gray-400'>
            共 {images.length} 张图片
          </div>
        </div>
      </div>

      <div className='anime-glass rounded-3xl p-6 md:p-8'>
        <Gallery images={images} columns={3} />
      </div>
    </div>
  )
}
```

**在 export 中添加 LayoutGallery:**
```javascript
export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutGallery,  // 添加这一行
  LayoutIndex,
  LayoutMusic,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
```

### 步骤 3: 修改 `themes/anime/components/Header.js`

移除 `AnimeGalleryModal` 相关代码：
- 移除 `import AnimeGalleryModal from './AnimeGalleryModal'`
- 移除 `const [showGallery, setShowGallery] = useState(false)`
- 移除相册按钮的 onClick 事件
- 移除 `<AnimeGalleryModal ... />` 组件

### 步骤 4: 删除新组件（可选）
删除 `themes/anime/components/AnimeGalleryModal.js`

### 步骤 5: 清理配置（可选）
从 `themes/anime/config.js` 中移除 `GALLERY` 配置块

---

## 注意事项

1. **数据迁移**: 旧相册从 Notion 页面中提取图片，新相册使用配置文件中的 `IMAGES` 数组。如需迁移数据，需手动将图片 URL 添加到配置中。

2. **依赖**: 新相册组件使用 `framer-motion` 进行动画，确保已安装：`npm install framer-motion`

3. **medium-zoom**: 回滚后如需灯箱功能，确保已安装：`npm install @fisch0920/medium-zoom`

---

## 相关提交

- 新增 AnimeGalleryModal 组件
- 更新 Header.js 添加相册按钮
- 更新 config.js 添加相册配置
- 移除旧的 Gallery.js 和 LayoutGallery
