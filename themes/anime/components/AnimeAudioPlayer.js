/**
 * 二次元风格自定义音频播放器
 * 设计系统：Vibrant & Block-based + Glassmorphism
 * 特点：
 * - 玻璃拟态卡片设计
 * - 精致的播放控制
 * - 动态音频可视化
 * - 粉色/紫色/蓝色渐变主题
 */
import { useState, useRef, useEffect } from 'react'

const AnimeAudioPlayer = ({ audioUrl, audioInfo, onCopy, copySuccess }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)
  const progressRef = useRef(null)

  // 格式化时间
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // 播放/暂停
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // 更新进度
  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration || 0)
    }
  }

  // 跳转到指定位置
  const handleProgressClick = (e) => {
    if (progressRef.current && audioRef.current && duration) {
      const rect = progressRef.current.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      const newTime = Math.max(0, Math.min(percent * duration, duration))
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  // 音频事件监听
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.addEventListener('timeupdate', updateProgress)
      audio.addEventListener('loadedmetadata', updateProgress)
      audio.addEventListener('ended', () => setIsPlaying(false))
      
      return () => {
        audio.removeEventListener('timeupdate', updateProgress)
        audio.removeEventListener('loadedmetadata', updateProgress)
        audio.removeEventListener('ended', () => setIsPlaying(false))
      }
    }
  }, [])

  // 音频可视化条高度（根据播放状态动态变化）
  const getBarHeight = (index) => {
    if (!isPlaying) return 20
    // 生成动态高度，基于时间和索引
    const time = Date.now() / 1000
    const baseHeight = 30 + Math.sin(time * 3 + index * 0.8) * 25
    return Math.max(15, Math.min(85, baseHeight))
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* 玻璃拟态背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-white/5 dark:bg-black/20" />
      
      {/* 边框光效 */}
      <div className="absolute inset-0 rounded-2xl border border-pink-300/30 dark:border-pink-500/30" />
      
      {/* 内容区域 */}
      <div className="relative p-5 space-y-4">
        {/* 隐藏的原生音频元素 */}
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          className="hidden"
        />
        
        {/* 头部：唱片 + 信息 */}
        <div className="flex items-center gap-4">
          {/* 旋转唱片 */}
          <div 
            className={`relative w-14 h-14 flex-shrink-0 transition-all duration-700 ${
              isPlaying ? 'animate-spin-slow' : ''
            }`}
          >
            {/* 外圈渐变 */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 p-[2px]">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                {/* 音乐图标 */}
                <svg className="w-6 h-6 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
            </div>
            {/* 中心点 */}
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-gray-800 rounded-full -translate-x-1/2 -translate-y-1/2 border border-pink-400/50" />
          </div>
          
          {/* 歌曲信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-pink-400 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm font-bold text-gray-800 dark:text-white truncate">
                背景音乐
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {audioInfo?.reason || '提取的音频文件'}
            </p>
            <p className="text-xs text-pink-500 font-medium mt-0.5">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>
        </div>
        
        {/* 音频可视化 */}
        <div className="flex items-end justify-center gap-[3px] h-12 px-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-150 ${
                isPlaying 
                  ? 'bg-gradient-to-t from-pink-500 to-purple-400' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              style={{
                height: `${getBarHeight(i)}%`,
                transitionDelay: `${i * 20}ms`
              }}
            />
          ))}
        </div>
        
        {/* 进度条 */}
        <div className="space-y-1">
          <div 
            ref={progressRef}
            onClick={handleProgressClick}
            className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer overflow-hidden group"
          >
            <div 
              className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full relative transition-all duration-75"
              style={{ width: `${progressPercent}%` }}
            >
              {/* 进度条头部光点 */}
              <div className="absolute right-0 top-1/2 w-2 h-2 bg-white rounded-full shadow-lg -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
        
        {/* 控制区域 */}
        <div className="flex items-center justify-between">
          {/* 左侧占位，保持对称 */}
          <div className="w-10" />
          
          {/* 播放按钮 */}
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 text-white shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer"
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
          
          {/* 复制按钮 */}
          <button
            onClick={onCopy}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all duration-200 cursor-pointer"
            title="复制音频链接"
          >
            {copySuccess ? (
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* CSS 动画 */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default AnimeAudioPlayer
