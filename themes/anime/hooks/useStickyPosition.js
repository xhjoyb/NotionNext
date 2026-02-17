import { useState, useEffect, useCallback, useRef } from 'react'
import { getThemeConfig } from '../config'

/**
 * 自定义 Hook：管理 Sticky 元素的定位
 * 
 * 功能：
 * - 监听导航栏显示/隐藏状态
 * - 动态计算 sticky 元素的 top 值
 * - 使用 requestAnimationFrame 优化滚动性能
 * - 支持自定义偏移量
 * 
 * @param {Object} options - 配置选项
 * @param {number} options.visibleOffset - 导航栏可见时的偏移量（默认 96px）
 * @param {number} options.hiddenOffset - 导航栏隐藏时的偏移量（默认 16px）
 * @param {boolean} options.enabled - 是否启用（默认 true）
 * @returns {Object} { stickyTop, isHeaderVisible }
 */
export const useStickyPosition = (options = {}) => {
  const {
    visibleOffset = 96,    // top-24
    hiddenOffset = 16,     // top-4
    enabled = true
  } = options

  const [stickyTop, setStickyTop] = useState(visibleOffset)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  
  // 使用 ref 存储状态，避免在滚动回调中触发重渲染
  const lastScrollY = useRef(0)
  const rafId = useRef(null)
  const isProcessing = useRef(false)
  
  // 获取导航栏自动隐藏配置
  const autoHideOnScroll = getThemeConfig('NAV.AUTO_HIDE_ON_SCROLL', true)

  const updateStickyPosition = useCallback(() => {
    if (!enabled || !autoHideOnScroll) {
      setStickyTop(visibleOffset)
      setIsHeaderVisible(true)
      return
    }

    const currentScrollY = window.scrollY
    
    // 在顶部时始终显示导航栏
    if (currentScrollY < 100) {
      setIsHeaderVisible(true)
      setStickyTop(visibleOffset)
    } else {
      // 向下滚动隐藏，向上滚动显示
      const shouldShow = currentScrollY < lastScrollY.current
      setIsHeaderVisible(shouldShow)
      setStickyTop(shouldShow ? visibleOffset : hiddenOffset)
    }
    
    lastScrollY.current = currentScrollY
    isProcessing.current = false
  }, [enabled, autoHideOnScroll, visibleOffset, hiddenOffset])

  useEffect(() => {
    if (!enabled) return

    const handleScroll = () => {
      // 使用 requestAnimationFrame 节流
      if (!isProcessing.current) {
        isProcessing.current = true
        rafId.current = requestAnimationFrame(updateStickyPosition)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // 初始计算
    updateStickyPosition()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [enabled, updateStickyPosition])

  return { stickyTop, isHeaderVisible }
}

/**
 * 自定义 Hook：优化的滚动监听
 * 
 * 功能：
 * - 使用 requestAnimationFrame 节流
 * - 自动清理
 * 
 * @param {Function} callback - 滚动回调函数
 * @param {boolean} enabled - 是否启用
 */
export const useScrollListener = (callback, enabled = true) => {
  const rafId = useRef(null)
  const isProcessing = useRef(false)
  const callbackRef = useRef(callback)

  // 保持回调引用最新
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!enabled) return

    const handleScroll = () => {
      if (!isProcessing.current) {
        isProcessing.current = true
        rafId.current = requestAnimationFrame(() => {
          callbackRef.current(window.scrollY)
          isProcessing.current = false
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [enabled])
}

export default useStickyPosition
