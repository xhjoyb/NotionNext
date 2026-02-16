import { useEffect, useState, useRef } from 'react'
import { getThemeConfig } from '../config'
import KawaiiMusicVisualizer from './KawaiiMusicVisualizer'

/**
 * 音乐播放器组件 - 完全独立的实现
 * 不依赖 NotionNext 的全局播放器
 * @param {Object} props
 * @param {Array} props.audioList - 音乐列表
 * @param {Function} props.onSongChange - 歌曲切换回调 (index) => void
 * @param {Function} props.onTimeUpdate - 时间更新回调 (time) => void
 * @param {Function} props.onPlayStateChange - 播放状态变化回调 (isPlaying) => void
 * @param {Function} props.onDurationChange - 时长变化回调 (duration) => void
 */
const MusicPlayer = ({ 
  audioList, 
  onSongChange,
  onTimeUpdate,
  onPlayStateChange,
  onDurationChange
}) => {
  const [currentSong, setCurrentSong] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showVolume, setShowVolume] = useState(false)
  const audioRef = useRef(null)
  const progressRef = useRef(null)

  // 获取音乐列表 - 优先使用传入的，否则使用主题配置
  const getAudioList = () => {
    if (audioList && audioList.length > 0) {
      return audioList
    }
    // 从主题配置获取
    return getThemeConfig('MUSIC.LIST', [])
  }

  const audio = getAudioList()

  // 初始化音频元素
  useEffect(() => {
    if (!audio || audio.length === 0) return

    const audioElement = new Audio()
    audioRef.current = audioElement

    // 设置初始音量
    audioElement.volume = volume

    // 监听事件
    audioElement.addEventListener('loadedmetadata', () => {
      setDuration(audioElement.duration)
      setIsLoading(false)
      // 通知父组件时长变化
      if (onDurationChange) {
        onDurationChange(audioElement.duration)
      }
    })

    // 使用 requestAnimationFrame 节流 timeupdate
    let lastUpdateTime = 0
    const updateInterval = 250 // 每 250ms 更新一次
    audioElement.addEventListener('timeupdate', () => {
      const now = Date.now()
      if (now - lastUpdateTime < updateInterval) return
      lastUpdateTime = now

      setCurrentTime(audioElement.currentTime)
      setProgress((audioElement.currentTime / audioElement.duration) * 100)
      // 通知父组件时间更新
      if (onTimeUpdate) {
        onTimeUpdate(audioElement.currentTime)
      }
    })

    audioElement.addEventListener('ended', () => {
      handleNext()
    })

    audioElement.addEventListener('error', (e) => {
      console.error('音频加载错误:', e)
      setError('音频加载失败')
      setIsLoading(false)
    })

    audioElement.addEventListener('loadstart', () => {
      setIsLoading(true)
    })

    audioElement.addEventListener('canplay', () => {
      setIsLoading(false)
    })

    // 加载第一首歌
    loadSong(0)

    return () => {
      audioElement.pause()
      audioElement.src = ''
    }
  }, [])

  // 加载指定歌曲
  const loadSong = (index) => {
    if (!audioRef.current || !audio[index]) return

    const song = audio[index]
    setIsLoading(true)
    setError(null)
    audioRef.current.src = song.url
    audioRef.current.load()
    setCurrentSong(index)
    // 通知父组件歌曲切换
    if (onSongChange) {
      onSongChange(index)
    }
  }

  // 播放/暂停切换
  const togglePlay = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
        // 通知父组件播放状态变化
        if (onPlayStateChange) {
          onPlayStateChange(false)
        }
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
        // 通知父组件播放状态变化
        if (onPlayStateChange) {
          onPlayStateChange(true)
        }
      }
    } catch (e) {
      console.error('播放失败:', e)
      setError('播放失败，请检查音频链接')
    }
  }

  // 播放指定歌曲
  const playSong = async (index) => {
    if (index === currentSong && isPlaying) {
      // 如果点击的是当前播放的歌曲，则暂停
      togglePlay()
      return
    }

    loadSong(index)
    try {
      await audioRef.current.play()
      setIsPlaying(true)
    } catch (e) {
      console.error('播放失败:', e)
      setError('播放失败，请检查音频链接')
    }
  }

  // 上一首
  const handlePrev = () => {
    const newIndex = currentSong === 0 ? audio.length - 1 : currentSong - 1
    playSong(newIndex)
  }

  // 下一首
  const handleNext = () => {
    const newIndex = currentSong === audio.length - 1 ? 0 : currentSong + 1
    playSong(newIndex)
  }

  // 进度条点击
  const handleProgressClick = (e) => {
    if (!progressRef.current || !audioRef.current || !audioRef.current.duration) return
    
    const rect = progressRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    const newTime = percentage * audioRef.current.duration
    
    audioRef.current.currentTime = newTime
    setProgress(percentage * 100)
  }

  // 音量调节
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value) / 100
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    if (newVolume > 0) {
      setIsMuted(false)
    }
  }

  // 静音切换
  const toggleMute = () => {
    if (!audioRef.current) return
    if (isMuted) {
      audioRef.current.volume = volume
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }

  // 格式化时间
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!audio || audio.length === 0) {
    return (
      <div className='anime-glass rounded-2xl p-8 text-center'>
        <div className='text-6xl mb-4'>🎵</div>
        <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-2'>
          暂无音乐
        </h3>
        <p className='text-gray-600 dark:text-gray-400'>
          请在主题配置中添加音乐列表
        </p>
      </div>
    )
  }

  const currentSongData = audio[currentSong]

  return (
    <div className='anime-glass rounded-2xl overflow-hidden'>
      {/* 萌化音乐可视化 - 与播放器无缝衔接 */}
      <div className='px-6 pt-6'>
        <KawaiiMusicVisualizer isPlaying={isPlaying} audioElement={audioRef.current} />
      </div>

      {/* 当前播放信息 - 紧凑布局 */}
      <div className='px-5 py-4 bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-pink-900/40 dark:to-purple-900/40 border-b border-pink-100 dark:border-purple-800/50'>
        <div className='flex items-center gap-4'>
          {/* 封面 - 缩小 */}
          <div className='relative flex-shrink-0'>
            {currentSongData?.cover ? (
              <img
                src={currentSongData.cover}
                alt={currentSongData.name}
                className={`w-16 h-16 rounded-xl object-cover shadow-lg ${isPlaying ? 'animate-spin-slow' : ''}`}
                style={{ animationDuration: '10s' }}
              />
            ) : (
              <div className='w-16 h-16 rounded-xl bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-800 dark:to-purple-800 flex items-center justify-center shadow-lg'>
                <svg className='w-8 h-8 text-pink-500 dark:text-pink-300' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' />
                </svg>
              </div>
            )}
            {isLoading && (
              <div className='absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl'>
                <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              </div>
            )}
          </div>

          {/* 歌曲信息和控制 - 垂直布局 */}
          <div className='flex-1 min-w-0'>
            {/* 歌曲信息 - 单行 */}
            <div className='mb-2'>
              <h3 className='text-base font-bold text-gray-800 dark:text-white truncate leading-tight'>
                {currentSongData?.name || '未知歌曲'}
              </h3>
              <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                {currentSongData?.artist || '未知艺术家'}
              </p>
            </div>

            {/* 进度条 - 更紧凑 */}
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-[10px] text-gray-400 w-8 text-right'>
                {formatTime(currentTime)}
              </span>
              <div
                ref={progressRef}
                onClick={handleProgressClick}
                className='flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative group'
              >
                <div className='absolute inset-0 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full transition-all duration-100'
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className='absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'
                  style={{ left: `calc(${progress}% - 4px)` }}
                ></div>
              </div>
              <span className='text-[10px] text-gray-400 w-8'>
                {formatTime(duration)}
              </span>
            </div>

            {/* 控制按钮 - 水平排列 */}
            <div className='flex items-center justify-between'>
              {/* 播放控制 */}
              <div className='flex items-center gap-2'>
                {/* 上一首 */}
                <button
                  onClick={handlePrev}
                  className='w-7 h-7 rounded-full bg-pink-100 dark:bg-purple-800/60 flex items-center justify-center text-pink-500 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-purple-700 transition-all hover:scale-105 active:scale-95'
                >
                  <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M6 6h2v12H6zm3.5 6l8.5 6V6z' />
                  </svg>
                </button>

                {/* 播放/暂停 */}
                <button
                  onClick={togglePlay}
                  disabled={isLoading}
                  className='w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-105 active:scale-95 transition-all disabled:opacity-50'
                >
                  {isLoading ? (
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  ) : isPlaying ? (
                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z' />
                    </svg>
                  ) : (
                    <svg className='w-4 h-4 ml-0.5' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M8 5v14l11-7z' />
                    </svg>
                  )}
                </button>

                {/* 下一首 */}
                <button
                  onClick={handleNext}
                  className='w-7 h-7 rounded-full bg-pink-100 dark:bg-purple-800/60 flex items-center justify-center text-pink-500 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-purple-700 transition-all hover:scale-105 active:scale-95'
                >
                  <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z' />
                  </svg>
                </button>
              </div>

              {/* 音量控制 */}
              <div className='flex items-center gap-1.5'>
                <button
                  onClick={toggleMute}
                  className='w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
                >
                  {isMuted || volume === 0 ? (
                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z' />
                    </svg>
                  ) : volume < 0.5 ? (
                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z' />
                    </svg>
                  ) : (
                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z' />
                    </svg>
                  )}
                </button>

                {/* 音量滑块 */}
                <div
                  className='w-14 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden cursor-pointer'
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const clickX = e.clientX - rect.left
                    const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100))
                    handleVolumeChange({ target: { value: percentage } })
                  }}
                >
                  <div
                    className='h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full transition-all'
                    style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {error && (
              <p className='text-red-500 text-sm mt-3 text-center md:text-left'>{error}</p>
            )}
          </div>
        </div>
      </div>

      {/* 歌曲列表 */}
      <div className='max-h-[300px] overflow-y-auto'>
        {audio.map((song, index) => (
          <div
            key={index}
            onClick={() => playSong(index)}
            className={`flex items-center gap-4 px-6 py-3 cursor-pointer transition-all hover:bg-pink-50 dark:hover:bg-purple-900/30 ${
              currentSong === index ? 'bg-pink-50 dark:bg-purple-900/30' : ''
            } ${index !== audio.length - 1 ? 'border-b border-pink-100 dark:border-purple-800/30' : ''}`}
          >
            {/* 序号/播放状态 */}
            <div className='w-8 text-center flex-shrink-0'>
              {currentSong === index && isPlaying ? (
                <div className='flex justify-center items-end gap-0.5 h-5'>
                  <div className='w-1 bg-pink-500 rounded-full animate-music-bar' style={{ animationDelay: '0s', height: '60%' }}></div>
                  <div className='w-1 bg-pink-500 rounded-full animate-music-bar' style={{ animationDelay: '0.1s', height: '100%' }}></div>
                  <div className='w-1 bg-pink-500 rounded-full animate-music-bar' style={{ animationDelay: '0.2s', height: '40%' }}></div>
                  <div className='w-1 bg-pink-500 rounded-full animate-music-bar' style={{ animationDelay: '0.3s', height: '80%' }}></div>
                </div>
              ) : (
                <span className={`text-sm font-medium ${currentSong === index ? 'text-pink-500' : 'text-gray-400'}`}>
                  {index + 1}
                </span>
              )}
            </div>

            {/* 封面 */}
            {song.cover ? (
              <img
                src={song.cover}
                alt={song.name}
                className='w-11 h-11 rounded-lg object-cover flex-shrink-0'
              />
            ) : (
              <div className='w-11 h-11 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 dark:from-purple-800 dark:to-pink-800 flex items-center justify-center flex-shrink-0'>
                <svg className='w-5 h-5 text-pink-500 dark:text-pink-300' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' />
                </svg>
              </div>
            )}

            {/* 歌曲信息 */}
            <div className='flex-1 min-w-0'>
              <h5 className={`font-medium truncate ${currentSong === index ? 'text-pink-500 dark:text-pink-400' : 'text-gray-800 dark:text-white'}`}>
                {song.name}
              </h5>
              <p className='text-sm text-gray-500 dark:text-gray-400 truncate'>
                {song.artist}
              </p>
            </div>

            {/* 播放状态指示器 */}
            {currentSong === index && (
              <div className='flex items-center gap-2 flex-shrink-0'>
                {isPlaying ? (
                  <span className='text-xs text-pink-500 font-medium'>播放中</span>
                ) : (
                  <span className='text-xs text-gray-400 font-medium'>已暂停</span>
                )}
                <div className='w-2 h-2 rounded-full bg-pink-500 animate-pulse'></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-music-bar {
          animation: music-bar 0.8s ease-in-out infinite;
        }
        @keyframes music-bar {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
        /* 自定义滚动条 */
        div::-webkit-scrollbar {
          width: 5px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(236, 72, 153, 0.2);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(236, 72, 153, 0.4);
        }
      `}</style>
    </div>
  )
}

export default MusicPlayer
