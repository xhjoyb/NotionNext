import { useState } from 'react'

/**
 * 洛克王国世界 - 异色代肝指南组件
 * 展示异色获取机制和流程
 */
const LkwGuide = () => {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      title: '触发噩梦枷锁',
      description: '连续捕捉同系/同家族精灵，会刷出发黑、带护盾的污染怪。',
      icon: '⚡',
      tips: ['连续抓同系精灵', '观察污染怪出现', '准备高级精灵球']
    },
    {
      title: '打破污染盾',
      description: '击败污染精灵，打破护盾，每次破盾=1次保底计数。',
      icon: '🛡️',
      tips: ['使用克制技能', '注意污染盾厚度', '破盾后正常捕捉']
    },
    {
      title: '累计保底计数',
      description: '同家族累计80次破盾，100%必出异色精灵。保底不清零、不重置。',
      icon: '📊',
      tips: ['保底跨家族独立计算', '每次破盾都有1.8%直接出异色', '75次后集中刷效率最高']
    },
    {
      title: '捕捉异色精灵',
      description: '遇到异色精灵后，用高级球/炫彩球捕捉。异色精灵头像颜色与普通不同。',
      icon: '✨',
      tips: ['准备充足的高级球', '异色头像颜色特殊', '提前加好友4小时以上']
    }
  ]

  const methods = [
    {
      name: '单系速刷法',
      description: '适合常驻异色，单系连续捕捉80次',
      efficiency: '⭐⭐⭐',
      difficulty: '简单'
    },
    {
      name: '3×3双系循环',
      description: '适合赛季限定，抓3只A系→3只B系循环',
      efficiency: '⭐⭐⭐⭐',
      difficulty: '中等'
    },
    {
      name: '果实加成法',
      description: '在庇护所放果实，大幅提高污染触发率',
      efficiency: '⭐⭐⭐⭐⭐',
      difficulty: '需要准备'
    }
  ]

  return (
    <div className="space-y-8">
      {/* 流程步骤 */}
      <div className="anime-glass rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
          <span className="mr-2">🗺️</span>
          异色获取流程
        </h2>
        
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeStep === index
                  ? 'anime-gradient-bg text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className="mr-1">{step.icon}</span>
              步骤{index + 1}
            </button>
          ))}
        </div>

        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl flex-shrink-0">{steps[activeStep].icon}</div>
            <div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">
                步骤 {activeStep + 1}: {steps[activeStep].title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {steps[activeStep].description}
              </p>
              <div className="space-y-2">
                {steps[activeStep].tips.map((tip, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2 flex-shrink-0"></span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

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
              className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 hover:shadow-md transition-all duration-300"
            >
              <h3 className="font-bold text-lg mb-2 dark:text-white">{method.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{method.description}</p>
              <div className="flex justify-between text-sm">
                <span className="text-yellow-500">效率: {method.efficiency}</span>
                <span className="text-blue-500">难度: {method.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 注意事项 */}
      <div className="anime-glass rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">
          <span className="mr-2">⚠️</span>
          重要注意事项
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
            <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">好友时间限制</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              双方需提前成为4小时以上好友才能去对方世界捕捉稀有精灵。稀有精灵存在时间已下调为4小时，一定要提前加好友！
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
            <h3 className="font-bold text-yellow-600 dark:text-yellow-400 mb-2">保底机制</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              保底按家族、系别分别计算，不同家族/系别连续捕捉计数独立。跨家族会重新计算保底次数。
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2">异色识别</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              进入战斗后观察精灵头像，异色款头像颜色与普通款不同。以恶魔狼为例，白色头像是异色款，黑色是污染款。
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
            <h3 className="font-bold text-green-600 dark:text-green-400 mb-2">果实加成</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              将果实放进眠枭庇护所，可大幅提高污染触发率，是3×3刷法的核心。抓20只普通目标精灵可在图鉴领取果实。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LkwGuide