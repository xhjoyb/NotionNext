import { useEffect } from 'react'

/**
 * 静态自定义光标组件
 * 使用 CSS cursor 属性，性能更好，无延迟
 */
const KawaiiCursor = () => {
  useEffect(() => {
    // 检测是否为触摸设备
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    if (isTouchDevice) return

    // SVG 光标 - 使用 base64 编码避免特殊字符问题
    const defaultCursorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FFD700"/><stop offset="50%" stop-color="#FF71CE"/><stop offset="100%" stop-color="#B967FF"/></linearGradient></defs><path d="M16 2L19 12L30 13L21 19L24 30L16 24L8 30L11 19L2 13L13 12L16 2Z" fill="url(#g)" stroke="white" stroke-width="1.5"/><circle cx="16" cy="16" r="2" fill="rgba(255,255,255,0.6)"/></svg>`

    const pointerCursorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><defs><linearGradient id="p" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FF71CE"/><stop offset="100%" stop-color="#FF1493"/></linearGradient></defs><ellipse cx="16" cy="20" rx="10" ry="7" fill="url(#p)" stroke="white" stroke-width="1.5"/><ellipse cx="16" cy="12" rx="5" ry="4" fill="#FFB6C1" stroke="white" stroke-width="1"/><ellipse cx="8" cy="17" rx="3" ry="4" fill="#FFB6C1" stroke="white" stroke-width="1" transform="rotate(-20 8 17)"/><ellipse cx="24" cy="17" rx="3" ry="4" fill="#FFB6C1" stroke="white" stroke-width="1" transform="rotate(20 24 17)"/></svg>`

    const textCursorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><defs><linearGradient id="t" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FF71CE"/><stop offset="100%" stop-color="#B967FF"/></linearGradient></defs><path d="M22 6L26 10L12 24L8 20L22 6Z" fill="url(#t)" stroke="white" stroke-width="1.5"/><path d="M8 20L6 26L12 24L8 20Z" fill="#FF71CE" stroke="white" stroke-width="1"/></svg>`

    // 转换为 base64
    const toBase64 = (svg) => {
      return btoa(unescape(encodeURIComponent(svg)))
    }

    const defaultCursor = `data:image/svg+xml;base64,${toBase64(defaultCursorSvg)}`
    const pointerCursor = `data:image/svg+xml;base64,${toBase64(pointerCursorSvg)}`
    const textCursor = `data:image/svg+xml;base64,${toBase64(textCursorSvg)}`

    // 设置默认光标
    document.body.style.cursor = `url('${defaultCursor}') 16 16, auto`

    // 为不同元素设置不同光标
    const style = document.createElement('style')
    style.id = 'kawaii-cursor-styles'
    style.textContent = `
      a, button, [role="button"], input[type="submit"], input[type="button"], 
      input[type="reset"], [data-cursor="pointer"] {
        cursor: url('${pointerCursor}') 16 16, pointer !important;
      }
      input[type="text"], input[type="email"], input[type="password"], 
      input[type="search"], input[type="url"], input[type="number"],
      textarea, [contenteditable="true"] {
        cursor: url('${textCursor}') 16 16, text !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.body.style.cursor = ''
      const existingStyle = document.getElementById('kawaii-cursor-styles')
      if (existingStyle) {
        existingStyle.remove()
      }
    }
  }, [])

  // 触摸设备不渲染
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return null
}

export default KawaiiCursor
