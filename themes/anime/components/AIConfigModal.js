import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

/**
 * AI配置弹窗组件
 * 用于配置DeepSeek API Key
 *
 * 关键元素说明:
 * - isOpen: 是否显示弹窗
 * - onClose: 关闭回调函数
 * - apiKey: 当前API Key值
 * - setApiKey: 设置API Key函数
 * - showPassword: 是否显示密码（明文/密文切换）
 * - mounted: 组件挂载状态
 *
 * 调用链:
 * - localStorage.getItem('deepseek_api_key'): 读取已保存的API Key
 * - localStorage.setItem('deepseek_api_key', value): 保存API Key
 * - createPortal(): 将弹窗渲染到body层级
 *
 * 样式:
 * - 二次元动漫风格
 * - 毛玻璃效果
 * - 渐变色边框
 * - 浮动动画
 */
const AIConfigModal = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [saved, setSaved] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      // 弹窗打开时读取已保存的API Key
      const savedKey = localStorage.getItem('deepseek_api_key') || ''
      setApiKey(savedKey)
      setSaved(false)
      // 自动聚焦输入框
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  /**
   * 保存API Key
   * 作用：将API Key保存到localStorage
   * 类型：事件处理函数
   * 标注：自定义
   */
  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('deepseek_api_key', apiKey.trim())
      setSaved(true)
      setTimeout(() => {
        onClose()
      }, 800)
    }
  }

  /**
   * 清除API Key
   * 作用：从localStorage中删除API Key
   * 类型：事件处理函数
   * 标注：自定义
   */
  const handleClear = () => {
    localStorage.removeItem('deepseek_api_key')
    setApiKey('')
    setSaved(true)
    setTimeout(() => {
      onClose()
    }, 800)
  }

  /**
   * 处理键盘事件
   * 作用：按Enter键保存，按Escape键关闭
   * 类型：事件处理函数
   * 标注：自定义
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div
      className="ai-config-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.3s ease'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="ai-config-modal"
        style={{
          animation: 'modalBounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* 标题栏 */}
        <div className="ai-config-header">
          <div className="ai-config-title">
            <svg className="ai-config-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>AI 配置</span>
          </div>
          <button className="ai-config-close" onClick={onClose} aria-label="关闭">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* 内容区域 */}
        <div className="ai-config-body">
          <div className="ai-config-description">
            <p>配置您的 DeepSeek API Key 以使用 AI 解释功能</p>
            <div className="ai-config-usage">
              <p className="ai-config-usage-title">使用方法：</p>
              <ol className="ai-config-usage-list">
                <li>在文章详情页选中您想要解释的内容</li>
                <li>右键点击选中的文字</li>
                <li>选择「AI 解释」选项</li>
                <li>等待 AI 生成解释结果</li>
              </ol>
            </div>
            <p className="ai-config-hint">API Key 仅存储在您的本地浏览器中，永久有效，除非您手动清除</p>
          </div>

          <div className="ai-config-input-group">
            <label className="ai-config-label">
              <span>DeepSeek API Key</span>
              <a
                href="https://platform.deepseek.com/api_keys"
                target="_blank"
                rel="noopener noreferrer"
                className="ai-config-link"
              >
                获取 Key →
              </a>
            </label>
            <div className="ai-config-input-wrapper">
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="ai-config-input"
              />
              <button
                className="ai-config-toggle"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {saved && (
            <div className="ai-config-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>保存成功！</span>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="ai-config-footer">
          <button
            className="ai-config-btn ai-config-btn-secondary"
            onClick={handleClear}
            disabled={!apiKey}
          >
            清除
          </button>
          <button
            className="ai-config-btn ai-config-btn-primary"
            onClick={handleSave}
            disabled={!apiKey.trim()}
          >
            保存配置
          </button>
        </div>


      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalBounceIn {
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

        .ai-config-modal {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(252, 231, 243, 0.98) 100%);
          backdrop-filter: blur(20px) saturate(180%);
          border: 2px solid rgba(236, 72, 153, 0.3);
          border-radius: 28px;
          box-shadow:
            0 25px 80px rgba(236, 72, 153, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.8) inset,
            0 0 40px rgba(167, 139, 250, 0.25);
          width: 90%;
          max-width: 420px;
          position: relative;
          overflow: hidden;
        }

        .dark .ai-config-modal {
          background: linear-gradient(135deg, rgba(30, 27, 46, 0.98) 0%, rgba(45, 38, 64, 0.98) 100%);
          border-color: rgba(167, 139, 250, 0.4);
          box-shadow:
            0 25px 80px rgba(167, 139, 250, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset,
            0 0 40px rgba(139, 92, 246, 0.2);
        }

        .ai-config-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(236, 72, 153, 0.12);
        }

        .dark .ai-config-header {
          border-color: rgba(167, 139, 250, 0.15);
        }

        .ai-config-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          font-weight: 600;
          color: #4A044E;
        }

        .dark .ai-config-title {
          color: #F9FAFB;
        }

        .ai-config-icon {
          color: #EC4899;
          filter: drop-shadow(0 2px 4px rgba(236, 72, 153, 0.2));
        }

        .dark .ai-config-icon {
          color: #A78BFA;
        }

        .ai-config-close {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: #9CA3AF;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-config-close:hover {
          background: rgba(236, 72, 153, 0.1);
          color: #EC4899;
          transform: rotate(90deg);
        }

        .dark .ai-config-close:hover {
          background: rgba(167, 139, 250, 0.15);
          color: #A78BFA;
        }

        .ai-config-body {
          padding: 20px;
        }

        .ai-config-description {
          margin-bottom: 16px;
        }

        .ai-config-description p {
          font-size: 13px;
          color: #4A044E;
          line-height: 1.5;
          margin: 0 0 6px 0;
        }

        .dark .ai-config-description p {
          color: #E5E7EB;
        }

        .ai-config-usage {
          background: rgba(236, 72, 153, 0.05);
          border-radius: 8px;
          padding: 10px 12px;
          margin: 10px 0;
          border-left: 3px solid rgba(236, 72, 153, 0.3);
        }

        .dark .ai-config-usage {
          background: rgba(167, 139, 250, 0.08);
          border-left-color: rgba(167, 139, 250, 0.4);
        }

        .ai-config-usage-title {
          font-size: 12px !important;
          font-weight: 600;
          color: #EC4899 !important;
          margin: 0 0 6px 0 !important;
        }

        .dark .ai-config-usage-title {
          color: #A78BFA !important;
        }

        .ai-config-usage-list {
          margin: 0;
          padding-left: 16px;
          font-size: 11px;
          color: #4B5563;
          line-height: 1.6;
        }

        .dark .ai-config-usage-list {
          color: #D1D5DB;
        }

        .ai-config-usage-list li {
          margin: 2px 0;
        }

        .ai-config-hint {
          font-size: 11px !important;
          color: #9CA3AF !important;
          margin-top: 8px !important;
        }

        .dark .ai-config-hint {
          color: #6B7280 !important;
        }

        .ai-config-input-group {
          margin-bottom: 4px;
        }

        .ai-config-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 600;
          color: #EC4899;
          margin-bottom: 8px;
        }

        .dark .ai-config-label {
          color: #A78BFA;
        }

        .ai-config-link {
          font-size: 12px;
          color: #A78BFA;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .ai-config-link:hover {
          color: #EC4899;
          text-decoration: underline;
        }

        .ai-config-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .ai-config-input {
          width: 100%;
          padding: 14px 44px 14px 16px;
          font-size: 14px;
          color: #1F2937;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(252, 231, 243, 0.5) 100%);
          border: 2px solid rgba(236, 72, 153, 0.2);
          border-radius: 16px;
          outline: none;
          transition: all 0.3s ease;
          font-family: 'Courier New', monospace;
        }

        .dark .ai-config-input {
          color: #F9FAFB;
          background: linear-gradient(135deg, rgba(30, 27, 46, 0.8) 0%, rgba(45, 38, 64, 0.5) 100%);
          border-color: rgba(167, 139, 250, 0.3);
        }

        .ai-config-input:focus {
          border-color: #EC4899;
          box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.15);
        }

        .dark .ai-config-input:focus {
          border-color: #A78BFA;
          box-shadow: 0 0 0 4px rgba(167, 139, 250, 0.15);
        }

        .ai-config-input::placeholder {
          color: #9CA3AF;
        }

        .ai-config-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 4px;
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }

        .ai-config-toggle:hover {
          opacity: 1;
        }

        .ai-config-success {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          margin-top: 16px;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 12px;
          color: #16A34A;
          font-size: 14px;
          font-weight: 600;
          animation: successPop 0.3s ease;
        }

        @keyframes successPop {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .ai-config-footer {
          display: flex;
          gap: 10px;
          padding: 16px 20px 20px;
          border-top: 1px solid rgba(236, 72, 153, 0.1);
        }

        .dark .ai-config-footer {
          border-color: rgba(167, 139, 250, 0.15);
        }

        .ai-config-btn {
          flex: 1;
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ai-config-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ai-config-btn-primary {
          background: linear-gradient(135deg, #EC4899 0%, #A78BFA 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
        }

        .ai-config-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
        }

        .ai-config-btn-secondary {
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%);
          color: #4A044E;
          border: 2px solid rgba(236, 72, 153, 0.2);
        }

        .dark .ai-config-btn-secondary {
          color: #F9FAFB;
          border-color: rgba(167, 139, 250, 0.3);
        }

        .ai-config-btn-secondary:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(167, 139, 250, 0.15) 100%);
          border-color: rgba(236, 72, 153, 0.3);
        }

      `}</style>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default AIConfigModal
