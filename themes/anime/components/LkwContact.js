import { useState } from 'react'

/**
 * 洛克王国世界 - 联系方式组件
 * 游戏工作室风格，专业联系方式展示
 */
const LkwContact = () => {
  const [copied, setCopied] = useState('')

  const contacts = [
    {
      type: 'qq',
      label: 'QQ客服',
      value: '123456789',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      type: 'wechat',
      label: '微信客服',
      value: 'lkw_service',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      type: 'telegram',
      label: 'Telegram',
      value: '@lkw_service',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
        </svg>
      ),
      color: 'from-sky-500 to-sky-600',
      bgColor: 'bg-sky-50 dark:bg-sky-900/20',
      textColor: 'text-sky-600 dark:text-sky-400'
    }
  ]

  const handleCopy = (value, type) => {
    navigator.clipboard.writeText(value)
    setCopied(type)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div id="contact" className="space-y-8">
      {/* 标题 */}
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-black mb-4 dark:text-white">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            联系客服
          </span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          有任何问题？随时联系我们的客服团队
        </p>
      </div>

      {/* 联系方式卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <div
            key={contact.type}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
          >
            {/* 顶部渐变条 */}
            <div className={`h-1 bg-gradient-to-r ${contact.color}`}></div>
            
            <div className="p-6 text-center">
              {/* 图标 */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${contact.bgColor} ${contact.textColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {contact.icon}
              </div>
              
              {/* 标签 */}
              <h3 className="text-lg font-bold mb-1 dark:text-white">{contact.label}</h3>
              
              {/* 值 */}
              <p className="text-2xl font-black text-gray-900 dark:text-white mb-4 font-mono">
                {contact.value}
              </p>
              
              {/* 复制按钮 */}
              <button
                onClick={() => handleCopy(contact.value, contact.type)}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  copied === contact.type
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {copied === contact.type ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    已复制
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    复制
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 服务时间 */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-2">服务时间</h3>
        <p className="text-purple-100 text-lg mb-2">每日 9:00 - 23:00</p>
        <p className="text-purple-200 text-sm">
          非工作时间下单，会在上班后第一时间处理
        </p>
      </div>

      {/* 提示 */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-1">温馨提示</h4>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              建议下单前请先联系客服确认服务细节和当前排队情况。对于大额订单，我们支持分期付款和进度汇报。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LkwContact