import { useState } from 'react'

/**
 * 洛克王国世界 - 异色代肝指南组件
 * 游戏工作室风格，展示异色获取机制和流程
 */
const LkwGuide = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [activeMethod, setActiveMethod] = useState(0)

  const steps = [
    {
      title: '触发噩梦枷锁',
      description: '连续捕捉同系/同家族精灵，会刷出发黑、带护盾的污染怪。这是获取异色的前提条件。',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      tips: ['连续抓同系精灵', '观察污染怪出现', '准备高级精灵球'],
      color: 'from-purple-500 to-indigo-500'
    },
    {
      title: '打破污染盾',
      description: '击败污染精灵，打破护盾。每次破盾=1次保底计数，同时有1.8%概率直接出异色。',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      tips: ['使用克制技能', '注意污染盾厚度', '破盾后正常捕捉'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: '累计保底计数',
      description: '同家族累计80次破盾，100%必出异色精灵。保底不清零、不重置，跨家族独立计算。',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      tips: ['保底跨家族独立计算', '每次破盾都有1.8%直接出异色', '75次后集中刷效率最高'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: '捕捉异色精灵',
      description: '遇到异色精灵后，用高级球/炫彩球捕捉。异色精灵头像颜色与普通不同，注意观察。',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      tips: ['准备充足的高级球', '异色头像颜色特殊', '提前加好友4小时以上'],
      color: 'from-pink-500 to-rose-500'
    }
  ]

  const methods = [
    {
      name: '单系速刷法',
      description: '适合常驻异色，单系连续捕捉80次。操作简单，适合新手。',
      efficiency: '⭐⭐⭐',
      difficulty: '简单',
      steps: ['选择目标系别', '连续捕捉80次', '等待保底触发'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: '3×3双系循环',
      description: '适合赛季限定，抓3只A系→3只B系循环。效率更高，可同时刷两种异色。',
      efficiency: '⭐⭐⭐⭐',
      difficulty: '中等',
      steps: ['选择两个系别', '3只A系→3只B系循环', '监控保底进度'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: '果实加成法',
      description: '在庇护所放果实，大幅提高污染触发率。3×3刷法的核心加成手段。',
      efficiency: '⭐⭐⭐⭐⭐',
      difficulty: '需要准备',
      steps: ['获取果实（抓20只普通精灵）', '在庇护所放置果实', '享受加成效果'],
      color: 'from-amber-500 to-orange-500'
    }
  ]

  const warnings = [
    {
      title: '好友时间限制',
      content: '双方需提前成为4小时以上好友才能去对方世界捕捉稀有精灵。稀有精灵存在时间已下调为4小时，一定要提前加好友！',
      icon: '⏰',
      color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    },
    {
      title: '保底机制',
      content: '保底按家族、系别分别计算，不同家族/系别连续捕捉计数独立。跨家族会重新计算保底次数。',
      icon: '📊',
      color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
    },
    {
      title: '异色识别',
      content: '进入战斗后观察精灵头像，异色款头像颜色与普通款不同。以恶魔狼为例，白色头像是异色款，黑色是污染款。',
      icon: '👁️',
      color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
    },
    {
      title: '果实加成',
      content: '将果实放进眠枭庇护所，可大幅提高污染触发率，是3×3刷法的核心。抓20只普通目标精灵可在图鉴领取果实。',
      icon: '🍎',
      color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
    }
  ]

  return (
    <div className="space-y-16">
      {/* 流程步骤 */}
      <div>
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black mb-4 dark:text-white">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              异色获取流程
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            了解异色精灵的获取机制，掌握正确的刷取方法
          </p>
        </div>
        
        {/* 步骤导航 */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeStep === index
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <span className={`${activeStep === index ? 'text-white' : 'text-purple-500'}`}>
                {step.icon}
              </span>
              <span className="hidden sm:inline">步骤 {index + 1}</span>
            </button>
          ))}
        </div>

        {/* 步骤详情 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className={`h-1 bg-gradient-to-r ${steps[activeStep].color}`}></div>
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r ${steps[activeStep].color} flex items-center justify-center text-white`}>
                {steps[activeStep].icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 dark:text-white">
                  步骤 {activeStep + 1}: {steps[activeStep].title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {steps[activeStep].description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {steps[activeStep].tips.map((tip, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 刷法对比 */}
      <div>
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black mb-4 dark:text-white">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              刷异色方法对比
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            选择最适合你的刷异色方法
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {methods.map((method, index) => (
            <div
              key={index}
              onClick={() => setActiveMethod(index)}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl ${
                activeMethod === index 
                  ? 'border-purple-500 shadow-lg shadow-purple-500/10' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
              }`}
            >
              <div className={`h-1 bg-gradient-to-r ${method.color}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold dark:text-white">{method.name}</h3>
                  {activeMethod === index && (
                    <span className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{method.description}</p>
                
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <span className="text-yellow-500">效率: {method.efficiency}</span>
                  <span className="text-blue-500">难度: {method.difficulty}</span>
                </div>

                <div className="space-y-2">
                  {method.steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className={`w-5 h-5 rounded-full bg-gradient-to-r ${method.color} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                        {idx + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 注意事项 */}
      <div>
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black mb-4 dark:text-white">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              重要注意事项
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            了解这些规则，避免不必要的损失
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {warnings.map((warning, index) => (
            <div
              key={index}
              className={`${warning.color} rounded-xl p-5 border`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{warning.icon}</span>
                <div>
                  <h3 className="font-bold mb-1 dark:text-white">{warning.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{warning.content}</p>
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