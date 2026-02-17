import { useEffect, useRef, useState } from 'react'

/**
 * 歌词显示组件 - 悬浮纯文字样式
 * @param {Object} props
 * @param {string} props.lrcUrl - LRC文件URL
 * @param {Array} props.lyrics - 歌词数组（备用）
 * @param {number} props.currentTime - 当前播放时间（秒）
 * @param {boolean} props.isPlaying - 是否正在播放
 * @param {boolean} props.showBackground - 是否显示背景
 */
const LyricsDisplay = ({ lrcUrl, lyrics: embeddedLyrics, currentTime = 0, isPlaying = false, showBackground = true }) => {
  const lyricsRef = useRef(null)
  const activeLineRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [parsedLyrics, setParsedLyrics] = useState([])
  const [loading, setLoading] = useState(false)

  // 解析 LRC 格式歌词
  const parseLyrics = (lrcContent) => {
    if (!lrcContent || typeof lrcContent !== 'string') return []
    
    const lines = lrcContent.split('\n')
    const parsed = []
    
    lines.forEach(line => {
      const matches = line.match(/\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\](.*)/)
      if (matches) {
        const minutes = parseInt(matches[1])
        const seconds = parseInt(matches[2])
        const milliseconds = matches[3] ? parseInt(matches[3].padEnd(3, '0')) : 0
        const time = minutes * 60 + seconds + milliseconds / 1000
        const text = matches[4].trim()
        if (text) {
          parsed.push({ time, text })
        }
      }
    })
    
    return parsed.sort((a, b) => a.time - b.time)
  }

  // 从URL获取LRC文件
  useEffect(() => {
    const fetchLyrics = async () => {
      if (embeddedLyrics && embeddedLyrics.length > 0) {
        setParsedLyrics(embeddedLyrics)
        return
      }

      if (!lrcUrl) {
        setParsedLyrics([])
        return
      }

      setLoading(true)

      try {
        const response = await fetch(lrcUrl)
        if (!response.ok) {
          throw new Error('无法获取歌词文件')
        }
        const lrcContent = await response.text()
        const lyrics = parseLyrics(lrcContent)
        setParsedLyrics(lyrics)
      } catch {
        setParsedLyrics([])
      } finally {
        setLoading(false)
      }
    }

    fetchLyrics()
  }, [lrcUrl, embeddedLyrics])

  // 更新当前活跃的歌词行
  useEffect(() => {
    if (parsedLyrics.length === 0) return

    let newIndex = -1
    for (let i = 0; i < parsedLyrics.length; i++) {
      if (currentTime >= parsedLyrics[i].time) {
        newIndex = i
      } else {
        break
      }
    }
    setActiveIndex(newIndex)
  }, [currentTime, parsedLyrics])

  // 滚动到当前歌词
  useEffect(() => {
    if (activeLineRef.current && lyricsRef.current) {
      const container = lyricsRef.current
      const activeLine = activeLineRef.current
      
      const containerHeight = container.clientHeight
      const lineHeight = activeLine.clientHeight
      const lineTop = activeLine.offsetTop
      
      const scrollTop = lineTop - containerHeight / 2 + lineHeight / 2
      
      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      })
    }
  }, [activeIndex])

  // 无歌词或加载中不显示
  if (loading || parsedLyrics.length === 0) {
    return null
  }

  return (
    <div
      ref={lyricsRef}
      className={`h-full overflow-hidden ${showBackground ? 'bg-gradient-to-b from-transparent via-white/30 to-transparent dark:via-black/30 rounded-2xl backdrop-blur-sm' : ''}`}
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className='py-[50%] px-2'>
        {parsedLyrics.map((line, index) => (
          <div
            key={index}
            ref={index === activeIndex ? activeLineRef : null}
            className={`py-3 text-center transition-all duration-500 whitespace-nowrap overflow-hidden text-ellipsis ${
              index === activeIndex
                ? 'text-lg font-bold text-pink-500 dark:text-pink-400 opacity-100 scale-105'
                : index === activeIndex - 1 || index === activeIndex + 1
                ? 'text-sm text-gray-500 dark:text-gray-400 opacity-60'
                : 'text-xs text-gray-400 dark:text-gray-600 opacity-40'
            }`}
          >
            {line.text}
          </div>
        ))}
      </div>
    </div>
  )
}

export default LyricsDisplay
