import { isBrowser } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { getThemeConfig } from '../config'

/**
 * Live2D Cubism 3 看板娘组件
 * 支持 Cubism 3/4 格式模型
 */
const Live2DCubism3 = () => {
  const containerRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [chatMessage, setChatMessage] = useState('')
  const [showChat, setShowChat] = useState(false)

  // 基础配置
  const enabled = getThemeConfig('LIVE2D_CUBISM3.ENABLE', false)
  const modelPath = getThemeConfig('LIVE2D_CUBISM3.MODEL_PATH', '')
  const width = getThemeConfig('LIVE2D_CUBISM3.WIDTH', 300)
  const height = getThemeConfig('LIVE2D_CUBISM3.HEIGHT', 350)
  const position = getThemeConfig('LIVE2D_CUBISM3.POSITION', 'right')
  const bottom = getThemeConfig('LIVE2D_CUBISM3.BOTTOM', 20)
  const right = getThemeConfig('LIVE2D_CUBISM3.RIGHT', 20)
  const left = getThemeConfig('LIVE2D_CUBISM3.LEFT', 'auto')
  const mobileShow = getThemeConfig('LIVE2D_CUBISM3.MOBILE_SHOW', false)

  // 高级配置
  const scale = getThemeConfig('LIVE2D_CUBISM3.SCALE', 1.0)
  const enableEyeTracking = getThemeConfig('LIVE2D_CUBISM3.ENABLE_EYE_TRACKING', true)
  const enableClickInteraction = getThemeConfig('LIVE2D_CUBISM3.ENABLE_CLICK_INTERACTION', true)
  const autoPlayIdle = getThemeConfig('LIVE2D_CUBISM3.AUTO_PLAY_IDLE', true)
  const motionFadeIn = getThemeConfig('LIVE2D_CUBISM3.MOTION_FADE_IN', 500)
  const motionFadeOut = getThemeConfig('LIVE2D_CUBISM3.MOTION_FADE_OUT', 500)
  const expressionFadeIn = getThemeConfig('LIVE2D_CUBISM3.EXPRESSION_FADE_IN', 500)
  const enableSound = getThemeConfig('LIVE2D_CUBISM3.ENABLE_SOUND', false)
  const enablePhysics = getThemeConfig('LIVE2D_CUBISM3.ENABLE_PHYSICS', true)
  const enableBreathing = getThemeConfig('LIVE2D_CUBISM3.ENABLE_BREATHING', true)
  const randomMotionOnClick = getThemeConfig('LIVE2D_CUBISM3.RANDOM_MOTION_ON_CLICK', true)
  const clickMotionGroup = getThemeConfig('LIVE2D_CUBISM3.CLICK_MOTION_GROUP', 'tap')

  // 新增功能配置
  const enableExpression = getThemeConfig('LIVE2D_CUBISM3.ENABLE_EXPRESSION', true)
  const expressionInterval = getThemeConfig('LIVE2D_CUBISM3.EXPRESSION_INTERVAL', 5000)
  const enableChatBubble = getThemeConfig('LIVE2D_CUBISM3.ENABLE_CHAT_BUBBLE', true)
  const chatMessages = getThemeConfig('LIVE2D_CUBISM3.CHAT_MESSAGES', [])
  const chatInterval = getThemeConfig('LIVE2D_CUBISM3.CHAT_INTERVAL', 8000)
  const enableHoverEffect = getThemeConfig('LIVE2D_CUBISM3.ENABLE_HOVER_EFFECT', true)
  const hoverMotionGroup = getThemeConfig('LIVE2D_CUBISM3.HOVER_MOTION_GROUP', 'touch_body')

  // 拖拽和定时功能配置
  const enableDrag = getThemeConfig('LIVE2D_CUBISM3.ENABLE_DRAG', true)
  const rememberDragPosition = getThemeConfig('LIVE2D_CUBISM3.REMEMBER_DRAG_POSITION', true)
  const enableScheduledMotion = getThemeConfig('LIVE2D_CUBISM3.ENABLE_SCHEDULED_MOTION', true)
  const scheduledMotionInterval = getThemeConfig('LIVE2D_CUBISM3.SCHEDULED_MOTION_INTERVAL', 30000)
  const scheduledMessages = getThemeConfig('LIVE2D_CUBISM3.SCHEDULED_MESSAGES', [])

  // 拖拽位置状态（初始为 null，在 useEffect 中从 localStorage 加载）
  const [dragPosition, setDragPosition] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragPositionRef = useRef(null)

  // 在客户端加载保存的位置
  useEffect(() => {
    if (isBrowser && rememberDragPosition) {
      const saved = localStorage.getItem('live2d-position')
      if (saved) {
        setDragPosition(JSON.parse(saved))
      }
    }
  }, [rememberDragPosition])

  useEffect(() => {
    if (!isBrowser || !enabled || !modelPath) return

    const isMobile = window.innerWidth < 768
    if (isMobile && !mobileShow) return

    if (window.__live2dCubism3Initialized) return
    window.__live2dCubism3Initialized = true

    let canvas = null
    let app = null
    let model = null

    const initLive2D = async () => {
      try {
        canvas = document.createElement('canvas')
        canvas.id = 'live2d-cubism3-canvas'
        canvas.width = width
        canvas.height = height
        canvas.style.cssText = `
          width: ${width}px;
          height: ${height}px;
          cursor: ${enableClickInteraction ? 'pointer' : 'default'};
        `
        containerRef.current.appendChild(canvas)

        // 加载 SDK
        await loadScript('/live2d/sdk/pixi.min.js')
        await waitFor(() => window.PIXI, 5000)

        await loadScript('/live2d/sdk/live2d.min.js')
        await waitFor(() => window.Live2D, 5000)

        await loadScript('/live2d/sdk/live2dcubismcore.min.js')
        await waitFor(() => window.Live2DCubismCore, 5000)

        await loadScript('/live2d/sdk/pixi-live2d-display.min.js')
        await loadScript('/live2d/sdk/cubism4.min.js')
        await waitFor(() => window.PIXI?.live2d?.Live2DModel, 5000)

        // 配置 Live2D
        window.PIXI.live2d.config.sound = enableSound
        window.PIXI.live2d.config.motionFadingDuration = motionFadeIn
        window.PIXI.live2d.config.idleMotionFadingDuration = motionFadeOut
        window.PIXI.live2d.config.expressionFadingDuration = expressionFadeIn

        // 创建 Pixi 应用
        app = new window.PIXI.Application({
          view: canvas,
          width: width,
          height: height,
          transparent: true,
          antialias: true,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
          backgroundAlpha: 0,
        })

        // 加载模型
        model = await window.PIXI.live2d.Live2DModel.from(modelPath, {
          autoInteract: false,
          autoUpdate: true,
        })

        // 模型加载成功
        app.stage.addChild(model)

        // 应用物理效果配置
        if (!enablePhysics && model.internalModel?.physics) {
          model.internalModel.physics = null
        }

        // 应用呼吸动画配置
        if (!enableBreathing && model.internalModel?.breath) {
          model.internalModel.breath = null
        }

        // 调整模型大小
        const scaleX = (width * 0.9) / model.width
        const scaleY = (height * 0.9) / model.height
        const autoScale = Math.min(scaleX, scaleY)
        const finalScale = autoScale * scale
        model.scale.set(finalScale)
        model.x = width / 2
        model.y = height / 2 + 20
        model.anchor.set(0.5, 0.5)

        // 启用交互
        if (enableClickInteraction || enableEyeTracking) {
          model.eventMode = 'static'
        }

        // 视线跟随
        let onGlobalMouseMove = null
        if (enableEyeTracking) {
          // 使用内部模型的 focusController
          const focusController = model.internalModel?.focusController
          
          onGlobalMouseMove = (e) => {
            if (!model || !focusController) return
            
            const rect = canvas.getBoundingClientRect()
            const x = ((e.clientX - rect.left) / width) * 2 - 1
            const y = ((e.clientY - rect.top) / height) * 2 - 1
            
            // 设置目标焦点位置
            focusController.targetX = x
            focusController.targetY = -y
          }
          window.addEventListener('mousemove', onGlobalMouseMove)
        }

        // 点击交互
        if (enableClickInteraction) {
          const onPointerTap = () => {
            if (!model) return

            // 获取动作组 - Cubism 3/4 动作在 internalModel 中
            const motionManager = model.internalModel?.motionManager
            const definitions = motionManager?.definitions || {}
            let groups = Object.keys(definitions)
            
            // 尝试播放动作
            try {
              // 方法1: 尝试从空组播放 (Cubism 3 模型常见)
              if (groups.includes('')) {
                const motions = definitions['']
                if (motions && motions.length > 0) {
                  const randomIndex = Math.floor(Math.random() * motions.length)
                  model.motion('', randomIndex, 3)
                  return
                }
              }
              
              // 方法2: 尝试其他组
              groups = groups.filter(g => g !== 'null' && g !== '')
              if (groups.length > 0) {
                const group = randomMotionOnClick 
                  ? groups[Math.floor(Math.random() * groups.length)]
                  : (groups.includes(clickMotionGroup) ? clickMotionGroup : groups[0])
                model.motion(group, 0, 3)
              }
            } catch (e) {
              // 静默处理
            }
          }
          model.on('pointertap', onPointerTap)
          canvas.addEventListener('click', onPointerTap)
        }

        // 自动播放 idle 动作
        if (autoPlayIdle) {
          const motionManager = model.internalModel?.motionManager
          const definitions = motionManager?.definitions || {}
          const groups = Object.keys(definitions)

          // 查找 idle 动作
          const idleGroup = groups.find(g => g.toLowerCase().includes('idle'))

          try {
            if (idleGroup) {
              // 播放 named idle，优先级设为 2 确保不会被其他动作中断
              // 使用循环播放模式
              model.motion(idleGroup, 0, 2)
            } else if (groups.includes('')) {
              // 从空组中查找包含 idle 的文件
              const motions = definitions['']
              const idleIndex = motions?.findIndex(m =>
                m.toLowerCase?.().includes('idle') ||
                m.File?.toLowerCase?.().includes('idle')
              )
              if (idleIndex !== undefined && idleIndex >= 0) {
                model.motion('', idleIndex, 2)
              } else if (motions && motions.length > 0) {
                // 没有 idle，播放第一个动作
                model.motion('', 0, 2)
              }
            }

            // 设置动作循环 - 监听动作结束事件，自动重新播放 idle
            if (model.internalModel?.motionManager) {
              const mm = model.internalModel.motionManager
              const originalEnd = mm.onMotionEnd
              mm.onMotionEnd = (group, index) => {
                // 调用原始回调
                if (originalEnd) originalEnd(group, index)

                // 延迟一点再重新播放 idle，确保平滑过渡
                setTimeout(() => {
                  try {
                    const currentGroup = idleGroup || ''
                    const currentIndex = idleGroup ? 0 : (() => {
                      const motions = definitions['']
                      return motions?.findIndex(m =>
                        m.toLowerCase?.().includes('idle') ||
                        m.File?.toLowerCase?.().includes('idle')
                      ) || 0
                    })()
                    model.motion(currentGroup, currentIndex, 2)
                  } catch (e) {
                    // 静默处理
                  }
                }, 100)
              }
            }
          } catch (e) {
            // 静默处理
          }
        }

        // 表情切换
        let expressionTimer = null
        if (enableExpression && model.expression) {
          const expressions = model.internalModel?.settings?.expressions || []
          if (expressions.length > 0) {
            expressionTimer = setInterval(() => {
              try {
                const randomIndex = Math.floor(Math.random() * expressions.length)
                model.expression(randomIndex)
              } catch (e) {
                // 静默处理
              }
            }, expressionInterval)
          }
        }

        // 鼠标悬停效果
        if (enableHoverEffect) {
          const onMouseEnter = () => {
            try {
              // 播放悬停动作
              const motionManager = model.internalModel?.motionManager
              const definitions = motionManager?.definitions || {}
              
              if (definitions[hoverMotionGroup]) {
                model.motion(hoverMotionGroup, 0, 3)
              } else if (definitions['']) {
                // 尝试播放 touch 相关动作
                const motions = definitions['']
                const touchIndex = motions?.findIndex(m => 
                  m.File?.toLowerCase?.().includes('touch')
                )
                if (touchIndex !== undefined && touchIndex >= 0) {
                  model.motion('', touchIndex, 3)
                }
              }
            } catch (e) {
              // 静默处理
            }
          }
          canvas.addEventListener('mouseenter', onMouseEnter)
        }

        setLoaded(true)

        // 对话框/气泡功能
        let chatTimer = null
        if (enableChatBubble && chatMessages.length > 0) {
          const showRandomMessage = () => {
            const randomMsg = chatMessages[Math.floor(Math.random() * chatMessages.length)]
            setChatMessage(randomMsg)
            setShowChat(true)
            setTimeout(() => setShowChat(false), 3000)
          }
          // 首次显示
          setTimeout(showRandomMessage, 2000)
          // 定时显示
          chatTimer = setInterval(showRandomMessage, chatInterval)
        }

        // 定时动作功能
        let scheduledTimer = null
        if (enableScheduledMotion) {
          scheduledTimer = setInterval(() => {
            try {
              // 播放随机动作
              const motionManager = model.internalModel?.motionManager
              const definitions = motionManager?.definitions || {}
              const groups = Object.keys(definitions).filter(g => g !== 'null')
              
              if (groups.includes('')) {
                const motions = definitions['']
                if (motions && motions.length > 0) {
                  const randomIndex = Math.floor(Math.random() * motions.length)
                  model.motion('', randomIndex, 3)
                }
              } else if (groups.length > 0) {
                const randomGroup = groups[Math.floor(Math.random() * groups.length)]
                model.motion(randomGroup, 0, 3)
              }
              
              // 显示提醒消息
              if (scheduledMessages.length > 0) {
                const randomMsg = scheduledMessages[Math.floor(Math.random() * scheduledMessages.length)]
                setChatMessage(randomMsg)
                setShowChat(true)
                setTimeout(() => setShowChat(false), 4000)
              }
            } catch (e) {
              // 静默处理
            }
          }, scheduledMotionInterval)
        }

        // 清理函数
        return () => {
          if (expressionTimer) clearInterval(expressionTimer)
          if (chatTimer) clearInterval(chatTimer)
          if (scheduledTimer) clearInterval(scheduledTimer)
          if (onGlobalMouseMove) window.removeEventListener('mousemove', onGlobalMouseMove)
        }
      } catch (err) {
        setError(err.message || '初始化失败')
      }
    }

    const timer = setTimeout(initLive2D, 1000)

    return () => {
      clearTimeout(timer)
      window.__live2dCubism3Initialized = false
      if (model) model.destroy()
      if (app) app.destroy(true)
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas)
      }
    }
  }, [
    enabled, modelPath, width, height, mobileShow, scale,
    enableEyeTracking, enableClickInteraction, autoPlayIdle,
    motionFadeIn, motionFadeOut, expressionFadeIn,
    enableSound, enablePhysics, enableBreathing,
    randomMotionOnClick, clickMotionGroup,
    enableExpression, expressionInterval,
    enableHoverEffect, hoverMotionGroup,
    enableScheduledMotion, scheduledMotionInterval
  ])

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`)
      if (existing) {
        resolve()
        return
      }
      const script = document.createElement('script')
      script.src = src
      script.async = false
      script.onload = () => resolve()
      script.onerror = () => reject(new Error(`Failed to load: ${src}`))
      document.head.appendChild(script)
    })
  }

  const waitFor = (checkFn, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now()
      const interval = setInterval(() => {
        if (checkFn()) {
          clearInterval(interval)
          resolve()
        } else if (Date.now() - startTime > timeout) {
          clearInterval(interval)
          reject(new Error('Timeout'))
        }
      }, 100)
    })
  }

  // 拖拽事件处理
  const handleMouseDown = (e) => {
    if (!enableDrag) return
    // 获取当前元素位置
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    setIsDragging(true)
    // 计算鼠标相对于元素左上角的偏移
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top

    const handleMouseMove = (e) => {
      // 计算新位置（相对于视口）
      const newX = e.clientX - offsetX
      const newY = e.clientY - offsetY
      dragPositionRef.current = { x: newX, y: newY }
      // 使用 requestAnimationFrame 减少重渲染频率
      if (!containerRef.current._rafId) {
        containerRef.current._rafId = requestAnimationFrame(() => {
          setDragPosition({ ...dragPositionRef.current })
          containerRef.current._rafId = null
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      if (containerRef.current?._rafId) {
        cancelAnimationFrame(containerRef.current._rafId)
        containerRef.current._rafId = null
      }
      // 保存最终位置
      if (dragPositionRef.current) {
        setDragPosition(dragPositionRef.current)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // 保存拖拽位置到 localStorage
  useEffect(() => {
    if (rememberDragPosition && dragPosition) {
      localStorage.setItem('live2d-position', JSON.stringify(dragPosition))
    }
  }, [dragPosition, rememberDragPosition])

  if (!enabled || !modelPath) return null

  return (
    <div
      ref={containerRef}
      className={`fixed z-50 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${enableDrag ? 'cursor-move' : ''} ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{
        [position]: dragPosition ? 'auto' : (position === 'left' ? `${left}px` : `${right}px`),
        bottom: dragPosition ? 'auto' : `${bottom}px`,
        left: dragPosition ? `${dragPosition.x}px` : undefined,
        top: dragPosition ? `${dragPosition.y}px` : undefined,
        width: `${width}px`,
        height: `${height}px`,
        willChange: 'transform',
        transform: 'translateZ(0)',
        contain: 'layout style paint',
      }}
      onMouseDown={handleMouseDown}>

      {!loaded && !error && (
        <div className='absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/30 rounded-2xl backdrop-blur-sm'>
          <div className='flex flex-col items-center'>
            <div className='w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-3'></div>
            <span className='text-xs text-gray-500 dark:text-gray-400'>加载中...</span>
          </div>
        </div>
      )}

      {error && (
        <div className='absolute inset-0 flex items-center justify-center text-xs text-red-500 bg-white/90 dark:bg-black/90 rounded-2xl p-4 text-center backdrop-blur-sm'>
          <div>
            <div className='text-2xl mb-2'>😢</div>
            <div>Live2D 加载失败</div>
            <div className='text-gray-400 mt-1 text-[10px]'>{error}</div>
          </div>
        </div>
      )}

      {/* 对话框气泡 */}
      {loaded && enableChatBubble && showChat && (
        <div className='absolute -top-16 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up'>
          <div className='relative bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm px-4 py-2 rounded-2xl shadow-lg border border-pink-200 dark:border-pink-800 max-w-[200px] text-center'>
            {chatMessage}
            {/* 气泡小三角 */}
            <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800'></div>
          </div>
        </div>
      )}

      {loaded && enableClickInteraction && (
        <div className='absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity'>
          <span className='text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-black/50 px-3 py-1 rounded-full shadow-sm'>
            点击我互动~
          </span>
        </div>
      )}
    </div>
  )
}

export default Live2DCubism3
