import { useEffect, useRef } from 'react'

/**
 * 樱花飘落效果组件
 * 在页面背景显示飘落的樱花、蝴蝶结、星星等装饰元素
 */
const SakuraEffect = () => {
  const containerRef = useRef(null)
  const intervalRef = useRef(null)
  const sakuraCountRef = useRef(0)
  const maxSakura = 5

  useEffect(() => {
    // 创建容器 - 高层级确保在最上方
    const container = document.createElement('div')
    container.className = 'sakura-container'
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 20;
      overflow: hidden;
    `
    document.body.appendChild(container)
    containerRef.current = container

    const createSakura = () => {
      if (sakuraCountRef.current >= maxSakura) return

      sakuraCountRef.current++
      const sakura = document.createElement('div')
      sakura.innerHTML = ['🌸', '🎀', '💫', '✨'][Math.floor(Math.random() * 4)]
      sakura.style.cssText = `
        position: fixed;
        top: -10vh;
        left: ${Math.random() * 100}vw;
        font-size: ${Math.random() * 10 + 12}px;
        pointer-events: none;
        z-index: 9999;
        filter: drop-shadow(0 0 5px rgba(255, 113, 206, 0.5));
        will-change: transform, opacity;
        animation: sakura-fall ${Math.random() * 5 + 12}s linear forwards;
      `
      container.appendChild(sakura)

      // 动画结束后移除元素
      sakura.addEventListener('animationend', () => {
        if (sakura.parentNode) {
          sakura.remove()
        }
        sakuraCountRef.current--
      })
    }

    // 立即创建第一个
    createSakura()
    
    // 定时创建
    intervalRef.current = setInterval(createSakura, 3000)

    return () => {
      // 清理
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (containerRef.current && containerRef.current.parentNode) {
        containerRef.current.remove()
      }
      sakuraCountRef.current = 0
    }
  }, [])

  return (
    <style jsx global>{`
      @keyframes sakura-fall {
        0% {
          transform: translateY(-10vh) rotate(0deg) translateX(0);
          opacity: 1;
        }
        25% {
          transform: translateY(22vh) rotate(180deg) translateX(20px);
        }
        50% {
          transform: translateY(54vh) rotate(360deg) translateX(-20px);
        }
        75% {
          transform: translateY(77vh) rotate(540deg) translateX(20px);
        }
        100% {
          transform: translateY(110vh) rotate(720deg) translateX(0);
          opacity: 0;
        }
      }
    `}</style>
  )
}

export default SakuraEffect
