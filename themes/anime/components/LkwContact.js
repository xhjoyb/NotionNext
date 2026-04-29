import { useState } from 'react'

/**
 * 洛克王国世界 - 联系方式组件
 */
const LkwContact = () => {
  const [copied, setCopied] = useState('')

  const contacts = [
    {
      type: 'qq',
      label: 'QQ',
      value: '2812935383',
      icon: '💬',
      color: 'bg-blue-500'
    },
    {
      type: 'wechat',
      label: '微信',
      value: 'mcpq-cc',
      icon: '📱',
      color: 'bg-green-500'
    },
    {
      type: 'email',
      label: '邮箱',
      value: 'zqf@mcpq.cc',
      icon: '📧',
      color: 'bg-orange-500'
    }
  ]

  const handleCopy = (value, type) => {
    navigator.clipboard.writeText(value)
    setCopied(type)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div className="anime-glass rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
        <span className="mr-2">📞</span>
        联系客服
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {contacts.map((contact) => (
          <div
            key={contact.type}
            className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 text-center hover:shadow-md transition-all duration-300"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${contact.color} text-white text-xl mb-3`}>
              {contact.icon}
            </div>
            <h3 className="font-bold mb-1 dark:text-white">{contact.label}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{contact.value}</p>
            <button
              onClick={() => handleCopy(contact.value, contact.type)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                copied === contact.type
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
            >
              {copied === contact.type ? '已复制!' : '复制'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-4 text-center">
        <h3 className="font-bold text-lg mb-2 dark:text-white">⏰ 服务时间</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          每日 9:00 - 23:00 在线接单
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
          非工作时间下单，会在上班后第一时间处理
        </p>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 建议：下单前请先联系客服确认服务细节和当前排队情况
        </p>
      </div>
    </div>
  )
}

export default LkwContact
