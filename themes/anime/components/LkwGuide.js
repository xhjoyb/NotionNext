import { useState } from 'react'

/**
 * 洛克王国世界 - 异色代肝指南组件
 * 展示刷异色方法对比 - 展开式详情设计
 */
const LkwGuide = () => {
  const [expandedMethod, setExpandedMethod] = useState(null)

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

  const toggleExpand = (index) => {
    setExpandedMethod(expandedMethod === index ? null : index)
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
              className={`bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 hover:shadow-md transition-all duration-500 flex flex-col ${
                expandedMethod === index ? 'md:col-span-3' : ''
              }`}
            >
              {/* 基础信息 */}
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 dark:text-white">{method.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{method.description}</p>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-yellow-500">效率: {method.efficiency}</span>
                  <span className="text-blue-500">难度: {method.difficulty}</span>
                </div>
              </div>
              
              <button
                onClick={() => toggleExpand(index)}
                className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1"
              >
                <span>{expandedMethod === index ? '收起详情' : '查看详情'}</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${expandedMethod === index ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* 展开详情 */}
              <div className={`overflow-hidden transition-all duration-500 ${
                expandedMethod === index ? 'max-h-[500px] opacity-100 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700' : 'max-h-0 opacity-0'
              }`}>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* 操作步骤 */}
                  <div>
                    <h4 className="font-bold mb-3 dark:text-white flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 00-1-1H3zm6 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      操作步骤
                    </h4>
                    <div className="space-y-2">
                      {method.details.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                          <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">
                            {stepIndex + 1}
                          </span>
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 优缺点对比 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-bold mb-2 text-green-600 dark:text-green-400">优点</h4>
                      <div className="space-y-1">
                        {method.details.pros.map((pro, proIndex) => (
                          <div key={proIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 flex-shrink-0"></span>
                            {pro}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2 text-red-600 dark:text-red-400">缺点</h4>
                      <div className="space-y-1">
                        {method.details.cons.map((con, conIndex) => (
                          <div key={conIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2 flex-shrink-0"></span>
                            {con}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 小贴士 */}
                  <div>
                    <h4 className="font-bold mb-3 dark:text-white flex items-center gap-2">
                      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      小贴士
                    </h4>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">{method.details.tips}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LkwGuide