import { useState } from 'react'

/**
 * 洛克王国世界 - 异色代肝指南组件
 * 展示刷异色方法对比
 */
const LkwGuide = () => {
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState(null)

  const methods = [
    {
      name: '单系速刷法',
      description: '适合常驻异色，单系连续捕捉80次',
      efficiency: '⭐⭐⭐',
      difficulty: '简单',
      details: {
        steps: [
          '选择一个目标精灵所在的系别',
          '在同一地点连续捕捉同系精灵',
          '每次捕捉都有概率触发噩梦枷锁',
          '累计80次保底必出异色',
          '适合时间充裕的玩家'
        ],
        pros: ['操作简单', '不需要频繁换地点', '适合新手'],
        cons: ['效率较低', '容易疲劳', '保底周期长'],
        tips: '建议选择精灵密度高的地点，如星霜崖地、维苏威火山等。'
      }
    },
    {
      name: '3×3双系循环',
      description: '适合赛季限定，抓3只A系→3只B系循环',
      efficiency: '⭐⭐⭐⭐',
      difficulty: '中等',
      details: {
        steps: [
          '选择两个不同系别的精灵地点',
          '在A地点捕捉3只A系精灵',
          '切换到B地点捕捉3只B系精灵',
          '循环往复，保持节奏',
          '利用跨系别触发提高噩梦枷锁概率'
        ],
        pros: ['效率较高', '触发噩梦枷锁概率提升', '适合赛季限定'],
        cons: ['需要频繁切换地点', '操作较复杂', '需要熟悉地图'],
        tips: '推荐搭配：星霜崖地(冰系) + 维苏威火山(火系)，或者洛克里安庇护所(恶魔系) + 望风半岛(水系)。'
      }
    },
    {
      name: '果实加成法',
      description: '在庇护所放果实，大幅提高污染触发率',
      efficiency: '⭐⭐⭐⭐⭐',
      difficulty: '需要准备',
      details: {
        steps: [
          '先在图鉴中捕捉20只普通目标精灵',
          '领取图鉴奖励的果实',
          '将果实放置在眠枭庇护所',
          '在庇护所附近捕捉精灵',
          '享受果实加成的高触发率'
        ],
        pros: ['触发率大幅提升', '效率最高', '节省时间'],
        cons: ['需要前置准备', '果实数量有限', '需要解锁庇护所'],
        tips: '优先对稀有或赛季限定精灵使用果实，最大化收益。'
      }
    }
  ]

  const handleViewDetail = (method) => {
    setSelectedMethod(method)
    setShowDetailModal(true)
  }

  return (
    <div className="space-y-8">
      {/* 刷法对比 */}
      <div className="anime-glass rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
          <span className="mr-2">⚔️</span>
          刷异色方法对比
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {methods.map((method, index) => (
            <div
              key={index}
              className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <h3 className="font-bold text-lg mb-2 dark:text-white">{method.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 flex-grow">{method.description}</p>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-yellow-500">效率: {method.efficiency}</span>
                <span className="text-blue-500">难度: {method.difficulty}</span>
              </div>
              <button
                onClick={() => handleViewDetail(method)}
                className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                查看详情
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 详情模态框 */}
      {showDetailModal && selectedMethod && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="anime-glass rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold dark:text-white">{selectedMethod.name}</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedMethod.description}</p>
            
            <div className="flex gap-4 mb-4 text-sm">
              <span className="text-yellow-500">效率: {selectedMethod.efficiency}</span>
              <span className="text-blue-500">难度: {selectedMethod.difficulty}</span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold mb-2 dark:text-white">操作步骤</h4>
                <div className="space-y-2">
                  {selectedMethod.details.steps.map((step, index) => (
                    <div key={index} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                      <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">
                        {index + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold mb-2 text-green-600 dark:text-green-400">优点</h4>
                  <div className="space-y-1">
                    {selectedMethod.details.pros.map((pro, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 flex-shrink-0"></span>
                        {pro}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold mb-2 text-red-600 dark:text-red-400">缺点</h4>
                  <div className="space-y-1">
                    {selectedMethod.details.cons.map((con, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2 flex-shrink-0"></span>
                        {con}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                <h4 className="font-bold mb-1 text-purple-600 dark:text-purple-400">小贴士</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{selectedMethod.details.tips}</p>
              </div>
            </div>

            <button
              onClick={() => setShowDetailModal(false)}
              className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300"
            >
              知道了
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LkwGuide