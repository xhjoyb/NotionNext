import { isBrowser } from '@/lib/utils'
import { useEffect, useRef } from 'react'
import { getThemeConfig } from '../config'

/**
 * 明月浩空音乐播放器组件
 * 对接 myhkw.cn 音乐播放器
 * 需要在主题配置中开启 MYHK_PLAYER.ENABLE
 */
const MyhkPlayer = () => {
  const scriptLoaded = useRef(false)

  // 获取配置
  const enabled = getThemeConfig('MYHK_PLAYER.ENABLE', false)
  const playerId = getThemeConfig('MYHK_PLAYER.PLAYER_ID', '1690736841113')
  const loadJquery = getThemeConfig('MYHK_PLAYER.LOAD_JQUERY', true)
  const mode = getThemeConfig('MYHK_PLAYER.MODE', '1')

  useEffect(() => {
    // 如果未启用，不加载播放器
    if (!isBrowser || !enabled || scriptLoaded.current) return

    // 检查是否已存在播放器脚本
    const existingScript = document.getElementById('myhk')
    if (existingScript) return

    // 加载 jQuery（如果配置启用且页面中还没有）
    if (loadJquery && !window.jQuery) {
      const jqueryScript = document.createElement('script')
      jqueryScript.type = 'text/javascript'
      jqueryScript.src = 'https://myhkw.cn/player/js/jquery.min.js'
      jqueryScript.async = true
      document.head.appendChild(jqueryScript)

      // 等待 jQuery 加载完成后再加载播放器
      jqueryScript.onload = () => {
        loadMyhkPlayer()
      }

      // 加载失败时也尝试加载播放器
      jqueryScript.onerror = () => {
        console.warn('[MyhkPlayer] jQuery 加载失败，尝试直接加载播放器')
        loadMyhkPlayer()
      }
    } else {
      loadMyhkPlayer()
    }

    scriptLoaded.current = true

    return () => {
      // 清理：移除播放器脚本
      const myhkScript = document.getElementById('myhk')
      if (myhkScript) {
        myhkScript.remove()
      }
    }
  }, [enabled, loadJquery, playerId, mode])

  const loadMyhkPlayer = () => {
    // 创建播放器脚本
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.id = 'myhk'
    script.src = `https://myhkw.cn/api/player/${playerId}`
    script.setAttribute('key', playerId)
    script.setAttribute('m', mode)
    document.documentElement.appendChild(script)

    console.log('[MyhkPlayer] 明月浩空播放器已加载')
  }

  // 如果未启用，不渲染任何内容
  if (!enabled) return null

  // 这个组件不渲染任何可见内容，播放器由外部脚本自动创建
  return null
}

export default MyhkPlayer
