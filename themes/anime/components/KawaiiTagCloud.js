import { useEffect, useState } from 'react'
import SmartLink from '@/components/SmartLink'
import { getThemeConfig } from '../config'

/**
 * 精致二次元标签云
 * 简洁设计：柔和色彩、统一圆角、微浮动效
 */
const KawaiiTagCloud = ({ tags }) => {
  const [isVisible, setIsVisible] = useState(false)
  const enabled = getThemeConfig('TAG_CLOUD.ENABLE', true)
  const maxTags = getThemeConfig('TAG_CLOUD.MAX_TAGS', 20)

  useEffect(() => {
    if (!enabled || !tags?.length) return
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [enabled, tags])

  if (!enabled || !tags?.length) return null

  // 按文章数排序并截取
  const displayTags = [...tags]
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, maxTags)

  // 根据热度获取样式
  const getTagClass = (count, index) => {
    const colors = [
      'bg-pink-100/80 text-pink-700 border-pink-200 hover:bg-pink-200 hover:shadow-pink-200/50',
      'bg-purple-100/80 text-purple-700 border-purple-200 hover:bg-purple-200 hover:shadow-purple-200/50',
      'bg-sky-100/80 text-sky-700 border-sky-200 hover:bg-sky-200 hover:shadow-sky-200/50',
      'bg-emerald-100/80 text-emerald-700 border-emerald-200 hover:bg-emerald-200 hover:shadow-emerald-200/50',
      'bg-amber-100/80 text-amber-700 border-amber-200 hover:bg-amber-200 hover:shadow-amber-200/50',
      'bg-rose-100/80 text-rose-700 border-rose-200 hover:bg-rose-200 hover:shadow-rose-200/50'
    ]
    
    const baseSize = count >= 15 ? 'text-sm px-4 py-2' : 
                     count >= 8 ? 'text-xs px-3 py-1.5' : 
                     'text-[11px] px-2.5 py-1'
    
    return `${baseSize} ${colors[index % colors.length]}`
  }

  return (
    <div className="anime-glass rounded-3xl p-5">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="font-bold text-gray-800 dark:text-white">标签云</h3>
      </div>

      {/* 标签列表 */}
      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag, index) => (
          <SmartLink
            key={tag.name}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            className={`
              ${getTagClass(tag.count || 0, index)}
              rounded-full font-medium border
              transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-md
              active:scale-95
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
            `}
            style={{ transitionDelay: `${index * 25}ms` }}
          >
            {tag.name}
            <span className="ml-1 opacity-60">{tag.count || 0}</span>
          </SmartLink>
        ))}
      </div>

      {/* 更多提示 */}
      {tags.length > maxTags && (
        <p className="mt-4 text-xs text-gray-400 text-center">
          还有 {tags.length - maxTags} 个标签
        </p>
      )}
    </div>
  )
}

export default KawaiiTagCloud
