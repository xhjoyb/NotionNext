import { useRef, useCallback } from 'react'

/**
 * 主题切换按钮 - 使用 View Transitions API 实现圆形扩散效果
 * 
 * 技术方案:
 * - 使用 document.startViewTransition() API
 * - 浏览器原生支持的主题切换动画
 * - 从点击位置向外圆形扩散切换主题
 * 
 * 关键元素说明:
 * - buttonRef: 按钮引用，用于获取点击位置
 * - toggleDarkMode: 主题切换函数
 * - isDarkMode: 当前主题状态
 * 
 * 实现原理:
 * 1. 检查浏览器是否支持 View Transitions API
 * 2. 获取按钮点击位置作为扩散中心
 * 3. 设置 view-transition-name 为根元素
 * 4. 调用 startViewTransition 启动动画
 * 5. 在动画回调中切换主题
 * 
 * 浏览器兼容性:
 * - Chrome/Edge 111+ 支持
 * - 不支持时降级为直接切换
 */
const ThemeToggleButton = ({ isDarkMode, toggleDarkMode }) => {
  const buttonRef = useRef(null)

  /**
   * 处理点击事件
   * 作用：启动 View Transition 动画并切换主题
   * 类型：事件处理函数
   * 标注：自定义
   * 
   * 调用链:
   * - document.startViewTransition(callback)
   *   - 作用: 启动视图过渡动画
   *   - 参数: callback 在动画帧中执行的回调函数
   *   - 返回: ViewTransition 对象
   * 
   * - updateCallback: 切换主题的回调函数
   *   - 作用: 在动画过渡中执行主题切换
   *   - 类型: 无参数函数
   */
  const handleClick = useCallback(() => {
    // 检查浏览器是否支持 View Transitions API
    // document.startViewTransition: 浏览器内置 API，用于视图过渡动画
    if (!document.startViewTransition) {
      // 降级处理：直接切换主题
      toggleDarkMode()
      return
    }

    // 获取按钮位置作为扩散中心
    const rect = buttonRef.current?.getBoundingClientRect()
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2

    // 计算到最远角的距离作为扩散半径
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    // 启动 View Transition
    // document.startViewTransition: 浏览器内置 API
    // 作用: 捕获当前视图状态，执行过渡动画，然后更新视图
    const transition = document.startViewTransition(() => {
      toggleDarkMode()
    })

    // 自定义动画效果
    // transition.ready: Promise，表示过渡准备就绪
    transition.ready.then(() => {
      // document.documentElement: 根元素 <html>
      // animate: 元素内置方法，用于创建动画
      // 参数: keyframes 关键帧数组, options 动画选项
      document.documentElement.animate(
        [
          {
            // clipPath: CSS 属性，裁剪路径
            // circle(0% at x y): 圆形裁剪，初始半径0%
            clipPath: `circle(0% at ${x}px ${y}px)`
          },
          {
            // circle(150% at x y): 圆形裁剪，最终半径150%
            clipPath: `circle(${endRadius}px at ${x}px ${y}px)`
          }
        ],
        {
          // duration: 动画持续时间，单位毫秒
          // 1200ms 让动画更舒缓，视觉效果更好
          duration: 1200,
          // easing: 缓动函数，控制动画速度曲线
          // cubic-bezier(0.4, 0, 0.2, 1): Material Design 标准缓动
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          // pseudoElement: 伪元素选择器
          // ::view-transition-new(root): 新视图的伪元素
          pseudoElement: '::view-transition-new(root)'
        }
      )
    })
  }, [toggleDarkMode])

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className='p-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-110 animate-breathe'
      aria-label='Toggle dark mode'>
      <i className={`fas ${isDarkMode ? 'fa-sun text-yellow-400' : 'fa-moon text-purple-400'}`}></i>
    </button>
  )
}

export default ThemeToggleButton
