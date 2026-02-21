import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { marked } from 'marked'

/**
 * AI解释功能组件
 * 在文章详情页提供选中文本解释功能
 * 
 * 关键元素说明:
 * - selectedText: 用户选中的原始文本内容（保留格式）
 * - selectedHtml: 用户选中的HTML内容（保留富文本格式）
 * - displayText: 用于显示的文本（过长时截断）
 * - position: 右键菜单位置 {x, y}
 * - showMenu: 是否显示右键菜单
 * - showDialog: 是否显示AI解释对话框
 * - explanation: AI返回的解释内容
 * - loading: 是否正在加载AI回复
 * - apiKey: DeepSeek API Key（从localStorage读取）
 * - isLongText: 选中的文本是否过长
 * 
 * 调用链:
 * - document.addEventListener('contextmenu'): 监听右键事件
 * - window.getSelection(): 获取选中文本
 * - selection.getRangeAt(0).cloneContents(): 获取选中的HTML内容
 * - fetch(): 调用DeepSeek API
 * - localStorage.getItem/setItem: 存取API Key
 * 
 * 样式:
 * - 二次元动漫风格
 * - 毛玻璃效果
 * - 渐变色边框
 * - 浮动动画
 * - 保留原文格式的文本显示区域
 */
const AIExplanation = () => {
  const [selectedText, setSelectedText] = useState('')
  const [selectedHtml, setSelectedHtml] = useState('')
  const [displayText, setDisplayText] = useState('')
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [showMenu, setShowMenu] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isLongText, setIsLongText] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef(null)

  // 文本长度限制
  const MAX_DISPLAY_LENGTH = 300
  const MAX_API_LENGTH = 2000

  useEffect(() => {
    setMounted(true)
    
    // 检测是否为移动端
    const checkMobile = () => {
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      setIsMobile(mobileRegex.test(navigator.userAgent) || window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // 从localStorage读取API Key
    const savedKey = localStorage.getItem('deepseek_api_key')
    if (savedKey) setApiKey(savedKey)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  /**
   * 处理右键点击事件
   * 作用：显示自定义右键菜单，获取选中的文本和HTML
   * 类型：事件处理函数
   * 标注：自定义
   * 
   * 调用链:
   * - window.getSelection(): 获取选区对象
   * - selection.toString(): 获取纯文本
   * - selection.getRangeAt(0): 获取选区范围
   * - range.cloneContents(): 克隆选区内容
   * - document.createElement('div'): 创建临时容器
   * - tempDiv.innerHTML: 获取HTML字符串
   * 
   * 格式保留策略:
   * 1. 获取选中内容的HTML结构
   * 2. 复制内联样式以保留视觉格式
   * 3. 保留代码块的缩进和换行
   * 
   * 安全策略:
   * - 检查选区是否在AI对话框内，如果是则不触发
   * - 只在文章详情页触发
   */
  const handleContextMenu = useCallback((e) => {
    // 检查点击目标是否在AI对话框内
    const dialogElement = document.querySelector('.ai-dialog')
    if (dialogElement && dialogElement.contains(e.target)) {
      // 在AI对话框内，不触发右键菜单
      return
    }

    const selection = window.getSelection()
    const text = selection.toString()

    // 检查是否有选中文本
    if (text && text.trim().length > 0) {
      e.preventDefault()

      // 获取选中的HTML内容（保留格式）
      let html = ''
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const clonedContents = range.cloneContents()
        const tempDiv = document.createElement('div')
        tempDiv.appendChild(clonedContents)
        
        // 处理HTML内容，保留关键样式
        html = processSelectedHtml(tempDiv.innerHTML)
      }

      // 保留原始文本（包括换行和空格）
      const rawText = text

      // 判断文本是否过长
      const longText = rawText.length > MAX_DISPLAY_LENGTH
      setIsLongText(longText)

      // 设置显示文本（过长时截断）
      const display = longText 
        ? rawText.substring(0, MAX_DISPLAY_LENGTH) + '...' 
        : rawText

      setSelectedText(rawText)
      setSelectedHtml(html)
      setDisplayText(display)
      setPosition({ x: e.clientX, y: e.clientY })
      setShowMenu(true)
    }
  }, [])

  /**
   * 处理选中的HTML内容
   * 作用：直接返回原始HTML，不做任何修改以保留完整格式
   * 类型：工具函数
   * 标注：自定义
   */
  const processSelectedHtml = (html) => {
    // 直接返回原始HTML，浏览器复制的内容已经包含完整格式
    return html
  }

  /**
   * 处理点击其他地方关闭菜单
   */
  const handleClickOutside = useCallback((e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowMenu(false)
    }
  }, [])

  /**
   * 处理滚动关闭菜单
   */
  const handleScroll = useCallback(() => {
    setShowMenu(false)
  }, [])

  useEffect(() => {
    // 移动端不绑定事件监听器
    if (isMobile) return

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('scroll', handleScroll)
    }
  }, [handleContextMenu, handleClickOutside, handleScroll, isMobile])

  /**
   * 调用DeepSeek API获取解释
   * 作用：发送选中文本到DeepSeek API并获取AI解释
   * 类型：异步函数
   * 标注：自定义
   * 
   * 调用链:
   * - fetch(url, options): 发送HTTP请求
   *   - url: DeepSeek API地址
   *   - options: 请求配置，包含headers和body
   * - response.json(): 解析JSON响应
   * - localStorage.getItem('deepseek_api_key'): 获取API Key
   * 
   * 文本处理:
   * - 如果文本过长，截取前MAX_API_LENGTH个字符
   * - 保留文本的基本格式信息
   */
  const fetchExplanation = async () => {
    if (!apiKey) {
      setExplanation('请先配置DeepSeek API Key')
      setShowDialog(true)
      setShowMenu(false)
      return
    }

    setLoading(true)
    setShowDialog(true)
    setShowMenu(false)

    // 处理过长的文本
    const textToExplain = selectedText.length > MAX_API_LENGTH 
      ? selectedText.substring(0, MAX_API_LENGTH) + '\n\n[内容过长，已截断...]' 
      : selectedText

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: '你是一个 helpful 的AI助手，专门解释文章中的内容。请用简洁易懂的语言解释用户选中的文本。如果文本包含代码，请解释代码的功能和逻辑。'
            },
            {
              role: 'user',
              content: `请解释以下内容：\n\n${textToExplain}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      })

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content || '无法获取解释'
      setExplanation(content)
    } catch (error) {
      setExplanation(`获取解释失败: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  /**
   * 复制AI解释内容到剪贴板
   * 作用：将AI回复的纯文本内容复制到剪贴板
   * 类型：异步函数
   * 标注：自定义
   */
  const copyExplanation = async () => {
    try {
      await navigator.clipboard.writeText(explanation)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  /**
   * 渲染右键菜单
   * 作用：渲染二次元风格的右键菜单
   * 返回：Portal渲染的菜单元素
   */
  const renderContextMenu = () => {
    if (!showMenu || !mounted) return null

    const menuContent = (
      <div
        ref={menuRef}
        className="ai-context-menu"
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 10000,
          animation: 'menuPopIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        <div className="ai-menu-item" onClick={fetchExplanation}>
          <svg className="ai-menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
          </svg>
          <span className="ai-menu-text">AI 解释</span>
          {isLongText && <span className="ai-menu-badge">长文本</span>}
        </div>
        <div className="ai-menu-item" onClick={() => setShowMenu(false)}>
          <svg className="ai-menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          <span className="ai-menu-text">取消</span>
        </div>

        <style>{`
          .ai-context-menu {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 168, 212, 0.95) 100%);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 2px solid rgba(236, 72, 153, 0.3);
            border-radius: 16px;
            padding: 8px;
            box-shadow: 
              0 8px 32px rgba(236, 72, 153, 0.2),
              0 0 0 1px rgba(255, 255, 255, 0.5) inset;
            min-width: 180px;
          }

          .dark .ai-context-menu {
            background: linear-gradient(135deg, rgba(30, 27, 46, 0.95) 0%, rgba(167, 139, 250, 0.2) 100%);
            border-color: rgba(167, 139, 250, 0.4);
            box-shadow: 
              0 8px 32px rgba(167, 139, 250, 0.2),
              0 0 0 1px rgba(255, 255, 255, 0.1) inset;
          }

          .ai-menu-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #4A044E;
            font-size: 14px;
            font-weight: 500;
          }

          .dark .ai-menu-item {
            color: #F9FAFB;
          }

          .ai-menu-item:hover {
            background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(167, 139, 250, 0.15) 100%);
            transform: translateX(4px);
          }

          .ai-menu-icon {
            color: #EC4899;
            filter: drop-shadow(0 2px 4px rgba(236, 72, 153, 0.3));
          }

          .dark .ai-menu-icon {
            color: #A78BFA;
          }

          .ai-menu-badge {
            margin-left: auto;
            font-size: 10px;
            padding: 2px 8px;
            background: linear-gradient(135deg, #EC4899 0%, #A78BFA 100%);
            color: white;
            border-radius: 10px;
            font-weight: 600;
          }

          @keyframes menuPopIn {
            0% {
              opacity: 0;
              transform: scale(0.8) translateY(-10px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}</style>
      </div>
    )

    return createPortal(menuContent, document.body)
  }

  /**
   * 渲染AI解释对话框
   * 作用：渲染二次元风格的AI解释浮动对话框
   * 返回：Portal渲染的对话框元素
   * 
   * 改进点:
   * - 支持显示长文本（带滚动条）
   * - 保留原文格式（使用pre-wrap）
   * - 使用等宽字体显示代码
   * - 支持展开/收起长文本
   */
  const renderDialog = () => {
    if (!showDialog || !mounted) return null

    const dialogContent = (
      <div
        className="ai-dialog-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.3s ease'
        }}
      >
        <div
          className="ai-dialog"
          style={{
            animation: 'dialogBounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {/* 标题栏 */}
          <div className="ai-dialog-header">
            <div className="ai-dialog-title">
              <span className="ai-title-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="aiIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#EC4899" />
                      <stop offset="100%" stopColor="#A78BFA" />
                    </linearGradient>
                  </defs>
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#aiIconGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M2 17L12 22L22 17" stroke="url(#aiIconGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M2 12L12 17L22 12" stroke="url(#aiIconGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <circle cx="12" cy="12" r="3" fill="url(#aiIconGradient)"/>
                </svg>
              </span>
              <span>AI 解释</span>
            </div>
            <div className="ai-dialog-actions">
              {!loading && explanation && (
                <button
                  onClick={copyExplanation}
                  className="ai-copy-btn-header"
                  title={copied ? '已复制' : '复制内容'}
                >
                  {copied ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>已复制</span>
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                      <span>复制</span>
                    </>
                  )}
                </button>
              )}
              <button className="ai-dialog-close" onClick={() => setShowDialog(false)} aria-label="关闭">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* 左右布局内容区 */}
          <div className="ai-dialog-body">
            {/* 左侧：AI解释 */}
            <div className="ai-explanation-panel">
              <div className="ai-panel-content">
                {loading ? (
                  <div className="ai-loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                ) : (
                  <div 
                    className="ai-markdown-content"
                    dangerouslySetInnerHTML={{ 
                      __html: marked.parse(explanation, { breaks: true, gfm: true })
                    }}
                  />
                )}
              </div>
            </div>

            {/* 右侧：选中的内容 */}
            <div className="ai-source-panel">
              <div className="ai-panel-header">
                <span className="ai-panel-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                  原文
                  {isLongText && (
                    <span className="ai-text-badge">{selectedText.length} 字</span>
                  )}
                </span>
              </div>
              <div
                className="ai-panel-content ai-source-content"
                dangerouslySetInnerHTML={{
                  __html: selectedHtml || displayText.replace(/\n/g, '<br>')
                }}
              />
            </div>
          </div>

          {/* 底部装饰 */}
          <div className="ai-dialog-footer">
            <span>Powered by DeepSeek</span>
            <span className="ai-footer-stars">✨</span>
          </div>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes dialogBounceIn {
            0% {
              opacity: 0;
              transform: scale(0.7) translateY(30px);
            }
            60% {
              transform: scale(1.05) translateY(-5px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          .ai-dialog {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(252, 231, 243, 0.98) 100%);
            backdrop-filter: blur(20px) saturate(180%);
            border: 2px solid rgba(236, 72, 153, 0.3);
            border-radius: 24px;
            box-shadow: 
              0 20px 60px rgba(236, 72, 153, 0.25),
              0 0 0 1px rgba(255, 255, 255, 0.8) inset,
              0 0 30px rgba(167, 139, 250, 0.2);
            width: 90vw;
            max-width: 1200px;
            height: 80vh;
            min-height: 500px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }

          .dark .ai-dialog {
            background: linear-gradient(135deg, rgba(30, 27, 46, 0.98) 0%, rgba(45, 38, 64, 0.98) 100%);
            border-color: rgba(167, 139, 250, 0.4);
            box-shadow: 
              0 20px 60px rgba(167, 139, 250, 0.25),
              0 0 0 1px rgba(255, 255, 255, 0.1) inset,
              0 0 30px rgba(167, 139, 250, 0.15);
          }

          .ai-dialog-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 24px;
            border-bottom: 1px solid rgba(236, 72, 153, 0.15);
            flex-shrink: 0;
          }

          .dark .ai-dialog-header {
            border-color: rgba(167, 139, 250, 0.2);
          }

          .ai-dialog-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 18px;
            font-weight: 700;
            color: #4A044E;
          }

          .dark .ai-dialog-title {
            color: #F9FAFB;
          }

          .ai-title-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            filter: drop-shadow(0 2px 8px rgba(236, 72, 153, 0.4));
            animation: float 3s ease-in-out infinite;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-3px) rotate(2deg); }
            75% { transform: translateY(-3px) rotate(-2deg); }
          }

          .ai-dialog-actions {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .ai-copy-btn-header {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 14px;
            border-radius: 10px;
            border: 2px solid rgba(236, 72, 153, 0.3);
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(252, 231, 243, 0.9) 100%);
            color: #EC4899;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 2px 8px rgba(236, 72, 153, 0.15);
          }

          .dark .ai-copy-btn-header {
            border-color: rgba(167, 139, 250, 0.4);
            background: linear-gradient(135deg, rgba(45, 38, 64, 0.9) 0%, rgba(30, 27, 46, 0.9) 100%);
            color: #A78BFA;
            box-shadow: 0 2px 8px rgba(167, 139, 250, 0.15);
          }

          .ai-copy-btn-header:hover {
            background: linear-gradient(135deg, #EC4899 0%, #A78BFA 100%);
            color: white;
            border-color: transparent;
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
          }

          .dark .ai-copy-btn-header:hover {
            background: linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%);
            box-shadow: 0 4px 12px rgba(167, 139, 250, 0.3);
          }

          .ai-copy-btn-header:active {
            transform: translateY(0) scale(0.98);
          }

          .ai-dialog-close {
            width: 36px;
            height: 36px;
            border-radius: 12px;
            border: 2px solid rgba(236, 72, 153, 0.2);
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(252, 231, 243, 0.9) 100%);
            color: #EC4899;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 
              0 2px 8px rgba(236, 72, 153, 0.15),
              0 0 0 1px rgba(255, 255, 255, 0.5) inset;
          }

          .dark .ai-dialog-close {
            color: #A78BFA;
            background: linear-gradient(135deg, rgba(45, 38, 64, 0.9) 0%, rgba(30, 27, 46, 0.9) 100%);
            border-color: rgba(167, 139, 250, 0.3);
            box-shadow: 
              0 2px 8px rgba(167, 139, 250, 0.2),
              0 0 0 1px rgba(255, 255, 255, 0.1) inset;
          }

          .ai-dialog-close:hover {
            background: linear-gradient(135deg, #EC4899 0%, #A78BFA 100%);
            color: white;
            border-color: transparent;
            transform: rotate(90deg) scale(1.1);
            box-shadow: 
              0 4px 16px rgba(236, 72, 153, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.3) inset;
          }

          .dark .ai-dialog-close:hover {
            background: linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%);
            box-shadow: 
              0 4px 16px rgba(167, 139, 250, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.2) inset;
          }

          .ai-dialog-close:active {
            transform: rotate(90deg) scale(0.95);
          }

          /* 左右布局主体 - AI解释占60%，原文占40% */
          .ai-dialog-body {
            display: flex;
            flex: 1;
            overflow: hidden;
          }

          .ai-explanation-panel {
            flex: 1.5;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border-right: 1px solid rgba(236, 72, 153, 0.15);
          }

          .ai-source-panel {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .dark .ai-explanation-panel {
            border-right-color: rgba(167, 139, 250, 0.2);
          }

          .ai-panel-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(167, 139, 250, 0.08) 100%);
            border-bottom: 1px solid rgba(236, 72, 153, 0.1);
            flex-shrink: 0;
          }

          .dark .ai-panel-header {
            background: linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
            border-bottom-color: rgba(167, 139, 250, 0.15);
          }

          .ai-panel-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            font-weight: 600;
            color: #EC4899;
          }

          .dark .ai-panel-title {
            color: #A78BFA;
          }

          .ai-text-badge {
            font-size: 10px;
            padding: 2px 8px;
            background: rgba(236, 72, 153, 0.15);
            border-radius: 12px;
            color: #EC4899;
            font-weight: 500;
            margin-left: 8px;
          }

          .dark .ai-text-badge {
            background: rgba(167, 139, 250, 0.2);
            color: #A78BFA;
          }

          .ai-panel-content {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            font-size: 13px;
            line-height: 1.6;
          }

          /* 原文内容样式 - 极简，不覆盖原有样式 */
          .ai-source-content {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: rgba(249, 250, 251, 0.8);
            color: #1F2937;
            font-size: 14px;
            line-height: 1.8;
          }

          .dark .ai-source-content {
            background: rgba(31, 41, 55, 0.6);
            color: #F9FAFB;
          }

          /* 隐藏原文中的代码复制按钮 */
          .ai-source-content .copy-button,
          .ai-source-content [class*="copy"],
          .ai-source-content button[class*="copy"],
          .ai-source-content .code-copy,
          .ai-source-content .copy-code {
            display: none !important;
          }

          /* 隐藏原文中的链接图标 */
          .ai-source-content a::before,
          .ai-source-content a::after,
          .ai-source-content a [class*="icon"],
          .ai-source-content a [class*="link-icon"],
          .ai-source-content a svg,
          .ai-source-content .link-icon,
          .ai-source-content .external-link-icon {
            display: none !important;
          }

          /* 链接只显示为普通文字 */
          .ai-source-content a {
            color: inherit;
            text-decoration: none;
            pointer-events: none;
          }

          /* Markdown 内容样式 - 简洁紧凑 */
          .ai-markdown-content {
            line-height: 1.5;
          }

          .ai-markdown-content * {
            margin: 0;
          }

          .ai-markdown-content > * + * {
            margin-top: 4px;
          }

          .ai-markdown-content h1,
          .ai-markdown-content h2,
          .ai-markdown-content h3,
          .ai-markdown-content h4 {
            color: #EC4899;
            font-weight: 600;
            margin-top: 8px;
            margin-bottom: 2px;
          }

          .dark .ai-markdown-content h1,
          .dark .ai-markdown-content h2,
          .dark .ai-markdown-content h3,
          .dark .ai-markdown-content h4 {
            color: #A78BFA;
          }

          .ai-markdown-content h1 { font-size: 14px; }
          .ai-markdown-content h2 { font-size: 13px; }
          .ai-markdown-content h3 { font-size: 12px; }
          .ai-markdown-content h4 { font-size: 11px; }

          .ai-markdown-content {
            color: #111827;
          }

          .dark .ai-markdown-content {
            color: #F9FAFB;
          }

          .ai-markdown-content p {
            color: #111827;
            margin: 0;
          }

          .dark .ai-markdown-content p {
            color: #F9FAFB;
          }

          .ai-markdown-content ul,
          .ai-markdown-content ol {
            padding-left: 16px;
          }

          .ai-markdown-content li {
            margin: 1px 0;
          }

          .ai-markdown-content li::marker {
            color: #EC4899;
          }

          .dark .ai-markdown-content li::marker {
            color: #A78BFA;
          }

          .ai-markdown-content strong {
            color: #EC4899;
            font-weight: 600;
          }

          .dark .ai-markdown-content strong {
            color: #F9A8D4;
          }

          .ai-markdown-content code {
            background: rgba(236, 72, 153, 0.1);
            padding: 0 4px;
            border-radius: 3px;
            font-size: 12px;
            color: #EC4899;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          }

          .dark .ai-markdown-content code {
            background: rgba(167, 139, 250, 0.15);
            color: #A78BFA;
          }

          .ai-markdown-content pre {
            background: rgba(0, 0, 0, 0.04);
            padding: 8px;
            border-radius: 6px;
            overflow-x: auto;
            margin: 4px 0;
          }

          .dark .ai-markdown-content pre {
            background: rgba(0, 0, 0, 0.2);
          }

          .ai-markdown-content pre code {
            background: none;
            padding: 0;
            color: inherit;
          }

          .ai-markdown-content blockquote {
            padding: 4px 8px;
            border-left: 2px solid #EC4899;
            background: rgba(236, 72, 153, 0.05);
            margin: 4px 0;
          }

          .dark .ai-markdown-content blockquote {
            border-left-color: #A78BFA;
            background: rgba(167, 139, 250, 0.08);
          }



          .ai-loading-dots {
            display: flex;
            gap: 8px;
            justify-content: center;
            align-items: center;
            height: 100px;
          }

          .ai-loading-dots span {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: linear-gradient(135deg, #EC4899 0%, #A78BFA 100%);
            animation: bounce 1.4s ease-in-out infinite both;
          }

          .ai-loading-dots span:nth-child(1) { animation-delay: -0.32s; }
          .ai-loading-dots span:nth-child(2) { animation-delay: -0.16s; }

          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
          }

          .ai-dialog-footer {
            padding: 12px 24px;
            border-top: 1px solid rgba(236, 72, 153, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 12px;
            color: #9CA3AF;
            flex-shrink: 0;
          }

          .dark .ai-dialog-footer {
            border-color: rgba(167, 139, 250, 0.15);
            color: #6B7280;
          }

          .ai-footer-stars {
            animation: twinkle 1.5s ease-in-out infinite;
          }

          @keyframes twinkle {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }

          /* 面板内容区滚动条 */
          .ai-panel-content::-webkit-scrollbar {
            width: 6px;
          }

          .ai-panel-content::-webkit-scrollbar-track {
            background: transparent;
          }

          .ai-panel-content::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, rgba(236, 72, 153, 0.4) 0%, rgba(167, 139, 250, 0.4) 100%);
            border-radius: 3px;
          }
        `}</style>
      </div>
    )

    return createPortal(dialogContent, document.body)
  }

  // 移动端不渲染此组件
  if (isMobile) {
    return null
  }

  return (
    <>
      {renderContextMenu()}
      {renderDialog()}
    </>
  )
}

export default AIExplanation
