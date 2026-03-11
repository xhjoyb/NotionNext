import { useState, useRef, useCallback } from 'react'
import { getThemeConfig } from '../config'
import KawaiiLoader from './KawaiiLoader'
import AnimeLazyImage from './AnimeLazyImage'
import AnimeAudioPlayer from './AnimeAudioPlayer'

/**
 * 抖音视频/图文解析组件 (DouyinParser)
 * 设计特点：
 * - 二次元萌化风格：粉色渐变、圆角、浮动动画
 * - 玻璃拟态卡片设计
 * - 支持视频和图文两种内容类型
 * - 可爱的加载动画和交互反馈
 */
const DouyinParser = () => {
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [copySuccess, setCopySuccess] = useState('')
  const videoRef = useRef(null)

  // API 基础配置
  const API_BASE_URL = getThemeConfig('DOUYIN.API_URL', 'https://dy-api.joyb.cc')

  // 解析抖音链接
  const handleParse = useCallback(async () => {
    if (!inputText.trim()) {
      setError('请输入抖音分享链接或文案~')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`${API_BASE_URL}/v1/douyin/inspect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          resource_type: 'all',
          only_best: true  // 仅返回最优资源，简化前端处理
        })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || '解析失败，请检查链接是否正确~')
      }

      setResult(data)
    } catch (err) {
      setError(err.message || '网络错误，请稍后重试~')
    } finally {
      setLoading(false)
    }
  }, [inputText, API_BASE_URL])

  // 复制到剪贴板
  const handleCopy = useCallback(async (url, type) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopySuccess(type)
      setTimeout(() => setCopySuccess(''), 2000)
    } catch (err) {
      // 降级方案
      const textarea = document.createElement('textarea')
      textarea.value = url
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopySuccess(type)
      setTimeout(() => setCopySuccess(''), 2000)
    }
  }, [])

  // 下载文件
  const handleDownload = useCallback((url, filename) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  // 判断内容类型
  const isVideo = result?.content_kind === 'video'
  const isNote = result?.content_kind === 'note'

  // 从 selected 数组获取最优资源
  const getSelectedResource = (resourceType) => {
    return result?.selected?.find(item => item.resource_type === resourceType)
  }

  // 获取最优视频 URL
  // 注意：使用 play_api，因为它是有效的播放链接
  const bestVideo = getSelectedResource('video')
  const selectedVideoUrl = bestVideo?.url
  
  // 优先使用 play_api，然后是 selected，最后是 selected_video_url
  let bestVideoUrl = null
  if (result?.resources?.play_api?.length > 0) {
    // 优先使用 play_api 的第一个 URL（有效的播放链接）
    bestVideoUrl = result.resources.play_api[0]
  } else if (selectedVideoUrl && selectedVideoUrl.startsWith('http')) {
    bestVideoUrl = selectedVideoUrl
  } else if (result?.selected_video_url && result?.selected_video_url.startsWith('http')) {
    bestVideoUrl = result?.selected_video_url
  }

  // 获取最优音频 URL
  const bestAudio = getSelectedResource('audio')
  const bestAudioUrl = bestAudio?.url || result?.resources?.audio?.[0]

  // 获取最优封面 URL
  // 注意：API 返回的 selected.cover 可能只是一个对象 ID，不是完整 URL
  const bestCover = getSelectedResource('cover')
  const selectedCoverUrl = bestCover?.url
  // 检查 URL 是否有效（必须以 http 开头）
  const isValidCoverUrl = selectedCoverUrl && selectedCoverUrl.startsWith('http')
  
  // 尝试从多个来源获取有效的封面 URL
  let bestCoverUrl = null
  if (isValidCoverUrl) {
    bestCoverUrl = selectedCoverUrl
  } else if (result?.resources?.image?.length > 0 && result?.resources?.image?.[0].startsWith('http')) {
    // 优先使用 resources.image（图文作品的图片）
    bestCoverUrl = result.resources.image[0]
  } else if (result?.resources?.cover?.length > 0 && result?.resources?.cover?.[0].startsWith('http')) {
    // 使用 resources.cover（视频封面）
    bestCoverUrl = result.resources.cover[0]
  } else if (result?.meta?.video_candidates?.length > 0) {
    // 使用 video_candidates 中的第一个有效 URL
    bestCoverUrl = result.meta.video_candidates[0]
  } else if (result?.meta?.image_candidates?.length > 0) {
    // 或者使用 image_candidates
    bestCoverUrl = result.meta.image_candidates[0]
  } else if (result?.meta?.cover_url && result?.meta?.cover_url.startsWith('http')) {
    bestCoverUrl = result?.meta?.cover_url
  }

  // 获取最优头像 URL
  const bestAvatar = getSelectedResource('avatar')
  const bestAvatarUrl = bestAvatar?.url || result?.resources?.avatar?.[0]

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* 标题区域 */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/40 dark:to-purple-900/40 border-2 border-pink-200 dark:border-pink-700 anime-bounce-in">
          <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">抖音视频/图文解析</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold anime-gradient-text">
          萌化解析工具
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          粘贴抖音分享链接，一键获取无水印视频和图文~ ✨
        </p>
      </div>

      {/* 输入区域 - 重新设计 */}
      <div className="relative">
        {/* 主输入卡片 */}
        <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-pink-500/5 border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* 顶部装饰条 */}
          <div className="h-1.5 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400" />
          
          <div className="p-6 md:p-8 space-y-6">
            {/* 输入框容器 */}
            <div className="relative group">
              {/* 标签 */}
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                粘贴抖音链接
              </label>
              
              {/* 输入框 */}
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="请粘贴抖音分享文案或链接...&#10;例如：0.05 复制打开抖音，看看【xxx的作品】..."
                  className="w-full h-36 p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-600 focus:border-pink-400 dark:focus:border-pink-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none resize-none transition-all duration-300 text-gray-700 dark:text-gray-200 placeholder-gray-400 text-base leading-relaxed"
                  disabled={loading}
                />
                
                {/* 字符计数 */}
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {inputText.length > 0 && (
                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {inputText.length} 字符
                    </span>
                  )}
                </div>
                
                {/* 聚焦时的光晕效果 */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/0 via-pink-500/0 to-purple-500/0 group-focus-within:from-pink-500/5 group-focus-within:via-purple-500/5 group-focus-within:to-blue-500/5 transition-all duration-500 pointer-events-none" />
              </div>
            </div>

            {/* 操作按钮区域 */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* 主按钮 */}
              <button
                onClick={handleParse}
                disabled={loading || !inputText.trim()}
                className="flex-1 relative overflow-hidden group"
              >
                <div className={`
                  relative px-8 py-4 rounded-2xl font-bold text-white text-lg
                  bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500
                  transform transition-all duration-300
                  ${loading || !inputText.trim() 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-lg hover:shadow-pink-500/25 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
                  }
                `}>
                  <div className="relative flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>解析中...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>开始解析</span>
                      </>
                    )}
                  </div>
                  
                  {/* 按钮光泽效果 */}
                  {!loading && inputText.trim() && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  )}
                </div>
              </button>

              {/* 清空按钮 */}
              {inputText && (
                <button
                  onClick={() => {
                    setInputText('')
                    setResult(null)
                    setError(null)
                  }}
                  disabled={loading}
                  className="px-6 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-semibold hover:border-pink-300 dark:hover:border-pink-600 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all duration-300 cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>清空</span>
                </button>
              )}
            </div>

            {/* 使用提示 */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">使用提示</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  支持抖音APP分享链接、网页链接。复制分享文案中的链接部分粘贴到上方即可~
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 底部装饰 */}
        <div className="flex justify-center mt-4 gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-purple-300 animate-pulse" style={{animationDelay: '0.2s'}} />
          <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" style={{animationDelay: '0.4s'}} />
        </div>
      </div>

      {/* 加载动画 */}
      {loading && (
        <div className="anime-glass rounded-3xl p-12 text-center">
          <KawaiiLoader type="star" size="lg" show={true} />
          <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">
            正在施展魔法解析中...
          </p>
        </div>
      )}

      {/* 错误提示 */}
      {error && !loading && (
        <div className="anime-glass rounded-3xl p-6 border-2 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-red-600 dark:text-red-400">解析失败</h3>
              <p className="text-red-500 dark:text-red-300 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 解析结果 */}
      {result && !loading && (
        <div className="space-y-6 anime-slide-up">
          {/* 内容类型标签 */}
          <div className="flex justify-center">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${
              isVideo 
                ? 'bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300' 
                : 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300'
            }`}>
              {isVideo ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span>视频作品</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>图文作品</span>
                </>
              )}
            </span>
          </div>

          {/* 作者信息卡片 */}
          {result.meta?.author_name && (
            <div className="anime-glass rounded-2xl p-4 flex items-center gap-4">
              {bestAvatarUrl && (
                <img
                  src={bestAvatarUrl}
                  alt={result.meta.author_name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-pink-300 dark:border-pink-600"
                />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 dark:text-white">{result.meta.author_name}</h3>
                {result.meta.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                    {result.meta.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 视频播放器 - 仅视频类型显示 */}
          {isVideo && bestVideoUrl && (
            <div className="anime-glass rounded-3xl p-4 space-y-4">
              {/* 视频预览卡片 */}
              <a
                href={bestVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative rounded-2xl overflow-hidden bg-black shadow-2xl shadow-pink-500/20 group cursor-pointer"
              >
                {/* 视频封面图 */}
                {bestCoverUrl ? (
                  <img
                    src={bestCoverUrl}
                    alt="视频封面"
                    className="w-full h-auto max-h-[500px] object-contain bg-black"
                    onError={(e) => {
                      console.error('封面加载失败:', bestCoverUrl)
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : (
                  <div className="w-full h-[300px] bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                    <svg className="w-20 h-20 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                )}
                {/* 封面加载失败时的备用显示 */}
                <div className="hidden w-full h-[300px] bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                  <svg className="w-20 h-20 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                
                {/* 播放按钮遮罩 */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-pink-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                
                {/* 提示文字 */}
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <span className="inline-block px-4 py-2 rounded-full bg-black/60 text-white text-sm backdrop-blur-sm">
                    点击在新标签页播放视频
                  </span>
                </div>
              </a>

              {/* 视频信息和操作 */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* 视频质量信息 */}
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  {(result.selected_video_quality || bestVideo?.quality) && (
                    <span className="px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300">
                      {(result.selected_video_quality?.width || bestVideo?.quality?.width)} x {(result.selected_video_quality?.height || bestVideo?.quality?.height)}
                    </span>
                  )}
                  {(result.selected_video_reason || bestVideo?.reason) && (
                    <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300">
                      来源: {result.selected_video_reason || bestVideo?.reason}
                    </span>
                  )}
                </div>
                
                {/* 复制视频链接按钮 */}
                <button
                  onClick={() => handleCopy(bestVideoUrl, 'video')}
                  className="px-4 py-2 rounded-full border-2 border-pink-300 dark:border-pink-600 text-pink-600 dark:text-pink-300 text-sm font-medium hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-all cursor-pointer flex items-center gap-2"
                >
                  {copySuccess === 'video' ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>已复制</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>复制链接</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* 二次元风格自定义音频播放器 */}
          {bestAudioUrl && (
            <AnimeAudioPlayer 
              audioUrl={bestAudioUrl} 
              audioInfo={bestAudio}
              onCopy={() => handleCopy(bestAudioUrl, 'audio')}
              copySuccess={copySuccess === 'audio'}
            />
          )}

          {/* 图文作品图片列表 */}
          {isNote && result.selected_image_urls && result.selected_image_urls.length > 0 && (
            <div className="anime-glass rounded-3xl p-4 space-y-4">
              <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                图文内容 ({result.selected_image_urls.length}张)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {result.selected_image_urls.map((url, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden aspect-square">
                    <AnimeLazyImage
                      src={url}
                      alt={`图片 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownload(url, `douyin_image_${result.aweme_id}_${index + 1}.jpg`)}
                          className="p-2 rounded-full bg-white/90 text-gray-800 hover:bg-white transition-colors cursor-pointer"
                          title="下载"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleCopy(url, `image-${index}`)}
                          className="p-2 rounded-full bg-white/90 text-gray-800 hover:bg-white transition-colors cursor-pointer"
                          title="复制链接"
                        >
                          {copySuccess === `image-${index}` ? (
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
                    <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-black/50 text-white text-xs">
                      {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 封面下载 */}
          {bestCoverUrl && (
            <div className="anime-glass rounded-2xl p-4 space-y-3">
              {/* 封面图片预览 */}
              <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={bestCoverUrl}
                  alt="视频封面"
                  className="w-full h-auto max-h-[300px] object-contain"
                  onError={(e) => {
                    console.error('封面加载失败:', bestCoverUrl)
                    e.target.style.display = 'none'
                  }}
                />
              </div>
              
              {/* 封面信息和操作 */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white">视频封面</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {bestCover?.reason ? `来源: ${bestCover.reason}` : '高清封面图'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(bestCoverUrl, `douyin_cover_${result.aweme_id}.jpg`)}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white text-sm font-medium hover:shadow-lg transition-all cursor-pointer"
                  >
                    下载
                  </button>
                  <button
                    onClick={() => handleCopy(bestCoverUrl, 'cover')}
                    className="px-4 py-2 rounded-full border-2 border-teal-300 dark:border-teal-600 text-teal-600 dark:text-teal-300 text-sm font-medium hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-all cursor-pointer"
                  >
                    {copySuccess === 'cover' ? '已复制' : '复制'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 原始数据折叠面板 */}
          <details className="anime-glass rounded-2xl overflow-hidden">
            <summary className="p-4 cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              查看原始数据
            </summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-96 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      )}
    </div>
  )
}

export default DouyinParser
