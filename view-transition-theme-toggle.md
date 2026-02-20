# View Transitions API 主题切换动画开发文档

## 概述

本文档介绍如何使用 **View Transitions API** 实现从按钮位置向外圆形扩散的主题切换动画效果。这种效果不会遮挡页面元素，交互体验流畅自然。

## 浏览器兼容性

| 浏览器 | 版本要求 |
|--------|----------|
| Chrome | 111+ |
| Edge | 111+ |
| Opera | 97+ |
| Safari | 暂不支持 |
| Firefox | 暂不支持 |

**降级方案**：不支持 View Transitions API 的浏览器会自动降级为直接切换主题。

## 实现步骤

### 1. 创建主题切换按钮组件

```jsx
import { useRef, useCallback } from 'react'

const ThemeToggleButton = ({ isDarkMode, toggleDarkMode }) => {
  const buttonRef = useRef(null)

  const handleClick = useCallback(() => {
    // 检查浏览器是否支持 View Transitions API
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
    const transition = document.startViewTransition(() => {
      toggleDarkMode()
    })

    // 自定义动画效果
    transition.ready.then(() => {
      document.documentElement.animate(
        [
          {
            clipPath: `circle(0% at ${x}px ${y}px)`
          },
          {
            clipPath: `circle(${endRadius}px at ${x}px ${y}px)`
          }
        ],
        {
          duration: 1200,  // 动画持续时间（毫秒）
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',  // 缓动函数
          pseudoElement: '::view-transition-new(root)'
        }
      )
    })
  }, [toggleDarkMode])

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      aria-label='Toggle dark mode'>
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  )
}

export default ThemeToggleButton
```

### 2. 添加 CSS 样式

在主题的全局样式文件中添加以下 CSS：

```css
/* 根元素的视图过渡名称 */
html {
  view-transition-name: root;
}

/* 旧视图的过渡效果 */
::view-transition-old(root) {
  animation: none;
}

/* 新视图的过渡效果 */
::view-transition-new(root) {
  animation: none;
}

/* 尊重用户减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  html {
    view-transition-name: none;
  }
}
```

### 3. 在 Header 中使用组件

```jsx
import ThemeToggleButton from './ThemeToggleButton'

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // 切换 html 元素的 dark 类
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header>
      {/* 其他导航内容 */}
      <ThemeToggleButton 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
      />
    </header>
  )
}
```

## 关键 API 说明

### document.startViewTransition()

**作用**：启动视图过渡动画，浏览器会自动捕获当前视图状态，执行过渡，然后更新到新的视图状态。

**参数**：
- `callback`: 在动画帧中执行的回调函数，通常包含 DOM 更新操作

**返回值**：
- `ViewTransition` 对象，包含以下属性：
  - `ready`: Promise，表示过渡准备就绪
  - `finished`: Promise，表示过渡完成
  - `updateCallbackDone`: Promise，表示更新回调完成

### clip-path: circle()

**作用**：创建圆形裁剪区域，实现从按钮位置向外扩散的效果。

**语法**：
```css
clip-path: circle(radius at x y)
```

**参数**：
- `radius`: 圆形半径（百分比或像素）
- `x`: 圆心 X 坐标
- `y`: 圆心 Y 坐标

### ::view-transition-new() / ::view-transition-old()

**作用**：伪元素，分别表示过渡后的新视图和过渡前的旧视图。

**语法**：
```css
::view-transition-new(view-transition-name)
::view-transition-old(view-transition-name)
```

## 可配置参数

### 动画持续时间

```javascript
duration: 1200  // 单位：毫秒
```

建议范围：800ms - 1500ms
- 800ms：较快的切换
- 1200ms：舒缓的切换（推荐）
- 1500ms：缓慢的切换

### 缓动函数

```javascript
easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
```

常用缓动函数：
- `'ease'`: 标准缓动
- `'ease-in-out'`: 平滑开始和结束
- `'cubic-bezier(0.4, 0, 0.2, 1)'`: Material Design 标准缓动（推荐）
- `'cubic-bezier(0.34, 1.56, 0.64, 1)'`: 弹性效果

## 注意事项

1. **不要遮挡元素**：View Transitions API 是浏览器原生实现，不会创建额外的 DOM 元素遮挡页面内容。

2. **性能优化**：
   - 动画使用 GPU 加速
   - 仅在支持该 API 的浏览器中启用
   - 尊重用户的 `prefers-reduced-motion` 设置

3. **降级处理**：始终提供降级方案，确保在不支持的浏览器中也能正常使用。

4. **主题切换时机**：
   - 在 `startViewTransition` 的回调中执行主题切换
   - 浏览器会自动处理新旧视图的过渡

5. **扩散中心计算**：
   - 使用 `getBoundingClientRect()` 获取按钮位置
   - 计算按钮中心作为扩散起点
   - 计算到屏幕最远角的距离作为扩散半径

## 完整代码示例

参见本主题中的实现：
- 组件：`themes/anime/components/ThemeToggleButton.js`
- 样式：`themes/anime/style.js` (View Transitions CSS 部分)

## 参考资源

- [MDN - View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
- [Chrome Developers - View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions)
- [Can I Use - View Transitions API](https://caniuse.com/view-transitions)
